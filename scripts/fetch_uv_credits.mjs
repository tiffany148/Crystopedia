// Fetch author + license for the daylight and UV photos of UV-reactive stones -> data/uv_credits.json
import fs from "node:fs";
const m = await import("../src/_data/site.js"); const d = m.default;
const files = new Set();
for (const u of d.uvStones) { const p = d.pages.find((x) => x.url === u.url); for (const im of [p.img, p.parentImg, u.uv.uvImg]) if (im && !im.own && im.file) files.add(im.file); }
const out = fs.existsSync("data/uv_credits.json") ? JSON.parse(fs.readFileSync("data/uv_credits.json")) : {};
const todo = [...files].filter((f) => !out[f]);
const strip = (v) => String(v || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
for (let i = 0; i < todo.length; i += 40) {
  const batch = todo.slice(i, i + 40);
  const r = await fetch("https://commons.wikimedia.org/w/api.php?" + new URLSearchParams({ action: "query", titles: batch.map((f) => "File:" + f).join("|"), prop: "imageinfo", iiprop: "extmetadata", format: "json", formatversion: "2" }), { headers: { "User-Agent": "crystopedia/1.0 (tiffany148.github.io)" } });
  const j = await r.json();
  const norm = Object.fromEntries((j.query.normalized || []).map((n) => [n.to, n.from]));
  for (const pg of j.query.pages) {
    const md = pg.imageinfo?.[0]?.extmetadata || {}; const f = (norm[pg.title] || pg.title).replace(/^File:/, "");
    out[f] = { artist: strip(md.Artist?.value).slice(0, 80) || "Unknown", license: strip(md.LicenseShortName?.value) || "see file page" };
  }
  await new Promise((r) => setTimeout(r, 1500));
}
fs.writeFileSync("data/uv_credits.json", JSON.stringify(out, null, 1));
console.log(Object.keys(out).length, "credits");
