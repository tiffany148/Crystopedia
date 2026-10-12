// Stone pattern flags: name regex -> pattern key. Patterns are SVG tiles in /assets/patterns/ (white on transparent),
// used as CSS masks over a palette-tinted layer, so one file serves every stone colour, light and dark.
export const PATTERN_RULES = [
  [/stalactite/i, "flower"],
  [/malachite/i, "malachite"],
  [/wavellite/i, "wavellite"],
  [/blue lace/i, "bluelace"],
  [/crazy lace|mexican lace|laguna|condor/i, "crazylace"],
  [/fortification|dryhead|fairburn|lake superior|eye agate/i, "fortification"],
  [/moss|dendrit|tree agate|plume/i, "moss"],
  [/zebra/i, "zebra"],
  [/ocean jasper|orbicular|poppy/i, "orbs"],
  [/leopard/i, "leopard"],
  [/picture jasper|landscape|owyhee|biggs/i, "picture"],
  [/tiger|hawk|cat.?s.?eye|falcon|pietersite/i, "tigereye"],
  [/snowflake/i, "snowflake"],
  [/labradorite|spectrolite/i, "crackle"],
  [/moonstone|adularia/i, "schiller"],
  // Blue banded zinc ores (and trade "banded hemimorphite") share the wavy-band look
  [/hemimorphite|smithsonite|rhodochrosite|onyx|banded/i, "bands"],
  // Stacked "book page" layers (Thousand Layer Quartz)
  [/thousand layer|layered quartz/i, "layers"],
  [/lapis|sodalite/i, "veins"],
  [/turquoise|variscite/i, "spiderweb"],
  [/ammonite|ammolite|nautilus/i, "ammonite"],
  [/petrified wood|wood opal|fossil wood|palm/i, "woodrings"],
  [/fluorite/i, "fluorite"],
  [/selenite|satin spar/i, "striations"],
  [/rutil|needle|tourmalinated|angel hair/i, "needles"],
  [/dalmatian/i, "dalmatian"],
  [/geode|druz|thunderegg/i, "druzy"],
  [/pyrite sun|pyrite dollar/i, "sunrays"],
  [/desert rose|barite rose/i, "petals"],
  [/scolecite|okenite|mesolite|natrolite|stilbite/i, "sprays"],
  [/crinoid|blastoid/i, "crinoid"],
  [/trilobite/i, "trilobite"],
  [/agate|jasper|chalcedony|carnelian|onyx/i, "agate"],
];
const SYS = { cubic: "cubic", isometric: "cubic", hexagonal: "hexagonal", trigonal: "hexagonal", tetragonal: "tetragonal",
  orthorhombic: "orthorhombic", monoclinic: "monoclinic", triclinic: "triclinic" };
export function patternFor(name, system) {
  for (const [re, k] of PATTERN_RULES) if (re.test(name || "")) return k;
  const s = String(system || "").toLowerCase();
  for (const k in SYS) if (s.includes(k)) return "lattice-" + SYS[k];
  return "lattice-amorphous";
}
