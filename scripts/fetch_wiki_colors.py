"""Pull the 'color' field from English Wikipedia mineral infoboxes (for pages that have an enwiki article).
Writes data/wiki_colors.json {wikidata_id: "raw colour text"}. Used only to place stones on /colors/ pages."""
import json, os, re, time, urllib.parse, urllib.request
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
m = json.load(open(os.path.join(ROOT, "data/minerals.json")))
title2id = {urllib.parse.unquote(x["enwiki"].rsplit("/wiki/", 1)[1]).replace("_", " "): x["id"] for x in m if x.get("enwiki")}
out = {}
UA = {"User-Agent": "CrystopediaBuild/1.0 (https://crystopedia.com/; colour index)"}
def clean(v):
    v = re.sub(r"<ref[^>]*/>|<ref.*?</ref>|<!--.*?-->", "", v, flags=re.S)
    v = re.sub(r"\{\{[^{}]*\}\}", " ", v)
    v = re.sub(r"\[\[(?:[^|\]]*\|)?([^\]]*)\]\]", r"\1", v)
    v = re.sub(r"<[^>]+>", " ", v)
    return re.sub(r"\s+", " ", v).strip()[:300]
titles = list(title2id)
for i in range(0, len(titles), 50):
    batch = titles[i:i + 50]
    q = urllib.parse.urlencode({"action": "query", "prop": "revisions", "rvprop": "content", "rvslots": "main", "redirects": 1, "format": "json", "formatversion": 2, "titles": "|".join(batch)})
    for attempt in range(4):
        try:
            data = json.load(urllib.request.urlopen(urllib.request.Request("https://en.wikipedia.org/w/api.php?" + q, headers=UA), timeout=60)); break
        except Exception as e:
            print("retry", i, e); time.sleep(5 * (attempt + 1))
    else:
        continue
    redir = {r["to"]: r["from"] for r in data["query"].get("redirects", [])}
    norm = {n["to"]: n["from"] for n in data["query"].get("normalized", [])}
    for pg in data["query"]["pages"]:
        t = pg["title"]; src = redir.get(t, t); src = norm.get(src, src)
        qid = title2id.get(src) or title2id.get(t)
        if not qid or "revisions" not in pg: continue
        txt = pg["revisions"][0]["slots"]["main"]["content"]
        mm = re.search(r"\|\s*colou?r\s*=\s*(.*?)\n\s*\|", txt, re.S)
        if mm:
            c = clean(mm.group(1))
            if c: out[qid] = c
    time.sleep(0.5)
json.dump(out, open(os.path.join(ROOT, "data/wiki_colors.json"), "w"), indent=0, ensure_ascii=False, sort_keys=True)
print("colours for", len(out), "of", len(titles))
