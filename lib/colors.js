// Colour families for browsing. A stone can belong to several.
export const FAMILIES = [
  { slug: "red", label: "Red", hex: "#d62839", grad: "#7a0d1c,#d62839,#ff8a8a" },
  { slug: "orange", label: "Orange", hex: "#f07a1a", grad: "#8a3a06,#f07a1a,#ffc58a" },
  { slug: "yellow", label: "Yellow", hex: "#f2c81a", grad: "#8a6a06,#f2c81a,#fff1a0" },
  { slug: "gold", label: "Gold", hex: "#d4a72c", grad: "#6b4e0c,#d4a72c,#f7e3a0" },
  { slug: "green", label: "Green", hex: "#25a55f", grad: "#0a4d2a,#25a55f,#a8ecc4" },
  { slug: "teal", label: "Teal", hex: "#18a8a8", grad: "#0a4d52,#18a8a8,#a8f0ec" },
  { slug: "blue", label: "Blue", hex: "#2f6fd6", grad: "#0b1f5c,#2f6fd6,#a8c8ff" },
  { slug: "purple", label: "Purple", hex: "#8e44ad", grad: "#3b0f5c,#8e44ad,#d7b8ec" },
  { slug: "pink", label: "Pink", hex: "#ec6fa0", grad: "#8a1f4a,#ec6fa0,#ffd0e2" },
  { slug: "brown", label: "Brown", hex: "#8b5a2b", grad: "#3b2208,#8b5a2b,#d9b48a" },
  { slug: "black", label: "Black", hex: "#1f1f24", grad: "#000000,#2a2a30,#6a6a78" },
  { slug: "gray", label: "Gray", hex: "#8a8d96", grad: "#3a3c44,#8a8d96,#d6d8de" },
  { slug: "white-clear", label: "White & Clear", hex: "#eef3f8", grad: "#b8c4d2,#eef3f8,#ffffff" },
  { slug: "multicolor", label: "Multicolor & Iridescent", hex: "#a86fbf", grad: "#2e86de,#16a085,#f1c40f,#e74c3c,#8e44ad" },
];
// colour words (Wikidata colour labels, names) → families; order matters (specific first)
const WORDS = [
  [/play.of.colou?r|rainbow|multi.?colou?r|opalescen|schiller|labradorescen|iridescen/, ["multicolor"]],
  [/lavender|lilac|violet|purple|amethyst|plum|mauve|magenta/, ["purple"]],
  [/\bpink|rose|rosy|salmon|peach/, ["pink"]],
  [/crimson|scarlet|blood|ruby|cherry|\bred/, ["red"]],
  [/orange|tangerine|apricot/, ["orange"]],
  [/brass|golden|\bgold|amber/, ["gold"]],
  [/yellow|lemon|canary|straw|honey/, ["yellow"]],
  [/teal|turquoise|cyan|aqua|blue.?green|green.?blue/, ["teal"]],
  [/emerald|\bgreen|olive|lime|apple|grass|verd|jade|pistachio|mint/, ["green"]],
  [/\bblue|azure|navy|indigo|sky|cobalt|sapphire/, ["blue"]],
  [/brown|bronze|chocolate|\btan\b|rust|coffee|mahogany|beige|buff|cream|khaki/, ["brown"]],
  [/black|jet|ebony|sooty/, ["black"]],
  [/gr[ae]y|silver|steel|lead|smok|slate|tin.?white/, ["gray"]],
  [/white|milky|snow|ivory|colou?rless|clear|transparent|water/, ["white-clear"]],
];
export function familiesFromWords(list) {
  const out = new Set();
  for (const raw of list || []) {
    // ignore tarnish/alteration/streak/powder clauses ("tarnishes iridescent", "white in powder")
    const s = String(raw).toLowerCase().replace(/(tarnish|alter|weather|oxidi[sz]|powder|streak|in thin section|transmitted light)[^,;.]*/g, " ");
    for (const [re, fams] of WORDS) if (re.test(s)) fams.forEach((f) => out.add(f));
  }
  return out;
}
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function hsl(hex) {
  let [r, g, b] = hex2rgb(hex).map((v) => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  return [h, s * 100, l * 100];
}
// one hex → one family (null for extreme shading stops)
export function familyOfHex(hex, { allowExtremes = true } = {}) {
  const [h, s, l] = hsl(hex);
  if (l < 14) return allowExtremes ? "black" : null;
  if (l > 85 && s < 45) return allowExtremes ? "white-clear" : null;
  if (s < 25 && l > 70) return allowExtremes ? "white-clear" : null;
  if (s < 14 || (s < 22 && l > 80)) return l > 82 ? (allowExtremes ? "white-clear" : null) : l < 28 ? "black" : "gray";
  if (l > 93) return allowExtremes ? "white-clear" : null;
  if ((h < 45 || h >= 345) && l < 36 && s < 70 && !(h >= 345 || h < 12)) return "brown";
  if (h >= 345 || h < 12) return l > 70 ? "pink" : "red";
  if (h < 38) return l < 40 ? "brown" : "orange";
  if (h < 52) return s <= 85 && l >= 32 && l < 62 ? "gold" : l < 32 ? "brown" : "yellow";
  if (h < 68) return "yellow";
  if (h < 165) return "green";
  if (h < 195) return "teal";
  if (h < 255) return "blue";
  if (h < 300) return "purple";
  return "pink";
}

// coarse hue groups, so shades of one colour (brown→gold→yellow) don't count as "multicolor"
export const GROUP = { red: "warm", orange: "warm", yellow: "warm", gold: "warm", brown: "warm", green: "green", teal: "green", blue: "blue", purple: "violet", pink: "violet" };
