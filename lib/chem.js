// Chemical makeup for every full-page stone. data/chem.json holds curated formulas for varieties, trade names,
// rocks, fossils and organics (inherited from the parent mineral, checked against mindat/RRUFF/IMA list), plus fixes to bad Wikidata values.
// approx: true marks rocks, mixtures, glasses, organics and fossils, whose composition is only approximate.
import fs from "node:fs";
const SUB = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉", ".": ".", "-": "₋" };
// digits directly after an element symbol or a closing bracket become subscripts (coefficients after · or + stay full size)
export function subscript(f) {
  return String(f).replace(/([A-Za-z\)\]])([0-9][0-9.\-]*)/g, (m, a, n) => a + [...n.replace(/[.\-]$/, "")].map((c) => SUB[c] ?? c).join("") + (/[.\-]$/.test(n) ? n.slice(-1) : ""));
}
const EL = new Set("H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Th U".split(" "));
const GROUP = { "Tourmalines": ["Na", "Ca", "Li", "Mg", "Fe", "Al", "Si", "B", "O", "H"], "Garnet group": ["Ca", "Mg", "Fe", "Mn", "Al", "Cr", "Si", "O"] };
export function elementsOf(f, title) {
  if (GROUP[title]) return GROUP[title];
  const out = [];
  for (const m of String(f).replace(/[₀-₉]/g, "").matchAll(/[A-Z][a-z]?/g)) if (EL.has(m[0]) && !out.includes(m[0])) out.push(m[0]);
  return out;
}
const CHEM = JSON.parse(fs.readFileSync(new URL("../data/chem.json", import.meta.url), "utf8"));
export function chemFor(p) {
  const c = CHEM[p.title];
  const f = c ? subscript(c.f) : p.formula ? p.formula : null;
  if (!f) return null;
  const els = elementsOf(f, p.title);
  return { formula: f, note: c?.note || "", approx: !!c?.approx, elements: els.length ? els : p.elements || [], source: c ? "curated" : "wikidata" };
}
