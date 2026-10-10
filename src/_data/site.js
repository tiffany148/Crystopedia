// Builds every collection the templates need from data/minerals.json + data/metaphysical.json
import { patternFor } from "../../lib/patterns.js";
import fs from "node:fs";
import path from "node:path";
import { pickColor, paletteFor, CURATED, MULTI } from "../../lib/palette.js";
const MULTI_HAS = (p) => !!MULTI[(p.metaphysical[0]?.name || p.name).toLowerCase()];
import { FACTS, EXTRA_COLORS, FOSSIL_GROUP } from "../../lib/collectibles.js";
import { LOCALITIES } from "../../lib/localities.js";
import { ARK_SITES, ARK_SECTIONS, ARK_TIPS, ARK_LOCS, ARK_SOURCES } from "../../lib/arkansas.js";
import { UV, UV_SAFETY } from "../../lib/uv.js";
import { HAZARDS, HAZARD_ICONS, HAZARD_GROUPS, ELIXIR_NOTES, ELIXIR_DEFAULT } from "../../lib/hazards.js";
import { FAMILIES, familiesFromWords, familyOfHex, GROUP } from "../../lib/colors.js";
import { CURATED_ID } from "../../lib/identify-curated.js";
import { buildPairings, INTENTIONS } from "../../lib/pairings.js";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const minerals = JSON.parse(fs.readFileSync(path.join(ROOT, "data/minerals.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, "data/metaphysical.json"), "utf8"));
const wcPath = path.join(ROOT, "data/wiki_colors.json");
const WIKI_COLORS = fs.existsSync(wcPath) ? JSON.parse(fs.readFileSync(wcPath, "utf8")) : {};
const imgPath = path.join(ROOT, "data/commons_images.json");
const HAND_IMAGES = fs.existsSync(imgPath) ? JSON.parse(fs.readFileSync(imgPath, "utf8")) : {};
for (const [k, v] of Object.entries(EXTRA_COLORS)) CURATED[k.trim()] ||= v;

const CHAKRAS = ["Root", "Sacral", "Solar Plexus", "Heart", "Throat", "Third Eye", "Crown"];
const SYSTEM_ORDER = ["cubic", "tetragonal", "orthorhombic", "hexagonal", "trigonal", "monoclinic", "triclinic", "amorphous"];
const SYSTEM_INFO = {
  cubic: "Three equal axes at right angles – the most symmetrical system (also called isometric). Think pyrite cubes, garnet dodecahedra and diamond octahedra.",
  tetragonal: "Two equal axes and a third of different length, all at right angles. Zircon, rutile and wulfenite crystallise here.",
  orthorhombic: "Three unequal axes at right angles. Topaz, olivine, aragonite and barite are orthorhombic.",
  hexagonal: "Six-fold symmetry around one axis. Beryl (emerald, aquamarine) forms classic hexagonal prisms.",
  trigonal: "Three-fold symmetry around one axis (part of the hexagonal crystal family). Quartz, calcite, corundum and tourmaline are trigonal.",
  monoclinic: "Three unequal axes, one oblique angle. Gypsum, orthoclase, malachite and azurite are monoclinic.",
  triclinic: "Three unequal axes, no right angles – the least symmetrical system. Kyanite, labradorite and turquoise are triclinic.",
  amorphous: "No ordered crystal lattice at all – e.g. natural glasses and some mineraloids.",
};
const GEM_SPECIES = new Set(["diamond", "corundum", "beryl", "topaz", "spinel", "zircon", "chrysoberyl", "opal", "turquoise", "jadeite", "forsterite", "tanzanite", "benitoite", "sphalerite", "titanite", "cordierite", "spodumene", "pyrope", "almandine", "spessartine", "grossular", "andradite", "elbaite", "dravite", "malachite", "rhodochrosite", "lazurite", "sodalite", "tourmalines", "garnet group", "amber", "pearl", "moldavite", "obsidian", "lapis lazuli"]);

const slugify = (s) => s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const fmtRange = (a, b, d = 2) => (a == null ? null : a === b || b == null ? `${+a.toFixed(d)}` : `${+a.toFixed(d)} – ${+b.toFixed(d)}`);
const commons = (file, w = 480) => file ? {
  src: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${w}`,
  credit: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`,
  file,
} : null;
// buckets "1–2" … "9–10" (10 folded into 9–10 so the filter list sorts correctly)
const hardnessBucket = (h) => { if (h == null) return null; const f = Math.min(Math.floor(h), 9); return `${f}–${f + 1}`; };

// --- pages from Wikidata -------------------------------------------------------
const pages = [];
const byId = new Map();
const usedSlugs = new Set();
for (const m of minerals) {
  const p = {
    ...m,
    title: cap(m.name),
    url: `/minerals/${m.slug}/`,
    img: commons(m.image),
    thumb: commons(m.image, 240),
    mohs: fmtRange(m.mohsMin, m.mohsMax, 2),
    density: fmtRange(m.densityMin, m.densityMax, 3),
    hardnessBucket: hardnessBucket(m.mohsMin),
    mindatUrl: m.mindatId ? `https://www.mindat.org/min-${m.mindatId}.html` : `https://www.mindat.org/search.php?search=${encodeURIComponent(m.name)}`,
    wikidataUrl: `https://www.wikidata.org/wiki/${m.id}`,
    metaphysical: [],
    handmade: false,
  };
  pages.push(p); byId.set(m.id, p); usedSlugs.add(m.slug);
}

// --- metaphysical entries: attach or create hand-made pages ------------------------
const KIND_LABEL = { mineral: "Mineral", variety: "Mineral variety", rock: "Rock", group: "Mineral group", organic: "Organic gem", mineraloid: "Mineraloid", glass: "Natural glass", fossil: "Fossil", geode: "Geode / nodule", other: "Other" };
const LABEL_OVERRIDE = { "Goldstone": "Man-made glass", "Shiva Lingam": "Rock", "Mother of Pearl": "Organic gem" };
const healing = [];
for (const e of meta) {
  let page = e.wikidata ? byId.get(e.wikidata) : null;
  if (!page) {
    let slug = slugify(e.name);
    if (usedSlugs.has(slug)) slug += "-stone";
    usedSlugs.add(slug);
    page = {
      id: null, name: e.name, title: e.name, slug, url: `/minerals/${slug}/`, type: "handmade", handmade: true,
      description: null, formula: null, elements: [], crystalSystems: [], streak: [], colors: [], cleavage: [], fracture: [], luster: [],
      parentIds: e.parent ? [e.parent] : [], metaphysical: [], img: commons(HAND_IMAGES[e.name]), thumb: commons(HAND_IMAGES[e.name], 240),
      mindatUrl: `https://www.mindat.org/search.php?search=${encodeURIComponent(e.name)}`,
    };
    // inherit the picture from its parent so the card isn't empty
    pages.push(page);
    if (e.parent && byId.get(e.parent)) (byId.get(e.parent).childIds ||= []).push(`hand:${slug}`);
    byId.set(`hand:${slug}`, page);
  }
  page.metaphysical.push(e);
  page.kindLabel ||= LABEL_OVERRIDE[e.name] || KIND_LABEL[e.kind] || null;
  if (FACTS[e.name]) page.facts ||= { name: e.name, ...FACTS[e.name] };
  if (!page.collection && (e.kind === "fossil" || e.kind === "geode")) page.collection = e.kind;
  if (FACTS[e.name]?.cat === "fossil" || FACTS[e.name]?.cat === "geode") page.collection ||= FACTS[e.name].cat;
  if (FOSSIL_GROUP[e.name]) page.fossilGroup ||= FOSSIL_GROUP[e.name];
  if (LOCALITIES[e.name]) (page.notable ||= []).push(...LOCALITIES[e.name]);
  healing.push({ ...e, page, url: page.url, thumb: page.thumb || (page.parentIds[0] && byId.get(page.parentIds[0])?.thumb) || null });
}

// --- UV-reactive stones: attach data, create hand-made pages where needed -----------
{
  const byName = new Map(pages.map((p) => [p.name.toLowerCase(), p]));
  for (const u of UV) {
    let page = byName.get(u.name.toLowerCase());
    if (!page && u.handmade) {
      let slug = slugify(u.name);
      if (usedSlugs.has(slug)) slug += "-stone";
      usedSlugs.add(slug);
      const h = u.handmade;
      page = {
        id: null, name: u.name, title: u.name, slug, url: `/minerals/${slug}/`, type: "handmade", handmade: true, kindLabel: h.kind,
        description: null, formula: null, elements: [], crystalSystems: [], streak: [], colors: [], cleavage: [], fracture: [], luster: [],
        parentIds: h.parent ? [h.parent] : [], metaphysical: [], img: commons(h.img), thumb: commons(h.img, 240),
        mindatUrl: `https://www.mindat.org/search.php?search=${encodeURIComponent(u.name)}`,
      };
      pages.push(page); byId.set(`hand:${slug}`, page); byName.set(u.name.toLowerCase(), page);
      if (h.parent && byId.get(h.parent)) (byId.get(h.parent).childIds ||= []).push(`hand:${slug}`);
    }
    if (!page) { console.warn("UV: no page for", u.name); continue; }
    if (u.handmade?.facts) page.facts ||= { name: u.name, ...u.handmade.facts };
    if (u.localities) (page.notable ||= []).push(...u.localities);
    const waves = [u.lw && "Longwave", u.mw && "Midwave", u.sw && "Shortwave", u.ph && !/^none/i.test(u.ph) && "Phosphorescent", u.tb && "Tenebrescent"].filter(Boolean);
    page.uv = { glow: u.glow, lw: u.lw, mw: u.mw, sw: u.sw, ph: u.ph, tb: u.tb, note: u.note, waves, uvImg: commons(u.uvImg, 480),
      sources: u.src.map(([t, url]) => ({ t, url })) };
  }
}

// resolve relations to {title,url}
for (const p of pages) {
  p.parents = (p.parentIds || []).map((id) => byId.get(id)).filter(Boolean).map((x) => ({ title: x.title, url: x.url }));
  p.children = [...new Set(p.childIds || [])].map((id) => byId.get(id)).filter(Boolean)
    .map((x) => ({ title: x.title, url: x.url })).sort((a, b) => a.title.localeCompare(b.title));
  if (!p.img && p.handmade && p.parentIds[0]) p.parentImg = byId.get(p.parentIds[0])?.img || null;
  p.typeLabel = p.kindLabel && (p.type === "other" || p.type === "handmade") ? p.kindLabel
    : { species: "IMA mineral species", variety: "Mineral variety", gem: "Gem material", other: "Mineral material", handmade: "Trade name / variety" }[p.type];
  p.chakras = [...new Set(p.metaphysical.flatMap((m) => m.chakras))];
}
for (const [n, list] of Object.entries(ARK_LOCS)) {
  const p = pages.find((x) => x.title.toLowerCase() === n.toLowerCase());
  if (!p) { console.warn("ARK_LOCS: no page for", n); continue; }
  (p.notable ||= []).push(...list);
}
// --- "Where it's found" map points ---------------------------------------------------
const mapStats = { pages: 0, typeLoc: 0, origin: 0, notable: 0, typeLocNoCoords: 0 };
for (const p of pages) {
  const pts = [];
  const seen = new Set();
  const add = (k, name, lat, lon) => {
    if (lat == null || lon == null || !isFinite(lat) || !isFinite(lon)) return;
    const key = `${k}|${(+lat).toFixed(1)}|${(+lon).toFixed(1)}`;
    if (seen.has(key)) return; seen.add(key);
    pts.push({ k, n: name, la: +(+lat).toFixed(3), lo: +(+lon).toFixed(3) });
  };
  for (const t of p.typeLocalities || []) add("t", [t.name, t.country].filter(Boolean).join(", "), t.lat, t.lon);
  for (const [n, la, lo] of p.notable || []) add("n", n, la, lo);
  if (!pts.length) for (const o of p.origins || []) add("o", o.name, o.lat, o.lon);
  p.typeLocText = (p.typeLocalities || []).map((t) => [t.name, t.country].filter((x, i, a) => x && a.indexOf(x) === i).join(", ")).filter(Boolean);
  if ((p.typeLocalities || []).length && !(p.typeLocalities || []).some((t) => t.lat != null)) mapStats.typeLocNoCoords++;
  p.mapPoints = pts.length ? JSON.stringify(pts).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;") : null;
  if (pts.length) {
    mapStats.pages++;
    if (pts.some((x) => x.k === "t")) mapStats.typeLoc++;
    if (pts.some((x) => x.k === "o")) mapStats.origin++;
    if (pts.some((x) => x.k === "n")) mapStats.notable++;
  }
}
// colour palettes: parents first so varieties/hand-made pages can inherit
const colorOf = new Map();
const paint = (p) => {
  if (colorOf.has(p)) return colorOf.get(p);
  colorOf.set(p, null); // cycle guard
  const parent = (p.parentIds || []).map((id) => byId.get(id)).find(Boolean);
  const parentBase = parent ? paint(parent)?.[0] : null;
  const c = pickColor({ name: p.name, colors: p.colors, elements: p.elements, parentBase: parentBase && parentBase !== "#b9b4e6" ? parentBase : null });
  colorOf.set(p, c); return c;
};
for (const p of pages) p.pattern = patternFor(p.title + " " + (p.metaphysical?.[0]?.name || ""), (p.crystalSystems || [])[0]);
for (const p of pages) { const [base, src] = paint(p); p.palette = paletteFor(base, src, { name: p.metaphysical[0]?.name || p.name, colors: p.colors }); if (!MULTI_HAS(p) && p.metaphysical[0]) p.palette = paletteFor(base, src, { name: p.name, colors: p.colors }); }
pages.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

// --- cross-links ("see also") -----------------------------------------------------------------
const SEE_ALSO = {
  "Iris Agate": [["Iris quartz", "a different rainbow stone: its colours come from fine fractures in quartz crystals, not from banding"], ["Fire Agate", "agate with iridescence from thin iron-oxide layers"]],
  "Iris quartz": [["Iris Agate", "agate whose ultra-fine banding diffracts light into a rainbow when thin-sliced and backlit"]],
  "Crazy Lace Agate": [["Laguna Agate", "another vividly banded Chihuahua agate"]],
  "Amethyst": [["Amethyst Stalactite", "sliced stalactites showing a flower-like star of amethyst"]],
  "Rhodochrosite": [["Rhodochrosite Stalactite", "Argentina's banded 'Inca rose' stalactites"]],
  "Malachite": [["Malachite Stalactite", "Congolese stalactites with bullseye banding"]],
  "Apophyllite": [["Apophyllite Stalactite", "apophyllite-coated chalcedony stalactites from India"], ["Stilbite", "peach zeolite bowties often grow with apophyllite in Indian basalt"]],
  "Bismuth": [["Bismuthinite", "bismuth sulfide, the main natural bismuth ore mineral"]],
  "Iolite-Sunstone": [["Iolite", "the violet gem cordierite"], ["Sunstone", "feldspar with coppery glitter from iron-oxide platelets"]],
  "Iolite": [["Iolite-Sunstone", "iolite with glittering sunstone and hematite from Odisha, India"]],
  "Sunstone": [["Iolite-Sunstone", "sunstone grown together with violet iolite"]],
  "Hemimorphite": [["Smithsonite", "zinc carbonate: blue 'hemimorphite' on the market is often smithsonite, or a mix of the two"]],
  "Smithsonite": [["Hemimorphite", "zinc silicate that is easily confused with blue smithsonite"]],
  "Needle Quartz": [["Rutilated quartz", "'angel hair': golden rutile needles inside clear quartz, unlike needle quartz, where the needles are quartz"], ["Quartz", "the parent mineral"]],
  "Rutilated quartz": [["Needle Quartz", "quartz that grows as thin needles itself"]],
  "Grape Agate": [["Chalcedony", "grape agate is botryoidal chalcedony, not banded agate"], ["Agate", "true agate is banded chalcedony"]],
  "Pink Jelly Agate": [["Agate", "the parent stone"], ["Chalcedony", "the microcrystalline quartz it is made of"]],
  "Thousand Layer Quartz": [["Quartz", "the parent mineral"]],
  "Record Keeper Quartz": [["Arkansas Quartz", "Arkansas quartz often shows record-keeper triangles"], ["Quartz", "the parent mineral"]],
  "Arkansas Quartz": [["Record Keeper Quartz", "quartz with triangular growth marks on its faces"]],
  "Freshwater Mussel Shell": [["Nacre", "the mother-of-pearl lining"], ["Pearl", "freshwater mussels also make pearls"]],
  "Nacre": [["Freshwater Mussel Shell", "pearly river-mussel shells, e.g. from Arkansas rivers"], ["Aragonite", "nacre is made of aragonite platelets"], ["Pearl", "pearls are built from nacre"]],
  "Druzy Fossil Shell": [["Fossil Shell", "fossil shells in general"], ["Agatized Coral", "another fossil replaced by silica"]],
  "Fossil Shell": [["Druzy Fossil Shell", "fossil clams lined with sparkling crystals"]],
  "Red Moonstone": [["Moonstone", "classic moonstone"], ["Black Moonstone", "another trade-coloured moonstone"]],
  "Desert rose": [["Barite Rose", "the barite form: Oklahoma's state rock"], ["Selenite", "the gypsum mineral that makes Sahara desert roses"]],
  "Barite Rose": [["Desert rose", "the gypsum (selenite) form from the Sahara and Mexico"]],
  "Satin Spar": [["Selenite", "satin spar is fibrous gypsum, the same mineral as selenite"], ["Calcite", "despite the name, most satin spar is not calcite"]],
  "Selenite": [["Satin Spar", "fibrous gypsum, often sold as 'selenite' wands"]],
  "Caribbean Blue Calcite": [["Aragonite", "Caribbean calcite is a mix of calcite, aragonite and blue copper minerals"], ["Blue Aragonite", "another sky-blue carbonate"]],
  "Fire Opal": [["Black Opal", "Australia's dark precious opal"], ["Opalite", "man-made glass, not opal"]],
  "Opalite": [["Opal", "the real, natural mineraloid"], ["Synthetic Opal", "lab-grown opal (Gilson): a real opal structure, made in a lab"]],
  "Pearl": [["Aragonite", "pearls are mostly aragonite"]],
  "Stilbite": [["Apophyllite", "the classic Indian zeolite partner, often on the same specimen"]],
  "Petroleum Quartz": [["Herkimer Diamond", "New York quartz that sometimes holds bitumen and oil"]],
  "Herkimer Diamond": [["Petroleum Quartz", "quartz with fluorescent oil inclusions"]],
  "Blue Amber": [["Baltic Amber", "the classic European amber"], ["Copal", "younger resin often sold as amber"]],
  "Copal": [["Amber", "fully fossilized resin"]],
  "Pink Halite": [["Blue Halite", "halite coloured by natural radiation"], ["Halite", "rock salt"]],
  "Blue Halite": [["Sylvite", "the potassium salt that often sits beside blue halite"]],
  "Tiger's eye": [["Crocidolite", "the asbestos fibres tiger's eye formed from. They are locked in quartz, so polished stones are safe, but don't cut or grind it"]],
  "Uranium Glass": [["Hyalite", "natural opal with the same green uranyl glow"], ["Autunite", "a uranium mineral with a similar green fluorescence"]],
  "Adularia": [["White Moonstone", "the classic moonstone: gem-quality adularia with a blue-white glow"]],
  "White Moonstone": [["Adularia", "the mineral variety behind classic moonstone"], ["Rainbow Moonstone", "looks similar but is actually white labradorite"]],
  "Rainbow Moonstone": [["Labradorite", "rainbow moonstone is gemmologically a colourless labradorite"], ["White Moonstone", "true (orthoclase/adularia) moonstone"]],
  "Labradorite": [["Rainbow Moonstone", "the trade name for white labradorite with rainbow flashes"]],
  "Star Moonstone": [["Cat's-Eye Moonstone", "the single-ray (chatoyant) version"]],
  "Cat's-Eye Moonstone": [["Star Moonstone", "the multi-ray (asterism) version"], ["Cat's eye", "the classic chrysoberyl cat's-eye"]],
  "Velvet Obsidian": [["Rainbow Obsidian", "the same Mexican obsidian, known for banded rainbow sheen"]],
  "Rainbow Obsidian": [["Velvet Obsidian", "rainbow obsidian with a soft, velvety finish"]],
  "Star Garnet": [["Star Diopside", "another stone that often shows a 4-rayed star"]],
  "Moss Agate": [["Tree Agate", "white agate with green, tree-like inclusions"], ["Dendritic Agate", "agate with black, fern-like manganese dendrites"]],
};
{
  const byT = new Map(pages.map((p) => [p.title.toLowerCase(), p]));
  for (const [from, list] of Object.entries(SEE_ALSO)) {
    const p = byT.get(from.toLowerCase()); if (!p) { console.warn("SEE_ALSO: missing", from); continue; }
    p.seeAlso = list.map(([t, why]) => { const q = byT.get(t.toLowerCase()); return q && { title: q.title, url: q.url, why }; }).filter(Boolean);
  }
}
// --- colour families (Wikidata colour words + curated palettes + gradient stops) ------------
// audited colour corrections for popular stones (known colours / Tiffany's photos)
const COLOR_FIX = {
  "wavellite": { set: ["green", "yellow", "white-clear"] }, "zebra jasper": { set: ["black", "white-clear"] },
  "leopard skin jasper": { set: ["brown", "pink", "black"] }, "dalmatian jasper": { add: ["black"] },
  "ammonite": { add: ["brown"] }, "desert rose": { set: ["brown", "white-clear"] }, "barite rose": { set: ["brown", "orange"] },
  "picture jasper": { add: ["brown"] }, "tanzanite": { add: ["purple"] }, "labradorite": { add: ["gray"] },
  "scolecite": { set: ["white-clear"] }, "celestine": { set: ["blue", "white-clear", "gray"] },
};
const NAME_COLOR_WORDS = new Set(["red", "pink", "rose", "blue", "green", "yellow", "golden", "gold", "black", "white", "purple", "orange", "smoky", "clear", "rainbow", "honey", "lavender", "violet", "snow", "lemon", "grey", "gray", "silver", "brown"]);
const MULTI_NAME = /\b(opal|rainbow|iridescent|labradorite|spectrolite|bismuth|ammolite|abalone|bornite|aura|mystic|peacock|fire agate|ocean jasper|unakite)\b/i;
for (const p of pages) {
  // varieties/trade stones with a curated colour are defined by that colour: don't inherit broad species colour lists
  const definedByColor = (p.type === "variety" || p.handmade) && p.palette.source === "curated";
  const fams = definedByColor ? new Set() : familiesFromWords([...(p.colors || []), p.id && WIKI_COLORS[p.id]].filter(Boolean));
  const words = [p.name, ...p.metaphysical.map((e) => e.name)].join(" ").toLowerCase().split(/[^a-z]+/).filter((w) => NAME_COLOR_WORDS.has(w));
  familiesFromWords(words).forEach((f) => fams.add(f));
  const pal = p.palette;
  const trusted = ["curated", "wikidata colour", "name", "parent"].includes(pal.source);
  if (trusted) { const f = familyOfHex(pal.base); if (f) fams.add(f); }
  if (pal.how === "curated multi-colour") {
    const sf = new Set(pal.stops.map((h) => familyOfHex(h, { allowExtremes: false })).filter(Boolean));
    sf.forEach((f) => fams.add(f));
    if (new Set([...sf].map((f) => GROUP[f]).filter(Boolean)).size >= 3) fams.add("multicolor");
  }
  if (MULTI_NAME.test([p.name, ...p.metaphysical.map((e) => e.name)].join(" "))) fams.add("multicolor");
  const fix = COLOR_FIX[p.title.toLowerCase()];
  if (fix) { if (fix.set) { fams.clear(); fix.set.forEach((f) => fams.add(f)); } (fix.add || []).forEach((f) => fams.add(f)); (fix.drop || []).forEach((f) => fams.delete(f)); }
  p.colorFamilies = FAMILIES.filter((f) => fams.has(f.slug)).map((f) => ({ slug: f.slug, label: f.label, hex: f.hex }));
}

// --- collections ---------------------------------------------------------------
// --- Tiffany's own photos (data/own_photos.json): a non-empty src replaces the Commons photo ---
{
  const op = path.join(ROOT, "data/own_photos.json");
  const OWN = fs.existsSync(op) ? JSON.parse(fs.readFileSync(op, "utf8")) : {};
  for (const [n, o] of Object.entries(OWN)) {
    if (n.startsWith("_") || !(o?.src || o?.gallery || o?.uv)) continue;
    const p = pages.find((x) => x.title.toLowerCase() === n.toLowerCase()); if (!p) { console.warn("own_photos: missing", n); continue; }
    const credit = (o.credit || "Photo © Tiffany Stark") + (o.caption ? `, ${o.caption}` : "");
    if (o.src) {
      p.img = { src: o.src, own: true, credit, file: credit, alt: o.alt };
      p.thumb = { src: o.thumb || o.src, own: true, credit, file: credit };
    }
    if (o.uv && p.uv) p.uv.uvImg = { src: o.uv.src, thumbSrc: o.uv.thumb, own: true, credit: "Photo © Tiffany Stark", file: "Photo © Tiffany Stark", alt: o.uv.alt, caption: o.uvCaption || "under UV light" };
    if (o.gallery?.length) p.ownGallery = o.gallery.map((g) => ({ ...g, credit }));
  }
}
// --- Handle With Care ----------------------------------------------------------------
const SEV = { high: "High", moderate: "Moderate", low: "Low" };
for (const h of HAZARDS) {
  const p = pages.find((x) => x.title.toLowerCase() === h.name.toLowerCase());
  if (!p) { console.warn("HAZARD: no page for", h.name); continue; }
  p.hazard = { ...h, sevLabel: SEV[h.severity], iconList: h.icons.map((k) => ({ key: k, ...HAZARD_ICONS[k] })) };
}
for (const p of pages) {
  if (!p.metaphysical.length) continue;
  const note = ELIXIR_NOTES[p.title] || (p.hazard?.icons.includes("noelixir") ? (p.hazard.severity === "low" ? ELIXIR_DEFAULT : "This stone is hazardous: never use it for water or drinking elixirs.") : null);
  if (note) p.elixirNote = note;
}
// --- aliases ("also known as") and notes ---------------------------------------------------
const ALIASES = {
  "Freshwater Mussel Shell": ["Unionidae", "River mussel shell"], "Druzy Fossil Shell": ["Crystal fossil shell", "Fossil clam", "Crystallized clam"], "Record Keeper Quartz": ["Record keeper"],
  "Bismuth": ["Native bismuth", "Bismuth crystal", "Rainbow bismuth", "Hopper bismuth"], "Amethyst Stalactite": ["Amethyst flower", "Amethyst star slice"], "Rhodochrosite Stalactite": ["Inca rose"],
  "Manganoan calcite": ["Mangano Calcite", "Mangano calcite", "Pink calcite", "Manganocalcite"],
  "Iceland spar": ["Optical calcite", "Optical-grade calcite"],
  "Moonstone": ["Raw moonstone", "Rough moonstone"],
  "Fire Opal": ["Mexican fire opal"], "Common Opal": ["Potch", "Potch opal"], "Green Opal": ["Prase opal"], "Dendritic Opal": ["Moss opal"],
  "Ethiopian Opal": ["Welo opal", "Wollo opal"], "Synthetic Opal": ["Gilson opal", "Lab opal"], "Opal Doublet & Triplet": ["Opal doublet", "Opal triplet"],
  "Opalite": ["Sea opal", "Opal moonstone"], "Pyrite Sun": ["Pyrite dollar", "Miner's dollar", "Pyrite disc"], "Rainbow Calcite": ["Rhomboid calcite"],
  "Lemon Calcite": ["Yellow calcite"], "Dogtooth Calcite": ["Scalenohedral calcite"], "Merkabite Calcite": ["Merkabite"],
  "Aragonite Sputnik": ["Aragonite star cluster", "Sputnik aragonite"], "Banded Aragonite": ["Aragonite onyx", "Mexican onyx"], "Cave Aragonite": ["Coralloid aragonite"],
  "Twinned Aragonite": ["Spanish aragonite", "Hexagonal aragonite"], "Brown Aragonite": ["Moroccan aragonite", "Red aragonite"], "Nacre": ["Mother of pearl"],
  "Barite Rose": ["Rose rock", "Baryte rose"], "Desert rose": ["Selenite rose", "Gypsum rose", "Sand rose"], "Satin Spar": ["Satin spar selenite"],
  "Petroleum Quartz": ["Petroleum included quartz", "Oil quartz", "Hydrocarbon quartz"], "Blue Amber": ["Dominican blue amber"], "Herkimer Diamond": ["Herkimer quartz"],
  "Pink Halite": ["Pink salt"], "Blue Halite": ["Blue salt"],
};
const NOTES = {
  "Hemimorphite": "Blue banded 'hemimorphite' on the market is often smithsonite, or an intergrowth of both zinc minerals. Hemimorphite is a zinc silicate (Mohs 4.5–5) and does not fizz in acid. Smithsonite is a zinc carbonate (Mohs 4–4.5) and fizzes in warm dilute acid. Telling them apart reliably needs testing, so specimens are often labelled 'hemimorphite/smithsonite'.",
  "Smithsonite": "Blue smithsonite and hemimorphite are often mixed up, and many blue banded pieces contain both. Smithsonite is the denser zinc carbonate and fizzes in warm dilute acid, while hemimorphite is a silicate.",
  "Bismuth": "Lab-grown, not natural: almost all the iridescent stair-step bismuth crystals sold are grown from melted bismuth metal. Natural native bismuth looks quite different. It forms silvery-pink, often tarnished grains and masses in ore veins.",
  "Moonstone": "Raw (rough) moonstone looks quite plain. Expect milky white, cream, peach or grey chunks of feldspar with a glassy to pearly lustre, flat cleavage faces and a waxy feel. The floating blue-white glow (adularescence) shows only as a faint sheen on some faces when you turn the stone under a light (see the raw moonstone photo in the gallery below). It becomes obvious after the stone is polished into a dome. Raw rainbow 'moonstone' is white labradorite and shows flashes of blue on its cleavage surfaces.",
  "Desert rose": "There are two kinds of 'desert rose'. Gypsum (selenite) roses form in sandy deserts such as the Sahara (Tunisia, Algeria and Morocco) and Chihuahua, Mexico. Barite roses come from central Oklahoma, where the 'rose rock' is the state rock. Gypsum roses are softer (Mohs 2) and slightly water-soluble. Barite roses are heavier and harder (Mohs 3–3.5).",
  "Halite": "Halite colours: clear to white is pure salt. Pink to red usually comes from salt-loving microbes (archaea), as at Searles Lake, California. Blue to violet comes from radiation-damaged colour centres, often next to sylvite. Orange or brown usually comes from iron oxide or clay inclusions.",
  "Fire Opal": "Mexican fire opal comes mostly from the Querétaro and Jalisco highlands. It is the classic transparent orange-red opal and may or may not show play-of-colour.",
  "Herkimer Diamond": "Herkimer 'diamonds' are not diamonds. They are naturally double-terminated, very clear quartz crystals from pockets in Cambrian dolostone (about 500 million years old) around Herkimer County, New York. Several fee-dig mines let visitors collect. Some contain black bitumen or fluorescent petroleum inclusions.",
};
for (const p of pages) {
  const k = p.title.toLowerCase();
  const a = Object.entries(ALIASES).find(([t]) => t.toLowerCase() === k)?.[1]; if (a) p.aka = a;
  const n = Object.entries(NOTES).find(([t]) => t.toLowerCase() === k)?.[1]; if (n) p.note = n;
}
const card = (p) => ({ style: p.palette.cardStyle, title: p.title, url: p.url, formula: p.formula, thumb: p.thumb || p.parentImg && { ...p.parentImg, src: p.parentImg.src.replace("width=480", "width=240") } || null, typeLabel: p.typeLabel, mohs: p.mohs });
const systems = SYSTEM_ORDER.map((s) => ({
  key: s, title: cap(s), info: SYSTEM_INFO[s], url: `/crystal-systems/${s}/`,
  items: pages.filter((p) => p.crystalSystems?.includes(s)).map((p) => ({ title: p.title, url: p.url, formula: p.formula })),
}));
const letters = [];
for (const p of pages) {
  const ch = p.title.normalize("NFKD").charAt(0).toUpperCase();
  const L = /[A-Z]/.test(ch) ? ch : "#";
  let g = letters.find((x) => x.letter === L);
  if (!g) letters.push((g = { letter: L, slug: L === "#" ? "other" : L.toLowerCase(), items: [] }));
  p.azSlug = g.slug;
  g.items.push({ title: p.title, url: p.url, formula: p.formula, typeLabel: p.typeLabel });
}
letters.sort((a, b) => (a.letter === "#") - (b.letter === "#") || a.letter.localeCompare(b.letter));

const gems = pages.filter((p) => p.isGem || p.type === "gem" || p.type === "variety" || p.metaphysical.length && p.type !== "species" ||
  GEM_SPECIES.has(p.name.toLowerCase())).map(card);

const collection = (k) => pages.filter((p) => p.collection === k).map((p) => ({ ...card(p), facts: p.facts, group: p.fossilGroup || "other" }))
  .sort((a, b) => a.title.localeCompare(b.title));
const fossils = collection("fossil");
const uvStones = pages.filter((p) => p.uv).map((p) => ({ ...card(p), uv: p.uv })).sort((a, b) => a.title.localeCompare(b.title));
const uvSafety = UV_SAFETY;
const rank = (p) => (p.metaphysical.length ? 4 : 0) + (p.isGem || p.type === "gem" ? 3 : 0) + (p.uv || p.facts ? 1 : 0) + (p.img ? 1 : 0) + (p.type === "variety" ? 1 : 0);
const colorPages = FAMILIES.map((f) => {
  const items = pages.filter((p) => p.colorFamilies.some((c) => c.slug === f.slug)).sort((a, b) => rank(b) - rank(a) || a.title.localeCompare(b.title));
  return { ...f, url: `/colors/${f.slug}/`, count: items.length, featured: items.filter((p) => rank(p) >= 4).length,
    cards: items.map((p) => ({ ...card(p), heal: p.metaphysical.length > 0 })), top: items.slice(0, 4).map((p) => card(p)) };
});
const geodes = collection("geode");
const grp = (g, extra = []) => [...pages.filter((p) => p.facts?.group === g), ...extra.map((n) => pages.find((p) => p.title.toLowerCase() === n.toLowerCase())).filter(Boolean)]
  .filter((p, i, a) => a.indexOf(p) === i).map((p) => ({ ...card(p), facts: p.facts })).sort((a, b) => a.title.localeCompare(b.title));
const starStones = grp("star", ["Star quartz"]);
const catsEyes = grp("cats-eye", ["Cat's eye", "Cat's-Eye Moonstone", "Tiger's Eye", "Hawk's Eye", "Albite cat’s-eye"]);
const obsidians = grp("obsidian", ["Obsidian", "Snowflake Obsidian", "Apache tears", "Mahogany Obsidian", "Rainbow Obsidian"]);
const moonstones = grp("moonstone", ["Moonstone", "Adularia", "Albite Moonstone", "Star Moonstone"]);
const calcites = grp("calcite", ["Calcite", "Iceland spar", "Manganoan calcite", "Cobaltocalcite", "Nailhead spar", "Calcite Geode"]);
const opals = grp("opal", ["Opal", "Precious Opal", "Fire Opal", "Hyalite", "Opalized Fossil"]);
const aragonites = grp("aragonite", ["Aragonite", "Caribbean Blue Calcite", "Nacre", "Pearl"]);
const halites = grp("halite", ["Halite", "Sylvite"]);
const ambers = grp("amber", ["Amber", "Amber with Inclusions"]);
const apophyllites = grp("apophyllite", ["Apophyllite", "Fluorapophyllite-(K)", "Fluorapophyllite-(Na)", "Fluorapophyllite-(NH₄)", "Fluorapophyllite-(Cs)", "Hydroxyapophyllite-(K)", "Hydroxyapophyllite-(NH₄)", "Stilbite"]);
const stalactites = grp("stalactite", []);
const desertRoses = grp("desert-rose", ["Desert rose", "Barite Rose", "Selenite"]);
for (const [fam, label, list] of [["stalactite", "Stalactites", stalactites], ["calcite", "Calcite family", calcites], ["opal", "Opal family", opals], ["aragonite", "Aragonite family", aragonites], ["halite", "Halite family", halites], ["amber", "Amber family", ambers], ["apophyllite", "Apophyllite family", apophyllites], ["desert-rose", "Desert rose forms", desertRoses], ["obsidian", "Obsidian family", obsidians], ["moonstone", "Moonstone types", moonstones]])
  for (const c of list) { const p = pages.find((x) => x.url === c.url); if (p && !p.family) p.family = { label, cards: list.filter((x) => x.url !== c.url) }; }

const popular = ["Amethyst", "Rose quartz", "Quartz", "Labradorite", "Fluorite", "Malachite", "Emerald", "Pyrite", "Citrine", "Obsidian", "Lapis lazuli", "Moonstone"]
  .map((n) => pages.find((p) => p.title.toLowerCase() === n.toLowerCase())).filter(Boolean).map(card);

healing.sort((a, b) => a.name.localeCompare(b.name));
for (const e of healing) { const own = pickColor({ name: e.name, colors: [], elements: [] }); e.style = (own[1] === "neutral" ? e.page.palette : paletteFor(own[0], own[1], { name: e.name })).cardStyle; delete e.page; }
// --- pairings ----------------------------------------------------------------------
const PAIRS = buildPairings(meta);
const healByName = new Map(healing.map((e) => [e.name, e]));
const mini = (e) => ({ name: e.name, url: e.url, style: e.style, thumb: e.thumb, chakras: e.chakras });
for (const p of pages) for (const e of p.metaphysical) {
  e.pairs = (PAIRS[e.name] || []).map((x) => ({ ...mini(healByName.get(x.name)), reason: x.reason })).filter((x) => x.url && x.url !== p.url);
}
const intentions = INTENTIONS.map((i) => ({ ...i, stones: i.stones.map((n) => healByName.get(n)).filter(Boolean).map(mini) }));
const pairingsData = healing.map((e) => ({ n: e.name, u: e.url, st: e.style, th: e.thumb?.src || null, ch: e.chakras,
  p: (PAIRS[e.name] || []).map((x) => [x.name, x.reason]) }));

// --- identifier dataset ------------------------------------------------------------
const VOCAB = [["purple", /purple|violet|lilac|lavender|amethyst/], ["pink", /pink|rose/], ["red", /\bred|crimson|scarlet|blood/], ["orange", /orange|peach/],
  ["yellow", /yellow|lemon|straw|champagne|honey/], ["gold", /gold|brass/], ["green", /green|olive|emerald|lime/], ["blue", /blue|azure|indigo|cyan|turquoise|teal/],
  ["brown", /brown|bronze|tan\b|rust/], ["black", /black/], ["gray", /gr[ae]y|lead/], ["silver", /silver|steel|tin-white/], ["white", /white|milky|cream/],
  ["colorless", /colou?rless|clear|transparent/]];
const vocab = (arr) => [...new Set((arr || []).flatMap((c) => VOCAB.filter(([, re]) => re.test(String(c).toLowerCase())).map(([k]) => k)))];
const LUSTER_MAP = [["m", /metallic/], ["a", /adamantine/], ["v", /vitreous|glassy/], ["p", /pearly/], ["s", /silky/], ["r", /resinous/], ["g", /greasy/], ["w", /waxy/], ["d", /dull|earthy/]];
const parseH = (h) => { const [a, b] = h.split("-").map(Number); return [a, b ?? a]; };
const identify = [];
const coveredPages = new Set();
for (const e of healing) {
  const raw = CURATED_ID[e.name]; if (!raw) continue;
  const [h, l, t, st, col, sys, flags] = raw.split("|");
  const page = pages.find((p) => p.url === e.url);
  coveredPages.add(e.url);
  identify.push({ n: e.name, u: e.url, st: e.style, th: e.thumb?.src || null, k: page?.typeLabel || "", p: 1,
    h: parseH(h), l: l.split(","), t: t.split(","), s: st.split(","), c: col.split(","), y: sys.split(","), f: flags ? flags.split(",") : [] });
}
for (const p of pages) {
  if (coveredPages.has(p.url) || p.handmade) continue;
  const c = vocab(p.colors), s = vocab(p.streak);
  if (p.mohsMin == null && !c.length && !s.length) continue;
  const l = LUSTER_MAP.filter(([, re]) => p.luster.some((x) => re.test(x))).map(([k]) => k);
  identify.push({ n: p.title, u: p.url, st: p.palette.cardStyle, th: p.thumb?.src || null, k: p.typeLabel, p: 0,
    h: p.mohsMin == null ? null : [p.mohsMin, p.mohsMax], l, t: [], s, c, y: p.crystalSystems, f: [] });
}

const stats = {
  total: pages.length,
  species: pages.filter((p) => p.type === "species").length,
  varieties: pages.filter((p) => p.type === "variety").length,
  other: pages.filter((p) => !["species", "variety"].includes(p.type)).length,
  withImage: pages.filter((p) => p.img).length,
  healing: healing.length,
  identify: identify.length,
  colored: pages.filter((p) => p.colorFamilies.length).length,
  built: new Date().toLocaleDateString("en-CA"),
};

const hazards = HAZARD_GROUPS.map(([key, label]) => ({ key, label, items: pages.filter((p) => p.hazard?.group === key)
  .sort((a, b) => ["high", "moderate", "low"].indexOf(a.hazard.severity) - ["high", "moderate", "low"].indexOf(b.hazard.severity) || a.title.localeCompare(b.title))
  .map((p) => ({ ...card(p), hazard: p.hazard })) })).filter((g) => g.items.length);
const hazardIcons = Object.entries(HAZARD_ICONS).map(([key, v]) => ({ key, ...v }));
const enc = (o) => JSON.stringify(o).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;");
const arkansas = {
  sections: ARK_SECTIONS.map(([title, intro, names]) => ({ title, intro, cards: names.map((n) => {
    const p = pages.find((x) => x.title.toLowerCase() === n.toLowerCase()); if (!p) console.warn("ARK: no page for", n); return p && card(p); }).filter(Boolean) })),
  sites: ARK_SITES.map(([n, la, lo, note]) => ({ n, la, lo, note })),
  mapPoints: enc(ARK_SITES.map(([n, la, lo, note]) => ({ k: "n", n: `${n}: ${note}`, la, lo }))),
  tips: ARK_TIPS.map(([title, text, src]) => ({ title, text, src })),
  sources: Object.values(ARK_SOURCES),
};
export default { stalactites, calcites, opals, aragonites, halites, ambers, arkansas, hazards, hazardIcons, starStones, catsEyes, obsidians, moonstones, colorPages, uvStones, uvSafety, fossils, geodes, mapStats, identify, intentions, pairingsData, pages, systems, letters, gems, popular, healing, stats, chakras: CHAKRAS };
