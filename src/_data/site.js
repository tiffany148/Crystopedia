// Builds every collection the templates need from data/minerals.json + data/metaphysical.json
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const minerals = JSON.parse(fs.readFileSync(path.join(ROOT, "data/minerals.json"), "utf8"));
const meta = JSON.parse(fs.readFileSync(path.join(ROOT, "data/metaphysical.json"), "utf8"));

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
const KIND_LABEL = { mineral: "Mineral", variety: "Mineral variety", rock: "Rock", group: "Mineral group", organic: "Organic gem", mineraloid: "Mineraloid", glass: "Natural glass", other: "Other" };
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
      parentIds: e.parent ? [e.parent] : [], metaphysical: [], img: null, thumb: null,
      mindatUrl: `https://www.mindat.org/search.php?search=${encodeURIComponent(e.name)}`,
    };
    // inherit the picture from its parent so the card isn't empty
    pages.push(page);
    if (e.parent && byId.get(e.parent)) (byId.get(e.parent).childIds ||= []).push(`hand:${slug}`);
    byId.set(`hand:${slug}`, page);
  }
  page.metaphysical.push(e);
  page.kindLabel ||= KIND_LABEL[e.kind] || null;
  healing.push({ ...e, url: page.url, thumb: page.thumb || (page.parentIds[0] && byId.get(page.parentIds[0])?.thumb) || null });
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
pages.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

// --- collections ---------------------------------------------------------------
const card = (p) => ({ title: p.title, url: p.url, formula: p.formula, thumb: p.thumb || p.parentImg && { ...p.parentImg, src: p.parentImg.src.replace("width=480", "width=240") } || null, typeLabel: p.typeLabel, mohs: p.mohs });
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

const popular = ["Amethyst", "Rose quartz", "Quartz", "Labradorite", "Fluorite", "Malachite", "Emerald", "Pyrite", "Citrine", "Obsidian", "Lapis lazuli", "Moonstone"]
  .map((n) => pages.find((p) => p.title.toLowerCase() === n.toLowerCase())).filter(Boolean).map(card);

healing.sort((a, b) => a.name.localeCompare(b.name));
const stats = {
  total: pages.length,
  species: pages.filter((p) => p.type === "species").length,
  varieties: pages.filter((p) => p.type === "variety").length,
  other: pages.filter((p) => !["species", "variety"].includes(p.type)).length,
  withImage: pages.filter((p) => p.img).length,
  healing: healing.length,
  built: new Date().toISOString().slice(0, 10),
};

export default { pages, systems, letters, gems, popular, healing, stats, chakras: CHAKRAS };
