"""Builds data/known_as.json: a short traditional 'known as' title plus 3-5 intention keywords for every
metaphysical stone. Curated titles for popular stones; others derived from each entry's own lore text."""
import json, re
D = json.load(open("data/metaphysical.json"))
INT = {
 "protection": r"protect|shield|ward|negativ|evil eye|psychic attack|emf",
 "love": r"love|heart|romanc|relationship|compassion|self-worth|forgiv|friendship|kindness",
 "abundance": r"abundan|wealth|prosper|money|success|manifest|business",
 "calm": r"calm|peace|sooth|anxiety|stress|tranquil|relax|serenit|balance",
 "sleep": r"sleep|dream|nightmare|insomnia",
 "focus": r"focus|clarity|concentrat|study|mental|memory|decision",
 "grounding": r"ground|root|stabil|earth|anchor|centr",
 "creativity": r"creativ|artist|inspir|imaginat|playful|joy",
 "intuition": r"intuit|psychic|third eye|spiritual|insight|wisdom|meditat|vision|higher",
 "healing": r"heal|vitality|recover|wellbeing|well-being|energy|renew",
 "confidence": r"confiden|courage|strength|empower|willpower|motivat|self-esteem|stamina",
 "luck": r"luck|fortune|opportunit|gambl",
 "communication": r"communicat|speak|express|truth|voice|throat",
 "cleansing": r"cleans|purif|clear(ing)? (energy|space)|detox|charg",
 "transformation": r"transform|change|new beginning|growth|rebirth|transition|evolution|shift",
}
KNOWN = {
 "Clear Quartz": ("The Master Healer", ["healing", "focus", "cleansing", "intuition"]),
 "Black Tourmaline": ("Stone of Protection", ["protection", "grounding", "cleansing"]),
 "Pyrite": ("Stone of Wealth & Abundance", ["abundance", "confidence", "protection", "luck"]),
 "Amethyst": ("Stone of Calm & Intuition", ["calm", "intuition", "sleep", "protection"]),
 "Rose Quartz": ("Stone of Unconditional Love", ["love", "calm", "healing"]),
 "Citrine": ("The Merchant's Stone", ["abundance", "confidence", "creativity", "luck"]),
 "Carnelian": ("Stone of Courage", ["confidence", "creativity", "healing"]),
 "Labradorite": ("Stone of Transformation", ["transformation", "intuition", "protection"]),
 "Moonstone": ("Stone of New Beginnings", ["intuition", "transformation", "calm", "sleep"]),
 "Selenite": ("The Cleansing Stone", ["cleansing", "calm", "intuition"]),
 "Smoky Quartz": ("Stone of Grounding & Release", ["grounding", "protection", "cleansing"]),
 "Tiger's Eye": ("Stone of Courage & Focus", ["confidence", "focus", "luck", "protection"]),
 "Green Aventurine": ("Stone of Opportunity", ["luck", "abundance", "healing"]),
 "Aventurine": ("Stone of Opportunity", ["luck", "abundance", "healing"]),
 "Jade": ("Stone of Good Fortune", ["luck", "abundance", "calm", "healing"]),
 "Malachite": ("Stone of Transformation", ["transformation", "protection", "healing"]),
 "Lapis Lazuli": ("Stone of Truth & Wisdom", ["communication", "intuition", "focus"]),
 "Sodalite": ("Stone of Logic & Truth", ["communication", "focus", "calm"]),
 "Fluorite": ("The Genius Stone", ["focus", "cleansing", "calm"]),
 "Hematite": ("Stone of Grounding", ["grounding", "protection", "focus", "confidence"]),
 "Obsidian": ("Stone of Truth & Protection", ["protection", "grounding", "cleansing"]),
 "Black Obsidian": ("Stone of Truth & Protection", ["protection", "grounding", "cleansing"]),
 "Shungite": ("Stone of Purification", ["cleansing", "protection", "healing"]),
 "Turquoise": ("The Traveller's Stone", ["protection", "healing", "communication", "luck"]),
 "Aquamarine": ("Stone of Courage at Sea", ["calm", "communication", "confidence"]),
 "Amazonite": ("Stone of Hope & Truth", ["communication", "calm", "luck"]),
 "Rhodochrosite": ("Stone of Compassion", ["love", "healing", "creativity"]),
 "Rhodonite": ("Stone of Forgiveness", ["love", "healing", "calm"]),
 "Garnet": ("Stone of Commitment", ["love", "confidence", "grounding"]),
 "Emerald": ("Stone of Successful Love", ["love", "abundance", "healing"]),
 "Ruby": ("Stone of Passion & Vitality", ["love", "confidence", "protection"]),
 "Sapphire": ("Stone of Wisdom", ["intuition", "focus", "protection"]),
 "Diamond": ("Stone of Invincibility", ["confidence", "love", "cleansing"]),
 "Moldavite": ("Stone of Rapid Transformation", ["transformation", "intuition"]),
 "Blue Kyanite": ("The Aligning Stone", ["communication", "calm", "cleansing"]),
 "Kyanite": ("The Aligning Stone", ["communication", "calm", "cleansing"]),
 "Black Kyanite": ("The Aligning Stone", ["grounding", "protection", "cleansing"]),
 "Celestite": ("Stone of the Heavens", ["calm", "sleep", "intuition", "communication"]),
 "Lepidolite": ("Stone of Transition", ["calm", "sleep", "transformation"]),
 "Howlite": ("Stone of Calm", ["calm", "sleep", "focus"]),
 "Sunstone": ("Stone of Joy & Leadership", ["confidence", "creativity", "abundance"]),
 "Bloodstone": ("Stone of Courage", ["confidence", "healing", "grounding"]),
 "Chrysocolla": ("Stone of Empowered Communication", ["communication", "calm", "creativity"]),
 "Prehnite": ("Stone of Unconditional Healing", ["healing", "calm", "intuition"]),
 "Peridot": ("Stone of Compassion & Renewal", ["abundance", "healing", "love"]),
 "Kunzite": ("Stone of Divine Love", ["love", "calm"]),
 "Morganite": ("Stone of Divine Love", ["love", "healing", "calm"]),
 "Larimar": ("The Dolphin Stone", ["calm", "communication", "healing"]),
 "Charoite": ("Stone of Transformation", ["transformation", "intuition", "protection"]),
 "Ametrine": ("Stone of Balance", ["calm", "creativity", "abundance"]),
 "Herkimer Diamond": ("Stone of Attunement", ["intuition", "sleep", "cleansing"]),
 "Apophyllite": ("Stone of Truth & Awakening", ["intuition", "calm", "cleansing"]),
 "Angelite": ("Stone of Awareness", ["calm", "communication", "intuition"]),
 "Blue Lace Agate": ("Stone of Calm Communication", ["communication", "calm"]),
 "Ocean Jasper": ("Stone of Joy", ["calm", "creativity", "healing"]),
 "Red Jasper": ("Stone of Endurance", ["grounding", "confidence", "healing"]),
 "Unakite": ("Stone of Vision", ["healing", "love", "grounding"]),
 "Ammonite": ("Stone of Change & Continuity", ["transformation", "grounding", "abundance"]),
 "Petrified Wood": ("Stone of Patience & Ancient Wisdom", ["grounding", "calm", "transformation"]),
 "Fire Agate": ("Stone of Inner Fire", ["confidence", "protection", "creativity"]),
 "Moss Agate": ("The Gardener's Stone", ["abundance", "grounding", "creativity"]),
 "Tree Agate": ("Stone of Plenitude", ["grounding", "abundance", "calm"]),
 "Spirit Quartz": ("Stone of Harmony", ["intuition", "cleansing", "love"]),
 "Ruby in Zoisite": ("Stone of Connectedness", ["love", "healing", "creativity"]),
 "Opal": ("Stone of Inspiration", ["creativity", "love", "transformation"]),
 "Mookaite": ("Stone of Adventure", ["confidence", "grounding", "transformation"]),
 "Septarian": ("The Dragon Stone", ["grounding", "communication", "calm"]),
 "Golden Healer Quartz": ("The Master Healer (golden)", ["healing", "confidence", "cleansing"]),
 "Record Keeper Quartz": ("Keeper of Ancient Wisdom", ["intuition", "focus"]),
 "Arkansas Quartz": ("Arkansas' Master Healer", ["healing", "cleansing", "focus", "grounding"]),
 "Black Moonstone": ("Stone of New Beginnings (dark moon)", ["protection", "intuition", "transformation"]),
 "Rainbow Moonstone": ("Stone of Hope", ["intuition", "sleep", "transformation"]),
 "Pyrite Sun": ("Stone of Abundance", ["abundance", "confidence", "luck"]),
 "Wavellite": ("Stone of Insight", ["intuition", "focus", "healing"]),
 "Scolecite": ("Stone of Deep Peace", ["calm", "sleep", "intuition"]),
 "Desert rose": ("Stone of Mental Clarity", ["focus", "calm", "grounding"]),
 "Azurite": ("Stone of Heaven", ["intuition", "focus"]),
 "Dalmatian Jasper": ("Stone of Playfulness", ["creativity", "protection", "grounding"]),
 "Zebra Jasper": ("Stone of Balance", ["grounding", "calm", "confidence"]),
 "Leopard Skin Jasper": ("The Shaman Stone", ["grounding", "protection", "confidence"]),
 "Fulgurite": ("Lightning Stone", ["transformation", "intuition", "communication"]),
 "Petoskey stone": ("Stone of Renewal", ["healing", "transformation", "calm"]),
}
SMALL = {"and", "of", "the", "for", "with", "in", "to", "a", "on"}
def title(s):
    w = s.replace(" and ", " & ").split()
    return " ".join(x if (x.lower() in SMALL and i) else (x if x == "&" else x[:1].upper() + x[1:]) for i, x in enumerate(w))
out = {}
for e in D:
    n = e["name"]
    KL = {a.lower(): b for a, b in KNOWN.items()}
    if n.lower() in KL:
        k, ints = KL[n.lower()]
    else:
        text = " ".join([e.get("meaning", "")] + e.get("uses", [])).lower()
        sc = [(len(re.findall(rx, text)), i) for i, rx in INT.items()]
        # uses weigh double: they are the stone's own stated purposes
        ut = " ".join(e.get("uses", [])).lower()
        sc = sorted(((c + len(re.findall(INT[i], ut)), i) for c, i in sc), reverse=True)
        ints = [i for c, i in sc if c > 0][:5]
        if len(ints) < 3:
            chak = {"Root": "grounding", "Sacral": "creativity", "Solar Plexus": "confidence", "Heart": "love", "Throat": "communication", "Third Eye": "intuition", "Crown": "intuition"}
            for c in e.get("chakras", []):
                if chak.get(c) and chak[c] not in ints: ints.append(chak[c])
            for f in ["healing", "calm", "grounding"]:
                if len(ints) < 3 and f not in ints: ints.append(f)
        u = (e.get("uses") or [""])[0]
        k = "Stone of " + title(u) if u and len(u.split()) <= 4 else "Stone of " + " & ".join(x.title() for x in ints[:2])
    out[n] = {"knownAs": k, "intentions": ints[:5]}
from known_as_fixes import FIX
for n, (t, ints) in FIX.items():
    if n in out:
        out[n]["knownAs"] = t
        if ints: out[n]["intentions"] = ints
    else: print("FIX miss:", n)
json.dump(out, open("data/known_as.json", "w"), indent=1, ensure_ascii=False)
import collections; c = collections.Counter(i for v in out.values() for i in v["intentions"])
dup = collections.Counter(v["knownAs"] for v in out.values()) if False else None
print(len(out), "stones;", sum(n.lower() in {a.lower() for a in KNOWN} for n in out), "curated;", dict(c))
print("unused curated:", [k for k in KNOWN if k.lower() not in {n.lower() for n in out}])
