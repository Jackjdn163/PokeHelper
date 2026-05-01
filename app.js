const STORAGE_KEY = "dexter-living-form-dex-v1";
const SHINY_STORAGE_KEY = "dexter-shiny-dex-v1";
const TRACKER_STORAGE_KEY = "dexter-playthrough-tracker-v1";
const EXP_STORAGE_KEY = "dexter-exp-planner-v1";
const GAME_AVAILABILITY_STORAGE_KEY = "dexter-switch-game-availability-v6";
const PROFILE_META_STORAGE_KEY = "dexter-profile-meta-v1";
const NOTEBOOK_STORAGE_KEY = "dexter-notebook-v1";
const FAVORITES_STORAGE_KEY = "dexter-favorites-v1";
const BOOKMARKS_STORAGE_KEY = "dexter-bookmarks-v1";
const FAVORITE_TYPES_STORAGE_KEY = "dexter-favorite-types-v1";
const GAME_CHECKLIST_STORAGE_KEY = "dexter-game-checklists-v1";
const HOME_BOX_STORAGE_KEY = "dexter-home-boxes-v1";
const API_CACHE_STORAGE_KEY = "dexter-api-cache-v1";
const DEX_INDEX_CACHE_STORAGE_KEY = "dexter-dex-index-cache-v1";
const UI_SESSION_STORAGE_KEY = "dexter-ui-session-v1";
const ACCOUNT_SYNC_STORAGE_KEY = "dexter-account-sync-v1";
const POKEARTH_BASE_URL = "https://www.serebii.net";
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
const ARCHIVE_INITIAL_RENDER_COUNT = 120;
const ARCHIVE_RENDER_BATCH_COUNT = 120;
const ARCHIVE_ENTRY_HEIGHT_ESTIMATE = 92;
const ARCHIVE_GRID_CARD_MIN_WIDTH = 152;
const ARCHIVE_GRID_ENTRY_HEIGHT_ESTIMATE = 194;
const SEARCH_INPUT_DEBOUNCE_MS = 120;
const VALID_VIEW_IDS = new Set(["landing", "archive", "scan", "collection", "home", "journey", "lab", "vault"]);
const VALID_DETAIL_TAB_IDS = new Set(["overview", "battle", "field"]);
const VALID_ARCHIVE_VIEW_IDS = new Set(["list", "grid"]);
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

const HOME_BOX_COMPATIBILITY_RULES = [
  {
    tag: "Dex Only",
    reason: "Mega Evolutions register in HOME's dex but cannot live in a HOME box as separate targets.",
    matches: (entry) => entry.name.includes("-mega")
  },
  {
    tag: "Dex Only",
    reason: "Gigantamax is tracked as a factor on the base Pokemon, not as its own boxed form.",
    archiveVisible: true,
    matches: (entry) => entry.name.includes("-gmax")
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
  toggleShinyButton: document.querySelector("#toggle-shiny-btn"),
  clearScanButton: document.querySelector("#clear-scan-btn"),
  pokemonArt: document.querySelector("#pokemon-art"),
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
  favoritesCount: document.querySelector("#favorites-count"),
  favoritesSummary: document.querySelector("#favorites-summary"),
  favoritesList: document.querySelector("#favorites-list"),
  bookmarksCount: document.querySelector("#bookmarks-count"),
  bookmarksList: document.querySelector("#bookmarks-list"),
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
  profileNameInput: document.querySelector("#profile-name-input"),
  createProfileButton: document.querySelector("#create-profile-btn"),
  favoritePickerOpenButton: document.querySelector("#favorite-picker-open-btn"),
  accountBadge: document.querySelector("#account-badge"),
  accountSummary: document.querySelector("#account-summary"),
  accountDetail: document.querySelector("#account-detail"),
  accountEmailInput: document.querySelector("#account-email-input"),
  accountPasswordInput: document.querySelector("#account-password-input"),
  accountSignInButton: document.querySelector("#account-sign-in-btn"),
  accountSignUpButton: document.querySelector("#account-sign-up-btn"),
  accountGoogleSignInButton: document.querySelector("#account-google-sign-in-btn"),
  accountSignOutButton: document.querySelector("#account-sign-out-btn"),
  cloudPushButton: document.querySelector("#cloud-push-btn"),
  cloudSyncButton: document.querySelector("#cloud-sync-btn"),
  notebookStatus: document.querySelector("#notebook-status"),
  trainerNotebook: document.querySelector("#trainer-notebook"),
  companionStatus: document.querySelector("#companion-status"),
  companionInput: document.querySelector("#companion-input"),
  companionAskButton: document.querySelector("#companion-ask-btn"),
  companionAnswer: document.querySelector("#companion-answer"),
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
    journeySelectedGame: null,
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
  randomTargets: [],
  shinyTargets: [],
  companionReply: "",
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
    remoteSave: null,
    messageTone: "neutral",
    message: "",
    authSubscription: null
  }
};

const uiSessionSeed = loadUiSessionState();
state.ui.activeView = uiSessionSeed.activeView;
state.ui.activeDetailTab = uiSessionSeed.activeDetailTab;
state.ui.archiveView = uiSessionSeed.archiveView;
state.ui.journeySelectedGame = uiSessionSeed.journeySelectedGame;
state.sessionRestore.currentPokemonName = uiSessionSeed.currentPokemonName;

window.__dexterState = state;

function loadStoredObject(key, fallback = {}) {
  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function saveStoredObject(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Local save failed", key, error);
  }
}

function createDefaultUiSessionState() {
  return {
    activeView: "landing",
    activeDetailTab: "overview",
    archiveView: "list",
    journeySelectedGame: null,
    currentPokemonName: null
  };
}

function loadUiSessionState() {
  const loaded = loadStoredObject(UI_SESSION_STORAGE_KEY, createDefaultUiSessionState());
  const activeView = VALID_VIEW_IDS.has(loaded?.activeView) ? loaded.activeView : "landing";
  const activeDetailTab = VALID_DETAIL_TAB_IDS.has(loaded?.activeDetailTab)
    ? loaded.activeDetailTab
    : "overview";
  const archiveView = VALID_ARCHIVE_VIEW_IDS.has(loaded?.archiveView) ? loaded.archiveView : "list";
  const journeySelectedGame = GAME_CATALOG.some((game) => game.id === loaded?.journeySelectedGame)
    ? loaded.journeySelectedGame
    : null;
  const currentPokemonName = loaded?.currentPokemonName ? String(loaded.currentPokemonName) : null;

  return {
    activeView,
    activeDetailTab,
    archiveView,
    journeySelectedGame,
    currentPokemonName
  };
}

function saveUiSessionState() {
  saveStoredObject(UI_SESSION_STORAGE_KEY, {
    activeView: state.ui.activeView,
    activeDetailTab: state.ui.activeDetailTab,
    archiveView: state.ui.archiveView,
    journeySelectedGame: state.ui.journeySelectedGame,
    currentPokemonName: state.currentPokemon?.name ?? state.sessionRestore.currentPokemonName ?? null
  });
}

function getCloudRedirectUrl() {
  const configured = window.DEXTER_SUPABASE_CONFIG?.redirectTo;
  if (configured) {
    return String(configured);
  }

  return `${window.location.origin}${window.location.pathname}`;
}

function loadCloudConfig() {
  const configured = window.DEXTER_SUPABASE_CONFIG ?? {};

  return {
    url: String(configured.url ?? "").trim(),
    publishableKey: String(configured.publishableKey ?? configured.anonKey ?? "").trim(),
    redirectTo: getCloudRedirectUrl()
  };
}

function createDefaultAccountSyncState() {
  return {
    linkedUserId: null,
    pendingUserId: null,
    pendingResolution: false,
    lastSyncedAt: null,
    lastLocalChangeAt: null,
    lastRemoteUpdatedAt: null,
    lastDirection: null
  };
}

function loadAccountSyncState() {
  const loaded = loadStoredObject(ACCOUNT_SYNC_STORAGE_KEY, createDefaultAccountSyncState());

  return {
    ...createDefaultAccountSyncState(),
    ...(loaded && typeof loaded === "object" ? loaded : {})
  };
}

function saveAccountSyncState() {
  saveStoredObject(ACCOUNT_SYNC_STORAGE_KEY, state.accountSync);
}

function createDefaultProfileMeta() {
  return {
    activeProfileId: DEFAULT_PROFILE_ID,
    profiles: [{ id: DEFAULT_PROFILE_ID, name: "Guest Trainer" }]
  };
}

function loadProfileMeta() {
  const raw = window.localStorage.getItem(PROFILE_META_STORAGE_KEY);

  if (!raw) {
    return createDefaultProfileMeta();
  }

  try {
    const parsed = JSON.parse(raw);
    const profiles = Array.isArray(parsed?.profiles) && parsed.profiles.length
      ? parsed.profiles
          .map((profile) => ({
            id: String(profile.id || "").trim(),
            name: String(profile.name || "").trim()
          }))
          .filter((profile) => profile.id && profile.name)
      : createDefaultProfileMeta().profiles;
    const activeProfileId = profiles.some((profile) => profile.id === parsed?.activeProfileId)
      ? parsed.activeProfileId
      : profiles[0].id;

    return { activeProfileId, profiles };
  } catch {
    return createDefaultProfileMeta();
  }
}

function saveProfileMeta() {
  saveStoredObject(PROFILE_META_STORAGE_KEY, state.profileMeta);
  markCloudDirty();
}

function getActiveProfileId() {
  return (
    window.__dexterState?.profileMeta?.activeProfileId ??
    window.__dexterProfileSeed?.activeProfileId ??
    DEFAULT_PROFILE_ID
  );
}

function getProfileStorageKey(baseKey) {
  return `${baseKey}::${getActiveProfileId()}`;
}

function loadProfileStoredObject(baseKey, fallback = {}, legacyKey = baseKey) {
  const namespaced = loadStoredObject(getProfileStorageKey(baseKey), null);

  if (namespaced && typeof namespaced === "object") {
    return namespaced;
  }

  if (getActiveProfileId() === DEFAULT_PROFILE_ID) {
    return loadStoredObject(legacyKey, fallback);
  }

  return fallback;
}

function saveProfileStoredObject(baseKey, value) {
  saveStoredObject(getProfileStorageKey(baseKey), value);
}

function createDefaultGameChecklistState() {
  return {
    links: Object.fromEntries(GAME_CATALOG.map((game) => [game.id, true])),
    maps: Object.fromEntries(GAME_CATALOG.map((game) => [game.id, {}]))
  };
}

function createDefaultHomeBoxesState() {
  return {
    selectedBox: 0,
    boxedMap: {}
  };
}

function getGameVersions(game) {
  return Array.isArray(game?.versions) ? game.versions : [];
}

function gameHasSeparateVersions(game) {
  return getGameVersions(game).length > 0;
}

function createDefaultGameVersionState(game) {
  return Object.fromEntries(getGameVersions(game).map((version) => [version.id, false]));
}

function syncTrackerGameOwnedState(game, trackerGameState) {
  if (!trackerGameState) {
    return false;
  }

  if (gameHasSeparateVersions(game)) {
    if (!trackerGameState.versions || typeof trackerGameState.versions !== "object") {
      trackerGameState.versions = createDefaultGameVersionState(game);
    }

    trackerGameState.owned = getGameVersions(game).some((version) =>
      Boolean(trackerGameState.versions?.[version.id])
    );
    return trackerGameState.owned;
  }

  trackerGameState.versions = {};
  trackerGameState.owned = Boolean(trackerGameState.owned);
  return trackerGameState.owned;
}

function getJourneyConfig(gameId) {
  return JOURNEY_GAME_DETAILS[gameId] ?? null;
}

function getJourneyManualItems(gameId) {
  const config = getJourneyConfig(gameId);
  if (!config) {
    return [];
  }

  return [
    ...(config.story ?? []),
    ...((config.columns ?? []).flatMap((column) => column.items ?? [])),
    ...(config.postgame ?? []),
    ...(config.dlc ?? [])
  ];
}

function createDefaultJourneyChecks(gameOrId) {
  const gameId = typeof gameOrId === "string" ? gameOrId : gameOrId?.id;
  const checks = {};

  getJourneyManualItems(gameId).forEach((item) => {
    checks[item.id] = false;
  });

  return checks;
}

function getJourneyManualFocusLabel(gameId, trackerState) {
  const firstUnchecked = getJourneyManualItems(gameId).find((item) => !trackerState?.journeyChecks?.[item.id]);
  return firstUnchecked?.label ?? "";
}

function deriveJourneyMilestone(game, trackerState) {
  const config = getJourneyConfig(game.id);
  const milestones = Array.isArray(game?.milestones) ? game.milestones : [];
  if (!milestones.length || !config) {
    return "Current Run";
  }

  const hasAll = (ids = []) => ids.every((id) => trackerState?.journeyChecks?.[id]);
  const progressDone = (config.progressIds ?? []).filter((id) => trackerState?.journeyChecks?.[id]).length;
  const progressRatio = game.progressMax ? progressDone / game.progressMax : 0;

  if (trackerState?.postgame || hasAll(config.postgameIds)) {
    return milestones[milestones.length - 1] ?? milestones[0];
  }

  if (trackerState?.hallOfFame || hasAll(config.hallOfFameIds)) {
    return milestones[Math.min(2, milestones.length - 1)] ?? milestones[0];
  }

  if (progressRatio >= 0.4) {
    return milestones[Math.min(1, milestones.length - 1)] ?? milestones[0];
  }

  return milestones[0];
}

function syncJourneyDerivedTrackerState(game, trackerState) {
  const config = getJourneyConfig(game.id);
  if (!config) {
    return trackerState;
  }

  trackerState.journeyChecks = {
    ...createDefaultJourneyChecks(game.id),
    ...(trackerState.journeyChecks ?? {})
  };
  trackerState.hours = String(trackerState.hours ?? "");
  trackerState.trainerId = String(trackerState.trainerId ?? "");

  const progressDone = (config.progressIds ?? []).filter((id) => trackerState.journeyChecks[id]).length;
  trackerState.progress = Math.min(progressDone, Number(game.progressMax) || progressDone);
  trackerState.hallOfFame = (config.hallOfFameIds ?? []).every((id) => trackerState.journeyChecks[id]);
  trackerState.postgame = (config.postgameIds ?? []).every((id) => trackerState.journeyChecks[id]);
  trackerState.milestone = deriveJourneyMilestone(game, trackerState);
  trackerState.focus = getJourneyManualFocusLabel(game.id, trackerState);

  return trackerState;
}

function createDefaultTrackerState() {
  return {
    activeGame: "none",
    games: Object.fromEntries(
      GAME_CATALOG.map((game) => [
        game.id,
        {
          owned: false,
          versions: createDefaultGameVersionState(game),
          progress: 0,
          milestone: game.milestones[0],
          hallOfFame: false,
          postgame: false,
          focus: "",
          hours: "",
          trainerId: "",
          journeyChecks: createDefaultJourneyChecks(game.id)
        }
      ])
    )
  };
}

function cloneJson(value, fallback = {}) {
  try {
    return JSON.parse(JSON.stringify(value ?? fallback));
  } catch {
    return fallback;
  }
}

function getProfileScopedStorageKey(baseKey, profileId) {
  return `${baseKey}::${profileId}`;
}

function getCloudProfileFieldFallback(field) {
  switch (field) {
    case "caughtMap":
    case "shinyMap":
    case "favoritesMap":
    case "bookmarksMap":
    case "favoriteTypes":
      return {};
    case "tracker":
      return createDefaultTrackerState();
    case "expPlan":
      return {
        gameId: "none",
        currentLevel: 25,
        targetLevel: 50,
        expYield: 0
      };
    case "notebook":
      return { text: "" };
    case "gameChecklistState":
      return createDefaultGameChecklistState();
    case "homeBoxes":
      return createDefaultHomeBoxesState();
    default:
      return {};
  }
}

function readCloudFieldForProfile(profileId, baseKey, field) {
  const fallback = getCloudProfileFieldFallback(field);
  const scopedKey = getProfileScopedStorageKey(baseKey, profileId);
  const scopedValue = loadStoredObject(scopedKey, null);

  if (scopedValue && typeof scopedValue === "object") {
    return cloneJson(scopedValue, fallback);
  }

  if (profileId === DEFAULT_PROFILE_ID) {
    if (field === "notebook") {
      return {
        text: String(loadStoredObject(baseKey, { text: "" }).text ?? "")
      };
    }

    return cloneJson(loadStoredObject(baseKey, fallback), fallback);
  }

  return cloneJson(fallback, fallback);
}

function buildProfileCloudPayload(profileId) {
  return {
    caughtMap: readCloudFieldForProfile(profileId, STORAGE_KEY, "caughtMap"),
    shinyMap: readCloudFieldForProfile(profileId, SHINY_STORAGE_KEY, "shinyMap"),
    tracker: readCloudFieldForProfile(profileId, TRACKER_STORAGE_KEY, "tracker"),
    expPlan: readCloudFieldForProfile(profileId, EXP_STORAGE_KEY, "expPlan"),
    notebook: readCloudFieldForProfile(profileId, NOTEBOOK_STORAGE_KEY, "notebook"),
    favoritesMap: readCloudFieldForProfile(profileId, FAVORITES_STORAGE_KEY, "favoritesMap"),
    bookmarksMap: readCloudFieldForProfile(profileId, BOOKMARKS_STORAGE_KEY, "bookmarksMap"),
    favoriteTypes: readCloudFieldForProfile(profileId, FAVORITE_TYPES_STORAGE_KEY, "favoriteTypes"),
    gameChecklistState: readCloudFieldForProfile(profileId, GAME_CHECKLIST_STORAGE_KEY, "gameChecklistState"),
    homeBoxes: readCloudFieldForProfile(profileId, HOME_BOX_STORAGE_KEY, "homeBoxes")
  };
}

function buildCloudSnapshot() {
  const normalizedProfiles = state.profileMeta.profiles.length
    ? state.profileMeta.profiles
    : createDefaultProfileMeta().profiles;

  return {
    version: CLOUD_SAVE_VERSION,
    savedAt: new Date().toISOString(),
    profileMeta: cloneJson({
      activeProfileId: state.profileMeta.activeProfileId,
      profiles: normalizedProfiles
    }),
    profiles: Object.fromEntries(
      normalizedProfiles.map((profile) => [profile.id, buildProfileCloudPayload(profile.id)])
    )
  };
}

function sanitizeCloudProfileMeta(meta) {
  const fallback = createDefaultProfileMeta();
  const rawProfiles = Array.isArray(meta?.profiles) ? meta.profiles : fallback.profiles;
  const profiles = rawProfiles
    .map((profile) => ({
      id: String(profile?.id || "").trim(),
      name: String(profile?.name || "").trim()
    }))
    .filter((profile) => profile.id && profile.name);

  if (!profiles.length) {
    return fallback;
  }

  if (!profiles.some((profile) => profile.id === DEFAULT_PROFILE_ID)) {
    profiles.unshift({ id: DEFAULT_PROFILE_ID, name: "Guest Trainer" });
  }

  const activeProfileId = profiles.some((profile) => profile.id === meta?.activeProfileId)
    ? meta.activeProfileId
    : profiles[0].id;

  return { activeProfileId, profiles };
}

function writeProfileCloudPayload(profileId, payload) {
  const normalizedPayload = payload && typeof payload === "object" ? payload : {};

  saveStoredObject(
    getProfileScopedStorageKey(STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.caughtMap, {})
  );
  saveStoredObject(
    getProfileScopedStorageKey(SHINY_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.shinyMap, {})
  );
  saveStoredObject(
    getProfileScopedStorageKey(TRACKER_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.tracker, createDefaultTrackerState())
  );
  saveStoredObject(
    getProfileScopedStorageKey(EXP_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.expPlan, getCloudProfileFieldFallback("expPlan"))
  );
  saveStoredObject(
    getProfileScopedStorageKey(NOTEBOOK_STORAGE_KEY, profileId),
    {
      text: String(normalizedPayload.notebook?.text ?? "")
    }
  );
  saveStoredObject(
    getProfileScopedStorageKey(FAVORITES_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.favoritesMap, {})
  );
  saveStoredObject(
    getProfileScopedStorageKey(BOOKMARKS_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.bookmarksMap, {})
  );
  saveStoredObject(
    getProfileScopedStorageKey(FAVORITE_TYPES_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.favoriteTypes, {})
  );
  saveStoredObject(
    getProfileScopedStorageKey(GAME_CHECKLIST_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.gameChecklistState, createDefaultGameChecklistState())
  );
  saveStoredObject(
    getProfileScopedStorageKey(HOME_BOX_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.homeBoxes, createDefaultHomeBoxesState())
  );
}

function applyCloudSnapshot(snapshot) {
  const normalizedMeta = sanitizeCloudProfileMeta(snapshot?.profileMeta);
  const payloads = snapshot?.profiles && typeof snapshot.profiles === "object" ? snapshot.profiles : {};

  normalizedMeta.profiles.forEach((profile) => {
    writeProfileCloudPayload(profile.id, payloads[profile.id]);
  });

  state.profileMeta = normalizedMeta;
  state.companionReply = "";
  saveStoredObject(PROFILE_META_STORAGE_KEY, state.profileMeta);
  loadProfileIntoState();

  if (state.entries.length) {
    refreshRandomTargets();
  }

  syncExpInputsFromState();
  renderTracker();
  renderExpGameOptions();
  renderCollections();
  renderTrainerVault();
  renderHomeOrganizer();
  renderShinyHelper();
  renderSuggestors();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  void renderExpPlanner();
}

function loadCaughtMap() {
  return loadProfileStoredObject(STORAGE_KEY, {});
}

function loadShinyMap() {
  return loadProfileStoredObject(SHINY_STORAGE_KEY, {});
}

function loadNotebookState() {
  return String(loadProfileStoredObject(NOTEBOOK_STORAGE_KEY, { text: "" }).text ?? "");
}

function loadFavoritesMap() {
  return loadProfileStoredObject(FAVORITES_STORAGE_KEY, {});
}

function loadBookmarksMap() {
  return loadProfileStoredObject(BOOKMARKS_STORAGE_KEY, {});
}

function loadFavoriteTypesState() {
  return loadProfileStoredObject(FAVORITE_TYPES_STORAGE_KEY, {});
}

function loadGameChecklistState() {
  const fallback = createDefaultGameChecklistState();
  const loaded = loadProfileStoredObject(GAME_CHECKLIST_STORAGE_KEY, fallback);

  return {
    links: GAME_CATALOG.reduce((accumulator, game) => {
      accumulator[game.id] = loaded.links?.[game.id] ?? fallback.links[game.id];
      return accumulator;
    }, {}),
    maps: GAME_CATALOG.reduce((accumulator, game) => {
      accumulator[game.id] = loaded.maps?.[game.id] ?? {};
      return accumulator;
    }, {})
  };
}

function loadHomeBoxesState() {
  const fallback = createDefaultHomeBoxesState();
  const loaded = loadProfileStoredObject(HOME_BOX_STORAGE_KEY, fallback);
  const boxedMap = {};

  if (loaded.boxedMap && typeof loaded.boxedMap === "object") {
    Object.entries(loaded.boxedMap).forEach(([name, value]) => {
      if (value) {
        boxedMap[name] = true;
      }
    });
  } else if (Array.isArray(loaded.boxes)) {
    loaded.boxes.forEach((box) => {
      box?.slots?.forEach((slotName) => {
        if (slotName) {
          boxedMap[String(slotName)] = true;
        }
      });
    });
  }

  return {
    selectedBox: Math.max(Number(loaded.selectedBox) || 0, 0),
    boxedMap
  };
}

function createEmptyGameAvailabilityMap() {
  return new Map(GAME_CATALOG.map((game) => [game.id, new Set()]));
}

function getAvailabilitySegmentSpecs(gameId) {
  return (SWITCH_GAME_AVAILABILITY[gameId]?.segments ?? []).map((segment) => ({ ...segment }));
}

function buildGameAvailabilityOrderIndex(order = []) {
  return new Map(order.map((number, index) => [number, index]));
}

function createGameAvailabilityDetail(gameId) {
  return {
    all: new Set(),
    order: [],
    orderIndex: new Map(),
    segments: getAvailabilitySegmentSpecs(gameId).map((segment) => ({
      ...segment,
      speciesSet: new Set(),
      order: [],
      orderIndex: new Map()
    }))
  };
}

function createEmptyGameAvailabilityDetailsMap() {
  return new Map(GAME_CATALOG.map((game) => [game.id, createGameAvailabilityDetail(game.id)]));
}

function cloneGameAvailabilityDetail(detail, gameId) {
  const clone = createGameAvailabilityDetail(gameId);
  if (!detail) {
    return clone;
  }

  clone.all = new Set(detail.all ?? []);
  clone.order = [...(detail.order ?? [])];
  clone.orderIndex = buildGameAvailabilityOrderIndex(clone.order);

  if (!clone.segments.length) {
    return clone;
  }

  const sourceSegments = new Map((detail.segments ?? []).map((segment) => [segment.id, segment]));
  clone.segments = clone.segments.map((segment) => ({
    ...segment,
    speciesSet: new Set(sourceSegments.get(segment.id)?.speciesSet ?? []),
    order: [...(sourceSegments.get(segment.id)?.order ?? [])],
    orderIndex: buildGameAvailabilityOrderIndex(sourceSegments.get(segment.id)?.order ?? [])
  }));

  return clone;
}

function hasCompleteGameAvailabilityBreakdown(detailsMap) {
  return GAME_CATALOG.every((game) => {
    const expectedSegments = getAvailabilitySegmentSpecs(game.id);
    if (!expectedSegments.length) {
      return true;
    }

    const detail = detailsMap.get(game.id);
    if (!detail?.segments?.length) {
      return false;
    }

    const segmentIds = new Set(
      detail.segments
        .filter((segment) => segment.speciesSet instanceof Set)
        .map((segment) => segment.id)
    );

    return expectedSegments.every((segment) => segmentIds.has(segment.id));
  });
}

function loadGameAvailabilityCache() {
  const cached = loadStoredObject(GAME_AVAILABILITY_STORAGE_KEY, {});
  const map = createEmptyGameAvailabilityMap();
  const details = createEmptyGameAvailabilityDetailsMap();
  let ready = false;
  let breakdownReady = true;

  GAME_CATALOG.forEach((game) => {
    const cacheEntry = cached[game.id];
    const detail = createGameAvailabilityDetail(game.id);
    const expectsSegments = detail.segments.length > 0;
    let numbers = [];

    if (Array.isArray(cacheEntry)) {
      numbers = cacheEntry.map(Number).filter(Number.isFinite);
      if (expectsSegments) {
        breakdownReady = false;
      }
    } else if (cacheEntry && typeof cacheEntry === "object") {
      numbers = Array.isArray(cacheEntry.all)
        ? cacheEntry.all.map(Number).filter(Number.isFinite)
        : [];
      detail.order = Array.isArray(cacheEntry.order)
        ? cacheEntry.order.map(Number).filter(Number.isFinite)
        : [...numbers];
      detail.orderIndex = buildGameAvailabilityOrderIndex(detail.order);

      if (expectsSegments) {
        const cachedSegments =
          cacheEntry.segments && typeof cacheEntry.segments === "object" ? cacheEntry.segments : null;
        const cachedSegmentOrders =
          cacheEntry.segmentOrders && typeof cacheEntry.segmentOrders === "object"
            ? cacheEntry.segmentOrders
            : null;

        detail.segments = detail.segments.map((segment) => {
          const segmentNumbers = Array.isArray(cachedSegments?.[segment.id])
            ? cachedSegments[segment.id].map(Number).filter(Number.isFinite)
            : [];
          const segmentOrder = Array.isArray(cachedSegmentOrders?.[segment.id])
            ? cachedSegmentOrders[segment.id].map(Number).filter(Number.isFinite)
            : [...segmentNumbers];

          if (!cachedSegments || !Array.isArray(cachedSegments[segment.id])) {
            breakdownReady = false;
          }

          return {
            ...segment,
            speciesSet: new Set(segmentNumbers),
            order: segmentOrder,
            orderIndex: buildGameAvailabilityOrderIndex(segmentOrder)
          };
        });
      }
    } else if (expectsSegments) {
      breakdownReady = false;
    }

    if (numbers.length) {
      ready = true;
    }

    detail.all = new Set(numbers);
    if (!detail.order.length) {
      detail.order = [...numbers];
      detail.orderIndex = buildGameAvailabilityOrderIndex(detail.order);
    }
    map.set(game.id, new Set(numbers));
    details.set(game.id, detail);
  });

  if (ready) {
    breakdownReady = breakdownReady && hasCompleteGameAvailabilityBreakdown(details);
  }

  return { map, details, ready, breakdownReady };
}

function saveGameAvailabilityCache() {
  const serializable = Object.fromEntries(
    GAME_CATALOG.map((game) => {
      const detail = state.gameAvailabilityDetailsByGame.get(game.id) ?? createGameAvailabilityDetail(game.id);
      const allNumbers = [...(detail.all ?? state.gameAvailabilityByGame.get(game.id) ?? new Set())].sort(
        (left, right) => left - right
      );
      const allOrder = [...(detail.order?.length ? detail.order : allNumbers)];
      const segments = Object.fromEntries(
        (detail.segments ?? []).map((segment) => [
          segment.id,
          [...(segment.speciesSet ?? new Set())].sort((left, right) => left - right)
        ])
      );
      const segmentOrders = Object.fromEntries(
        (detail.segments ?? []).map((segment) => [
          segment.id,
          Array.from(segment.order?.length ? segment.order : segment.speciesSet ?? [])
        ])
      );

      return [
        game.id,
        Object.keys(segments).length
          ? {
              all: allNumbers,
              order: allOrder,
              segments,
              segmentOrders
            }
          : {
              all: allNumbers,
              order: allOrder
            }
      ];
    })
  );

  saveStoredObject(GAME_AVAILABILITY_STORAGE_KEY, serializable);
}

function loadTrackerState() {
  const base = createDefaultTrackerState();
  const loaded = loadProfileStoredObject(TRACKER_STORAGE_KEY, base);
  const games = GAME_CATALOG.reduce((accumulator, game) => {
    const baseGameState = base.games[game.id];
    const loadedGameState = loaded.games?.[game.id] ?? {};
    const normalizedGameState = {
      ...baseGameState,
      ...loadedGameState
    };

    normalizedGameState.hours = String(loadedGameState.hours ?? baseGameState.hours ?? "");
    normalizedGameState.trainerId = String(loadedGameState.trainerId ?? baseGameState.trainerId ?? "");
    normalizedGameState.journeyChecks = {
      ...createDefaultJourneyChecks(game.id),
      ...(loadedGameState.journeyChecks ?? {})
    };

    if (gameHasSeparateVersions(game)) {
      normalizedGameState.versions = {
        ...baseGameState.versions,
        ...(loadedGameState.versions ?? {})
      };

      const hasExplicitVersionSelection = Object.values(normalizedGameState.versions).some(Boolean);
      if (!hasExplicitVersionSelection && loadedGameState.owned) {
        Object.keys(normalizedGameState.versions).forEach((versionId) => {
          normalizedGameState.versions[versionId] = true;
        });
      }
    }

    syncTrackerGameOwnedState(game, normalizedGameState);
    syncJourneyDerivedTrackerState(game, normalizedGameState);
    accumulator[game.id] = normalizedGameState;
    return accumulator;
  }, {});

  const activeGame = games[loaded.activeGame]?.owned ? loaded.activeGame : base.activeGame;

  return {
    activeGame,
    games
  };
}

function loadExpPlanState() {
  return {
    gameId: "none",
    currentLevel: 25,
    targetLevel: 50,
    expYield: 0,
    ...loadProfileStoredObject(EXP_STORAGE_KEY, {})
  };
}

function saveCaughtMap() {
  saveProfileStoredObject(STORAGE_KEY, state.caughtMap);
  markCloudDirty();
}

function saveShinyMap() {
  saveProfileStoredObject(SHINY_STORAGE_KEY, state.shinyMap);
  markCloudDirty();
}

function saveTrackerState() {
  saveProfileStoredObject(TRACKER_STORAGE_KEY, state.tracker);
  markCloudDirty();
}

function saveExpPlanState() {
  saveProfileStoredObject(EXP_STORAGE_KEY, state.expPlan);
  markCloudDirty();
}

function saveNotebookState() {
  saveProfileStoredObject(NOTEBOOK_STORAGE_KEY, { text: state.notebook });
  markCloudDirty();
}

function saveFavoritesMap() {
  saveProfileStoredObject(FAVORITES_STORAGE_KEY, state.favoritesMap);
  markCloudDirty();
}

function saveBookmarksMap() {
  saveProfileStoredObject(BOOKMARKS_STORAGE_KEY, state.bookmarksMap);
  markCloudDirty();
}

function saveFavoriteTypesState() {
  saveProfileStoredObject(FAVORITE_TYPES_STORAGE_KEY, state.favoriteTypes);
  markCloudDirty();
}

function saveGameChecklistState() {
  saveProfileStoredObject(GAME_CHECKLIST_STORAGE_KEY, state.gameChecklistState);
  markCloudDirty();
}

function saveHomeBoxesState() {
  saveProfileStoredObject(HOME_BOX_STORAGE_KEY, state.homeBoxes);
  markCloudDirty();
}

function loadProfileIntoState() {
  state.caughtMap = loadCaughtMap();
  state.shinyMap = loadShinyMap();
  state.tracker = loadTrackerState();
  state.expPlan = loadExpPlanState();
  state.notebook = loadNotebookState();
  state.favoritesMap = loadFavoritesMap();
  state.bookmarksMap = loadBookmarksMap();
  state.favoriteTypes = loadFavoriteTypesState();
  state.gameChecklistState = loadGameChecklistState();
  state.homeBoxes = loadHomeBoxesState();
}

function switchProfile(profileId) {
  if (!state.profileMeta.profiles.some((profile) => profile.id === profileId)) {
    return;
  }

  state.profileMeta.activeProfileId = profileId;
  state.companionReply = "";
  saveProfileMeta();
  loadProfileIntoState();
  if (state.entries.length) {
    refreshRandomTargets();
  }
  syncExpInputsFromState();
  renderTracker();
  renderExpGameOptions();
  renderCollections();
  renderTrainerVault();
  renderHomeOrganizer();
  renderShinyHelper();
  renderSuggestors();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  void renderExpPlanner();
}

function createProfile(name) {
  const normalized = String(name || "").trim();
  if (!normalized) {
    return null;
  }

  const id = `trainer-${Date.now()}`;
  state.profileMeta.profiles.push({ id, name: normalized });
  state.profileMeta.activeProfileId = id;
  state.companionReply = "";
  saveProfileMeta();
  loadProfileIntoState();
  if (state.entries.length) {
    refreshRandomTargets();
  }
  return id;
}

function loadApiCache() {
  return loadStoredObject(API_CACHE_STORAGE_KEY, {});
}

function saveApiCache() {
  saveStoredObject(API_CACHE_STORAGE_KEY, state.apiCache);
}

async function refreshJsonCache(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`request-${response.status}`);
  }

  const payload = await response.json();
  state.apiCache[url] = { savedAt: Date.now(), payload };
  saveApiCache();
  return payload;
}

async function fetchJsonCached(url, options = {}) {
  const { preferCache = true } = options;
  const cachedPayload = state.apiCache[url]?.payload;

  if (preferCache && cachedPayload) {
    void refreshJsonCache(url).catch(() => {});
    return cachedPayload;
  }

  try {
    return await refreshJsonCache(url);
  } catch (error) {
    if (cachedPayload) {
      return cachedPayload;
    }
    throw error;
  }
}

function loadDexIndexCache() {
  const cached = loadStoredObject(DEX_INDEX_CACHE_STORAGE_KEY, {});
  return cached && typeof cached === "object" ? cached : {};
}

function saveDexIndexCache(payload) {
  saveStoredObject(DEX_INDEX_CACHE_STORAGE_KEY, payload);
}

function registerOfflineSupport() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (!["http:", "https:"].includes(window.location.protocol)) {
    return;
  }

  navigator.serviceWorker.register("./sw.js").catch((error) => {
    console.warn("Service worker registration failed", error);
  });
}

function isCaught(name) {
  return Boolean(state.caughtMap[name]);
}

function isShiny(name) {
  return Boolean(state.shinyMap[name]);
}

function isShinyDexLocked(name) {
  return SHINY_DEX_LOCKED_ENTRY_NAMES.has(name);
}

function getShinyDexEntries(entries = state.entries) {
  return entries.filter((entry) => !isShinyDexLocked(entry.name));
}

function isFavorite(name) {
  return Boolean(state.favoritesMap[name]);
}

function isBookmarked(name) {
  return Boolean(state.bookmarksMap[name]);
}

function setFavoriteState(name, value) {
  if (value) {
    state.favoritesMap[name] = true;
  } else {
    delete state.favoritesMap[name];
  }

  saveFavoritesMap();
}

function setBookmarkState(name, value) {
  if (value) {
    state.bookmarksMap[name] = true;
  } else {
    delete state.bookmarksMap[name];
  }

  saveBookmarksMap();
}

function setFavoriteTypeState(typeName, pokemonName) {
  if (pokemonName) {
    state.favoriteTypes[typeName] = pokemonName;
  } else {
    delete state.favoriteTypes[typeName];
  }

  saveFavoriteTypesState();
}

function setCaughtState(name, value) {
  if (value) {
    state.caughtMap[name] = true;
  } else {
    delete state.caughtMap[name];
  }

  saveCaughtMap();
}

function setShinyState(name, value) {
  if (value) {
    state.shinyMap[name] = true;
  } else {
    delete state.shinyMap[name];
  }

  saveShinyMap();
}

function getGameChecklistCaughtState(gameId, name) {
  const gameLink = state.gameChecklistState.links[gameId];
  if (gameLink) {
    return isCaught(name);
  }

  return Boolean(state.gameChecklistState.maps[gameId]?.[name]);
}

function setGameChecklistCaughtState(gameId, name, value) {
  if (state.gameChecklistState.links[gameId]) {
    setCaughtState(name, value);
    return;
  }

  if (value) {
    state.gameChecklistState.maps[gameId][name] = true;
  } else {
    delete state.gameChecklistState.maps[gameId][name];
  }

  saveGameChecklistState();
}

function getOwnedReleaseRecords() {
  return GAME_CATALOG.flatMap((game) => {
    const trackerGameState = state.tracker.games[game.id];

    if (gameHasSeparateVersions(game)) {
      return getGameVersions(game)
        .filter((version) => Boolean(trackerGameState?.versions?.[version.id]))
        .map((version) => ({
          gameId: game.id,
          releaseId: version.id,
          label: version.label,
          shortLabel: version.shortLabel ?? version.label
        }));
    }

    return trackerGameState?.owned
      ? [
          {
            gameId: game.id,
            releaseId: game.id,
            label: game.name,
            shortLabel: game.shortName
          }
        ]
      : [];
  });
}

function getOwnedReleaseCount() {
  return getOwnedReleaseRecords().length;
}

function getOwnedGameIds() {
  return GAME_CATALOG.filter((game) => state.tracker.games[game.id]?.owned).map((game) => game.id);
}

function isAvailableInOwnedGameSelection(baseNumber, gameId) {
  if (!isAvailableInGame(baseNumber, gameId)) {
    return false;
  }

  const game = getGameMeta(gameId);
  const trackerGameState = state.tracker.games[gameId];

  if (!game || !trackerGameState?.owned) {
    return false;
  }

  if (!gameHasSeparateVersions(game)) {
    return true;
  }

  const versionExclusiveMap = GAME_VERSION_EXCLUSIVE_SETS[gameId];
  if (!versionExclusiveMap) {
    return true;
  }

  const matchingVersions = Object.entries(versionExclusiveMap)
    .filter(([, speciesSet]) => speciesSet.has(baseNumber))
    .map(([versionId]) => versionId);

  if (!matchingVersions.length) {
    return true;
  }

  return matchingVersions.some((versionId) => Boolean(trackerGameState.versions?.[versionId]));
}

function isAvailableViaOwnedDynamaxAdventure(baseNumber) {
  const trackerGameState = state.tracker.games.swsh;
  if (!trackerGameState?.owned) {
    return false;
  }

  const detail = state.gameAvailabilityDetailsByGame.get("swsh");
  const segment = detail?.segments?.find((item) => item.id === "dynamax-adventure");
  return Boolean(segment?.speciesSet?.has(baseNumber));
}

function isAvailableInOwnedCoverage(baseNumber) {
  const ownedGames = getOwnedGameIds();

  if (!ownedGames.length || !state.gameAvailabilityReady) {
    return false;
  }

  return (
    ownedGames.some((gameId) => isAvailableInOwnedGameSelection(baseNumber, gameId)) ||
    isAvailableViaOwnedDynamaxAdventure(baseNumber)
  );
}

function getVersionExclusiveLabel(gameId, baseNumber) {
  const matchingVersions = getVersionExclusiveVersions(gameId, baseNumber);

  if (!matchingVersions.length) {
    return "";
  }

  if (matchingVersions.length === 1) {
    const version = matchingVersions[0];
    return `${version.shortLabel ?? version.label} Exclusive`;
  }

  return `${matchingVersions.map((version) => version.shortLabel ?? version.label).join(" / ")} Exclusive`;
}

function getVersionExclusiveVersions(gameId, baseNumber) {
  const game = getGameMeta(gameId);
  if (!game || !gameHasSeparateVersions(game)) {
    return [];
  }

  const versionExclusiveMap = GAME_VERSION_EXCLUSIVE_SETS[gameId];
  if (!versionExclusiveMap) {
    return [];
  }

  return getGameVersions(game).filter((version) => versionExclusiveMap[version.id]?.has(baseNumber));
}

function getVersionExclusiveBadgeClasses(gameId, baseNumber) {
  const matchingVersions = getVersionExclusiveVersions(gameId, baseNumber);

  if (matchingVersions.length === 1) {
    return [`version-${matchingVersions[0].id}`];
  }

  if (matchingVersions.length > 1) {
    return ["multi-version-exclusive"];
  }

  return [];
}

function getUnobtainableEntries() {
  if (!getOwnedGameIds().length || !state.gameAvailabilityReady) {
    return [];
  }

  return state.entries.filter((entry) => !entry.isForm && !isAvailableInOwnedCoverage(entry.baseNumber));
}

function shuffleEntries(entries) {
  const pool = [...entries];

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return pool;
}

function refreshRandomTargets() {
  const missingBaseEntries = state.entries.filter((entry) => !entry.isForm && !isCaught(entry.name));
  const catchPool =
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? missingBaseEntries.filter((entry) => isAvailableInOwnedCoverage(entry.baseNumber))
      : missingBaseEntries;
  const shinyEligibleBaseEntries = missingBaseEntries.filter((entry) => !isShinyDexLocked(entry.name));
  const shinyPool = shinyEligibleBaseEntries.filter((entry) => !isShiny(entry.name));
  state.randomTargets = shuffleEntries(catchPool).slice(0, 8);
  state.shinyTargets = shuffleEntries(shinyPool).slice(0, 2);
  ensureSuggestedBoardSelections();
}

function rerollRandomTargetBoard() {
  const missingBaseEntries = state.entries.filter((entry) => !entry.isForm && !isCaught(entry.name));
  const catchPool =
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? missingBaseEntries.filter((entry) => isAvailableInOwnedCoverage(entry.baseNumber))
      : missingBaseEntries;
  state.randomTargets = shuffleEntries(catchPool).slice(0, 8);
  state.ui.selectedRandomTargetName = null;
  ensureSuggestedBoardSelections();
}

function rerollShinyTargetBoard() {
  const missingBaseEntries = state.entries.filter((entry) => !entry.isForm && !isCaught(entry.name));
  const shinyEligibleBaseEntries = missingBaseEntries.filter((entry) => !isShinyDexLocked(entry.name));
  const shinyPool = shinyEligibleBaseEntries.filter((entry) => !isShiny(entry.name));
  state.shinyTargets = shuffleEntries(shinyPool).slice(0, 2);
  state.ui.selectedShinyTargetName = null;
  ensureSuggestedBoardSelections();
}

function ensureSuggestedBoardSelections() {
  if (!state.randomTargets.some((entry) => entry.name === state.ui.selectedRandomTargetName)) {
    state.ui.selectedRandomTargetName = null;
  }

  if (!state.shinyTargets.some((entry) => entry.name === state.ui.selectedShinyTargetName)) {
    state.ui.selectedShinyTargetName = null;
  }

  if (state.ui.landingActionMode === "living" && !state.randomTargets.length) {
    state.ui.landingActionMode = null;
  }

  if (state.ui.landingActionMode === "shiny" && !state.shinyTargets.length) {
    state.ui.landingActionMode = null;
  }
}

function getSelectedSuggestedTarget(kind) {
  if (kind === "shiny") {
    return state.shinyTargets.find((entry) => entry.name === state.ui.selectedShinyTargetName) ?? null;
  }

  return state.randomTargets.find((entry) => entry.name === state.ui.selectedRandomTargetName) ?? null;
}

function setSelectedSuggestedTarget(kind, name) {
  if (kind === "shiny") {
    state.ui.selectedShinyTargetName = name;
  } else {
    state.ui.selectedRandomTargetName = name;
  }
}

function markSuggestedTargetCaught() {
  const target = getSelectedSuggestedTarget("living");
  if (!target) {
    if (!state.randomTargets.length) {
      setStatus("No suggested catch targets are available right now.");
      return;
    }

    if (state.ui.landingActionMode === "living") {
      state.ui.landingActionMode = null;
      renderCollections();
      setStatus("Suggested catch selection cancelled.");
      return;
    }

    state.ui.landingActionMode = "living";
    renderCollections();
    setStatus("Choose a suggested catch target, or press Cancel.");
    return;
  }

  state.ui.landingActionMode = null;
  state.ui.selectedRandomTargetName = null;
  setCaughtState(target.name, true);

  if (state.currentPokemon?.name === target.name) {
    renderCurrentPokemon(state.currentPokemon);
  }

  renderCollections();
  renderHomeOrganizer();
  refreshResults();
  setStatus(`${target.displayName} registered as caught from the hunt board.`);
}

function markSuggestedTargetShiny() {
  const target = getSelectedSuggestedTarget("shiny");
  if (!target) {
    if (!state.shinyTargets.length) {
      setStatus("No suggested shiny targets are available right now.");
      return;
    }

    if (state.ui.landingActionMode === "shiny") {
      state.ui.landingActionMode = null;
      renderCollections();
      setStatus("Suggested shiny selection cancelled.");
      return;
    }

    state.ui.landingActionMode = "shiny";
    renderCollections();
    setStatus("Choose a suggested shiny target, or press Cancel.");
    return;
  }

  if (isShinyDexLocked(target.name)) {
    setStatus(`${target.displayName} is shiny-locked and cannot be logged in the shiny dex.`);
    return;
  }

  state.ui.landingActionMode = null;
  state.ui.selectedShinyTargetName = null;
  setCaughtState(target.name, true);
  setShinyState(target.name, true);

  if (state.currentPokemon?.name === target.name) {
    renderCurrentPokemon(state.currentPokemon);
  }

  renderCollections();
  renderHomeOrganizer();
  refreshResults();
  setStatus(`${target.displayName} logged as a shiny catch from the hunt board.`);
}

function getFavoriteEntries() {
  return Object.keys(state.favoritesMap)
    .map((name) => state.entriesByName.get(name))
    .filter(Boolean)
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
}

function getBookmarkEntries() {
  return Object.keys(state.bookmarksMap)
    .map((name) => state.entriesByName.get(name))
    .filter(Boolean)
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
}

function getFavoriteTypeEntries() {
  return TYPE_NAMES.map((typeName) => ({
    typeName,
    pokemonName: state.favoriteTypes[typeName] ?? null,
    entry: state.favoriteTypes[typeName]
      ? state.entriesByName.get(state.favoriteTypes[typeName]) ?? null
      : null
  }));
}

function getFavoritePickerEntryPool() {
  return [...state.entries].sort(
    (left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right)
  );
}

async function ensureTypeFavoritePool(typeName) {
  if (state.typeFavoritePoolCache.has(typeName)) {
    return state.typeFavoritePoolCache.get(typeName);
  }

  const payload = await fetchJsonCached(`https://pokeapi.co/api/v2/type/${encodeURIComponent(typeName)}`);
  const validNames = new Set((payload?.pokemon ?? []).map((item) => item?.pokemon?.name).filter(Boolean));
  const filteredEntries = getFavoritePickerEntryPool().filter(
    (entry) => validNames.has(entry.name) || validNames.has(entry.basePokemonName)
  );
  state.typeFavoritePoolCache.set(typeName, filteredEntries);
  return filteredEntries;
}

function getFavoritePickerCurrentSelectionName() {
  const picker = state.ui.favoritePicker;
  if (!picker.open) {
    return null;
  }

  if (picker.mode === "type" && picker.typeName) {
    return state.favoriteTypes[picker.typeName] ?? null;
  }

  return null;
}

function getFavoritePickerQuery() {
  return normalizeSearch(state.ui.favoritePicker.query);
}

function getFavoritePickerFilteredEntries(pool) {
  const query = getFavoritePickerQuery();
  if (!query) {
    return pool;
  }

  const numeric = Number(query);
  return pool.filter((entry) => {
    if (!Number.isNaN(numeric) && /^\d+$/.test(query)) {
      return entry.baseNumber === numeric || entry.id === numeric;
    }

    return (
      entry.name === query.replace(/\s+/g, "-") ||
      entry.displayName.toLowerCase() === query ||
      entry.searchBlob.includes(query)
    );
  });
}

function isArchiveShinyMode() {
  return state.ui.archiveMode === "shiny";
}

function isArchiveGridView() {
  return state.ui.archiveView === "grid";
}

function getArchiveModeLabel() {
  return isArchiveShinyMode() ? "Shiny Dex" : "Living Dex";
}

function getArchiveTrackedLabel() {
  return isArchiveShinyMode() ? "Logged" : "Caught";
}

function getArchiveMissingLabel() {
  return isArchiveShinyMode() ? "Unlogged" : "Missing";
}

function isArchiveTracked(name) {
  return isArchiveShinyMode() ? isShiny(name) : isCaught(name);
}

function setArchiveMode(mode) {
  if (!mode || state.ui.archiveMode === mode) {
    return;
  }

  state.ui.archiveMode = mode;
  saveUiSessionState();
  refreshResults();
}

function setArchiveView(view) {
  if (!VALID_ARCHIVE_VIEW_IDS.has(view) || state.ui.archiveView === view) {
    return;
  }

  state.ui.archiveView = view;
  saveUiSessionState();
  refreshResults();
}

function getPrimaryGameEntry(baseNumber) {
  const ownedGames = getOwnedGameIds();
  if (!state.gameAvailabilityReady) {
    return getGameMeta(getActiveGameId()) ?? (ownedGames[0] ? getGameMeta(ownedGames[0]) : null);
  }
  const ownedMatch = ownedGames.find((gameId) => isAvailableInOwnedGameSelection(baseNumber, gameId));
  return ownedMatch ? getGameMeta(ownedMatch) : null;
}

function getActiveProfile() {
  return (
    state.profileMeta.profiles.find((profile) => profile.id === state.profileMeta.activeProfileId) ??
    state.profileMeta.profiles[0]
  );
}

function getCloudUserLabel(user = state.cloud.user) {
  if (!user) {
    return "";
  }

  return String(
    user.user_metadata?.display_name ||
      user.user_metadata?.username ||
      user.user_metadata?.full_name ||
      user.email ||
      "Trainer Account"
  ).trim();
}

function getSessionButtonLabel() {
  if (state.cloud.user) {
    return getCloudUserLabel();
  }

  const profile = getActiveProfile();
  return profile.id === DEFAULT_PROFILE_ID ? "Guest Session" : profile.name;
}

function setCloudMessage(message, tone = "neutral") {
  state.cloud.message = message;
  state.cloud.messageTone = tone;
}

function formatCloudError(error, fallback = "Cloud account action failed.") {
  const rawMessage = String(error?.message || error || fallback).trim();
  const normalized = rawMessage.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email and password combination did not match a trainer account.";
  }

  if (normalized.includes("oauth") && normalized.includes("email")) {
    return "That trainer account uses a social login provider like Google. Use the Google button instead of email/password.";
  }

  if (normalized.includes("provider is not enabled")) {
    return "Google sign-in is not enabled in your Supabase project yet.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Check your inbox and confirm the account email before signing in.";
  }

  if (normalized.includes("user already registered")) {
    return "That email already has a trainer account. Try signing in instead.";
  }

  if (normalized.includes("failed to fetch")) {
    return "The cloud service could not be reached right now. Check your connection and try again.";
  }

  if (normalized.includes("invalid api key") || normalized.includes("project not found")) {
    return "The Supabase project settings for cloud accounts are not configured correctly yet.";
  }

  return rawMessage || fallback;
}

function hasUnsyncedLocalChanges() {
  if (!state.accountSync.lastLocalChangeAt) {
    return false;
  }

  if (!state.accountSync.lastSyncedAt) {
    return true;
  }

  return new Date(state.accountSync.lastLocalChangeAt) > new Date(state.accountSync.lastSyncedAt);
}

function isCloudLinkedToCurrentUser() {
  return Boolean(
    state.cloud.user &&
      state.accountSync.linkedUserId === state.cloud.user.id &&
      !state.accountSync.pendingResolution
  );
}

function markCloudDirty() {
  state.accountSync.lastLocalChangeAt = new Date().toISOString();
  saveAccountSyncState();
  scheduleCloudAutoSync();
}

function scheduleCloudAutoSync() {
  if (
    !state.cloud.configured ||
    !state.cloud.user ||
    !isCloudLinkedToCurrentUser() ||
    state.cloud.busy ||
    state.accountSync.pendingResolution
  ) {
    return;
  }

  if (state.cloud.autoSyncTimer) {
    window.clearTimeout(state.cloud.autoSyncTimer);
  }

  state.cloud.autoSyncTimer = window.setTimeout(() => {
    state.cloud.autoSyncTimer = null;
    void pushLocalSnapshotToCloud({ quiet: true, source: "auto" });
  }, CLOUD_SYNC_DEBOUNCE_MS);
}

function scheduleSwitchGameAvailabilityLoad() {
  if (
    (state.gameAvailabilityReady && state.gameAvailabilityBreakdownReady) ||
    state.gameAvailabilityLoading ||
    state.gameAvailabilityScheduled
  ) {
    return;
  }

  state.gameAvailabilityScheduled = true;

  const run = () => {
    state.gameAvailabilityScheduled = false;
    void loadSwitchGameAvailability();
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 1500 });
    return;
  }

  window.setTimeout(run, 250);
}

async function ensureCloudClient() {
  if (!state.cloud.configured) {
    return null;
  }

  if (state.cloud.client) {
    return state.cloud.client;
  }

  const createClient = window.supabase?.createClient;
  if (typeof createClient !== "function") {
    setCloudMessage("The cloud account library could not load in this browser session.", "error");
    return null;
  }

  const client = createClient(state.cloud.config.url, state.cloud.config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  state.cloud.client = client;
  state.cloud.ready = true;

  const { data } = client.auth.onAuthStateChange((event, session) => {
    state.cloud.session = session ?? null;
    state.cloud.user = session?.user ?? null;

    setTimeout(() => {
      if (!session?.user) {
        if (event === "SIGNED_OUT") {
          state.accountSync.pendingResolution = false;
          state.accountSync.pendingUserId = null;
          saveAccountSyncState();
          setCloudMessage("This device was signed out of its cloud account.", "neutral");
        }

        renderTrainerVault();
        return;
      }

      void hydrateCloudSession(event);
    }, 0);
  });

  state.cloud.authSubscription = data?.subscription ?? null;

  const {
    data: { session }
  } = await client.auth.getSession();

  state.cloud.session = session ?? null;
  state.cloud.user = session?.user ?? null;

  return client;
}

async function fetchCloudSaveForCurrentUser() {
  const client = await ensureCloudClient();
  if (!client || !state.cloud.user) {
    return null;
  }

  const { data, error } = await client
    .from(CLOUD_SAVE_TABLE)
    .select("user_id, email, snapshot, updated_at, created_at")
    .eq("user_id", state.cloud.user.id);

  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data[0] ?? null : null;
}

async function pushLocalSnapshotToCloud({ quiet = false, source = "manual" } = {}) {
  const client = await ensureCloudClient();
  if (!client || !state.cloud.user) {
    setCloudMessage("Sign in to a trainer account before pushing this device to the cloud.", "warn");
    renderTrainerVault();
    return false;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  const syncedAt = new Date().toISOString();
  const snapshot = buildCloudSnapshot();

  try {
    const { error } = await client.from(CLOUD_SAVE_TABLE).upsert(
      {
        user_id: state.cloud.user.id,
        email: state.cloud.user.email ?? null,
        snapshot,
        updated_at: syncedAt
      },
      { onConflict: "user_id" }
    );

    if (error) {
      throw error;
    }

    state.cloud.remoteSave = {
      user_id: state.cloud.user.id,
      email: state.cloud.user.email ?? null,
      snapshot,
      updated_at: syncedAt
    };
    state.accountSync.linkedUserId = state.cloud.user.id;
    state.accountSync.pendingUserId = null;
    state.accountSync.pendingResolution = false;
    state.accountSync.lastSyncedAt = syncedAt;
    state.accountSync.lastRemoteUpdatedAt = syncedAt;
    state.accountSync.lastDirection = "push";
    saveAccountSyncState();

    setCloudMessage(
      source === "auto"
        ? "This device auto-synced its latest trainer data to the cloud."
        : "This device was pushed to the trainer cloud save.",
      "success"
    );

    if (!quiet) {
      setStatus("Local device data pushed to cloud.");
    }

    return true;
  } catch (error) {
    setCloudMessage(formatCloudError(error), "error");
    if (!quiet) {
      setStatus("Push to cloud failed.");
    }
    return false;
  } finally {
    state.cloud.busy = false;
    renderTrainerVault();
  }
}

async function pullCloudSnapshotToDevice({ quiet = false } = {}) {
  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const row = await fetchCloudSaveForCurrentUser();

    if (!row?.snapshot) {
      setCloudMessage("No cloud save exists for this trainer account yet.", "warn");
      return false;
    }

    applyCloudSnapshot(row.snapshot);

    const syncedAt = new Date().toISOString();
    state.cloud.remoteSave = row;
    state.accountSync.linkedUserId = state.cloud.user?.id ?? null;
    state.accountSync.pendingUserId = null;
    state.accountSync.pendingResolution = false;
    state.accountSync.lastSyncedAt = syncedAt;
    state.accountSync.lastRemoteUpdatedAt = row.updated_at ?? syncedAt;
    state.accountSync.lastDirection = "pull";
    saveAccountSyncState();

    setCloudMessage("This device was synced from the trainer cloud save.", "success");
    if (!quiet) {
      setStatus("Cloud save pulled onto this device.");
    }
    return true;
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Sync with cloud failed."), "error");
    if (!quiet) {
      setStatus("Sync with cloud failed.");
    }
    return false;
  } finally {
    state.cloud.busy = false;
    renderTrainerVault();
  }
}

async function hydrateCloudSession(event = "INITIAL_SESSION") {
  if (!state.cloud.user) {
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const row = await fetchCloudSaveForCurrentUser();
    state.cloud.remoteSave = row;

    if (!row) {
      await pushLocalSnapshotToCloud({ quiet: true, source: "bootstrap" });
      return;
    }

    state.accountSync.lastRemoteUpdatedAt = row.updated_at ?? state.accountSync.lastRemoteUpdatedAt;
    const linkedToThisUser = state.accountSync.linkedUserId === state.cloud.user.id;

    if (!linkedToThisUser) {
      state.accountSync.pendingResolution = true;
      state.accountSync.pendingUserId = state.cloud.user.id;
      saveAccountSyncState();
      setCloudMessage(
        `Cloud save found for ${getCloudUserLabel()}. Sync with Cloud to load that save here, or Push to Cloud to replace it with this device's data.`,
        "warn"
      );
      return;
    }

    if (hasUnsyncedLocalChanges()) {
      state.accountSync.pendingResolution = true;
      state.accountSync.pendingUserId = state.cloud.user.id;
      saveAccountSyncState();
      setCloudMessage(
        "This device has unsynced local changes. Sync with Cloud to pull the cloud save here, or Push to Cloud to upload this device's local data.",
        "warn"
      );
      return;
    }

    await pullCloudSnapshotToDevice({ quiet: true });
    if (event === "SIGNED_IN") {
      setCloudMessage(`Welcome back, ${getCloudUserLabel()}. Your cloud save is linked on this device.`, "success");
    }
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Cloud account sync could not start."), "error");
  } finally {
    state.cloud.busy = false;
    renderTrainerVault();
  }
}

async function signInCloudAccount() {
  const client = await ensureCloudClient();
  if (!client) {
    setCloudMessage("Cloud accounts are not configured on this build yet.", "warn");
    renderTrainerVault();
    return;
  }

  const email = elements.accountEmailInput.value.trim();
  const password = elements.accountPasswordInput.value;

  if (!email || !password) {
    setCloudMessage("Enter both an email and a password to sign in.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    elements.accountPasswordInput.value = "";
    setCloudMessage(`Signed in as ${email}. Checking your cloud save…`, "success");
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Sign in failed."), "error");
    renderTrainerVault();
  }
}

async function signUpCloudAccount() {
  const client = await ensureCloudClient();
  if (!client) {
    setCloudMessage("Cloud accounts are not configured on this build yet.", "warn");
    renderTrainerVault();
    return;
  }

  const email = elements.accountEmailInput.value.trim();
  const password = elements.accountPasswordInput.value;

  if (!email || !password) {
    setCloudMessage("Enter both an email and a password to create a cloud account.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: state.cloud.config.redirectTo,
        data: {
          display_name: getActiveProfile()?.name ?? "PokéPilot Trainer"
        }
      }
    });

    if (error) {
      throw error;
    }

    elements.accountPasswordInput.value = "";
    state.cloud.busy = false;

    if (data.session) {
      setCloudMessage(`Account created for ${email}. Linking this device now…`, "success");
      renderTrainerVault();
      return;
    }

    setCloudMessage(
      "Account created. Check your email for the confirmation link, then sign in on this device.",
      "success"
    );
    renderTrainerVault();
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Account creation failed."), "error");
    renderTrainerVault();
  }
}

async function signInCloudAccountWithGoogle() {
  const client = await ensureCloudClient();
  if (!client) {
    setCloudMessage("Cloud accounts are not configured on this build yet.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: state.cloud.config.redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });

    if (error) {
      throw error;
    }

    setCloudMessage("Redirecting to Google so this device can link with your trainer account…", "success");

    if (data?.url) {
      window.location.assign(data.url);
      return;
    }
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Google sign-in failed."), "error");
    renderTrainerVault();
  }
}

async function signOutCloudAccount() {
  const client = await ensureCloudClient();
  if (!client || !state.cloud.user) {
    setCloudMessage("No cloud account is signed in on this device.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) {
      throw error;
    }

    elements.accountPasswordInput.value = "";
    setStatus("Cloud account signed out on this device.");
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Sign out failed."), "error");
    renderTrainerVault();
  }
}

async function syncCloudNow() {
  if (!state.cloud.user) {
    setCloudMessage("Sign in to a cloud account before syncing with the cloud save.", "warn");
    renderTrainerVault();
    return;
  }

  await pullCloudSnapshotToDevice();
}

function renderCloudAccountCard() {
  const configured = state.cloud.configured;
  const signedIn = Boolean(state.cloud.user);
  const pending = state.accountSync.pendingResolution;
  const linked = isCloudLinkedToCurrentUser();
  const unsynced = hasUnsyncedLocalChanges();

  let badge = "Offline Only";
  let summary =
    "Sign in to link this device and move your living dex, notes, trackers, and HOME plan between devices.";

  if (!configured) {
    summary =
      "Cloud account support is installed, but this build still needs Supabase project keys before devices can sync.";
  } else if (state.cloud.busy) {
    badge = "Syncing";
    summary = signedIn
      ? `Working with ${getCloudUserLabel()}'s cloud save.`
      : "Checking cloud account status.";
  } else if (!signedIn) {
    badge = "Ready";
    summary =
      "Create a trainer account, sign in with email, or use Google to link this browser with your cloud save and carry progress across devices.";
  } else if (pending) {
    badge = "Needs Choice";
    summary =
      "A cloud save was found, and this device needs a clear direction: push this device upward or sync from the cloud downward.";
  } else if (linked) {
    badge = unsynced ? "Pending Sync" : "Linked";
    summary = unsynced
      ? `${getCloudUserLabel()} is linked. Push to Cloud to upload this device, or Sync with Cloud to replace it with the stored cloud save.`
      : `${getCloudUserLabel()} is linked, and this device is in sync across sessions.`;
  } else {
    badge = "Signed In";
    summary = `${getCloudUserLabel()} is signed in. Push to Cloud to upload this device, or Sync with Cloud to pull down the trainer save.`;
  }

  elements.accountBadge.textContent = badge;
  elements.accountSummary.textContent = summary;
  elements.accountDetail.textContent =
    state.cloud.message ||
    (!configured
      ? "Add your Supabase URL and publishable key to supabase-config.js, then create the cloud_saves table from supabase/schema.sql."
      : signedIn
        ? `Signed in as ${state.cloud.user.email ?? getCloudUserLabel()}. Push to Cloud uploads local device data. Sync with Cloud checks the trainer cloud save and pulls it onto this device.`
        : "Email/password and Google auth are ready once Supabase is configured.");
  elements.accountDetail.className = `results-summary account-detail${
    state.cloud.messageTone === "error"
      ? " is-error"
      : state.cloud.messageTone === "success"
        ? " is-success"
        : state.cloud.messageTone === "warn"
          ? " is-warn"
          : ""
  }`;

  elements.accountEmailInput.disabled = !configured || state.cloud.busy;
  elements.accountPasswordInput.disabled = !configured || state.cloud.busy;
  elements.accountSignInButton.disabled = !configured || state.cloud.busy || signedIn;
  elements.accountSignUpButton.disabled = !configured || state.cloud.busy || signedIn;
  elements.accountGoogleSignInButton.disabled = !configured || state.cloud.busy || signedIn;
  elements.accountSignOutButton.disabled = !configured || state.cloud.busy || !signedIn;
  elements.cloudPushButton.disabled = !configured || state.cloud.busy || !signedIn;
  elements.cloudSyncButton.disabled = !configured || state.cloud.busy || !signedIn;
}

function getBaseEntries() {
  return state.entries.filter((entry) => !entry.isForm);
}

function setProgressBar(element, ratio) {
  const normalized = Math.max(0, Math.min(ratio || 0, 1));
  element.style.width = `${normalized * 100}%`;
}

function renderActiveView() {
  const activeView = state.ui.activeView;
  const systemViews = new Set(["collection", "home", "journey", "lab", "vault"]);
  document.body.dataset.activeView = activeView;

  elements.navTabs.forEach((button) => {
    const isActive = button.dataset.view === activeView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.viewPanels.forEach((panel) => {
    const panelId = panel.dataset.viewPanel;
    const isActive = panelId === "systems" ? systemViews.has(activeView) : panelId === activeView;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  });

  elements.modulePanels.forEach((panel) => {
    panel.hidden = !systemViews.has(activeView) || panel.dataset.moduleView !== activeView;
  });
}

function setActiveView(viewId) {
  if (!viewId) {
    return;
  }

  const viewChanged = state.ui.activeView !== viewId;
  if (viewId !== "vault" && state.ui.favoritePicker.open) {
    closeFavoritePicker();
  }
  state.ui.activeView = viewId;
  saveUiSessionState();
  renderActiveView();
  if (viewChanged) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function renderDetailTabs() {
  const activeDetailTab = state.ui.activeDetailTab;

  elements.detailTabButtons.forEach((button) => {
    const isActive = button.dataset.detailTab === activeDetailTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  elements.detailPanes.forEach((pane) => {
    const isActive = pane.dataset.detailPanel === activeDetailTab;
    pane.classList.toggle("active", isActive);
    pane.hidden = !isActive;
  });
}

function setActiveDetailTab(tabId) {
  if (!tabId) {
    return;
  }

  state.ui.activeDetailTab = tabId;
  saveUiSessionState();
  renderDetailTabs();
}

function openPokemonEntry(nameOrId) {
  const shouldResetDetailTab = state.ui.activeView !== "scan";
  setActiveView("scan");

  if (shouldResetDetailTab) {
    setActiveDetailTab("overview");
  }

  void fetchPokemonDetail(nameOrId);
}

function createCollectionEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "results-summary collection-empty";
  empty.textContent = message;
  return empty;
}

function createDashboardEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "results-summary dashboard-empty";
  empty.textContent = message;
  return empty;
}

function getProfileTrainerCode(profile) {
  const seed = `${profile?.id ?? ""}:${profile?.name ?? ""}`;
  const checksum = Array.from(seed).reduce(
    (sum, character) => (sum * 31 + character.charCodeAt(0)) % 10000,
    0
  );
  return `#${String(checksum).padStart(4, "0")}`;
}

function getRecentCaughtEntries(limit = 4) {
  return Object.keys(state.caughtMap)
    .slice()
    .reverse()
    .map((name) => state.entriesByName.get(name))
    .filter(Boolean)
    .slice(0, limit);
}

function renderLandingRecentCatches() {
  const recentEntries = getRecentCaughtEntries();
  elements.landingRecentList.replaceChildren();

  if (!recentEntries.length) {
    elements.landingRecentList.appendChild(
      createDashboardEmptyState("Nothing has been logged yet. Catch your first target to start the recent feed.")
    );
    return;
  }

  recentEntries.forEach((entry, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashboard-recent-item";
    button.addEventListener("click", () => {
      openPokemonEntry(entry.name);
    });

    const sprite = document.createElement("img");
    applyEntrySprite(sprite, entry, { forceShiny: isShiny(entry.name) });

    const meta = document.createElement("div");
    meta.className = "dashboard-recent-meta";
    const title = document.createElement("strong");
    title.textContent = entry.displayName;
    const note = document.createElement("span");
    note.textContent = `${getEntryVariantLabel(entry)} · ${isShiny(entry.name) ? "Shiny Logged" : "Caught"}`;
    meta.append(title, note);

    const stamp = document.createElement("span");
    stamp.className = "dashboard-recent-stamp";
    stamp.textContent = index === 0 ? "Latest" : index === 1 ? "Recent" : "Archive";

    button.append(sprite, meta, stamp);
    elements.landingRecentList.appendChild(button);
  });
}

function createDashboardProgressBar(ratio) {
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  const fill = document.createElement("span");
  setProgressBar(fill, ratio);
  bar.appendChild(fill);
  return bar;
}

function renderLandingCompletionBreakdown(games) {
  elements.landingCompletionBreakdown.replaceChildren();

  if (!games.length) {
    elements.landingCompletionBreakdown.appendChild(
      createDashboardEmptyState("Mark owned games in Journey to unlock regional completion slices.")
    );
    return;
  }

  games.forEach((game) => {
    const entries = getGameChecklistEntries(game.id);
    const caughtCount = entries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
    const ratio = entries.length ? caughtCount / entries.length : 0;

    const item = document.createElement("article");
    item.className = "dashboard-breakdown-item";

    const copy = document.createElement("div");
    copy.className = "dashboard-breakdown-copy";
    const label = document.createElement("strong");
    label.textContent = game.shortName;
    const value = document.createElement("span");
    value.textContent = entries.length
      ? `${formatCount(caughtCount)} / ${formatCount(entries.length)}`
      : "Coverage syncing";
    copy.append(label, value);

    const percent = document.createElement("strong");
    percent.className = "dashboard-breakdown-percent";
    percent.textContent = entries.length ? formatPercent(ratio) : "--";

    item.append(copy, percent);
    elements.landingCompletionBreakdown.appendChild(item);
  });
}

function renderLandingTaskList(task, catchTarget, shinyTarget, currentBox) {
  elements.landingTaskList.replaceChildren();

  const tasks = [
    {
      title: task.title,
      detail: task.detail,
      tag: task.focus.replace("Focus: ", "")
    }
  ];

  if (catchTarget) {
    tasks.push({
      title: `Catch ${catchTarget.displayName}`,
      detail: `${catchTarget.displayName} is ready in the suggestion queue and can be logged from the dashboard.`,
      tag: "Collection"
    });
  }

  if (shinyTarget) {
    tasks.push({
      title: `Log ${shinyTarget.displayName} as a shiny goal`,
      detail: `Keep the shiny pressure on with ${shinyTarget.displayName} queued in the bonus hunt lane.`,
      tag: "Shiny"
    });
  }

  if (currentBox) {
    tasks.push({
      title: `Fill ${currentBox.name}`,
      detail: `${getFilledBoxCount(currentBox)}/${getHomeBoxTargetCount(currentBox)} slots are marked in your HOME living-form template.`,
      tag: "Boxes"
    });
  }

  tasks.slice(0, 3).forEach((item) => {
    const row = document.createElement("article");
    row.className = "dashboard-task-item";

    const copy = document.createElement("div");
    copy.className = "dashboard-task-copy";
    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    copy.append(title, detail);

    const tag = document.createElement("span");
    tag.className = "dashboard-task-tag";
    tag.textContent = item.tag;

    row.append(copy, tag);
    elements.landingTaskList.appendChild(row);
  });
}

function renderLandingJourneyCards() {
  elements.landingJourneyGrid.replaceChildren();
  const ownedGames = GAME_CATALOG.filter((game) => state.tracker.games[game.id]?.owned);

  if (!ownedGames.length) {
    elements.landingJourneyGrid.appendChild(
      createDashboardEmptyState("No games are marked as owned yet. Open Journey to start tracking your saves.")
    );
    return;
  }

  ownedGames.slice(0, 4).forEach((game) => {
    const trackerState = state.tracker.games[game.id];
    const checkpoint = getGameProgressCheckpoint(game, trackerState);
    const ratio = game.progressMax ? trackerState.progress / game.progressMax : 0;

    const card = document.createElement("article");
    card.className = "dashboard-journey-card";

    const title = document.createElement("strong");
    title.textContent = game.name;

    const milestone = document.createElement("p");
    milestone.textContent = checkpoint.currentMilestone;

    const progress = document.createElement("div");
    progress.className = "dashboard-journey-progress";
    const counts = document.createElement("span");
    counts.textContent = `${game.progressLabel}: ${trackerState.progress}/${game.progressMax}`;
    progress.append(counts, createDashboardProgressBar(ratio));

    card.append(title, milestone, progress);
    elements.landingJourneyGrid.appendChild(card);
  });
}

function renderLandingSuggestionBoard(task, shinyTarget, currentBox) {
  elements.landingSuggestionGrid.replaceChildren();

  const cards = [
    {
      title: "Focus Area",
      detail: task.title,
      note: task.focus
    },
    {
      title: "Shiny Goal",
      detail: shinyTarget ? shinyTarget.displayName : "No shiny target selected",
      note: shinyTarget ? "Ready in the dashboard bonus lane" : "Catch more targets or reroll the shiny queue"
    },
    {
      title: "Collection Goal",
      detail: currentBox ? currentBox.name : "HOME template standby",
      note: currentBox
        ? `${getFilledBoxCount(currentBox)}/${getHomeBoxTargetCount(currentBox)} slots marked boxed`
        : "Open Boxes to start your living-form layout"
    },
    {
      title: "Weekly Goal",
      detail: `${formatCount(state.randomTargets.length)} catch targets ready`,
      note: "Reroll the dashboard board whenever you want a fresh route"
    }
  ];

  cards.forEach((item) => {
    const card = document.createElement("article");
    card.className = "dashboard-suggestion-card";

    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    const note = document.createElement("small");
    note.textContent = item.note;

    card.append(title, detail, note);
    elements.landingSuggestionGrid.appendChild(card);
  });
}

function renderLandingSmartSuggestions(catchTarget, shinyTarget, task) {
  elements.landingSmartGrid.replaceChildren();

  const suggestions = [
    {
      title: catchTarget ? `Catch ${catchTarget.displayName}` : "Open the Dex",
      detail: catchTarget
        ? `${catchTarget.displayName} is ready in the current suggestion queue.`
        : "Scan the archive and build a fresh catch queue.",
      actionLabel: catchTarget ? "Open Scan" : "Open Dex",
      onClick: catchTarget ? () => openPokemonEntry(catchTarget.name) : () => setActiveView("archive")
    },
    {
      title: shinyTarget ? `Shiny ${shinyTarget.displayName}` : "Plan a shiny push",
      detail: shinyTarget
        ? `${shinyTarget.displayName} is the cleanest bonus shiny follow-up right now.`
        : "No bonus shiny call is available yet. Keep catching or reroll the lane.",
      actionLabel: shinyTarget ? "Open Shiny" : "Open Collection",
      onClick: shinyTarget ? () => openPokemonEntry(shinyTarget.name) : () => setActiveView("collection")
    },
    {
      title: task.title,
      detail: task.detail,
      actionLabel: "Open Journey",
      onClick: () => setActiveView("journey")
    },
    {
      title: "Organize Your Boxes",
      detail: "Move over to the HOME living-form template and keep your box plan in sync.",
      actionLabel: "Go to Boxes",
      onClick: () => setActiveView("home")
    }
  ];

  suggestions.forEach((item) => {
    const card = document.createElement("article");
    card.className = "dashboard-smart-card";

    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-button dashboard-link-button";
    button.textContent = item.actionLabel;
    button.addEventListener("click", item.onClick);

    card.append(title, detail, button);
    elements.landingSmartGrid.appendChild(card);
  });
}

function createSuggestedHuntTile(entry, options = {}) {
  const { selected = false, forceShiny = false, onSelect = null } = options;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `suggested-hunt-tile${selected ? " is-selected" : ""}`;
  button.setAttribute("aria-pressed", String(selected));
  button.setAttribute(
    "aria-label",
    `${entry.displayName}${forceShiny ? " shiny" : ""} suggestion`
  );
  button.title = entry.displayName;

  const pod = document.createElement("span");
  pod.className = "suggested-hunt-pod";

  const sprite = document.createElement("img");
  sprite.className = "suggested-hunt-sprite";
  sprite.loading = "lazy";
  sprite.decoding = "async";
  applyEntrySprite(sprite, entry, { forceShiny });

  const dexBadge = document.createElement("span");
  dexBadge.className = "suggested-hunt-dex";
  dexBadge.textContent = `#${formatNumber(entry.baseNumber)}`;

  pod.append(sprite, dexBadge);
  button.appendChild(pod);

  button.addEventListener("click", () => {
    onSelect?.(entry);
  });

  return button;
}

function renderSuggestedHuntBoard(container, entries, options = {}) {
  const {
    kind = "living",
    selectedName = null,
    emptyText = "No hunt targets are ready.",
    forceShiny = false
  } = options;

  container.replaceChildren();

  if (!entries.length) {
    container.appendChild(createCollectionEmptyState(emptyText));
    return;
  }

  entries.forEach((entry) => {
    container.appendChild(
      createSuggestedHuntTile(entry, {
        selected: entry.name === selectedName,
        forceShiny,
        onSelect: (nextEntry) => {
          const selectionMode =
            kind === "shiny" ? state.ui.landingActionMode === "shiny" : state.ui.landingActionMode === "living";
          setSelectedSuggestedTarget(kind, nextEntry.name);
          if (selectionMode) {
            renderCollections();
            return;
          }

          renderCollections();
          openPokemonEntry(nextEntry.name);
        }
      })
    );
  });
}

function createCollectionItem(entry, note, tags = [], options = {}) {
  const interactive = options.interactive !== false;
  const button = document.createElement(interactive ? "button" : "div");
  if (interactive) {
    button.type = "button";
  }
  button.className = "collection-item";

  const art = document.createElement("span");
  art.className = "collection-item-art";

  const sprite = document.createElement("img");
  sprite.className = "collection-item-sprite";
  sprite.loading = "lazy";
  sprite.decoding = "async";
  applyEntrySprite(sprite, entry, options);

  art.appendChild(sprite);

  const copy = document.createElement("span");
  copy.className = "collection-item-copy";

  const name = document.createElement("strong");
  name.textContent = entry.displayName;

  const text = document.createElement("span");
  text.className = "collection-item-note";
  text.textContent = note;

  copy.append(name, text);
  button.append(art, copy);

  if (tags.length) {
    const tagRow = document.createElement("span");
    tagRow.className = "collection-item-tags";
    tags.forEach((label) => {
      tagRow.appendChild(makeTag(label));
    });
    button.appendChild(tagRow);
  }

  if (interactive) {
    button.addEventListener("click", () => {
      openPokemonEntry(entry.name);
    });
  }

  return button;
}

function createCollectionPlaceholder(title, note, tags = []) {
  const card = document.createElement("div");
  card.className = "collection-item empty";

  const copy = document.createElement("span");
  copy.className = "collection-item-copy";

  const name = document.createElement("strong");
  name.textContent = title;

  const text = document.createElement("span");
  text.className = "collection-item-note";
  text.textContent = note;

  copy.append(name, text);
  card.appendChild(copy);

  if (tags.length) {
    const tagRow = document.createElement("span");
    tagRow.className = "collection-item-tags";
    tags.forEach((label) => {
      tagRow.appendChild(makeTag(label));
    });
    card.appendChild(tagRow);
  }

  return card;
}

function createManagerActionButton(label, onClick, variant = "ghost") {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    variant === "primary"
      ? "primary-action compact manager-action-button"
      : "ghost-button detail-link-button manager-action-button";
  button.textContent = label;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

function createVaultManagerItem(contentNode, actions = []) {
  const shell = document.createElement("div");
  shell.className = "vault-manager-item";
  shell.appendChild(contentNode);

  if (actions.length) {
    const actionRow = document.createElement("div");
    actionRow.className = "vault-manager-actions";
    actions.forEach((action) => {
      actionRow.appendChild(createManagerActionButton(action.label, action.onClick, action.variant));
    });
    shell.appendChild(actionRow);
  }

  return shell;
}

function syncFavoriteDisplays() {
  renderCollections();
  renderTrainerVault();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function closeFavoritePicker() {
  state.ui.favoritePicker.open = false;
  state.ui.favoritePicker.mode = "favorites";
  state.ui.favoritePicker.typeName = null;
  state.ui.favoritePicker.query = "";
  state.ui.favoritePicker.loading = false;
  renderFavoritePicker();
}

function openFavoritePicker(mode, typeName = null) {
  state.ui.favoritePicker.open = true;
  state.ui.favoritePicker.mode = mode;
  state.ui.favoritePicker.typeName = typeName;
  state.ui.favoritePicker.query = "";
  state.ui.favoritePicker.loading = mode === "type";
  renderFavoritePicker();

  window.requestAnimationFrame(() => {
    elements.favoritePickerSearch?.focus();
  });

  if (mode === "type" && typeName) {
    void ensureTypeFavoritePool(typeName)
      .catch(() => [])
      .then(() => {
        if (
          !state.ui.favoritePicker.open ||
          state.ui.favoritePicker.mode !== "type" ||
          state.ui.favoritePicker.typeName !== typeName
        ) {
          return;
        }

        state.ui.favoritePicker.loading = false;
        renderFavoritePicker();
      });
    return;
  }

  state.ui.favoritePicker.loading = false;
  renderFavoritePicker();
}

function applyFavoritePickerSelection(entry) {
  if (state.ui.favoritePicker.mode === "type" && state.ui.favoritePicker.typeName) {
    const typeName = state.ui.favoritePicker.typeName;
    setFavoriteTypeState(typeName, entry.name);
    closeFavoritePicker();
    syncFavoriteDisplays();
    setStatus(`${entry.displayName} is now your ${titleCase(typeName)} type favorite.`);
    return;
  }

  setFavoriteState(entry.name, true);
  closeFavoritePicker();
  syncFavoriteDisplays();
  setStatus(`${entry.displayName} added to favorites.`);
}

function renderFavoritePicker() {
  const picker = state.ui.favoritePicker;
  const isOpen = picker.open;

  elements.favoritePickerOverlay.classList.toggle("hidden", !isOpen);
  elements.favoritePickerOverlay.hidden = !isOpen;
  if (!isOpen) {
    return;
  }

  const activeType = picker.typeName ? titleCase(picker.typeName) : null;
  const currentSelectionName = getFavoritePickerCurrentSelectionName();
  const currentSelection = currentSelectionName ? state.entriesByName.get(currentSelectionName) ?? null : null;
  const pool =
    picker.mode === "type" && picker.typeName
      ? state.typeFavoritePoolCache.get(picker.typeName) ?? []
      : getFavoritePickerEntryPool();
  const filteredEntries = getFavoritePickerFilteredEntries(pool);
  const visibleEntries = filteredEntries.slice(0, FAVORITE_PICKER_RESULT_LIMIT);

  if (elements.favoritePickerSearch.value !== picker.query) {
    elements.favoritePickerSearch.value = picker.query;
  }

  elements.favoritePickerTitle.textContent =
    picker.mode === "type" && activeType ? `Choose ${activeType} Favorite` : "Add New Favorite";
  elements.favoritePickerNote.textContent =
    picker.mode === "type" && activeType
      ? `Search the archive for a ${activeType}-type Pokémon, then pick the one you want to showcase in the Vault.`
      : "Search the archive, then pick the Pokémon you want to save to your Vault showcase.";
  const showClearSelection = picker.mode === "type" && Boolean(currentSelection);
  elements.favoritePickerClearButton.hidden = !showClearSelection;
  elements.favoritePickerClearButton.classList.toggle("hidden", !showClearSelection);
  elements.favoritePickerClearButton.parentElement?.classList.toggle("hidden", !showClearSelection);
  if (elements.favoritePickerClearButton.parentElement) {
    elements.favoritePickerClearButton.parentElement.hidden = !showClearSelection;
  }
  elements.favoritePickerResultsSummary.textContent = picker.loading
    ? "Loading the eligible archive pool for this type..."
    : filteredEntries.length
      ? filteredEntries.length > FAVORITE_PICKER_RESULT_LIMIT
        ? `${formatCount(filteredEntries.length)} matches found. Showing the first ${formatCount(FAVORITE_PICKER_RESULT_LIMIT)} to keep the picker fast. Keep typing to narrow it down.`
        : `${formatCount(filteredEntries.length)} matches ready. Scroll or search to narrow the list.`
      : "No matches found for the current search.";

  elements.favoritePickerList.replaceChildren();

  if (picker.loading) {
    elements.favoritePickerList.appendChild(
      createCollectionEmptyState("Syncing the type-accurate picker list.")
    );
    return;
  }

  if (!filteredEntries.length) {
    elements.favoritePickerList.appendChild(
      createCollectionEmptyState("No Pokémon matched that search. Try a different name, form, or Dex number.")
    );
    return;
  }

  visibleEntries.forEach((entry) => {
    const note = `${getEntryVariantLabel(entry)} · ${isCaught(entry.name) ? "Caught" : "Missing"}`;
    const tags = [
      picker.mode === "type" && activeType ? activeType : "Favorite",
      ...(isShiny(entry.name) ? ["Shiny"] : [])
    ];
    const choiceButton = document.createElement("button");
    choiceButton.type = "button";
    choiceButton.className = "vault-picker-choice";
    choiceButton.appendChild(createCollectionItem(entry, note, tags, { interactive: false }));
    choiceButton.addEventListener("click", () => {
      applyFavoritePickerSelection(entry);
    });
    elements.favoritePickerList.appendChild(choiceButton);
  });
}

function getGameChecklistEntries(gameId) {
  if (!state.gameAvailabilityReady) {
    return [];
  }

  return getBaseEntries().filter((entry) => isAvailableInGame(entry.baseNumber, gameId));
}

function getGameChecklistProgress(gameId) {
  const entries = getGameChecklistEntries(gameId);
  const caughtCount = entries.reduce(
    (sum, entry) => sum + Number(getGameChecklistCaughtState(gameId, entry.name)),
    0
  );

  return {
    entries,
    caughtCount,
    total: entries.length,
    ratio: entries.length ? caughtCount / entries.length : 0
  };
}

function getCurrentBox() {
  const boxes = getHomeTemplateBoxes();
  return boxes[getSelectedHomeBoxIndex(boxes)] ?? boxes[0] ?? null;
}

function getFilledBoxCount(box) {
  return box?.entries?.reduce((sum, entry) => sum + Number(isBoxedInHome(entry.name)), 0) ?? 0;
}

function getHomeBoxCompatibilityMeta(entry) {
  if (!entry.isForm || entry.syntheticKind === "appearance") {
    return {
      homeBoxCompatible: true,
      homeBoxTag: "Boxable",
      homeBoxReason: "",
      parkedOnly: false
    };
  }

  const matchedRule = HOME_BOX_COMPATIBILITY_RULES.find((rule) => rule.matches(entry));
  if (!matchedRule) {
    return {
      homeBoxCompatible: true,
      homeBoxTag: "Boxable",
      homeBoxReason: "",
      parkedOnly: false
    };
  }

  return {
    homeBoxCompatible: false,
    homeBoxTag: matchedRule.tag,
    homeBoxReason: matchedRule.reason,
    parkedOnly: !matchedRule.archiveVisible
  };
}

function getHomeBoxEntries() {
  return state.entries.filter((entry) => entry.homeBoxCompatible !== false);
}

function getHomeExcludedEntries() {
  return [...state.entries, ...state.parkedEntries]
    .filter((entry) => entry.homeBoxCompatible === false)
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
}

function getHomeTemplateBoxes() {
  const homeEntries = getHomeBoxEntries();
  const boxCount = Math.max(1, Math.ceil(homeEntries.length / 30));

  return Array.from({ length: boxCount }, (_, boxIndex) => {
    const start = boxIndex * 30;
    const slots = Array.from({ length: 30 }, (_, slotIndex) => homeEntries[start + slotIndex] ?? null);
    const entries = slots.filter(Boolean);

    return {
      index: boxIndex,
      name: `Box ${String(boxIndex + 1).padStart(2, "0")}`,
      slots,
      entries,
      startEntry: entries[0] ?? null,
      endEntry: entries[entries.length - 1] ?? null
    };
  });
}

function getSelectedHomeBoxIndex(boxes = getHomeTemplateBoxes()) {
  return Math.min(Math.max(Number(state.homeBoxes.selectedBox) || 0, 0), Math.max(0, boxes.length - 1));
}

function isBoxedInHome(name) {
  return Boolean(state.homeBoxes.boxedMap[name]);
}

function setHomeBoxedState(name, value) {
  if (value) {
    state.homeBoxes.boxedMap[name] = true;
  } else {
    delete state.homeBoxes.boxedMap[name];
  }

  saveHomeBoxesState();
}

function getHomeBoxTargetCount(box) {
  return box?.entries?.length ?? 0;
}

function getHomeBoxCaughtCount(box) {
  return box?.entries?.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0) ?? 0;
}

function getHomeBoxRangeLabel(box) {
  if (!box?.startEntry || !box.endEntry) {
    return "Syncing template";
  }

  const start = `#${formatNumber(box.startEntry.baseNumber)}`;
  const end = `#${formatNumber(box.endEntry.baseNumber)}`;
  return start === end ? start : `${start}-${end}`;
}

function getHomeBoxSpanLabel(box) {
  if (!box?.startEntry || !box.endEntry) {
    return "Loading living form targets";
  }

  if (box.startEntry.name === box.endEntry.name) {
    return box.startEntry.displayName;
  }

  return `${box.startEntry.displayName} to ${box.endEntry.displayName}`;
}

function titleCase(value) {
  return String(value)
    .split(/[-\s]/g)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function buildSpriteUrl(id, shiny = false) {
  const shinySegment = shiny ? "/shiny" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shinySegment}/${id}.png`;
}

function buildFormSpriteUrl(baseNumber, formSlug, shiny = false) {
  if (!formSlug) {
    return buildSpriteUrl(baseNumber, shiny);
  }

  const shinySegment = shiny ? "/shiny" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shinySegment}/${baseNumber}-${formSlug}.png`;
}

function buildGenderSpriteUrl(id, shiny = false, gender = "female") {
  const shinySegment = shiny ? "/shiny" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shinySegment}/${gender}/${id}.png`;
}

function uniqUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

function getEntrySpriteUrls(entry, { forceShiny = false } = {}) {
  const wantsShiny = forceShiny || isShiny(entry.name);
  if (wantsShiny) {
    return uniqUrls([
      entry.shinyListSprite,
      buildSpriteUrl(entry.id, true),
      buildSpriteUrl(entry.baseNumber, true),
      entry.listSprite,
      buildSpriteUrl(entry.baseNumber)
    ]);
  }

  return uniqUrls([entry.listSprite, buildSpriteUrl(entry.baseNumber)]);
}

function getPokemonVisualUrls(pokemon, { forceShiny = false, preferArtwork = false } = {}) {
  const wantsShiny = forceShiny || isShiny(pokemon.name);
  const shinyPrimary = preferArtwork
    ? [pokemon.artworkShiny, pokemon.spriteShiny, pokemon.artwork, pokemon.sprite]
    : [pokemon.spriteShiny, pokemon.artworkShiny, pokemon.sprite, pokemon.artwork];
  const regularPrimary = preferArtwork
    ? [pokemon.artwork, pokemon.sprite, pokemon.artworkShiny, pokemon.spriteShiny]
    : [pokemon.sprite, pokemon.artwork, pokemon.spriteShiny, pokemon.artworkShiny];

  return uniqUrls(wantsShiny ? shinyPrimary : regularPrimary);
}

function applyImageSources(image, sources, alt = "") {
  const queue = uniqUrls(sources);
  image.alt = alt;
  image.classList.remove("is-missing", "is-hidden");

  if (!queue.length) {
    image.classList.add("is-missing");
    image.removeAttribute("src");
    image.onerror = null;
    return;
  }

  let index = 0;
  image.onerror = () => {
    index += 1;
    if (index < queue.length) {
      image.src = queue[index];
      return;
    }

    image.classList.add("is-missing");
    image.removeAttribute("src");
    image.onerror = null;
  };
  image.src = queue[index];
}

function applyEntrySprite(image, entry, options = {}) {
  applyImageSources(
    image,
    getEntrySpriteUrls(entry, options),
    `${entry.displayName}${options.forceShiny || isShiny(entry.name) ? " shiny" : ""} sprite`
  );
}

function applyPokemonVisual(image, pokemon, options = {}) {
  applyImageSources(
    image,
    getPokemonVisualUrls(pokemon, options),
    `${pokemon.displayName}${options.forceShiny || isShiny(pokemon.name) ? " shiny" : ""} ${
      options.preferArtwork ? "artwork" : "sprite"
    }`
  );
}

function formatNumber(value) {
  return String(value).padStart(4, "0");
}

function formatCount(value) {
  return Number(value).toLocaleString();
}

function normalizeSearch(value) {
  return String(value).trim().toLowerCase();
}

function buildEntrySearchBlob(entry, extraTerms = []) {
  return [
    entry.id,
    entry.baseNumber,
    entry.name,
    entry.name.replace(/-/g, " "),
    entry.displayName.toLowerCase(),
    entry.basePokemonName ?? "",
    String(entry.basePokemonName ?? "").replace(/-/g, " "),
    entry.baseDisplayName.toLowerCase(),
    entry.variantLabel ?? "",
    `gen ${entry.generation}`,
    ...(entry.formFlags ?? []),
    ...extraTerms
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizeCachedDexEntry(entry) {
  if (!entry || typeof entry !== "object" || !entry.name) {
    return null;
  }

  const id = Number(entry.id) || 0;
  const baseNumber = Number(entry.baseNumber) || id;
  const basePokemonName = String(entry.basePokemonName || entry.name).trim();
  const normalizedEntry = {
    ...entry,
    id,
    baseNumber,
    name: String(entry.name).trim(),
    displayName: String(entry.displayName || titleCase(entry.name)).trim(),
    isForm: Boolean(entry.isForm),
    basePokemonName,
    baseDisplayName: String(entry.baseDisplayName || titleCase(basePokemonName)).trim(),
    generation: Number(entry.generation) || determineGeneration(baseNumber),
    formFlags: Array.isArray(entry.formFlags) ? entry.formFlags.map(String) : detectFormFlags(entry.name, id),
    variantLabel: entry.variantLabel ?? null,
    detailNote: String(entry.detailNote ?? ""),
    listSprite: String(entry.listSprite ?? buildSpriteUrl(id || baseNumber)),
    shinyListSprite: String(entry.shinyListSprite ?? buildSpriteUrl(id || baseNumber, true)),
    archiveVisible: entry.archiveVisible !== false,
    showInFormsTab: entry.showInFormsTab !== false
  };
  const homeMeta = getHomeBoxCompatibilityMeta(normalizedEntry);

  Object.assign(normalizedEntry, homeMeta, {
    parkedOnly: normalizedEntry.archiveVisible === false || homeMeta.parkedOnly
  });
  normalizedEntry.searchBlob = buildEntrySearchBlob(normalizedEntry);
  return normalizedEntry;
}

function commitDexIndexState(snapshot, options = {}) {
  const { renderUi = true } = options;
  const baseEntries = Array.isArray(snapshot?.baseEntries)
    ? snapshot.baseEntries
        .map((entry) => ({
          id: Number(entry?.id) || 0,
          name: String(entry?.name || "").trim()
        }))
        .filter((entry) => entry.id && entry.name)
    : [];
  const normalizedEntries = Array.isArray(snapshot?.entries)
    ? snapshot.entries.map(normalizeCachedDexEntry).filter(Boolean)
    : [];
  const normalizedParkedEntries = Array.isArray(snapshot?.parkedEntries)
    ? snapshot.parkedEntries.map(normalizeCachedDexEntry).filter(Boolean)
    : [];

  if (!normalizedEntries.length || !baseEntries.length) {
    return false;
  }

  state.baseEntriesByName = new Map(baseEntries.map((entry) => [entry.name, entry]));
  state.baseNamesSorted = Array.isArray(snapshot?.baseNamesSorted) && snapshot.baseNamesSorted.length
    ? snapshot.baseNamesSorted.map((name) => String(name))
    : [...state.baseEntriesByName.keys()].sort((left, right) => right.length - left.length);
  state.entries = normalizedEntries;
  state.parkedEntries = normalizedParkedEntries;
  state.archiveStats.baseCount = state.entries.reduce((sum, entry) => sum + Number(!entry.isForm), 0);
  state.archiveStats.formCount = state.entries.length - state.archiveStats.baseCount;
  state.entriesByName = new Map(
    [...state.entries, ...state.parkedEntries.filter((entry) => entry.showInFormsTab)].map((entry) => [
      entry.name,
      entry
    ])
  );

  refreshRandomTargets();

  if (renderUi) {
    refreshResults();
    renderCollections();
    renderTrainerVault();
    renderHomeOrganizer();
    renderSuggestors();
    if (state.currentPokemon) {
      renderCurrentPokemon(state.currentPokemon);
    }
  }

  return true;
}

function hydrateDexIndexFromCache() {
  const cached = loadDexIndexCache();
  const hydrated = commitDexIndexState(cached, { renderUi: false });

  if (hydrated) {
    setStatus(`${formatCount(state.entries.length)} cached entities ready. Refreshing live archive...`);
  }

  return hydrated;
}

async function restorePersistedCurrentScan() {
  const targetName = state.sessionRestore.currentPokemonName;

  if (!targetName || state.sessionRestore.restoring || state.currentPokemon?.name === targetName) {
    return;
  }

  if (!state.entriesByName.has(targetName)) {
    state.sessionRestore.currentPokemonName = null;
    saveUiSessionState();
    return;
  }

  state.sessionRestore.restoring = true;
  try {
    await fetchPokemonDetail(targetName);
  } finally {
    state.sessionRestore.restoring = false;
  }
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function setLoadingState(loading) {
  elements.searchInput.disabled = loading;
  elements.openEntryButton.disabled = loading;
  elements.randomButton.disabled = loading;
  elements.toggleCaughtButton.disabled = loading || !state.currentPokemon;
}

function sanitizeFlavorText(value) {
  return String(value || "")
    .replace(/[\f\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatVersionName(versionName) {
  return String(versionName)
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function buildPokedexEntries(species) {
  const englishEntries = species.flavor_text_entries
    .filter((entry) => entry.language.name === "en")
    .map((entry, index) => {
      const meta = FLAVOR_VERSION_META[entry.version.name];

      return {
        versionName: entry.version.name,
        label: meta?.label ?? formatVersionName(entry.version.name),
        priority: meta?.priority ?? 100 + index,
        text: sanitizeFlavorText(entry.flavor_text),
        index
      };
    })
    .filter((entry) => entry.text);

  const preferredEntries = englishEntries.filter((entry) => FLAVOR_VERSION_META[entry.versionName]);
  const scopedEntries = preferredEntries.length ? preferredEntries : englishEntries;
  const groupedEntries = [];

  [...scopedEntries]
    .sort((left, right) => left.priority - right.priority || left.index - right.index)
    .forEach((entry) => {
      const existing = groupedEntries.find((group) => group.text === entry.text);
      if (existing) {
        if (!existing.labels.includes(entry.label)) {
          existing.labels.push(entry.label);
        }
        return;
      }

      groupedEntries.push({
        text: entry.text,
        labels: [entry.label]
      });
    });

  const limit = preferredEntries.length ? 8 : 6;

  return {
    entries: groupedEntries.slice(0, limit).map((group) => ({
      text: group.text,
      sourceLabel: group.labels.join(" / ")
    })),
    scopeLabel: preferredEntries.length ? "Switch notes" : "Archive notes"
  };
}

function extractIdFromUrl(url) {
  const parts = String(url).split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function determineGeneration(number) {
  const generation = GENERATION_RANGES.find((entry) => number >= entry.start && number <= entry.end);
  return generation ? generation.label : "unknown";
}

function resolveBaseEntry(name, id) {
  if (id <= BASE_POKEMON_COUNT) {
    return state.baseEntriesByName.get(name) ?? null;
  }

  const baseName = state.baseNamesSorted.find(
    (candidate) => name === candidate || name.startsWith(`${candidate}-`)
  );

  return baseName ? state.baseEntriesByName.get(baseName) ?? null : null;
}

function detectFormFlags(name, id) {
  const flags = [];
  const lowerName = name.toLowerCase();
  const segments = lowerName.split("-").filter(Boolean);
  const segmentSet = new Set(segments);
  const hasCompoundSegments = (...compoundSegments) =>
    compoundSegments.every((segment, index) => segments[index + Math.max(0, segments.length - compoundSegments.length)] === segment) ||
    compoundSegments.every((segment, index) => {
      const startIndex = segments.indexOf(compoundSegments[0]);
      return startIndex !== -1 && segments[startIndex + index] === segment;
    });

  if (id > BASE_POKEMON_COUNT) {
    flags.push("form");
  }
  if (lowerName.includes("mega")) {
    flags.push("mega");
  }
  if (lowerName.includes("gmax")) {
    flags.push("gmax");
  }
  if (
    lowerName.includes("alola") ||
    lowerName.includes("galar") ||
    lowerName.includes("hisui") ||
    lowerName.includes("paldea")
  ) {
    flags.push("regional");
  }
  if (
    [
      "totem",
      "therian",
      "origin",
      "eternamax",
      "crowned",
      "primal",
      "ultra",
      "school",
      "busted",
      "hangry",
      "bloodmoon",
      "family",
      "hero",
      "roaming",
      "terastal",
      "stellar",
      "breed",
      "mode",
      "build",
      "mask",
      "zen",
      "construct",
      "gulping",
      "gorging",
      "noice",
      "pirouette",
      "crowned"
    ].some((token) => segmentSet.has(token)) ||
    hasCompoundSegments("battle", "bond") ||
    segmentSet.has("cap")
  ) {
    flags.push("special");
  }

  return [...new Set(flags)];
}

function createAppearanceEntry({
  id,
  name,
  displayName,
  baseNumber,
  basePokemonName,
  variantLabel,
  detailNote,
  spriteSlug = "",
  listSprite,
  shinyListSprite,
  formFlags = ["form", "special"],
  syntheticKind = "appearance",
  extraSearchTerms = ["appearance", "cosmetic"],
  archiveVisible = true,
  showInFormsTab = true
}) {
  const entry = {
    id,
    name,
    displayName,
    isForm: true,
    baseNumber,
    basePokemonName,
    baseDisplayName: titleCase(basePokemonName),
    generation: determineGeneration(baseNumber),
    formFlags,
    variantLabel,
    detailNote,
    syntheticKind,
    archiveVisible,
    showInFormsTab,
    listSprite: listSprite ?? buildFormSpriteUrl(baseNumber, spriteSlug),
    shinyListSprite: shinyListSprite ?? buildFormSpriteUrl(baseNumber, spriteSlug, true)
  };

  entry.searchBlob = buildEntrySearchBlob(entry, extraSearchTerms);
  return entry;
}

function buildAppearanceFormEntries(startId, existingNames = new Set(), sourceEntries = []) {
  const entries = [];
  let nextId = startId;
  const sourceEntriesById = new Map(sourceEntries.map((entry) => [entry.id, entry]));

  ALCREMIE_CREAMS.forEach((cream) => {
    ALCREMIE_SWEETS.forEach((sweet) => {
      if (cream.slug === "vanilla-cream" && sweet.slug === "strawberry-sweet") {
        return;
      }

      const name = `alcremie-${cream.slug}-${sweet.slug}`;
      if (existingNames.has(name)) {
        return;
      }

      entries.push(
        createAppearanceEntry({
          id: nextId++,
          name,
          displayName: `Alcremie ${cream.label} ${sweet.label}`,
          baseNumber: 869,
          basePokemonName: "alcremie",
          variantLabel: `${cream.label} ${sweet.label}`,
          detailNote: `${cream.label} with ${sweet.label.toLowerCase()} is tracked as a cosmetic Alcremie appearance form.`,
          spriteSlug: `${cream.slug}-${sweet.slug}`
        })
      );
    });
  });

  VIVILLON_PATTERNS.forEach((pattern) => {
    if (pattern.slug === "meadow-pattern") {
      return;
    }

    const name = `vivillon-${pattern.slug}`;
    if (existingNames.has(name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `Vivillon ${pattern.label}`,
        baseNumber: 666,
        basePokemonName: "vivillon",
        variantLabel: pattern.label,
        detailNote: `${pattern.label} is tracked as a cosmetic Vivillon appearance form.`,
        spriteSlug: pattern.slug.replace(/-pattern$/, "")
      })
    );
  });

  FURFROU_TRIMS.forEach((trim) => {
    if (trim.slug === "natural") {
      return;
    }

    const name = `furfrou-${trim.slug}`;
    if (existingNames.has(name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `Furfrou ${trim.label}`,
        baseNumber: 676,
        basePokemonName: "furfrou",
        variantLabel: trim.label,
        detailNote: `${trim.label} is tracked as a cosmetic Furfrou appearance form.`,
        spriteSlug: trim.slug
      })
    );
  });

  KALOS_FLOWER_FAMILIES.forEach((family) => {
    KALOS_FLOWER_COLORS.forEach((color) => {
      if (color.isDefault) {
        return;
      }

      const name = `${family.basePokemonName}-${color.slug}`;
      if (existingNames.has(name)) {
        return;
      }

      entries.push(
        createAppearanceEntry({
          id: nextId++,
          name,
          displayName: `${family.displayLabel} ${color.label}`,
          baseNumber: family.baseNumber,
          basePokemonName: family.basePokemonName,
          variantLabel: color.label,
          detailNote: `${color.label} is tracked as a cosmetic ${family.displayLabel} color variant.`,
          spriteSlug: color.slug,
          extraSearchTerms: ["appearance", "cosmetic", "flower", "color"]
        })
      );
    });
  });

  BURMY_CLOAKS.forEach((cloak) => {
    if (cloak.isDefault) {
      return;
    }

    const name = `burmy-${cloak.slug}`;
    if (existingNames.has(name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `Burmy ${cloak.label}`,
        baseNumber: 412,
        basePokemonName: "burmy",
        variantLabel: cloak.label,
        detailNote: `${cloak.label} is tracked as a cosmetic Burmy cloak variant.`,
        spriteSlug: cloak.slug,
        extraSearchTerms: ["appearance", "cosmetic", "cloak", "burmy"]
      })
    );
  });

  SINNOH_EAST_SEA_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        spriteSlug: variant.spriteSlug,
        extraSearchTerms: ["appearance", "cosmetic", "sea", "sinnoh"]
      })
    );
  });

  UNOVA_SEASON_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        spriteSlug: variant.spriteSlug,
        extraSearchTerms: ["appearance", "cosmetic", "season", "unova"]
      })
    );
  });

  AUTHENTICITY_FORM_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        listSprite: buildSpriteUrl(variant.baseNumber),
        shinyListSprite: buildSpriteUrl(variant.baseNumber, true),
        archiveVisible: false,
        showInFormsTab: true,
        extraSearchTerms: variant.extraSearchTerms
      })
    );
  });

  FEMALE_SPRITE_DIFFERENCE_IDS.forEach((id) => {
    const sourceEntry = sourceEntriesById.get(id);
    if (!sourceEntry) {
      return;
    }

    const rootName = sourceEntry.name.replace(/-(male|female)$/, "");
    const name = `${rootName}-female`;
    if (existingNames.has(name)) {
      return;
    }

    const baseLabel = titleCase(rootName);
    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `${baseLabel} Female`,
        baseNumber: sourceEntry.baseNumber,
        basePokemonName: sourceEntry.basePokemonName ?? sourceEntry.name,
        variantLabel: "Female",
        detailNote: `Female ${baseLabel} is tracked here because it has an official visual gender difference.`,
        listSprite: buildGenderSpriteUrl(sourceEntry.id),
        shinyListSprite: buildGenderSpriteUrl(sourceEntry.id, true),
        formFlags: ["form", "gender"],
        syntheticKind: "gender",
        extraSearchTerms: ["gender", "female", "difference", "visual"]
      })
    );
  });

  return entries;
}

function labelSort(sort) {
  const labels = {
    "id-asc": "Sort: ID Numeric",
    alpha: "Sort: Alphabetical",
    caught: isArchiveShinyMode() ? "Sort: Logged First" : "Sort: Caught First",
    forms: "Sort: Form Priority"
  };

  return labels[sort] ?? "Sort: ID Numeric";
}

function getEntryVariantLabel(entry) {
  if (entry.variantLabel) {
    return entry.variantLabel;
  }

  if (!entry.isForm) {
    return "Base";
  }

  const labeledFlag = entry.formFlags.find((flag) => flag !== "form");
  return labeledFlag ? `${titleCase(labeledFlag)} Form` : "Form Variant";
}

function getEntryAccentKey(entry) {
  if (!entry?.isForm) {
    return "base";
  }

  if (entry.syntheticKind === "gender") {
    return "gender";
  }

  if (entry.syntheticKind === "appearance") {
    return "appearance";
  }

  const flags = new Set(entry.formFlags ?? []);

  if (flags.has("gmax")) {
    return "gmax";
  }

  if (flags.has("mega")) {
    return "mega";
  }

  if (flags.has("regional")) {
    return "regional";
  }

  if (flags.has("special")) {
    return "special";
  }

  return "form";
}

function compareEntriesWithinGroup(left, right) {
  return (
    Number(left.isForm) - Number(right.isForm) ||
    left.displayName.localeCompare(right.displayName) ||
    left.id - right.id
  );
}

function getEntriesForBaseNumber(baseNumber) {
  return [...state.entries, ...state.parkedEntries.filter((entry) => entry.showInFormsTab)]
    .filter((entry) => entry.baseNumber === baseNumber)
    .sort(compareEntriesWithinGroup);
}

async function repairUnresolvedFormEntries(entries) {
  const unresolvedForms = entries.filter(
    (entry) =>
      entry.isForm &&
      !entry.syntheticKind &&
      (!entry.basePokemonName || entry.baseNumber === entry.id)
  );

  if (!unresolvedForms.length) {
    return;
  }

  const repairs = await Promise.allSettled(
    unresolvedForms.map(async (entry) => {
      const payload = await fetchJsonCached(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(entry.name)}`
      );

      return {
        entry,
        speciesName: payload.species?.name ?? entry.basePokemonName ?? entry.name,
        speciesId: payload.species?.url ? extractIdFromUrl(payload.species.url) : entry.baseNumber
      };
    })
  );

  repairs.forEach((result) => {
    if (result.status !== "fulfilled") {
      return;
    }

    const { entry, speciesName, speciesId } = result.value;
    entry.basePokemonName = speciesName;
    entry.baseDisplayName = titleCase(speciesName);
    entry.baseNumber = speciesId;
    entry.generation = determineGeneration(speciesId);
    entry.listSprite = buildSpriteUrl(entry.id);
    entry.shinyListSprite = buildSpriteUrl(entry.id, true);
    entry.searchBlob = buildEntrySearchBlob(entry);
  });
}

function buildSpeciesOrderFromNames(speciesNames = []) {
  const seen = new Set();
  const order = [];

  speciesNames.forEach((name) => {
    const baseEntry = state.baseEntriesByName.get(name);
    const speciesNumber = baseEntry?.id;

    if (!Number.isFinite(speciesNumber) || seen.has(speciesNumber)) {
      return;
    }

    seen.add(speciesNumber);
    order.push(speciesNumber);
  });

  return order;
}

async function fetchPokedexSpeciesOrder(pokedexName) {
  const payload = await fetchJsonCached(
    `https://pokeapi.co/api/v2/pokedex/${encodeURIComponent(pokedexName)}`
  );
  return payload.pokemon_entries
    .slice()
    .sort((left, right) => left.entry_number - right.entry_number)
    .map((entry) => extractIdFromUrl(entry.pokemon_species.url));
}

async function buildAvailabilitySpeciesData(config) {
  const speciesSet = new Set();
  const order = [];

  const appendNumber = (number) => {
    if (!Number.isFinite(number) || speciesSet.has(number)) {
      return;
    }

    speciesSet.add(number);
    order.push(number);
  };

  config?.baseRanges?.forEach((range) => {
    for (let current = range.start; current <= range.end; current += 1) {
      appendNumber(current);
    }
  });

  if (config?.pokedexes?.length) {
    const pokedexOrders = await Promise.all(config.pokedexes.map(fetchPokedexSpeciesOrder));
    pokedexOrders.forEach((pokedexOrder) => {
      pokedexOrder.forEach((number) => {
        appendNumber(number);
      });
    });
  }

  if (config?.speciesOrderNames?.length) {
    buildSpeciesOrderFromNames(config.speciesOrderNames).forEach((number) => {
      appendNumber(number);
    });
  }

  config?.extraSpecies?.forEach((number) => {
    appendNumber(number);
  });

  config?.speciesNumbers?.forEach((number) => {
    appendNumber(number);
  });

  return { speciesSet, order };
}

async function buildGameAvailabilityDetail(gameId) {
  const config = SWITCH_GAME_AVAILABILITY[gameId];
  const detail = createGameAvailabilityDetail(gameId);

  if (!config) {
    return detail;
  }

  const allData = await buildAvailabilitySpeciesData(config);
  detail.all = allData.speciesSet;
  detail.order = allData.order;
  detail.orderIndex = buildGameAvailabilityOrderIndex(detail.order);

  if (detail.segments.length) {
    detail.segments = await Promise.all(
      detail.segments.map(async (segment) => {
        const segmentData = await buildAvailabilitySpeciesData(segment);
        return {
          ...segment,
          speciesSet: segmentData.speciesSet,
          order: segmentData.order,
          orderIndex: buildGameAvailabilityOrderIndex(segmentData.order)
        };
      })
    );
  }

  return detail;
}

function isAvailableInGame(baseNumber, gameId) {
  return Boolean(state.gameAvailabilityByGame.get(gameId)?.has(baseNumber));
}

function getGameDexOrderIndex(baseNumber, gameId) {
  const detail = state.gameAvailabilityDetailsByGame.get(gameId);
  return detail?.orderIndex?.get(baseNumber) ?? Number.MAX_SAFE_INTEGER;
}

function compareEntriesByGameDexOrder(left, right, gameId) {
  return (
    getGameDexOrderIndex(left.baseNumber, gameId) - getGameDexOrderIndex(right.baseNumber, gameId) ||
    left.baseNumber - right.baseNumber ||
    compareEntriesWithinGroup(left, right)
  );
}

function getAvailabilitySegmentVersionLabel(segment, baseNumber) {
  if (!segment?.available) {
    return "";
  }

  const swordNative = segment.versionNative?.sword?.includes(baseNumber);
  const shieldNative = segment.versionNative?.shield?.includes(baseNumber);

  if (swordNative && shieldNative) {
    return "Sword / Shield";
  }

  if (swordNative) {
    return "Sword Native";
  }

  if (shieldNative) {
    return "Shield Native";
  }

  return segment.defaultVersionLabel ?? "";
}

function getGameAvailabilityRecords(baseNumber) {
  return GAME_CATALOG.map((game) => {
    const detail =
      state.gameAvailabilityDetailsByGame.get(game.id) ?? createGameAvailabilityDetail(game.id);

    return {
      ...game,
      available: isAvailableInGame(baseNumber, game.id),
      owned: isAvailableInOwnedGameSelection(baseNumber, game.id),
      active: state.tracker.activeGame === game.id,
      versionExclusiveLabel: isAvailableInGame(baseNumber, game.id)
        ? getVersionExclusiveLabel(game.id, baseNumber)
        : "",
      versionExclusiveClasses: isAvailableInGame(baseNumber, game.id)
        ? getVersionExclusiveBadgeClasses(game.id, baseNumber)
        : [],
      sourceLabel: SWITCH_GAME_AVAILABILITY[game.id]?.label ?? "Tracked switch coverage",
      segmentRecords: detail.segments.map((segment) => ({
        id: segment.id,
        kind: segment.kind ?? "segment",
        label: segment.label,
        sourceLabel: segment.sourceLabel ?? segment.label,
        available: segment.speciesSet.has(baseNumber),
        versionNative: segment.versionNative,
        defaultVersionLabel: segment.defaultVersionLabel,
        versionLabel: getAvailabilitySegmentVersionLabel(
          {
            ...segment,
            available: segment.speciesSet.has(baseNumber)
          },
          baseNumber
        )
      }))
    };
  });
}

function renderGameAvailability(baseNumber) {
  const records = getGameAvailabilityRecords(baseNumber);
  const availableCount = records.reduce((sum, record) => sum + Number(record.available), 0);
  const dynamaxAdventureRecord = records
    .find((record) => record.id === "swsh")
    ?.segmentRecords.find((segment) => segment.id === "dynamax-adventure" && segment.available);

  elements.gameAvailabilityList.replaceChildren();

  if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.gameAvailabilityCount.textContent = "Syncing";
    elements.gameAvailabilityNote.textContent =
      "Pulling Switch game dex coverage from the archive now.";
  } else if (!state.gameAvailabilityReady) {
    elements.gameAvailabilityCount.textContent = "Unavailable";
    elements.gameAvailabilityNote.textContent =
      "Switch game availability could not be loaded right now. Refresh the archive and try again.";
  } else if (!state.gameAvailabilityBreakdownReady && state.gameAvailabilityLoading) {
    elements.gameAvailabilityCount.textContent = `${availableCount}/${GAME_CATALOG.length} games`;
    elements.gameAvailabilityNote.textContent =
      "Refreshing the split between each main game and its DLC dex coverage now.";
  } else {
    elements.gameAvailabilityCount.textContent = `${availableCount}/${GAME_CATALOG.length} games`;
    elements.gameAvailabilityNote.textContent = `${SWITCH_GAME_AVAILABILITY_NOTE}${
      dynamaxAdventureRecord
        ? " Dynamax Adventure native labels show which version hosts that path by default; online co-op can still surface opposite-version paths."
        : ""
    }`;
  }

  records.forEach((record) => {
    const card = document.createElement("article");
    card.className = "availability-card";
    card.classList.toggle("available", state.gameAvailabilityReady && record.available);
    card.classList.toggle("active", record.active);

    const head = document.createElement("div");
    head.className = "availability-card-head";

    const title = document.createElement("strong");
    title.textContent = record.shortName;

    const badge = document.createElement("span");
    badge.className = "availability-badge";

    if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
      badge.classList.add("syncing");
      badge.textContent = "Syncing";
    } else if (!state.gameAvailabilityReady) {
      badge.classList.add("unavailable");
      badge.textContent = "Unknown";
    } else if (record.segmentRecords.length) {
      const mainSegment =
        record.segmentRecords.find((segment) => segment.kind === "main") ?? record.segmentRecords[0];
      const mainAvailable = Boolean(mainSegment?.available);
      const hasDlc = record.segmentRecords.some((segment) => segment.kind === "dlc");
      const dlcAvailable = record.segmentRecords.some(
        (segment) => segment.kind === "dlc" && segment.available
      );

      if (mainAvailable && hasDlc && dlcAvailable) {
        badge.classList.add("available");
        badge.textContent = "Main + DLC";
      } else if (mainAvailable) {
        badge.classList.add("available");
        badge.textContent = "Main Game";
      } else if (dlcAvailable) {
        badge.classList.add("owned");
        badge.textContent = "DLC Only";
      } else {
        badge.classList.add("unavailable");
        badge.textContent = "Not in Dex";
      }
    } else if (record.available) {
      badge.classList.add("available");
      badge.textContent = "Available";
    } else {
      badge.classList.add("unavailable");
      badge.textContent = "Not in Dex";
    }

    head.append(title, badge);

    const name = document.createElement("p");
    name.className = "availability-card-name";
    name.textContent = record.name;

    const note = document.createElement("p");
    note.className = "availability-card-note";
    note.textContent = record.sourceLabel;

    card.append(head, name, note);

    if (record.segmentRecords.length) {
      const segmentRow = document.createElement("div");
      segmentRow.className = "availability-segment-row";

      record.segmentRecords.forEach((segment) => {
        const segmentCard = document.createElement("div");
        segmentCard.className = `availability-segment ${segment.kind ?? "segment"}`;

        if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
          segmentCard.classList.add("syncing");
        } else if (!state.gameAvailabilityReady) {
          segmentCard.classList.add("unavailable");
        } else if (segment.available) {
          segmentCard.classList.add("available");
        } else {
          segmentCard.classList.add("unavailable");
        }

        const copy = document.createElement("div");
        copy.className = "availability-segment-copy";

        const label = document.createElement("strong");
        label.textContent = segment.label;

        const source = document.createElement("span");
        source.textContent =
          state.gameAvailabilityReady && segment.available && segment.versionLabel
            ? `${segment.sourceLabel} · ${segment.versionLabel}`
            : segment.sourceLabel;

        copy.append(label, source);

        const status = document.createElement("span");
        status.className = "availability-segment-state";

        if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
          status.textContent = "Syncing";
        } else if (!state.gameAvailabilityReady) {
          status.textContent = "Unknown";
        } else if (segment.available) {
          status.textContent = "In Dex";
        } else {
          status.textContent = "Missing";
        }

        segmentCard.append(copy, status);
        segmentRow.appendChild(segmentCard);
      });

      card.appendChild(segmentRow);
    }

    if (record.owned || record.active || record.versionExclusiveLabel) {
      const flags = document.createElement("div");
      flags.className = "availability-card-flags";

      if (record.versionExclusiveLabel) {
        const versionBadge = document.createElement("span");
        versionBadge.className = "availability-badge version-exclusive";
        if (record.versionExclusiveClasses?.length) {
          versionBadge.classList.add(...record.versionExclusiveClasses);
        }
        versionBadge.textContent = record.versionExclusiveLabel;
        flags.appendChild(versionBadge);
      }

      if (record.active) {
        const activeBadge = document.createElement("span");
        activeBadge.className = "availability-badge syncing";
        activeBadge.textContent = "Active Save";
        flags.appendChild(activeBadge);
      }

      if (record.owned) {
        const ownedBadge = document.createElement("span");
        ownedBadge.className = "availability-badge owned";
        ownedBadge.textContent = "Owned";
        flags.appendChild(ownedBadge);
      }

      card.appendChild(flags);
    }

    elements.gameAvailabilityList.appendChild(card);
  });
}

async function loadSwitchGameAvailability() {
  if (state.gameAvailabilityLoading) {
    return;
  }

  state.gameAvailabilityLoading = true;
  state.gameAvailabilityError = false;
  refreshResults();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  const nextMap = createEmptyGameAvailabilityMap();
  const nextDetails = createEmptyGameAvailabilityDetailsMap();
  const priorMap = state.gameAvailabilityByGame;
  const priorDetails = state.gameAvailabilityDetailsByGame;
  const results = await Promise.allSettled(
    GAME_CATALOG.map(async (game) => ({
      gameId: game.id,
      detail: await buildGameAvailabilityDetail(game.id)
    }))
  );

  let successCount = 0;

  results.forEach((result, index) => {
    const gameId = GAME_CATALOG[index].id;

    if (result.status === "fulfilled") {
      successCount += 1;
      nextMap.set(gameId, new Set(result.value.detail.all));
      nextDetails.set(gameId, result.value.detail);
      return;
    }

    const fallbackSet = priorMap.get(gameId);
    const fallbackDetail = cloneGameAvailabilityDetail(priorDetails.get(gameId), gameId);
    if (!fallbackDetail.all.size && fallbackSet?.size) {
      fallbackDetail.all = new Set(fallbackSet);
    }
    nextMap.set(gameId, fallbackSet ? new Set(fallbackSet) : new Set(fallbackDetail.all));
    nextDetails.set(gameId, fallbackDetail);
  });

  if (successCount > 0) {
    state.gameAvailabilityByGame = nextMap;
    state.gameAvailabilityDetailsByGame = nextDetails;
    state.gameAvailabilityReady = true;
    state.gameAvailabilityBreakdownReady = hasCompleteGameAvailabilityBreakdown(nextDetails);
    saveGameAvailabilityCache();
  }

  state.gameAvailabilityError = successCount !== GAME_CATALOG.length;
  state.gameAvailabilityLoading = false;
  refreshResults();
  renderCollections();
  renderHomeOrganizer();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function getGameMeta(gameId) {
  return GAME_CATALOG.find((game) => game.id === gameId) ?? null;
}

function clampLevel(value, fallback) {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return Math.min(100, Math.max(1, Math.round(numeric)));
}

function getActiveGameId() {
  if (state.tracker.activeGame !== "none") {
    return state.tracker.activeGame;
  }

  const ownedGame = GAME_CATALOG.find((game) => state.tracker.games[game.id]?.owned);
  return ownedGame?.id ?? "none";
}

function syncExpInputsFromState() {
  elements.expCurrentLevel.value = String(state.expPlan.currentLevel);
  elements.expCurrentLevelValue.textContent = `Lv ${state.expPlan.currentLevel}`;
  elements.expTargetLevel.value = String(state.expPlan.targetLevel);
  elements.expYieldInput.value = String(state.expPlan.expYield);
}

function renderExpGameOptions() {
  elements.expGameSelect.replaceChildren();

  const neutralOption = document.createElement("option");
  neutralOption.value = "none";
  neutralOption.textContent = "No specific game";
  elements.expGameSelect.appendChild(neutralOption);

  GAME_CATALOG.forEach((game) => {
    const option = document.createElement("option");
    option.value = game.id;
    option.textContent = `${game.shortName} · ${game.name}`;
    elements.expGameSelect.appendChild(option);
  });

  elements.expGameSelect.value = state.expPlan.gameId ?? "none";
}

function getOwnedSummary() {
  const ownedCount = getOwnedReleaseCount();
  const clearedCount = GAME_CATALOG.reduce(
    (sum, game) => sum + Number(Boolean(state.tracker.games[game.id]?.hallOfFame)),
    0
  );

  return { ownedCount, clearedCount };
}

function isBreedableTarget(pokemon) {
  if (!pokemon) {
    return false;
  }

  if (pokemon.isLegendary || pokemon.isMythical || pokemon.isBaby) {
    return false;
  }

  if (!pokemon.eggGroups?.length) {
    return false;
  }

  return !pokemon.eggGroups.includes("Undiscovered") && !pokemon.eggGroups.includes("Ditto");
}

function getShinyPlan(gameId, pokemon) {
  const basePlan = SHINY_HUNT_METHODS[gameId];
  const available = pokemon ? isAvailableInGame(pokemon.baseNumber, gameId) : true;
  const breedable = isBreedableTarget(pokemon);

  if (!pokemon) {
    return {
      status: "general",
      method: basePlan.title,
      detail: basePlan.detail,
      note: basePlan.note,
      prep: basePlan.prep
    };
  }

  if (isShinyDexLocked(pokemon.name)) {
    return {
      status: "locked",
      method: "Shiny Locked",
      detail: `${pokemon.displayName} does not have a legitimate shiny release right now, so it is excluded from the shiny dex and hunt planner.`,
      note:
        "Keep it in the living dex, but do not count it toward shiny-dex completion until a legal shiny release exists.",
      prep: []
    };
  }

  if (!available && state.gameAvailabilityReady) {
    return {
      status: "unavailable",
      method: "Not in This Dex",
      detail: `${pokemon.displayName} is not part of the tracked ${
        getGameMeta(gameId)?.shortName ?? gameId.toUpperCase()
      } dex coverage.`,
      note:
        "Use another Switch title, Pokemon Home routing, or a different target if you want this hunt inside your current game list.",
      prep: basePlan.prep
    };
  }

  switch (gameId) {
    case "swsh":
      if (!breedable) {
        return {
          status: isShiny(pokemon.name) ? "logged" : "available",
          method: "Encounter Route / Dynamax Path",
          detail: `${pokemon.displayName} looks non-breedable, so repeatable field checks and special encounter routes beat egg loops here.`,
          note:
            "Save-backed route resets, static encounter loops, and Crown Tundra style content are usually cleaner than forcing a breeding plan.",
          prep: ["Shiny Charm", "Route Reset", "Save Point"]
        };
      }
      break;
    case "bdsp":
      if (!breedable) {
        return {
          status: isShiny(pokemon.name) ? "logged" : "available",
          method: "Radar / Fixed Encounter Route",
          detail: `${pokemon.displayName} is a poor egg target, so lean on radar chains or repeatable field setups when BDSP supports them.`,
          note:
            "BDSP rewards precise chain management; if the encounter is awkward, take the cleanest repeatable route instead of splitting focus.",
          prep: ["Poke Radar", "Repels", "Chain Discipline"]
        };
      }
      break;
    case "sv":
      if (!breedable) {
        return {
          status: isShiny(pokemon.name) ? "logged" : "available",
          method: "Isolated Encounter / Outbreak",
          detail: `${pokemon.displayName} is better as a field hunt in Paldea, using spawn control rather than breeding loops.`,
          note:
            "Open terrain, sandwich control, and outbreak resets usually beat eggs for non-breedable or awkward-to-hatch targets.",
          prep: ["Sparkling Lv.3", "Encounter Power", "Spawn Reset"]
        };
      }
      break;
    case "pla":
      if (pokemon.isLegendary || pokemon.isMythical) {
        return {
          status: isShiny(pokemon.name) ? "logged" : "available",
          method: "Repeatable Route Check",
          detail: `${pokemon.displayName} needs a repeatable field route in Hisui rather than a breeding plan, so prioritize consistent revisit loops when possible.`,
          note:
            "PLA is best when the hunt can be rerolled through area flow; one-time story catches are not ideal long-form shiny projects.",
          prep: ["Research 10", "Route Loop", "Shiny Charm"]
        };
      }
      break;
    default:
      break;
  }

  return {
    status: isShiny(pokemon.name) ? "logged" : "available",
    method: basePlan.title,
    detail: breedable
      ? `${pokemon.displayName} can support the standard ${
          getGameMeta(gameId)?.shortName ?? gameId.toUpperCase()
        } shiny route cleanly.`
      : basePlan.detail,
    note: basePlan.note,
    prep: basePlan.prep
  };
}

function renderShinyHelper(pokemon = state.currentPokemon) {
  const activeGame = getGameMeta(getActiveGameId());
  const summaryTarget = pokemon?.displayName ?? "your next target";

  elements.huntFocus.textContent = pokemon
    ? `Target: ${pokemon.displayName}`
    : activeGame
      ? `Focus: ${activeGame.shortName}`
      : "Pick a target";
  elements.huntSummary.textContent = pokemon
    ? isShinyDexLocked(pokemon.name)
      ? `${pokemon.displayName} is currently shiny-locked, so it is excluded from the shiny dex until a legal shiny release exists.`
      : isShiny(pokemon.name)
      ? `${pokemon.displayName} is already logged shiny. Use the game cards below if you want a duplicate, a different mark, or another form route.`
      : `${summaryTarget} is mapped across the supported Switch games below, with availability-aware hunt routes for each title.`
    : "Open a Pokémon entry to compare the cleanest shiny hunt route in each supported Switch game.";

  elements.huntGrid.replaceChildren();

  GAME_CATALOG.forEach((game) => {
    const plan = getShinyPlan(game.id, pokemon);
    const card = document.createElement("article");
    card.className = "hunt-card";
    card.classList.toggle("active", state.tracker.activeGame === game.id);
    card.classList.toggle("unavailable", plan.status === "unavailable");

    const head = document.createElement("div");
    head.className = "hunt-card-head";

    const title = document.createElement("strong");
    title.textContent = game.shortName;

    const badge = document.createElement("span");
    badge.className = "hunt-badge";

    if (plan.status === "unavailable") {
      badge.classList.add("unavailable");
      badge.textContent = "Not in Dex";
    } else if (plan.status === "logged") {
      badge.classList.add("logged");
      badge.textContent = "Logged";
    } else if (plan.status === "general") {
      badge.classList.add("general");
      badge.textContent = "General";
    } else {
      badge.classList.add("available");
      badge.textContent = "Ready";
    }

    head.append(title, badge);

    const method = document.createElement("strong");
    method.className = "hunt-method";
    method.textContent = plan.method;

    const detail = document.createElement("p");
    detail.className = "hunt-detail results-summary";
    detail.textContent = plan.detail;

    const tags = document.createElement("div");
    tags.className = "hunt-tags";
    plan.prep.forEach((label) => {
      tags.appendChild(makeTag(label));
    });

    const note = document.createElement("p");
    note.className = "hunt-note";
    note.textContent = plan.note;

    card.append(head, method, detail, tags, note);

    if (pokemon) {
      const flags = document.createElement("div");
      flags.className = "hunt-flags";

      if (state.tracker.activeGame === game.id) {
        flags.appendChild(makeTag("Active Save"));
      }

      if (state.tracker.games[game.id]?.owned) {
        flags.appendChild(makeTag("Owned"));
      }

      if (isAvailableInGame(pokemon.baseNumber, game.id) && isShiny(pokemon.name)) {
        flags.appendChild(makeTag("Shiny Logged"));
      }

      if (flags.childElementCount) {
        card.appendChild(flags);
      }
    }

    elements.huntGrid.appendChild(card);
  });
}

function formatPercent(value) {
  return `${(value * 100).toFixed(value * 100 >= 10 ? 0 : 1)}%`;
}

function buildBulbapediaUrl(pokemon) {
  const pageName = `${titleCase(pokemon.speciesName ?? pokemon.name).replace(/\s+/g, "_")}_(Pokémon)`;
  return `https://bulbapedia.bulbagarden.net/wiki/${encodeURIComponent(pageName)}`;
}

function buildSerebiiUrl(pokemon) {
  return `https://www.serebii.net/search/search.cgi?query=${encodeURIComponent(
    pokemon.speciesName ?? pokemon.name
  )}&sa=Search`;
}

function describeEvolutionCondition(detail) {
  if (!detail) {
    return "Base stage";
  }

  const parts = [titleCase(detail.trigger?.name ?? "evolution")];

  if (detail.min_level) {
    parts.push(`Lv ${detail.min_level}`);
  }
  if (detail.item?.name) {
    parts.push(titleCase(detail.item.name));
  }
  if (detail.held_item?.name) {
    parts.push(`Hold ${titleCase(detail.held_item.name)}`);
  }
  if (detail.known_move?.name) {
    parts.push(`Know ${titleCase(detail.known_move.name)}`);
  }
  if (detail.known_move_type?.name) {
    parts.push(`${titleCase(detail.known_move_type.name)} move`);
  }
  if (detail.location?.name) {
    parts.push(titleCase(detail.location.name));
  }
  if (detail.region?.name) {
    parts.push(titleCase(detail.region.name));
  }
  if (detail.time_of_day) {
    parts.push(titleCase(detail.time_of_day));
  }
  if (detail.min_happiness) {
    parts.push(`Happiness ${detail.min_happiness}+`);
  }
  if (detail.min_affection) {
    parts.push(`Affection ${detail.min_affection}+`);
  }
  if (detail.trade_species?.name) {
    parts.push(`Trade for ${titleCase(detail.trade_species.name)}`);
  }
  if (detail.gender === 1) {
    parts.push("Female");
  } else if (detail.gender === 2) {
    parts.push("Male");
  }

  return parts.join(" · ");
}

function summarizeEvolutionConditions(details) {
  const labels = [...new Set((details ?? []).map((detail) => describeEvolutionCondition(detail)).filter(Boolean))];
  return labels.length ? labels.join(" or ") : "Base stage";
}

async function loadEvolutionChain(url) {
  if (!url) {
    return null;
  }

  if (state.evolutionChainCache.has(url)) {
    return state.evolutionChainCache.get(url);
  }

  const payload = await fetchJsonCached(url);
  state.evolutionChainCache.set(url, payload);
  return payload;
}

function flattenEvolutionChain(node, stages = [], depth = 0, details = [null]) {
  const normalizedDetails = Array.isArray(details) ? details : [details];
  const existing = stages.find(
    (stage) => stage.speciesName === node.species.name && stage.depth === depth
  );
  const nextConditions = [
    ...new Set(normalizedDetails.map((detail) => describeEvolutionCondition(detail)).filter(Boolean))
  ];

  if (existing) {
    existing.conditions = [...new Set([...(existing.conditions ?? []), ...nextConditions])];
    existing.condition = existing.conditions.join(" or ");
  } else {
    stages.push({
      speciesName: node.species.name,
      displayName: titleCase(node.species.name),
      depth,
      details: normalizedDetails,
      conditions: nextConditions,
      condition: nextConditions.join(" or ") || "Base stage"
    });
  }

  node.evolves_to.forEach((nextNode) => {
    const nextDetails = nextNode.evolution_details.length ? nextNode.evolution_details : [null];
    flattenEvolutionChain(nextNode, stages, depth + 1, nextDetails);
  });

  return stages;
}

function findEvolutionNode(node, speciesName) {
  if (!node) {
    return null;
  }

  if (node.species.name === speciesName) {
    return node;
  }

  for (const nextNode of node.evolves_to) {
    const found = findEvolutionNode(nextNode, speciesName);
    if (found) {
      return found;
    }
  }

  return null;
}

function buildEvolutionTargets(node, currentLevel) {
  if (!node?.evolves_to?.length) {
    return [];
  }

  return node.evolves_to
    .map((nextNode) => {
      const details = nextNode.evolution_details.length ? nextNode.evolution_details : [null];
      const variants = details.map((detail) => {
        const trigger = detail?.trigger?.name ?? "";
        const minLevel = detail?.min_level ?? null;
        const isLevelTrigger = trigger === "level-up" || (trigger === "" && minLevel !== null);
        let targetLevel = null;

        if (minLevel !== null) {
          if (currentLevel < minLevel) {
            targetLevel = minLevel;
          } else if (isLevelTrigger && currentLevel < 100) {
            targetLevel = currentLevel + 1;
          }
        } else if (isLevelTrigger && currentLevel < 100) {
          targetLevel = currentLevel + 1;
        }

        return {
          speciesName: nextNode.species.name,
          displayName: titleCase(nextNode.species.name),
          detail,
          condition: describeEvolutionCondition(detail),
          trigger,
          minLevel,
          targetLevel,
          requiresLevelUp: isLevelTrigger
        };
      });

      const availableTargetLevels = variants
        .map((variant) => variant.targetLevel)
        .filter((value) => value !== null);
      const availableMinLevels = variants
        .map((variant) => variant.minLevel)
        .filter((value) => value !== null);

      return {
        speciesName: nextNode.species.name,
        displayName: titleCase(nextNode.species.name),
        details,
        detail: variants[0]?.detail ?? null,
        condition: summarizeEvolutionConditions(details),
        trigger: variants[0]?.trigger ?? "",
        minLevel: availableMinLevels.length ? Math.min(...availableMinLevels) : null,
        targetLevel: availableTargetLevels.length ? Math.min(...availableTargetLevels) : null,
        requiresLevelUp: variants.some((variant) => variant.requiresLevelUp)
      };
    })
    .sort(
      (left, right) =>
        Number(left.targetLevel === null) -
          Number(right.targetLevel === null) ||
        (left.targetLevel ?? 999) - (right.targetLevel ?? 999) ||
        left.displayName.localeCompare(right.displayName)
    );
}

const VERSION_TO_GAME = {
  red: "lgpe",
  blue: "lgpe",
  yellow: "lgpe",
  "red-japan": "lgpe",
  "green-japan": "lgpe",
  firered: "lgpe",
  leafgreen: "lgpe",
  heartgold: "lgpe",
  soulsilver: "lgpe",
  "lets-go-pikachu": "lgpe",
  "lets-go-eevee": "lgpe",
  sword: "swsh",
  shield: "swsh",
  diamond: "bdsp",
  pearl: "bdsp",
  platinum: "bdsp",
  "brilliant-diamond": "bdsp",
  "shining-pearl": "bdsp",
  "legends-arceus": "pla",
  scarlet: "sv",
  violet: "sv"
};

const GAME_LOCATION_MAPS = {
  lgpe: {
    cardLabel: "Pokemon: Let's Go",
    surfaces: [
      {
        id: "kanto",
        label: "Kanto",
        badgeLabel: "Kanto Field Map",
        mapKey: "lgpe-kanto",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/kanto.png`,
        aspectRatio: "200 / 618",
        viewBox: "0 0 100 100",
        regions: [
          { id: "pallet", label: "Pallet / Viridian", short: "PV", x: 6, y: 64, w: 20, h: 18, patterns: ["pallet town", "viridian city", "viridian forest", "route 1", "route 2", "route 22"] },
          { id: "pewter", label: "Pewter / Mt. Moon", short: "PM", x: 18, y: 40, w: 20, h: 18, patterns: ["pewter city", "mt moon", "route 3", "route 4"] },
          { id: "cerulean", label: "Cerulean", short: "CE", x: 36, y: 26, w: 18, h: 18, patterns: ["cerulean city", "route 24", "route 25", "route 5"] },
          { id: "vermilion", label: "Vermilion", short: "VE", x: 48, y: 56, w: 18, h: 16, patterns: ["vermilion city", "route 6", "route 11", "diglett", "ss anne"] },
          { id: "lavender", label: "Lavender / Rock", short: "LA", x: 62, y: 38, w: 18, h: 18, patterns: ["lavender town", "rock tunnel", "pokemon tower", "route 8", "route 9", "route 10"] },
          { id: "metro", label: "Celadon / Saffron", short: "CS", x: 34, y: 50, w: 18, h: 16, patterns: ["celadon city", "saffron city", "route 7", "game corner"] },
          { id: "fuchsia", label: "Fuchsia / Safari", short: "FU", x: 46, y: 76, w: 22, h: 14, patterns: ["fuchsia city", "safari zone", "route 12", "route 13", "route 14", "route 15", "route 16", "route 17", "route 18"] },
          { id: "seafoam", label: "Seafoam / Cinnabar", short: "SC", x: 66, y: 82, w: 24, h: 12, patterns: ["cinnabar island", "pokemon mansion", "seafoam islands", "sea route 19", "sea route 20", "sea route 21"] },
          { id: "indigo", label: "Indigo Plateau", short: "IP", x: 0, y: 16, w: 16, h: 16, patterns: ["route 23", "victory road", "indigo plateau", "power plant", "cerulean cave"] }
        ]
      }
    ]
  },
  swsh: {
    cardLabel: "Pokemon Sword & Shield",
    surfaces: [
      {
        id: "main",
        label: "Galar",
        badgeLabel: "Main Game",
        kind: "main",
        segmentId: "main",
        mapKey: "swsh-galar",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/galar.jpg`,
        aspectRatio: "728 / 1420",
        viewBox: "0 0 100 180",
        regions: [
          { id: "south-galar", label: "South Galar", short: "SG", x: 28, y: 122, w: 30, h: 22, patterns: ["slumbering weald", "wedgehurst", "route 1", "route 2", "route 3", "route 4", "motostoke outskirts", "galar mine"] },
          { id: "wild-area", label: "Wild Area", short: "WA", x: 24, y: 86, w: 38, h: 28, patterns: ["rolling fields", "dappled grove", "watchtower ruins", "east lake axewell", "west lake axewell", "axews eye", "south lake miloch", "north lake miloch", "motostoke riverbank", "bridge field", "stony wilderness", "dusty bowl", "giants mirror", "hammerlocke hills", "giants seat", "lake of outrage"] },
          { id: "mid-galar", label: "Central Galar", short: "CG", x: 36, y: 52, w: 28, h: 22, patterns: ["route 5", "route 6", "galar mine no 2", "stow on side", "glimwood tangle", "ballonlea"] },
          { id: "north-galar", label: "North Galar", short: "NG", x: 42, y: 20, w: 28, h: 18, patterns: ["route 7", "route 8", "route 9", "route 10", "circhester", "spikemuth", "wyndon"] }
        ]
      },
      {
        id: "isle-of-armor",
        label: "Isle of Armor",
        badgeLabel: "Isle of Armor DLC",
        kind: "dlc",
        segmentId: "isle-of-armor",
        mapKey: "swsh-isle-armor",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/maps/galar/70.jpg`,
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "fields", label: "Fields of Honor", short: "FH", x: 8, y: 18, w: 26, h: 18, patterns: ["fields of honor", "challenge road"] },
          { id: "wetlands", label: "Wetlands / Forest", short: "WF", x: 38, y: 18, w: 24, h: 22, patterns: ["soothing wetlands", "forest of focus", "training lowlands"] },
          { id: "coast", label: "Beach / Sea", short: "BS", x: 58, y: 44, w: 26, h: 18, patterns: ["challenge beach", "loop lagoon", "insular sea", "stepping stone sea"] },
          { id: "caverns", label: "Caves", short: "CV", x: 26, y: 54, w: 24, h: 18, patterns: ["brawlers cave", "warm up tunnel", "courageous cavern"] },
          { id: "desert", label: "Desert / Honeycalm", short: "DH", x: 18, y: 74, w: 28, h: 16, patterns: ["potbottom desert", "honeycalm"] }
        ]
      },
      {
        id: "crown-tundra",
        label: "Crown Tundra",
        badgeLabel: "Crown Tundra DLC",
        kind: "dlc",
        segmentId: "crown-tundra",
        mapKey: "swsh-crown-tundra",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/maps/galar/92.jpg`,
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "freezington", label: "Freezington", short: "FR", x: 16, y: 16, w: 24, h: 16, patterns: ["freezington", "slippery slope"] },
          { id: "giants-bed", label: "Giant's Bed", short: "GB", x: 32, y: 36, w: 28, h: 18, patterns: ["giants bed", "frostpoint field"] },
          { id: "snowslide", label: "Snowslide", short: "SS", x: 62, y: 22, w: 18, h: 18, patterns: ["snowslide slope", "crown shrine"] },
          { id: "seas", label: "Foot / Sea Caves", short: "SC", x: 58, y: 52, w: 24, h: 18, patterns: ["giants foot", "roaring sea caves", "three point pass"] },
          { id: "lake", label: "Ballimere / Dyna Tree", short: "DL", x: 18, y: 64, w: 26, h: 18, patterns: ["ballimere lake", "dyna tree hill", "old cemetery"] }
        ]
      }
    ]
  },
  bdsp: {
    cardLabel: "Brilliant Diamond / Shining Pearl",
    surfaces: [
      {
        id: "sinnoh",
        label: "Sinnoh",
        badgeLabel: "Sinnoh Route Map",
        mapKey: "bdsp-sinnoh",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/sinnoh.jpg`,
        aspectRatio: "640 / 344",
        viewBox: "0 0 100 100",
        regions: [
          { id: "twinleaf", label: "Twinleaf / Sandgem", short: "TS", x: 8, y: 76, w: 20, h: 14, patterns: ["twinleaf town", "sandgem town", "route 201", "route 202", "lake verity"] },
          { id: "oreburgh", label: "Jubilife / Oreburgh", short: "JO", x: 22, y: 58, w: 22, h: 18, patterns: ["jubilife city", "oreburgh city", "oreburgh gate", "oreburgh mine", "route 203", "route 204", "ravaged path"] },
          { id: "eterna", label: "Floaroma / Eterna", short: "FE", x: 24, y: 28, w: 22, h: 20, patterns: ["floaroma town", "eterna city", "eterna forest", "valley windworks", "route 205", "old chateau"] },
          { id: "coronet", label: "Mt. Coronet", short: "MC", x: 44, y: 32, w: 14, h: 32, patterns: ["mt coronet", "spear pillar", "route 206", "route 207", "route 211", "route 216", "wayward cave"] },
          { id: "hearthome", label: "Hearthome / Solaceon", short: "HS", x: 42, y: 56, w: 22, h: 18, patterns: ["hearthome city", "solaceon town", "route 208", "route 209", "route 210", "lost tower"] },
          { id: "veilstone", label: "Veilstone / Pastoria", short: "VP", x: 62, y: 58, w: 26, h: 20, patterns: ["veilstone city", "pastoria city", "great marsh", "route 212", "route 213", "route 214", "route 215", "valor lakefront", "lake valor"] },
          { id: "canalave", label: "Canalave / Iron", short: "CI", x: 0, y: 44, w: 16, h: 18, patterns: ["canalave city", "iron island", "route 218", "route 219", "route 220", "route 221"] },
          { id: "snowpoint", label: "Snowpoint", short: "SN", x: 62, y: 8, w: 18, h: 16, patterns: ["snowpoint city", "route 217", "lake acuity", "acuity"] },
          { id: "league", label: "League / Postgame", short: "LP", x: 82, y: 12, w: 16, h: 30, patterns: ["pokemon league", "victory road", "route 223", "route 224", "route 225", "route 226", "route 227", "route 228", "route 229", "resort area", "survival area", "stark mountain", "fight area"] }
        ]
      }
    ]
  },
  pla: {
    cardLabel: "Pokemon Legends: Arceus",
    surfaces: [
      {
        id: "hisui",
        label: "Hisui",
        badgeLabel: "Hisui Survey Map",
        mapKey: "pla-hisui",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/hisui.jpg`,
        aspectRatio: "16 / 11",
        viewBox: "0 0 100 100",
        regions: [
          { id: "obsidian", label: "Obsidian Fieldlands", short: "OF", x: 10, y: 18, w: 28, h: 24, patterns: ["obsidian fieldlands", "aspiration hill", "horseshoe plains", "deertrack heights", "natures pantry", "obsidian falls"] },
          { id: "mirelands", label: "Crimson Mirelands", short: "CM", x: 24, y: 54, w: 28, h: 22, patterns: ["crimson mirelands", "golden lowlands", "gapejaw bog", "scarlet bog", "sludge mound", "holm of trials"] },
          { id: "highlands", label: "Coronet Highlands", short: "CH", x: 46, y: 28, w: 22, h: 26, patterns: ["coronet highlands", "heavensward lookout", "celestica trail", "fabled spring", "sacred plaza", "primeval grotto"] },
          { id: "coastlands", label: "Cobalt Coastlands", short: "CC", x: 64, y: 56, w: 24, h: 22, patterns: ["cobalt coastlands", "ginkgo landing", "tranquility cove", "deadwood haunt", "veilstone cape", "castaway shore"] },
          { id: "icelands", label: "Alabaster Icelands", short: "AI", x: 68, y: 8, w: 24, h: 20, patterns: ["alabaster icelands", "avalanche slopes", "avalanche slops", "bonechill wastes", "icepeak arena", "arena s approach", "whiteout valley"] }
        ]
      }
    ]
  },
  sv: {
    cardLabel: "Pokemon Scarlet & Violet",
    surfaces: [
      {
        id: "main",
        label: "Paldea",
        badgeLabel: "Main Game",
        kind: "main",
        segmentId: "main",
        mapKey: "sv-paldea",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/paldea.jpg`,
        aspectRatio: "14 / 11",
        viewBox: "0 0 100 100",
        regions: [
          { id: "north-1", label: "North One", short: "N1", x: 34, y: 4, w: 14, h: 10, patterns: ["north province area one"] },
          { id: "north-2", label: "North Two", short: "N2", x: 50, y: 4, w: 14, h: 10, patterns: ["north province area two"] },
          { id: "north-3", label: "North Three", short: "N3", x: 66, y: 4, w: 14, h: 10, patterns: ["north province area three"] },
          { id: "west-3", label: "West Three", short: "W3", x: 16, y: 18, w: 14, h: 10, patterns: ["west province area three"] },
          { id: "west-2", label: "West Two", short: "W2", x: 16, y: 34, w: 14, h: 10, patterns: ["west province area two"] },
          { id: "west-1", label: "West One", short: "W1", x: 16, y: 50, w: 14, h: 10, patterns: ["west province area one"] },
          { id: "east-1", label: "East One", short: "E1", x: 66, y: 22, w: 14, h: 10, patterns: ["east province area one"] },
          { id: "east-2", label: "East Two", short: "E2", x: 70, y: 38, w: 14, h: 10, patterns: ["east province area two"] },
          { id: "east-3", label: "East Three", short: "E3", x: 74, y: 54, w: 14, h: 10, patterns: ["east province area three"] },
          { id: "south-1", label: "South One", short: "S1", x: 38, y: 74, w: 14, h: 10, patterns: ["south province area one"] },
          { id: "south-2", label: "South Two", short: "S2", x: 54, y: 74, w: 14, h: 10, patterns: ["south province area two"] },
          { id: "south-3", label: "South Three", short: "S3", x: 26, y: 74, w: 14, h: 10, patterns: ["south province area three"] },
          { id: "south-4", label: "South Four", short: "S4", x: 34, y: 58, w: 14, h: 10, patterns: ["south province area four"] },
          { id: "south-5", label: "South Five", short: "S5", x: 18, y: 58, w: 14, h: 10, patterns: ["south province area five"] },
          { id: "south-6", label: "South Six", short: "S6", x: 50, y: 58, w: 14, h: 10, patterns: ["south province area six"] },
          { id: "area-zero", label: "Area Zero", short: "AZ", x: 42, y: 28, w: 18, h: 18, patterns: ["area zero", "great crater"] }
        ]
      },
      {
        id: "kitakami",
        label: "Kitakami",
        badgeLabel: "Teal Mask DLC",
        kind: "dlc",
        segmentId: "kitakami",
        mapKey: "sv-kitakami",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/kitakami.jpg`,
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "mossui", label: "Mossui / Apple Hills", short: "MS", x: 16, y: 60, w: 22, h: 18, patterns: ["mossui", "apple hills", "kitakami road"] },
          { id: "timeless", label: "Timeless Woods", short: "TW", x: 28, y: 24, w: 22, h: 18, patterns: ["timeless woods"] },
          { id: "oni", label: "Oni Mountain", short: "OM", x: 54, y: 22, w: 20, h: 18, patterns: ["oni mountain", "infernal pass", "crystal pool"] },
          { id: "barrens", label: "Paradise Barrens", short: "PB", x: 58, y: 56, w: 18, h: 14, patterns: ["paradise barrens"] },
          { id: "gorge", label: "Fellhorn Gorge", short: "FG", x: 28, y: 78, w: 24, h: 12, patterns: ["fellhorn gorge", "kitakami"] }
        ]
      },
      {
        id: "blueberry",
        label: "Blueberry Academy",
        badgeLabel: "Indigo Disk DLC",
        kind: "dlc",
        segmentId: "blueberry",
        mapKey: "sv-blueberry",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/terarium.jpg`,
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "coastal", label: "Coastal Biome", short: "CB", x: 12, y: 12, w: 28, h: 28, patterns: ["coastal biome"] },
          { id: "savanna", label: "Savanna Biome", short: "SB", x: 58, y: 12, w: 28, h: 28, patterns: ["savanna biome"] },
          { id: "canyon", label: "Canyon Biome", short: "CY", x: 12, y: 58, w: 28, h: 28, patterns: ["canyon biome"] },
          { id: "polar", label: "Polar Biome", short: "PB", x: 58, y: 58, w: 28, h: 28, patterns: ["polar biome"] }
        ]
      }
    ]
  },
  lza: {
    cardLabel: "Pokemon Legends: Z-A",
    surfaces: [
      {
        id: "lumiose",
        label: "Lumiose",
        badgeLabel: "Main Game",
        kind: "main",
        speciesNumbers: LZA_LUMIOSE_SPECIES,
        mapKey: "lza-lumiose",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/lumiosecity.jpg`,
        fallbackRegionIds: ["central"],
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "north-boulevard", label: "North Boulevard", short: "NB", x: 36, y: 12, w: 28, h: 12, patterns: ["north boulevard", "north lumiose"] },
          { id: "west-boulevard", label: "West Boulevard", short: "WB", x: 12, y: 36, w: 16, h: 24, patterns: ["west boulevard", "west lumiose"] },
          { id: "central", label: "Central Lumiose", short: "CL", type: "circle", cx: 50, cy: 50, r: 13, patterns: ["central lumiose", "prism tower"] },
          { id: "east-boulevard", label: "East Boulevard", short: "EB", x: 72, y: 36, w: 16, h: 24, patterns: ["east boulevard", "east lumiose"] },
          { id: "hotel-z", label: "Hotel Z / South Hub", short: "HZ", x: 38, y: 72, w: 24, h: 14, patterns: ["hotel z", "city core", "south lumiose"] }
        ]
      },
      {
        id: "hyperspace",
        label: "Hyperspace",
        badgeLabel: "Wild Zones",
        kind: "main",
        speciesNumbers: LZA_HYPERSPACE_SPECIES,
        mapKey: "lza-hyperspace",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/maps/lumiosecity/50.jpg`,
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "northwest", label: "Northwest Wild Zone", short: "NW", x: 18, y: 16, w: 18, h: 18, patterns: ["wild zone north west", "northwest wild zone"] },
          { id: "north", label: "North Wild Zone", short: "N", x: 41, y: 10, w: 18, h: 14, patterns: ["wild zone north", "north wild zone"] },
          { id: "northeast", label: "Northeast Wild Zone", short: "NE", x: 64, y: 16, w: 18, h: 18, patterns: ["wild zone north east", "northeast wild zone"] },
          { id: "west", label: "West Wild Zone", short: "W", x: 10, y: 41, w: 14, h: 18, patterns: ["wild zone west", "west wild zone"] },
          { id: "east", label: "East Wild Zone", short: "E", x: 76, y: 41, w: 14, h: 18, patterns: ["wild zone east", "east wild zone"] },
          { id: "southwest", label: "Southwest Wild Zone", short: "SW", x: 18, y: 66, w: 18, h: 18, patterns: ["wild zone south west", "southwest wild zone"] },
          { id: "south", label: "South Wild Zone", short: "S", x: 41, y: 76, w: 18, h: 14, patterns: ["wild zone south", "south wild zone"] },
          { id: "southeast", label: "Southeast Wild Zone", short: "SE", x: 64, y: 66, w: 18, h: 18, patterns: ["wild zone south east", "southeast wild zone"] },
          { id: "prism", label: "Prism Tower Link", short: "PT", type: "circle", cx: 50, cy: 50, r: 9, patterns: ["prism tower"] }
        ]
      },
      {
        id: "mega-dimension",
        label: "Mega Dimension",
        badgeLabel: "Mega Dimension DLC",
        kind: "dlc",
        speciesNumbers: LZA_MEGA_DIMENSION_SPECIES,
        mapKey: "lza-mega-dimension",
        imageUrl: `${POKEARTH_BASE_URL}/pokearth/maps/lumiosecity/51.jpg`,
        fallbackRegionIds: ["mega-core"],
        aspectRatio: "1 / 1",
        viewBox: "0 0 100 100",
        regions: [
          { id: "mega-core", label: "Mega Core", short: "MC", type: "circle", cx: 50, cy: 50, r: 12, patterns: ["mega core", "mega dimension"] },
          { id: "aura-north", label: "Aura North", short: "AN", x: 38, y: 14, w: 22, h: 12, patterns: ["aura north", "rift north"] },
          { id: "fracture-west", label: "Fracture West", short: "FW", x: 14, y: 38, w: 20, h: 16, patterns: ["fracture west", "rift west"] },
          { id: "fracture-east", label: "Fracture East", short: "FE", x: 66, y: 38, w: 20, h: 16, patterns: ["fracture east", "rift east"] },
          { id: "rift-south", label: "Rift South", short: "RS", x: 36, y: 72, w: 28, h: 12, patterns: ["rift south", "mega basin"] }
        ]
      }
    ]
  }
};

async function loadLocationEntries(url) {
  if (!url) {
    return [];
  }

  if (state.locationCache.has(url)) {
    return state.locationCache.get(url);
  }

  const payload = await fetchJsonCached(url);
  state.locationCache.set(url, payload);
  return payload;
}

function summarizeLocationGroups(entries) {
  const grouped = new Map(GAME_CATALOG.map((game) => [game.id, new Set()]));

  entries.forEach((location) => {
    location.version_details?.forEach((detail) => {
      const gameId = VERSION_TO_GAME[detail.version?.name];
      if (!gameId) {
        return;
      }

      grouped.get(gameId)?.add(titleCase(location.location_area.name.replace(/-/g, " ")));
    });
  });

  return grouped;
}

function normalizeMapToken(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getGameLocationMap(gameId) {
  return GAME_LOCATION_MAPS[gameId] ?? null;
}

function getGameLocationSurfaces(gameId) {
  return getGameLocationMap(gameId)?.surfaces ?? [];
}

function matchesLocationPattern(area, pattern) {
  const normalizedArea = normalizeMapToken(area);
  const normalizedPattern = normalizeMapToken(pattern);

  if (!normalizedArea || !normalizedPattern) {
    return false;
  }

  return normalizedArea.includes(normalizedPattern) || normalizedPattern.includes(normalizedArea);
}

function getMatchedLocationAreas(surface, areas) {
  if (!surface?.regions?.length || !areas.length) {
    return [];
  }

  return areas.filter((area) =>
    surface.regions.some((region) => region.patterns.some((pattern) => matchesLocationPattern(area, pattern)))
  );
}

function getHighlightedLocationRegions(record, surface) {
  if (!surface?.regions?.length) {
    return [];
  }

  if (!record.areas.length) {
    const fallbackRegionIds = Array.isArray(surface.fallbackRegionIds) ? surface.fallbackRegionIds : [];
    if (record.available && fallbackRegionIds.length) {
      return surface.regions.filter((region) => fallbackRegionIds.includes(region.id));
    }
    return [];
  }

  const normalizedAreas = record.areas.map((area) => normalizeMapToken(area));
  return surface.regions.filter((region) =>
    region.patterns.some((pattern) => {
      const normalizedPattern = normalizeMapToken(pattern);
      return normalizedAreas.some(
        (area) => area.includes(normalizedPattern) || normalizedPattern.includes(area)
      );
    })
  );
}

function isLocationSurfaceAvailable(gameId, baseNumber, surface) {
  if (Array.isArray(surface.speciesNumbers) && surface.speciesNumbers.length) {
    return surface.speciesNumbers.includes(baseNumber);
  }

  if (!surface.segmentId) {
    return false;
  }

  const detail = state.gameAvailabilityDetailsByGame.get(gameId);
  const segment = detail?.segments.find((candidate) => candidate.id === surface.segmentId);
  return Boolean(segment?.speciesSet.has(baseNumber));
}

function buildLocationSurfaceRecords(gameId, baseNumber, areas = [], gameAvailable = false) {
  const surfaces = getGameLocationSurfaces(gameId);

  return surfaces
    .map((surface) => {
      const matchedAreas = getMatchedLocationAreas(surface, areas);
      const fallbackAvailable =
        matchedAreas.length > 0 ||
        isLocationSurfaceAvailable(gameId, baseNumber, surface) ||
        (gameAvailable && surfaces.length === 1);
      const available = fallbackAvailable;
      const highlightedRegions = getHighlightedLocationRegions(
        { id: gameId, areas: matchedAreas, available: available || gameAvailable },
        surface
      );

      return {
        ...surface,
        matchedAreas,
        highlightedRegions,
        available
      };
    })
    .filter((surface) => surface.available);
}

function getLocationMapZoomKey(gameId, surfaceId) {
  return `${gameId}:${surfaceId}`;
}

function getLocationMapZoom(gameId, surfaceId) {
  const zoom = Number(state.ui.locationMapZoom[getLocationMapZoomKey(gameId, surfaceId)] ?? 1);
  return Math.min(1.9, Math.max(1, zoom));
}

function setLocationMapZoom(gameId, surfaceId, zoom) {
  state.ui.locationMapZoom[getLocationMapZoomKey(gameId, surfaceId)] = Math.min(
    1.9,
    Math.max(1, Number(zoom) || 1)
  );
}

function getActiveLocationSurfaceRecord(record) {
  const surfaces = record.surfaceRecords ?? [];
  if (!surfaces.length) {
    return null;
  }

  const storedSurfaceId = state.ui.locationSurfaceTabs[record.id];
  return (
    surfaces.find((surface) => surface.id === storedSurfaceId) ??
    surfaces.find((surface) => surface.matchedAreas.length) ??
    surfaces.find((surface) => surface.highlightedRegions.length) ??
    surfaces[0]
  );
}

function parseSvgViewBox(viewBox) {
  const parts = String(viewBox ?? "0 0 100 100")
    .trim()
    .split(/\s+/)
    .map((value) => Number(value));
  if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) {
    return { minX: 0, minY: 0, width: 100, height: 100 };
  }
  return { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] };
}

function formatSvgViewBox(viewBox) {
  return `${viewBox.minX} ${viewBox.minY} ${viewBox.width} ${viewBox.height}`;
}

function scaleLocationRegion(region, sourceViewBox, targetViewBox) {
  const scaleX = targetViewBox.width / sourceViewBox.width;
  const scaleY = targetViewBox.height / sourceViewBox.height;
  const translateX = (value) => targetViewBox.minX + (value - sourceViewBox.minX) * scaleX;
  const translateY = (value) => targetViewBox.minY + (value - sourceViewBox.minY) * scaleY;

  if (region.type === "circle") {
    return {
      ...region,
      cx: translateX(region.cx),
      cy: translateY(region.cy),
      r: region.r * Math.min(scaleX, scaleY)
    };
  }

  return {
    ...region,
    x: translateX(region.x),
    y: translateY(region.y),
    w: region.w * scaleX,
    h: region.h * scaleY,
    rx: (region.rx ?? 4) * Math.min(scaleX, scaleY),
    ry: (region.ry ?? region.rx ?? 4) * Math.min(scaleX, scaleY)
  };
}

function createLocationMapSvg(surfaceRecord, gameRecord) {
  const highlightedRegions = surfaceRecord.highlightedRegions ?? [];
  const sourceViewBox = parseSvgViewBox(surfaceRecord.viewBox ?? "0 0 100 100");
  const targetViewBox = parseSvgViewBox(
    POKEARTH_MAP_VIEWBOXES[surfaceRecord.mapKey] ?? surfaceRecord.viewBox ?? "0 0 100 100"
  );
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", formatSvgViewBox(targetViewBox));
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    `${gameRecord.name} ${surfaceRecord.label} map with ${
      surfaceRecord.highlightedRegions.length
        ? `${surfaceRecord.highlightedRegions.length} highlighted zone${
            surfaceRecord.highlightedRegions.length === 1 ? "" : "s"
          }`
        : "coverage markers only"
    }`
  );
  svg.classList.add("location-map-canvas");

  highlightedRegions.forEach((region) => {
    const scaledRegion = scaleLocationRegion(region, sourceViewBox, targetViewBox);
    const zone = document.createElementNS("http://www.w3.org/2000/svg", "g");
    zone.classList.add("location-map-zone");
    zone.classList.add("is-active");

    if (scaledRegion.type === "circle") {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", String(scaledRegion.cx));
      circle.setAttribute("cy", String(scaledRegion.cy));
      circle.setAttribute("r", String(scaledRegion.r));
      zone.appendChild(circle);
    } else {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(scaledRegion.x));
      rect.setAttribute("y", String(scaledRegion.y));
      rect.setAttribute("width", String(scaledRegion.w));
      rect.setAttribute("height", String(scaledRegion.h));
      rect.setAttribute("rx", String(scaledRegion.rx ?? 4));
      rect.setAttribute("ry", String(scaledRegion.ry ?? scaledRegion.rx ?? 4));
      zone.appendChild(rect);
    }
    svg.appendChild(zone);
  });

  return svg;
}

function buildLocationSurfaceStatus(surfaceRecord) {
  if (surfaceRecord.matchedAreas.length) {
    const zoneSuffix = surfaceRecord.highlightedRegions.length
      ? ` · ${surfaceRecord.highlightedRegions.length} zone${
          surfaceRecord.highlightedRegions.length === 1 ? "" : "s"
        }`
      : "";
    return `${surfaceRecord.matchedAreas.length} archived area${
      surfaceRecord.matchedAreas.length === 1 ? "" : "s"
    } matched${zoneSuffix}`;
  }

  if (surfaceRecord.highlightedRegions.length) {
    return `${surfaceRecord.highlightedRegions.length} highlighted zone${
      surfaceRecord.highlightedRegions.length === 1 ? "" : "s"
    }`;
  }

  return "Coverage only";
}

function buildLocationSurfaceNote(surfaceRecord) {
  if (surfaceRecord.matchedAreas.length) {
    const preview = surfaceRecord.matchedAreas.slice(0, 4).join(" · ");
    return surfaceRecord.matchedAreas.length > 4
      ? `${preview} · +${surfaceRecord.matchedAreas.length - 4} more`
      : preview;
  }

  if (surfaceRecord.highlightedRegions.length) {
    return "This surface is confirmed for the current entry, but the archive only has broad area coverage for it right now.";
  }

  return "Exact route locations are not attached to this surface in the current archive yet.";
}

function buildLocationGameRecords(pokemon, locations = []) {
  const grouped = summarizeLocationGroups(locations);

  return GAME_CATALOG.map((game) => {
    const areas = [...(grouped.get(game.id) ?? [])];
    const overallAvailable =
      areas.length > 0 || (state.gameAvailabilityReady && isAvailableInGame(pokemon.baseNumber, game.id));
    const surfaceRecords = buildLocationSurfaceRecords(game.id, pokemon.baseNumber, areas, overallAvailable);
    const available = overallAvailable || surfaceRecords.length > 0;

    return {
      ...game,
      available,
      areas,
      baseNumber: pokemon.baseNumber,
      surfaceRecords
    };
  }).filter((record) => record.available);
}

function describeLocationRecord(record) {
  if (record.areas.length) {
    const preview = record.areas.slice(0, 4).join(" · ");
    const suffix =
      record.surfaceRecords?.length > 1
        ? ` Use the surface tabs to compare ${record.shortName}'s main-game and DLC breakdowns.`
        : "";
    return record.areas.length > 4
      ? `${preview} · +${record.areas.length - 4} more.${suffix}`
      : `${preview}.${suffix}`;
  }

  if (record.id === "lza") {
    return "Legends: Z-A splits Lumiose, Hyperspace, and Mega Dimension separately. Exact route locations are still sparse, so this view leans on the PokePC regional dex split when the archive has no direct area names.";
  }

  if (record.surfaceRecords?.length > 1) {
    return `Switch between ${record.surfaceRecords
      .map((surface) => surface.label)
      .join(" · ")} to compare this title's main-game and DLC breakdowns.`;
  }

  return "Tracked in this Switch title, but route-level area names are not attached in the current archive yet.";
}

function buildLocationRecordCard(record, noteText = describeLocationRecord(record)) {
  const card = document.createElement("article");
  card.className = "location-card";

  const head = document.createElement("div");
  head.className = "location-card-head";

  const title = document.createElement("strong");
  title.textContent = `${record.shortName} · ${record.name}`;

  const status = document.createElement("span");
  status.className = "location-card-status";
  if (record.surfaceRecords.length > 1) {
    status.textContent = `${record.surfaceRecords.length} map views`;
  } else if (record.areas.length) {
    status.textContent = `${record.areas.length} area${record.areas.length === 1 ? "" : "s"}`;
  } else {
    status.textContent = "Coverage";
  }

  head.append(title, status);

  const shell = document.createElement("section");
  shell.className = `location-map-shell location-map-shell--${record.id}`;

  const renderLocationPanel = () => {
    shell.replaceChildren();

    const activeSurface = getActiveLocationSurfaceRecord(record);
    if (!activeSurface) {
      return;
    }

    const toolbar = document.createElement("div");
    toolbar.className = "location-map-toolbar";

    const toolbarTitle = document.createElement("strong");
    toolbarTitle.textContent = "Location Breakdown";

    const badge = document.createElement("span");
    badge.className = "location-map-badge";
    badge.textContent = `${record.shortName} · ${activeSurface.badgeLabel ?? activeSurface.label}`;

    toolbar.append(toolbarTitle, badge);
    shell.appendChild(toolbar);

    if (record.surfaceRecords.length > 1) {
      const tabs = document.createElement("div");
      tabs.className = "location-surface-tabs";

      record.surfaceRecords.forEach((surface) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "location-surface-tab";
        button.classList.toggle("active", surface.id === activeSurface.id);
        button.textContent = surface.label;

        const count = document.createElement("span");
        count.className = "location-surface-count";
        count.textContent = surface.matchedAreas.length
          ? String(surface.matchedAreas.length)
          : surface.kind === "dlc"
            ? "DLC"
            : "Main";
        button.appendChild(count);
        button.addEventListener("click", () => {
          state.ui.locationSurfaceTabs[record.id] = surface.id;
          renderLocationPanel();
        });
        tabs.appendChild(button);
      });

      shell.appendChild(tabs);
    }

    const meta = document.createElement("div");
    meta.className = "location-map-meta";

    const surfaceName = document.createElement("strong");
    surfaceName.textContent = activeSurface.label;

    const surfaceStatus = document.createElement("span");
    surfaceStatus.className = "location-map-status";
    surfaceStatus.textContent = buildLocationSurfaceStatus(activeSurface);

    meta.append(surfaceName, surfaceStatus);
    shell.appendChild(meta);

    const surfaceNote = document.createElement("p");
    surfaceNote.className = "location-map-surface-note";
    surfaceNote.textContent = buildLocationSurfaceNote(activeSurface);
    shell.appendChild(surfaceNote);

    const legend = document.createElement("div");
    legend.className = "location-map-legend";
    if (activeSurface.matchedAreas.length) {
      activeSurface.matchedAreas.slice(0, 8).forEach((area) => {
        const chip = document.createElement("span");
        chip.className = "location-map-chip";
        chip.textContent = area;
        legend.appendChild(chip);
      });

      if (activeSurface.matchedAreas.length > 8) {
        const chip = document.createElement("span");
        chip.className = "location-map-chip location-map-chip--muted";
        chip.textContent = `+${activeSurface.matchedAreas.length - 8} more areas`;
        legend.appendChild(chip);
      }

      activeSurface.highlightedRegions.forEach((region) => {
        const chip = document.createElement("span");
        chip.className = "location-map-chip location-map-chip--muted";
        chip.textContent = `Coverage · ${region.label}`;
        legend.appendChild(chip);
      });
    } else if (activeSurface.highlightedRegions.length) {
      activeSurface.highlightedRegions.forEach((region) => {
        const chip = document.createElement("span");
        chip.className = "location-map-chip";
        chip.textContent = `Coverage · ${region.label}`;
        legend.appendChild(chip);
      });
    } else {
      const chip = document.createElement("span");
      chip.className = "location-map-chip location-map-chip--muted";
      chip.textContent = "This surface is tracked, but exact route pins are not attached in the current archive yet.";
      legend.appendChild(chip);
    }
    shell.appendChild(legend);
  };

  renderLocationPanel();

  const note = document.createElement("p");
  note.className = "results-summary";
  note.textContent = noteText;

  card.append(head);
  card.appendChild(shell);
  card.appendChild(note);
  return card;
}

async function renderEvolutionIntel(pokemon) {
  elements.evolutionList.replaceChildren();

  if (!pokemon?.evolutionChainUrl) {
    elements.evolutionSummary.textContent = "Unavailable";
    const empty = document.createElement("p");
    empty.className = "results-summary";
    empty.textContent = "No evolution chain data is available for this entry.";
    elements.evolutionList.appendChild(empty);
    return;
  }

  try {
    const chain = await loadEvolutionChain(pokemon.evolutionChainUrl);
    if (!state.currentPokemon || state.currentPokemon.name !== pokemon.name) {
      return;
    }

    const stages = flattenEvolutionChain(chain.chain);
    elements.evolutionSummary.textContent = `${stages.length} stages`;

    stages.forEach((stage) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "form-chip evolution-chip";
      button.classList.toggle("active", stage.speciesName === pokemon.speciesName);

      const copy = document.createElement("span");
      copy.className = "form-copy";

      const label = document.createElement("strong");
      label.textContent = stage.displayName;

      const note = document.createElement("span");
      note.className = "form-note";
      note.textContent = `${"→ ".repeat(stage.depth)}${stage.condition}`;

      copy.append(label, note);
      button.appendChild(copy);
      button.addEventListener("click", () => {
        openPokemonEntry(stage.speciesName);
      });

      elements.evolutionList.appendChild(button);
    });
  } catch {
    elements.evolutionSummary.textContent = "Offline";
    const empty = document.createElement("p");
    empty.className = "results-summary";
    empty.textContent = "Evolution data could not be loaded right now.";
    elements.evolutionList.appendChild(empty);
  }
}

async function renderLocationIntel(pokemon) {
  elements.locationList.replaceChildren();

  try {
    const locations = pokemon?.encounterUrl ? await loadLocationEntries(pokemon.encounterUrl) : [];
    if (!state.currentPokemon || state.currentPokemon.name !== pokemon.name) {
      return;
    }

    const records = buildLocationGameRecords(pokemon, locations);
    elements.locationSummary.textContent = records.length ? `${records.length} games` : "No route data";

    if (!records.length) {
      const empty = document.createElement("p");
      empty.className = "results-summary";
      empty.textContent = pokemon?.encounterUrl
        ? "No Switch route or game-coverage data is currently attached to this Pokémon."
        : "This Pokémon does not expose route-level encounter data in the current archive yet.";
      elements.locationList.appendChild(empty);
      return;
    }

    records.forEach((record) => {
      elements.locationList.appendChild(buildLocationRecordCard(record));
    });
  } catch {
    const records = state.gameAvailabilityReady ? buildLocationGameRecords(pokemon, []) : [];
    elements.locationSummary.textContent = records.length ? `${records.length} games` : "Offline";

    if (records.length) {
      records.forEach((record) => {
        elements.locationList.appendChild(
          buildLocationRecordCard(
            record,
            "Tracked in this Switch title, but route-level area names could not be loaded right now."
          )
        );
      });
      return;
    }

    const empty = document.createElement("p");
    empty.className = "results-summary";
    empty.textContent = "Location data could not be loaded right now.";
    elements.locationList.appendChild(empty);
  }
}

function renderCollections() {
  const profile = getActiveProfile();
  const baseEntries = getBaseEntries();
  const shinyDexEntries = getShinyDexEntries();
  const caughtBaseCount = baseEntries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
  const shinyEntryCount = shinyDexEntries.reduce((sum, entry) => sum + Number(isShiny(entry.name)), 0);
  const ownedGames = getOwnedGameIds();
  const ownedReleaseCount = getOwnedReleaseCount();
  const { clearedCount } = getOwnedSummary();
  const obtainableEntries =
    ownedGames.length && state.gameAvailabilityReady
      ? baseEntries.filter((entry) => isAvailableInOwnedCoverage(entry.baseNumber))
      : [];
  const obtainableCaughtCount = obtainableEntries.reduce(
    (sum, entry) => sum + Number(isCaught(entry.name)),
    0
  );
  const totalCaughtEntries = state.entries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
  const favoriteEntries = getFavoriteEntries();
  const bookmarkEntries = getBookmarkEntries();
  const favoriteTypeEntries = getFavoriteTypeEntries();
  const favoriteTypeCount = favoriteTypeEntries.reduce((sum, item) => sum + Number(Boolean(item.entry)), 0);
  const unobtainableEntries = getUnobtainableEntries();
  const homeEntries = getHomeBoxEntries();
  const templateBoxes = getHomeTemplateBoxes();
  const boxedCount = Object.keys(state.homeBoxes.boxedMap).length;
  const latestShinyEntry = Object.keys(state.shinyMap)
    .slice()
    .reverse()
    .map((name) => state.entriesByName.get(name))
    .find(Boolean);
  const shinyLockedEntries = state.entries
    .filter((entry) => isShinyDexLocked(entry.name))
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
  const catchSeedPool =
    ownedGames.length && state.gameAvailabilityReady
      ? baseEntries.filter((entry) => !isCaught(entry.name) && isAvailableInOwnedCoverage(entry.baseNumber))
      : baseEntries.filter((entry) => !isCaught(entry.name));
  const shinySeedPool = baseEntries.filter((entry) => !isCaught(entry.name) && !isShinyDexLocked(entry.name));

  if ((!state.randomTargets.length && catchSeedPool.length) || (!state.shinyTargets.length && shinySeedPool.length)) {
    refreshRandomTargets();
  }

  elements.collectionFocus.textContent = `${profile.name} · ${formatCount(totalCaughtEntries)} living · ${formatCount(
    shinyEntryCount
  )} shiny`;

  const mainRatio = baseEntries.length ? caughtBaseCount / baseEntries.length : 0;
  const shinyRatio = shinyDexEntries.length ? shinyEntryCount / shinyDexEntries.length : 0;
  const ownedRatio = obtainableEntries.length ? obtainableCaughtCount / obtainableEntries.length : 0;
  const activeGameId = getActiveGameId();
  const activeGame = getGameMeta(activeGameId);
  const activeTrackerState = activeGame ? state.tracker.games[activeGame.id] : null;
  const activeCheckpoint = activeGame && activeTrackerState
    ? getGameProgressCheckpoint(activeGame, activeTrackerState)
    : null;
  const activeGameChecklist = activeGame ? getGameChecklistProgress(activeGame.id) : null;
  const generationBreakdown = GENERATION_RANGES.map((range) => {
    const generationEntries = baseEntries.filter(
      (entry) => entry.baseNumber >= range.start && entry.baseNumber <= range.end
    );
    const caughtCount = generationEntries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
    const shinyEligibleEntries = generationEntries.filter((entry) => !isShinyDexLocked(entry.name));
    const shinyCount = shinyEligibleEntries.reduce((sum, entry) => sum + Number(isShiny(entry.name)), 0);

    return {
      ...range,
      total: generationEntries.length,
      caughtCount,
      caughtRatio: generationEntries.length ? caughtCount / generationEntries.length : 0,
      shinyTotal: shinyEligibleEntries.length,
      shinyCount,
      shinyRatio: shinyEligibleEntries.length ? shinyCount / shinyEligibleEntries.length : 0
    };
  });

  elements.landingWelcome.textContent = `Welcome back, ${profile.name}`;
  elements.landingSummary.textContent = state.randomTargets.length
    ? `Here’s your progress at a glance. ${state.randomTargets.length} living dex suggestions and ${state.shinyTargets.length} shiny goals are queued up for this profile.`
    : ownedReleaseCount
      ? "Your tracker is loaded. Reroll the hunt board or jump into Dex to plan the next capture."
      : "Your living form archive is online. Mark the games you own and start logging catches to build tailored hunt suggestions.";
  elements.landingProfileMetric.textContent = profile.name;
  elements.landingLivingMetric.textContent = `${formatCount(caughtBaseCount)} / ${formatCount(baseEntries.length)}`;
  elements.landingShinyMetric.textContent = `${formatCount(shinyEntryCount)} / ${formatCount(shinyDexEntries.length)}`;
  elements.landingShinyNote.textContent = latestShinyEntry
    ? `Latest: ${latestShinyEntry.displayName}`
    : "No shiny logged yet";
  elements.landingOwnedMetric.textContent = obtainableEntries.length
    ? `${formatCount(obtainableCaughtCount)} / ${formatCount(obtainableEntries.length)}`
    : ownedReleaseCount
      ? "Syncing"
      : "No games";
  elements.landingStorageMetric.textContent = `${formatCount(boxedCount)} / ${formatCount(homeEntries.length)}`;
  elements.landingStorageNote.textContent = templateBoxes.length
    ? `${formatCount(templateBoxes.length)} box templates ready`
    : "HOME organizer on standby";
  elements.landingCurrentGameName.textContent = activeGame ? activeGame.name : "No active game";
  elements.landingCurrentGameNote.textContent = activeGame && activeTrackerState && activeCheckpoint
    ? `${activeCheckpoint.currentMilestone} · ${activeGame.progressLabel}: ${activeTrackerState.progress}/${activeGame.progressMax}`
    : "Choose a tracked save to anchor your dashboard.";
  elements.landingTrainerCode.textContent = getProfileTrainerCode(profile);
  elements.landingBadgeTotal.textContent = formatCount(clearedCount);
  elements.landingPokedexTotal.textContent = activeGame
    ? activeGameChecklist?.total
      ? `${formatCount(activeGameChecklist.caughtCount)} / ${formatCount(activeGameChecklist.total)}`
      : state.gameAvailabilityReady
        ? "0 / 0"
        : "Syncing"
    : "No game";
  elements.landingOwnedReleaseTotal.textContent = formatCount(ownedReleaseCount);

  elements.mainProgressText.textContent = baseEntries.length
    ? `${formatPercent(mainRatio)} · ${formatCount(caughtBaseCount)}/${formatCount(baseEntries.length)}`
    : "0%";
  elements.shinyProgressText.textContent = shinyDexEntries.length
    ? `${formatPercent(shinyRatio)} · ${formatCount(shinyEntryCount)}/${formatCount(shinyDexEntries.length)}`
    : "0%";
  elements.ownedProgressText.textContent = obtainableEntries.length
    ? `${formatPercent(ownedRatio)} · ${formatCount(obtainableCaughtCount)}/${formatCount(obtainableEntries.length)}`
    : ownedReleaseCount
      ? "Syncing game coverage"
      : "Mark owned versions";

  setProgressBar(elements.mainProgressBar, mainRatio);
  setProgressBar(elements.shinyProgressBar, shinyRatio);
  setProgressBar(elements.ownedProgressBar, ownedRatio);

  elements.generationBreakdownSummary.textContent = `${GENERATION_RANGES.length} gens · ${formatCount(
    baseEntries.length
  )} species`;
  elements.generationBreakdownNote.textContent =
    "Base-species progress by generation. Shiny totals exclude shiny-locked species.";
  elements.generationBreakdownGrid.replaceChildren();

  generationBreakdown.forEach((record) => {
    const card = document.createElement("article");
    card.className = `generation-breakdown-entry generation-breakdown-entry--gen-${record.label}`;

    const head = document.createElement("div");
    head.className = "generation-breakdown-head";

    const title = document.createElement("strong");
    title.textContent = `Generation ${record.label}`;

    const total = document.createElement("span");
    total.textContent = `${formatCount(record.total)} species`;

    head.append(title, total);

    const livingRow = document.createElement("div");
    livingRow.className = "generation-breakdown-stat";
    const livingLabel = document.createElement("span");
    livingLabel.textContent = "Living";
    const livingValue = document.createElement("strong");
    livingValue.textContent = record.total
      ? `${formatPercent(record.caughtRatio)} · ${formatCount(record.caughtCount)}/${formatCount(record.total)}`
      : "0%";
    livingRow.append(livingLabel, livingValue);

    const livingBar = document.createElement("div");
    livingBar.className = "progress-bar generation-progress-bar";
    const livingFill = document.createElement("span");
    setProgressBar(livingFill, record.caughtRatio);
    livingBar.appendChild(livingFill);

    const shinyRow = document.createElement("div");
    shinyRow.className = "generation-breakdown-stat generation-breakdown-stat--shiny";
    const shinyLabel = document.createElement("span");
    shinyLabel.textContent = "Shiny";
    const shinyValue = document.createElement("strong");
    shinyValue.textContent = record.shinyTotal
      ? `${formatPercent(record.shinyRatio)} · ${formatCount(record.shinyCount)}/${formatCount(record.shinyTotal)}`
      : "0%";
    shinyRow.append(shinyLabel, shinyValue);

    const shinyBar = document.createElement("div");
    shinyBar.className = "progress-bar generation-progress-bar generation-progress-bar--shiny";
    const shinyFill = document.createElement("span");
    shinyFill.className = "generation-progress-fill generation-progress-fill--shiny";
    setProgressBar(shinyFill, record.shinyRatio);
    shinyBar.appendChild(shinyFill);

    card.append(head, livingRow, livingBar, shinyRow, shinyBar);
    elements.generationBreakdownGrid.appendChild(card);
  });

  ensureSuggestedBoardSelections();
  const selectedLivingTarget = getSelectedSuggestedTarget("living");
  const selectedShinyTarget = getSelectedSuggestedTarget("shiny");
  const livingSelectionMode = state.ui.landingActionMode === "living";
  const shinySelectionMode = state.ui.landingActionMode === "shiny";
  const dashboardCatchTarget = getSuggestedCatchEntry();
  const dashboardShinyTarget = getSuggestedShinyEntry();
  const currentBox = getCurrentBox();
  const nextTask = getNextTask();
  const completionGames = ownedGames.length
    ? GAME_CATALOG.filter((game) => ownedGames.includes(game.id)).slice(0, 4)
    : GAME_CATALOG.slice(0, 4);

  elements.randomTargetSummary.textContent = state.randomTargets.length
    ? `${state.randomTargets.length} living dex targets are queued up for ${profile.name}. Click a tile to inspect it, or press Catch to choose one from the board.`
    : "Everything in the base archive is already logged for this profile. Flip to a fresh profile or start a shiny push.";
  elements.landingTargetSelected.textContent = selectedLivingTarget
    ? `${selectedLivingTarget.displayName} · ${getEntryVariantLabel(selectedLivingTarget)}`
    : livingSelectionMode
      ? "Select a target or cancel"
      : "Choose a target";
  elements.landingShinyTargetSelected.textContent = selectedShinyTarget
    ? `${selectedShinyTarget.displayName} · Shiny Preview`
    : shinySelectionMode
      ? "Select a shiny target or cancel"
      : "Choose a shiny target";
  elements.landingTargetCatchButton.textContent =
    livingSelectionMode && !selectedLivingTarget ? "Cancel" : "Catch";
  elements.landingShinyLogButton.textContent =
    shinySelectionMode && !selectedShinyTarget ? "Cancel" : "Log Shiny";
  elements.landingTargetCatchButton.disabled = !state.randomTargets.length;
  elements.landingShinyLogButton.disabled = !state.shinyTargets.length;
  elements.landingCompletionRing.style.setProperty("--completion-angle", `${Math.round(mainRatio * 360)}deg`);
  elements.landingCompletionValue.textContent = formatPercent(mainRatio);
  elements.landingCompletionCount.textContent = `${formatCount(caughtBaseCount)} / ${formatCount(baseEntries.length)}`;
  renderLandingRecentCatches();
  renderLandingCompletionBreakdown(completionGames);
  renderLandingTaskList(nextTask, dashboardCatchTarget, dashboardShinyTarget, currentBox);
  renderLandingJourneyCards();
  renderLandingSuggestionBoard(nextTask, dashboardShinyTarget, currentBox);
  renderLandingSmartSuggestions(dashboardCatchTarget, dashboardShinyTarget, nextTask);

  renderSuggestedHuntBoard(elements.targetList, state.randomTargets, {
    kind: "living",
    selectedName: selectedLivingTarget?.name ?? null,
    emptyText: "No uncaught targets are left in the main dex pool for this profile."
  });

  renderSuggestedHuntBoard(elements.shinyTargetList, state.shinyTargets, {
    kind: "shiny",
    selectedName: selectedShinyTarget?.name ?? null,
    emptyText: "No bonus shiny targets are waiting right now.",
    forceShiny: true
  });

  const renderEntryList = (
    container,
    entries,
    emptyText,
    noteBuilder,
    tagBuilder = () => [],
    optionsBuilder = () => ({})
  ) => {
    container.replaceChildren();

    if (!entries.length) {
      container.appendChild(createCollectionEmptyState(emptyText));
      return;
    }

    entries.forEach((entry) => {
      container.appendChild(
        createCollectionItem(entry, noteBuilder(entry), tagBuilder(entry), optionsBuilder(entry))
      );
    });
  };

  elements.favoritesCount.textContent = formatCount(favoriteEntries.length);
  elements.favoritesSummary.textContent = favoriteEntries.length
    ? `${formatCount(favoriteEntries.length)} cosmetic favorite${favoriteEntries.length === 1 ? "" : "s"} are showcased in the Vault.`
    : "Build a cosmetic showcase of your favorite Pokémon here in the Vault.";
  elements.favoritesList.replaceChildren();
  if (!favoriteEntries.length) {
    elements.favoritesList.appendChild(createCollectionEmptyState("No favorite Pokémon selected yet."));
  } else {
    favoriteEntries.forEach((entry) => {
      elements.favoritesList.appendChild(
        createVaultManagerItem(
          createCollectionItem(
            entry,
            `${getEntryVariantLabel(entry)} · ${isCaught(entry.name) ? "Caught" : "Missing"}`,
            isShiny(entry.name) ? ["Favorite", "Shiny"] : ["Favorite"]
          ),
          [
            {
              label: "Remove",
              onClick: () => {
                setFavoriteState(entry.name, false);
                syncFavoriteDisplays();
                setStatus(`${entry.displayName} removed from favorites.`);
              }
            }
          ]
        )
      );
    });
  }

  elements.bookmarksCount.textContent = formatCount(bookmarkEntries.length);
  renderEntryList(
    elements.bookmarksList,
    bookmarkEntries,
    "Bookmark targets to keep a separate catch watchlist.",
    (entry) => `${getEntryVariantLabel(entry)} · ${isCaught(entry.name) ? "Caught" : "Watchlist"}`,
    () => ["Bookmark"]
  );

  elements.favoriteTypesCount.textContent = `${favoriteTypeCount}/${TYPE_NAMES.length}`;
  elements.favoriteTypesSummary.textContent = favoriteTypeCount
    ? `${favoriteTypeCount}/${TYPE_NAMES.length} type showcase slot${favoriteTypeCount === 1 ? "" : "s"} filled in the Vault.`
    : "Pick one showcase favorite for each type. Choose or change them from this Vault screen.";
  elements.favoriteTypesList.replaceChildren();
  favoriteTypeEntries.forEach((item) => {
    const label = titleCase(item.typeName);
    if (item.entry) {
      elements.favoriteTypesList.appendChild(
        createVaultManagerItem(
          createCollectionItem(item.entry, `${label} showcase favorite`, [label]),
          [
            {
              label: "Change",
              onClick: () => {
                openFavoritePicker("type", item.typeName);
              }
            },
            {
              label: "Clear",
              onClick: () => {
                setFavoriteTypeState(item.typeName, null);
                syncFavoriteDisplays();
                setStatus(`${label} type favorite cleared.`);
              }
            }
          ]
        )
      );
      return;
    }

    elements.favoriteTypesList.appendChild(
      createVaultManagerItem(
        createCollectionPlaceholder(label, "No showcase favorite selected yet.", [label]),
        [
          {
            label: "Choose",
            variant: "primary",
            onClick: () => {
              openFavoritePicker("type", item.typeName);
            }
          }
        ]
      )
    );
  });

  elements.unobtainableCount.textContent = state.gameAvailabilityReady
    ? formatCount(unobtainableEntries.length)
    : "Syncing";
  elements.unobtainableSummary.textContent = !ownedGames.length
    ? "Mark the game versions you own to calculate which species are unobtainable."
    : !state.gameAvailabilityReady
      ? "Switch game coverage is still syncing, so unobtainable species are temporarily on hold."
      : unobtainableEntries.length
        ? `These base species are outside the dex support of your currently owned game versions.`
        : "Everything in the current owned-version pool is obtainable somewhere in your library.";
  renderEntryList(
    elements.unobtainableList,
    unobtainableEntries,
    ownedGames.length
      ? "No unobtainable species found across your owned versions."
      : "Owned-version tracking will unlock this list.",
    (entry) => `${entry.baseDisplayName} is missing from your owned-version coverage`,
    () => ["Unavailable"]
  );

  elements.shinyLockedCount.textContent = formatCount(shinyLockedEntries.length);
  elements.shinyLockedSummary.textContent = shinyLockedEntries.length
    ? "These entries are excluded from shiny dex tracking because they do not have a legitimate shiny release right now."
    : "No shiny-locked entries are currently defined in this archive build.";
  renderEntryList(
    elements.shinyLockedList,
    shinyLockedEntries,
    "No shiny-locked entries are currently defined.",
    (entry) => `${getEntryVariantLabel(entry)} · Excluded from shiny dex tracking`,
    () => ["Shiny Locked"]
  );
}

function renderTrainerVault() {
  const profile = getActiveProfile();
  const profileCount = state.profileMeta.profiles.length;

  elements.profilePill.textContent = profile.name;
  elements.sessionButton.textContent = getSessionButtonLabel();
  elements.profileCount.textContent = `${profileCount} profile${profileCount === 1 ? "" : "s"}`;
  elements.profileSelect.replaceChildren();

  state.profileMeta.profiles.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    option.selected = item.id === profile.id;
    elements.profileSelect.appendChild(option);
  });

  elements.notebookStatus.textContent = state.notebook.trim() ? "Autosaved locally" : "Notebook ready";
  if (elements.trainerNotebook.value !== state.notebook) {
    elements.trainerNotebook.value = state.notebook;
  }

  elements.companionStatus.textContent = state.currentPokemon
    ? `${state.currentPokemon.displayName} context active`
    : getOwnedReleaseCount()
      ? `${getOwnedReleaseCount()} releases tracked`
      : "Offline Helper";
  elements.companionAnswer.textContent =
    state.companionReply ||
    "Ask a question and PokéPilot will answer from your current archive, trackers, and Pokémon data.";

  renderCloudAccountCard();
  renderFavoritePicker();
}

function findEvolutionTrail(node, speciesName, trail = []) {
  const nextTrail = [...trail, node];
  if (node.species.name === speciesName) {
    return nextTrail;
  }

  for (const nextNode of node.evolves_to) {
    const result = findEvolutionTrail(nextNode, speciesName, nextTrail);
    if (result) {
      return result;
    }
  }

  return null;
}

async function buildEvolutionAnswer(pokemon) {
  if (!pokemon?.evolutionChainUrl) {
    return `${pokemon.displayName} does not expose an evolution chain in the current archive feed.`;
  }

  const chain = await loadEvolutionChain(pokemon.evolutionChainUrl);
  const trail = findEvolutionTrail(chain.chain, pokemon.speciesName);

  if (!trail?.length) {
    return `I could not trace ${pokemon.displayName} inside its evolution chain.`;
  }

  const currentNode = trail[trail.length - 1];
  const previousNode = trail[trail.length - 2] ?? null;
  const arriveText = currentNode.evolution_details?.length
    ? currentNode.evolution_details.map(describeEvolutionCondition).join(" or ")
    : "It is the base stage.";
  const nextText = currentNode.evolves_to.length
    ? currentNode.evolves_to
        .map((node) => {
          const conditions = node.evolution_details?.length
            ? node.evolution_details.map(describeEvolutionCondition).join(" or ")
            : "standard progression";
          return `${titleCase(node.species.name)} via ${conditions}`;
        })
        .join(" · ")
    : "No later evolution is listed.";

  return `${
    previousNode ? `${titleCase(previousNode.species.name)} leads into ${pokemon.displayName}.` : `${pokemon.displayName} starts the line.`
  } To reach it: ${arriveText} Next stage intel: ${nextText}`;
}

async function buildLocationAnswer(pokemon) {
  const locations = pokemon?.encounterUrl ? await loadLocationEntries(pokemon.encounterUrl) : [];
  const records = buildLocationGameRecords(pokemon, locations);
  const activeGameId = getActiveGameId();
  const activeRecord = activeGameId !== "none" ? records.find((record) => record.id === activeGameId) ?? null : null;
  const activeSurface = activeRecord ? getActiveLocationSurfaceRecord(activeRecord) : null;

  if (activeRecord?.areas.length) {
    const highlightedRegions = activeSurface?.highlightedRegions ?? [];
    const mapNote = highlightedRegions.length
      ? ` Coverage regions: ${highlightedRegions.map((region) => region.label).join(" · ")}.`
      : "";
    return `${pokemon.displayName} has ${activeRecord.areas.length} tracked ${activeRecord.shortName} locations. First hits: ${activeRecord.areas.slice(0, 4).join(" · ")}.${mapNote}`;
  }

  if (activeRecord) {
    const highlightedRegions = activeSurface?.highlightedRegions ?? [];
    if (highlightedRegions.length) {
      const surfaceLabel = activeSurface?.label ? ` on the ${activeSurface.label} surface` : "";
      return `${pokemon.displayName} is confirmed in ${activeRecord.shortName}${surfaceLabel}. Exact route locations are not attached yet, so the coverage narrows to ${highlightedRegions
        .map((region) => region.label)
        .join(" · ")}.`;
    }
    return `${pokemon.displayName} is tracked in ${activeRecord.shortName}, but route-level area names are not attached for that title in the current archive yet.`;
  }

  if (!records.length) {
    return pokemon?.encounterUrl
      ? `${pokemon.displayName} has no Switch route cards or game-coverage records attached in the current location archive.`
      : `${pokemon.displayName} does not expose route-level encounter data in the current archive yet.`;
  }

  const routedRecord = records.find((record) => record.areas.length);
  if (routedRecord) {
    const gameList = records.map((record) => record.shortName).join(", ");
    const routedSurface = getActiveLocationSurfaceRecord(routedRecord);
    const highlightedRegions = routedSurface?.highlightedRegions ?? [];
    const mapNote = highlightedRegions.length
      ? ` The ${routedRecord.shortName} coverage narrows to ${highlightedRegions
          .map((region) => region.label)
          .join(" · ")}.`
      : "";
    return `${pokemon.displayName} is tracked in ${gameList}. Route intel is attached for ${routedRecord.shortName}; first hits: ${routedRecord.areas.slice(0, 4).join(" · ")}.${mapNote}`;
  }

  return `${pokemon.displayName} is tracked in these Switch games: ${records.map((record) => record.shortName).join(", ")}. The current archive does not have route-level area names attached yet.`;
}

async function answerCompanionQuestion(question) {
  const normalized = normalizeSearch(question);
  const pokemon = state.currentPokemon;

  if (!normalized) {
    return "Ask about a Pokémon, your tracked games, shiny plans, evolutions, or what to do next.";
  }

  if (/(what.*do next|next task|next step|what should i do)/.test(normalized)) {
    return getNextTask().detail;
  }

  if (/(what.*catch|catch next|missing target|hunt next)/.test(normalized)) {
    const target = getSuggestedCatchEntry();
    return target
      ? `${target.displayName} is the cleanest next catch from your current archive stack.`
      : "Everything visible in the active archive stack is already marked caught.";
  }

  if (/(what.*shiny|shiny next|shiny target)/.test(normalized)) {
    const target = getSuggestedShinyEntry();
    return target
      ? `${target.displayName} is your best next shiny follow-up from the current save data.`
      : "No shiny follow-up is ready yet. Catch more Pokémon or log a current target first.";
  }

  if (/(owned game|what games do i own|my games|tracked games)/.test(normalized)) {
    const owned = getOwnedReleaseRecords().map((record) => record.label);
    return owned.length
      ? `You currently marked these Switch releases as owned: ${owned.join(", ")}.`
      : "No Switch releases are marked as owned yet in the playthrough tracker.";
  }

  if (/(unobtainable|cannot obtain|can.t get)/.test(normalized)) {
    const unobtainable = getUnobtainableEntries();
    return !getOwnedGameIds().length
      ? "Mark the game versions you own first, then I can calculate the unobtainable pool."
      : !state.gameAvailabilityReady
        ? "Game coverage is still syncing, so the unobtainable pool is not ready yet."
        : unobtainable.length
          ? `${formatCount(unobtainable.length)} base species are unobtainable in your current owned-version library. First few: ${unobtainable.slice(0, 6).map((entry) => entry.displayName).join(", ")}.`
          : "Everything is obtainable somewhere in the game versions you currently marked as owned.";
  }

  if (/(favorite type|fav of each type|type favorite)/.test(normalized)) {
    const chosen = getFavoriteTypeEntries().filter((entry) => entry.entry);
    return chosen.length
      ? `You have ${chosen.length} type favorites set. First few: ${chosen.slice(0, 6).map((entry) => `${titleCase(entry.typeName)} = ${entry.entry.displayName}`).join(" · ")}.`
      : "No type favorites are set yet. Open the Vault and choose them from the type-favorite manager.";
  }

  if (/(favorite|favourite)/.test(normalized) && !/(type favorite|fav of each type)/.test(normalized)) {
    const favorites = Object.keys(state.favoritesMap);
    return favorites.length
      ? `You have ${favorites.length} favorite Pokémon saved.`
      : "No Pokémon are favorited yet.";
  }

  if (/(bookmark|watchlist)/.test(normalized)) {
    const bookmarks = Object.keys(state.bookmarksMap);
    return bookmarks.length
      ? `You have ${bookmarks.length} bookmarked Pokémon in the catch watchlist.`
      : "No Pokémon are bookmarked yet.";
  }

  if (/(home box|box organizer|boxes)/.test(normalized)) {
    const box = getCurrentBox();
    const targetCount = getHomeBoxTargetCount(box);
    return box
      ? `${box.name} follows ${getHomeBoxRangeLabel(box)} and has ${getFilledBoxCount(box)}/${targetCount} targets marked boxed in HOME.`
      : "The HOME living-form template is still syncing.";
  }

  if (/(checklist link|linked checklist|unlink)/.test(normalized)) {
    const linkedCount = GAME_CATALOG.reduce(
      (sum, game) => sum + Number(state.gameChecklistState.links[game.id]),
      0
    );
    return `${linkedCount}/${GAME_CATALOG.length} game checklists are linked to the main dex right now.`;
  }

  if (!pokemon) {
    return "Open a Pokémon entry first if you want species-specific help like evolutions, routes, or shiny methods.";
  }

  if (/(how evolve|evolve|pre evolution|post evolution|evolution)/.test(normalized)) {
    return buildEvolutionAnswer(pokemon);
  }

  if (/(where find|where catch|location|route|map)/.test(normalized)) {
    return buildLocationAnswer(pokemon);
  }

  if (/(shiny method|shiny hunt|best shiny)/.test(normalized)) {
    const activeGameId = getActiveGameId();
    const gameIds = activeGameId !== "none" ? [activeGameId] : GAME_CATALOG.map((game) => game.id);
    const routes = gameIds
      .map((gameId) => `${getGameMeta(gameId)?.shortName}: ${getShinyPlan(gameId, pokemon).method}`)
      .join(" · ");
    return `${pokemon.displayName} shiny routes: ${routes}.`;
  }

  if (/(what game|which game|available in)/.test(normalized)) {
    const availableGames = GAME_CATALOG.filter((game) => isAvailableInGame(pokemon.baseNumber, game.id)).map(
      (game) => game.shortName
    );
    return availableGames.length
      ? `${pokemon.displayName} is tracked in these Switch games: ${availableGames.join(", ")}.`
      : `I do not have Switch-game dex coverage attached for ${pokemon.displayName} right now.`;
  }

  return `${pokemon.displayName} is open now. I can help with its evolution line, shiny methods, location intel, Switch game availability, your favorites, or your next task.`;
}

function renderHomeOrganizer() {
  const homeBoxEntries = getHomeBoxEntries();
  const homeExcludedEntries = getHomeExcludedEntries();
  const templateBoxes = getHomeTemplateBoxes();
  const selectedBoxIndex = getSelectedHomeBoxIndex(templateBoxes);
  if (selectedBoxIndex !== state.homeBoxes.selectedBox) {
    state.homeBoxes.selectedBox = selectedBoxIndex;
    saveHomeBoxesState();
  }

  const currentBox = templateBoxes[selectedBoxIndex] ?? null;
  const filledCount = currentBox ? getFilledBoxCount(currentBox) : 0;
  const caughtCount = currentBox ? getHomeBoxCaughtCount(currentBox) : 0;
  const targetCount = currentBox ? getHomeBoxTargetCount(currentBox) : 0;
  const spareCount = Math.max(0, 30 - targetCount);
  const linkedCount = GAME_CATALOG.reduce(
    (sum, game) => sum + Number(state.gameChecklistState.links[game.id]),
    0
  );

  elements.clearBoxButton.textContent = "Clear Box Marks";
  elements.homeFocus.textContent = currentBox
    ? `${currentBox.name} · ${getHomeBoxRangeLabel(currentBox)}`
    : "HOME Template";

  if (!state.entries.length) {
    elements.homeBoxSummary.textContent = "Syncing the HOME living-form template from the archive.";
  } else if (!homeBoxEntries.length) {
    elements.homeBoxSummary.textContent =
      "No HOME-boxable entries are available in the current archive, so the organizer is on standby.";
  } else if (!currentBox || !targetCount) {
    elements.homeBoxSummary.textContent = "This HOME box is waiting for living-dex targets to load.";
  } else {
    const spareText = spareCount
      ? ` ${spareCount} spare slot${spareCount === 1 ? "" : "s"} remain open in this box.`
      : "";
    const excludedText = homeExcludedEntries.length
      ? ` ${formatCount(homeExcludedEntries.length)} non-boxable or unsupported forms are parked below.`
      : "";
    elements.homeBoxSummary.textContent =
      `${currentBox.name} covers ${getHomeBoxRangeLabel(currentBox)} (${getHomeBoxSpanLabel(currentBox)}). ` +
      `${filledCount}/${targetCount} marked boxed in HOME, ${caughtCount}/${targetCount} caught in your dex.` +
      `${spareText}${excludedText} Click a slot to mark or unmark that target as boxed in HOME. Use Archive or Scan when you want the full Pokemon page while organizing.`;
  }

  elements.clearBoxButton.disabled = !currentBox || filledCount === 0;
  elements.gameChecklistSummary.textContent = `${linkedCount}/${GAME_CATALOG.length} linked to main dex`;
  elements.homeExcludedCount.textContent = !state.entries.length
    ? "Syncing"
    : `${formatCount(homeExcludedEntries.length)} parked`;
  elements.homeExcludedToggleButton.disabled = !state.entries.length;
  elements.homeExcludedToggleButton.textContent = state.ui.homeExcludedVisible
    ? "Hide Section"
    : "Show Section";
  elements.homeExcludedToggleButton.setAttribute("aria-expanded", String(state.ui.homeExcludedVisible));
  elements.homeExcludedSummary.textContent = !state.entries.length
    ? "HOME compatibility data is syncing with the archive."
    : homeExcludedEntries.length
      ? "These forms stay outside the HOME box template because HOME auto-registers them in the dex, strips the form on deposit, or does not treat them as separate stored forms."
      : "Every current entry can live directly inside the HOME organizer.";
  elements.homeExcludedList.classList.toggle("hidden", !state.ui.homeExcludedVisible);
  elements.homeExcludedList.replaceChildren();
  if (homeExcludedEntries.length) {
    homeExcludedEntries.forEach((entry) => {
      elements.homeExcludedList.appendChild(
        createCollectionItem(
          entry,
          entry.homeBoxReason,
          [entry.homeBoxTag, ...(entry.parkedOnly ? ["Parked"] : [])],
          { interactive: !entry.parkedOnly }
        )
      );
    });
  } else {
    elements.homeExcludedList.appendChild(
      createCollectionEmptyState("No excluded forms are parked outside the HOME organizer right now.")
    );
  }

  elements.homeBoxTabs.replaceChildren();
  templateBoxes.forEach((box, index) => {
    const boxTargets = getHomeBoxTargetCount(box);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-button box-tab";
    button.classList.toggle("active", index === selectedBoxIndex);
    button.textContent = boxTargets
      ? `${box.name} · ${getFilledBoxCount(box)}/${boxTargets}`
      : `${box.name} · --`;
    button.title = boxTargets ? `${getHomeBoxRangeLabel(box)} · ${getHomeBoxSpanLabel(box)}` : "Loading template";
    button.addEventListener("click", () => {
      state.homeBoxes.selectedBox = index;
      saveHomeBoxesState();
      renderHomeOrganizer();
    });
    elements.homeBoxTabs.appendChild(button);
  });

  elements.homeBoxGrid.replaceChildren();
  if (currentBox) {
    currentBox.slots.forEach((entry, index) => {
      const slot = document.createElement("button");
      slot.type = "button";
      slot.className = "home-slot";

      const number = document.createElement("span");
      number.className = "home-slot-number";
      number.textContent = String(index + 1).padStart(2, "0");
      slot.appendChild(number);

      if (entry) {
        const boxed = isBoxedInHome(entry.name);
        const caught = isCaught(entry.name);
        slot.classList.toggle("boxed", boxed);
        slot.classList.toggle("caught", caught && !boxed);
        slot.classList.toggle("missing", !caught && !boxed);
        slot.classList.toggle("active", state.currentPokemon?.name === entry.name);

        const sprite = document.createElement("img");
        sprite.className = "home-slot-sprite";
        sprite.loading = "lazy";
        sprite.decoding = "async";
        applyEntrySprite(sprite, entry);

        const label = document.createElement("span");
        label.className = "home-slot-label";
        label.textContent = entry.displayName;

        const dex = document.createElement("span");
        dex.className = "home-slot-dex";
        dex.textContent = `#${formatNumber(entry.baseNumber)}`;

        const variant = document.createElement("span");
        variant.className = "home-slot-variant";
        variant.textContent = getEntryVariantLabel(entry);

        const status = document.createElement("span");
        status.className = "home-slot-status";
        status.textContent = boxed ? "Boxed" : caught ? "Caught" : "Missing";

        slot.append(sprite, label, dex, variant, status);
      } else {
        slot.classList.add("is-empty");

        const status = document.createElement("span");
        status.className = "home-slot-status";
        status.textContent = "Spare";

        const placeholder = document.createElement("span");
        placeholder.className = "home-slot-label";
        placeholder.textContent = "Unused";

        const note = document.createElement("span");
        note.className = "home-slot-dex";
        note.textContent = "No assigned target";

        slot.append(status, placeholder, note);
      }

      slot.addEventListener("click", () => {
        if (!entry) {
          return;
        }

        const nextValue = !isBoxedInHome(entry.name);
        setHomeBoxedState(entry.name, nextValue);
        renderHomeOrganizer();
        setStatus(`${entry.displayName} ${nextValue ? "marked boxed in" : "removed from"} ${currentBox.name}.`);
      });

      elements.homeBoxGrid.appendChild(slot);
    });
  }

  elements.gameChecklistGrid.replaceChildren();
  GAME_CATALOG.forEach((game) => {
    const progress = getGameChecklistProgress(game.id);
    const card = document.createElement("article");
    card.className = `checklist-card checklist-card--${game.id}`;

    const head = document.createElement("div");
    head.className = "tracker-card-head";

    const titleBlock = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = game.shortName;
    const subtitle = document.createElement("span");
    subtitle.textContent = game.name;
    titleBlock.append(title, subtitle);

    const linkButton = document.createElement("button");
    linkButton.type = "button";
    linkButton.className = "ghost-button tracker-focus-button";
    linkButton.textContent = state.gameChecklistState.links[game.id] ? "Linked" : "Separate";
    linkButton.addEventListener("click", () => {
      state.gameChecklistState.links[game.id] = !state.gameChecklistState.links[game.id];
      saveGameChecklistState();
      renderHomeOrganizer();
      renderCollections();
    });

    head.append(titleBlock, linkButton);

    const summary = document.createElement("p");
    summary.className = "results-summary";
    summary.textContent = !state.gameAvailabilityReady
      ? "Switch game dex coverage is still syncing."
      : `${formatCount(progress.caughtCount)}/${formatCount(progress.total)} species logged in this game checklist.`;

    const progressCard = document.createElement("article");
    progressCard.className = "progress-card checklist-progress";

    const progressHead = document.createElement("div");
    progressHead.className = "progress-head";
    const left = document.createElement("strong");
    left.textContent = state.gameChecklistState.links[game.id] ? "Main Dex Mirror" : "Separate Sheet";
    const right = document.createElement("span");
    right.textContent = progress.total ? formatPercent(progress.ratio) : "0%";
    progressHead.append(left, right);

    const bar = document.createElement("div");
    bar.className = "progress-bar";
    const fill = document.createElement("span");
    setProgressBar(fill, progress.ratio);
    bar.appendChild(fill);
    progressCard.append(progressHead, bar);

    card.append(head, summary, progressCard);

    if (state.currentPokemon) {
      const baseEntry =
        state.entriesByName.get(state.currentPokemon.basePokemonName) ??
        getBaseEntries().find((entry) => entry.baseNumber === state.currentPokemon.baseNumber) ??
        null;
      const available = state.gameAvailabilityReady
        ? isAvailableInGame(state.currentPokemon.baseNumber, game.id)
        : false;
      const action = document.createElement("button");
      action.type = "button";
      action.className = "ghost-button checklist-action";

      if (!baseEntry) {
        action.disabled = true;
        action.textContent = "Unavailable";
      } else if (!state.gameAvailabilityReady) {
        action.disabled = true;
        action.textContent = "Syncing Coverage";
      } else if (!available) {
        action.disabled = true;
        action.textContent = `Not in ${game.shortName}`;
      } else {
        const tracked = getGameChecklistCaughtState(game.id, baseEntry.name);
        action.textContent = tracked ? `Unmark ${baseEntry.displayName}` : `Mark ${baseEntry.displayName}`;
        action.addEventListener("click", () => {
          setGameChecklistCaughtState(game.id, baseEntry.name, !tracked);
          renderHomeOrganizer();
          renderCollections();
          refreshResults();
          if (state.currentPokemon) {
            renderCurrentPokemon(state.currentPokemon);
          }
          setStatus(
            `${baseEntry.displayName} ${tracked ? "removed from" : "logged in"} the ${game.shortName} checklist.`
          );
        });
      }

      card.appendChild(action);
    }

    elements.gameChecklistGrid.appendChild(card);
  });
}

function renderModuleQueue() {
  elements.moduleGrid.replaceChildren();

  MODULE_CATALOG.forEach((module) => {
    const card = document.createElement("article");
    card.className = "module-card";

    const status = document.createElement("span");
    status.className = `module-status ${module.status.toLowerCase().replace(/\s+/g, "-")}`;
    status.textContent = module.status;

    const title = document.createElement("strong");
    title.textContent = module.title;

    const summary = document.createElement("p");
    summary.className = "results-summary";
    summary.textContent = module.summary;

    card.append(status, title, summary);
    elements.moduleGrid.appendChild(card);
  });
}

function preserveViewportScroll(callback) {
  const previousX = window.scrollX;
  const previousY = window.scrollY;

  const restore = () => {
    if (window.scrollX !== previousX || window.scrollY !== previousY) {
      window.scrollTo(previousX, previousY);
    }
  };

  callback();

  restore();

  window.requestAnimationFrame(() => {
    restore();
    window.requestAnimationFrame(restore);
  });
}

function setActiveGame(gameId) {
  preserveViewportScroll(() => {
    state.tracker.activeGame = gameId;
    state.expPlan.gameId = gameId;
    saveTrackerState();
    saveExpPlanState();
    renderTracker();
    renderExpGameOptions();
    renderCollections();
    renderHomeOrganizer();
    renderShinyHelper();
    renderSuggestors();
    renderTrainerVault();
    if (state.currentPokemon) {
      renderCurrentPokemon(state.currentPokemon);
    }
    void renderExpPlanner();
  });
}

function syncTrackerOwnershipSelection(game, trackerState) {
  syncTrackerGameOwnedState(game, trackerState);

  if (!trackerState.owned && state.tracker.activeGame === game.id) {
    state.tracker.activeGame = "none";
  } else if (trackerState.owned && state.tracker.activeGame === "none") {
    state.tracker.activeGame = game.id;
  }
}

function refreshTrackerConnectedViews() {
  preserveViewportScroll(() => {
    saveTrackerState();
    renderTracker();
    renderCollections();
    renderHomeOrganizer();
    renderShinyHelper();
    renderSuggestors();
    renderExpGameOptions();
    renderTrainerVault();
    if (state.currentPokemon) {
      renderCurrentPokemon(state.currentPokemon);
    }
    void renderExpPlanner();
  });
}

function getJourneyDisplayTitle(gameId) {
  return getJourneyConfig(gameId)?.title ?? getGameMeta(gameId)?.name ?? "Journey";
}

function getRepresentativeBaseEntry(baseNumber) {
  const entries = getEntriesForBaseNumber(baseNumber);
  return entries.find((entry) => !entry.isForm) ?? entries[0] ?? null;
}

function getJourneyLegendaryEntries(gameId) {
  const config = getJourneyConfig(gameId);
  if (!config) {
    return [];
  }

  return (config.legendarySpecies ?? [])
    .map((baseNumber) => getRepresentativeBaseEntry(baseNumber))
    .filter(Boolean)
    .map((entry) => ({ entry, caught: isCaught(entry.name) }));
}

function getJourneyVersionExclusiveRecords(gameId) {
  const game = getGameMeta(gameId);
  const trackerState = state.tracker.games[gameId];
  if (!game || !trackerState) {
    return { selectedVersions: [], unownedVersions: [], missingEntries: [], missingCount: 0, mode: "none" };
  }

  if (!gameHasSeparateVersions(game)) {
    return { selectedVersions: [], unownedVersions: [], missingEntries: [], missingCount: 0, mode: "single" };
  }

  const versions = getGameVersions(game);
  const selectedVersions = versions.filter((version) => Boolean(trackerState.versions?.[version.id]));
  if (!selectedVersions.length) {
    return { selectedVersions, unownedVersions: versions, missingEntries: [], missingCount: 0, mode: "select" };
  }

  const unownedVersions = versions.filter((version) => !trackerState.versions?.[version.id]);
  if (!unownedVersions.length) {
    return { selectedVersions, unownedVersions, missingEntries: [], missingCount: 0, mode: "covered" };
  }

  const versionMap = GAME_VERSION_EXCLUSIVE_SETS[gameId] ?? {};
  const exclusiveNumbers = new Set();
  unownedVersions.forEach((version) => {
    versionMap[version.id]?.forEach((baseNumber) => exclusiveNumbers.add(baseNumber));
  });

  const missingEntries = [...exclusiveNumbers]
    .sort((left, right) => left - right)
    .map((baseNumber) => getRepresentativeBaseEntry(baseNumber))
    .filter(Boolean)
    .filter((entry) => !isCaught(entry.name));

  return {
    selectedVersions,
    unownedVersions,
    missingEntries,
    missingCount: missingEntries.length,
    mode: "missing"
  };
}

function getJourneyFocusSuggestion(gameId) {
  const game = getGameMeta(gameId);
  const trackerState = state.tracker.games[gameId];
  const config = getJourneyConfig(gameId);
  if (!game || !trackerState || !config) {
    return {
      title: "Select a tracked game",
      detail: "Choose a game from the Journey screen and PokéPilot will surface your next checkpoint automatically.",
      short: "Set up Journey"
    };
  }

  const firstStory = (config.story ?? []).find((item) => !trackerState.journeyChecks?.[item.id]);
  if (firstStory) {
    return {
      title: "Main Story",
      detail: `${getJourneyDisplayTitle(gameId)} still has a core story checkpoint open: ${firstStory.label}.`,
      short: firstStory.label
    };
  }

  for (const column of config.columns ?? []) {
    const nextColumnItem = (column.items ?? []).find((item) => !trackerState.journeyChecks?.[item.id]);
    if (nextColumnItem) {
      return {
        title: column.title,
        detail: `The next progression mark in ${column.title} is ${nextColumnItem.label}.`,
        short: nextColumnItem.label
      };
    }
  }

  const nextPostgame = (config.postgame ?? []).find((item) => !trackerState.journeyChecks?.[item.id]);
  if (nextPostgame) {
    return {
      title: "Postgame",
      detail: `Your next postgame objective is ${nextPostgame.label}.`,
      short: nextPostgame.label
    };
  }

  const nextDlc = (config.dlc ?? []).find((item) => !trackerState.journeyChecks?.[item.id]);
  if (nextDlc) {
    return {
      title: "DLC",
      detail: `There is still DLC progress waiting: ${nextDlc.label}.`,
      short: nextDlc.label
    };
  }

  const exclusives = getJourneyVersionExclusiveRecords(gameId);
  if (exclusives.mode === "missing" && exclusives.missingEntries.length) {
    return {
      title: "Version Exclusives",
      detail: `${exclusives.missingEntries[0].displayName} is still locked to ${
        exclusives.unownedVersions[0]?.label ?? "the other version"
      } in your current setup.`,
      short: `Need ${exclusives.missingEntries[0].displayName}`
    };
  }

  const nextLegendary = getJourneyLegendaryEntries(gameId).find((record) => !record.caught);
  if (nextLegendary) {
    return {
      title: "Legendary Hunt",
      detail: `${nextLegendary.entry.displayName} is still open in your ${getJourneyDisplayTitle(gameId)} legendary board.`,
      short: `Catch ${nextLegendary.entry.displayName}`
    };
  }

  return {
    title: "Journey Complete",
    detail: `${getJourneyDisplayTitle(gameId)} has every tracked journey objective cleared right now.`,
    short: "All tracked objectives clear"
  };
}

function createJourneyToggle(game, trackerState, item) {
  const label = document.createElement("label");
  label.className = "journey-check";
  label.classList.toggle("checked", Boolean(trackerState.journeyChecks?.[item.id]));

  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = Boolean(trackerState.journeyChecks?.[item.id]);
  input.addEventListener("change", () => {
    trackerState.journeyChecks[item.id] = input.checked;
    syncJourneyDerivedTrackerState(game, trackerState);
    refreshTrackerConnectedViews();
  });

  const text = document.createElement("span");
  text.textContent = item.label;
  label.append(input, text);
  return label;
}

function scrollJourneyPanelIntoView() {
  window.requestAnimationFrame(() => {
    elements.journeyShell.closest(".tracker-panel-shell")?.scrollIntoView({ block: "start" });
  });
}

function createJourneySelectCard(game) {
  const trackerState = state.tracker.games[game.id];
  const config = getJourneyConfig(game.id);
  const progress = getGameChecklistProgress(game.id);
  const focus = getJourneyFocusSuggestion(game.id);
  const selectedVersionCount = getGameVersions(game).reduce(
    (sum, version) => sum + Number(Boolean(trackerState.versions?.[version.id])),
    0
  );

  const button = document.createElement("button");
  button.type = "button";
  button.className = "journey-select-card";
  button.addEventListener("click", () => {
    state.ui.journeySelectedGame = game.id;
    state.tracker.activeGame = game.id;
    saveUiSessionState();
    saveTrackerState();
    renderTracker();
    renderCollections();
    renderSuggestors();
    scrollJourneyPanelIntoView();
  });

  const top = document.createElement("div");
  top.className = "journey-select-top";

  const titleBlock = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = config?.title ?? game.name;
  const subtitle = document.createElement("span");
  subtitle.textContent = config?.subtitle ?? "Open this game page";
  titleBlock.append(title, subtitle);

  const badge = document.createElement("span");
  badge.className = "journey-select-badge";
  badge.textContent = trackerState.owned ? "Tracked" : "Untracked";
  top.append(titleBlock, badge);

  const meta = document.createElement("div");
  meta.className = "journey-select-meta";
  const releases = document.createElement("span");
  releases.textContent = gameHasSeparateVersions(game)
    ? `${selectedVersionCount}/${getGameVersions(game).length} versions selected`
    : trackerState.owned
      ? "Owned"
      : "Not marked owned";
  const dex = document.createElement("span");
  dex.textContent = progress.total
    ? `Dex ${formatCount(progress.caughtCount)}/${formatCount(progress.total)}`
    : state.gameAvailabilityReady
      ? "Dex 0/0"
      : "Dex syncing";
  meta.append(releases, dex);

  const focusCard = document.createElement("div");
  focusCard.className = "journey-select-focus";
  const focusLabel = document.createElement("small");
  focusLabel.textContent = "Current Focus";
  const focusText = document.createElement("strong");
  focusText.textContent = focus.short;
  const focusDetail = document.createElement("span");
  focusDetail.textContent = focus.detail;
  focusCard.append(focusLabel, focusText, focusDetail);

  button.append(top, meta, focusCard);
  return button;
}

function renderTracker() {
  const { ownedCount, clearedCount } = getOwnedSummary();
  const selectedGameId = state.ui.journeySelectedGame;
  const selectedGame = selectedGameId ? getGameMeta(selectedGameId) : null;
  elements.trackerSummary.textContent = selectedGame
    ? getJourneyDisplayTitle(selectedGame.id)
    : ownedCount === 0
      ? "Choose a game"
      : `${ownedCount} owned releases · ${clearedCount} cleared`;
  elements.journeyShell.replaceChildren();

  if (!selectedGame) {
    const selectShell = document.createElement("div");
    selectShell.className = "journey-select-shell";

    const intro = document.createElement("div");
    intro.className = "journey-intro-card";
    const introTitle = document.createElement("strong");
    introTitle.textContent = "Select a game";
    const introText = document.createElement("p");
    introText.textContent =
      "Open a dedicated game page to track story progress, badge or trial milestones, Pokédex completion, legendaries, postgame cleanup, DLC, and version exclusives.";
    intro.append(introTitle, introText);

    const grid = document.createElement("div");
    grid.className = "journey-select-grid";
    GAME_CATALOG.forEach((game) => {
      grid.appendChild(createJourneySelectCard(game));
    });

    selectShell.append(intro, grid);
    elements.journeyShell.appendChild(selectShell);
    return;
  }

  const trackerState = state.tracker.games[selectedGame.id];
  const config = getJourneyConfig(selectedGame.id);
  const progress = getGameChecklistProgress(selectedGame.id);
  const focus = getJourneyFocusSuggestion(selectedGame.id);
  const legendaryEntries = getJourneyLegendaryEntries(selectedGame.id);
  const legendaryCaught = legendaryEntries.reduce((sum, record) => sum + Number(record.caught), 0);
  const versionRecords = getJourneyVersionExclusiveRecords(selectedGame.id);
  const detailShell = document.createElement("div");
  detailShell.className = "journey-detail-shell";

  const hero = document.createElement("div");
  hero.className = "journey-detail-hero";

  const backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "ghost-button journey-back-button";
  backButton.textContent = "←";
  backButton.setAttribute("aria-label", "Back to game select");
  backButton.addEventListener("click", () => {
    state.ui.journeySelectedGame = null;
    saveUiSessionState();
    renderTracker();
    scrollJourneyPanelIntoView();
  });

  const heroCopy = document.createElement("div");
  heroCopy.className = "journey-detail-copy";
  const title = document.createElement("strong");
  title.textContent = config?.title ?? selectedGame.name;
  const subtitle = document.createElement("span");
  subtitle.textContent = config?.subtitle ?? "Journey tracker";
  heroCopy.append(title, subtitle);

  const heroPill = document.createElement("span");
  heroPill.className = "journey-detail-badge";
  heroPill.textContent = trackerState.owned ? "Tracked Save" : "Set Up Save";
  hero.append(backButton, heroCopy, heroPill);

  const metaGrid = document.createElement("div");
  metaGrid.className = "journey-meta-grid";

  const hoursField = document.createElement("label");
  hoursField.className = "select-shell compact-field journey-meta-field";
  const hoursLabel = document.createElement("span");
  hoursLabel.textContent = "Gameplay Hours";
  const hoursInput = document.createElement("input");
  hoursInput.type = "text";
  hoursInput.placeholder = "Example: 42h 18m";
  hoursInput.value = trackerState.hours;
  hoursInput.addEventListener("input", () => {
    trackerState.hours = hoursInput.value;
    saveTrackerState();
  });
  hoursField.append(hoursLabel, hoursInput);

  const trainerIdField = document.createElement("label");
  trainerIdField.className = "select-shell compact-field journey-meta-field";
  const trainerIdLabel = document.createElement("span");
  trainerIdLabel.textContent = "Trainer ID";
  const trainerIdInput = document.createElement("input");
  trainerIdInput.type = "text";
  trainerIdInput.placeholder = "Example: 1637";
  trainerIdInput.value = trackerState.trainerId;
  trainerIdInput.addEventListener("input", () => {
    trackerState.trainerId = trainerIdInput.value;
    saveTrackerState();
  });
  trainerIdField.append(trainerIdLabel, trainerIdInput);

  const activeField = document.createElement("div");
  activeField.className = "journey-inline-card journey-inline-card--status";
  const activeHead = document.createElement("div");
  activeHead.className = "journey-inline-head";
  const activeTitle = document.createElement("strong");
  activeTitle.textContent = "File Status";
  const activeButton = document.createElement("button");
  activeButton.type = "button";
  activeButton.className = "ghost-button tracker-focus-button";
  activeButton.textContent = state.tracker.activeGame === selectedGame.id ? "Active" : "Set Active";
  activeButton.disabled = !trackerState.owned;
  activeButton.addEventListener("click", () => {
    setActiveGame(selectedGame.id);
  });
  activeHead.append(activeTitle, activeButton);
  const activeText = document.createElement("p");
  activeText.className = "journey-inline-note";
  activeText.textContent = trackerState.owned
    ? `${trackerState.milestone} · ${selectedGame.progressLabel}: ${trackerState.progress}/${selectedGame.progressMax}`
    : "Pick the versions you own below so this save can drive your dashboard.";
  activeField.append(activeHead, activeText);

  metaGrid.append(hoursField, trainerIdField, activeField);

  const versionCard = document.createElement("article");
  versionCard.className = "journey-section-card journey-version-card";
  const versionHead = document.createElement("div");
  versionHead.className = "journey-section-head";
  const versionTitle = document.createElement("strong");
  versionTitle.textContent = "Version Ownership";
  const versionSummary = document.createElement("span");
  const versionOptions = getGameVersions(selectedGame);
  const selectedVersionCount = versionOptions.reduce(
    (sum, version) => sum + Number(Boolean(trackerState.versions?.[version.id])),
    0
  );
  versionSummary.textContent = gameHasSeparateVersions(selectedGame)
    ? selectedVersionCount
      ? `${selectedVersionCount}/${versionOptions.length} selected`
      : "Choose your release"
    : trackerState.owned
      ? "Owned"
      : "Not owned";
  versionHead.append(versionTitle, versionSummary);
  versionCard.appendChild(versionHead);

  if (gameHasSeparateVersions(selectedGame)) {
    const versionGrid = document.createElement("div");
    versionGrid.className = "tracker-version-grid journey-version-grid";
    versionOptions.forEach((version) => {
      const versionLabel = document.createElement("label");
      versionLabel.className = "tracker-version-toggle";
      versionLabel.classList.toggle("active", Boolean(trackerState.versions?.[version.id]));

      const versionInput = document.createElement("input");
      versionInput.type = "checkbox";
      versionInput.checked = Boolean(trackerState.versions?.[version.id]);
      versionInput.addEventListener("change", () => {
        trackerState.versions[version.id] = versionInput.checked;
        syncTrackerOwnershipSelection(selectedGame, trackerState);
        syncJourneyDerivedTrackerState(selectedGame, trackerState);
        refreshTrackerConnectedViews();
      });

      const versionText = document.createElement("span");
      versionText.textContent = version.label;
      versionLabel.append(versionInput, versionText);
      versionGrid.appendChild(versionLabel);
    });
    versionCard.appendChild(versionGrid);
  } else {
    const ownedLabel = document.createElement("label");
    ownedLabel.className = "tracker-toggle";
    const ownedInput = document.createElement("input");
    ownedInput.type = "checkbox";
    ownedInput.checked = trackerState.owned;
    ownedInput.addEventListener("change", () => {
      trackerState.owned = ownedInput.checked;
      syncTrackerOwnershipSelection(selectedGame, trackerState);
      syncJourneyDerivedTrackerState(selectedGame, trackerState);
      refreshTrackerConnectedViews();
    });
    const ownedText = document.createElement("span");
    ownedText.textContent = "Owned";
    ownedLabel.append(ownedInput, ownedText);
    versionCard.appendChild(ownedLabel);
  }

  const focusCard = document.createElement("article");
  focusCard.className = "journey-focus-card journey-section-card";
  const focusEyebrow = document.createElement("span");
  focusEyebrow.className = "journey-focus-label";
  focusEyebrow.textContent = "Current Focus";
  const focusTitle = document.createElement("strong");
  focusTitle.textContent = focus.short;
  const focusDetail = document.createElement("p");
  focusDetail.textContent = focus.detail;
  focusCard.append(focusEyebrow, focusTitle, focusDetail);

  const grid = document.createElement("div");
  grid.className = "journey-sections-grid";

  const storyCard = document.createElement("article");
  storyCard.className = "journey-section-card journey-section-card--story";
  const storyHead = document.createElement("div");
  storyHead.className = "journey-section-head";
  const storyTitle = document.createElement("strong");
  storyTitle.textContent = "Main Story";
  const storyCompleted = (config.story ?? []).reduce((sum, item) => sum + Number(trackerState.journeyChecks?.[item.id]), 0);
  const storyCount = document.createElement("span");
  storyCount.textContent = `${storyCompleted}/${config.story.length}`;
  storyHead.append(storyTitle, storyCount);
  const storyList = document.createElement("div");
  storyList.className = "journey-checklist";
  (config.story ?? []).forEach((item) => storyList.appendChild(createJourneyToggle(selectedGame, trackerState, item)));
  storyCard.append(storyHead, storyList);

  const columnsCard = document.createElement("article");
  columnsCard.className = "journey-section-card journey-columns-card journey-section-card--columns";
  const columnsHead = document.createElement("div");
  columnsHead.className = "journey-section-head";
  const columnsTitle = document.createElement("strong");
  columnsTitle.textContent = config.columnsTitle ?? "Checkpoints";
  const allColumnItems = (config.columns ?? []).flatMap((column) => column.items ?? []);
  const columnsCompleted = allColumnItems.reduce((sum, item) => sum + Number(trackerState.journeyChecks?.[item.id]), 0);
  const columnsCount = document.createElement("span");
  columnsCount.textContent = `${columnsCompleted}/${allColumnItems.length}`;
  columnsHead.append(columnsTitle, columnsCount);
  const columnsGrid = document.createElement("div");
  columnsGrid.className = "journey-columns-grid";
  (config.columns ?? []).forEach((column) => {
    const columnCard = document.createElement("section");
    columnCard.className = "journey-column";
    const columnTitle = document.createElement("strong");
    columnTitle.textContent = column.title;
    const columnList = document.createElement("div");
    columnList.className = "journey-checklist journey-checklist--compact";
    (column.items ?? []).forEach((item) => columnList.appendChild(createJourneyToggle(selectedGame, trackerState, item)));
    columnCard.append(columnTitle, columnList);
    columnsGrid.appendChild(columnCard);
  });
  columnsCard.append(columnsHead, columnsGrid);

  const pokedexCard = document.createElement("article");
  pokedexCard.className = "journey-section-card journey-section-card--pokedex";
  const pokedexHead = document.createElement("div");
  pokedexHead.className = "journey-section-head";
  const pokedexTitle = document.createElement("strong");
  pokedexTitle.textContent = "Pokédex Progress";
  const pokedexCount = document.createElement("span");
  pokedexCount.textContent = progress.total
    ? `${formatCount(progress.caughtCount)}/${formatCount(progress.total)}`
    : state.gameAvailabilityReady
      ? "0/0"
      : "Syncing";
  pokedexHead.append(pokedexTitle, pokedexCount);
  const pokedexSummary = document.createElement("p");
  pokedexSummary.className = "journey-card-copy";
  pokedexSummary.textContent = progress.total
    ? `${formatPercent(progress.ratio)} complete in the ${getJourneyDisplayTitle(selectedGame.id)} checklist from Collection.`
    : "This game's dex coverage is still syncing in from Collection.";
  const pokedexBar = document.createElement("div");
  pokedexBar.className = "progress-bar";
  const pokedexFill = document.createElement("span");
  setProgressBar(pokedexFill, progress.ratio);
  pokedexBar.appendChild(pokedexFill);
  const pokedexLinkState = document.createElement("p");
  pokedexLinkState.className = "journey-card-meta";
  pokedexLinkState.textContent = state.gameChecklistState.links[selectedGame.id]
    ? "This game checklist is linked to the main living dex."
    : "This game checklist is unlinked from the main living dex right now.";
  pokedexCard.append(pokedexHead, pokedexSummary, pokedexBar, pokedexLinkState);

  const legendaryCard = document.createElement("article");
  legendaryCard.className = "journey-section-card journey-section-card--legendary";
  const legendaryHead = document.createElement("div");
  legendaryHead.className = "journey-section-head";
  const legendaryTitle = document.createElement("strong");
  legendaryTitle.textContent = "Legendary Pokémon";
  const legendaryCount = document.createElement("span");
  legendaryCount.textContent = `${legendaryCaught}/${legendaryEntries.length}`;
  legendaryHead.append(legendaryTitle, legendaryCount);
  const legendaryList = document.createElement("div");
  legendaryList.className = "collection-list journey-collection-list";
  if (legendaryEntries.length) {
    legendaryEntries.forEach(({ entry, caught }) => {
      legendaryList.appendChild(
        createCollectionItem(
          entry,
          caught ? "Caught in your collection." : "Still missing from your collection.",
          [caught ? "Caught" : "Missing"]
        )
      );
    });
  } else {
    legendaryList.appendChild(createCollectionEmptyState("Legendary targets will appear here once the archive is loaded."));
  }
  legendaryCard.append(legendaryHead, legendaryList);

  const postgameCard = document.createElement("article");
  postgameCard.className = "journey-section-card journey-section-card--postgame";
  const postgameHead = document.createElement("div");
  postgameHead.className = "journey-section-head";
  const postgameTitle = document.createElement("strong");
  postgameTitle.textContent = "Postgame";
  const postgameCompleted = (config.postgame ?? []).reduce((sum, item) => sum + Number(trackerState.journeyChecks?.[item.id]), 0);
  const postgameCount = document.createElement("span");
  postgameCount.textContent = `${postgameCompleted}/${config.postgame.length}`;
  postgameHead.append(postgameTitle, postgameCount);
  const postgameList = document.createElement("div");
  postgameList.className = "journey-checklist";
  (config.postgame ?? []).forEach((item) => postgameList.appendChild(createJourneyToggle(selectedGame, trackerState, item)));
  postgameCard.append(postgameHead, postgameList);

  const dlcCard = document.createElement("article");
  dlcCard.className = "journey-section-card journey-section-card--dlc";
  const dlcHead = document.createElement("div");
  dlcHead.className = "journey-section-head";
  const dlcTitle = document.createElement("strong");
  dlcTitle.textContent = "DLC";
  const dlcCompleted = (config.dlc ?? []).reduce((sum, item) => sum + Number(trackerState.journeyChecks?.[item.id]), 0);
  const dlcCount = document.createElement("span");
  dlcCount.textContent = config.dlc.length ? `${dlcCompleted}/${config.dlc.length}` : "No DLC";
  dlcHead.append(dlcTitle, dlcCount);
  dlcCard.appendChild(dlcHead);
  if (config.dlc.length) {
    const dlcList = document.createElement("div");
    dlcList.className = "journey-checklist";
    config.dlc.forEach((item) => dlcList.appendChild(createJourneyToggle(selectedGame, trackerState, item)));
    dlcCard.appendChild(dlcList);
  } else {
    const dlcEmpty = document.createElement("p");
    dlcEmpty.className = "journey-card-copy";
    dlcEmpty.textContent = "No DLC tracker section is needed for this title right now.";
    dlcCard.appendChild(dlcEmpty);
  }

  const exclusivesCard = document.createElement("article");
  exclusivesCard.className = "journey-section-card journey-section-card--exclusives";
  const exclusivesHead = document.createElement("div");
  exclusivesHead.className = "journey-section-head";
  const exclusivesTitle = document.createElement("strong");
  exclusivesTitle.textContent = "Version Exclusives";
  const exclusivesCount = document.createElement("span");
  exclusivesCount.textContent = versionRecords.mode === "missing"
    ? `${versionRecords.missingCount} missing`
    : versionRecords.mode === "covered"
      ? "Covered"
      : versionRecords.mode === "single"
        ? "N/A"
        : "Pending";
  exclusivesHead.append(exclusivesTitle, exclusivesCount);
  exclusivesCard.appendChild(exclusivesHead);

  const exclusivesNote = document.createElement("p");
  exclusivesNote.className = "journey-card-copy";
  if (versionRecords.mode === "single") {
    exclusivesNote.textContent = "This title does not split its journey by paired version exclusives.";
  } else if (versionRecords.mode === "select") {
    exclusivesNote.textContent = "Choose the release versions you own above to calculate what is exclusive to the other side.";
  } else if (versionRecords.mode === "covered") {
    exclusivesNote.textContent = "You already have both release versions selected, so version exclusives are fully covered.";
  } else if (versionRecords.missingEntries.length) {
    exclusivesNote.textContent = `Missing species that live in ${versionRecords.unownedVersions.map((version) => version.label).join(" and ")} based on your current version setup.`;
  } else {
    exclusivesNote.textContent = "No uncaught version-exclusive species are left for this game right now.";
  }
  exclusivesCard.appendChild(exclusivesNote);

  if (versionRecords.mode === "missing" && versionRecords.missingEntries.length) {
    const exclusivesList = document.createElement("div");
    exclusivesList.className = "collection-list journey-collection-list";
    versionRecords.missingEntries.slice(0, 18).forEach((entry) => {
      exclusivesList.appendChild(
        createCollectionItem(entry, "Exclusive to an unowned version in your setup.", ["Exclusive"])
      );
    });
    if (versionRecords.missingEntries.length > 18) {
      exclusivesList.appendChild(
        createCollectionPlaceholder(
          `+${versionRecords.missingEntries.length - 18} more exclusives`,
          "The rest are still waiting in the other version pool."
        )
      );
    }
    exclusivesCard.appendChild(exclusivesList);
  }

  grid.append(storyCard, columnsCard, pokedexCard, legendaryCard, postgameCard, dlcCard, exclusivesCard);
  detailShell.append(hero, metaGrid, versionCard, focusCard, grid);
  elements.journeyShell.appendChild(detailShell);
}

async function loadGrowthRate(url) {
  if (!url) {
    return null;
  }

  if (state.growthRateCache.has(url)) {
    return state.growthRateCache.get(url);
  }

  const payload = await fetchJsonCached(url);
  const normalized = {
    name: payload.name,
    levels: [...payload.levels].sort((left, right) => left.level - right.level)
  };

  state.growthRateCache.set(url, normalized);
  return normalized;
}

function getExperienceForLevel(levels, level) {
  return levels.find((entry) => entry.level === level)?.experience ?? 0;
}

function getBattleEstimate(expGap, expYield) {
  return expYield > 0 ? Math.ceil(expGap / expYield) : null;
}

function buildEvolutionPlannerState(pokemon, chain, currentLevel) {
  if (!pokemon?.evolutionChainUrl) {
    return {
      badge: "Unavailable",
      note: "No evolution-chain target is attached to this entry.",
      quickTarget: null,
      buttonLabel: "No Evolution Data",
      branches: []
    };
  }

  const currentNode = findEvolutionNode(chain?.chain, pokemon.speciesName);
  if (!currentNode) {
    return {
      badge: "Unavailable",
      note: `I could not place ${pokemon.displayName} inside its evolution line.`,
      quickTarget: null,
      buttonLabel: "No Evolution Data",
      branches: []
    };
  }

  const branches = buildEvolutionTargets(currentNode, currentLevel);
  if (!branches.length) {
    return {
      badge: "Final stage",
      note: `${pokemon.displayName} is already at the end of its evolution line.`,
      quickTarget: null,
      buttonLabel: "Final Stage",
      branches: []
    };
  }

  const quickTarget = branches.find((branch) => branch.targetLevel !== null) ?? null;
  const branchText = branches
    .slice(0, 3)
    .map((branch) => `${branch.displayName} (${branch.condition})`)
    .join(" · ");

  if (!quickTarget) {
    return {
      badge: "Non-EXP",
      note: `The next evolution is condition-based rather than EXP-based. Branches: ${branchText}.`,
      quickTarget: null,
      buttonLabel: "No EXP Evo",
      branches
    };
  }

  const badge =
    quickTarget.minLevel !== null && currentLevel < quickTarget.minLevel
      ? `Lv ${quickTarget.targetLevel}`
      : quickTarget.requiresLevelUp
        ? "Next level-up"
        : quickTarget.condition;
  const buttonLabel =
    quickTarget.minLevel !== null && currentLevel < quickTarget.minLevel
      ? `Next Evo · Lv ${quickTarget.targetLevel}`
      : "Next Evo Ready";
  let note;

  if (quickTarget.minLevel !== null && currentLevel < quickTarget.minLevel) {
    note = `${pokemon.displayName} reaches ${quickTarget.displayName} at ${quickTarget.condition}. Set your target to level ${quickTarget.targetLevel}.`;
  } else if (quickTarget.requiresLevelUp && currentLevel < 100) {
    note = `${pokemon.displayName} already meets the level gate for ${quickTarget.displayName}. One more level-up should trigger it if the rest of the condition is satisfied.`;
  } else {
    note = `${quickTarget.displayName} follows ${quickTarget.condition}.`;
  }

  if (branches.length > 1) {
    note = `${note} Other branches: ${branchText}.`;
  }

  return {
    badge,
    note,
    quickTarget,
    buttonLabel,
    branches
  };
}

function buildLevel100Note(pokemon, currentLevel, level100Gap, battlesTo100) {
  if (currentLevel >= 100) {
    return `${pokemon.displayName} is already at level 100.`;
  }

  const battleText =
    battlesTo100 === null
      ? "Add an EXP-per-battle estimate to project the full route."
      : `At your current route estimate, that is about ${formatCount(battlesTo100)} battles.`;

  return `${pokemon.displayName} still needs ${formatCount(level100Gap)} EXP to hit level 100. ${battleText}`;
}

function buildExpAdvice(
  gameMeta,
  pokemon,
  currentLevel,
  targetLevel,
  gap,
  battlesNeeded,
  evolutionPlanner
) {
  if (targetLevel <= currentLevel) {
    return `${pokemon.displayName} is already at or above your target. Push the target higher, jump to the next evolution gate, or send the route to level 100.`;
  }

  const delta = targetLevel - currentLevel;
  const gamePrefix = gameMeta ? `${gameMeta.shortName} context active.` : "General training context active.";
  const battleLine =
    battlesNeeded === null
      ? "Add an average EXP-per-battle number to estimate how many fights the route will take."
      : `At your current yield estimate, expect about ${formatCount(battlesNeeded)} battles.`;
  const evolutionLine = evolutionPlanner?.quickTarget
    ? `Nearest evolution target: ${evolutionPlanner.quickTarget.displayName}.`
    : evolutionPlanner?.branches?.length
      ? "The next evolution is condition-based rather than EXP-based."
      : "No later evolution is listed.";

  return `${gamePrefix} ${pokemon.displayName} needs ${formatCount(gap)} total EXP across ${delta} levels. ${battleLine} ${evolutionLine}`;
}

function setExpTargetLevel(level) {
  state.expPlan.targetLevel = Math.max(
    state.expPlan.currentLevel,
    clampLevel(level, state.expPlan.targetLevel)
  );
  syncExpInputsFromState();
  saveExpPlanState();
  renderSuggestors();
  void renderExpPlanner();
}

async function setExpTargetToNextEvolution() {
  const pokemon = state.currentPokemon;

  if (!pokemon?.evolutionChainUrl) {
    setStatus("Open a Pokémon entry with an evolution chain first.");
    return;
  }

  try {
    const chain = await loadEvolutionChain(pokemon.evolutionChainUrl);
    if (!state.currentPokemon || state.currentPokemon.name !== pokemon.name) {
      return;
    }

    const planner = buildEvolutionPlannerState(pokemon, chain, state.expPlan.currentLevel);
    if (!planner.quickTarget?.targetLevel) {
      setStatus(planner.note);
      return;
    }

    setExpTargetLevel(planner.quickTarget.targetLevel);
    setStatus(
      `EXP target set for ${planner.quickTarget.displayName} at level ${planner.quickTarget.targetLevel}.`
    );
  } catch {
    setStatus("Evolution data could not be loaded right now.");
  }
}

async function renderExpPlanner() {
  const pokemon = state.currentPokemon;
  elements.expSpeciesLabel.textContent = pokemon ? `${pokemon.displayName} target` : "Open a Pokédex entry";

  state.expPlan.currentLevel = clampLevel(elements.expCurrentLevel.value, state.expPlan.currentLevel);
  state.expPlan.targetLevel = clampLevel(elements.expTargetLevel.value, state.expPlan.targetLevel);
  state.expPlan.expYield = Math.max(0, Math.round(Number(elements.expYieldInput.value) || 0));
  state.expPlan.gameId = elements.expGameSelect.value || state.expPlan.gameId || "none";

  if (state.expPlan.targetLevel < state.expPlan.currentLevel) {
    state.expPlan.targetLevel = state.expPlan.currentLevel;
  }

  syncExpInputsFromState();
  elements.expGameSelect.value = state.expPlan.gameId;
  saveExpPlanState();

  if (!pokemon?.growthRateUrl) {
    elements.expNextLevelButton.disabled = true;
    elements.expNextEvolutionButton.disabled = true;
    elements.expNextEvolutionButton.textContent = "Next Evolution";
    elements.expLevel100Button.disabled = true;
    elements.expGrowthRate.textContent = "-";
    elements.expCurrentTotal.textContent = "-";
    elements.expGap.textContent = "-";
    elements.expTargetTotal.textContent = "-";
    elements.expLevel100Gap.textContent = "-";
    elements.expBattleCount.textContent = "-";
    elements.expEvolutionTarget.textContent = "No target";
    elements.expEvolutionText.textContent =
      "Open a Pokémon entry to inspect the next evolution gate and jump your target level there.";
    elements.expLevel100Text.textContent = "Endgame";
    elements.expLevel100Note.textContent =
      "Open a Pokémon entry to calculate how far this project is from level 100.";
    elements.expPlanText.textContent =
      "Open a Pokémon entry to calculate growth-rate projections and training targets.";
    return;
  }

  try {
    const growthRate = await loadGrowthRate(pokemon.growthRateUrl);
    if (!state.currentPokemon || state.currentPokemon.name !== pokemon.name) {
      return;
    }

    const currentExp = getExperienceForLevel(growthRate.levels, state.expPlan.currentLevel);
    const targetExp = getExperienceForLevel(growthRate.levels, state.expPlan.targetLevel);
    const level100Exp = getExperienceForLevel(growthRate.levels, 100);
    const gap = Math.max(0, targetExp - currentExp);
    const level100Gap = Math.max(0, level100Exp - currentExp);
    const battlesNeeded = getBattleEstimate(gap, state.expPlan.expYield);
    const battlesTo100 = getBattleEstimate(level100Gap, state.expPlan.expYield);
    const gameMeta = getGameMeta(state.expPlan.gameId);
    let evolutionPlanner = {
      badge: "Unavailable",
      note: "Evolution data is not attached to this entry.",
      quickTarget: null,
      buttonLabel: "No Evolution Data",
      branches: []
    };

    if (pokemon.evolutionChainUrl) {
      try {
        const chain = await loadEvolutionChain(pokemon.evolutionChainUrl);
        if (!state.currentPokemon || state.currentPokemon.name !== pokemon.name) {
          return;
        }
        evolutionPlanner = buildEvolutionPlannerState(
          pokemon,
          chain,
          state.expPlan.currentLevel
        );
      } catch {
        evolutionPlanner = {
          badge: "Offline",
          note: "Evolution data could not be loaded right now.",
          quickTarget: null,
          buttonLabel: "Evolution Offline",
          branches: []
        };
      }
    }

    elements.expNextLevelButton.disabled = state.expPlan.currentLevel >= 100;
    elements.expNextEvolutionButton.disabled = !evolutionPlanner.quickTarget?.targetLevel;
    elements.expNextEvolutionButton.textContent = evolutionPlanner.buttonLabel;
    elements.expLevel100Button.disabled = state.expPlan.currentLevel >= 100;
    elements.expGrowthRate.textContent = titleCase(growthRate.name);
    elements.expCurrentTotal.textContent = formatCount(currentExp);
    elements.expGap.textContent = formatCount(gap);
    elements.expTargetTotal.textContent = formatCount(targetExp);
    elements.expLevel100Gap.textContent = formatCount(level100Gap);
    elements.expBattleCount.textContent =
      battlesNeeded === null ? "Set yield" : formatCount(battlesNeeded);
    elements.expEvolutionTarget.textContent = evolutionPlanner.badge;
    elements.expEvolutionText.textContent = evolutionPlanner.note;
    elements.expLevel100Text.textContent =
      state.expPlan.currentLevel >= 100 ? "Complete" : `${100 - state.expPlan.currentLevel} levels left`;
    elements.expLevel100Note.textContent = buildLevel100Note(
      pokemon,
      state.expPlan.currentLevel,
      level100Gap,
      battlesTo100
    );
    elements.expPlanText.textContent = buildExpAdvice(
      gameMeta,
      pokemon,
      state.expPlan.currentLevel,
      state.expPlan.targetLevel,
      gap,
      battlesNeeded,
      evolutionPlanner
    );
  } catch {
    elements.expNextLevelButton.disabled = true;
    elements.expNextEvolutionButton.disabled = true;
    elements.expNextEvolutionButton.textContent = "Next Evolution";
    elements.expLevel100Button.disabled = true;
    elements.expGrowthRate.textContent = "Unavailable";
    elements.expCurrentTotal.textContent = "-";
    elements.expGap.textContent = "-";
    elements.expTargetTotal.textContent = "-";
    elements.expLevel100Gap.textContent = "-";
    elements.expBattleCount.textContent = "-";
    elements.expEvolutionTarget.textContent = "Offline";
    elements.expEvolutionText.textContent = "Evolution data could not be loaded right now.";
    elements.expLevel100Text.textContent = "Endgame";
    elements.expLevel100Note.textContent =
      "Growth-rate data could not be loaded right now, so the level-100 route is unavailable.";
    elements.expPlanText.textContent =
      "Growth-rate data could not be loaded right now. Try another scan or refresh the archive.";
  }
}

function getSuggestedCatchEntry() {
  const applyOwnedCoverageFilter = (entries) =>
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? entries.filter((entry) => isAvailableInOwnedCoverage(entry.baseNumber))
      : entries;

  const visible = applyOwnedCoverageFilter(getVisibleArchiveEntries());
  const archivePool = applyOwnedCoverageFilter(state.entries);
  return visible.find((entry) => !isCaught(entry.name)) ?? archivePool.find((entry) => !isCaught(entry.name)) ?? null;
}

function getSuggestedShinyEntry() {
  const visible = getVisibleArchiveEntries().filter((entry) => !isShinyDexLocked(entry.name));
  return (
    visible.find((entry) => isCaught(entry.name) && !isShiny(entry.name)) ||
    state.entries.find((entry) => !isShinyDexLocked(entry.name) && isCaught(entry.name) && !isShiny(entry.name)) ||
    null
  );
}

function getGameProgressCheckpoint(game, trackerState) {
  const milestones = Array.isArray(game?.milestones) ? game.milestones : [];
  const currentIndex = Math.max(0, milestones.indexOf(trackerState?.milestone));
  const currentMilestone = milestones[currentIndex] ?? milestones[0] ?? "Current Run";
  const nextMilestone = milestones[currentIndex + 1] ?? null;

  return {
    currentMilestone,
    nextMilestone,
    progress: Number(trackerState?.progress ?? 0),
    progressMax: Number(game?.progressMax ?? 0)
  };
}

function getNextTask() {
  const activeGameId = getActiveGameId();
  const activeGame = getGameMeta(activeGameId);

  if (!activeGame) {
    return {
      title: "Set up your saves",
      detail: "Mark the game versions you own, pick an active file, and the tracker will start surfacing story and postgame checkpoints here.",
      focus: "Focus: Setup"
    };
  }

  const trackerState = state.tracker.games[activeGame.id];
  const checkpoint = getGameProgressCheckpoint(activeGame, trackerState);
  const journeyFocus = getJourneyFocusSuggestion(activeGame.id);
  const focusNote = journeyFocus.short
    ? ` Current focus: ${journeyFocus.short}.`
    : " Open Journey to get a suggested next checkpoint.";

  if (!trackerState.hallOfFame) {
    return {
      title:
        checkpoint.progress <= 0 && checkpoint.currentMilestone === activeGame.milestones[0]
          ? `Start ${activeGame.shortName}`
          : `Advance ${activeGame.shortName}`,
      detail: `${activeGame.name} is still in story progress. Current checkpoint: ${checkpoint.currentMilestone}. ${
        checkpoint.nextMilestone
          ? `Next checkpoint: ${checkpoint.nextMilestone}.`
          : "You're closing in on the main-story finish."
      } ${activeGame.progressLabel}: ${checkpoint.progress}/${checkpoint.progressMax}.${focusNote}`,
      focus: `Focus: ${journeyFocus.short || activeGame.shortName}`
    };
  }

  if (!trackerState.postgame) {
    return {
      title: `Open ${activeGame.shortName} postgame`,
      detail: `${activeGame.name} is cleared, but the postgame flag is still off. Push into ${
        checkpoint.nextMilestone ?? activeGame.milestones[activeGame.milestones.length - 1] ?? "postgame content"
      } next.${focusNote}`,
      focus: `Focus: ${journeyFocus.short || `${activeGame.shortName} Postgame`}`
    };
  }

  if (journeyFocus.short && journeyFocus.short !== "All tracked objectives clear") {
    return {
      title: `Continue ${activeGame.shortName}`,
      detail: `${activeGame.name} is in postgame now. Current checkpoint: ${checkpoint.currentMilestone}. Keep pushing your focus target: ${journeyFocus.short}.`,
      focus: `Focus: ${journeyFocus.short}`
    };
  }

  const nextMilestone = checkpoint.nextMilestone ?? activeGame.milestones[activeGame.milestones.length - 1] ?? "Postgame";
  if (checkpoint.currentMilestone !== nextMilestone) {
    return {
      title: `Push ${activeGame.shortName} deeper`,
      detail: `${activeGame.name} is already in postgame. Roll from ${checkpoint.currentMilestone} into ${nextMilestone} for your next progression checkpoint.`,
      focus: `Focus: ${journeyFocus.short || activeGame.shortName}`
    };
  }

  return {
    title: `Steady ${activeGame.shortName} cleanup`,
    detail: `${activeGame.name} is already sitting in late-game cleanup mode. Set a tracker focus or swap the active game when you want a new progression push.`,
    focus: `Focus: ${journeyFocus.short || activeGame.shortName}`
  };
}

function renderSuggestors() {
  const catchTarget = getSuggestedCatchEntry();
  const shinyTarget = getSuggestedShinyEntry();
  const task = getNextTask();

  elements.advisorFocus.textContent = task.focus;

  elements.suggestCatchName.textContent = catchTarget?.displayName ?? "All visible entries logged";
  elements.suggestCatchText.textContent = catchTarget
    ? `${catchTarget.displayName} is the next missing target in your current archive stack.`
    : "Every currently visible entry is already marked caught.";
  elements.suggestCatchButton.disabled = !catchTarget;
  elements.suggestCatchButton.onclick = catchTarget ? () => openPokemonEntry(catchTarget.name) : null;

  elements.suggestShinyName.textContent = shinyTarget?.displayName ?? "No shiny candidate ready";
  elements.suggestShinyText.textContent = shinyTarget
    ? `${shinyTarget.displayName} is caught but not yet in your shiny log.`
    : "Catch a few targets first, then the shiny suggestor will surface the best follow-up hunts.";
  elements.suggestShinyButton.disabled = !shinyTarget;
  elements.suggestShinyButton.onclick = shinyTarget ? () => openPokemonEntry(shinyTarget.name) : null;

  elements.suggestTaskName.textContent = task.title;
  elements.suggestTaskText.textContent = task.detail;
}

function renderTypeChips(container, items, fallbackText, formatter = (item) => item) {
  container.replaceChildren();

  if (!items.length) {
    const chip = document.createElement("span");
    chip.className = "matchup-chip";
    chip.textContent = fallbackText;
    chip.style.background = "rgba(89, 200, 255, 0.1)";
    chip.style.color = "var(--text)";
    container.appendChild(chip);
    return;
  }

  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = item.type === "pokemon-type" ? "type-chip" : "matchup-chip";
    chip.textContent = formatter(item);
    chip.style.background = TYPE_COLORS[item.name] ?? "#59748d";
    container.appendChild(chip);
  });
}

function calculateDefensiveMatchups(types) {
  return TYPE_NAMES.reduce(
    (accumulator, attackType) => {
      const multiplier = types.reduce((total, defenseType) => {
        const chart = TYPE_CHART[attackType] ?? {};
        return total * (chart[defenseType] ?? 1);
      }, 1);

      if (multiplier === 0) {
        accumulator.immune.push({ name: attackType, multiplier });
      } else if (multiplier > 1) {
        accumulator.weak.push({ name: attackType, multiplier });
      } else if (multiplier < 1) {
        accumulator.resist.push({ name: attackType, multiplier });
      }

      return accumulator;
    },
    { weak: [], resist: [], immune: [] }
  );
}

function simplifyPokemon(apiPokemon, species, activeEntry = null) {
  const knownEntry = activeEntry ?? state.entriesByName.get(apiPokemon.name);
  const familyEntries = getEntriesForBaseNumber(knownEntry?.baseNumber ?? species.id);
  const basePokemonName = knownEntry?.basePokemonName ?? species.name;
  const baseDisplayName = knownEntry?.baseDisplayName ?? titleCase(basePokemonName);
  const types = [...apiPokemon.types]
    .sort((left, right) => left.slot - right.slot)
    .map((entry) => entry.type.name);
  const stats = apiPokemon.stats.map((entry) => ({
    name: entry.stat.name,
    value: entry.base_stat
  }));
  const genusEntry = species.genera.find((entry) => entry.language.name === "en");
  const pokedexEntriesState = buildPokedexEntries(species);
  const leadFlavorText = pokedexEntriesState.entries[0]?.text || "No Pokédex note available.";

  return {
    id: knownEntry?.id ?? apiPokemon.id,
    speciesId: species.id,
    speciesName: species.name,
    dexNumber: knownEntry?.baseNumber ?? species.id,
    name: knownEntry?.name ?? apiPokemon.name,
    displayName: knownEntry?.displayName ?? titleCase(apiPokemon.name),
    isForm: knownEntry?.isForm ?? apiPokemon.id > BASE_POKEMON_COUNT,
    baseNumber: knownEntry?.baseNumber ?? species.id,
    basePokemonName,
    baseDisplayName,
    sprite:
      knownEntry?.listSprite ||
      apiPokemon.sprites.front_default ||
      apiPokemon.sprites.other.home.front_default ||
      apiPokemon.sprites.other["official-artwork"].front_default ||
      "",
    spriteShiny:
      knownEntry?.shinyListSprite ||
      apiPokemon.sprites.front_shiny ||
      apiPokemon.sprites.other.home.front_shiny ||
      apiPokemon.sprites.other["official-artwork"].front_shiny ||
      knownEntry?.listSprite ||
      apiPokemon.sprites.front_default ||
      "",
    artwork:
      knownEntry?.listSprite ||
      apiPokemon.sprites.other["official-artwork"].front_default ||
      apiPokemon.sprites.other.home.front_default ||
      apiPokemon.sprites.front_default ||
      knownEntry?.shinyListSprite ||
      apiPokemon.sprites.front_shiny ||
      "",
    artworkShiny:
      knownEntry?.shinyListSprite ||
      apiPokemon.sprites.other["official-artwork"].front_shiny ||
      apiPokemon.sprites.other.home.front_shiny ||
      apiPokemon.sprites.front_shiny ||
      knownEntry?.listSprite ||
      apiPokemon.sprites.other["official-artwork"].front_default ||
      "",
    growthRateName: species.growth_rate?.name ?? "unknown",
    growthRateUrl: species.growth_rate?.url ?? "",
    types,
    height: `${(apiPokemon.height / 10).toFixed(1)} m`,
    weight: `${(apiPokemon.weight / 10).toFixed(1)} kg`,
    abilities: apiPokemon.abilities.map((entry) => titleCase(entry.ability.name)),
    stats,
    bst: stats.reduce((sum, entry) => sum + entry.value, 0),
    matchups: calculateDefensiveMatchups(types),
    flavorText: knownEntry?.detailNote ? `${knownEntry.detailNote} ${leadFlavorText}` : leadFlavorText,
    pokedexEntries: pokedexEntriesState.entries,
    pokedexEntryScope: pokedexEntriesState.scopeLabel,
    genus: genusEntry?.genus || "Unknown",
    habitat: species.habitat ? titleCase(species.habitat.name) : "Unknown",
    generation: `Generation ${determineGeneration(species.id)}`.replace("Generation unknown", "Unknown"),
    eggGroups: species.egg_groups.map((entry) => titleCase(entry.name)),
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
    isBaby: species.is_baby,
    evolutionChainUrl: species.evolution_chain?.url ?? "",
    encounterUrl: apiPokemon.location_area_encounters ?? "",
    varieties: familyEntries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      displayName: entry.displayName,
      isDefault: !entry.isForm,
      formFlags: entry.formFlags,
      variantLabel: entry.variantLabel
    }))
  };
}

function renderStats(stats) {
  elements.statsList.replaceChildren();

  stats.forEach((stat) => {
    const row = document.createElement("div");
    row.className = "stat-row";

    const label = document.createElement("strong");
    label.textContent = stat.name.toUpperCase().replace("SPECIAL-", "SP ");

    const bar = document.createElement("div");
    bar.className = "stat-bar";

    const fill = document.createElement("span");
    fill.style.width = `${Math.min(stat.value / 180, 1) * 100}%`;
    bar.appendChild(fill);

    const value = document.createElement("span");
    value.textContent = String(stat.value);

    row.append(label, bar, value);
    elements.statsList.appendChild(row);
  });
}

function renderForms(varieties) {
  elements.formList.replaceChildren();
  elements.formCount.textContent = `${varieties.length} forms`;

  if (!varieties.length) {
    const empty = document.createElement("span");
    empty.className = "matchup-chip";
    empty.textContent = "No alternate forms";
    empty.style.background = "rgba(89, 200, 255, 0.1)";
    elements.formList.appendChild(empty);
    return;
  }

  varieties.forEach((form) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "form-chip";
    button.classList.toggle("active", form.name === state.currentPokemon?.name);
    button.classList.toggle("caught", isCaught(form.name));

    const copy = document.createElement("span");
    copy.className = "form-copy";

    const label = document.createElement("strong");
    label.textContent = form.displayName;

    const note = document.createElement("span");
    note.className = "form-note";
    note.textContent = [
      form.isDefault ? "Default" : "Form",
      !form.isDefault ? getEntryVariantLabel(form).toLowerCase() : null,
      isCaught(form.name) ? "caught" : "missing",
      isShiny(form.name) ? "shiny logged" : null
    ]
      .filter(Boolean)
      .join(" · ");

    copy.append(label, note);
    button.appendChild(copy);
    button.addEventListener("click", () => {
      openPokemonEntry(form.name);
    });

    elements.formList.appendChild(button);
  });
}

function renderPokedexEntries(pokemon) {
  const entries = pokemon.pokedexEntries ?? [];
  elements.pokedexEntryCount.textContent = `${entries.length} ${pokemon.pokedexEntryScope.toLowerCase()}`;
  elements.pokedexEntryList.replaceChildren();

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "results-summary";
    empty.textContent = "No Pokédex notes are attached to this species in the current archive feed.";
    elements.pokedexEntryList.appendChild(empty);
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "pokedex-entry-card";

    const source = document.createElement("strong");
    source.className = "pokedex-entry-source";
    source.textContent = entry.sourceLabel;

    const text = document.createElement("p");
    text.className = "pokedex-entry-text";
    text.textContent = entry.text;

    card.append(source, text);
    elements.pokedexEntryList.appendChild(card);
  });
}

function renderCurrentScanRibbon() {
  const pokemon = state.currentPokemon;

  if (!pokemon) {
    elements.currentScanRibbon.classList.add("is-empty");
    elements.currentScanOpenButton.disabled = true;
    elements.currentScanClearButton.hidden = true;
    elements.currentScanClearButton.disabled = true;
    elements.currentScanClearButton.classList.add("hidden");
    elements.currentScanName.textContent = "No active scan";
    elements.currentScanMeta.textContent =
      "Open a Pokémon and it will stay pinned here while you move around the app.";
    elements.currentScanSprite.removeAttribute("src");
    elements.currentScanSprite.alt = "";
    elements.currentScanSprite.classList.add("is-hidden");
    elements.currentScanTypes.replaceChildren();
    return;
  }

  const statusBits = [
    `#${formatNumber(pokemon.dexNumber)}`,
    isCaught(pokemon.name) ? "Caught" : "Missing",
    isShiny(pokemon.name) ? "Shiny logged" : null
  ]
    .filter(Boolean)
    .join(" · ");

  elements.currentScanRibbon.classList.remove("is-empty");
  elements.currentScanOpenButton.disabled = false;
  elements.currentScanClearButton.hidden = false;
  elements.currentScanClearButton.disabled = false;
  elements.currentScanClearButton.classList.remove("hidden");
  elements.currentScanName.textContent = pokemon.displayName;
  elements.currentScanMeta.textContent = `${statusBits} · Tap to jump back into the Scan console.`;
  applyPokemonVisual(elements.currentScanSprite, pokemon);

  renderTypeChips(
    elements.currentScanTypes,
    pokemon.types.map((name) => ({ name, type: "pokemon-type" })),
    "Unknown",
    (item) => titleCase(item.name)
  );
}

function clearCurrentScan() {
  if (!state.currentPokemon) {
    return;
  }

  const previousPokemonName = state.currentPokemon.name;
  state.currentPokemon = null;
  state.sessionRestore.currentPokemonName = null;
  saveUiSessionState();
  setSelectedDexEntryCard(null, previousPokemonName);
  renderCurrentScanRibbon();
  renderShinyHelper();
  renderTrainerVault();
  void renderExpPlanner();

  elements.pokemonName.textContent = "No active scan";
  elements.detailEmpty.classList.remove("hidden");
  elements.detailContent.classList.add("hidden");
  elements.toggleCaughtButton.disabled = true;
  elements.toggleCaughtButton.textContent = "Register Caught";
  elements.toggleCaughtButton.classList.remove("caught");
  elements.toggleShinyButton.disabled = true;
  elements.toggleShinyButton.textContent = "Log Shiny";
  elements.toggleShinyButton.classList.remove("active");
  elements.clearScanButton.disabled = true;
  elements.clearScanButton.classList.add("hidden");
  elements.bookmarkButton.textContent = "Bookmark";
  elements.bookmarkButton.classList.remove("active");
  setStatus("Current scan cleared.");
}

function renderCurrentPokemon(pokemon) {
  const previousPokemonName = state.currentPokemon?.name ?? null;
  state.currentPokemon = pokemon;
  state.sessionRestore.currentPokemonName = pokemon.name;
  saveUiSessionState();
  setSelectedDexEntryCard(pokemon.name, previousPokemonName);
  const caught = isCaught(pokemon.name);
  const shiny = isShiny(pokemon.name);
  const shinyLocked = isShinyDexLocked(pokemon.name);
  const bookmarked = isBookmarked(pokemon.name);

  elements.pokemonName.textContent = pokemon.displayName;
  applyPokemonVisual(elements.pokemonArt, pokemon, { preferArtwork: true });
  elements.pokemonDex.textContent = `Dex #${formatNumber(pokemon.dexNumber)}`;
  elements.pokemonFlavor.textContent = pokemon.flavorText;
  elements.pokemonGenus.textContent = pokemon.genus;
  elements.pokemonHeight.textContent = pokemon.height;
  elements.pokemonWeight.textContent = pokemon.weight;
  elements.pokemonAbilities.textContent = pokemon.abilities.join(", ");
  elements.pokemonHabitat.textContent = pokemon.habitat;
  elements.pokemonGeneration.textContent = pokemon.generation;
  renderPokedexEntries(pokemon);
  renderCurrentScanRibbon();
  elements.bstTotal.textContent = `BST ${pokemon.bst}`;
  elements.toggleCaughtButton.disabled = false;
  elements.toggleCaughtButton.textContent = caught ? "Caught Logged" : "Register Caught";
  elements.toggleCaughtButton.classList.toggle("caught", caught);
  elements.toggleShinyButton.disabled = shinyLocked;
  elements.toggleShinyButton.textContent = shinyLocked ? "Shiny Locked" : shiny ? "Shiny Logged" : "Log Shiny";
  elements.toggleShinyButton.classList.toggle("active", !shinyLocked && shiny);
  elements.clearScanButton.disabled = false;
  elements.clearScanButton.classList.remove("hidden");
  elements.bookmarkButton.textContent = bookmarked ? "Bookmarked" : "Bookmark";
  elements.bookmarkButton.classList.toggle("active", bookmarked);
  elements.bulbapediaLink.href = buildBulbapediaUrl(pokemon);
  elements.serebiiLink.href = buildSerebiiUrl(pokemon);

  renderTypeChips(
    elements.pokemonTypes,
    pokemon.types.map((name) => ({ name, type: "pokemon-type" })),
    "Unknown",
    (item) => titleCase(item.name)
  );

  renderStats(pokemon.stats);

  renderTypeChips(
    elements.weaknessList,
    pokemon.matchups.weak.sort(
      (left, right) => right.multiplier - left.multiplier || left.name.localeCompare(right.name)
    ),
    "No major weaknesses",
    (item) => `${titleCase(item.name)} x${item.multiplier}`
  );
  renderTypeChips(
    elements.resistanceList,
    pokemon.matchups.resist.sort(
      (left, right) => left.multiplier - right.multiplier || left.name.localeCompare(right.name)
    ),
    "No resistances",
    (item) => `${titleCase(item.name)} x${item.multiplier}`
  );
  renderTypeChips(
    elements.immunityList,
    pokemon.matchups.immune.sort((left, right) => left.name.localeCompare(right.name)),
    "No immunities",
    (item) => titleCase(item.name)
  );

  renderGameAvailability(pokemon.baseNumber);
  renderForms(pokemon.varieties);
  renderShinyHelper(pokemon);
  renderHomeOrganizer();
  elements.evolutionSummary.textContent = "Syncing";
  elements.locationSummary.textContent = "Syncing";
  void renderEvolutionIntel(pokemon);
  void renderLocationIntel(pokemon);

  elements.detailEmpty.classList.add("hidden");
  elements.detailContent.classList.remove("hidden");
  renderDetailTabs();
  void renderExpPlanner();
  renderSuggestors();
}

function getFilteredEntries() {
  const query = normalizeSearch(state.query);
  const groupTrackedMap = state.entries.reduce((map, entry) => {
    if (isArchiveTracked(entry.name)) {
      map.set(entry.baseNumber, true);
    }
    return map;
  }, new Map());
  const groupSizeMap = state.entries.reduce((map, entry) => {
    map.set(entry.baseNumber, (map.get(entry.baseNumber) ?? 0) + 1);
    return map;
  }, new Map());

  const filtered = state.entries.filter((entry) => {
    const shinyDexVisible = !isArchiveShinyMode() || !isShinyDexLocked(entry.name);
    const tracked = isArchiveTracked(entry.name);
    const scopeMatches =
      state.filters.scope === "all" ||
      (state.filters.scope === "base" && !entry.isForm) ||
      (state.filters.scope === "forms" && entry.isForm);
    const statusMatches =
      state.filters.status === "all" ||
      (state.filters.status === "caught" && tracked) ||
      (state.filters.status === "missing" && !tracked);
    const generationMatches =
      state.filters.generation === "all" || entry.generation === state.filters.generation;
    const gameMatches =
      state.filters.game === "all" ||
      (!state.gameAvailabilityReady && state.gameAvailabilityLoading) ||
      isAvailableInGame(entry.baseNumber, state.filters.game);
    const signaturesMatches =
      state.filters.signatures.size === 0 ||
      entry.formFlags.some((flag) => state.filters.signatures.has(flag));
    const queryMatches = !query || entry.searchBlob.includes(query);

    return (
      shinyDexVisible &&
      scopeMatches &&
      statusMatches &&
      generationMatches &&
      gameMatches &&
      signaturesMatches &&
      queryMatches
    );
  });

  filtered.sort((left, right) => {
    const compareByDexOrder =
      state.filters.game !== "all"
        ? compareEntriesByGameDexOrder(left, right, state.filters.game)
        : left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right);

    switch (state.filters.sort) {
      case "alpha":
        return (
          left.baseDisplayName.localeCompare(right.baseDisplayName) ||
          compareEntriesWithinGroup(left, right)
        );
      case "caught":
        return (
          Number(Boolean(groupTrackedMap.get(right.baseNumber))) -
            Number(Boolean(groupTrackedMap.get(left.baseNumber))) ||
          compareByDexOrder
        );
      case "forms":
        return (
          Number((groupSizeMap.get(right.baseNumber) ?? 0) > 1) -
            Number((groupSizeMap.get(left.baseNumber) ?? 0) > 1) ||
          compareByDexOrder
        );
      case "id-asc":
      default:
        return compareByDexOrder;
    }
  });

  return filtered;
}

function renderFilterButtons() {
  elements.archiveModeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.archiveMode === state.ui.archiveMode);
  });
  elements.archiveViewButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.archiveView === state.ui.archiveView);
  });
  elements.scopeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scope === state.filters.scope);
  });
  elements.statusButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.status === state.filters.status);
    if (button.dataset.status === "caught") {
      button.textContent = getArchiveTrackedLabel();
    } else if (button.dataset.status === "missing") {
      button.textContent = getArchiveMissingLabel();
    } else {
      button.textContent = "All";
    }
  });
  elements.signatureButtons.forEach((button) => {
    button.classList.toggle("active", state.filters.signatures.has(button.dataset.signature));
  });
  elements.sortCaughtOption.textContent = labelSort("caught");
  elements.sortSelect.value = state.filters.sort;
  elements.generationSelect.value = state.filters.generation;
  elements.gameFilterSelect.value = state.filters.game;
  elements.gameFilterSelect.disabled = state.gameAvailabilityLoading && !state.gameAvailabilityReady;
  elements.sortIndicator.textContent = labelSort(state.filters.sort);
  elements.archiveModeIndicator.textContent = `Mode ${getArchiveModeLabel()} - Public Access`;
  elements.archiveRegistryLabel.textContent = isArchiveShinyMode() ? "Shiny Registry" : "Registry";
  elements.statTrackedLabel.textContent = isArchiveShinyMode() ? "Shiny Logged" : "Caught";
  elements.statMissingLabel.textContent = getArchiveMissingLabel();
  elements.dexList.classList.toggle("is-grid", isArchiveGridView());
}

function renderResultsSummary(filteredEntries) {
  const summaryEntries = isArchiveShinyMode() ? getShinyDexEntries() : state.entries;
  const total = summaryEntries.length;
  const { baseCount, formCount } = state.archiveStats;
  const livingEntries = state.entries;
  const shinyEntries = getShinyDexEntries();
  let trackedCount = 0;
  let livingTrackedCount = 0;
  let shinyTrackedCount = 0;

  for (const entry of summaryEntries) {
    trackedCount += Number(isArchiveTracked(entry.name));
  }
  for (const entry of livingEntries) {
    livingTrackedCount += Number(isCaught(entry.name));
  }
  for (const entry of shinyEntries) {
    shinyTrackedCount += Number(isShiny(entry.name));
  }

  const missingCount = total - trackedCount;
  const modeLabel = getArchiveModeLabel();
  const livingCompletionRatio = livingEntries.length ? livingTrackedCount / livingEntries.length : 0;
  const shinyCompletionRatio = shinyEntries.length ? shinyTrackedCount / shinyEntries.length : 0;

  elements.archiveBaseCount.textContent = formatCount(baseCount);
  elements.archiveFormCount.textContent = formatCount(formCount);
  elements.archiveCaughtCount.textContent = formatCount(trackedCount);
  elements.archiveLivingProgressText.textContent = livingEntries.length
    ? `${formatPercent(livingCompletionRatio)} · ${formatCount(livingTrackedCount)}/${formatCount(livingEntries.length)}`
    : "0%";
  elements.archiveShinyProgressText.textContent = shinyEntries.length
    ? `${formatPercent(shinyCompletionRatio)} · ${formatCount(shinyTrackedCount)}/${formatCount(shinyEntries.length)}`
    : "0%";
  setProgressBar(elements.archiveLivingProgressBar, livingCompletionRatio);
  setProgressBar(elements.archiveShinyProgressBar, shinyCompletionRatio);
  elements.resultsCount.textContent = formatCount(filteredEntries.length);
  const activeGameFilter = state.filters.game === "all" ? null : getGameMeta(state.filters.game);
  if (activeGameFilter && !state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.resultsSummary.textContent = `Syncing ${activeGameFilter.shortName} game coverage now.`;
  } else if (filteredEntries.length === total && state.filters.game === "all") {
    elements.resultsSummary.textContent = `Guest mode active. Full ${modeLabel.toLowerCase()} archive signal online.`;
  } else if (activeGameFilter) {
    elements.resultsSummary.textContent = `${formatCount(filteredEntries.length)} ${modeLabel.toLowerCase()} entities match the ${activeGameFilter.shortName} game filter.`;
  } else {
    elements.resultsSummary.textContent = `${formatCount(filteredEntries.length)} ${modeLabel.toLowerCase()} entities match the active filter stack.`;
  }
  elements.statCaught.textContent = formatCount(trackedCount);
  elements.statMissing.textContent = formatCount(missingCount);
  elements.statVisible.textContent = formatCount(filteredEntries.length);
  elements.statSelected.textContent = state.currentPokemon?.displayName ?? "None";
}

function makeTag(label, accentKey = null) {
  const chip = document.createElement("span");
  chip.className = `tag-chip${accentKey ? ` tag-chip--${accentKey}` : ""}`;
  chip.textContent = label;
  return chip;
}

function buildDexEntryListNode(entry) {
  const instance = elements.dexEntryTemplate.content.cloneNode(true);
  const card = instance.querySelector(".dex-entry");
  const checkbox = instance.querySelector(".entry-checkbox");
  const entryButton = instance.querySelector(".dex-entry-button");
  const entrySprite = instance.querySelector(".entry-sprite");
  const entryNumber = instance.querySelector(".entry-number");
  const entryName = instance.querySelector(".entry-name");
  const entryStatus = instance.querySelector(".entry-status");
  const entryTags = instance.querySelector(".entry-tags");
  const caught = isCaught(entry.name);
  const shiny = isShiny(entry.name);
  const tracked = isArchiveTracked(entry.name);
  const accentKey = getEntryAccentKey(entry);

  card.dataset.entryName = entry.name;
  card.dataset.accent = accentKey;
  checkbox.dataset.entryName = entry.name;
  entryButton.dataset.entryName = entry.name;
  card.classList.toggle("selected", entry.name === state.currentPokemon?.name);
  card.classList.toggle("caught", tracked);
  card.classList.toggle("is-form", entry.isForm);

  checkbox.checked = tracked;
  checkbox.setAttribute(
    "aria-label",
    `${isArchiveShinyMode() ? "Toggle shiny state" : "Toggle caught state"} for ${entry.displayName}`
  );

  applyEntrySprite(entrySprite, entry, { forceShiny: isArchiveShinyMode() });
  entryNumber.textContent = `#${formatNumber(entry.baseNumber)}`;
  entryName.textContent = entry.displayName;
  entryStatus.textContent = `${
    isArchiveShinyMode()
      ? tracked
        ? "Shiny logged"
        : "Shiny missing"
      : caught
        ? "Caught"
        : "Missing"
  } · ${getEntryVariantLabel(entry)} · Generation ${entry.generation === "unknown" ? "?" : entry.generation}`;

  const tags = [];
  if (shiny) {
    tags.push("Shiny");
  }
  if (entry.syntheticKind === "gender") {
    tags.push("Gender");
  } else if (entry.syntheticKind === "appearance") {
    tags.push("Appearance");
  } else if (entry.isForm) {
    tags.push(...entry.formFlags.filter((flag) => flag !== "form").map(titleCase));
    if (!tags.length) {
      tags.push("Form");
    }
  } else {
    tags.push("Base");
  }

  tags.slice(0, 2).forEach((label) => {
    entryTags.appendChild(makeTag(label, label === "Shiny" ? null : accentKey));
  });

  state.archiveRender.renderedCardsByName.set(entry.name, card);
  return instance;
}

function buildDexEntryGridNode(entry) {
  const card = document.createElement("article");
  const openButton = document.createElement("button");
  const number = document.createElement("span");
  const sprite = document.createElement("img");
  const name = document.createElement("strong");
  const catchButton = document.createElement("button");
  const tracked = isArchiveTracked(entry.name);
  const caught = isCaught(entry.name);
  const shinyLocked = isShinyDexLocked(entry.name);

  card.className = "archive-grid-card";
  card.dataset.entryName = entry.name;
  card.classList.toggle("selected", entry.name === state.currentPokemon?.name);
  card.classList.toggle("caught", tracked);
  card.classList.toggle("is-form", entry.isForm);
  card.dataset.accent = getEntryAccentKey(entry);

  openButton.type = "button";
  openButton.className = "archive-grid-open";
  openButton.dataset.entryName = entry.name;

  number.className = "archive-grid-number";
  number.textContent = `#${formatNumber(entry.baseNumber)}`;

  sprite.className = "archive-grid-sprite";
  applyEntrySprite(sprite, entry, { forceShiny: isArchiveShinyMode() });

  name.className = "archive-grid-name";
  name.textContent = entry.displayName;

  openButton.append(number, sprite, name);

  catchButton.type = "button";
  catchButton.className = "archive-grid-catch-btn";
  catchButton.dataset.entryName = entry.name;
  catchButton.classList.toggle("caught", tracked);
  catchButton.disabled = isArchiveShinyMode() && shinyLocked;
  catchButton.textContent = isArchiveShinyMode()
    ? shinyLocked
      ? "Locked"
      : tracked
        ? "Logged"
        : "Log"
    : caught
      ? "Caught"
      : "Catch";
  catchButton.setAttribute(
    "aria-label",
    `${isArchiveShinyMode() ? "Toggle shiny state" : "Toggle caught state"} for ${entry.displayName}`
  );

  card.append(openButton, catchButton);
  state.archiveRender.renderedCardsByName.set(entry.name, card);
  return card;
}

function buildDexEntryNode(entry) {
  return isArchiveGridView() ? buildDexEntryGridNode(entry) : buildDexEntryListNode(entry);
}

function setSelectedDexEntryCard(entryName, previousName = null) {
  if (previousName && previousName !== entryName) {
    state.archiveRender.renderedCardsByName.get(previousName)?.classList.remove("selected");
  }

  if (entryName) {
    state.archiveRender.renderedCardsByName.get(entryName)?.classList.add("selected");
  }

  elements.statSelected.textContent = entryName
    ? state.entriesByName.get(entryName)?.displayName ?? "None"
    : "None";
}

function renderDexListTail() {
  elements.dexList.querySelector("[data-result-tail]")?.remove();

  if (state.archiveRender.renderedCount >= state.archiveRender.filteredEntries.length) {
    return;
  }

  const tail = document.createElement("div");
  tail.className = "result-tail";
  tail.dataset.resultTail = "true";
  tail.textContent = `Showing ${formatCount(state.archiveRender.renderedCount)} of ${formatCount(
    state.archiveRender.filteredEntries.length
  )} entries. Scroll for more.`;
  elements.dexList.appendChild(tail);
}

function appendDexEntries(targetCount = state.archiveRender.renderedCount + ARCHIVE_RENDER_BATCH_COUNT) {
  const entries = state.archiveRender.filteredEntries;
  if (!entries.length || state.archiveRender.renderedCount >= entries.length) {
    return;
  }

  const nextCount = Math.min(entries.length, targetCount);
  const fragment = document.createDocumentFragment();

  for (let index = state.archiveRender.renderedCount; index < nextCount; index += 1) {
    fragment.appendChild(buildDexEntryNode(entries[index]));
  }

  state.archiveRender.renderedCount = nextCount;
  elements.dexList.appendChild(fragment);
  renderDexListTail();
}

function getTargetRenderedCount(previousScrollTop = 0) {
  const viewportHeight = elements.dexList.clientHeight || 0;
  const isGrid = isArchiveGridView();
  const entryHeightEstimate = isGrid ? ARCHIVE_GRID_ENTRY_HEIGHT_ESTIMATE : ARCHIVE_ENTRY_HEIGHT_ESTIMATE;
  const columnCount = isGrid
    ? Math.max(1, Math.floor((elements.dexList.clientWidth || ARCHIVE_GRID_CARD_MIN_WIDTH) / ARCHIVE_GRID_CARD_MIN_WIDTH))
    : 1;
  const estimatedVisibleRows = Math.ceil(
    (previousScrollTop + viewportHeight + entryHeightEstimate * 2) / entryHeightEstimate
  );
  const estimatedVisibleCount = estimatedVisibleRows * columnCount;

  return Math.max(
    ARCHIVE_INITIAL_RENDER_COUNT,
    Math.ceil(estimatedVisibleCount / ARCHIVE_RENDER_BATCH_COUNT) * ARCHIVE_RENDER_BATCH_COUNT
  );
}

function renderDexList(filteredEntries) {
  const previousScrollTop = elements.dexList.scrollTop;
  state.archiveRender.renderedCardsByName.clear();
  elements.dexList.replaceChildren();
  state.archiveRender.filteredEntries = filteredEntries;
  state.archiveRender.renderedCount = 0;

  if (!filteredEntries.length) {
    const empty = document.createElement("div");
    empty.className = "no-signal";
    empty.innerHTML =
      "<strong>AUCUN SIGNAL</strong><p>No entry matches the active scan stack. Adjust the filters and rescan.</p>";
    elements.dexList.appendChild(empty);
    return;
  }
  appendDexEntries(getTargetRenderedCount(previousScrollTop));
  elements.dexList.scrollTop = previousScrollTop;
}

function maybeRenderMoreDexEntries() {
  if (state.archiveRender.renderedCount >= state.archiveRender.filteredEntries.length) {
    return;
  }

  const threshold = 360;
  const remaining =
    elements.dexList.scrollHeight - elements.dexList.scrollTop - elements.dexList.clientHeight;

  if (remaining <= threshold) {
    appendDexEntries();
  }
}

function refreshResults() {
  const filteredEntries = getFilteredEntries();
  renderFilterButtons();
  renderResultsSummary(filteredEntries);
  renderDexList(filteredEntries);
  renderSuggestors();
}

function getVisibleArchiveEntries() {
  return state.archiveRender.filteredEntries.length ? state.archiveRender.filteredEntries : state.entries;
}

function updateArchiveTrackedState(entry, tracked) {
  if (isArchiveShinyMode()) {
    setShinyState(entry.name, tracked);
  } else {
    setCaughtState(entry.name, tracked);
  }

  refreshResults();
  renderCollections();
  renderHomeOrganizer();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  setStatus(
    `${entry.displayName} ${
      isArchiveShinyMode()
        ? tracked
          ? "logged in the shiny dex."
          : "removed from the shiny dex."
        : tracked
          ? "registered as caught."
          : "marked missing."
    }`
  );
}

function findExactMatch(rawQuery) {
  const query = normalizeSearch(rawQuery);
  if (!query) {
    return null;
  }

  const searchableEntries = isArchiveShinyMode() ? getShinyDexEntries() : state.entries;

  const numeric = Number(query);
  if (!Number.isNaN(numeric) && /^\d+$/.test(query)) {
    return (
      searchableEntries.find((entry) => !entry.isForm && entry.baseNumber === numeric) ||
      searchableEntries.find((entry) => entry.id === numeric) ||
      null
    );
  }

  const exactNormalized = query.replace(/\s+/g, "-");

  return (
    searchableEntries.find((entry) => entry.name === exactNormalized) ||
    searchableEntries.find((entry) => entry.displayName.toLowerCase() === query) ||
    null
  );
}

function findBestMatch(rawQuery) {
  const query = normalizeSearch(rawQuery);
  if (!query) {
    return null;
  }

  const filteredEntries = getFilteredEntries();
  const numeric = Number(query);

  if (!Number.isNaN(numeric) && /^\d+$/.test(query)) {
    return (
      filteredEntries.find((entry) => !entry.isForm && entry.baseNumber === numeric) ||
      filteredEntries.find((entry) => entry.id === numeric) ||
      null
    );
  }

  const exactNormalized = query.replace(/\s+/g, "-");

  return (
    filteredEntries.find((entry) => entry.name === exactNormalized) ||
    filteredEntries.find((entry) => entry.displayName.toLowerCase() === query) ||
    filteredEntries.find((entry) => entry.searchBlob.startsWith(query)) ||
    filteredEntries[0] ||
    null
  );
}

function maybeAutoOpenFromQuery() {
  const exactMatch = findExactMatch(elements.searchInput.value);

  if (exactMatch && exactMatch.name !== state.currentPokemon?.name) {
    openPokemonEntry(exactMatch.name);
  }
}

function openBestMatch() {
  if (state.queryInputTimer) {
    window.clearTimeout(state.queryInputTimer);
    state.queryInputTimer = null;
  }

  state.query = normalizeSearch(elements.searchInput.value);
  refreshResults();

  const match = findBestMatch(elements.searchInput.value);

  if (match) {
    openPokemonEntry(match.name);
    return;
  }

  setStatus("No matching entity found. Adjust the scan string or clear a filter.");
}

async function fetchDexIndex() {
  setStatus("Syncing full archive index...");

  try {
    const bootstrapPayload = await fetchJsonCached("https://pokeapi.co/api/v2/pokemon?limit=1", {
      preferCache: false
    });
    const listPayload = await fetchJsonCached(
      `https://pokeapi.co/api/v2/pokemon?limit=${bootstrapPayload.count}`,
      { preferCache: false }
    );
    const filteredResults = listPayload.results.filter((entry) => !EXCLUDED_API_ENTRY_NAMES.has(entry.name));
    const existingNames = new Set(filteredResults.map((entry) => entry.name));
    const maxExistingId = listPayload.results.reduce(
      (maxId, entry) => Math.max(maxId, extractIdFromUrl(entry.url)),
      0
    );
    const baseEntries = filteredResults
      .map((entry) => ({ id: extractIdFromUrl(entry.url), name: entry.name }))
      .filter((entry) => entry.id <= BASE_POKEMON_COUNT);

    state.baseEntriesByName = new Map(baseEntries.map((entry) => [entry.name, entry]));
    state.baseNamesSorted = [...state.baseEntriesByName.keys()].sort((left, right) => right.length - left.length);

    const apiEntries = filteredResults
      .map((entry) => {
        const id = extractIdFromUrl(entry.url);
        const seaVariantMeta = SINNOH_SEA_VARIANT_META[entry.name] ?? null;
        const seasonVariantMeta = UNOVA_SEASON_VARIANT_META[entry.name] ?? null;
        const variantMeta = seaVariantMeta ?? seasonVariantMeta;
        const displayName = variantMeta?.displayName ?? titleCase(entry.name);
        const baseEntry = resolveBaseEntry(entry.name, id);
        const baseNumber = baseEntry?.id ?? id;
        const baseDisplayName = titleCase(baseEntry?.name ?? entry.name);
        const generation = determineGeneration(baseNumber);
        const formFlags = detectFormFlags(entry.name, id);
        const normalizedEntry = {
          id,
          name: entry.name,
          displayName,
          isForm: id > BASE_POKEMON_COUNT,
          baseNumber,
          basePokemonName: baseEntry?.name ?? entry.name,
          baseDisplayName,
          generation,
          formFlags,
          variantLabel: variantMeta?.variantLabel,
          detailNote: variantMeta?.detailNote ?? "",
          listSprite: buildSpriteUrl(id),
          shinyListSprite: buildSpriteUrl(id, true)
        };

        normalizedEntry.searchBlob = buildEntrySearchBlob(normalizedEntry);
        return normalizedEntry;
      })
      .sort((left, right) => left.id - right.id);

    const appearanceEntries = buildAppearanceFormEntries(maxExistingId + 1, existingNames, apiEntries);
    await repairUnresolvedFormEntries(apiEntries);

    const allEntries = [...apiEntries, ...appearanceEntries]
      .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right))
      .map((entry) => {
        const homeMeta = getHomeBoxCompatibilityMeta(entry);
        return Object.assign(entry, homeMeta, {
          parkedOnly: entry.archiveVisible === false || homeMeta.parkedOnly
        });
      });

    const entries = allEntries.filter((entry) => !entry.parkedOnly);
    const parkedEntries = allEntries.filter((entry) => entry.parkedOnly);
    const baseEntriesSnapshot = [...state.baseEntriesByName.values()];
    commitDexIndexState(
      {
        entries,
        parkedEntries,
        baseEntries: baseEntriesSnapshot,
        baseNamesSorted: state.baseNamesSorted
      },
      { renderUi: true }
    );
    saveDexIndexCache({
      savedAt: Date.now(),
      entries,
      parkedEntries,
      baseEntries: baseEntriesSnapshot,
      baseNamesSorted: state.baseNamesSorted
    });
    setStatus(`${formatCount(state.entries.length)} entities connected. Launch a scan.`);
    scheduleSwitchGameAvailabilityLoad();
    await restorePersistedCurrentScan();
  } catch (error) {
    setStatus("The archive could not reach PokeAPI. Refresh the interface and try again.");
  }
}

async function fetchPokemonDetail(nameOrId) {
  const requestId = ++state.activeRequestId;
  const lookupName =
    typeof nameOrId === "string" ? normalizeSearch(nameOrId).replace(/\s+/g, "-") : null;
  const knownEntry = lookupName ? state.entriesByName.get(lookupName) ?? null : null;
  const fetchTarget = knownEntry?.basePokemonName ?? nameOrId;
  setLoadingState(true);
  setStatus(`Scanning ${knownEntry?.displayName ?? nameOrId}...`);

  try {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(fetchTarget)}`;
    const pokemonPayload = state.detailCache.has(pokemonUrl)
      ? state.detailCache.get(pokemonUrl)
      : await fetchJsonCached(pokemonUrl);
    state.detailCache.set(pokemonUrl, pokemonPayload);

    const speciesUrl = pokemonPayload.species.url;
    const speciesPayload = state.speciesCache.has(speciesUrl)
      ? state.speciesCache.get(speciesUrl)
      : await fetchJsonCached(speciesUrl);
    state.speciesCache.set(speciesUrl, speciesPayload);
    if (requestId !== state.activeRequestId) {
      return;
    }

    renderCurrentPokemon(simplifyPokemon(pokemonPayload, speciesPayload, knownEntry));
    setStatus(`${state.currentPokemon.displayName} is open in the Pokédex.`);
  } catch (error) {
    if (requestId !== state.activeRequestId) {
      return;
    }

    setStatus(
      `Scan failed for "${knownEntry?.displayName ?? nameOrId}". Try another name, form, or numeric ID.`
    );
  } finally {
    if (requestId === state.activeRequestId) {
      setLoadingState(false);
    }
  }
}

function toggleCurrentCaught() {
  if (!state.currentPokemon) {
    return;
  }

  const nextValue = !isCaught(state.currentPokemon.name);
  setCaughtState(state.currentPokemon.name, nextValue);
  renderCurrentPokemon(state.currentPokemon);
  renderCollections();
  renderHomeOrganizer();
  refreshResults();
  setStatus(
    `${state.currentPokemon.displayName} ${
      nextValue ? "registered as caught." : "marked missing."
    }`
  );
}

function toggleCurrentShiny() {
  if (!state.currentPokemon) {
    return;
  }

  if (isShinyDexLocked(state.currentPokemon.name)) {
    setStatus(`${state.currentPokemon.displayName} is currently shiny-locked and excluded from the shiny dex.`);
    return;
  }

  const nextValue = !isShiny(state.currentPokemon.name);
  setShinyState(state.currentPokemon.name, nextValue);
  renderCurrentPokemon(state.currentPokemon);
  renderCollections();
  renderHomeOrganizer();
  refreshResults();
  setStatus(
    `${state.currentPokemon.displayName} ${
      nextValue ? "logged in the shiny dex." : "removed from the shiny dex."
    }`
  );
}

function openRandomEntry() {
  const filteredEntries = getFilteredEntries();
  const pool = filteredEntries.length ? filteredEntries : state.entries;

  if (!pool.length) {
    return;
  }

  const randomEntry = pool[Math.floor(Math.random() * pool.length)];
  elements.searchInput.value = randomEntry.displayName;
  state.query = normalizeSearch(randomEntry.displayName);
  refreshResults();
  openPokemonEntry(randomEntry.name);
}

async function submitCompanionQuestion() {
  const question = elements.companionInput.value.trim();
  elements.companionStatus.textContent = "Thinking";

  try {
    state.companionReply = await answerCompanionQuestion(question);
  } catch {
    state.companionReply =
      "I hit a snag while answering that. Try asking about your current Pokémon, game coverage, or next targets.";
  }

  renderTrainerVault();
}

elements.navTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveView(button.dataset.view);
  });
});
elements.dashboardOpenViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveView(button.dataset.openView);
  });
});
elements.dashboardSoonButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const label = button.dataset.comingSoon || "This dashboard section";
    const message = `${label} is scaffolded on the dashboard and ready for a later feature pass.`;
    setStatus(message);
    if (state.ui.activeView === "landing") {
      elements.landingSummary.textContent = message;
    }
  });
});
elements.currentScanOpenButton.addEventListener("click", () => {
  if (!state.currentPokemon) {
    return;
  }

  setActiveView("scan");
  window.scrollTo({ top: 0, behavior: "smooth" });
});
elements.currentScanClearButton.addEventListener("click", clearCurrentScan);

elements.detailTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveDetailTab(button.dataset.detailTab);
  });
});

elements.searchInput.addEventListener("input", () => {
  if (state.queryInputTimer) {
    window.clearTimeout(state.queryInputTimer);
  }

  state.queryInputTimer = window.setTimeout(() => {
    state.queryInputTimer = null;
    state.query = normalizeSearch(elements.searchInput.value);
    refreshResults();
  }, SEARCH_INPUT_DEBOUNCE_MS);
});

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  openBestMatch();
});

elements.openEntryButton.addEventListener("click", openBestMatch);
elements.randomButton.addEventListener("click", openRandomEntry);
elements.toggleCaughtButton.addEventListener("click", toggleCurrentCaught);
elements.toggleShinyButton.addEventListener("click", toggleCurrentShiny);
elements.clearScanButton.addEventListener("click", clearCurrentScan);
elements.bookmarkButton.addEventListener("click", () => {
  if (!state.currentPokemon) {
    return;
  }

  const nextValue = !isBookmarked(state.currentPokemon.name);
  setBookmarkState(state.currentPokemon.name, nextValue);
  renderCurrentPokemon(state.currentPokemon);
  renderCollections();
  setStatus(`${state.currentPokemon.displayName} ${nextValue ? "bookmarked." : "removed from bookmarks."}`);
});
elements.favoritePickerOpenButton.addEventListener("click", () => {
  openFavoritePicker("favorites");
});
elements.favoritePickerCloseButton.addEventListener("click", closeFavoritePicker);
elements.favoritePickerOverlay.addEventListener("click", (event) => {
  if (event.target === elements.favoritePickerOverlay) {
    closeFavoritePicker();
  }
});
elements.favoritePickerSearch.addEventListener("input", () => {
  state.ui.favoritePicker.query = elements.favoritePickerSearch.value;
  renderFavoritePicker();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.ui.favoritePicker.open) {
    closeFavoritePicker();
  }
});
elements.favoritePickerClearButton.addEventListener("click", () => {
  const picker = state.ui.favoritePicker;
  if (picker.mode !== "type" || !picker.typeName) {
    return;
  }

  const label = titleCase(picker.typeName);
  setFavoriteTypeState(picker.typeName, null);
  closeFavoritePicker();
  syncFavoriteDisplays();
  setStatus(`${label} type favorite cleared.`);
});
elements.landingTargetCatchButton.addEventListener("click", markSuggestedTargetCaught);
elements.landingShinyLogButton.addEventListener("click", markSuggestedTargetShiny);
elements.landingTargetRerollButton.addEventListener("click", () => {
  rerollRandomTargetBoard();
  renderCollections();
  setStatus("Suggested catch targets rerolled.");
});
elements.landingShinyRerollButton.addEventListener("click", () => {
  rerollShinyTargetBoard();
  renderCollections();
  setStatus("Suggested shiny targets rerolled.");
});
elements.profileSelect.addEventListener("change", () => {
  switchProfile(elements.profileSelect.value);
});
elements.createProfileButton.addEventListener("click", () => {
  const nextId = createProfile(elements.profileNameInput.value);
  if (!nextId) {
    setStatus("Enter a trainer name before creating a profile.");
    return;
  }

  elements.profileNameInput.value = "";
  renderTracker();
  renderExpGameOptions();
  renderCollections();
  renderTrainerVault();
  renderHomeOrganizer();
  renderShinyHelper();
  renderSuggestors();
  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
  void renderExpPlanner();
  setStatus("New local trainer profile created.");
});
elements.profileNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    elements.createProfileButton.click();
  }
});
elements.accountSignInButton.addEventListener("click", () => {
  void signInCloudAccount();
});
elements.accountSignUpButton.addEventListener("click", () => {
  void signUpCloudAccount();
});
elements.accountGoogleSignInButton.addEventListener("click", () => {
  void signInCloudAccountWithGoogle();
});
elements.accountSignOutButton.addEventListener("click", () => {
  void signOutCloudAccount();
});
elements.cloudPushButton.addEventListener("click", () => {
  void pushLocalSnapshotToCloud();
});
elements.cloudSyncButton.addEventListener("click", () => {
  void syncCloudNow();
});
elements.accountPasswordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void signInCloudAccount();
  }
});
elements.trainerNotebook.addEventListener("input", () => {
  state.notebook = elements.trainerNotebook.value;
  saveNotebookState();
  elements.notebookStatus.textContent = "Autosaved locally";
});
elements.companionAskButton.addEventListener("click", () => {
  void submitCompanionQuestion();
});
elements.companionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void submitCompanionQuestion();
  }
});
elements.clearBoxButton.addEventListener("click", () => {
  const currentBox = getCurrentBox();
  if (!currentBox) {
    return;
  }

  currentBox.entries.forEach((entry) => {
    delete state.homeBoxes.boxedMap[entry.name];
  });
  saveHomeBoxesState();
  renderHomeOrganizer();
  setStatus(`${currentBox.name} HOME marks cleared.`);
});
elements.homeExcludedToggleButton.addEventListener("click", () => {
  state.ui.homeExcludedVisible = !state.ui.homeExcludedVisible;
  renderHomeOrganizer();
});
elements.dexList.addEventListener("scroll", () => {
  maybeRenderMoreDexEntries();
});
elements.dexList.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".entry-checkbox");
  if (!checkbox) {
    return;
  }

  const entry = state.entriesByName.get(checkbox.dataset.entryName);
  if (!entry) {
    return;
  }

  updateArchiveTrackedState(entry, checkbox.checked);
});
elements.dexList.addEventListener("click", (event) => {
  const catchButton = event.target.closest(".archive-grid-catch-btn");
  if (catchButton) {
    const entry = state.entriesByName.get(catchButton.dataset.entryName);
    if (entry && !(isArchiveShinyMode() && isShinyDexLocked(entry.name))) {
      updateArchiveTrackedState(entry, !isArchiveTracked(entry.name));
    }
    return;
  }

  const gridOpenButton = event.target.closest(".archive-grid-open");
  if (gridOpenButton) {
    openPokemonEntry(gridOpenButton.dataset.entryName);
    return;
  }

  const entryButton = event.target.closest(".dex-entry-button");
  if (!entryButton) {
    return;
  }

  openPokemonEntry(entryButton.dataset.entryName);
});

elements.scopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.scope = button.dataset.scope;
    refreshResults();
  });
});

elements.archiveModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setArchiveMode(button.dataset.archiveMode);
  });
});

elements.archiveViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setArchiveView(button.dataset.archiveView);
  });
});

elements.statusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.status = button.dataset.status;
    refreshResults();
  });
});

elements.signatureButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const signature = button.dataset.signature;
    const alreadyActive = state.filters.signatures.has(signature);
    state.filters.signatures.clear();
    if (!alreadyActive) {
      state.filters.signatures.add(signature);
    }
    refreshResults();
  });
});

elements.sortSelect.addEventListener("change", () => {
  state.filters.sort = elements.sortSelect.value;
  refreshResults();
});

elements.generationSelect.addEventListener("change", () => {
  state.filters.generation = elements.generationSelect.value;
  refreshResults();
});

elements.gameFilterSelect.addEventListener("change", () => {
  state.filters.game = elements.gameFilterSelect.value;
  refreshResults();
});

elements.expGameSelect.addEventListener("change", () => {
  state.expPlan.gameId = elements.expGameSelect.value;
  saveExpPlanState();
  renderSuggestors();
  void renderExpPlanner();
});

[elements.expCurrentLevel, elements.expTargetLevel, elements.expYieldInput].forEach((input) => {
  input.addEventListener("input", () => {
    void renderExpPlanner();
    renderSuggestors();
  });
});

elements.expNextLevelButton.addEventListener("click", () => {
  setExpTargetLevel(Math.min(100, state.expPlan.currentLevel + 1));
});

elements.expNextEvolutionButton.addEventListener("click", () => {
  void setExpTargetToNextEvolution();
});

elements.expLevel100Button.addEventListener("click", () => {
  setExpTargetLevel(100);
});

renderModuleQueue();
const bootedFromDexCache = hydrateDexIndexFromCache();
renderActiveView();
renderDetailTabs();
renderCurrentScanRibbon();
renderCollections();
renderTrainerVault();
renderExpGameOptions();
syncExpInputsFromState();
renderTracker();
renderHomeOrganizer();
renderShinyHelper();
renderSuggestors();
void renderExpPlanner();
registerOfflineSupport();
void ensureCloudClient().then(() => {
  renderTrainerVault();
});
if (bootedFromDexCache) {
  void restorePersistedCurrentScan();
}
fetchDexIndex();
