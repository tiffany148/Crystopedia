// "Handle With Care" — hazardous minerals. Only hazards backed by the linked sources are stated.
// icons: rad = radioactive, ingest = toxic if ingested, dust = dust/fibre inhalation, soluble = water-soluble, noelixir = no water elixirs
const W = (t) => ({ label: `Wikipedia: ${t}`, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(t.replace(/ /g, "_"))}` });
const M = (t) => ({ label: `Mindat: ${t}`, url: `https://www.mindat.org/search.php?search=${encodeURIComponent(t)}` });
const ATSDR = {
  uranium: { label: "ATSDR ToxFAQs: Uranium", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=439&toxid=77" },
  thorium: { label: "ATSDR ToxFAQs: Thorium", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=659&toxid=121" },
  arsenic: { label: "ATSDR ToxFAQs: Arsenic", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=19&toxid=3" },
  mercury: { label: "ATSDR ToxFAQs: Mercury", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=113&toxid=24" },
  lead: { label: "ATSDR ToxFAQs: Lead", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=93&toxid=22" },
  asbestos: { label: "ATSDR ToxFAQs: Asbestos", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=29&toxid=4" },
  antimony: { label: "ATSDR ToxFAQs: Antimony", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=331&toxid=58" },
  thallium: { label: "ATSDR ToxFAQs: Thallium", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=308&toxid=49" },
  copper: { label: "ATSDR ToxFAQs: Copper", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=205&toxid=37" },
  fluoride: { label: "ATSDR ToxFAQs: Fluorides", url: "https://wwwn.cdc.gov/TSP/ToxFAQs/ToxFAQsDetails.aspx?faqid=211&toxid=38" },
};
const USGS_ASB = { label: "USGS: Asbestos & other natural mineral fibres", url: "https://www.usgs.gov/centers/geology-energy-and-minerals-science-center/science/asbestos-and-other-natural-mineral-fibers" };
const EPA_RAD = { label: "US EPA RadTown: radioactive material in rocks & minerals", url: "https://www.epa.gov/radtown" };

export const HAZARD_ICONS = {
  rad: { icon: "☢", label: "Radioactive" },
  ingest: { icon: "☠", label: "Toxic if ingested" },
  dust: { icon: "😷", label: "Dust / fibre inhalation hazard" },
  soluble: { icon: "💧", label: "Water-soluble or water-sensitive" },
  noelixir: { icon: "🚫", label: "Don't make water elixirs" },
};
export const HAZARD_GROUPS = [
  ["radioactive", "☢ Radioactive"], ["arsenic", "Arsenic minerals"], ["mercury", "Mercury"], ["lead", "Lead minerals"],
  ["fibrous", "Asbestos & fibrous minerals"], ["thallium-antimony", "Thallium & antimony"], ["copper", "Copper & soluble salts"], ["other", "Other cautions"],
];
const RAD_SAFE = "Store in a closed container in a ventilated place away from living areas, and label it. Don't keep it in pockets or bedrooms. Wash your hands after handling, never crush or grind it, and keep it away from children and pets.";
const DUST_SAFE = "Handle it as a solid specimen only. Never cut, sand, polish or grind it. If you must clean it, do so wet, wear a P100 / FFP3 mask and gloves, and keep it away from children and pets.";
const TOX_SAFE = "Wash your hands after handling. Don't lick it, put it in your mouth, or make elixirs with it. Don't cut or grind it. Display it out of reach of children and pets.";

const H = (name, group, severity, icons, why, safe, src) => ({ name, group, severity, icons, why, safe, src });
export const HAZARDS = [
  H("Uraninite", "radioactive", "high", ["rad", "ingest", "dust", "noelixir"], "The main uranium ore. It is strongly radioactive, and the decay of its uranium gives off radon gas. Swallowing or breathing in its dust exposes the body to uranium and its radioactive daughter products.", RAD_SAFE, [W("Uraninite"), ATSDR.uranium, M("Uraninite")]),
  H("Autunite", "radioactive", "high", ["rad", "dust", "noelixir"], "A calcium uranyl phosphate. It is radioactive and glows bright green-yellow under UV. It slowly dehydrates and crumbles, which makes radioactive dust.", RAD_SAFE + " Keep it in a sealed box to slow dehydration.", [W("Autunite"), ATSDR.uranium, M("Autunite")]),
  H("Torbernite", "radioactive", "high", ["rad", "dust", "noelixir"], "A copper uranyl phosphate. It is radioactive, and over time it loses water and changes to metatorbernite, which crumbles easily and releases radon.", RAD_SAFE, [W("Torbernite"), ATSDR.uranium, M("Torbernite")]),
  H("Carnotite", "radioactive", "high", ["rad", "ingest", "dust", "noelixir"], "A potassium uranyl vanadate, historically mined for uranium and radium. It is radioactive and often powdery, so it easily makes dust.", RAD_SAFE, [W("Carnotite"), ATSDR.uranium, M("Carnotite")]),
  H("Uranophane", "radioactive", "high", ["rad", "dust", "noelixir"], "A calcium uranyl silicate that forms fine, needle-like crystals. It is radioactive.", RAD_SAFE, [W("Uranophane"), ATSDR.uranium, M("Uranophane")]),
  H("Thorianite", "radioactive", "high", ["rad", "dust", "noelixir"], "Thorium dioxide, often with uranium. It is highly radioactive.", RAD_SAFE, [W("Thorianite"), ATSDR.thorium, M("Thorianite")]),
  H("Zircon", "radioactive", "low", ["rad"], "Most gem zircon is safe to wear. Zircon can contain trace uranium and thorium, though, and 'metamict' zircon (crystal structure damaged by its own radiation, typically green, low-type zircon) can be measurably radioactive.", "Ordinary cut zircon needs no special care. Store strongly metamict specimens like other radioactive minerals and don't grind them.", [W("Zircon"), M("Zircon")]),
  H("Realgar", "arsenic", "high", ["ingest", "dust", "noelixir"], "Arsenic sulfide (As₄S₄). It is toxic if swallowed or if its dust is inhaled. Light breaks it down into a yellow powder (pararealgar), which makes handling dust likely.", TOX_SAFE + " Store it in the dark in a closed box.", [W("Realgar"), ATSDR.arsenic, M("Realgar")]),
  H("Orpiment", "arsenic", "high", ["ingest", "dust", "noelixir"], "Arsenic trisulfide (As₂S₃), once used as a pigment ('King's yellow'). It is toxic if swallowed or if its dust is inhaled. It is soft and flaky and sheds particles easily.", TOX_SAFE, [W("Orpiment"), ATSDR.arsenic, M("Orpiment")]),
  H("Arsenopyrite", "arsenic", "moderate", ["ingest", "dust", "noelixir"], "Iron arsenic sulfide, the main arsenic ore. It gives off a garlic smell when struck or heated (arsenic). It weathers to arsenic oxides.", TOX_SAFE + " Never heat it.", [W("Arsenopyrite"), ATSDR.arsenic, M("Arsenopyrite")]),
  H("Scorodite", "arsenic", "moderate", ["ingest", "dust", "noelixir"], "A hydrated iron arsenate. It contains a lot of arsenic.", TOX_SAFE, [W("Scorodite"), ATSDR.arsenic, M("Scorodite")]),
  H("Cinnabar", "mercury", "high", ["ingest", "dust", "noelixir"], "Mercury sulfide (HgS), the main ore of mercury. Heating it releases toxic mercury vapour. Its dust and powder (historically the pigment vermilion) are toxic if swallowed or inhaled.", TOX_SAFE + " Never heat it, and only polish it wet with protection, if at all.", [W("Cinnabar"), ATSDR.mercury, M("Cinnabar")]),
  H("Galena", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead sulfide (PbS), the main lead ore. Lead is toxic if swallowed or inhaled as dust. It is especially harmful to children.", TOX_SAFE, [W("Galena"), ATSDR.lead, M("Galena")]),
  H("Cerussite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead carbonate. It is toxic if swallowed or if its dust is inhaled.", TOX_SAFE, [W("Cerussite"), ATSDR.lead, M("Cerussite")]),
  H("Vanadinite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead vanadate chloride. It contains lead and vanadium, both harmful if swallowed or inhaled.", TOX_SAFE, [W("Vanadinite"), ATSDR.lead, M("Vanadinite")]),
  H("Crocoite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead chromate. It contains lead and hexavalent chromium and is toxic if swallowed or inhaled as dust. The crystals are also very fragile.", TOX_SAFE, [W("Crocoite"), ATSDR.lead, M("Crocoite")]),
  H("Wulfenite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead molybdate. It contains lead.", TOX_SAFE, [W("Wulfenite"), ATSDR.lead, M("Wulfenite")]),
  H("Anglesite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead sulfate. It contains lead.", TOX_SAFE, [W("Anglesite"), ATSDR.lead, M("Anglesite")]),
  H("Pyromorphite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead phosphate chloride. It contains lead.", TOX_SAFE, [W("Pyromorphite"), ATSDR.lead, M("Pyromorphite")]),
  H("Mimetite", "lead", "moderate", ["ingest", "dust", "noelixir"], "Lead arsenate chloride. It contains both lead and arsenic.", TOX_SAFE, [W("Mimetite"), ATSDR.lead, ATSDR.arsenic]),
  H("Chrysotile", "fibrous", "high", ["dust", "noelixir"], "White asbestos, a serpentine mineral. Breathing in its fibres can cause asbestosis, lung cancer and mesothelioma. Intact specimens are a risk only if they shed fibres.", DUST_SAFE + " Keep it sealed in a closed, labelled box.", [W("Chrysotile"), ATSDR.asbestos, USGS_ASB]),
  H("Crocidolite", "fibrous", "high", ["dust", "noelixir"], "Blue asbestos, the fibrous form of riebeckite, and one of the most hazardous asbestos types. Tiger's eye forms when quartz replaces or encloses crocidolite fibres. Polished tiger's eye is considered safe because the fibres are locked in quartz, but don't cut or grind it.", DUST_SAFE, [W("Riebeckite"), W("Tiger's eye"), ATSDR.asbestos, USGS_ASB]),
  H("Tremolite", "fibrous", "moderate", ["dust", "noelixir"], "Fibrous (asbestiform) tremolite is regulated as asbestos. Massive or crystalline tremolite is not fibrous, but it can occur together with fibres.", DUST_SAFE, [W("Tremolite"), ATSDR.asbestos, USGS_ASB]),
  H("Actinolite", "fibrous", "moderate", ["dust", "noelixir"], "Fibrous actinolite is a regulated asbestos mineral. Gem nephrite jade is a dense, felted actinolite-tremolite that is safe when polished, but it shouldn't be dry-cut.", DUST_SAFE, [W("Actinolite"), ATSDR.asbestos, USGS_ASB]),
  H("Stibnite", "thallium-antimony", "moderate", ["ingest", "dust", "noelixir"], "Antimony sulfide. Antimony is toxic if swallowed or inhaled as dust. The crystals are soft and brittle.", TOX_SAFE, [W("Stibnite"), ATSDR.antimony, M("Stibnite")]),
  H("Hutchinsonite", "thallium-antimony", "high", ["ingest", "dust", "noelixir"], "A thallium lead arsenic sulfosalt. Thallium and arsenic are both highly toxic.", TOX_SAFE, [W("Hutchinsonite"), ATSDR.thallium, ATSDR.arsenic]),
  H("Chalcanthite", "copper", "moderate", ["ingest", "soluble", "noelixir"], "Natural copper sulfate (CuSO₄·5H₂O). It dissolves readily in water, even in humid air or sweat. Copper sulfate is harmful if swallowed. Many bright blue 'chalcanthite' specimens on the market are lab-grown.", "Keep it dry in a sealed container. Never put it in water or near food. Wash your hands after touching it.", [W("Chalcanthite"), ATSDR.copper, M("Chalcanthite")]),
  H("Malachite", "copper", "low", ["ingest", "dust", "noelixir"], "Copper carbonate hydroxide. Polished pieces are safe to handle. Its dust, from cutting or polishing, is harmful to breathe or swallow, and it is not suitable for water elixirs.", "Handling and wearing it is fine. Cut or polish it only wet with a mask, and don't make elixirs.", [W("Malachite"), ATSDR.copper, M("Malachite")]),
  H("Azurite", "copper", "low", ["ingest", "dust", "noelixir"], "A copper carbonate closely related to malachite. Its dust and powder are harmful if swallowed or inhaled.", "Handling it is fine. Don't grind it or make elixirs, and keep it dry.", [W("Azurite"), ATSDR.copper, M("Azurite")]),
  H("Atacamite", "copper", "low", ["ingest", "dust", "noelixir"], "Copper chloride hydroxide. It is harmful if swallowed or inhaled as dust.", TOX_SAFE, [W("Atacamite"), ATSDR.copper, M("Atacamite")]),
  H("Villiaumite", "copper", "high", ["ingest", "soluble", "noelixir"], "Sodium fluoride. It is water-soluble and toxic if swallowed.", "Keep it sealed and dry. Never put it in water. Wash your hands after handling.", [W("Villiaumite"), ATSDR.fluoride, M("Villiaumite")]),
  H("Fluorite", "other", "low", ["dust", "noelixir"], "Calcium fluoride. Solid pieces are safe to handle and not very soluble. It is not recommended for elixirs, though, and its dust shouldn't be swallowed or inhaled.", "Handling it is fine. Avoid elixirs and dry grinding.", [W("Fluorite"), ATSDR.fluoride]),
  H("Pyrite", "other", "low", ["noelixir"], "Iron sulfide. Damp pyrite can slowly oxidise ('pyrite decay'), forming sulfuric acid and iron sulfates. It may also contain traces of arsenic.", "Keep it dry, with low humidity. Don't make water elixirs.", [W("Pyrite"), M("Pyrite")]),
  H("Marcasite", "other", "low", ["noelixir"], "Iron sulfide that decays even more readily than pyrite when damp, releasing sulfuric acid.", "Keep it dry. Don't make water elixirs.", [W("Marcasite"), M("Marcasite")]),
  H("Uranium Glass", "radioactive", "low", ["rad", "noelixir"], "Man-made glass coloured with a small amount of uranium (often around 2% by weight). It glows bright green under UV light. Its radioactivity is low, and ordinary handling and display are considered low-risk.", "Display and handling are fine. Don't grind or drill it, and don't use chipped pieces for food or drink.", [W("Uranium glass"), EPA_RAD]),
];

// Elixir-safety notes shown on the Metaphysical section (water-unsafe or water-sensitive stones)
export const ELIXIR_NOTES = {
  Selenite: "Selenite (gypsum) is soft and slightly water-soluble. Water dulls and dissolves its surface, so keep it dry.",
  Gypsum: "Gypsum is slightly water-soluble and soft. Keep it dry.",
  Halite: "Halite (rock salt) dissolves in water.",
  Celestine: "Celestine is a soft strontium sulfate that can fade or etch. Keep it dry and out of strong sunlight.",
  Chrysocolla: "Chrysocolla is a soft, porous copper mineral, so avoid water elixirs.",
  Turquoise: "Turquoise is porous and contains copper. Water, oils and soaps can discolour it.",
  "Lapis lazuli": "Lapis is porous and often contains pyrite. Avoid long soaks in water.",
  Kyanite: "Kyanite is usually fine with water, but it is not suitable for drinking elixirs.",
  Lepidolite: "Lepidolite is a lithium mica that flakes, so avoid water elixirs.",
  Angelite: "Angelite (anhydrite) slowly turns to gypsum in water. Keep it dry.",
};
export const ELIXIR_DEFAULT = "This stone is not safe for water or drinking elixirs. If you use elixirs at all, use the indirect method (stone in a sealed glass inside the water) or choose a different stone.";
