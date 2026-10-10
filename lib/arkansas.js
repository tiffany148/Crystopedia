// Arkansas Stones & Fossils collection. Claims are limited to the linked sources.
const S = {
  ags: { label: "Arkansas Geological Survey", url: "https://geology.arkansas.gov/" },
  agsGem: { label: "Arkansas Geological Survey: Gemstones", url: "https://geology.arkansas.gov/minerals/industrial/gemstone.html" },
  crater: { label: "Arkansas State Parks: Crater of Diamonds", url: "https://www.arkansasstateparks.com/parks/crater-diamonds-state-park" },
  ouachita: { label: "USDA Forest Service: Ouachita NF rockhounding", url: "https://www.fs.usda.gov/r08/ouachita/recreation/opportunities/other" },
  usfs: { label: "USDA Forest Service: Collecting on National Forest lands (PDF)", url: "https://www.fs.usda.gov/Internet/FSE_DOCUMENTS/fseprd677552.pdf" },
  cfr: { label: "36 CFR § 327.14 (Corps of Engineers public property)", url: "https://www.law.cornell.edu/cfr/text/36/327.14" },
  monaLisa: { label: "Encyclopedia of Arkansas: Mona Lisa Mine", url: "https://encyclopediaofarkansas.net/entries/mona-lisa-mine-polk-county-18148/" },
  mauldin: { label: "Mindat: Mauldin Mountain quarries", url: "https://www.mindat.org/gl/16503" },
  arkansaurus: { label: "Wikipedia: Arkansaurus", url: "https://en.wikipedia.org/wiki/Arkansaurus" },
  magnetCove: { label: "Wikipedia: Magnet Cove", url: "https://en.wikipedia.org/wiki/Magnet_Cove,_Arkansas" },
  symbols: { label: "Arkansas Secretary of State: State symbols", url: "https://www.sos.arkansas.gov/education/arkansas-history/history-of-the-flag/state-symbols" },
};
export const ARK_SOURCES = S;
// map sites: [label, lat, lon, note]
export const ARK_SITES = [
  ["Crater of Diamonds State Park, Murfreesboro", 34.033, -93.672, "Public diamond-hunting site where you keep what you find (fee)"],
  ["Mount Ida: quartz crystal mines (Montgomery County)", 34.557, -93.634, "Fee-dig quartz mines around the 'Quartz Crystal Capital of the World'"],
  ["Crystal Vista, Ouachita National Forest", 34.51, -93.63, "Free Forest Service quartz-collecting site, personal use only"],
  ["Magnet Cove igneous complex (Hot Spring County)", 34.45, -92.84, "Lodestone, brookite, rutile and kimzeyite. Mostly private land"],
  ["Mauldin Mountain (Montgomery County)", 34.63, -93.72, "World-class green wavellite, plus variscite"],
  ["Mona Lisa mine, Little Porter Mountain (Polk County)", 34.18, -94.25, "Arkansas turquoise. The site was reclaimed in 1989–91"],
  ["Bauxite (Saline County)", 34.556, -92.51, "Historic bauxite (aluminum ore) district"],
  ["Hot Springs: novaculite whetstone quarries", 34.5, -93.05, "Arkansas novaculite ('Arkansas stone') whetstones"],
  ["Greers Ferry Lake (Corps of Engineers)", 35.52, -92.15, "Corps lake: removing rocks, minerals or fossils needs written permission"],
  ["Northwest Arkansas Ozarks (Pitkin & Fayetteville)", 36.06, -94.16, "Mississippian marine fossils: crinoids, brachiopods, bryozoans"],
  ["Arkansas River Valley (Pennsylvanian coal measures)", 35.3, -93.5, "Fossil plants: Lepidodendron, Stigmaria, Calamites"],
  ["Sevier County: Arkansaurus discovery site", 34.0, -94.2, "Early Cretaceous dinosaur, found in 1972"],
];
// collection sections; names must match page titles (missing ones are skipped with a warning)
export const ARK_SECTIONS = [
  ["State symbols", "Arkansas named quartz its state mineral, diamond its state gem and bauxite its state rock in 1967.", ["Arkansas Quartz", "Diamond", "Bauxite"]],
  ["Quartz of the Ouachitas", "The Ouachita Mountains around Mount Ida and Hot Springs are among the world's great sources of clear quartz crystals.", ["Arkansas Quartz", "Quartz", "Smoky Quartz", "Novaculite"]],
  ["Phosphates", "Aluminum phosphates fill fractures in chert and novaculite. The best-known sites are Mauldin Mountain and Avant (Garland County). Some blue-green 'turquoise' from Mauldin Mountain was actually planerite.", ["Wavellite", "Variscite", "Turquoise"]],
  ["Magnet Cove minerals", "Magnet Cove is a roughly 100-million-year-old (Cretaceous) igneous complex. It is famous for natural magnets (lodestone), brookite and rutile, and it is the type locality of kimzeyite garnet.", ["Lodestone", "Magnetite", "Brookite", "Rutile", "Kimzeyite", "Perovskite", "Schorlomite", "Miserite"]],
  ["Fossils", "Northwest Arkansas's Mississippian Pitkin Limestone and Fayetteville Shale hold marine fossils. Pennsylvanian rocks of the Arkansas River Valley preserve coal-swamp plants.", ["Lepidodendron", "Stigmaria", "Calamites", "Crinoid", "Brachiopod", "Blastoid"]],
];
export const ARK_TIPS = [
  ["Crater of Diamonds", "This is the world's only diamond-bearing site open to the public where you keep what you find. An entry fee applies. Diamonds here are often small, rounded and metallic-looking. Many visitors find them by surface searching after rain.", [S.crater]],
  ["National Forest (Ouachita)", "Casual collecting of small amounts of common minerals by hand is generally allowed for personal, non-commercial use. Digging beyond small hand tools, machinery and selling are not allowed. Crystal Vista is the designated free quartz site. Check with the ranger district first, because mining claims can restrict collecting.", [S.ouachita, S.usfs]],
  ["Corps of Engineers lakes", "On Corps lands, including Greers Ferry Lake, removing natural formations, mineral deposits or paleontological resources is prohibited without written permission from the District Commander.", [S.cfr]],
  ["Private land & fee mines", "Most of Magnet Cove and many quartz and phosphate sites are private. Ask permission, or use the commercial fee-dig mines around Mount Ida.", [S.ouachita, S.magnetCove]],
  ["Fossils on federal land", "Common invertebrate and plant fossils may be collected in small amounts for personal use on National Forest land. They can't be sold or traded, and vertebrate fossils need a permit.", [S.usfs]],
];
// extra notable localities for existing pages
export const ARK_LOCS = {
  Quartz: [["Mount Ida, Arkansas, USA", 34.557, -93.634]],
  "Smoky Quartz": [["Mount Ida area, Arkansas, USA", 34.557, -93.634]],
  Wavellite: [["Mauldin Mountain, Montgomery County, Arkansas, USA", 34.63, -93.72]],
  Variscite: [["Mauldin Mountain, Montgomery County, Arkansas, USA", 34.63, -93.72]],
  Turquoise: [["Mona Lisa mine, Polk County, Arkansas, USA", 34.18, -94.25]],
  Brookite: [["Magnet Cove, Arkansas, USA", 34.45, -92.84]],
  Rutile: [["Magnet Cove, Arkansas, USA", 34.45, -92.84]],
  Kimzeyite: [["Magnet Cove, Arkansas, USA", 34.45, -92.84]],
  Crinoid: [["Northwest Arkansas (Pitkin Limestone), USA", 36.06, -94.16]],
  Brachiopod: [["Northwest Arkansas (Pitkin Limestone), USA", 36.06, -94.16]],
};
