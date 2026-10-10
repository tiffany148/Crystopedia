// Derive a colour palette for each stone page.
// Priority: curated map (popular stones) -> Wikidata colour list -> colour words in the name
//           -> chemistry (chromophore elements) -> neutral crystal gradient.

// Curated base colours for popular stones (lower-case name -> hex)
export const CURATED = {
  "quartz": "#dfe7ee", "clear quartz": "#dfe7ee", "rock crystal": "#e3ebf2", "amethyst": "#8e44ad", "rose quartz": "#f4a7b9",
  "citrine": "#e8a317", "smoky quartz": "#6b5848", "ametrine": "#a86fbf", "rutilated quartz": "#d4a94a", "tourmalinated quartz": "#9a9a9a",
  "strawberry quartz": "#f08080", "prasiolite": "#9cc98a", "herkimer diamond": "#e6eef5", "spirit quartz": "#b495d1",
  "agate": "#c07a4f", "blue lace agate": "#9ec5e8", "moss agate": "#7fa36b", "fire agate": "#b5541c", "crazy lace agate": "#c9a27e",
  "botswana agate": "#b89a9a", "dendritic agate": "#cfcfc2", "carnelian": "#d2561c", "onyx": "#2b2b2b", "sardonyx": "#9c4a2f",
  "chrysoprase": "#5fbf72", "heliotrope": "#2f5e3b", "bloodstone": "#2f5e3b", "jasper": "#a8402e", "red jasper": "#a32d22",
  "ocean jasper": "#7fae8e", "picture jasper": "#b8915d", "dalmatian jasper": "#e9e1d0", "mookaite": "#b5513f", "zebra jasper": "#2a2826", "wavellite": "#8fb54d", "leopard skin jasper": "#c9a26b",
  "polychrome jasper": "#c46b3a", "chalcedony": "#a9bfd6", "blue chalcedony": "#a3bde0", "aventurine": "#3f9b5a", "tiger's eye": "#b8860b",
  "falcon's eye": "#4f6d8c", "hawk's eye": "#4f6d8c", "tiger-iron": "#7a3b2e", "tiger iron": "#7a3b2e", "labradorite": "#3a6f8f",
  "moonstone": "#dfe6f2", "sunstone": "#e07b39", "amazonite": "#4fbfa8", "larvikite": "#4b5563", "schorl": "#1f1f1f", "black tourmaline": "#1f1f1f",
  "rubellite": "#d6336c", "pink tourmaline": "#e75b8d", "watermelon tourmaline": "#e86f8f", "verdelite": "#2e8b57", "indicolite": "#2f6db5",
  "tourmalines": "#3d6b4f", "tourmaline": "#3d6b4f", "garnet group": "#8b1a1a", "garnet": "#8b1a1a", "pyrope": "#9b111e", "almandine": "#7b1e2b",
  "spessartine": "#e0661b", "tsavorite": "#2fa84f", "hessonite": "#c1601b", "grossular": "#a8c66c", "andradite": "#6b8e23", "demantoid": "#3fae49",
  "emerald": "#1f9d55", "aquamarine": "#7fd1e3", "morganite": "#f2b8b0", "heliodor": "#f0c419", "golden beryl": "#f0c419", "goshenite": "#eef2f3",
  "beryl": "#7fbfa8", "ruby": "#c0112c", "sapphire": "#1f3fa8", "corundum": "#5b6fb5", "diamond": "#e9f1f7", "topaz": "#e9a94b", "peridot": "#9acd32",
  "olivine": "#8db33a", "forsterite": "#a3c25a", "spinel": "#c2185b", "zircon": "#c9a26b", "tanzanite": "#4b3ba8", "cordierite": "#4a5ab0", "iolite": "#4a5ab0",
  "kunzite": "#d39bd1", "hiddenite": "#a2d39b", "spodumene": "#d8b8d8", "kyanite": "#3a6fb5", "fluorite": "#7d5bb5", "calcite": "#f1e7c9",
  "iceland spar": "#eaf0f2", "manganoan calcite": "#f3b7c3", "mangano calcite": "#f3b7c3", "selenite": "#f2f2ee", "gypsum": "#efece4", "desert rose": "#d2b48c",
  "celestine": "#a6c8ea", "celestite": "#a6c8ea", "anhydrite": "#9fb7da", "angelite": "#9fb7da", "apophyllite": "#e3f0e8", "prehnite": "#b5d68a",
  "epidote": "#5d6b2f", "unakite": "#9b8a6a", "malachite": "#0f8a5f", "azurite": "#1d3f9a", "chrysocolla": "#1fa3a3", "turquoise": "#36c2b4",
  "lapis lazuli": "#1e3a8a", "lazurite": "#1e3a8a", "sodalite": "#24408e", "larimar": "#6ec6e6", "howlite": "#f1efea", "magnesite": "#f2efe9",
  "rhodochrosite": "#e0607e", "rhodonite": "#d2697b", "lepidolite": "#b48cc8", "charoite": "#7b4fa3", "sugilite": "#7a2f8f", "seraphinite": "#4f7a5a",
  "serpentine mineral subgroup": "#6b8e4e", "serpentine": "#6b8e4e", "jade": "#3f9e6b", "jadeite": "#3aa76d", "nephrite": "#4f7f4a", "hematite": "#4a4a50",
  "magnetite": "#2d2d30", "lodestone": "#2d2d30", "pyrite": "#c9b037", "chalcopyrite": "#c8a43a", "bornite": "#6b4ea8", "galena": "#8a8d91", "shungite": "#1c1c1c",
  "obsidian": "#141414", "snowflake obsidian": "#2a2a2a", "apache tears": "#1c1c1c", "apache tear": "#1c1c1c", "mahogany obsidian": "#5a2e1e", "rainbow obsidian": "#2a2438",
  "moldavite": "#5a7d2b", "tektite": "#2b2b2b", "libyan desert glass": "#e8d48a", "amber": "#e08e0b", "pearl": "#f3ede4", "jet": "#111111", "coral": "#e4572e",
  "ammolite": "#b85c2e", "petrified wood": "#8b6b4a", "opal": "#cfe3ea", "fire opal": "#ef6c1a", "precious opal": "#bfe0e8", "aragonite": "#e9c9a5",
  "smithsonite": "#9ed6c8", "hemimorphite": "#9fd3e6", "vanadinite": "#c7331d", "wulfenite": "#ef8a1a", "sphalerite": "#8a5a2b", "staurolite": "#6b3f2a",
  "chiastolite": "#8a7b6a", "andalusite": "#7f6b45", "dioptase": "#0b8f6a", "sulfur": "#f2d300", "native copper": "#b87333", "copper": "#b87333",
  "native gold": "#d4af37", "gold": "#d4af37", "native silver": "#c0c0c0", "silver": "#c0c0c0", "apatite": "#2fa3b8", "danburite": "#eef0e8", "petalite": "#efefef",
  "phenakite": "#eef3f5", "scolecite": "#f0f0ea", "stilbite": "#f2c9a5", "okenite": "#f4f4f0", "cavansite": "#2a7fd4", "dumortierite": "#2f4a8a",
  "chrysoberyl": "#c9c24a", "alexandrite": "#2e7d6b", "titanite": "#b8a32a", "ulexite": "#eeeeea", "halite": "#f2dfe4", "muscovite": "#cbbf9e", "fuchsite": "#5aa37a",
  "astrophyllite": "#a8822e", "nuummite": "#2b2b2e", "septaria": "#a0784a", "septarian": "#a0784a", "zoisite": "#4f8a4a", "anyolite": "#5a8a4a", "ruby in zoisite": "#5a8a4a",
  "thulite": "#e49ab0", "pietersite": "#4a5a7a", "bronzite": "#7a5a35", "variscite": "#6fbf8f", "eudialyte": "#b5334f", "rutile": "#a0522d", "stibnite": "#6e7075",
  "cinnabar": "#c1271b", "benitoite": "#3f5fd0", "covellite": "#24346b", "baryte": "#e8e2d4", "barite": "#e8e2d4", "orthoclase": "#efd9c0", "cerussite": "#efeee8",
  "garnierite": "#3fa34d", "chrysanthemum stone": "#3a3a3a", "meteorite": "#3d3a36", "rhyolite": "#8a9a5b", "copper ore": "#1f8a6a", "jasper of": "#a8402e",
  "anglesite": "#eceae0", "dolomite": "#f0e6dc", "realgar": "#d4371c", "orpiment": "#f0b323", "crocoite": "#ef5b1a", "autunite": "#d8e84a", "torbernite": "#3fae49",
  "cuprite": "#8b1a1a", "atacama": "#0f8a5f", "atacamite": "#127a4f", "adamite": "#c8d84a", "mimetite": "#e0a43a", "pyromorphite": "#7fbf2f", "erythrite": "#b23a7a",
  "smoky": "#6b5848", "chrome diopside": "#1f7a3f", "diopside": "#3d7a4f", "enstatite": "#7a6a4a", "actinolite": "#3f6b3a", "tremolite": "#e6e9e3", "albite": "#efefea",
  "microcline": "#e8d7c6", "labradorite feldspar": "#3a6f8f", "lazulite": "#2d4fa8", "scapolite": "#e0cf9a", "vesuvianite": "#6b7a2a", "benitoite gem": "#3f5fd0",
};

// colour words (from Wikidata colour labels or names) -> hex
const WORDS = [
  [/purple|violet|amethyst|lilac|lavender|plum/, "#8e44ad"], [/pink|rose|rosy|salmon/, "#ef8fae"], [/crimson|blood|ruby|scarlet|\bred\b|cherry/, "#c0392b"],
  [/orange|tangerine|peach/, "#e67e22"], [/gold|golden|honey|amber|champagne/, "#d4a017"], [/yellow|lemon|canary/, "#e8c31a"],
  [/emerald|\bgreen\b|olive|lime|apple|grass|verd/, "#2e9e5b"], [/teal|turquoise|cyan|aqua/, "#1fa3a3"], [/\bblue\b|azure|navy|indigo|sky|cobalt/, "#2f5fb3"],
  [/brown|bronze|chocolate|tan\b|rust|coffee|mahogany/, "#8b5a2b"], [/copper/, "#b87333"], [/black|jet|ebony/, "#1f1f1f"],
  [/silver|steel|lead.?grey|metallic/, "#9aa0a6"], [/grey|gray|smoky|smoke/, "#7d7d85"], [/white|milky|snow|cream|ivory/, "#f1efea"],
  [/colou?rless|clear|transparent|crystal|water.?clear/, "#e3ebf2"],
];
// chemistry fallback: first matching element wins (ordered by how strongly they colour minerals)
const CHEM = [
  ["Cu", "#1f9a7a"], ["Cr", "#2e8b57"], ["Ni", "#5fae5a"], ["Co", "#c2457a"], ["Mn", "#d2697b"], ["U", "#c8d43a"], ["V", "#d2622a"],
  ["Hg", "#b3332b"], ["Au", "#d4af37"], ["Ag", "#a9adb3"], ["Fe", "#8b4a2b"], ["Ti", "#6e5a4a"], ["Pb", "#8a8d91"], ["Sb", "#7a7c80"],
  ["Bi", "#9a9aa8"], ["Mo", "#6f7680"], ["W", "#5a4a3a"], ["Ce", "#c9b07a"], ["Nd", "#b59ac8"], ["S", "#c9b037"],
];
const NEUTRAL = "#b9b4e6"; // soft lavender/ice crystal

// --- colour maths -----------------------------------------------------------------
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = (r) => "#" + r.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
function rgb2hsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  return [h * 360, s * 100, l * 100];
}
const hsl = (h, s, l) => `hsl(${Math.round(h)} ${Math.round(Math.max(0, Math.min(100, s)))}% ${Math.round(Math.max(0, Math.min(100, l)))}%)`;
const luminance = (hex) => { const [r, g, b] = hex2rgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const mix = (a, b, t) => rgb2hex(hex2rgb(a).map((v, i) => v + (hex2rgb(b)[i] - v) * t));

// Hand-tuned multi-colour stops for stones whose beauty is in more than one colour (dark → light / across hues)
export const MULTI = {
  "wavellite": ["#5f7f2e", "#9cbf5a", "#cfe39a", "#7fa84a", "#e6f0c4"], "zebra jasper": ["#1b1b1b", "#f1eee6", "#3a3835", "#d8d4ca", "#0f0f0f"],
  "leopard skin jasper": ["#e8d2a6", "#c9a26b", "#4a3020", "#d9b48a", "#2a1c14"],
  "iris agate": ["#6b5b8a", "#e0707a", "#f2c14e", "#7fd1b9", "#6ec6ff", "#c9b8f2"],
  "amethyst": ["#3b0f5c", "#6a2c91", "#9b59b6", "#d7b8ec"], "rose quartz": ["#b83b67", "#e27396", "#f4a7b9", "#fde2e8"],
  "watermelon tourmaline": ["#c2185b", "#f48fb1", "#f6f0e6", "#8fd19e", "#2e7d4f"], "labradorite": ["#1b2a3a", "#1f5f8b", "#20a39e", "#d4af37", "#3d5a80"],
  "malachite": ["#063b22", "#11804a", "#4cc38a", "#0b5e36", "#9fe3bf"], "opal": ["#a7e8f5", "#f8c8dc", "#fff3b0", "#c4f0c5", "#c9b6f2"],
  "fire opal": ["#b33a0b", "#f06a1d", "#ffb347", "#ffe0a3"], "black opal": ["#0b1a3a", "#1565c0", "#00a884", "#e040fb", "#ff7043"],
  "ametrine": ["#5b2a86", "#a86fbf", "#f2c14e", "#e8a317"], "bloodstone": ["#0f3d2e", "#1e5c45", "#a4161a", "#2c6e49"],
  "unakite": ["#3f7d5a", "#e78f8e", "#9cc5a1", "#f0b2a8"], "ruby in zoisite": ["#1d5c2e", "#4e9a3c", "#c2185b", "#e57373"],
  "rainbow obsidian": ["#121212", "#4a2a6a", "#1f7a7a", "#8a6a20", "#1a1a1a"], "fluorite": ["#4b2a7b", "#8e6cc8", "#7fd1b9", "#2e8b6e", "#d6f5ec"],
  "rainbow fluorite": ["#4b2a7b", "#8e6cc8", "#7fd1b9", "#2e8b6e", "#d6f5ec"], "tiger's eye": ["#3b2208", "#8b5a12", "#d4a017", "#6b3f0c"],
  "moss agate": ["#2d4a22", "#6b8f4e", "#e9efe0", "#a3b18a"], "ocean jasper": ["#2f5d50", "#8fbf9f", "#f2e6c9", "#d98e73"],
  "bismuth": ["#2c3e8f", "#d4af37", "#c2185b", "#16a085", "#8e44ad"], "abalone": ["#0b3d5c", "#16a085", "#2e86de", "#8e44ad", "#c0e0d8"],
  "ammolite": ["#7a1e12", "#e74c3c", "#f1c40f", "#27ae60", "#2e86de"], "bornite": ["#2c1b5c", "#2e86de", "#8e44ad", "#d4af37", "#c2185b"],
  "chrysocolla": ["#0b4f5c", "#1fa3a3", "#5dade2", "#2e9e5b"], "azurite": ["#0b1f5c", "#1f3fa3", "#3b6fd6", "#a7c4f2"],
  "lapis lazuli": ["#0b1a5c", "#1f3fa3", "#3557c9", "#d4af37"], "turquoise": ["#0f5f5c", "#1fa3a3", "#5fd3c7", "#8b6a4a"],
  "sodalite": ["#0f1f5c", "#2f4fa3", "#e6ecf5", "#4a6fc0"], "citrine": ["#8a4b06", "#d4870f", "#f2c14e", "#fff1c2"],
  "carnelian": ["#7a1f06", "#c2410c", "#f08a4b", "#ffd2b0"], "moonstone": ["#5d6d8a", "#a7c4f2", "#eef3fb", "#d9d2f2"],
  "rainbow moonstone": ["#4a6fa5", "#b3e5fc", "#f5f7fb", "#c5b3f2", "#a7f2d4"], "aura quartz": ["#9adcf5", "#f5b3e6", "#fff3b0", "#b3f5c9"],
  "smoky quartz": ["#2b211a", "#5c4a3a", "#9a8676", "#d9cfc6"], "clear quartz": ["#7d8fa6", "#c8d6e5", "#eef4fa", "#ffffff"],
  "quartz": ["#7d8fa6", "#c8d6e5", "#eef4fa", "#ffffff"], "emerald": ["#044d2b", "#0f8a4f", "#3fc380", "#c8f2dc"],
  "ruby": ["#5c0618", "#a4161a", "#e0405a", "#ffd0d8"], "sapphire": ["#081a5c", "#1f3fa3", "#4f7fe0", "#cfdcfa"],
  "garnet": ["#3b0610", "#7a1020", "#b0263b", "#f2b3be"], "peridot": ["#3d5a06", "#7fb800", "#c6e34f", "#f0f7c8"],
  "aquamarine": ["#2b6f8a", "#6ec6db", "#b6e8f2", "#eafaff"], "jade": ["#0f4f33", "#2e8b57", "#7fc8a0", "#e0f2e8"],
  "obsidian": ["#050505", "#1f1f24", "#3a3a44", "#8a8a99"], "black tourmaline": ["#050505", "#25252b", "#4a4a55", "#9a9aa8"],
  "pyrite": ["#4a3a10", "#a8862c", "#d4b85a", "#f2e4b0"], "hematite": ["#15161a", "#3a3c44", "#7a7d88", "#c8c9d0"],
  "amber": ["#5c2a00", "#b5651d", "#e8a317", "#ffd98a"], "rhodochrosite": ["#7a1f3b", "#d2697b", "#f3b0bc", "#fff0f2"],
  "kunzite": ["#7a3f7a", "#d48fd4", "#f2c6e8", "#fbeefa"], "selenite": ["#a8a8b8", "#e6e6f0", "#f7f7fb", "#ffffff"],
  "lepidolite": ["#4a2a6a", "#9a7ac8", "#d6c6ec", "#f3eefb"], "charoite": ["#3b1259", "#7b3fa0", "#b388d6", "#e6d6f2"],
  "larimar": ["#1f5f8b", "#6ec6e6", "#c8ecf7", "#ffffff"], "moldavite": ["#14331b", "#3f6d2a", "#7fa65a", "#cfe3b0"],
  "sunstone": ["#8a2d0b", "#e0702a", "#f2b06a", "#ffe3c2"], "petoskey stone": ["#4a4038", "#8c8070", "#cfc4b2", "#f2ece2"],
  "tourmaline": ["#c2185b", "#f48fb1", "#8fd19e", "#2e7d4f"], "elbaite": ["#c2185b", "#f48fb1", "#8fd19e", "#2e7d4f"],
  "agate": ["#6b2f1a", "#c0703f", "#efd9c0", "#8a5a44"], "crazy lace agate": ["#6b2f1a", "#d98e5a", "#f2e6d6", "#8a5a44"],
  "tanzanite": ["#1f1a6b", "#4b3fb3", "#8e7fe0", "#d6d0f7"], "diamond": ["#9fb3c8", "#e3ebf2", "#ffffff", "#f6e7ff"],
};
const hsl2hex = (h, s, l) => { s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); return rgb2hex([f(0), f(8), f(4)].map((v) => v * 255)); };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const contrast = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
// 2–5 stops: curated list, else the stone's own colour list (Wikidata), else dark/mid/light/pale shades of one colour
export function colorStops({ name = "", colors = [], base }) {
  const n = name.toLowerCase();
  if (MULTI[n]) return { stops: MULTI[n], how: "curated multi-colour" };
  const hexes = [];
  for (const c of colors) for (const [re, hex] of WORDS) if (re.test(String(c).toLowerCase())) {
    const [h1, s1, l1] = rgb2hsl(hex2rgb(hex));
    if (!hexes.some((x) => { const [h2, s2, l2] = rgb2hsl(hex2rgb(x)); return Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) < 25 && Math.abs(l1 - l2) < 20 && Math.abs(s1 - s2) < 30; })) hexes.push(hex);
    break;
  }
  if (hexes.length >= 2) {
    const h = hexes.slice(0, 3);
    return { stops: [mix(h[0], "#000000", 0.3), ...h, mix(h[h.length - 1], "#ffffff", 0.55)], how: "stone's colour list" };
  }
  const [h, s0, l] = rgb2hsl(hex2rgb(base));
  const s = s0 < 12 ? s0 : Math.max(s0, 35);
  const mid = l > 30 && l < 70 ? base : hsl2hex(h, s, l >= 70 ? 62 : 40);
  return { stops: [hsl2hex(h, s, clamp(l - 30, 12, 30)), mid, hsl2hex(h, s * 0.9, clamp(l + 18, 70, 84)), hsl2hex(h, s * 0.8, 94)], how: "shades of one colour" };
}

// "holo" style flag: iridescent stones get an animated holographic sheen on their pages
export const HOLO = /^(labradorite|spectrolite|.*moonstone|adularia|opal|precious opal|fire opal|(black|white|boulder|crystal|ethiopian|matrix|virgin valley|synthetic) opal|opal doublet & triplet|ammolite|rainbow obsidian|velvet obsidian|bismuth|fire agate|iris agate|iris quartz)$/i;
export function paletteFor(base, source, { name = "", colors = [] } = {}) {
  const [h, s, l] = rgb2hsl(hex2rgb(base));
  const grey = s < 12;
  const dark = luminance(base) < 0.18;
  const { stops, how } = colorStops({ name, colors, base });
  // light page: stops veiled with white; dark page: deep jewel tones of the same hues
  const pg = stops.map((c) => mix(c, "#ffffff", 0.32));
  const dk = stops.map((c) => { const [ch, cs, cl] = rgb2hsl(hex2rgb(c)); return hsl2hex(ch, cs < 12 ? cs : clamp(cs, 45, 85), clamp(cl * 0.32, 7, 24)); });
  // hero: real stone colours; pick the ink with the best worst-case contrast and add a scrim if needed
  // text sits over the first ~60% of the hero gradient (the photo covers the rest)
  const under = stops.slice(0, Math.max(2, Math.ceil(stops.length * 0.6)));
  const cW = Math.min(...under.map((c) => contrast(c, "#ffffff"))), cD = Math.min(...under.map((c) => contrast(c, "#1e1b3a")));
  const heroDark = cW >= cD;
  const worst = Math.max(cW, cD);
  const scrim = worst >= 4.5 ? "transparent" : heroDark ? `rgba(10,8,20,${worst < 2.5 ? 0.42 : 0.28})` : `rgba(255,255,255,${worst < 2.5 ? 0.5 : 0.32})`;
  const accent = grey ? (dark ? "#3a3a44" : "#4b4f6b") : hsl(h, Math.max(s, 45), Math.min(l, 32));
  const accentDk = grey ? "#d6d6e4" : hsl(h, Math.max(s, 55), 78);
  const g = (arr) => arr.join(",");
  const deep = mix(base, "#000000", dark ? 0.35 : 0.3);
  const key = [stops[0], stops[Math.floor(stops.length / 2)], stops[stops.length - 1]];
  return {
    base, source, dark, how, stops, holo: HOLO.test(name.trim()),
    style: [
      `--stone:${base}`, `--stone-deep:${deep}`, `--stone-accent:${accent}`, `--stone-accent-dk:${accentDk}`,
      `--pg:${g(pg)}`, `--dk:${g(dk)}`, `--hero:${g(stops)}`, `--hero-scrim:${scrim}`,
      `--hero-ink:${heroDark ? "#ffffff" : "#1e1b3a"}`, `--hero-ink-soft:${heroDark ? "rgba(255,255,255,.88)" : "rgba(30,27,58,.8)"}`,
      `--hero-chip:${heroDark ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.55)"}`,
      `--c1:${key[0]}`, `--c2:${key[1]}`, `--c3:${key[2]}`,
    ].join(";"),
    cardStyle: `--stone:${base};--stone-accent:${accent};--stone-accent-dk:${accentDk};--c1:${key[0]};--c2:${key[1]};--c3:${key[2]}`,
  };
}

export function pickColor({ name, colors = [], elements = [], parentBase = null }) {
  const n = (name || "").toLowerCase();
  if (CURATED[n]) return [CURATED[n], "curated"];
  for (const c of colors) for (const [re, hex] of WORDS) if (re.test(c.toLowerCase())) return [hex, "wikidata colour"];
  // whole-word colour names only (so "goldmanite" or "roselite" don't turn gold/pink)
  for (const [re, hex] of WORDS) if (new RegExp(`\\b(?:${re.source})\\b`).test(n) && !/crystal/.test(n)) return [hex, "name"];
  if (parentBase) return [parentBase, "parent"];
  for (const [el, hex] of CHEM) if (elements.includes(el)) return [hex, `chemistry (${el})`];
  return [NEUTRAL, "neutral"];
}
