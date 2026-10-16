// Verifies each candidate "Can also be found with" claim against the stone's Wikipedia article text.
// Output: lib/appearance_verified.json  { stone: { wiki, feats:[codes verified], dropped:[codes not found] } }
import fs from "node:fs";
import { FEATURES, FEATURE_INFO, EXTRA } from "../lib/appearance_features.js";
const cache = new Map();
async function text(title) {
  if (cache.has(title)) return cache.get(title);
  const u = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&redirects=1&format=json&titles=${encodeURIComponent(title)}`;
  let t = "";
  for (let i = 0; i < 6 && !t; i++) { try { const j = await (await fetch(u, { headers: { "user-agent": "crystopedia-verify/1.0" } })).json(); const pg = Object.values(j.query.pages)[0]; t = pg.extract || ""; } catch { await new Promise(r => setTimeout(r, 2500)); } }
  await new Promise(r => setTimeout(r, 400)); if (t) cache.set(title, t); return t;
}
const OUTF = new URL("../lib/appearance_verified.json", import.meta.url);
const prev = fs.existsSync(OUTF) ? JSON.parse(fs.readFileSync(OUTF)) : {};
const out = {};
for (const [stone, [wiki, codes]] of Object.entries(FEATURES)) {
  if (prev[stone]?.fetched && prev[stone].v2) { out[stone] = prev[stone]; continue; }
  const t = await text(wiki);
  const feats = [], dropped = [];
  const srcs = ["https://en.wikipedia.org/wiki/" + wiki.replace(/ /g, "_")];
  for (const c of codes) {
    if (t && FEATURE_INFO[c].re.test(t)) { feats.push(c); continue; }
    const ex = EXTRA.find(([ec, , sre]) => ec === c && sre.test(stone));
    if (ex) { const et = await text(ex[1]); if (et && FEATURE_INFO[c].re.test(et)) { feats.push(c); const u = "https://en.wikipedia.org/wiki/" + ex[1].replace(/ /g, "_"); if (!srcs.includes(u)) srcs.push(u); continue; } }
    dropped.push(c);
  }
  out[stone] = { wiki: srcs[0], sources: srcs, feats, dropped, fetched: !!t, v2: true };
}
fs.writeFileSync(new URL("../lib/appearance_verified.json", import.meta.url), JSON.stringify(out, null, 1));
const bad = Object.entries(out).filter(([, v]) => !v.fetched).map(([k]) => k);
console.log("stones", Object.keys(out).length, "feats", Object.values(out).reduce((a, v) => a + v.feats.length, 0), "dropped", Object.values(out).reduce((a, v) => a + v.dropped.length, 0), "unfetched", bad);
