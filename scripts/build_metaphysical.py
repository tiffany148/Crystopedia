"""Resolve metaphysical_src entries to Wikidata QIDs -> data/metaphysical.json.
Matches the cached dataset by English name first, then Wikidata search. Existing
QIDs in data/metaphysical_overrides.json win (manual fixes)."""
import json, os, sys, time, urllib.parse, urllib.request
sys.path.insert(0, os.path.dirname(__file__))
from metaphysical_src import ENTRIES
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(ROOT, "data/minerals.json")))
byname = {}
for x in data:
    byname.setdefault(x["name"].lower(), x)
ov_path = os.path.join(ROOT, "data/metaphysical_overrides.json")
overrides = json.load(open(ov_path)) if os.path.exists(ov_path) else {}

def search(q):
    url = "https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode(
        {"action": "wbsearchentities", "search": q, "language": "en", "type": "item", "limit": 5, "format": "json"})
    req = urllib.request.Request(url, headers={"User-Agent": "CrystopediaBuild/1.0"})
    return json.load(urllib.request.urlopen(req, timeout=30))["search"]

out = []
for name, lookup, kind, chakras, zodiac, elements, meaning, uses in ENTRIES:
    rec = dict(name=name, kind=kind, chakras=chakras, zodiac=zodiac, elements=elements, meaning=meaning, uses=uses)
    if name in overrides:
        o = overrides[name]
        rec["wikidata"], how = o.get("qid"), "override"
        if o.get("parent"): rec["parent"] = o["parent"]
    elif lookup.lower() in byname:
        rec["wikidata"], how = byname[lookup.lower()]["id"], "dataset"
    else:
        res = search(lookup); time.sleep(0.2)
        if res:
            rec["wikidata"], how = res[0]["id"], f"search: {res[0].get('label')} — {res[0].get('description','')}"
        else:
            rec["wikidata"], how = None, "UNRESOLVED"
    if not rec["wikidata"]: rec["slug"] = name.lower().replace("'", "").replace(" ", "-")
    print(f"{name:24} {rec['wikidata']}  [{how}]")
    out.append(rec)
json.dump(out, open(os.path.join(ROOT, "data/metaphysical.json"), "w"), indent=1, ensure_ascii=False)
print(len(out), "entries;", sum(1 for r in out if r["wikidata"]), "resolved")
