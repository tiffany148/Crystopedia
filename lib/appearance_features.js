// "Can also be found with" candidates per stone. Each claim is only SHOWN if the verification script
// (scripts/verify_appearance.mjs) finds supporting text in the stone's Wikipedia article (see lib/appearance_verified.json).
// codes: rainbow (iridescence / thin-film), star (asterism), cateye (chatoyancy), phantom, inclusions,
//        colorchange, play (play-of-color), adular (adularescence), labrador (labradorescence), aventur (aventurescence)
export const FEATURE_INFO = {
  rainbow:{label:"Rainbows (iridescence)",icon:"🌈",re:/iridescen|rainbow|thin[- ]film|play of colou?r|diffract/i},
  star:{label:"Stars (asterism)",icon:"⭐",re:/asteris|star (sapphire|ruby|garnet|effect)|six-rayed|four-rayed|star-like/i},
  cateye:{label:"Cat's-eye (chatoyancy)",icon:"👁️",re:/chatoyan|cat'?s[- ]eye/i},
  phantom:{label:"Phantoms",icon:"👻",re:/phantom/i},
  inclusions:{label:"Notable inclusions",icon:"🔍",re:/inclusion/i},
  colorchange:{label:"Color change",icon:"🎨",re:/colou?r[- ]chang|alexandrite effect|tenebresc/i},
  play:{label:"Play-of-color",icon:"✨",re:/play[- ]of[- ]colou?r/i},
  adular:{label:"Adularescence (moonstone glow)",icon:"🌙",re:/adulari?escen|adularia/i},
  labrador:{label:"Labradorescence (flash)",icon:"💫",re:/labradoresc|schiller|iridescen/i},
  aventur:{label:"Aventurescence (glitter)",icon:"✦",re:/aventures|aventurine|glitter|spangl/i},
};
// stone title (lowercase) -> [wikipedia article title or "", feature codes]
export const FEATURES = {
  "ammolite":["Ammolite",["rainbow"]],"bismuth":["Bismuth",["rainbow"]],"bornite":["Bornite",["rainbow"]],
  "chalcopyrite":["Chalcopyrite",["rainbow"]],"covellite":["Covellite",["rainbow"]],"fire agate":["Fire agate",["rainbow"]],
  "iris agate":["Agate",["rainbow"]],"agate":["Agate",["rainbow"]],"hematite":["Hematite",["rainbow"]],
  "nacre":["Nacre",["rainbow"]],"pearl":["Pearl",["rainbow"]],"freshwater mussel shell":["Nacre",["rainbow"]],
  "rainbow obsidian":["Obsidian",["rainbow"]],"obsidian":["Obsidian",["rainbow"]],"gold sheen obsidian":["Obsidian",["rainbow"]],
  "silver sheen obsidian":["Obsidian",["rainbow"]],"rainbow moonstone":["Moonstone (gemstone)",["adular","rainbow"]],
  "calcite":["Calcite",["phantom","inclusions"]],"fluorite":["Fluorite",["phantom","colorchange"]],"iceland spar":["Calcite",["rainbow"]],
  "quartz":["Quartz",["phantom","inclusions","star","cateye"]],"amethyst":["Amethyst",["phantom"]],"smoky quartz":["Smoky quartz",["phantom"]],
  "arkansas quartz":["Quartz",["phantom","inclusions"]],"garden quartz":["Quartz",["phantom","inclusions"]],
  "rutilated quartz":["Rutilated quartz",["inclusions"]],"needle quartz":["Rutilated quartz",["inclusions"]],
  "tourmalinated quartz":["Quartz",["inclusions"]],"rose quartz":["Rose quartz",["star"]],"star rose quartz":["Rose quartz",["star"]],
  
  "emerald":["Emerald",["inclusions","cateye","star"]],"aquamarine":["Aquamarine (gem)",["cateye","star","inclusions"]],
  "beryl":["Beryl",["cateye","star","inclusions"]],"star beryl":["Beryl",["star"]],
  "amber":["Amber",["inclusions"]],"amber with inclusions":["Amber",["inclusions"]],"baltic amber":["Baltic amber",["inclusions"]],
  "copal":["Copal",["inclusions"]],"dendritic agate":["Agate",["inclusions"]],"moss agate":["Moss agate",["inclusions"]],
  "diamond":["Diamond",["inclusions","colorchange"]],
  "alexandrite":["Alexandrite",["colorchange","cateye"]],"chrysoberyl":["Chrysoberyl",["cateye","colorchange"]],
  "hackmanite":["Hackmanite",["colorchange"]],"sapphire":["Sapphire",["star","colorchange","inclusions"]],
  "star sapphire":["Star sapphire",["star"]],"black star sapphire":["Star sapphire",["star"]],"star ruby":["Ruby",["star"]],
  "ruby":["Ruby",["star","inclusions"]],"corundum":["Corundum",["star"]],"star spinel":["Spinel",["star"]],"star garnet":["Garnet",["star"]],
  "garnet group":["Garnet",["star","colorchange"]],"almandine":["Almandine",["star"]],"star diopside":["Diopside",["star","cateye"]],
  "star moonstone":["Moonstone (gemstone)",["star","adular"]],
  "moonstone":["Moonstone (gemstone)",["adular","cateye","star"]],"black moonstone":["Moonstone (gemstone)",["adular"]],
  "blue moonstone":["Moonstone (gemstone)",["adular"]],"gray moonstone":["Moonstone (gemstone)",["adular"]],
  "green moonstone":["Moonstone (gemstone)",["adular"]],"white moonstone":["Moonstone (gemstone)",["adular"]],
  "peach moonstone":["Moonstone (gemstone)",["adular"]],"red moonstone":["Moonstone (gemstone)",["adular"]],
  "cat's-eye moonstone":["Moonstone (gemstone)",["cateye","adular"]],
  "tiger's eye":["Tiger's eye",["cateye"]],"falcon's eye":["Tiger's eye",["cateye"]],"tiger-iron":["Tiger's eye",["cateye"]],
  "apatite":["Apatite",["cateye"]],"tourmalines":["Tourmaline",["cateye","inclusions"]],"nephrite":["Nephrite",["cateye"]],
  "selenite":["Selenite (mineral)",["cateye"]],"satin spar":["Gypsum",["cateye"]],"pietersite":["Pietersite",["cateye"]],
  "opal":["Opal",["play"]],"black opal":["Opal",["play"]],"white opal":["Opal",["play"]],"boulder opal":["Opal",["play"]],
  "crystal opal":["Opal",["play"]],"ethiopian opal":["Opal",["play"]],"fire opal":["Fire opal",["play"]],"precious opal":["Opal",["play"]],
  "matrix opal":["Opal",["play"]],"virgin valley opal":["Opal",["play"]],"opal doublet & triplet":["Opal",["play"]],
  "labradorite":["Labradorite",["labrador"]],"larvikite":["Larvikite",["labrador"]],"sunstone":["Sunstone",["aventur"]],
  "aventurine":["Aventurine",["aventur"]],"fuchsite":["Muscovite",["aventur"]],"goldstone":["Goldstone (glass)",["aventur"]],
  "iolite-sunstone":["Sunstone",["aventur"]],
};

// Backup evidence: a general article on the effect that names the stone family (only used when the stone's own article lacks the claim).
export const EXTRA = [
  ["phantom", "Phantom quartz", /quartz|amethyst/],
  ["star", "Asterism (gemology)", /ruby|sapphire|garnet|diopside|spinel|rose quartz|corundum|almandine/],
  ["cateye", "Chatoyancy", /quartz|chrysoberyl|beryl|aquamarine|charoite|tourmaline|labradorite|selenite|apatite|moonstone|tiger/],
];
