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
  "ocean jasper": "#7fae8e", "picture jasper": "#b8915d", "dalmatian jasper": "#e9e1d0", "mookaite": "#b5513f", "zebra jasper": "#d9d6cf",
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

export function paletteFor(base, source) {
  const [h, s, l] = rgb2hsl(hex2rgb(base));
  const grey = s < 12;
  const dark = luminance(base) < 0.18;
  // Page background: soft tint of the stone colour (always light, so body text stays dark & readable)
  const tint1 = grey ? hsl(h, s, dark ? 86 : 95) : hsl(h, Math.min(s, 80), 94);
  const tint2 = grey ? hsl(h, s, dark ? 76 : 88) : hsl(h, Math.min(s, 70), 84);
  // Hero band: the real stone colour, from base to a deeper shade
  const deep = mix(base, "#000000", dark ? 0.35 : 0.3);
  const glow = mix(base, "#ffffff", dark ? 0.18 : 0.35);
  const heroDark = luminance(base) < 0.38;
  // Accent for links/headings on light backgrounds: keep it dark enough for contrast
  const accent = grey ? (dark ? "#3a3a44" : "#4b4f6b") : hsl(h, Math.max(s, 45), Math.min(l, 32));
  return {
    base, source, dark,
    style: [
      `--stone:${base}`, `--stone-deep:${deep}`, `--stone-glow:${glow}`, `--stone-tint:${tint1}`, `--stone-tint2:${tint2}`,
      `--stone-accent:${accent}`, `--hero-ink:${heroDark ? "#ffffff" : "#1e1b3a"}`, `--hero-ink-soft:${heroDark ? "rgba(255,255,255,.85)" : "rgba(30,27,58,.75)"}`,
      `--hero-chip:${heroDark ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.55)"}`,
    ].join(";"),
    cardStyle: `--stone:${base};--stone-tint:${tint1};--stone-accent:${accent}`,
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
