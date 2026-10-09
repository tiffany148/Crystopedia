"""Find a Wikimedia Commons photo for hand-made pages (no Wikidata image). Writes data/commons_images.json.
Existing entries are kept (edit the file by hand to fix a bad pick)."""
import json, os, urllib.parse, urllib.request, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
meta = json.load(open(os.path.join(ROOT, "data/metaphysical.json")))
out_p = os.path.join(ROOT, "data/commons_images.json")
out = json.load(open(out_p)) if os.path.exists(out_p) else {}
QUERY = {"Megalodon Tooth": "megalodon tooth fossil", "Fossil Coral": "agatized coral", "Amber with Inclusions": "insect in amber",
         "Opalized Fossil": "opalised fossil", "Dinosaur Bone": "agatized dinosaur bone", "Geode": "geode", "Amethyst Geode": "amethyst geode",
         "Quartz Geode": "quartz geode", "Calcite Geode": "calcite geode", "Celestite Geode": "celestine geode Madagascar", "Agate Geode": "agate geode",
         "Keokuk Geode": "Keokuk geode", "Las Choyas Geode": "Las Choyas geode", "Moroccan Geode": "geode Morocco", "Uruguayan Amethyst Geode": "amethyst geode Uruguay",
         "Trilobite": "trilobite fossil", "Ammonite": "ammonite fossil", "Orthoceras": "Orthoceras fossil", "Crinoid": "crinoid fossil", "Brachiopod": "brachiopod fossil",
         "K2 Jasper": "K2 stone azurite granite", "Kambaba Jasper": "stromatolite jasper", "Shiva Lingam": "Shiva lingam stone Narmada",
         "Strawberry Quartz": "strawberry quartz", "Tourmalinated Quartz": "tourmalinated quartz", "Spirit Quartz": "spirit quartz",
         "Crazy Lace Agate": "crazy lace agate", "Dendritic Agate": "dendritic agate", "Red Jasper": "red jasper", "Ocean Jasper": "ocean jasper",
         "Picture Jasper": "picture jasper", "Dalmatian Jasper": "dalmatian jasper", "Mookaite": "mookaite", "Zebra Jasper": "zebra jasper",
         "Polychrome Jasper": "polychrome jasper", "Blue Chalcedony": "blue chalcedony", "Watermelon Tourmaline": "watermelon tourmaline",
         "Mahogany Obsidian": "mahogany obsidian", "Rainbow Obsidian": "rainbow obsidian", "Jet": "jet gemstone Whitby", "Coral": "precious coral Corallium rubrum", "Sulfur": "sulfur crystals mineral"}
def search(q):
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"action": "query", "list": "search", "srsearch": f"{q} filetype:bitmap",
        "srnamespace": 6, "srlimit": 5, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": "CrystopediaBuild/1.0 (static site; image lookup)"})
    return [r["title"][5:] for r in json.load(urllib.request.urlopen(req, timeout=30))["query"]["search"]]
for m in meta:
    if m["wikidata"] or m["name"] in out: continue
    q = QUERY.get(m["name"], m["name"])
    try:
        res = search(q); time.sleep(0.3)
    except Exception as e:
        print("ERR", m["name"], e); continue
    if res:
        out[m["name"]] = res[0]
        print(f'{m["name"]:26} -> {res[0]}   | alts: {" ; ".join(res[1:3])}')
json.dump(out, open(out_p, "w"), indent=1, ensure_ascii=False)
