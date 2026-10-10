// Builds /workspace/crystopedia-book/photo-wishlist.md: popular/hand-made pages lacking a good photo.
import fs from "node:fs";
const { default: s } = await import("../src/_data/site.js");
const IM = JSON.parse(fs.readFileSync("/workspace/crystopedia-book/images-all.json")).images || {};
const own = JSON.parse(fs.readFileSync("data/own_photos.json"));
const MAXIN = 3.1;
const part1 = s.pages.filter((p) => p.metaphysical.length || p.handmade || p.facts);
const section = (p) => {
  const g = p.facts?.group, c = p.collection, t = p.title;
  if (g === "star" || g === "cats-eye") return "Star stones & cat's-eyes";
  if (g === "obsidian") return "Obsidian family";
  if (g === "moonstone" || /moonstone/i.test(t)) return "Moonstone types";
  if (g === "calcite" || /calcite/i.test(t)) return "Calcite family";
  if (g === "opal" || /opal/i.test(t)) return "Opal family";
  if (g === "aragonite" || /aragonite/i.test(t)) return "Aragonite family";
  if (g === "halite" || /halite/i.test(t)) return "Halite family";
  if (g === "amber" || /amber|copal/i.test(t)) return "Amber family";
  if (/agate/i.test(t) && c !== "geode") return "Agates";
  if (c === "fossil") return "Fossils";
  if (c === "geode") return "Geodes & nodules";
  if (p.hazard) return "Handle With Care";
  if (s.arkansas.sections.some((x) => x.cards.some((cd) => cd.url === p.url))) return "Arkansas";
  return "Popular stones & gems";
};
const A = [], B = [], C = [];
for (const p of part1) {
  if (own[p.title]?.src) continue;
  const row = { t: p.title, url: `https://crystopedia.com${p.url}`, sec: section(p) };
  if (!p.img) { (p.parentImg ? B : A).push(row); continue; }
  const x = IM[p.title];
  if (x?.cw && x.cw / 300 < MAXIN) C.push({ ...row, note: `${x.cw}px wide → prints ${(x.cw / 300).toFixed(1)}" of ${MAXIN}" at 300 dpi` });
}
const group = (rows) => { const m = {}; for (const r of rows) (m[r.sec] ||= []).push(r); return Object.entries(m).sort(); };
const block = (title, desc, rows) => `## ${title} (${rows.length})\n\n${desc}\n\n` + group(rows).map(([sec, list]) =>
  `### ${sec} (${list.length})\n\n` + list.sort((a, b) => a.t.localeCompare(b.t)).map((r) => `- [ ] **${r.t}**: ${r.url}${r.note ? ` (${r.note})` : ""}`).join("\n")).join("\n\n") + "\n";
const md = `# Crystopedia photo wishlist\n\nGenerated ${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })} CT. These are stones where your own photo would help the website and the book. ` +
`Covers every popular, metaphysical and hand-made page (${part1.length} pages). Pages that already use your photos are skipped.\n\n` +
`**Photo tips:** for the book, shoot at least ~1000 px across the stone (any modern phone is fine). Use soft daylight, a plain background and the whole stone in frame. ` +
`Send the files and I'll strip location data, crop and clean the background (see data/own_photos.json).\n\n` +
`**Totals:** A, no photo: ${A.length} · B, parent or placeholder photo: ${B.length} · C, low-res (prints small in the book): ${C.length}\n\n` +
block("A. No photo at all", "These pages show only a placeholder gem icon.", A) + "\n" +
block("B. Using a parent or placeholder photo", "These pages borrow the photo of their parent mineral (for example, Star Ruby shows a rough ruby crystal).", B) + "\n" +
block("C. Low-res photo (prints small in the book)", `The current photo is too small to fill the ${MAXIN}" book photo slot at 300 dpi.`, C);
fs.writeFileSync("/workspace/crystopedia-book/photo-wishlist.md", md);
console.log("pages", part1.length, "A", A.length, "B", B.length, "C", C.length);
