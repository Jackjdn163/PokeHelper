// Constants, game data, DOM references, and initial state
// Source chunk generated from the original app.js lines 1-2367.

import {
  LZA_DONUT_BERRIES,
  LZA_DONUT_FLAVOR_POWERS,
  LZA_DONUT_PRESETS,
  PLA_RECIPE_CATALOG,
  SV_SHINY_ODDS,
  SV_SHINY_SANDWICH_RECIPES
} from "./game-tools-data.js";

const STORAGE_KEY = "dexter-living-form-dex-v1";
const SHINY_STORAGE_KEY = "dexter-shiny-dex-v1";
const TRACKER_STORAGE_KEY = "dexter-playthrough-tracker-v1";
const EXP_STORAGE_KEY = "dexter-exp-planner-v1";
const GAME_AVAILABILITY_STORAGE_KEY = "dexter-switch-game-availability-v8";
const PROFILE_META_STORAGE_KEY = "dexter-profile-meta-v1";
const NOTEBOOK_STORAGE_KEY = "dexter-notebook-v1";
const FAVORITES_STORAGE_KEY = "dexter-favorites-v1";
const BOOKMARKS_STORAGE_KEY = "dexter-bookmarks-v1";
const FAVORITE_TYPES_STORAGE_KEY = "dexter-favorite-types-v1";
const GAME_CHECKLIST_STORAGE_KEY = "dexter-game-checklists-v1";
const HOME_BOX_STORAGE_KEY = "dexter-home-boxes-v1";
const SHINY_HUB_STORAGE_KEY = "dexter-shiny-hub-v1";
const TOOLS_STORAGE_KEY = "dexter-game-tools-v1";
const API_CACHE_STORAGE_KEY = "dexter-api-cache-v1";
const DEX_INDEX_CACHE_STORAGE_KEY = "dexter-dex-index-cache-v1";
const UI_SESSION_STORAGE_KEY = "dexter-ui-session-v1";
const ACCOUNT_SYNC_STORAGE_KEY = "dexter-account-sync-v1";
const POKEARTH_BASE_URL = "https://www.serebii.net";
const POKEMONDB_HOME_SPRITE_BASE_URL = "https://img.pokemondb.net/sprites/home";
const POKEAPI_HOME_SPRITE_BASE_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home";
const POKEAPI_HOME_SPRITE_ID_ALIASES = {
  "floette-eternal": 10061
};
const PROJECTPOKEMON_SV_HOME_BASE_URL =
  "https://projectpokemon.org/images/sprites-models/sv-sprites-home";
const HYBRIDSHIVAM_HQ_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/imagesHQ";
const POKESS_HOME_THUMBNAIL_BASE_URL =
  "https://raw.githubusercontent.com/Or1onCL/PokeSS/main/pokemon-home-thumbnail";
const POKEARTH_MAP_VIEWBOXES = {
  "lgpe-kanto": "0 0 200 618",
  "swsh-galar": "0 0 728 1420",
  "swsh-isle-armor": "0 0 640 360",
  "swsh-crown-tundra": "0 0 640 360",
  "bdsp-sinnoh": "0 0 640 344",
  "pla-hisui": "0 0 640 360",
  "sv-paldea": "0 0 1024 1024",
  "sv-kitakami": "0 0 1000 1000",
  "sv-blueberry": "0 0 800 800",
  "lza-lumiose": "0 0 800 800",
  "lza-hyperspace": "0 0 640 360",
  "lza-mega-dimension": "0 0 640 360"
};
const BASE_POKEMON_COUNT = 1025;
const DEFAULT_PROFILE_ID = "guest-trainer";
const CLOUD_SAVE_TABLE = "cloud_saves";
const CLOUD_SAVE_VERSION = 1;
const CLOUD_SYNC_DEBOUNCE_MS = 1200;
const CLOUD_AUTO_PULL_INTERVAL_MS = 45000;
const CLOUD_SAVE_STORAGE_MISSING_MESSAGE =
  "Your account is signed in, but cloud save storage is not installed yet. Run supabase/schema.sql in the Supabase SQL Editor to create public.cloud_saves, then refresh this page.";
const ARCHIVE_INITIAL_RENDER_COUNT = 120;
const ARCHIVE_RENDER_BATCH_COUNT = 120;
const ARCHIVE_ENTRY_HEIGHT_ESTIMATE = 92;
const ARCHIVE_GRID_CARD_MIN_WIDTH = 152;
const ARCHIVE_GRID_ENTRY_HEIGHT_ESTIMATE = 194;
const SEARCH_INPUT_DEBOUNCE_MS = 120;
const VALID_VIEW_IDS = new Set([
  "landing",
  "archive",
  "scan",
  "collection",
  "shiny",
  "home",
  "journey",
  "lab",
  "maps",
  "vault",
  "ai"
]);
const VALID_DETAIL_TAB_IDS = new Set(["overview", "battle", "field"]);
const VALID_ARCHIVE_VIEW_IDS = new Set(["list", "grid"]);
const VALID_SCAN_VISUAL_MODE_IDS = new Set(["artwork", "home"]);
const VALID_DUPLICATE_FILTER_IDS = new Set(["all", "evolve", "trade", "release"]);
const EXCLUDED_API_ENTRY_NAMES = new Set([
  "minior-red-meteor",
  "minior-orange-meteor",
  "minior-yellow-meteor",
  "minior-green-meteor",
  "minior-blue-meteor",
  "minior-indigo-meteor",
  "minior-violet-meteor"
]);
const SHINY_DEX_LOCKED_ENTRY_NAMES = new Set([
  "victini",
  "vivillon-poke-ball-pattern",
  "floette-eternal",
  "hoopa",
  "hoopa-unbound",
  "cosmog",
  "cosmoem",
  "magearna",
  "magearna-original",
  "magearna-mega",
  "magearna-original-mega",
  "marshadow",
  "kubfu",
  "urshifu-single-strike",
  "urshifu-rapid-strike",
  "urshifu-single-strike-gmax",
  "urshifu-rapid-strike-gmax",
  "zarude",
  "zarude-dada",
  "glastrier",
  "spectrier",
  "calyrex",
  "calyrex-ice",
  "calyrex-shadow",
  "ursaluna-bloodmoon",
  "melmetal-gmax",
  "walking-wake",
  "iron-leaves",
  "okidogi",
  "munkidori",
  "fezandipiti",
  "ogerpon",
  "ogerpon-wellspring-mask",
  "ogerpon-hearthflame-mask",
  "ogerpon-cornerstone-mask",
  "gouging-fire",
  "raging-bolt",
  "iron-boulder",
  "iron-crown",
  "terapagos",
  "terapagos-terastal",
  "terapagos-stellar",
  "pecharunt"
]);

const GAME_SPECIFIC_SHINY_LOCKED_ENTRY_NAMES = {
  lgpe: new Set(["mew"]),
  swsh: new Set([
    "zacian",
    "zamazenta",
    "eternatus",
    "kubfu",
    "urshifu-single-strike",
    "urshifu-rapid-strike",
    "regieleki",
    "regidrago",
    "glastrier",
    "spectrier",
    "calyrex",
    "keldeo"
  ]),
  bdsp: new Set(["mew", "jirachi", "manaphy"]),
  pla: new Set([
    "uxie",
    "mesprit",
    "azelf",
    "dialga",
    "palkia",
    "heatran",
    "regigigas",
    "cresselia",
    "tornadus",
    "thundurus",
    "landorus",
    "enamorus",
    "giratina",
    "shaymin",
    "darkrai",
    "manaphy",
    "phione",
    "arceus"
  ]),
  sv: new Set([
    "koraidon",
    "miraidon",
    "wo-chien",
    "chien-pao",
    "ting-lu",
    "chi-yu",
    "gimmighoul",
    "walking-wake",
    "iron-leaves",
    "okidogi",
    "munkidori",
    "fezandipiti",
    "ogerpon",
    "gouging-fire",
    "raging-bolt",
    "iron-boulder",
    "iron-crown",
    "terapagos",
    "pecharunt"
  ]),
  lza: new Set()
};

function mergeUniqueNumbers(...lists) {
  return [...new Set(lists.flat())].sort((left, right) => left - right);
}

function mergeUniqueValuesInOrder(...lists) {
  const seen = new Set();
  const ordered = [];

  lists.flat().forEach((value) => {
    if (seen.has(value)) {
      return;
    }

    seen.add(value);
    ordered.push(value);
  });

  return ordered;
}

// Source: Serebii Dynamax Adventures rental & opposing Pokemon list.
const SWSH_DYNAMAX_ADVENTURE_SPECIES = [
  460, 359, 617, 869, 334, 591, 752, 348, 144, 531, 699, 482, 184, 689, 847, 550,
  614, 606, 182, 760, 625, 806, 257, 525, 836, 626, 437, 12, 794, 838, 797, 851,
  113, 737, 5, 421, 573, 344, 36, 35, 839, 563, 256, 764, 879, 346, 845, 342,
  488, 558, 615, 702, 483, 660, 132, 680, 148, 886, 452, 834, 426, 621, 832, 51,
  206, 884, 632, 356, 830, 125, 587, 244, 589, 103, 295, 870, 136, 330, 611, 478,
  873, 596, 569, 423, 487, 362, 44, 55, 623, 711, 853, 820, 861, 383, 253, 533,
  799, 858, 93, 701, 631, 485, 695, 107, 106, 237, 250, 876, 2, 593, 39, 135,
  124, 64, 115, 798, 99, 600, 707, 601, 553, 382, 646, 305, 608, 645, 171, 380,
  381, 108, 510, 549, 264, 428, 249, 792, 754, 405, 745, 67, 126, 82, 687, 310,
  226, 556, 105, 259, 481, 375, 150, 620, 241, 778, 146, 877, 750, 446, 518, 800,
  34, 31, 793, 291, 164, 862, 224, 765, 826, 484, 770, 536, 675, 766, 279, 863,
  53, 795, 221, 871, 186, 62, 855, 137, 771, 195, 211, 26, 243, 384, 369, 643,
  112, 743, 315, 479, 758, 844, 28, 254, 545, 123, 117, 119, 364, 537, 319, 756,
  561, 227, 435, 80, 199, 215, 791, 805, 121, 508, 618, 185, 245, 260, 528, 663,
  114, 128, 73, 828, 642, 777, 176, 324, 641, 849, 709, 763, 697, 521, 480, 583,
  134, 416, 738, 45, 320, 8, 110, 547, 340, 40, 178, 716, 796, 717, 145, 644,
  718, 785, 786, 787, 788
];

const SWSH_DYNAMAX_ADVENTURE_VERSION_NATIVE = {
  sword: [250, 381, 383, 483, 641, 643, 716, 791],
  shield: [249, 380, 382, 484, 642, 644, 717, 792]
};

// Source: Derived from pokepc/dataset regional dex splits for Legends: Z-A.
const LZA_LUMIOSE_SPECIES = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 16, 17, 18, 23,
  24, 25, 26, 35, 36, 63, 64, 65, 66, 67, 68, 69, 70, 71, 79, 80,
  92, 93, 94, 95, 115, 120, 121, 123, 127, 129, 130, 133, 134, 135, 136, 142,
  147, 148, 149, 150, 152, 153, 154, 158, 159, 160, 167, 168, 172, 173, 179, 180,
  181, 196, 197, 199, 208, 212, 214, 225, 227, 228, 229, 246, 247, 248, 280, 281,
  282, 302, 303, 304, 305, 306, 307, 308, 309, 310, 315, 318, 319, 322, 323, 333,
  334, 353, 354, 359, 361, 362, 371, 372, 373, 374, 375, 376, 406, 407, 427, 428,
  443, 444, 445, 447, 448, 449, 450, 459, 460, 470, 471, 475, 478, 498, 499, 500,
  504, 505, 511, 512, 513, 514, 515, 516, 529, 530, 531, 543, 544, 545, 551, 552,
  553, 559, 560, 568, 569, 582, 583, 584, 587, 602, 603, 604, 607, 608, 609, 618,
  650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665,
  666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681,
  682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697,
  698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713,
  714, 715, 716, 717, 718, 719, 780, 870
];

const LZA_HYPERSPACE_SPECIES = [
  39, 40, 41, 42, 52, 53, 56, 57, 83, 104, 105, 122, 137, 169, 174, 211,
  233, 252, 253, 254, 255, 256, 257, 258, 259, 260, 316, 317, 325, 326, 335, 336,
  349, 350, 352, 358, 380, 381, 382, 383, 384, 396, 397, 398, 433, 439, 474, 479,
  485, 491, 509, 510, 517, 518, 538, 539, 562, 563, 590, 591, 615, 622, 623, 638,
  639, 640, 647, 648, 649, 720, 721, 739, 740, 767, 768, 769, 770, 778, 801, 802,
  807, 808, 809, 821, 822, 823, 827, 828, 848, 849, 852, 853, 863, 865, 866, 867,
  876, 877, 900, 904, 926, 927, 931, 932, 933, 934, 935, 936, 937, 942, 943, 944,
  945, 951, 952, 957, 958, 959, 967, 969, 970, 971, 972, 973, 977, 978, 979, 996,
  997, 998, 999, 1000
];

const LZA_MEGA_DIMENSION_SPECIES = [
  3, 6, 9, 15, 18, 26, 36, 65, 71, 80, 94, 115, 121, 127, 130, 142,
  149, 150, 154, 160, 181, 208, 212, 214, 227, 229, 248, 254, 257, 260, 282, 302,
  303, 306, 308, 310, 319, 323, 334, 354, 358, 359, 362, 373, 376, 380, 381, 384,
  398, 428, 445, 448, 460, 475, 478, 485, 491, 500, 530, 531, 545, 560, 604, 609,
  623, 652, 655, 658, 668, 670, 678, 687, 689, 691, 701, 718, 719, 740, 768, 780,
  801, 807, 870, 952, 970, 978, 998
];

const LZA_MAIN_SPECIES = mergeUniqueNumbers(LZA_LUMIOSE_SPECIES, LZA_HYPERSPACE_SPECIES);
const LZA_AVAILABLE_SPECIES = mergeUniqueNumbers(LZA_MAIN_SPECIES, LZA_MEGA_DIMENSION_SPECIES);
const LZA_LUMIOSE_ORDER_NAMES = ["chikorita","bayleef","meganium","tepig","pignite","emboar","totodile","croconaw","feraligatr","fletchling","fletchinder","talonflame","bunnelby","diggersby","scatterbug","spewpa","vivillon","weedle","kakuna","beedrill","pidgey","pidgeotto","pidgeot","mareep","flaaffy","ampharos","patrat","watchog","budew","roselia","roserade","magikarp","gyarados","binacle","barbaracle","staryu","starmie","flabebe","floette","florges","skiddo","gogoat","espurr","meowstic","litleo","pyroar","pancham","pangoro","trubbish","garbodor","dedenne","pichu","pikachu","raichu","cleffa","clefairy","clefable","spinarak","ariados","ekans","arbok","abra","kadabra","alakazam","gastly","haunter","gengar","venipede","whirlipede","scolipede","honedge","doublade","aegislash","bellsprout","weepinbell","victreebel","pansage","simisage","pansear","simisear","panpour","simipour","meditite","medicham","electrike","manectric","ralts","kirlia","gardevoir","gallade","houndour","houndoom","swablu","altaria","audino","spritzee","aromatisse","swirlix","slurpuff","eevee","vaporeon","jolteon","flareon","espeon","umbreon","leafeon","glaceon","sylveon","buneary","lopunny","shuppet","banette","vanillite","vanillish","vanilluxe","numel","camerupt","hippopotas","hippowdon","drilbur","excadrill","sandile","krokorok","krookodile","machop","machoke","machamp","gible","gabite","garchomp","carbink","sableye","mawile","absol","riolu","lucario","slowpoke","slowbro","slowking","carvanha","sharpedo","tynamo","eelektrik","eelektross","dratini","dragonair","dragonite","bulbasaur","ivysaur","venusaur","charmander","charmeleon","charizard","squirtle","wartortle","blastoise","stunfisk","furfrou","inkay","malamar","skrelp","dragalge","clauncher","clawitzer","goomy","sliggoo","goodra","delibird","snorunt","glalie","froslass","snover","abomasnow","bergmite","avalugg","scyther","scizor","pinsir","heracross","emolga","hawlucha","phantump","trevenant","scraggy","scrafty","noibat","noivern","klefki","litwick","lampent","chandelure","aerodactyl","tyrunt","tyrantrum","amaura","aurorus","onix","steelix","aron","lairon","aggron","helioptile","heliolisk","pumpkaboo","gourgeist","larvitar","pupitar","tyranitar","froakie","frogadier","greninja","falinks","chespin","quilladin","chesnaught","skarmory","fennekin","braixen","delphox","bagon","shelgon","salamence","kangaskhan","drampa","beldum","metang","metagross","xerneas","yveltal","zygarde","diancie","mewtwo"];
const LZA_MEGA_DIMENSION_ORDER_NAMES = ["mankey","primeape","annihilape","meowth","persian","perrserker","farfetchd","sirfetchd","cubone","marowak","porygon","porygon2","porygon-z","capsakid","scovillain","tinkatink","tinkatuff","tinkaton","cyclizar","glimmet","glimmora","rotom","greavard","houndstone","sandygast","palossand","kecleon","flamigo","cryogonal","dondozo","tatsugiri","frigibax","arctibax","baxcalibur","gimmighoul","gholdengo","qwilfish","overqwil","treecko","grovyle","sceptile","torchic","combusken","blaziken","mudkip","marshtomp","swampert","feebas","milotic","chingling","chimecho","indeedee","purrloin","liepard","munna","musharna","throh","sawk","yamask","cofagrigus","runerigus","wimpod","golisopod","nickit","thievul","clobbopus","grapploct","mimikyu","kleavor","morpeko","golett","golurk","rookidee","corvisquire","corviknight","igglybuff","jigglypuff","wigglytuff","fidough","dachsbun","starly","staravia","staraptor","spoink","grumpig","squawkabilly","crabrawler","crabominable","nacli","naclstack","garganacl","gulpin","swalot","zubat","golbat","crobat","charcadet","armarouge","ceruledge","maschiff","mabosstiff","toxel","toxtricity","shroodle","grafaiai","zangoose","seviper","mime-jr","mr-mime","mr-rime","foongus","amoonguss","heatran","volcanion","cobalion","terrakion","virizion","keldeo","meloetta","genesect","hoopa","marshadow","meltan","melmetal","darkrai","latias","latios","kyogre","groudon","rayquaza","magearna","zeraora"];
const LZA_FULL_ORDER_NAMES = mergeUniqueValuesInOrder(
  LZA_LUMIOSE_ORDER_NAMES,
  LZA_MEGA_DIMENSION_ORDER_NAMES
);
const LZA_DLC_SPECIES = mergeUniqueNumbers(LZA_HYPERSPACE_SPECIES, LZA_MEGA_DIMENSION_SPECIES);

// Source: Serebii version-exclusive pages, trimmed to species-level differences only.
const GAME_VERSION_EXCLUSIVE_SPECIES = {
  lgpe: {
    "lets-go-pikachu": [27, 28, 43, 44, 45, 56, 57, 58, 88, 89, 123],
    "lets-go-eevee": [23, 24, 37, 38, 52, 53, 69, 70, 71, 109, 110, 127]
  },
  swsh: {
    sword: [
      68, 83, 127, 138, 139, 250, 273, 274, 275, 303, 338, 371, 372, 373, 381, 383, 483,
      554, 555, 559, 560, 574, 575, 576, 627, 628, 633, 634, 635, 641, 643, 684, 685, 692,
      693, 716, 766, 776, 782, 783, 784, 791, 839, 841, 865, 874, 888
    ],
    shield: [
      77, 78, 94, 131, 140, 141, 214, 222, 246, 247, 248, 249, 270, 271, 272, 302, 337, 380,
      382, 443, 444, 445, 453, 454, 484, 577, 578, 579, 629, 630, 642, 644, 682, 683, 690,
      691, 704, 705, 706, 717, 765, 780, 792, 842, 864, 875, 889
    ]
  },
  bdsp: {
    "brilliant-diamond": [
      10, 11, 12, 23, 24, 58, 59, 86, 87, 123, 125, 198, 207, 212, 239, 243, 244, 245, 246,
      247, 248, 250, 273, 274, 275, 303, 335, 338, 352, 408, 409, 430, 434, 435, 466, 472,
      483
    ],
    "shining-pearl": [
      13, 14, 15, 27, 28, 37, 38, 79, 80, 126, 127, 144, 145, 146, 199, 200, 216, 217, 234,
      240, 249, 270, 271, 272, 302, 336, 337, 371, 372, 373, 410, 411, 429, 431, 432, 467,
      484
    ]
  },
  sv: {
    scarlet: [
      37, 38, 207, 246, 247, 248, 408, 409, 425, 426, 434, 435, 472, 633, 634, 635, 690, 691,
      765, 845, 874, 936, 984, 985, 986, 987, 988, 989, 1005, 1007, 1009, 1020, 1021
    ],
    violet: [
      27, 28, 190, 200, 316, 317, 371, 372, 373, 410, 411, 424, 429, 692, 693, 766, 875, 877,
      885, 886, 887, 937, 990, 991, 992, 993, 994, 995, 1006, 1008, 1010, 1022, 1023
    ]
  }
};

const GAME_VERSION_EXCLUSIVE_SETS = Object.fromEntries(
  Object.entries(GAME_VERSION_EXCLUSIVE_SPECIES).map(([gameId, versionMap]) => [
    gameId,
    Object.fromEntries(
      Object.entries(versionMap).map(([versionId, speciesNumbers]) => [versionId, new Set(speciesNumbers)])
    )
  ])
);

const GAME_CATALOG = [
  {
    id: "lgpe",
    shortName: "LGPE",
    name: "Let's Go Pikachu / Eevee",
    versions: [
      { id: "lets-go-pikachu", label: "Let's Go Pikachu", shortLabel: "Pikachu" },
      { id: "lets-go-eevee", label: "Let's Go Eevee", shortLabel: "Eevee" }
    ],
    progressLabel: "Badges",
    progressMax: 8,
    milestones: ["New Save", "Mid Story", "Elite Four", "Master Trainers"]
  },
  {
    id: "swsh",
    shortName: "SWSH",
    name: "Sword / Shield",
    versions: [
      { id: "sword", label: "Sword", shortLabel: "Sword" },
      { id: "shield", label: "Shield", shortLabel: "Shield" }
    ],
    progressLabel: "Badges",
    progressMax: 8,
    milestones: ["New Save", "Wild Area", "Champion Cup", "DLC / Postgame"]
  },
  {
    id: "bdsp",
    shortName: "BDSP",
    name: "Brilliant Diamond / Shining Pearl",
    versions: [
      { id: "brilliant-diamond", label: "Brilliant Diamond", shortLabel: "Diamond" },
      { id: "shining-pearl", label: "Shining Pearl", shortLabel: "Pearl" }
    ],
    progressLabel: "Badges",
    progressMax: 8,
    milestones: ["New Save", "Mid Story", "Hall of Fame", "Ramanas / Postgame"]
  },
  {
    id: "pla",
    shortName: "PLA",
    name: "Legends: Arceus",
    progressLabel: "Rank",
    progressMax: 10,
    milestones: ["Jubilife Start", "Noble Progress", "Main Story Clear", "Plate Hunt"]
  },
  {
    id: "sv",
    shortName: "SV",
    name: "Scarlet / Violet",
    versions: [
      { id: "scarlet", label: "Scarlet", shortLabel: "Scarlet" },
      { id: "violet", label: "Violet", shortLabel: "Violet" }
    ],
    progressLabel: "Paths Cleared",
    progressMax: 18,
    milestones: ["Academy Start", "Three Paths", "Area Zero", "Raid / Postgame"]
  },
  {
    id: "lza",
    shortName: "LZA",
    name: "Legends: Z-A",
    progressLabel: "Royale Rank",
    progressMax: 26,
    milestones: ["Hotel Z Start", "Wild Zone Patrol", "Z-A Royale", "Postgame / DLC"]
  }
];

const GAME_SHINY_ODDS = {
  lgpe: {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "No combo, lure, or Shiny Charm active.",
        text: "1 / 4096",
        rolls: 4096
      },
      {
        id: "charm",
        label: "Shiny Charm",
        detail: "Charm active without combo or lure.",
        text: "1 / 1365.3",
        rolls: 1365.3
      },
      {
        id: "lure",
        label: "Lure Only",
        detail: "Lure active with no combo or charm.",
        text: "1 / 2048",
        rolls: 2048
      },
      {
        id: "combo-31",
        label: "31+ Catch Combo",
        detail: "Full catch combo without lure or charm.",
        text: "1 / 341.3",
        rolls: 341.3
      },
      {
        id: "combo-31-lure",
        label: "31+ Catch Combo + Lure",
        detail: "Common active hunt setup without the charm.",
        text: "1 / 315.08",
        rolls: 315.08
      },
      {
        id: "combo-31-lure-charm",
        label: "31+ Catch Combo + Lure + Shiny Charm",
        detail: "Best tracked Let's Go overworld setup.",
        text: "1 / 273.07",
        rolls: 273.07
      }
    ]
  },
  swsh: {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "Standard wild encounter with no boosts.",
        text: "1 / 4096",
        rolls: 4096
      },
      {
        id: "charm",
        label: "Shiny Charm",
        detail: "Charm active on a standard encounter route.",
        text: "1 / 1365.33",
        rolls: 1365.33
      },
      {
        id: "ko-500",
        label: "500 Battle Count",
        detail: "500 defeats or captures for the target species.",
        text: "1 / 682.7",
        rolls: 682.7
      },
      {
        id: "ko-500-charm",
        label: "500 Battle Count + Shiny Charm",
        detail: "Best fixed wild target odds for Sword and Shield routes.",
        text: "1 / 512.44",
        rolls: 512.44
      },
      {
        id: "masuda",
        label: "Masuda Method",
        detail: "Breeding with two different language tags.",
        text: "1 / 682.7",
        rolls: 682.7
      },
      {
        id: "masuda-charm",
        label: "Masuda Method + Shiny Charm",
        detail: "Best standard egg hatch route.",
        text: "1 / 512.44",
        rolls: 512.44
      },
      {
        id: "dmax-adventures",
        label: "Dynamax Adventures",
        detail: "Max Lair capture route without the charm.",
        text: "1 / 300",
        rolls: 300
      },
      {
        id: "dmax-adventures-charm",
        label: "Dynamax Adventures + Shiny Charm",
        detail: "Best tracked Crown Tundra shiny odds.",
        text: "1 / 100",
        rolls: 100
      }
    ]
  },
  bdsp: {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "Standard encounter with no modifiers active.",
        text: "1 / 4096",
        rolls: 4096
      },
      {
        id: "diglett",
        label: "Grand Underground Diglett Bonus",
        detail: "Diglett bonus active in the Grand Underground.",
        text: "1 / 2048",
        rolls: 2048
      },
      {
        id: "masuda",
        label: "Masuda Method",
        detail: "Different language breeding pair.",
        text: "1 / 682.7",
        rolls: 682.7
      },
      {
        id: "masuda-charm",
        label: "Masuda Method + Shiny Charm",
        detail: "Best general egg-hatching odds in BDSP.",
        text: "1 / 512",
        rolls: 512
      },
      {
        id: "pokeradar-40",
        label: "Poké Radar Chain 40",
        detail: "Full Poké Radar chain for a route-compatible target.",
        text: "1 / 99",
        rolls: 99
      }
    ]
  },
  pla: {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "Fresh encounter with no research boosts applied.",
        text: "1 / 4096",
        rolls: 4096
      },
      {
        id: "research-10",
        label: "Research Level 10",
        detail: "Dex page completed to Research Level 10.",
        text: "1 / 2048.25",
        rolls: 2048.25
      },
      {
        id: "perfect-research",
        label: "Perfect Research",
        detail: "Research page perfected for the target species.",
        text: "1 / 1024.38",
        rolls: 1024.38
      },
      {
        id: "research-10-outbreak",
        label: "Research 10 + Mass Outbreak",
        detail: "Standard outbreak route with a level 10 page.",
        text: "1 / 293.04",
        rolls: 293.04
      },
      {
        id: "perfect-outbreak",
        label: "Perfect Research + Mass Outbreak",
        detail: "Mass outbreak route with a perfected entry.",
        text: "1 / 256.47",
        rolls: 256.47
      },
      {
        id: "perfect-mmo",
        label: "Perfect Research + Massive Mass Outbreak",
        detail: "Best non-charm overworld route in Hisui.",
        text: "1 / 141.7",
        rolls: 141.7
      },
      {
        id: "perfect-mmo-charm",
        label: "Perfect Research + MMO + Shiny Charm",
        detail: "Best tracked shiny setup in Legends: Arceus.",
        text: "1 / 128.49",
        rolls: 128.49
      }
    ]
  },
  sv: {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "Standard encounter with no charm, outbreak, or sandwich.",
        text: "1 / 4096",
        rolls: 4096
      },
      {
        id: "charm",
        label: "Shiny Charm",
        detail: "Charm active with no other boosts.",
        text: "1 / 1365.67",
        rolls: 1365.67
      },
      {
        id: "sparkling",
        label: "Sparkling Power Lv. 3",
        detail: "Sandwich active without charm or outbreak bonus.",
        text: "1 / 1024.38",
        rolls: 1024.38
      },
      {
        id: "sparkling-charm",
        label: "Sparkling Power Lv. 3 + Shiny Charm",
        detail: "Best isolated encounter route without outbreak prep.",
        text: "1 / 683.08",
        rolls: 683.08
      },
      {
        id: "outbreak-60",
        label: "Mass Outbreak 60+",
        detail: "Full outbreak clear without charm or sandwich.",
        text: "1 / 1365.67",
        rolls: 1365.67
      },
      {
        id: "outbreak-60-charm",
        label: "Mass Outbreak 60+ + Shiny Charm",
        detail: "Outbreak route with charm active.",
        text: "1 / 819.6",
        rolls: 819.6
      },
      {
        id: "outbreak-60-sparkling-charm",
        label: "Mass Outbreak 60+ + Sparkling Power Lv. 3 + Shiny Charm",
        detail: "Best tracked Scarlet and Violet overworld odds.",
        text: "1 / 512.44",
        rolls: 512.44
      }
    ]
  },
  lza: {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "Standard encounter with no active boosts.",
        text: "1 / 4096",
        rolls: 4096
      },
      {
        id: "charm",
        label: "Shiny Charm",
        detail: "Charm active for a standard route.",
        text: "1 / 1365.67",
        rolls: 1365.67
      },
      {
        id: "sparkling",
        label: "Sparkling Power Lv. 3",
        detail: "Food-power route without the charm.",
        text: "1 / 1024.38",
        rolls: 1024.38
      },
      {
        id: "sparkling-charm",
        label: "Sparkling Power Lv. 3 + Shiny Charm",
        detail: "Best tracked route for the current Legends: Z-A build.",
        text: "1 / 585.37",
        rolls: 585.37
      }
    ]
  }
};

function journeyItem(id, label) {
  return { id, label };
}

const JOURNEY_GAME_DETAILS = {
  lgpe: {
    title: "Pokémon: Let's Go, Pikachu! and Let's Go, Eevee!",
    shortTitle: "Pokémon Let's Go",
    subtitle: "Kanto partner run tracker",
    story: [
      journeyItem("lgpe-story-partner", "Choose your partner"),
      journeyItem("lgpe-story-cerulean", "Reach Cerulean City"),
      journeyItem("lgpe-story-silph", "Clear Silph Co."),
      journeyItem("lgpe-story-indigo", "Reach Indigo Plateau"),
      journeyItem("lgpe-story-champion", "Defeat the Champion")
    ],
    columnsTitle: "Badges",
    columns: [
      { title: "Badge 1", items: [journeyItem("lgpe-badge-boulder", "Boulder Badge")] },
      { title: "Badge 2", items: [journeyItem("lgpe-badge-cascade", "Cascade Badge")] },
      { title: "Badge 3", items: [journeyItem("lgpe-badge-thunder", "Thunder Badge")] },
      { title: "Badge 4", items: [journeyItem("lgpe-badge-rainbow", "Rainbow Badge")] },
      { title: "Badge 5", items: [journeyItem("lgpe-badge-soul", "Soul Badge")] },
      { title: "Badge 6", items: [journeyItem("lgpe-badge-marsh", "Marsh Badge")] },
      { title: "Badge 7", items: [journeyItem("lgpe-badge-volcano", "Volcano Badge")] },
      { title: "Badge 8", items: [journeyItem("lgpe-badge-earth", "Earth Badge")] }
    ],
    legendarySpecies: [144, 145, 146, 150, 808, 809],
    postgame: [
      journeyItem("lgpe-post-master-trainers", "Master Trainers unlocked"),
      journeyItem("lgpe-post-cerulean-cave", "Cerulean Cave explored"),
      journeyItem("lgpe-post-mewtwo", "Mewtwo encounter resolved")
    ],
    dlc: [],
    progressIds: [
      "lgpe-badge-boulder",
      "lgpe-badge-cascade",
      "lgpe-badge-thunder",
      "lgpe-badge-rainbow",
      "lgpe-badge-soul",
      "lgpe-badge-marsh",
      "lgpe-badge-volcano",
      "lgpe-badge-earth"
    ],
    hallOfFameIds: ["lgpe-story-champion"],
    postgameIds: ["lgpe-post-master-trainers"]
  },
  swsh: {
    title: "Pokémon Sword and Shield",
    shortTitle: "Pokémon Sword and Shield",
    subtitle: "Galar league and Wild Area tracker",
    story: [
      journeyItem("swsh-story-starter", "Choose your starter"),
      journeyItem("swsh-story-wild-area", "Enter the Wild Area"),
      journeyItem("swsh-story-cup", "Qualify for the Champion Cup"),
      journeyItem("swsh-story-champion", "Defeat Leon")
    ],
    columnsTitle: "Gym Badges",
    columns: [
      { title: "Badge 1", items: [journeyItem("swsh-badge-grass", "Grass Badge")] },
      { title: "Badge 2", items: [journeyItem("swsh-badge-water", "Water Badge")] },
      { title: "Badge 3", items: [journeyItem("swsh-badge-fire", "Fire Badge")] },
      { title: "Badge 4", items: [journeyItem("swsh-badge-fighting", "Fighting Badge")] },
      { title: "Badge 5", items: [journeyItem("swsh-badge-fairy", "Fairy Badge")] },
      { title: "Badge 6", items: [journeyItem("swsh-badge-rock", "Rock Badge")] },
      { title: "Badge 7", items: [journeyItem("swsh-badge-dark", "Dark Badge")] },
      { title: "Badge 8", items: [journeyItem("swsh-badge-dragon", "Dragon Badge")] }
    ],
    legendarySpecies: [888, 889, 890, 894, 895, 896, 897, 898],
    postgame: [
      journeyItem("swsh-post-slumbering", "Slumbering Weald postgame cleared"),
      journeyItem("swsh-post-battle-tower", "Battle Tower opened"),
      journeyItem("swsh-post-star-tournament", "Galarian Star Tournament unlocked")
    ],
    dlc: [
      journeyItem("swsh-dlc-armor-start", "Isle of Armor started"),
      journeyItem("swsh-dlc-kubfu", "Kubfu trial line cleared"),
      journeyItem("swsh-dlc-tundra-start", "Crown Tundra started"),
      journeyItem("swsh-dlc-dynamax-adventure", "Dynamax Adventures unlocked")
    ],
    progressIds: [
      "swsh-badge-grass",
      "swsh-badge-water",
      "swsh-badge-fire",
      "swsh-badge-fighting",
      "swsh-badge-fairy",
      "swsh-badge-rock",
      "swsh-badge-dark",
      "swsh-badge-dragon"
    ],
    hallOfFameIds: ["swsh-story-champion"],
    postgameIds: ["swsh-post-slumbering"]
  },
  bdsp: {
    title: "Pokémon Brilliant Diamond and Shining Pearl",
    shortTitle: "Pokémon Brilliant Diamond and Shining Pearl",
    subtitle: "Sinnoh badge run and postgame tracker",
    story: [
      journeyItem("bdsp-story-starter", "Choose your starter"),
      journeyItem("bdsp-story-mt-coronet", "Push through Mt. Coronet"),
      journeyItem("bdsp-story-spear-pillar", "Clear Spear Pillar"),
      journeyItem("bdsp-story-champion", "Defeat Cynthia")
    ],
    columnsTitle: "Gym Badges",
    columns: [
      { title: "Badge 1", items: [journeyItem("bdsp-badge-coal", "Coal Badge")] },
      { title: "Badge 2", items: [journeyItem("bdsp-badge-forest", "Forest Badge")] },
      { title: "Badge 3", items: [journeyItem("bdsp-badge-cobble", "Cobble Badge")] },
      { title: "Badge 4", items: [journeyItem("bdsp-badge-fen", "Fen Badge")] },
      { title: "Badge 5", items: [journeyItem("bdsp-badge-relic", "Relic Badge")] },
      { title: "Badge 6", items: [journeyItem("bdsp-badge-mine", "Mine Badge")] },
      { title: "Badge 7", items: [journeyItem("bdsp-badge-icicle", "Icicle Badge")] },
      { title: "Badge 8", items: [journeyItem("bdsp-badge-beacon", "Beacon Badge")] }
    ],
    legendarySpecies: [480, 481, 482, 483, 484, 487, 491, 493],
    postgame: [
      journeyItem("bdsp-post-national-dex", "National Dex unlocked"),
      journeyItem("bdsp-post-battle-zone", "Battle Zone reached"),
      journeyItem("bdsp-post-ramanas", "Ramanas Park unlocked")
    ],
    dlc: [],
    progressIds: [
      "bdsp-badge-coal",
      "bdsp-badge-forest",
      "bdsp-badge-cobble",
      "bdsp-badge-fen",
      "bdsp-badge-relic",
      "bdsp-badge-mine",
      "bdsp-badge-icicle",
      "bdsp-badge-beacon"
    ],
    hallOfFameIds: ["bdsp-story-champion"],
    postgameIds: ["bdsp-post-national-dex"]
  },
  pla: {
    title: "Pokémon Legends: Arceus",
    shortTitle: "Pokémon Legends: Arceus",
    subtitle: "Hisui survey file tracker",
    story: [
      journeyItem("pla-story-galaxy", "Join the Galaxy Team"),
      journeyItem("pla-story-kleavor", "Calm Noble Kleavor"),
      journeyItem("pla-story-coronet", "Reach Mount Coronet"),
      journeyItem("pla-story-finish", "Clear the main mission")
    ],
    columnsTitle: "Survey Milestones",
    columns: [
      {
        title: "Nobles",
        items: [
          journeyItem("pla-noble-kleavor", "Kleavor"),
          journeyItem("pla-noble-lilligant", "Lilligant"),
          journeyItem("pla-noble-arcanine", "Arcanine"),
          journeyItem("pla-noble-electrode", "Electrode"),
          journeyItem("pla-noble-avalugg", "Avalugg")
        ]
      },
      {
        title: "Ride Pokémon",
        items: [
          journeyItem("pla-ride-wyrdeer", "Wyrdeer"),
          journeyItem("pla-ride-basculegion", "Basculegion"),
          journeyItem("pla-ride-sneasler", "Sneasler"),
          journeyItem("pla-ride-braviary", "Braviary"),
          journeyItem("pla-ride-ursaluna", "Ursaluna")
        ]
      }
    ],
    legendarySpecies: [480, 481, 482, 483, 484, 487, 488, 491, 493, 638, 639, 640, 641, 642, 645, 905],
    postgame: [
      journeyItem("pla-post-plates", "All plates hunt underway"),
      journeyItem("pla-post-volo", "Volo finale cleared"),
      journeyItem("pla-post-arceus", "Arceus obtained")
    ],
    dlc: [],
    progressIds: [
      "pla-noble-kleavor",
      "pla-noble-lilligant",
      "pla-noble-arcanine",
      "pla-noble-electrode",
      "pla-noble-avalugg",
      "pla-ride-wyrdeer",
      "pla-ride-basculegion",
      "pla-ride-sneasler",
      "pla-ride-braviary",
      "pla-ride-ursaluna"
    ],
    hallOfFameIds: ["pla-story-finish"],
    postgameIds: ["pla-post-plates"]
  },
  sv: {
    title: "Pokémon Scarlet and Violet",
    shortTitle: "Pokémon Scarlet and Violet",
    subtitle: "Paldea academy tracker",
    story: [
      journeyItem("sv-story-academy", "Finish the academy opening"),
      journeyItem("sv-story-paths", "Unlock all three treasure paths"),
      journeyItem("sv-story-area-zero", "Reach Area Zero"),
      journeyItem("sv-story-homeway", "Clear The Way Home")
    ],
    columnsTitle: "Treasure Paths",
    columns: [
      {
        title: "Victory Road",
        items: [
          journeyItem("sv-gym-bug", "Cortondo Gym"),
          journeyItem("sv-gym-grass", "Artazon Gym"),
          journeyItem("sv-gym-electric", "Levincia Gym"),
          journeyItem("sv-gym-water", "Cascarrafa Gym"),
          journeyItem("sv-gym-normal", "Medali Gym"),
          journeyItem("sv-gym-ghost", "Montenevera Gym"),
          journeyItem("sv-gym-psychic", "Alfornada Gym"),
          journeyItem("sv-gym-ice", "Glaseado Gym")
        ]
      },
      {
        title: "Path of Legends",
        items: [
          journeyItem("sv-titan-stony", "Stony Cliff Titan"),
          journeyItem("sv-titan-open", "Open Sky Titan"),
          journeyItem("sv-titan-lurking", "Lurking Steel Titan"),
          journeyItem("sv-titan-quaking", "Quaking Earth Titan"),
          journeyItem("sv-titan-false", "False Dragon Titan")
        ]
      },
      {
        title: "Starfall Street",
        items: [
          journeyItem("sv-star-dark", "Team Star Dark Crew"),
          journeyItem("sv-star-fire", "Team Star Fire Crew"),
          journeyItem("sv-star-poison", "Team Star Poison Crew"),
          journeyItem("sv-star-fairy", "Team Star Fairy Crew"),
          journeyItem("sv-star-fighting", "Team Star Fighting Crew")
        ]
      }
    ],
    legendarySpecies: [1001, 1002, 1003, 1004, 1007, 1008, 1017, 1018, 1020, 1021, 1024],
    postgame: [
      journeyItem("sv-post-ace-tournament", "Academy Ace Tournament unlocked"),
      journeyItem("sv-post-ruinous", "Ruinous Quartet stakes resolved"),
      journeyItem("sv-post-rematches", "Area Zero rematches or cleanup started")
    ],
    dlc: [
      journeyItem("sv-dlc-teal-mask-start", "The Teal Mask started"),
      journeyItem("sv-dlc-teal-mask-clear", "The Teal Mask cleared"),
      journeyItem("sv-dlc-indigo-start", "The Indigo Disk started"),
      journeyItem("sv-dlc-indigo-clear", "Blueberry League cleared"),
      journeyItem("sv-dlc-epilogue", "Epilogue cleared")
    ],
    progressIds: [
      "sv-gym-bug",
      "sv-gym-grass",
      "sv-gym-electric",
      "sv-gym-water",
      "sv-gym-normal",
      "sv-gym-ghost",
      "sv-gym-psychic",
      "sv-gym-ice",
      "sv-titan-stony",
      "sv-titan-open",
      "sv-titan-lurking",
      "sv-titan-quaking",
      "sv-titan-false",
      "sv-star-dark",
      "sv-star-fire",
      "sv-star-poison",
      "sv-star-fairy",
      "sv-star-fighting"
    ],
    hallOfFameIds: ["sv-story-homeway"],
    postgameIds: ["sv-post-ace-tournament"]
  },
  lza: {
    title: "Pokémon Legends: Z-A",
    shortTitle: "Pokémon Legends: Z-A",
    subtitle: "Lumiose redevelopment tracker",
    story: [
      journeyItem("lza-story-hotel-z", "Check into Hotel Z"),
      journeyItem("lza-story-patrol", "Finish the first wild zone patrol"),
      journeyItem("lza-story-royale", "Unlock the Z-A Royale"),
      journeyItem("lza-story-finish", "Clear the main campaign")
    ],
    columnsTitle: "City Objectives",
    columns: [
      {
        title: "Wild Zones",
        items: [
          journeyItem("lza-zone-north", "North Wild Zone"),
          journeyItem("lza-zone-west", "West Wild Zone"),
          journeyItem("lza-zone-east", "East Wild Zone"),
          journeyItem("lza-zone-south", "South Wild Zone")
        ]
      },
      {
        title: "Royale",
        items: [
          journeyItem("lza-royale-rank-c", "Reach Rank C"),
          journeyItem("lza-royale-rank-b", "Reach Rank B"),
          journeyItem("lza-royale-rank-a", "Reach Rank A"),
          journeyItem("lza-royale-rank-z", "Reach Rank Z-A")
        ]
      },
      {
        title: "Mega Ops",
        items: [
          journeyItem("lza-mega-key", "Mega key item secured"),
          journeyItem("lza-mega-boss", "Mega storyline boss cleared"),
          journeyItem("lza-mega-cleanup", "Mega cleanup requests started")
        ]
      }
    ],
    legendarySpecies: [150, 380, 381, 382, 383, 384, 491, 638, 639, 640, 647, 648, 649, 716, 717, 718, 719, 720, 721, 807, 801],
    postgame: [
      journeyItem("lza-post-hotel-requests", "Hotel Z side requests opened"),
      journeyItem("lza-post-lumiose", "Lumiose postgame cleanup started"),
      journeyItem("lza-post-mythical", "Mythical or late-game hunts started")
    ],
    dlc: [
      journeyItem("lza-dlc-hyperspace-start", "Hyperspace investigations started"),
      journeyItem("lza-dlc-hyperspace-clear", "Hyperspace objective chain cleared"),
      journeyItem("lza-dlc-mega-start", "Mega Dimension entered"),
      journeyItem("lza-dlc-mega-clear", "Mega Dimension objectives cleared")
    ],
    progressIds: [
      "lza-zone-north",
      "lza-zone-west",
      "lza-zone-east",
      "lza-zone-south",
      "lza-royale-rank-c",
      "lza-royale-rank-b",
      "lza-royale-rank-a",
      "lza-royale-rank-z",
      "lza-mega-key",
      "lza-mega-boss",
      "lza-mega-cleanup"
    ],
    hallOfFameIds: ["lza-story-finish"],
    postgameIds: ["lza-post-hotel-requests"]
  }
};

const SWITCH_GAME_AVAILABILITY = {
  lgpe: {
    label: "Kanto Dex + Meltan line",
    pokedexes: ["letsgo-kanto"],
    extraSpecies: [808, 809]
  },
  swsh: {
    label: "Galar + Isle of Armor + Crown Tundra + Max Lair",
    pokedexes: ["galar", "isle-of-armor", "crown-tundra"],
    segments: [
      {
        id: "main",
        kind: "main",
        label: "Main Game",
        sourceLabel: "Galar Dex",
        pokedexes: ["galar"]
      },
      {
        id: "isle-of-armor",
        kind: "dlc",
        label: "Isle of Armor DLC",
        sourceLabel: "Isle of Armor Dex",
        pokedexes: ["isle-of-armor"]
      },
      {
        id: "crown-tundra",
        kind: "dlc",
        label: "Crown Tundra DLC",
        sourceLabel: "Crown Tundra Dex",
        pokedexes: ["crown-tundra"]
      },
      {
        id: "dynamax-adventure",
        kind: "dlc",
        label: "Dynamax Adventures",
        sourceLabel: "Max Lair Pool",
        speciesNumbers: SWSH_DYNAMAX_ADVENTURE_SPECIES,
        versionNative: SWSH_DYNAMAX_ADVENTURE_VERSION_NATIVE,
        defaultVersionLabel: "Both Versions"
      }
    ]
  },
  bdsp: {
    label: "BDSP National coverage up to #0493",
    baseRanges: [{ start: 1, end: 493 }]
  },
  pla: {
    label: "Hisui Dex",
    pokedexes: ["hisui"]
  },
  sv: {
    label: "Paldea + Kitakami + Blueberry",
    pokedexes: ["paldea", "kitakami", "blueberry"],
    segments: [
      {
        id: "main",
        kind: "main",
        label: "Main Game",
        sourceLabel: "Paldea Dex",
        pokedexes: ["paldea"]
      },
      {
        id: "kitakami",
        kind: "dlc",
        label: "Teal Mask DLC",
        sourceLabel: "Kitakami Dex",
        pokedexes: ["kitakami"]
      },
      {
        id: "blueberry",
        kind: "dlc",
        label: "Indigo Disk DLC",
        sourceLabel: "Blueberry Dex",
        pokedexes: ["blueberry"]
      }
    ]
  },
  lza: {
    label: "Lumiose + Hyperspace + Mega coverage",
    speciesOrderNames: LZA_FULL_ORDER_NAMES,
    speciesNumbers: LZA_AVAILABLE_SPECIES,
    segments: [
      {
        id: "main",
        kind: "main",
        label: "Main Game",
        sourceLabel: "Lumiose Dex",
        speciesOrderNames: LZA_LUMIOSE_ORDER_NAMES,
        speciesNumbers: LZA_LUMIOSE_SPECIES
      },
      {
        id: "mega-dimension",
        kind: "dlc",
        label: "Mega Dimension DLC",
        sourceLabel: "Hyperspace + Mega Dex",
        speciesOrderNames: LZA_MEGA_DIMENSION_ORDER_NAMES,
        speciesNumbers: LZA_DLC_SPECIES
      }
    ]
  }
};

const SWITCH_GAME_AVAILABILITY_NOTE =
  "Species-level coverage is based on each Switch title's tracked regional or in-game dex support. Legends: Z-A uses the public PokePC dataset so Lumiose, Hyperspace, and Mega Dimension coverage can stay split even though PokeAPI and Pokemon HOME do not expose a machine-readable Z-A regional dex yet.";

const FLAVOR_VERSION_ORDER = [
  { name: "scarlet", label: "Scarlet", gameId: "sv", priority: 0 },
  { name: "violet", label: "Violet", gameId: "sv", priority: 1 },
  { name: "legends-arceus", label: "Legends: Arceus", gameId: "pla", priority: 2 },
  { name: "brilliant-diamond", label: "Brilliant Diamond", gameId: "bdsp", priority: 3 },
  { name: "shining-pearl", label: "Shining Pearl", gameId: "bdsp", priority: 4 },
  { name: "sword", label: "Sword", gameId: "swsh", priority: 5 },
  { name: "shield", label: "Shield", gameId: "swsh", priority: 6 },
  { name: "lets-go-pikachu", label: "Let's Go Pikachu", gameId: "lgpe", priority: 7 },
  { name: "lets-go-eevee", label: "Let's Go Eevee", gameId: "lgpe", priority: 8 }
];

const FLAVOR_VERSION_META = Object.fromEntries(
  FLAVOR_VERSION_ORDER.map((entry) => [entry.name, entry])
);

const SHINY_HUNT_METHODS = {
  lgpe: {
    title: "Catch Combo + Lure",
    detail:
      "Build a same-species catch combo, keep a lure active, and recycle visible overworld spawns for fast checks.",
    note:
      "Let's Go shines when you stay on one route and let the overworld do the work instead of forcing random encounter loops.",
    prep: ["Combo 31+", "Lure", "Shiny Charm"]
  },
  swsh: {
    title: "Masuda Eggs / Encounter Loops",
    detail:
      "Use Masuda breeding for clean repeatability, or swap to repeatable overworld routes and special dens for non-breedable targets.",
    note:
      "Sword and Shield is flexible: eggs are the easy long-session route, while repeatable encounters and DLC content cover awkward targets.",
    prep: ["Foreign Ditto", "Oval Charm", "Shiny Charm"]
  },
  bdsp: {
    title: "Poke Radar Chains / Masuda Eggs",
    detail:
      "Radar chains are the signature field hunt, while Masuda breeding cleans up species that are annoying to chain on grass patches.",
    note:
      "BDSP rewards patience and clean board resets more than raw spawn volume, so consistent setup matters more than speed.",
    prep: ["Poke Radar", "Repels", "Chain Discipline"]
  },
  pla: {
    title: "Mass Outbreak / MMO",
    detail:
      "Push the research page, watch outbreaks, and reroll area checks for repeated high-value shiny passes in Hisui.",
    note:
      "Legends: Arceus is usually the fastest natural shiny environment once the species page is established and the route is repeatable.",
    prep: ["Research 10", "Shiny Charm", "Camp Reset"]
  },
  sv: {
    title: "Outbreak + Sandwich",
    detail:
      "Break the outbreak down, trigger a Sparkling Power sandwich, and rotate picnic or spawn resets for sustained checks.",
    note:
      "Scarlet and Violet is strongest when you pair outbreak thinning with type-targeted sandwiches and long spawn cycles.",
    prep: ["60 KOs", "Sparkling Lv.3", "Shiny Charm"]
  },
  lza: {
    title: "Wild Zone Patrol / Alpha Route",
    detail:
      "Patrol Lumiose's wild zones during the day, chain quick battle checks, and revisit alpha-heavy sectors for repeatable scans.",
    note:
      "Z-A shines when you treat Lumiose like a circuit: scout the city ring, clear a zone, then loop back through active wild sectors instead of standing still.",
    prep: ["Wild Zone Loop", "Alpha Checks", "Item Stock"]
  }
};

const MODULE_CATALOG = [
  {
    title: "Living Form Dex",
    status: "Live",
    summary: "Grouped forms, sprites, progress tracking, and form-family scanning."
  },
  {
    title: "EXP Planner",
    status: "Live",
    summary: "Growth-rate projections, target-level math, and battle-count estimates."
  },
  {
    title: "Shiny Hunt Helper",
    status: "Live",
    summary: "Per-game shiny routes, prep tags, and availability-aware hunt guidance."
  },
  {
    title: "Playthrough Tracker",
    status: "Live",
    summary: "Track owned Switch saves, active milestones, and postgame status."
  },
  {
    title: "Smart Suggestors",
    status: "Live",
    summary: "Catch-next, shiny-target, and what-to-do-next recommendations."
  },
  {
    title: "Core Databases",
    status: "Queued",
    summary: "Moves, abilities, items, locations, and trainer/NPC encyclopedias."
  },
  {
    title: "Advanced Calculators",
    status: "Queued",
    summary: "IV/EV, breeding, shiny odds, tera planning, and friendship tools."
  },
  {
    title: "Guides & Events",
    status: "Queued",
    summary: "Postgame routes, hunt methods, Mystery Gift archives, and live calendars."
  },
  {
    title: "Accounts & Exports",
    status: "Roadmap",
    summary: "Profiles, Home sync notes, PDFs, share links, and saved reports."
  }
];

const LZA_DONUT_FLAVOR_META = [
  ["sweet", "Sweet"],
  ["spicy", "Spicy"],
  ["sour", "Sour"],
  ["bitter", "Bitter"],
  ["fresh", "Fresh"]
];

const LZA_DONUT_BERRIES_BY_NAME = new Map(LZA_DONUT_BERRIES.map((berry) => [berry.name, berry]));
const PLA_RECIPES_BY_NAME = new Map(PLA_RECIPE_CATALOG.map((recipe) => [recipe.name, recipe]));
const PLA_MATERIAL_NAMES = [...new Set(PLA_RECIPE_CATALOG.flatMap((recipe) => recipe.materials.map((material) => material.name)))].sort();
const SV_SHINY_SANDWICHES_BY_TYPE = new Map(
  SV_SHINY_SANDWICH_RECIPES.map((recipe) => [recipe.type, recipe])
);

const ALCREMIE_CREAMS = [
  { slug: "vanilla-cream", label: "Vanilla Cream" },
  { slug: "ruby-cream", label: "Ruby Cream" },
  { slug: "matcha-cream", label: "Matcha Cream" },
  { slug: "mint-cream", label: "Mint Cream" },
  { slug: "lemon-cream", label: "Lemon Cream" },
  { slug: "salted-cream", label: "Salted Cream" },
  { slug: "ruby-swirl", label: "Ruby Swirl" },
  { slug: "caramel-swirl", label: "Caramel Swirl" },
  { slug: "rainbow-swirl", label: "Rainbow Swirl" }
];

const ALCREMIE_SWEETS = [
  { slug: "strawberry-sweet", label: "Strawberry Sweet" },
  { slug: "berry-sweet", label: "Berry Sweet" },
  { slug: "love-sweet", label: "Love Sweet" },
  { slug: "star-sweet", label: "Star Sweet" },
  { slug: "clover-sweet", label: "Clover Sweet" },
  { slug: "flower-sweet", label: "Flower Sweet" },
  { slug: "ribbon-sweet", label: "Ribbon Sweet" }
];

const VIVILLON_PATTERNS = [
  { slug: "meadow-pattern", label: "Meadow Pattern" },
  { slug: "archipelago-pattern", label: "Archipelago Pattern" },
  { slug: "continental-pattern", label: "Continental Pattern" },
  { slug: "elegant-pattern", label: "Elegant Pattern" },
  { slug: "fancy-pattern", label: "Fancy Pattern" },
  { slug: "garden-pattern", label: "Garden Pattern" },
  { slug: "high-plains-pattern", label: "High Plains Pattern" },
  { slug: "icy-snow-pattern", label: "Icy Snow Pattern" },
  { slug: "jungle-pattern", label: "Jungle Pattern" },
  { slug: "marine-pattern", label: "Marine Pattern" },
  { slug: "modern-pattern", label: "Modern Pattern" },
  { slug: "monsoon-pattern", label: "Monsoon Pattern" },
  { slug: "ocean-pattern", label: "Ocean Pattern" },
  { slug: "poke-ball-pattern", label: "Poke Ball Pattern" },
  { slug: "polar-pattern", label: "Polar Pattern" },
  { slug: "river-pattern", label: "River Pattern" },
  { slug: "sandstorm-pattern", label: "Sandstorm Pattern" },
  { slug: "savannah-pattern", label: "Savannah Pattern" },
  { slug: "sun-pattern", label: "Sun Pattern" },
  { slug: "tundra-pattern", label: "Tundra Pattern" }
];

const FURFROU_TRIMS = [
  { slug: "natural", label: "Natural Form" },
  { slug: "heart", label: "Heart Trim" },
  { slug: "star", label: "Star Trim" },
  { slug: "diamond", label: "Diamond Trim" },
  { slug: "debutante", label: "Debutante Trim" },
  { slug: "matron", label: "Matron Trim" },
  { slug: "dandy", label: "Dandy Trim" },
  { slug: "la-reine", label: "La Reine Trim" },
  { slug: "kabuki", label: "Kabuki Trim" },
  { slug: "pharaoh", label: "Pharaoh Trim" }
];

const KALOS_FLOWER_COLORS = [
  { slug: "red", label: "Red Flower", isDefault: true },
  { slug: "yellow", label: "Yellow Flower" },
  { slug: "orange", label: "Orange Flower" },
  { slug: "blue", label: "Blue Flower" },
  { slug: "white", label: "White Flower" }
];

const KALOS_FLOWER_FAMILIES = [
  { baseNumber: 669, basePokemonName: "flabebe", displayLabel: "Flabebe" },
  { baseNumber: 670, basePokemonName: "floette", displayLabel: "Floette" },
  { baseNumber: 671, basePokemonName: "florges", displayLabel: "Florges" }
];

const BURMY_CLOAKS = [
  { slug: "plant", label: "Plant Cloak", isDefault: true },
  { slug: "sandy", label: "Sandy Cloak" },
  { slug: "trash", label: "Trash Cloak" }
];

const SINNOH_SEA_VARIANT_META = {
  shellos: {
    displayName: "Shellos West Sea",
    variantLabel: "West Sea",
    detailNote: "West Sea is tracked as Shellos's default Sinnoh sea variant."
  },
  "shellos-east": {
    displayName: "Shellos East Sea",
    variantLabel: "East Sea",
    detailNote: "East Sea is tracked as Shellos's alternate Sinnoh sea variant."
  },
  gastrodon: {
    displayName: "Gastrodon West Sea",
    variantLabel: "West Sea",
    detailNote: "West Sea is tracked as Gastrodon's default Sinnoh sea variant."
  },
  "gastrodon-east": {
    displayName: "Gastrodon East Sea",
    variantLabel: "East Sea",
    detailNote: "East Sea is tracked as Gastrodon's alternate Sinnoh sea variant."
  }
};

const SINNOH_EAST_SEA_VARIANTS = [
  {
    name: "shellos-east",
    displayName: "Shellos East Sea",
    baseNumber: 422,
    basePokemonName: "shellos",
    variantLabel: "East Sea",
    detailNote: "East Sea is tracked as Shellos's alternate Sinnoh sea variant.",
    spriteSlug: "east"
  },
  {
    name: "gastrodon-east",
    displayName: "Gastrodon East Sea",
    baseNumber: 423,
    basePokemonName: "gastrodon",
    variantLabel: "East Sea",
    detailNote: "East Sea is tracked as Gastrodon's alternate Sinnoh sea variant.",
    spriteSlug: "east"
  }
];

const UNOVA_SEASON_VARIANT_META = {
  deerling: {
    displayName: "Deerling Spring Form",
    variantLabel: "Spring Form",
    detailNote: "Spring Form is tracked as Deerling's default seasonal appearance."
  },
  sawsbuck: {
    displayName: "Sawsbuck Spring Form",
    variantLabel: "Spring Form",
    detailNote: "Spring Form is tracked as Sawsbuck's default seasonal appearance."
  }
};

const UNOVA_SEASON_VARIANTS = [
  {
    name: "deerling-summer",
    displayName: "Deerling Summer Form",
    baseNumber: 585,
    basePokemonName: "deerling",
    variantLabel: "Summer Form",
    detailNote: "Summer Form is tracked as Deerling's warm-season appearance.",
    spriteSlug: "summer"
  },
  {
    name: "deerling-autumn",
    displayName: "Deerling Autumn Form",
    baseNumber: 585,
    basePokemonName: "deerling",
    variantLabel: "Autumn Form",
    detailNote: "Autumn Form is tracked as Deerling's fall-season appearance.",
    spriteSlug: "autumn"
  },
  {
    name: "deerling-winter",
    displayName: "Deerling Winter Form",
    baseNumber: 585,
    basePokemonName: "deerling",
    variantLabel: "Winter Form",
    detailNote: "Winter Form is tracked as Deerling's cold-season appearance.",
    spriteSlug: "winter"
  },
  {
    name: "sawsbuck-summer",
    displayName: "Sawsbuck Summer Form",
    baseNumber: 586,
    basePokemonName: "sawsbuck",
    variantLabel: "Summer Form",
    detailNote: "Summer Form is tracked as Sawsbuck's warm-season appearance.",
    spriteSlug: "summer"
  },
  {
    name: "sawsbuck-autumn",
    displayName: "Sawsbuck Autumn Form",
    baseNumber: 586,
    basePokemonName: "sawsbuck",
    variantLabel: "Autumn Form",
    detailNote: "Autumn Form is tracked as Sawsbuck's fall-season appearance.",
    spriteSlug: "autumn"
  },
  {
    name: "sawsbuck-winter",
    displayName: "Sawsbuck Winter Form",
    baseNumber: 586,
    basePokemonName: "sawsbuck",
    variantLabel: "Winter Form",
    detailNote: "Winter Form is tracked as Sawsbuck's cold-season appearance.",
    spriteSlug: "winter"
  }
];

const UNOWN_FORM_VARIANTS = [
  ..."BCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter, index) => ({
    id: 10001 + index,
    name: `unown-${letter.toLowerCase()}`,
    displayName: `Unown ${letter}`,
    baseNumber: 201,
    basePokemonName: "unown",
    variantLabel: `Letter ${letter}`,
    detailNote: `Letter ${letter} is tracked as one of Unown's alternate alphabet forms.`,
    listSprite: buildHomeThumbnailUrl(`unown-${letter.toLowerCase()}`),
    shinyListSprite: buildHomeThumbnailUrl(`unown-${letter.toLowerCase()}`, true),
    extraSearchTerms: ["letter", "alphabet", "johto", "ruins-of-alph"]
  })),
  {
    id: 10026,
    name: "unown-exclamation",
    displayName: "Unown Exclamation",
    baseNumber: 201,
    basePokemonName: "unown",
    variantLabel: "Exclamation",
    detailNote: "Exclamation is tracked as one of Unown's punctuation forms.",
    listSprite: buildHomeThumbnailUrl("unown-exclamation"),
    shinyListSprite: buildHomeThumbnailUrl("unown-exclamation", true),
    extraSearchTerms: ["punctuation", "symbol", "!", "exclamation mark", "johto", "ruins-of-alph"]
  },
  {
    id: 10027,
    name: "unown-question",
    displayName: "Unown Question",
    baseNumber: 201,
    basePokemonName: "unown",
    variantLabel: "Question",
    detailNote: "Question is tracked as one of Unown's punctuation forms.",
    listSprite: buildHomeThumbnailUrl("unown-question"),
    shinyListSprite: buildHomeThumbnailUrl("unown-question", true),
    extraSearchTerms: ["punctuation", "symbol", "?", "question mark", "johto", "ruins-of-alph"]
  }
];

const AUTHENTICITY_FORM_VARIANTS = [
  {
    name: "sinistea-antique",
    displayName: "Sinistea Antique Form",
    baseNumber: 854,
    basePokemonName: "sinistea",
    variantLabel: "Antique Form",
    detailNote:
      "Antique Form is shown in the forms bank for Sinistea, but it is not counted as a separate living-dex entry.",
    extraSearchTerms: ["antique", "authentic", "authenticity", "rare", "teacup"]
  },
  {
    name: "polteageist-antique",
    displayName: "Polteageist Antique Form",
    baseNumber: 855,
    basePokemonName: "polteageist",
    variantLabel: "Antique Form",
    detailNote:
      "Antique Form is shown in the forms bank for Polteageist, but it is not counted as a separate living-dex entry.",
    extraSearchTerms: ["antique", "authentic", "authenticity", "rare", "teapot"]
  },
  {
    name: "poltchageist-artisan",
    displayName: "Poltchageist Artisan Form",
    baseNumber: 1012,
    basePokemonName: "poltchageist",
    variantLabel: "Artisan Form",
    detailNote:
      "Artisan Form is shown in the forms bank for Poltchageist, but it is not counted as a separate living-dex entry.",
    extraSearchTerms: ["artisan", "rare", "authentic", "authenticity", "matcha"]
  },
  {
    name: "sinistcha-masterpiece",
    displayName: "Sinistcha Masterpiece Form",
    baseNumber: 1013,
    basePokemonName: "sinistcha",
    variantLabel: "Masterpiece Form",
    detailNote:
      "Masterpiece Form is shown in the forms bank for Sinistcha, but it is not counted as a separate living-dex entry.",
    extraSearchTerms: ["masterpiece", "rare", "authentic", "authenticity", "matcha"]
  }
];

const FEMALE_SPRITE_DIFFERENCE_IDS = [
  3, 12, 19, 20, 25, 26, 41, 42, 44, 45, 64, 65, 84, 85, 97, 111, 112, 118, 119, 123, 129, 130,
  133, 154, 165, 166, 178, 185, 186, 190, 194, 195, 198, 202, 203, 207, 208, 212, 214, 215, 217,
  221, 224, 229, 232, 255, 256, 257, 267, 269, 272, 274, 275, 307, 308, 315, 316, 317, 322, 323,
  332, 350, 369, 396, 397, 398, 399, 400, 401, 402, 403, 404, 405, 407, 415, 417, 418, 419, 424,
  443, 444, 445, 449, 450, 453, 454, 456, 457, 459, 460, 461, 464, 465, 473, 521, 592, 593, 668,
  678, 876, 916
];

const FEMALE_VARIANT_BASE_NUMBER_SET = new Set(FEMALE_SPRITE_DIFFERENCE_IDS);

function stripTrackedGenderSuffix(value) {
  return String(value ?? "")
    .trim()
    .replace(/-(male|female)$/i, "");
}

function applyTrackedGenderPairIdentity(entry) {
  if (!entry) {
    return entry;
  }

  const baseNumber = Number(entry.baseNumber ?? entry.id) || 0;
  const hasTrackedFemaleVariant = FEMALE_VARIANT_BASE_NUMBER_SET.has(baseNumber);
  const isGenderVariant = entry.syntheticKind === "gender";
  if (!hasTrackedFemaleVariant && !isGenderVariant) {
    return entry;
  }

  const rootName = stripTrackedGenderSuffix(entry.basePokemonName || entry.name);
  const baseDisplayName = titleCase(rootName || entry.basePokemonName || entry.name);
  entry.basePokemonName = rootName || entry.basePokemonName;
  entry.baseDisplayName = baseDisplayName;

  if (!entry.isForm && hasTrackedFemaleVariant) {
    entry.displayName = `${baseDisplayName} Male`;
    entry.variantLabel = "Male";
  } else if (isGenderVariant) {
    entry.displayName = `${baseDisplayName} Female`;
    entry.variantLabel = "Female";
  }

  return entry;
}

const FORM_GAME_SUPPORT = {
  none: new Set(),
  lgpeSwshSv: new Set(["lgpe", "swsh", "sv"]),
  swshOnly: new Set(["swsh"]),
  plaOnly: new Set(["pla"]),
  svOnly: new Set(["sv"]),
  lzaOnly: new Set(["lza"]),
  bdspPla: new Set(["bdsp", "pla"]),
  bdspPlaSwshSv: new Set(["bdsp", "pla", "swsh", "sv"]),
  bdspPlaSv: new Set(["bdsp", "pla", "sv"]),
  plaSv: new Set(["pla", "sv"]),
  swshSv: new Set(["swsh", "sv"]),
  svLza: new Set(["sv", "lza"])
};

const GAME_BASE_FORM_UNAVAILABLE_SPECIES = {
  pla: new Set([
    "arcanine",
    "avalugg",
    "basculin",
    "braviary",
    "decidueye",
    "electrode",
    "goodra",
    "growlithe",
    "lilligant",
    "qwilfish",
    "samurott",
    "sliggoo",
    "typhlosion",
    "voltorb",
    "zorua",
    "zoroark"
  ]),
  swsh: new Set([
    "gastrodon",
    "shellos"
  ])
};

const GAME_FILTER_UNOBTAINABLE_FORM_PATTERN =
  /^(castform-(sunny|rainy|snowy)|cherrim-sunshine|meloetta-pirouette|aegislash-blade|darmanitan-(zen|galar-zen)|greninja-(battle-bond|ash)|zygarde-(10-power-construct|50-power-construct|complete)|wishiwashi-school|mimikyu-busted|cramorant-(gulping|gorging)|eiscue-noice|morpeko-hangry|palafin-hero|eternatus-eternamax|xerneas-active|terapagos-(terastal|stellar)|pikachu-(original|hoenn|sinnoh|unova|kalos|alola|partner|world)-cap)$/;

const DEFAULT_GAME_VARIANT_BASE_NAME_PATTERN =
  /-(altered|aria|average|incarnate|meadow|midday|natural|ordinary|plant|rapid-strike|red-striped|single-strike|spring|standard|unremarkable|west)$/;

const SPECIES_ORDER_DEFAULT_FORM_SUFFIXES = [
  "male",
  "ordinary",
  "aria",
  "average",
  "amped",
  "shield",
  "50",
  "full-belly",
  "green-plumage",
  "curly",
  "red-striped",
  "west",
  "spring",
  "plant",
  "natural",
  "meadow",
  "midday",
  "incarnate",
  "altered",
  "standard",
  "disguised"
];

const UNOWN_FORM_ORDER = new Map([
  ["unown", 0],
  ["unown-a", 0],
  ["unown-b", 1],
  ["unown-c", 2],
  ["unown-d", 3],
  ["unown-e", 4],
  ["unown-f", 5],
  ["unown-g", 6],
  ["unown-h", 7],
  ["unown-i", 8],
  ["unown-j", 9],
  ["unown-k", 10],
  ["unown-l", 11],
  ["unown-m", 12],
  ["unown-n", 13],
  ["unown-o", 14],
  ["unown-p", 15],
  ["unown-q", 16],
  ["unown-r", 17],
  ["unown-s", 18],
  ["unown-t", 19],
  ["unown-u", 20],
  ["unown-v", 21],
  ["unown-w", 22],
  ["unown-x", 23],
  ["unown-y", 24],
  ["unown-z", 25],
  ["unown-exclamation", 26],
  ["unown-question", 27]
]);

const HOME_BOX_COMPATIBILITY_RULES = [
  {
    tag: "Dex Only",
    reason: "Mega Evolutions register in HOME's dex but cannot live in a HOME box as separate targets.",
    matches: (entry) => entry.name.includes("-mega")
  },
  {
    tag: "Dex Only",
    reason: "Primal forms are battle transformations, so HOME does not store them as separate box targets.",
    matches: (entry) => entry.name.includes("-primal")
  },
  {
    tag: "Dex Only",
    reason: "This is a battle-only or temporary form that HOME can register without needing a dedicated storage slot.",
    matches: (entry) =>
      /^(castform-(sunny|rainy|snowy)|cherrim-sunshine|meloetta-pirouette|aegislash-blade|darmanitan-(zen|galar-zen)|greninja-(battle-bond|ash)|zygarde-(10-power-construct|50-power-construct|complete)|wishiwashi-school|mimikyu-busted|cramorant-(gulping|gorging)|eiscue-noice|morpeko-hangry|palafin-hero|eternatus-eternamax|xerneas-active|terapagos-(terastal|stellar))$/.test(
        entry.name
      )
  },
  {
    tag: "Dex Only",
    reason: "Fusion forms register in HOME's dex, but HOME stores the component Pokemon separately instead of boxing the fused form.",
    matches: (entry) =>
      /^(kyurem-(black|white)|necrozma-(dusk|dawn|ultra)|calyrex-(ice|shadow))$/.test(entry.name)
  },
  {
    tag: "Dex Only",
    reason: "Sky Forme is visible in the living dex, but HOME does not preserve it as its own boxed form.",
    archiveVisible: true,
    matches: (entry) => /^shaymin-sky$/.test(entry.name)
  },
  {
    tag: "Dex Only",
    reason: "This form depends on an item or mask that HOME does not preserve as its own boxed form.",
    matches: (entry) =>
      /^(dialga-origin|palkia-origin|giratina-origin|genesect-(burn|chill|douse|shock)|ogerpon-(wellspring-mask|hearthflame-mask|cornerstone-mask)|zacian-crowned|zamazenta-crowned)$/.test(
        entry.name
      ) ||
      (entry.basePokemonName === "arceus" && entry.name !== "arceus") ||
      (entry.basePokemonName === "silvally" && entry.name !== "silvally")
  },
  {
    tag: "Not Supported",
    reason: "This special event or costume form is not treated as its own Pokemon HOME entry.",
    matches: (entry) =>
      /^(pikachu-(rock-star|belle|pop-star|phd|libre|cosplay|starter)|eevee-starter|spiky-eared-pichu)$/.test(
        entry.name
      )
  },
  {
    tag: "Not Supported",
    reason: "Totem, ride, or scripted-only forms are not stored as separate Pokemon HOME targets.",
    matches: (entry) =>
      /(^|-)totem(-|$)|starmobile|^koraidon-(limited-build|sprinting-build|swimming-build|gliding-build)$|^miraidon-(low-power-mode|drive-mode|aquatic-mode|glide-mode)$/.test(
        entry.name
      )
  }
];

const TYPE_COLORS = {
  normal: "#9e957f",
  fire: "#dd6b3f",
  water: "#3f8fd8",
  electric: "#e4b229",
  grass: "#51a857",
  ice: "#6ec7cb",
  fighting: "#a5533b",
  poison: "#8b5cb8",
  ground: "#b88b48",
  flying: "#7c90dc",
  psychic: "#db679f",
  bug: "#7da04d",
  rock: "#9e8b59",
  ghost: "#635b93",
  dragon: "#5a79dc",
  dark: "#5e5248",
  steel: "#7d8d9d",
  fairy: "#dd8cc3"
};

const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5
  },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5
  }
};

const TYPE_NAMES = Object.keys(TYPE_CHART);

const GENERATION_RANGES = [
  { label: "1", start: 1, end: 151 },
  { label: "2", start: 152, end: 251 },
  { label: "3", start: 252, end: 386 },
  { label: "4", start: 387, end: 493 },
  { label: "5", start: 494, end: 649 },
  { label: "6", start: 650, end: 721 },
  { label: "7", start: 722, end: 809 },
  { label: "8", start: 810, end: 905 },
  { label: "9", start: 906, end: 1025 }
];

const FAVORITE_PICKER_RESULT_LIMIT = 80;
const SHINY_HUB_RESULT_LIMIT = 80;

const elements = {
  navTabs: [...document.querySelectorAll("[data-view]")],
  dashboardOpenViewButtons: [...document.querySelectorAll("[data-open-view]")],
  dashboardSoonButtons: [...document.querySelectorAll("[data-coming-soon]")],
  viewPanels: [...document.querySelectorAll("[data-view-panel]")],
  modulePanels: [...document.querySelectorAll("[data-module-view]")],
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#pokemon-search"),
  openEntryButton: document.querySelector("#open-entry-btn"),
  randomButton: document.querySelector("#random-btn"),
  statusText: document.querySelector("#status-text"),
  scopeButtons: [...document.querySelectorAll("[data-scope]")],
  archiveModeButtons: [...document.querySelectorAll("[data-archive-mode]")],
  archiveViewButtons: [...document.querySelectorAll("[data-archive-view]")],
  statusButtons: [...document.querySelectorAll("[data-status]")],
  signatureButtons: [...document.querySelectorAll("[data-signature]")],
  sortSelect: document.querySelector("#sort-select"),
  sortCaughtOption: document.querySelector('#sort-select option[value="caught"]'),
  generationSelect: document.querySelector("#generation-select"),
  gameFilterSelect: document.querySelector("#game-filter-select"),
  ownedGameOnlyToggleShell: document.querySelector("#owned-game-only-toggle-shell"),
  ownedGameOnlyToggle: document.querySelector("#owned-game-only-toggle"),
  ownedGameOnlyNote: document.querySelector("#owned-game-only-note"),
  archiveDuplicateModeShell: document.querySelector("#archive-duplicate-mode-shell"),
  archiveDuplicateModeToggle: document.querySelector("#archive-duplicate-mode-toggle"),
  archiveDuplicateNote: document.querySelector("#archive-duplicate-note"),
  sessionButton: document.querySelector("#session-button"),
  landingWelcome: document.querySelector("#landing-welcome"),
  landingSummary: document.querySelector("#landing-summary"),
  landingProfileMetric: document.querySelector("#landing-profile-metric"),
  landingLivingMetric: document.querySelector("#landing-living-metric"),
  landingShinyMetric: document.querySelector("#landing-shiny-metric"),
  landingShinyNote: document.querySelector("#landing-shiny-note"),
  landingOwnedMetric: document.querySelector("#landing-owned-metric"),
  landingStorageMetric: document.querySelector("#landing-storage-metric"),
  landingStorageNote: document.querySelector("#landing-storage-note"),
  landingCurrentGameName: document.querySelector("#landing-current-game-name"),
  landingCurrentGameNote: document.querySelector("#landing-current-game-note"),
  landingTrainerCode: document.querySelector("#landing-trainer-code"),
  landingBadgeTotal: document.querySelector("#landing-badge-total"),
  landingPokedexTotal: document.querySelector("#landing-pokedex-total"),
  landingOwnedReleaseTotal: document.querySelector("#landing-owned-release-total"),
  archiveModeIndicator: document.querySelector("#archive-mode-indicator"),
  archiveBaseCount: document.querySelector("#archive-base-count"),
  archiveFormCount: document.querySelector("#archive-form-count"),
  archiveRegistryLabel: document.querySelector("#archive-registry-label"),
  archiveCaughtCount: document.querySelector("#archive-caught-count"),
  resultsCount: document.querySelector("#results-count"),
  resultsSummary: document.querySelector("#results-summary"),
  sortIndicator: document.querySelector("#sort-indicator"),
  statTrackedLabel: document.querySelector("#stat-tracked-label"),
  statMissingLabel: document.querySelector("#stat-missing-label"),
  statCaught: document.querySelector("#stat-caught"),
  statMissing: document.querySelector("#stat-missing"),
  statVisible: document.querySelector("#stat-visible"),
  statSelected: document.querySelector("#stat-selected"),
  archiveLivingProgressText: document.querySelector("#archive-living-progress-text"),
  archiveLivingProgressBar: document.querySelector("#archive-living-progress-bar"),
  archiveShinyProgressText: document.querySelector("#archive-shiny-progress-text"),
  archiveShinyProgressBar: document.querySelector("#archive-shiny-progress-bar"),
  currentScanRibbon: document.querySelector("#current-scan-ribbon"),
  currentScanOpenButton: document.querySelector("#current-scan-open-btn"),
  currentScanClearButton: document.querySelector("#current-scan-clear-btn"),
  currentScanSprite: document.querySelector("#current-scan-sprite"),
  currentScanName: document.querySelector("#current-scan-name"),
  currentScanMeta: document.querySelector("#current-scan-meta"),
  currentScanTypes: document.querySelector("#current-scan-types"),
  dexList: document.querySelector("#dex-list"),
  dexEntryTemplate: document.querySelector("#dex-entry-template"),
  pokemonName: document.querySelector("#pokemon-name"),
  detailEmpty: document.querySelector("#detail-empty"),
  detailContent: document.querySelector("#detail-content"),
  toggleCaughtButton: document.querySelector("#toggle-caught-btn"),
  scanCaughtStepperShell: document.querySelector("#scan-caught-stepper-shell"),
  scanCaughtMinusButton: document.querySelector("#scan-caught-minus-btn"),
  scanCaughtCount: document.querySelector("#scan-caught-count"),
  scanCaughtPlusButton: document.querySelector("#scan-caught-plus-btn"),
  toggleShinyButton: document.querySelector("#toggle-shiny-btn"),
  clearScanButton: document.querySelector("#clear-scan-btn"),
  pokemonVisualFrame: document.querySelector("#pokemon-visual-frame"),
  pokemonArt: document.querySelector("#pokemon-art"),
  scanVisualButtons: [...document.querySelectorAll("[data-scan-visual]")],
  pokemonDex: document.querySelector("#pokemon-dex"),
  pokemonTypes: document.querySelector("#pokemon-types"),
  detailTabButtons: [...document.querySelectorAll("[data-detail-tab]")],
  detailPanes: [...document.querySelectorAll("[data-detail-panel]")],
  bookmarkButton: document.querySelector("#bookmark-btn"),
  bulbapediaLink: document.querySelector("#bulbapedia-link"),
  serebiiLink: document.querySelector("#serebii-link"),
  pokemonFlavor: document.querySelector("#pokemon-flavor"),
  pokemonGenus: document.querySelector("#pokemon-genus"),
  pokemonHeight: document.querySelector("#pokemon-height"),
  pokemonWeight: document.querySelector("#pokemon-weight"),
  pokemonAbilities: document.querySelector("#pokemon-abilities"),
  pokemonHabitat: document.querySelector("#pokemon-habitat"),
  pokemonGeneration: document.querySelector("#pokemon-generation"),
  pokedexEntryCount: document.querySelector("#pokedex-entry-count"),
  pokedexEntryList: document.querySelector("#pokedex-entry-list"),
  bstTotal: document.querySelector("#bst-total"),
  statsList: document.querySelector("#stats-list"),
  weaknessList: document.querySelector("#weakness-list"),
  resistanceList: document.querySelector("#resistance-list"),
  immunityList: document.querySelector("#immunity-list"),
  gameAvailabilityCount: document.querySelector("#game-availability-count"),
  gameAvailabilityList: document.querySelector("#game-availability-list"),
  gameAvailabilityNote: document.querySelector("#game-availability-note"),
  formCount: document.querySelector("#form-count"),
  formList: document.querySelector("#form-list"),
  evolutionSummary: document.querySelector("#evolution-summary"),
  evolutionList: document.querySelector("#evolution-list"),
  locationSummary: document.querySelector("#location-summary"),
  locationList: document.querySelector("#location-list"),
  collectionFocus: document.querySelector("#collection-focus"),
  mainProgressText: document.querySelector("#main-progress-text"),
  mainProgressBar: document.querySelector("#main-progress-bar"),
  shinyProgressText: document.querySelector("#shiny-progress-text"),
  shinyProgressBar: document.querySelector("#shiny-progress-bar"),
  ownedProgressText: document.querySelector("#owned-progress-text"),
  ownedProgressBar: document.querySelector("#owned-progress-bar"),
  generationBreakdownSummary: document.querySelector("#generation-breakdown-summary"),
  generationBreakdownNote: document.querySelector("#generation-breakdown-note"),
  generationBreakdownGrid: document.querySelector("#generation-breakdown-grid"),
  randomTargetSummary: document.querySelector("#random-target-summary"),
  targetList: document.querySelector("#target-list"),
  shinyTargetList: document.querySelector("#shiny-target-list"),
  landingTargetSelected: document.querySelector("#landing-target-selected"),
  landingShinyTargetSelected: document.querySelector("#landing-shiny-target-selected"),
  landingTargetCatchButton: document.querySelector("#landing-target-catch-btn"),
  landingTargetRerollButton: document.querySelector("#landing-target-reroll-btn"),
  landingShinyLogButton: document.querySelector("#landing-shiny-log-btn"),
  landingShinyRerollButton: document.querySelector("#landing-shiny-reroll-btn"),
  landingRecentList: document.querySelector("#landing-recent-list"),
  landingCompletionRing: document.querySelector("#landing-completion-ring"),
  landingCompletionValue: document.querySelector("#landing-completion-value"),
  landingCompletionCount: document.querySelector("#landing-completion-count"),
  landingCompletionBreakdown: document.querySelector("#landing-completion-breakdown"),
  landingTaskList: document.querySelector("#landing-task-list"),
  landingJourneyGrid: document.querySelector("#landing-journey-grid"),
  landingSuggestionGrid: document.querySelector("#landing-suggestion-grid"),
  landingSmartGrid: document.querySelector("#landing-smart-grid"),
  shinyHubFocus: document.querySelector("#shiny-hub-focus"),
  shinyTotalProgressText: document.querySelector("#shiny-total-progress-text"),
  shinyTotalProgressBar: document.querySelector("#shiny-total-progress-bar"),
  shinyTotalProgressNote: document.querySelector("#shiny-total-progress-note"),
  shinyGameProgressTitle: document.querySelector("#shiny-game-progress-title"),
  shinyGameProgressText: document.querySelector("#shiny-game-progress-text"),
  shinyGameProgressBar: document.querySelector("#shiny-game-progress-bar"),
  shinyGameProgressNote: document.querySelector("#shiny-game-progress-note"),
  shinyGameGrid: document.querySelector("#shiny-game-grid"),
  shinyGameEmpty: document.querySelector("#shiny-game-empty"),
  shinyGameContent: document.querySelector("#shiny-game-content"),
  shinyOddsNote: document.querySelector("#shiny-odds-note"),
  shinyOddsBase: document.querySelector("#shiny-odds-base"),
  shinyOddsBoosted: document.querySelector("#shiny-odds-boosted"),
  shinyOddsMethod: document.querySelector("#shiny-odds-method"),
  shinyOddsChecklist: document.querySelector("#shiny-odds-checklist"),
  shinySuggestSummary: document.querySelector("#shiny-suggest-summary"),
  shinySuggestGrid: document.querySelector("#shiny-suggest-grid"),
  shinySuggestSelected: document.querySelector("#shiny-suggest-selected"),
  shinySuggestCatchButton: document.querySelector("#shiny-suggest-catch-btn"),
  shinySuggestRerollButton: document.querySelector("#shiny-suggest-reroll-btn"),
  shinySearchInput: document.querySelector("#shiny-search-input"),
  shinySearchResultsSummary: document.querySelector("#shiny-search-results-summary"),
  shinySearchList: document.querySelector("#shiny-search-list"),
  shinyGameLockedCount: document.querySelector("#shiny-game-locked-count"),
  shinyGameLockedSummary: document.querySelector("#shiny-game-locked-summary"),
  shinyGameLockedList: document.querySelector("#shiny-game-locked-list"),
  shinyMethodSummary: document.querySelector("#shiny-method-summary"),
  shinyMethodStatus: document.querySelector("#shiny-method-status"),
  shinyMethodTitle: document.querySelector("#shiny-method-title"),
  shinyMethodDetail: document.querySelector("#shiny-method-detail"),
  shinyMethodTags: document.querySelector("#shiny-method-tags"),
  shinyMethodNote: document.querySelector("#shiny-method-note"),
  shinyTrackerGame: document.querySelector("#shiny-tracker-game"),
  shinyTrackerPace: document.querySelector("#shiny-tracker-pace"),
  shinyTrackerSprite: document.querySelector("#shiny-tracker-sprite"),
  shinyTrackerTarget: document.querySelector("#shiny-tracker-target"),
  shinyTrackerCount: document.querySelector("#shiny-tracker-count"),
  shinyTrackerMinusButton: document.querySelector("#shiny-tracker-minus-btn"),
  shinyTrackerPlusButton: document.querySelector("#shiny-tracker-plus-btn"),
  shinyTrackerIncrementInput: document.querySelector("#shiny-tracker-inc-input"),
  shinyTrackerDecrementInput: document.querySelector("#shiny-tracker-dec-input"),
  shinyTrackerTimer: document.querySelector("#shiny-tracker-timer"),
  shinyTrackerEta: document.querySelector("#shiny-tracker-eta"),
  shinyTrackerStartButton: document.querySelector("#shiny-tracker-start-btn"),
  shinyTrackerResetButton: document.querySelector("#shiny-tracker-reset-btn"),
  favoritesCount: document.querySelector("#favorites-count"),
  favoritesSummary: document.querySelector("#favorites-summary"),
  favoritesList: document.querySelector("#favorites-list"),
  bookmarksCount: document.querySelector("#bookmarks-count"),
  bookmarksList: document.querySelector("#bookmarks-list"),
  duplicatePlannerCount: document.querySelector("#duplicate-planner-count"),
  duplicatePlannerSummary: document.querySelector("#duplicate-planner-summary"),
  duplicatePlannerFilterButtons: [...document.querySelectorAll("[data-duplicate-filter]")],
  duplicatePlannerList: document.querySelector("#duplicate-planner-list"),
  favoriteTypesCount: document.querySelector("#favorite-types-count"),
  favoriteTypesSummary: document.querySelector("#favorite-types-summary"),
  favoriteTypesList: document.querySelector("#favorite-types-list"),
  unobtainableCount: document.querySelector("#unobtainable-count"),
  unobtainableSummary: document.querySelector("#unobtainable-summary"),
  unobtainableList: document.querySelector("#unobtainable-list"),
  shinyLockedCount: document.querySelector("#shiny-locked-count"),
  shinyLockedSummary: document.querySelector("#shiny-locked-summary"),
  shinyLockedList: document.querySelector("#shiny-locked-list"),
  trackerSummary: document.querySelector("#tracker-summary"),
  journeyShell: document.querySelector("#journey-shell"),
  expSpeciesLabel: document.querySelector("#exp-species-label"),
  expGameSelect: document.querySelector("#exp-game-select"),
  expCurrentLevel: document.querySelector("#exp-current-level"),
  expCurrentLevelValue: document.querySelector("#exp-current-level-value"),
  expTargetLevel: document.querySelector("#exp-target-level"),
  expYieldInput: document.querySelector("#exp-yield-input"),
  expNextLevelButton: document.querySelector("#exp-next-level-btn"),
  expNextEvolutionButton: document.querySelector("#exp-next-evo-btn"),
  expLevel100Button: document.querySelector("#exp-level-100-btn"),
  expGrowthRate: document.querySelector("#exp-growth-rate"),
  expCurrentTotal: document.querySelector("#exp-current-total"),
  expGap: document.querySelector("#exp-gap"),
  expTargetTotal: document.querySelector("#exp-target-total"),
  expLevel100Gap: document.querySelector("#exp-level-100-gap"),
  expBattleCount: document.querySelector("#exp-battle-count"),
  expEvolutionTarget: document.querySelector("#exp-evolution-target"),
  expEvolutionText: document.querySelector("#exp-evolution-text"),
  expLevel100Text: document.querySelector("#exp-level-100-text"),
  expLevel100Note: document.querySelector("#exp-level-100-note"),
  expPlanText: document.querySelector("#exp-plan-text"),
  huntFocus: document.querySelector("#hunt-focus"),
  huntSummary: document.querySelector("#hunt-summary"),
  huntGrid: document.querySelector("#hunt-grid"),
  profilePill: document.querySelector("#profile-pill"),
  profileCount: document.querySelector("#profile-count"),
  profileSelect: document.querySelector("#profile-select"),
  createProfileButton: document.querySelector("#create-profile-btn"),
  favoritePickerOpenButton: document.querySelector("#favorite-picker-open-btn"),
  accountBadge: document.querySelector("#account-badge"),
  accountSummary: document.querySelector("#account-summary"),
  accountDetail: document.querySelector("#account-detail"),
  accountEmailInput: document.querySelector("#account-email-input"),
  accountPasswordInput: document.querySelector("#account-password-input"),
  accountSignInButton: document.querySelector("#account-sign-in-btn"),
  accountSignUpButton: document.querySelector("#account-sign-up-btn"),
  accountAutoSyncButton: document.querySelector("#account-auto-sync-btn"),
  accountSignOutButton: document.querySelector("#account-sign-out-btn"),
  cloudPushButton: document.querySelector("#cloud-push-btn"),
  cloudSyncButton: document.querySelector("#cloud-sync-btn"),
  notebookStatus: document.querySelector("#notebook-status"),
  trainerNotebook: document.querySelector("#trainer-notebook"),
  favoritePickerOverlay: document.querySelector("#favorite-picker-overlay"),
  favoritePickerTitle: document.querySelector("#favorite-picker-title"),
  favoritePickerNote: document.querySelector("#favorite-picker-note"),
  favoritePickerSearch: document.querySelector("#favorite-picker-search"),
  favoritePickerClearButton: document.querySelector("#favorite-picker-clear-btn"),
  favoritePickerResultsSummary: document.querySelector("#favorite-picker-results-summary"),
  favoritePickerList: document.querySelector("#favorite-picker-list"),
  favoritePickerCloseButton: document.querySelector("#favorite-picker-close-btn"),
  homeFocus: document.querySelector("#home-focus"),
  clearBoxButton: document.querySelector("#clear-box-btn"),
  homeBoxTabs: document.querySelector("#home-box-tabs"),
  homeBoxSummary: document.querySelector("#home-box-summary"),
  homeBoxGrid: document.querySelector("#home-box-grid"),
  homeExcludedCount: document.querySelector("#home-excluded-count"),
  homeExcludedToggleButton: document.querySelector("#home-excluded-toggle-btn"),
  homeExcludedSummary: document.querySelector("#home-excluded-summary"),
  homeExcludedList: document.querySelector("#home-excluded-list"),
  gameChecklistSummary: document.querySelector("#game-checklist-summary"),
  gameChecklistGrid: document.querySelector("#game-checklist-grid"),
  advisorFocus: document.querySelector("#advisor-focus"),
  suggestCatchName: document.querySelector("#suggest-catch-name"),
  suggestCatchText: document.querySelector("#suggest-catch-text"),
  suggestCatchButton: document.querySelector("#suggest-catch-btn"),
  suggestShinyName: document.querySelector("#suggest-shiny-name"),
  suggestShinyText: document.querySelector("#suggest-shiny-text"),
  suggestShinyButton: document.querySelector("#suggest-shiny-btn"),
  suggestTaskName: document.querySelector("#suggest-task-name"),
  suggestTaskText: document.querySelector("#suggest-task-text"),
  moduleGrid: document.querySelector("#module-grid")
};

const profileMetaSeed = loadProfileMeta();
window.__dexterProfileSeed = profileMetaSeed;
const cachedGameAvailability = loadGameAvailabilityCache();
const cloudConfigSeed = loadCloudConfig();

const state = {
  entries: [],
  parkedEntries: [],
  entriesByName: new Map(),
  baseEntriesByName: new Map(),
  baseNamesSorted: [],
  query: "",
  ui: {
    activeView: "landing",
    activeDetailTab: "overview",
    archiveMode: "living",
    archiveView: "list",
    archiveDuplicateMode: false,
    scanVisualMode: "home",
    journeySelectedGame: null,
    duplicatePlannerFilter: "all",
    homeExcludedVisible: false,
    locationSurfaceTabs: {},
    locationMapZoom: {},
    selectedRandomTargetName: null,
    selectedShinyTargetName: null,
    landingActionMode: null,
    favoritePicker: {
      open: false,
      mode: "favorites",
      typeName: null,
      query: "",
      loading: false
    }
  },
  filters: {
    scope: "all",
    status: "all",
    generation: "all",
    game: "all",
    ownedGameOnly: false,
    sort: "id-asc",
    signatures: new Set()
  },
  profileMeta: profileMetaSeed,
  caughtMap: loadCaughtMap(),
  shinyMap: loadShinyMap(),
  tracker: loadTrackerState(),
  expPlan: loadExpPlanState(),
  notebook: loadNotebookState(),
  favoritesMap: loadFavoritesMap(),
  bookmarksMap: loadBookmarksMap(),
  favoriteTypes: loadFavoriteTypesState(),
  gameChecklistState: loadGameChecklistState(),
  homeBoxes: loadHomeBoxesState(),
  shinyHub: loadShinyHubState(),
  tools: loadToolsState(),
  duplicatePlannerRecords: [],
  duplicatePlannerDirty: true,
  duplicatePlannerRequestToken: 0,
  randomTargets: [],
  shinyTargets: [],
  suggestedCatchBadgeSeed: Math.floor(Math.random() * 2147483647),
  growthRateCache: new Map(),
  speciesCache: new Map(),
  detailCache: new Map(),
  evolutionChainCache: new Map(),
  locationCache: new Map(),
  typeFavoritePoolCache: new Map(),
  apiCache: loadApiCache(),
  gameAvailabilityByGame: cachedGameAvailability.map,
  gameAvailabilityDetailsByGame: cachedGameAvailability.details,
  gameAvailabilityReady: cachedGameAvailability.ready,
  gameAvailabilityBreakdownReady: cachedGameAvailability.breakdownReady,
  gameAvailabilityLoading: false,
  gameAvailabilityError: false,
  currentPokemon: null,
  sessionRestore: {
    currentPokemonName: null,
    restoring: false
  },
  deferredViewRenders: new Set(VALID_VIEW_IDS),
  activeRequestId: 0,
  archiveStats: {
    baseCount: 0,
    formCount: 0
  },
  archiveRender: {
    filteredEntries: [],
    renderedCount: 0,
    renderedCardsByName: new Map()
  },
  shinyHubRuntime: {
    intervalId: null
  },
  queryInputTimer: null,
  gameAvailabilityScheduled: false,
  accountSync: loadAccountSyncState(),
  cloud: {
    config: cloudConfigSeed,
    configured: Boolean(cloudConfigSeed.url && cloudConfigSeed.publishableKey),
    client: null,
    session: null,
    user: null,
    busy: false,
    ready: false,
    autoSyncTimer: null,
    autoPullIntervalId: null,
    forcePullOnNextHydration: false,
    remoteSave: null,
    saveStoreReady: Boolean(cloudConfigSeed.url && cloudConfigSeed.publishableKey),
    messageTone: "neutral",
    message: "",
    authSubscription: null
  }
};

const uiSessionSeed = loadUiSessionState();
state.ui.activeView = uiSessionSeed.activeView;
state.ui.activeDetailTab = uiSessionSeed.activeDetailTab;
state.ui.archiveView = uiSessionSeed.archiveView;
state.ui.archiveDuplicateMode = uiSessionSeed.archiveDuplicateMode;
state.ui.scanVisualMode = uiSessionSeed.scanVisualMode;
state.ui.journeySelectedGame = uiSessionSeed.journeySelectedGame;
state.ui.duplicatePlannerFilter = uiSessionSeed.duplicatePlannerFilter;
state.sessionRestore.currentPokemonName = uiSessionSeed.currentPokemonName;

window.__dexterState = state;
