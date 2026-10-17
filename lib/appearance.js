// "What It Looks Like" + "Can also be found with" data, shared by the site (src/mineral.njk) and the book (build_sections.mjs).
// CURATED entries: [color, form/habit, typical size, luster & transparency, notable look]. Written from standard references
// (Wikipedia / Mindat / GIA / Smithsonian pages for each stone; see the stone's own source links). Stones not listed here
// get a conservative GENERIC description built only from the site's own mineral data and are flagged generic:true.
import fs from "node:fs";
import { FEATURE_INFO } from "./appearance_features.js";
let VER = {};
try { VER = JSON.parse(fs.readFileSync(new URL("./appearance_verified.json", import.meta.url), "utf8")); } catch {}
const C = {
"agate":["Banded or patterned in almost any color: white, gray, blue, red, brown, yellow","Rounded nodules and geode linings with concentric or parallel bands","Pebbles to boulders; nodules from thumbnail-size to over 30 cm","Waxy to glassy; translucent to nearly opaque","Cut slices show the banding clearly"],
"alexandrite":["Green to bluish-green in daylight, purplish-red under incandescent light","Rare twinned, pseudo-hexagonal crystals; usually seen as cut gems","Mostly small gems; stones over a few carats are very rare","Glassy; transparent","The strong daylight-to-lamplight color change is its signature"],
"amazonite":["Light to bright blue-green or teal, often with white veining","Blocky crystals in pegmatites; usually cut as cabochons, beads and eggs","Polished pieces palm-sized or smaller; crystals can reach tens of centimeters","Glassy to pearly; translucent to opaque","Fine crossing lines (twinning) give a tile-like look"],
"amber":["Honey yellow to orange and brown; rarely red, green, blue or nearly white","Irregular nuggets, drips and flows; no crystals","Small pebbles to fist-sized lumps or larger","Resinous; transparent to translucent","Fossil tree resin; may hold insects, plant bits or bubbles"],
"amethyst":["Pale lilac to deep royal purple, often deepest at the crystal tips","Six-sided prisms with pyramid tips, clustered in geodes and on matrix","Crystals from tiny points to over 30 cm; clusters can be huge","Glassy; transparent to translucent","Color can fade in strong sunlight"],
"ametrine":["Purple and golden-yellow in one crystal, in sharp color sectors","Faceted gems and polished slabs cut from sector-zoned quartz","Gems of a few carats; rough from small pieces to hand-sized","Glassy; transparent","Amethyst and citrine growing together in a single crystal"],
"ammolite":["Iridescent red and green with flashes of orange, yellow and blue","Thin, cracked, plate-like patches on fossil ammonite shell","Thin layers; polished pieces from a few millimeters to palm-sized","Iridescent; translucent to opaque","The color comes from thin aragonite layers in the shell, not from dye"],
"ammonite":["Tan, gray, brown or golden; some shells are replaced by pyrite or calcite","Flat spiral coil, often split to show chambers","Coin-sized to wheel-sized; most are 2 to 15 cm","Dull to pearly; metallic if replaced by pyrite","Extinct shelled sea animals related to squid and octopus"],
"apatite":["Blue, green, yellow, purple, pink or brown; neon blue-green is popular","Hexagonal prisms with flat or pyramid ends, or massive","Crystals from millimeters to over 10 cm","Glassy; transparent to translucent","Soft for a gem, so it scratches easily"],
"apophyllite":["Colorless, white, pale green, pink or yellow","Square prisms with flat or pyramid tips and pearly faces, often clustered on basalt","Crystals from millimeters to several centimeters; clusters hand-sized or larger","Glassy to pearly; transparent to translucent","Often grows with green stilbite in basalt cavities"],
"aquamarine":["Pale sky blue to deeper greenish-blue","Six-sided prisms, often long and striated","Gems from small to very large; crystals from millimeters to over a meter","Glassy; transparent","Usually very clean and clear"],
"aragonite":["White, colorless, yellow, brown, pale blue or gray","Needle-like columns, pseudo-hexagonal twins and coral-like branches","Crystals millimeters to several centimeters; clusters hand-sized","Glassy to resinous; transparent to translucent","Same chemistry as calcite but a different crystal structure"],
"azurite":["Deep azure to midnight blue","Short prisms, rosettes and nodules, often with green malachite","Crystals millimeters to a few centimeters; masses larger","Glassy to dull; translucent to opaque","Often found with malachite as azure-malachite"],
"baryte":["Colorless, white, yellow, blue, brown or gray","Tabular or bladed crystals, clusters and roses","Crystals millimeters to over 10 cm","Glassy to pearly; transparent to translucent","Unusually heavy for a non-metallic mineral"],
"benitoite":["Vivid sapphire blue; sometimes purple, pink or colorless","Flat triangular crystals on white natrolite","Crystals up to a few centimeters; gems usually under 1 carat","Glassy; transparent","Glows bright blue under shortwave UV; found in San Benito County, California"],
"beryl":["Colorless, green, blue, yellow, pink or red depending on variety","Long six-sided prisms, often striated","Crystals from millimeters to several meters","Glassy; transparent to translucent","Emerald, aquamarine and morganite are all beryl"],
"bismuth":["Silver-pink metal with a rainbow oxide skin","Stair-step hopper crystals; most pieces on the market are lab-grown from molten metal","Typically 2 to 10 cm","Metallic; opaque","The rainbow comes from a thin oxide layer on the surface"],
"bornite":["Bronze when fresh; tarnishes to purple, blue and pink","Massive; cubic crystals are rare","Pieces from small to hand-sized","Metallic; opaque","Nicknamed peacock ore for its tarnish colors"],
"calcite":["Colorless, white, yellow, orange, pink, green, blue, brown or black","Rhombohedral crystals, pointed dogtooth crystals or massive forms","Crystals from millimeters to over a meter","Glassy to pearly; transparent to opaque","Fizzes in weak acid and is soft (Mohs 3)"],
"carnelian":["Orange to red-brown, sometimes peach","Rounded pebbles and nodules; usually polished","Small pebbles to palm-sized","Waxy to glassy; translucent","Colored by iron oxide; often heat-treated"],
"celestine":["Pale blue, white or colorless","Tabular or bladed crystals, or massive","Crystals millimeters to several centimeters","Glassy to pearly; transparent to translucent","Soft pale blue is typical; often grows in geodes"],
"cerussite":["Colorless, white or gray","Twinned crystals, star-shaped sixlings and reticulated masses","Crystals millimeters to several centimeters","Diamond-like to glassy; transparent to translucent","Very bright shine for a mineral; contains lead"],
"chalcedony":["White, gray, blue, brown or pink","Crusts, botryoidal (grape-like) masses and stalactites","Pieces from small to hand-sized or larger","Waxy; translucent","Made of microscopic quartz fibers"],
"chalcopyrite":["Brass yellow, often with a purple-blue-green tarnish","Wedge-shaped crystals or massive","Crystals mm to cm; masses larger","Metallic; opaque","The rainbow tarnish earns it the name peacock ore"],
"charoite":["Violet to lilac with white and black swirls","Massive, fibrous swirling masses","Polished pieces small to palm-sized","Silky to pearly; translucent to opaque","Found only in the Murun massif in Siberia"],
"chrysoberyl":["Yellow, yellow-green, golden or brown","Tabular or twinned crystals; cut as gems","Gems usually under 10 carats","Glassy; transparent to translucent","Alexandrite and cat's-eye are both chrysoberyl"],
"chrysocolla":["Bright blue to blue-green","Botryoidal crusts and massive pieces, often with malachite","Pieces small to hand-sized","Glassy to earthy; translucent to opaque","Soft and easily scratched"],
"chrysoprase":["Apple to deep green","Massive chalcedony; cut as cabochons and beads","Pieces small to palm-sized","Waxy; translucent","Colored by nickel"],
"cinnabar":["Bright red to scarlet or brownish-red","Massive, granular crusts; crystals are rare","Pieces small to hand-sized","Diamond-like to dull; transparent to opaque","The main ore of toxic mercury"],
"citrine":["Pale yellow to golden orange or brownish-orange","Six-sided points and clusters","Crystals from small to over 30 cm","Glassy; transparent","Most citrine on the market is heat-treated amethyst"],
"covellite":["Deep indigo blue with purple and brassy iridescence","Thin plates and massive","Pieces small to hand-sized","Metallic to submetallic; opaque","Often shows a bright purple-blue shimmer"],
"danburite":["Colorless, pale yellow or pink","Elongated prisms with wedge-shaped ends","Crystals millimeters to several centimeters","Glassy; transparent","Usually very clear"],
"diamond":["Colorless, yellow or brown; rarely blue, pink or green","Octahedral crystals; usually cut as brilliant gems","Gems from small to over 100 carats","Brilliant (adamantine); transparent","The hardest natural mineral (Mohs 10)"],
"dioptase":["Intense emerald green to blue-green","Small six-sided crystals in clusters","Crystals millimeters to a few centimeters","Glassy; transparent to translucent","Rare and fragile"],
"emerald":["Bright green to bluish-green","Six-sided prisms","Gems small to large; crystals from millimeters to over 10 cm","Glassy; transparent to translucent","Almost always contains fine fractures and inclusions called jardin"],
"epidote":["Pistachio green to dark green or nearly black","Striated prisms or massive","Crystals millimeters to several centimeters","Glassy; transparent to opaque","Often grows as sprays on matrix"],
"fluorite":["Purple, green, blue, yellow, pink or colorless; often zoned","Cubes and octahedra, or massive","Crystals millimeters to over 30 cm","Glassy; transparent to translucent","Often glows blue or violet under UV"],
"fulgurite":["Gray, tan, brown or black","Hollow glassy tubes with rough sandy outsides","Tubes from a few centimeters to over 30 cm","Glassy inside; sandy outside","Formed when lightning melts sand"],
"galena":["Bright silvery lead-gray","Cubes and octahedra, or massive","Crystals mm to several cm; masses larger","Metallic; opaque","Very heavy; the main ore of lead"],
"garnet group":["Red, orange, yellow, green, brown, purple, pink or black","Rounded dodecahedral or trapezohedral crystals","Crystals millimeters to several centimeters","Glassy to resinous; transparent to opaque","A group of related minerals, not one species"],
"gypsum":["Colorless, white, gray, brown or pink","Tabular crystals, rosettes, fibrous masses and giant blades","Crystals from millimeters to many meters","Glassy to pearly or silky","So soft a fingernail scratches it"],
"halite":["Colorless, white, pink, blue or gray","Cubes and granular masses","Crystals millimeters to many centimeters","Glassy; transparent to translucent","Table salt; it dissolves in water"],
"hematite":["Steel gray to black; red-brown streak","Tabular crystals, kidney-shaped botryoidal masses and rosettes","Pieces small to hand-sized","Metallic to dull","An important iron ore; polished pieces are bright silver"],
"hemimorphite":["Pale blue, white or colorless","Botryoidal crusts and fan-like sprays","Pieces small to hand-sized","Glassy to silky; translucent","Blue-green stones are often sold as gems"],
"herkimer diamond":["Clear, sometimes with a smoky tint","Short, double-terminated quartz crystals","Typically 1 to 5 cm","Glassy; transparent","Not a diamond but quartz from Herkimer County, New York"],
"howlite":["White with gray or black veins","Nodules and cauliflower-like masses","Tumbles and pieces a few centimeters across","Dull to slightly glassy; opaque","Porous, so often dyed blue to imitate turquoise"],
"iceland spar":["Clear and colorless","Transparent rhombs of calcite","Typically 2 to 10 cm","Glassy; transparent","Shows a double image through the crystal"],
"iolite":["Violet-blue to gray-blue, shifting with the viewing angle","Short prisms; cut as gems","Gems usually small","Glassy; transparent","Strong pleochroism: different colors from different directions"],
"jade":["Green most common; also lavender, white, yellow or black","Dense, tough, massive stone","Pieces small to boulder-sized","Waxy to glassy; translucent","The name covers two minerals: jadeite and nephrite"],
"jadeite":["Green, lavender, white, orange or black","Massive and tough; carved or cut as cabochons","Pieces small to boulders","Glassy to waxy; translucent","The rarer of the two jades"],
"kyanite":["Blue, sometimes white, gray or green","Long bladed crystals","Blades several centimeters long","Glassy to pearly; transparent to translucent","Hardness differs along and across the blade"],
"labradorite":["Gray to dark gray body with blue, gold, green or orange flashes","Massive; polished pieces and cabochons","Pieces from small to boulder-sized","Glassy to pearly; translucent to opaque","The flash is seen only at certain angles"],
"lapis lazuli":["Deep royal blue with gold pyrite flecks and white calcite","Massive rock","Pieces small to hand-sized","Dull to waxy; opaque","The blue comes from lazurite"],
"larimar":["Sky blue to blue-green with white swirls","Massive pectolite","Pieces small to palm-sized","Silky to glassy; translucent","Found only in the Dominican Republic"],
"lepidolite":["Lilac, purple, pink or gray","Scaly masses of tiny mica flakes","Pieces small to hand-sized","Pearly; translucent","A lithium-bearing mica"],
"magnetite":["Black","Octahedral crystals and massive","Crystals millimeters to several centimeters","Metallic; opaque","Strongly attracted to a magnet"],
"malachite":["Bright to dark green in concentric bands","Botryoidal masses and fibrous crusts","Pieces from small to hand-sized or larger","Silky to glassy; opaque","Banded rings show its growth layers"],
"moldavite":["Olive to bottle green","Rough, wrinkled, sculpted glass pieces","Typically 1 to 5 cm","Glassy; transparent to translucent","A natural glass made by a meteorite impact in Central Europe"],
"moonstone":["Colorless, white, peach, gray or blue with a floating blue-white glow","Massive feldspar; polished into cabochons","Cabochons a few mm to several cm","Glassy to pearly; translucent","The glow moves as you turn the stone"],
"moss agate":["Clear to milky with green, moss-like patterns","Slabs and tumbled pieces","Pieces small to palm-sized","Waxy to glassy; translucent","The green fern-like patterns are mineral inclusions, not plants"],
"muscovite":["Colorless, silver, pale green, brown or pink","Thin, flexible sheets and books","Sheets mm to over a meter","Pearly to glassy; transparent in thin sheets","Peels into clear flexible sheets"],
"native copper":["Copper red; tarnishes brown or green","Branching dendrites, sheets and nuggets","Pieces from small to boulder-sized","Metallic; opaque","Conducts electricity"],
"obsidian":["Black, brown, gray, green or red","Smooth volcanic glass","Pieces from small to boulders","Glassy; opaque to translucent","Breaks with razor-sharp curved edges"],
"opal":["White, gray, black, orange, blue and others","Massive, veins and nodules; no crystals","Gems small to large; rough pieces to hand-sized","Waxy to glassy; transparent to opaque","Precious opal flashes spectral color"],
"peridot":["Olive to lime green","Prisms, or rounded grains in basalt","Gems small to large","Glassy; transparent","Gem-quality olivine"],
"petrified wood":["Brown, red, yellow, gray or multicolored","Logs and pieces with preserved wood grain","Pieces from small to huge logs","Waxy to dull; opaque","Wood replaced by silica, with growth rings often visible"],
"pyrite":["Brass yellow","Cubes, pyritohedrons and masses","Crystals millimeters to several centimeters","Metallic; opaque","Nicknamed fool's gold"],
"quartz":["Colorless, white, purple, yellow, pink, brown, gray or black","Six-sided prisms with pyramid tips, or massive","Crystals from tiny to meters long","Glassy; transparent to opaque","Many named varieties share the same chemistry (SiO2)"],
"rose quartz":["Pale pink to rose","Usually massive; crystals are rare","Pieces from small to boulder-sized","Glassy to greasy; translucent","Often cloudy"],
"rhodochrosite":["Pink to rose red, often banded","Rhombs, stalactites and banded masses","Crystals up to several centimeters","Glassy to pearly; translucent","Soft and easily scratched"],
"rhodonite":["Pink to rose red with black manganese veins","Massive; rare crystals","Pieces small to hand-sized","Glassy; translucent","Black veins are manganese oxide"],
"ruby":["Pink to deep red","Hexagonal barrel-shaped crystals","Gems from small to a few carats","Glassy; transparent to translucent","Red corundum; color from chromium"],
"rutilated quartz":["Clear to smoky quartz with golden, silvery or reddish needles","Quartz with included rutile needles; cut as cabochons or polished","Pieces small to hand-sized","Glassy; transparent to translucent","The needles are rutile crystals"],
"sapphire":["Blue most common; also yellow, pink, green, purple and orange","Hexagonal barrel-shaped crystals","Gems from small to several carats","Glassy; transparent to translucent","Corundum of any color except red"],
"selenite":["Colorless to white","Long, flat, flexible-looking blades","Blades to many centimeters","Pearly to silky; transparent to translucent","Soft; dissolves slowly in water"],
"smoky quartz":["Light brown to nearly black","Six-sided prisms","Crystals small to large","Glassy; transparent to translucent","Color comes from natural radiation"],
"sodalite":["Deep blue with white veins","Massive","Pieces small to hand-sized","Glassy to greasy; translucent to opaque","White calcite veins are common"],
"sphalerite":["Yellow, brown, black or reddish","Dodecahedral crystals and masses","Crystals mm to several cm","Resinous to adamantine; transparent to opaque","Main ore of zinc"],
"spinel":["Red, pink, blue, purple, black or orange","Octahedral crystals","Gems small; crystals millimeters to centimeters","Glassy; transparent","Red spinel was once mistaken for ruby"],
"sunstone":["Orange, red-brown or golden with sparkly flashes","Massive feldspar; cut as gems and cabochons","Gems small to a few cm","Glassy; transparent to translucent","Tiny copper or hematite flakes glitter inside"],
"tanzanite":["Blue-violet","Prismatic crystals","Gems small to several carats","Glassy; transparent","Shows different colors from different directions"],
"tiger's eye":["Golden brown with silky bands","Fibrous quartz; polished into cabochons and tumbles","Pieces small to palm-sized","Silky; opaque to translucent","Moving silky band of light"],
"topaz":["Colorless, yellow, orange, pink, blue or brown","Prismatic crystals with striations","Crystals mm to over 30 cm","Glassy; transparent","Perfect cleavage, so it can split if struck"],
"tourmalines":["Black, pink, green, blue, red, brown or multicolored","Striated prisms with a rounded triangular cross-section","Crystals from millimeters to over a meter","Glassy; transparent to opaque","Color can change along one crystal"],
"turquoise":["Sky blue to green","Massive crusts and nodules","Pieces small to hand-sized","Waxy; opaque","Often has a dark or brown host rock (matrix)"],
"unakite":["Pink and olive green speckled","Massive granite","Pieces small to hand-sized","Dull to glassy; opaque","Pink feldspar with green epidote"],
"zircon":["Colorless, brown, red, yellow, green or blue","Tetragonal prisms with pointed ends","Crystals mm to several cm","Brilliant to glassy; transparent","Among the oldest minerals on Earth"],
};
const alias = { "amethyst geode":"amethyst","agate geode":"agate","blue lace agate":"agate","botswana agate":"agate","baltic amber":"amber","amber with inclusions":"amber","blue amber":"amber","star rose quartz":"rose quartz","needle quartz":"rutilated quartz","arkansas quartz":"quartz","garden quartz":"quartz","record keeper quartz":"quartz","thousand layer quartz":"quartz","spirit quartz":"quartz","blue topaz":"topaz","star ruby":"ruby","star sapphire":"sapphire","black star sapphire":"sapphire","star beryl":"beryl","goshenite":"beryl","heliodor":"beryl","morganite":"beryl","blue moonstone":"moonstone","gray moonstone":"moonstone","green moonstone":"moonstone","white moonstone":"moonstone","peach moonstone":"moonstone","rainbow moonstone":"moonstone","black moonstone":"moonstone","red moonstone":"moonstone","star moonstone":"moonstone","cat's-eye moonstone":"moonstone","iolite-sunstone":"iolite","cordierite":"iolite","indicolite":"tourmalines","verdelite":"tourmalines","watermelon tourmaline":"tourmalines","rubellite":"tourmalines","schorl":"tourmalines","celestite geode":"celestine","calcite geode":"calcite","dogtooth calcite":"calcite","manganoan calcite":"calcite","amethyst stalactite":"amethyst","black opal":"opal","white opal":"opal","boulder opal":"opal","crystal opal":"opal","ethiopian opal":"opal","precious opal":"opal","fire opal":"opal","matrix opal":"opal","virgin valley opal":"opal","rainbow obsidian":"obsidian","gold sheen obsidian":"obsidian","silver sheen obsidian":"obsidian","velvet obsidian":"obsidian","mahogany obsidian":"obsidian","snowflake obsidian":"obsidian" };
// Entries that need their own text because the alias differs (color/look is not the parent's)
const OVERRIDE = {
"blue topaz":["Pale sky blue to deep London or Swiss blue","Faceted gems; natural crystals are usually colorless or pale","Gems usually 1 to 50 carats","Glassy; transparent","Most blue topaz is irradiated and heated colorless topaz"],
"star ruby":["Pink to deep red body with a six-rayed white star","Polished dome-shaped cabochons","Cabochons from about 1 to over 50 carats","Glassy; translucent to opaque","The star shows best under a single light"],
"star sapphire":["Blue to gray with a white six-rayed star; also pink, yellow","Polished dome-shaped cabochons","Cabochons from about 1 to over 100 carats","Glassy; translucent to opaque","The star moves as the stone or light moves"],
"black star sapphire":["Black to dark gray body with a white or golden star","Polished dome-shaped cabochons","Cabochons from about 1 to over 100 carats","Glassy; opaque to translucent","Six- or twelve-rayed star from fine needles inside"],
"star rose quartz":["Pale pink with a six-rayed white star","Polished spheres and cabochons","Spheres from a few cm to palm-sized","Glassy; translucent","The star is best seen when lit from behind or from above"],
"rainbow moonstone":["Colorless to white body with a blue-white glow and rainbow flashes","Polished cabochons and beads","Cabochons a few mm to several cm","Glassy to pearly; translucent","A white-bodied labradorite-family feldspar sold as rainbow moonstone"],
"black moonstone":["Dark gray to black with a blue or silvery flash","Polished cabochons and tumbled pieces","A few centimeters across","Glassy to pearly; translucent to opaque","The glow is called adularescence"],
"gold sheen obsidian":["Black with a golden shimmer","Smooth volcanic glass; sheen shows on polished surfaces","Pieces small to hand-sized","Glassy with a golden sheen; opaque to translucent","The sheen comes from tiny aligned gas bubbles"],
"rainbow obsidian":["Black with bands of purple, green, blue, gold and red","Polished volcanic glass","Pieces small to hand-sized","Glassy; opaque to translucent","Tiny crystals inside make the rainbow layers"],
"silver sheen obsidian":["Black with a silver shimmer","Smooth volcanic glass","Pieces small to hand-sized","Glassy with a silver sheen; opaque","The sheen comes from tiny aligned gas bubbles"],
"baltic amber":["Honey yellow to cognac; also butterscotch, milky or cherry","Irregular nuggets and drips, tumbled on Baltic coasts","Small beads to fist-sized lumps","Resinous; transparent to translucent","The classic source of amber with trapped insects"],
"amber with inclusions":["Golden yellow to orange-brown with dark bodies visible inside","Polished or rough amber that encloses insects, plants or bubbles","Pieces pea-sized to palm-sized","Resinous; transparent to translucent","Prized for the preserved life inside"],
"blue amber":["Yellow-brown in daylight but glows blue in sunlight or UV","Nuggets and polished beads, mostly from the Dominican Republic","Beads to fist-sized pieces","Resinous; transparent to translucent","The blue is fluorescence"],
"arkansas quartz":["Clear, colorless to milky; some points have iron stain or a smoky tint","Six-sided points with pyramid tips; clusters from crystal-lined pockets","Points from a few millimeters to over 30 cm","Glassy; transparent to translucent","Mined in the Ouachita Mountains of Arkansas"],
"garden quartz":["Clear to smoky or milky quartz with green, white or orange inclusions","Quartz points that hold chlorite or other minerals forming a garden-like scene","Crystals from a few centimeters to 20 cm","Glassy; transparent to translucent","Also called lodolite or landscape quartz"],
"labradorite":C["labradorite"],
};

const CAL = (color, notable) => [color, "Massive pieces, polished tumbles and spheres; crystals are uncommon in this color form", "Palm-sized or smaller is typical; rough chunks can be larger", "Glassy to waxy; translucent", notable];
const ARAG = (color, notable) => [color, "Columnar or needle-like crystals in sprays and clusters, sometimes pseudo-hexagonal twins", "Crystals millimeters to several centimeters; clusters hand-sized", "Glassy to resinous; translucent", notable];
const OPL = (color, notable) => [color, "Massive, vein or nodule form; usually polished as cabochons, beads or tumbles", "Pieces small to palm-sized", "Waxy to glassy; translucent to opaque", notable];
Object.assign(OVERRIDE, {
"volcano agate": ["Gray, tan, cream or rusty red-brown; often a gray center in a pale rind", "Polished points, towers, eggs and slices cut from nodules or vug fillings", "Hand-sized carvings and polished pieces are typical", "Waxy to glassy; translucent to opaque", "Often glows green under UV light (trace uranyl)", ["https://rockidentifier.io/wiki/volcano-agate/", "https://geoinfo.nmt.edu/museum/nmms/abstracts/view.cfm?aid=288"]],
"orange calcite": CAL("Orange to peachy orange, sometimes banded or with white", "Orange color comes from trace iron; commonly sold from Mexico"),
"honey calcite": CAL("Honey yellow to golden orange", "Warm honey tones, often translucent"),
"lemon calcite": CAL("Pale lemon yellow", "Soft, light color"),
"mango calcite": CAL("Soft orange to peach-yellow", "Also called mangano calcite when the color comes from manganese"),
"green calcite": CAL("Pale to mint green", "Often cloudy or waxy"),
"blue calcite": CAL("Pale sky blue to blue-green", "Soft pastel color, often cloudy"),
"black calcite": CAL("Dark gray to black", "Dark color from impurities; opaque"),
"red calcite": CAL("Brick red to orange-red", "Color from iron oxide"),
"caribbean blue calcite": CAL("Turquoise to aqua with white swirls", "A swirled blue-and-white calcite"),
"blue aragonite": ARAG("Pale sky blue to teal, often with white", "The blue comes from trace copper; found in Mexico and Namibia"),
"brown aragonite": ARAG("Light to dark brown, sometimes banded", "Brown tint comes from iron"),
"yellow aragonite": ARAG("Pale to golden yellow", "Yellow tint from impurities"),
"banded aragonite": ["Bands of white, cream, tan, brown and yellow", "Layered, flowing bands formed from mineral-rich water", "Slabs and polished pieces palm-sized or larger", "Waxy to glassy; translucent", "Similar in look to cave onyx"],
"pink halite": ["Pale pink to rose, sometimes with white", "Cubes and crystal clusters", "Typically 2 to 10 cm", "Glassy; transparent to translucent", "Dissolves in water; keep it dry"],
"blue halite": ["Deep blue to violet, sometimes with white or colorless zones", "Cubes and crystal clusters", "Typically 2 to 8 cm", "Glassy; transparent to translucent", "Dissolves in water; keep it dry"],
"corundum": ["Gray, brown, blue, red, pink or yellow", "Barrel-shaped hexagonal crystals", "Crystals millimeters to many centimeters", "Glassy to adamantine; transparent to opaque", "Ruby and sapphire are gem varieties of corundum"],
"fire agate": ["Brown with iridescent flashes of orange, red and green", "Botryoidal (grape-like) layers cut and polished", "Pieces small to palm-sized", "Glassy; translucent", "The rainbow comes from thin iron-oxide layers"],
"iris agate": ["Banded gray, white and gold; thin slices flash rainbow colors when lit from behind", "Thin cut slices of finely banded agate", "Slices small to palm-sized", "Waxy to glassy; translucent", "The extremely fine bands split light into rainbow colors"],
"nacre": ["Iridescent white with pink, green and blue", "Layered lining of mollusk shells", "Thin layers", "Pearly; iridescent", "Mother-of-pearl; made of thin aragonite plates"],
"pearl": ["White, cream, pink, silver or black", "Round to irregular beads grown inside mollusks", "Typically 2 to 15 mm", "Pearly; iridescent", "An organic gem made by mollusks"],
"freshwater mussel shell": ["Silvery white, pink or purple inside; brown to black outside", "Two-part elongated shell with a pearly inner layer", "Typically 5 to 15 cm", "Pearly to iridescent inside; dull outside", "The inner layer shows soft rainbow color"],
"aventurine": ["Green most common; also blue, orange, peach or brown", "Massive; polished into beads, cabochons and tumbles", "Tumbles about 2 to 4 cm; carvings larger", "Glassy; translucent to opaque", "Tiny mica flakes make a glittery shimmer"],
"nephrite": ["Dark green to creamy white", "Massive, tough, fibrous stone", "Pieces small to boulder-sized", "Waxy to greasy; translucent", "The more common of the two jades"],
"falcon's eye": ["Blue-gray to slate blue with a silky band", "Polished fibrous quartz", "Cabochons and tumbles a few centimeters", "Silky; opaque to translucent", "Moving band of light"],
"tiger-iron": ["Gold, red and black bands", "Polished banded rock of tiger's eye, jasper and hematite", "Tumbles and slabs", "Silky to dull; opaque", "A layered mix of three materials"],
"opalized fossil": ["Fossil replaced by opal; may flash color", "Shells, bone or wood replaced by opal", "Pieces small to hand-sized", "Waxy to glassy; translucent to opaque", "Original fossil shape is preserved"],
"common opal": OPL("White, gray, yellow, brown, pink or other solid colors", "Opal that does not show play-of-color"),
"blue opal": OPL("Pale sky blue to teal", "Often called Peruvian blue opal; usually without play-of-color"),
"green opal": OPL("Pale to apple green", "Often colored by nickel; usually without play-of-color"),
"pink opal": OPL("Pale pink to rose", "Often called Peruvian pink opal; usually without play-of-color"),
"honey opal": OPL("Honey yellow to amber", "Usually without play-of-color"),
"chocolate opal": OPL("Chocolate to tan brown", "Usually without play-of-color"),
"wood opal": ["Brown, tan or gray with visible wood grain", "Wood replaced by opal, often in logs and slabs", "Pieces small to large", "Waxy to dull; translucent to opaque", "Opal replacing wood grain and growth rings"],
"red jasper": ["Brick red to deep red-brown", "Massive; polished into tumbles and cabochons", "Pieces small to boulder-sized", "Dull to waxy; opaque", "Red from iron oxide"],
"fossil sand dollar": ["Gray, tan or white", "Flat round disc with a five-petal pattern", "Typically 3 to 10 cm", "Dull; opaque", "The skeleton is made of calcite plates"],
"sea biscuit": ["Tan, golden or gray", "Domed, rounded fossil sea urchin with a five-rayed star pattern", "Typically 4 to 10 cm", "Dull to waxy; opaque", "Often filled with flint or calcite"],
"trilobite": ["Gray, brown or black in rock", "Segmented oval body with three lobes, often curled", "Typically 1 to 10 cm", "Dull; opaque", "Extinct sea animals from the Paleozoic"],
"fossil shark teeth": ["Black, gray, brown or tan", "Triangular pointed teeth, some with serrated edges", "From 1 cm to over 5 cm", "Glossy enamel; opaque", "Sharks shed thousands of teeth, so they are common fossils"],
"megalodon tooth": ["Gray, brown, black or tan", "Large triangular tooth with serrated edges", "Typically 8 to 15 cm; the largest are over 17 cm", "Glossy enamel; opaque", "From an extinct giant shark"],
"dinosaur bone": ["Brown, gray, black, red or multicolored", "Bone replaced by minerals, cut and polished or left rough", "Pieces from small to large", "Dull to waxy; opaque", "Fine bone texture often shows"],
"petoskey stone": ["Gray to tan with a honeycomb pattern", "Rounded pebbles of fossil coral", "Pebbles 2 to 10 cm", "Dull to waxy when polished; opaque", "The pattern is fossil coral from Michigan"],
});

export function featuresFor(title) {
  const v = VER[String(title).toLowerCase()];
  if (!v?.feats?.length) return null;
  return { codes: v.feats, items: v.feats.map(c => ({ code: c, label: FEATURE_INFO[c].label, icon: FEATURE_INFO[c].icon })), sources: v.sources || [v.wiki] };
}
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
export function appearanceFor(p) {
  const key = String(p.title).toLowerCase();
  const src = [p.enwiki, p.mindatUrl].filter(Boolean);
  let row = OVERRIDE[key] || C[key] || C[alias[key]];
  let generic = false;
  if (!row || !row[0]) {
    generic = true;
    const sys = (p.crystalSystems || []).filter(Boolean);
    const lus = (p.luster || []).filter(Boolean);
    const kind = (p.kindLabel || p.typeLabel || "").toLowerCase();
    const mohs = p.mohsMin != null ? (p.mohsMin === p.mohsMax || p.mohsMax == null ? `${p.mohsMin}` : `${p.mohsMin} to ${p.mohsMax}`) : "";
    row = [
      (p.colors && p.colors.length) ? cap(p.colors.join(", ")) : "Color varies with locality and impurities; see the photo for a typical example",
      kind.includes("fossil") ? "Preserved as a fossil in sedimentary rock; shape depends on the original animal or plant" : kind.includes("geode") ? "A rounded rock with a hollow, crystal-lined center, usually sold cut open" : sys.length ? `${cap(sys.join(" or "))} crystal system; the shape of crystals follows this symmetry` : "Shape varies; commonly seen as polished or tumbled pieces",
      "Size varies widely by locality; specimens are commonly palm-sized or smaller",
      lus.length ? `${cap(lus.join(", "))} luster` : "Luster varies with polish and locality",
      mohs ? `Hardness about ${mohs} on the Mohs scale` : "",
    ];
  }
  const [color, habit, size, luster, notable, extraSrc] = row;
  return { generic, rows: [["Color", color], ["Shape & form", habit], ["Typical size", size], ["Luster", luster], ...(notable ? [["Notable look", notable]] : [])], sources: src.concat(extraSrc || []), features: featuresFor(p.title) };
}
