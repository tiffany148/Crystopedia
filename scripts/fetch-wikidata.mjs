// Pull mineral species, mineral varieties and gemstones from Wikidata (CC0)
// and write a cleaned, sanity-checked dataset to data/minerals.json.
// Usage: node scripts/fetch-wikidata.mjs   (raw query results cached in data/raw/)
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const RAW = path.join(ROOT, "data", "raw");
const OUT = path.join(ROOT, "data", "minerals.json");
const ENDPOINT = "https://query.wikidata.org/sparql";
const UA = "CrystopediaBuild/1.0 (https://tiffany148.github.io/; static site generator)";
const USE_CACHE = !process.argv.includes("--refresh");

const SPECIES = "wd:Q12089225";   // mineral species
const VARIETY = "wd:Q429795";     // mineral variety
const GEMSTONE = "wd:Q83437";     // gemstone

// Every item we care about
const SCOPE = `{ ?m wdt:P31 ${SPECIES} } UNION { ?m wdt:P31 ${VARIETY} } UNION { ?m wdt:P31 ${GEMSTONE} } UNION { ?m wdt:P279 ${GEMSTONE} }`;
const lbl = (v) => `?${v} rdfs:label ?${v}L FILTER(lang(?${v}L)="en")`;

// Simple per-type patterns are far faster on WDQS than one big UNION subquery.
const SCOPES = {
  sp: `?m wdt:P31 ${SPECIES} .`,
  va: `?m wdt:P31 ${VARIETY} .`,
  gi: `?m wdt:P31 ${GEMSTONE} .`,
  gs: `?m wdt:P279 ${GEMSTONE} .`,
};
const QUERIES = {
  species: () => `SELECT DISTINCT ?m WHERE { ?m wdt:P31 ${SPECIES} }`,
  varieties: () => `SELECT DISTINCT ?m WHERE { ?m wdt:P31 ${VARIETY} }`,
  gems: () => `SELECT DISTINCT ?m WHERE { { ?m wdt:P31 ${GEMSTONE} } UNION { ?m wdt:P279 ${GEMSTONE} } }`,
  labels: (S) => `SELECT ?m ?label ?desc WHERE { ${S} OPTIONAL { ?m rdfs:label ?label FILTER(lang(?label)="en") } OPTIONAL { ?m schema:description ?desc FILTER(lang(?desc)="en") } }`,
  enwiki: (S) => `SELECT ?m ?article WHERE { ${S} ?article schema:about ?m ; schema:isPartOf <https://en.wikipedia.org/> }`,
  formula: (S) => `SELECT ?m ?v WHERE { ${S} ?m wdt:P274 ?v }`,
  crystal: (S) => `SELECT ?m ?vL WHERE { ${S} ?m wdt:P556 ?v . ${lbl("v")} }`,
  mohs: (S) => `SELECT ?m ?amt ?lo ?hi WHERE { ${S} ?m p:P1088/psv:P1088 ?q . ?q wikibase:quantityAmount ?amt . OPTIONAL { ?q wikibase:quantityLowerBound ?lo } OPTIONAL { ?q wikibase:quantityUpperBound ?hi } }`,
  density: (S) => `SELECT ?m ?amt ?lo ?hi ?unit WHERE { ${S} ?m p:P2054/psv:P2054 ?q . ?q wikibase:quantityAmount ?amt ; wikibase:quantityUnit ?unit . OPTIONAL { ?q wikibase:quantityLowerBound ?lo } OPTIONAL { ?q wikibase:quantityUpperBound ?hi } }`,
  streak: (S) => `SELECT ?m ?vL WHERE { ${S} ?m wdt:P534 ?v . ${lbl("v")} }`,
  color: (S) => `SELECT ?m ?vL WHERE { ${S} ?m wdt:P462 ?v . ${lbl("v")} }`,
  cleavage: (S) => `SELECT ?m ?vL WHERE { ${S} ?m wdt:P693 ?v . ${lbl("v")} }`,
  fracture: (S) => `SELECT ?m ?vL WHERE { ${S} ?m wdt:P538 ?v . ${lbl("v")} }`,
  characteristic: (S) => `SELECT ?m ?vL WHERE { ${S} ?m wdt:P1552 ?v . ${lbl("v")} }`,
  image: (S) => `SELECT ?m ?v WHERE { ${S} ?m wdt:P18 ?v }`,
  mindat: (S) => `SELECT ?m ?v WHERE { ${S} ?m wdt:P6263 ?v }`,
  imaSymbol: (S) => `SELECT ?m ?v WHERE { ${S} ?m wdt:P10113 ?v }`,
  strunz: (S) => `SELECT ?m ?v WHERE { ${S} ?m wdt:P713 ?v }`,
  // type locality (P189) with coordinates and country
  typeLoc: (S) => `SELECT ?m ?loc ?locL ?coord ?cL WHERE { ${S} ?m (wdt:P2695|wdt:P189) ?loc . OPTIONAL { ?loc rdfs:label ?locL FILTER(lang(?locL)="en") } OPTIONAL { ?loc wdt:P625 ?coord } OPTIONAL { ?loc wdt:P17 ?c . ?c rdfs:label ?cL FILTER(lang(?cL)="en") } }`,
  // type locality: P2695 (geology) or P189 (location of discovery). Country of origin (P495) with the country's centre coordinates
  origin: (S) => `SELECT ?m ?cL ?coord WHERE { ${S} ?m wdt:P495 ?c . ?c rdfs:label ?cL FILTER(lang(?cL)="en") OPTIONAL { ?c wdt:P625 ?coord } }`,
  // parent links: subclass of (P279) a species or variety
  parent: (S) => `SELECT ?m ?p WHERE { ${S} ?m wdt:P279 ?p . { ?p wdt:P31 ${SPECIES} } UNION { ?p wdt:P31 ${VARIETY} } }`,
};
const GLOBAL = new Set(["species", "varieties", "gems"]);

// Items referenced by the hand-curated metaphysical file (rocks, organics, groups...)
import crypto from "node:crypto";
const META = JSON.parse(await fs.readFile(path.join(ROOT, "data", "metaphysical.json"), "utf8"));
const EXTRA_IDS = [...new Set(META.flatMap((m) => [m.wikidata, m.parent]).filter(Boolean))];
const EXTRA_HASH = crypto.createHash("md5").update(EXTRA_IDS.join(",")).digest("hex").slice(0, 6);
SCOPES["mx" + EXTRA_HASH] = `VALUES ?m { ${EXTRA_IDS.map((q) => "wd:" + q).join(" ")} }`;
// Wikidata items typed "gemstone" are mostly museum objects/concepts; keep only these real materials
const GEM_ALLOW = new Set(["ammolite", "jade", "maw sit sit", "eilat stone", "precious opal", "golden beryl", "derbyshire blue john", "azurite-malachite", "star garnet", "cat's eye", "trapiche crystal", "taiwan jade"]);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function sparql(name, query) {
  const file = path.join(RAW, `${name}.json`);
  if (USE_CACHE) {
    try { return JSON.parse(await fs.readFile(file, "utf8")); } catch {}
  }
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "User-Agent": UA, Accept: "application/sparql-results+json", "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ query }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
      const rows = (await res.json()).results.bindings.map((b) =>
        Object.fromEntries(Object.entries(b).map(([k, v]) => [k, v.value])));
      await fs.writeFile(file, JSON.stringify(rows));
      console.log(`  ${name}: ${rows.length} rows`);
      return rows;
    } catch (e) {
      console.warn(`  ${name} attempt ${attempt} failed: ${e.message}`);
      await sleep(3000 * attempt);
    }
  }
  throw new Error(`Query ${name} failed`);
}

const qid = (uri) => uri.replace("http://www.wikidata.org/entity/", "");
const uniq = (a) => [...new Set(a.filter(Boolean))];
const num = (s) => (s === undefined || s === null || s === "" ? null : Number(s));
const round = (x, d = 3) => (x == null ? null : Math.round(x * 10 ** d) / 10 ** d);

// --- normalisers / sanity checks -------------------------------------------------
const SYSTEMS = [
  ["cubic", /cubic|isometric/i], ["tetragonal", /tetragonal/i], ["orthorhombic", /orthorhombic/i],
  ["hexagonal", /hexagonal/i], ["trigonal", /trigonal|rhombohedral/i], ["monoclinic", /monoclinic/i],
  ["triclinic", /triclinic/i], ["amorphous", /amorphous/i],
];
function normSystem(label) {
  for (const [name, re] of SYSTEMS) if (re.test(label)) return name;
  return null;
}
const SUB = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9" };
const ELEMENTS = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu".split(" ");
const ELSET = new Set(ELEMENTS);
function elementsOf(formula) {
  if (!formula) return [];
  const plain = formula.replace(/[₀-₉]/g, (c) => SUB[c]);
  return uniq([...plain.matchAll(/[A-Z][a-z]?/g)].map((m) => m[0]).filter((e) => ELSET.has(e)));
}
// elements that commonly give a coloured/dark streak
const CHROMOPHORES = new Set("Fe Mn Cu Co Ni Cr V Ti Pb Ag Au Bi Sb As S Se Te Mo W U Hg C Pt Pd Os Ir Ru Rh Sn Tl Zn Cd Nb Ta Ce Nd".split(" "));
const DARK_STREAK = /black|grey|gray|brown|red|green|blue|yellow|orange/i;

const issues = [];
const flag = (id, name, field, msg) => issues.push({ id, name, field, msg });

// Density units (Wikidata unit QIDs)
const UNIT_FACTORS = {
  Q13147228: 1,        // gram per cubic centimetre
  Q844211: 0.001,      // kilogram per cubic metre
  Q834105: 0.001,      // gram per litre
  Q21604951: 0.000001, // gram per cubic metre (almost always a mis-entered unit -> will fail range check)
  Q199: 1,             // "1" (unitless) - assume specific gravity
};

async function main() {
  await fs.mkdir(RAW, { recursive: true });
  const r = {};
  for (const [name, q] of Object.entries(QUERIES)) {
    if (GLOBAL.has(name)) { r[name] = await sparql(name, q()); continue; }
    r[name] = [];
    for (const [sk, S] of Object.entries(SCOPES)) {
      if (name === "parent" && sk === "sp") continue;
      r[name].push(...(await sparql(`${name}-${sk}`, q(S))));
    }
  }

  const items = new Map();
  const get = (id) => {
    if (!items.has(id)) items.set(id, { id, types: new Set() });
    return items.get(id);
  };
  r.species.forEach((x) => get(qid(x.m)).types.add("species"));
  r.varieties.forEach((x) => get(qid(x.m)).types.add("variety"));
  r.gems.forEach((x) => get(qid(x.m)).types.add("gem"));
  EXTRA_IDS.forEach((id) => get(id).types.add("extra"));

  const multi = (rows, key, val = "vL") => rows.forEach((x) => {
    const it = items.get(qid(x.m)); if (!it) return;
    (it[key] ||= []).push(x[val]);
  });
  r.labels.forEach((x) => { const it = items.get(qid(x.m)); if (it) { it.name ||= x.label; it.description ||= x.desc; } });
  r.enwiki.forEach((x) => { const it = items.get(qid(x.m)); if (it) it.enwiki ||= x.article; });
  multi(r.formula, "formulas", "v");
  multi(r.crystal, "crystalRaw");
  multi(r.streak, "streakRaw");
  multi(r.color, "color");
  multi(r.cleavage, "cleavage");
  multi(r.fracture, "fracture");
  multi(r.characteristic, "characteristic");
  multi(r.image, "images", "v");
  multi(r.mindat, "mindatIds", "v");
  multi(r.imaSymbol, "imaSymbols", "v");
  multi(r.strunz, "strunzIds", "v");
  r.mohs.forEach((x) => { const it = items.get(qid(x.m)); if (it) (it.mohsRaw ||= []).push(x); });
  r.density.forEach((x) => { const it = items.get(qid(x.m)); if (it) (it.densityRaw ||= []).push(x); });
  const pt = (wkt) => { const m = /Point\(([-\d.eE]+) ([-\d.eE]+)\)/.exec(wkt || ""); return m ? [round(+m[2], 4), round(+m[1], 4)] : null; };
  r.typeLoc.forEach((x) => { const it = items.get(qid(x.m)); if (!it) return; const c = pt(x.coord);
    (it.typeLoc ||= []).push({ name: x.locL || null, country: x.cL || null, lat: c?.[0] ?? null, lon: c?.[1] ?? null }); });
  r.origin.forEach((x) => { const it = items.get(qid(x.m)); if (!it) return; const c = pt(x.coord);
    if (c) (it.origins ||= []).push({ name: x.cL, lat: c[0], lon: c[1] }); });
  r.parent.forEach((x) => { const it = items.get(qid(x.m)); if (it) (it.parentIds ||= []).push(qid(x.p)); });

  const out = [];
  for (const it of items.values()) {
    if (!it.types.has("species") && !it.types.has("variety") && !it.types.has("extra") &&
        !GEM_ALLOW.has((it.name || "").toLowerCase())) continue;
    if (!it.name) { flag(it.id, null, "name", "no English label – skipped"); continue; }
    const name = it.name;
    const rec = {
      id: it.id,
      name,
      type: it.types.has("species") ? "species" : it.types.has("variety") ? "variety" : it.types.has("gem") ? "gem" : "other",
      isGem: it.types.has("gem"),
      description: it.description || null,
      formula: uniq(it.formulas || [])[0] || null,
    };
    rec.elements = elementsOf(rec.formula);

    // crystal system
    const sys = uniq((it.crystalRaw || []).map(normSystem));
    const unknownSys = uniq(it.crystalRaw || []).filter((l) => !normSystem(l));
    if (unknownSys.length) flag(it.id, name, "crystalSystem", `unrecognised value(s) dropped: ${unknownSys.join(", ")}`);
    rec.crystalSystems = sys;

    // Mohs hardness: must lie within 1–10
    let lo = null, hi = null;
    for (const m of it.mohsRaw || []) {
      const vals = [num(m.amt), num(m.lo), num(m.hi)].filter((v) => v != null);
      for (const v of vals) {
        if (v < 1 || v > 10) { flag(it.id, name, "mohs", `out-of-range value ${v} dropped`); continue; }
        lo = lo == null ? v : Math.min(lo, v);
        hi = hi == null ? v : Math.max(hi, v);
      }
    }
    rec.mohsMin = round(lo, 2); rec.mohsMax = round(hi, 2);

    // Density -> g/cm3, plausible range 0.5–23 (osmium ~22.6)
    let dlo = null, dhi = null;
    for (const d of it.densityRaw || []) {
      const unit = qid(d.unit);
      let f = UNIT_FACTORS[unit];
      if (f === undefined) { flag(it.id, name, "density", `unknown unit ${unit}; value ${d.amt} dropped`); continue; }
      for (const raw of [num(d.amt), num(d.lo), num(d.hi)].filter((v) => v != null)) {
        let g = raw * f;
        if (unit === "Q199" && g > 500) { g = g / 1000; flag(it.id, name, "density", `unitless ${raw} looked like kg/m³ – converted to ${round(g)} g/cm³`); }
        if (g < 0.5 || g > 23) { flag(it.id, name, "density", `implausible ${raw} (${unit}) → ${round(g)} g/cm³ dropped`); continue; }
        if (f !== 1) flag(it.id, name, "density", `converted ${raw} kg/m³-type unit (${unit}) → ${round(g)} g/cm³`);
        dlo = dlo == null ? g : Math.min(dlo, g);
        dhi = dhi == null ? g : Math.max(dhi, g);
      }
    }
    rec.densityMin = round(dlo); rec.densityMax = round(dhi);

    // Streak: drop dark/coloured streaks for formulas with no chromophore elements
    let streak = uniq(it.streakRaw || []);
    if (streak.length && rec.elements.length && !rec.elements.some((e) => CHROMOPHORES.has(e))) {
      const bad = streak.filter((s) => DARK_STREAK.test(s) && !/white|colou?rless/i.test(s));
      if (bad.length) {
        flag(it.id, name, "streak", `"${bad.join(", ")}" implausible for ${rec.formula} (no chromophore elements) – dropped`);
        streak = streak.filter((s) => !bad.includes(s));
      }
    }
    rec.streak = streak;
    rec.colors = uniq(it.color || []);
    rec.cleavage = uniq(it.cleavage || []);
    rec.fracture = uniq(it.fracture || []);
    rec.luster = uniq(it.characteristic || []).filter((c) => /lust(re|er)/i.test(c));

    const img = (it.images || [])[0];
    rec.image = img ? decodeURIComponent(img.split("Special:FilePath/")[1] || "").replace(/_/g, " ") || null : null;
    rec.enwiki = it.enwiki || null;
    rec.mindatId = uniq(it.mindatIds || [])[0] || null;
    rec.imaSymbol = uniq(it.imaSymbols || [])[0] || null;
    rec.strunz = uniq(it.strunzIds || [])[0] || null;
    rec.parentIds = uniq(it.parentIds || []).filter((p) => p !== it.id);
    const seenLoc = new Set();
    rec.typeLocalities = (it.typeLoc || []).filter((l) => { const k = `${l.name}|${l.lat}`; if (seenLoc.has(k)) return false; seenLoc.add(k); return true; }).slice(0, 5);
    rec.origins = uniq((it.origins || []).map((o) => JSON.stringify(o))).map((o) => JSON.parse(o)).slice(0, 6);
    out.push(rec);
  }

  // slugs (unique, lowercase ascii)
  const slugify = (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "item";
  const seen = new Map();
  out.sort((a, b) => (a.type === "species" ? 0 : 1) - (b.type === "species" ? 0 : 1) || a.name.localeCompare(b.name));
  for (const rec of out) {
    let s = slugify(rec.name);
    if (seen.has(s)) { s = `${s}-${rec.id.toLowerCase()}`; }
    seen.set(s, rec.id); rec.slug = s;
  }
  const byId = new Map(out.map((x) => [x.id, x]));
  for (const rec of out) {
    rec.parentIds = rec.parentIds.filter((p) => byId.has(p));
    for (const p of rec.parentIds) (byId.get(p).childIds ||= []).push(rec.id);
  }
  out.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

  await fs.writeFile(OUT, JSON.stringify(out, null, 1));
  await fs.writeFile(path.join(ROOT, "data", "issues.json"), JSON.stringify(issues, null, 1));
  const c = (f) => out.filter(f).length;
  console.log(`\nWrote ${out.length} records: species ${c((x) => x.type === "species")}, varieties ${c((x) => x.type === "variety")}, gem-only ${c((x) => x.type === "gem")}, other (from metaphysical list) ${c((x) => x.type === "other")}, flagged as gem ${c((x) => x.isGem)}`);
  console.log(`Locations: type locality ${c((x) => x.typeLocalities.length)} (with coords ${c((x) => x.typeLocalities.some((l) => l.lat != null))}), country of origin ${c((x) => x.origins.length)}`);
  console.log(`Coverage: formula ${c((x) => x.formula)}, crystal system ${c((x) => x.crystalSystems.length)}, Mohs ${c((x) => x.mohsMin != null)}, density ${c((x) => x.densityMin != null)}, streak ${c((x) => x.streak.length)}, color ${c((x) => x.colors.length)}, luster ${c((x) => x.luster.length)}, image ${c((x) => x.image)}, enwiki ${c((x) => x.enwiki)}, mindat ${c((x) => x.mindatId)}`);
  const byField = {}; issues.forEach((i) => (byField[i.field] = (byField[i.field] || 0) + 1));
  console.log("Issues by field:", byField);
}
main().catch((e) => { console.error(e); process.exit(1); });
