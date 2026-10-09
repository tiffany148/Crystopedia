# Crystopedia

An encyclopedia of every known mineral, crystal and gemstone, served at https://tiffany148.github.io/.

* **Data:** [Wikidata](https://www.wikidata.org/) (CC0): every *mineral species* (Q12089225), every *mineral variety* (Q429795), a few gem materials, and the items referenced by the metaphysical list.
* **Images:** hotlinked from Wikimedia Commons through `Special:FilePath?width=…`. Each image links to its Commons file page for credit and license. No images are stored in this repo.
* **Metaphysical data:** `scripts/metaphysical_src.py`, original short texts for about 185 popular stones. These are traditional beliefs, not scientific claims.
* **Site:** Eleventy 3 static site plus Pagefind search, deployed by GitHub Actions to GitHub Pages.

## Commands

```bash
npm ci
npm run metaphysical         # resolve metaphysical entries -> data/metaphysical.json (uses data/metaphysical_overrides.json)
npm run fetch                # pull Wikidata -> data/minerals.json (+ data/issues.json); cached in data/raw/
node scripts/fetch-wikidata.mjs --refresh   # ignore cache
npm run build                # eleventy + pagefind -> _site/
npm run serve                # local preview on :8080
```

## Data sanity checks (scripts/fetch-wikidata.mjs)

* Mohs hardness values outside 1–10 are dropped.
* Density is converted to g/cm³ from its Wikidata unit (kg/m³, g/L…). Values outside 0.5–23 g/cm³ are dropped.
* A dark or colored streak is dropped when the formula has no chromophore elements (e.g. quartz "black").
* Unrecognised crystal-system values are dropped. Everything that gets dropped or converted is logged in `data/issues.json`.

## Features added
* **Stone colors:** `lib/palette.js` picks each page's palette. It uses the curated color map first, then Wikidata colors, color words in the name, the parent stone, chemistry (Cu → green/teal, Fe → rust and so on), and finally a neutral lavender. Hub pages keep the multi-gem gradient.
* **Crystal Identifier** (`/identify/`): a client-side quiz using `/assets/identify-data.json`. Curated properties for the 185 popular stones live in `lib/identify-curated.js`, and other minerals use their Wikidata properties.
* **Pairings:** `lib/pairings.js` holds the hand-written pairings for popular stones, generated pairings (shared chakra/intention plus a balancing stone) for the rest, and the intention combos. `/pairings/` has the combo builder. `npm run pairings` exports `data/pairings.json` for review.
- **Fossils & Geodes** – `/fossils/` and `/geodes/` hubs. Facts (age, origin, composition, formation) live in `lib/collectibles.js`. Photos for hand-made pages are listed in `data/commons_images.json`; refresh them with `python3 scripts/find_commons_images.py`, which only fills missing names, so edit the JSON by hand to fix a bad pick.
- **Where it's found maps** – Leaflet + OpenStreetMap tiles (with attribution), loaded lazily when the map scrolls into view (`src/assets/map.js`).
  - Type localities (red diamond) come from Wikidata P2695/P189 coordinates.
  - Notable sources (stone-coloured dots) are curated in `lib/localities.js`.
  - Country of origin (P495) is shown as a fallback.
  - The section is hidden when there is no data.
