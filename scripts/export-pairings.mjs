// Writes data/pairings.json (for review); the site computes the same thing at build time from lib/pairings.js
import fs from "node:fs";
import { buildPairings, INTENTIONS } from "../lib/pairings.js";
const meta = JSON.parse(fs.readFileSync("data/metaphysical.json", "utf8"));
fs.writeFileSync("data/pairings.json", JSON.stringify({ intentions: INTENTIONS, pairings: buildPairings(meta) }, null, 1));
console.log("wrote data/pairings.json");
