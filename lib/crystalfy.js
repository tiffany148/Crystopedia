// Crystal-fied extras shared by site (and available to the book): rarity, "Did You Know?" facts, colour-page quotes.
// Facts are DERIVED from the page's own data (Wikidata / curated tables); nothing is invented.
// Rarity is a documented proxy (see /about/#rarity), not a geological abundance measure.
export const RARE_OVERRIDES = { // well-known rare gem materials (GIA/Mindat references commonly cite these as rare)
  "benitoite": 5, "painite": 5, "red beryl": 5, "grandidierite": 5, "musgravite": 5, "jeremejevite": 5, "taaffeite": 5, "poudretteite": 5,
  "alexandrite": 4, "tanzanite": 4, "paraíba tourmaline": 4, "padparadscha": 4, "demantoid": 4, "black opal": 4,
};
export function rarityFor(p) {
  const k = p.title.toLowerCase();
  if (RARE_OVERRIDES[k]) return RARE_OVERRIDES[k];
  if (p.metaphysical?.length) return 1;           // stocked in ordinary crystal shops
  if (p.isGem || p.type === "gem" || p.type === "variety") return 2; // traded gem / variety
  const wiki = !!p.enwiki, photo = !!p.image;
  if (wiki && photo) return 3;
  if (wiki || photo) return 4;
  return 5;                                       // no Wikipedia article and no Commons photo: rarely seen
}
export const RARITY_LABEL = ["", "Common", "Easy to find", "Collector stone", "Rare", "Very rare"];

const QUARTZ_D = 2.65;
export function factsFor(p) {
  const out = [];
  const tl = (p.typeLocalities || [])[0];
  if (tl?.name) out.push(`Its type locality – the place the species was formally described from – is ${tl.name}${tl.country ? ", " + tl.country : ""}.`);
  if (p.uv?.waves?.length) out.push(`Under a UV lamp it can fluoresce (${p.uv.waves.join(", ").toLowerCase()}).`);
  if (p.densityMax && p.densityMax >= 4) out.push(`With a density up to ${+p.densityMax.toFixed(2)} g/cm³, it is about ${(p.densityMax / QUARTZ_D).toFixed(1)}× as heavy as the same size piece of quartz.`);
  if (p.mohsMax != null && p.mohsMax <= 2.5) out.push(`At Mohs ${p.mohsMax} it is soft enough to scratch with a fingernail.`);
  else if (p.mohsMin != null && p.mohsMin > 7) out.push(`At Mohs ${p.mohsMin}+ it is harder than quartz and will scratch glass and steel.`);
  if ((p.elements || []).length >= 6) out.push(`Its formula packs in ${p.elements.length} different elements: ${p.elements.join(", ")}.`);
  if (p.birthstones?.length) out.push(`It is a ${p.birthstones.map((b) => b.month).join(" & ")} birthstone.`);
  if (p.imaSymbol && !out.length) out.push(`Mineralogists abbreviate it “${p.imaSymbol}” – its official IMA symbol.`);
  return out.slice(0, 2);
}

// Colour-page lines: real folklore (labelled "Lore") or correctly attributed quotations.
export const COLOR_QUOTES = {
  red: { q: "Who can find a virtuous woman? for her price is far above rubies.", by: "Proverbs 31:10 (King James Bible)" },
  orange: { q: "Carnelian was set in rings and seals in ancient Egypt and Rome; signet stones of it pressed clean into hot wax.", by: "Lore · ancient seal-cutting" },
  yellow: { q: "Citrine takes its name from the French citron, “lemon”.", by: "Lore · gem naming" },
  gold: { q: "All that glisters is not gold.", by: "William Shakespeare, The Merchant of Venice (II.7)" },
  green: { q: "Pliny the Elder wrote that gem engravers rested their tired eyes by gazing at emerald.", by: "Lore · Pliny, Natural History, Book 37" },
  teal: { q: "Turquoise was carried by Persian and Turkish travellers as a protective talisman – its name means “Turkish stone”.", by: "Lore · gem naming" },
  blue: { q: "Ground lapis lazuli became ultramarine, the costly blue Renaissance painters saved for the Virgin's robes.", by: "Lore · art history" },
  purple: { q: "The Greek amethystos means “not intoxicated” – amethyst was said to guard against drunkenness.", by: "Lore · ancient Greece" },
  pink: { q: "Rose quartz is linked with Aphrodite and Eros in modern crystal lore, the stone of love.", by: "Lore · modern crystal tradition" },
  brown: { q: "Roman soldiers were said to carry tiger's eye for courage in battle.", by: "Lore · crystal tradition" },
  black: { q: "Elizabethan astrologer John Dee scried with a polished Aztec obsidian mirror, now in the British Museum.", by: "Lore · 16th-century England" },
  gray: { q: "Hematite's name comes from the Greek haima, “blood”, for its red streak.", by: "Lore · gem naming" },
  "white-clear": { q: "A diamond is forever.", by: "Frances Gerety, De Beers advertising slogan (1947)" },
  multicolor: { q: "Now the melancholy god protect thee; and the tailor make thy doublet of changeable taffeta, for thy mind is a very opal.", by: "William Shakespeare, Twelfth Night (II.4)" },
};
