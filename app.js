const STORAGE_KEY = "dexter-living-form-dex-v1";
const SHINY_STORAGE_KEY = "dexter-shiny-dex-v1";
const TRACKER_STORAGE_KEY = "dexter-playthrough-tracker-v1";
const EXP_STORAGE_KEY = "dexter-exp-planner-v1";
const GAME_AVAILABILITY_STORAGE_KEY = "dexter-switch-game-availability-v1";
const PROFILE_META_STORAGE_KEY = "dexter-profile-meta-v1";
const NOTEBOOK_STORAGE_KEY = "dexter-notebook-v1";
const FAVORITES_STORAGE_KEY = "dexter-favorites-v1";
const BOOKMARKS_STORAGE_KEY = "dexter-bookmarks-v1";
const FAVORITE_TYPES_STORAGE_KEY = "dexter-favorite-types-v1";
const GAME_CHECKLIST_STORAGE_KEY = "dexter-game-checklists-v1";
const HOME_BOX_STORAGE_KEY = "dexter-home-boxes-v1";
const API_CACHE_STORAGE_KEY = "dexter-api-cache-v1";
const BASE_POKEMON_COUNT = 1025;
const DEFAULT_PROFILE_ID = "guest-trainer";

const GAME_CATALOG = [
  {
    id: "lgpe",
    shortName: "LGPE",
    name: "Let's Go Pikachu / Eevee",
    progressLabel: "Badges",
    progressMax: 8,
    milestones: ["New Save", "Mid Story", "Elite Four", "Master Trainers"]
  },
  {
    id: "swsh",
    shortName: "SWSH",
    name: "Sword / Shield",
    progressLabel: "Badges",
    progressMax: 8,
    milestones: ["New Save", "Wild Area", "Champion Cup", "DLC / Postgame"]
  },
  {
    id: "bdsp",
    shortName: "BDSP",
    name: "Brilliant Diamond / Shining Pearl",
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
    progressLabel: "Paths Cleared",
    progressMax: 18,
    milestones: ["Academy Start", "Three Paths", "Area Zero", "Raid / Postgame"]
  }
];

const SWITCH_GAME_AVAILABILITY = {
  lgpe: {
    label: "Kanto Dex + Meltan line",
    pokedexes: ["letsgo-kanto"],
    extraSpecies: [808, 809]
  },
  swsh: {
    label: "Galar + Isle of Armor + Crown Tundra",
    pokedexes: ["galar", "isle-of-armor", "crown-tundra"]
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
    pokedexes: ["paldea", "kitakami", "blueberry"]
  }
};

const SWITCH_GAME_AVAILABILITY_NOTE =
  "Species-level coverage is based on each Switch title's tracked regional or in-game dex support. Special forms, gifts, and event-only variants can still vary by version.";

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

const elements = {
  navTabs: [...document.querySelectorAll("[data-view]")],
  viewPanels: [...document.querySelectorAll("[data-view-panel]")],
  modulePanels: [...document.querySelectorAll("[data-module-view]")],
  searchForm: document.querySelector("#search-form"),
  searchInput: document.querySelector("#pokemon-search"),
  openEntryButton: document.querySelector("#open-entry-btn"),
  randomButton: document.querySelector("#random-btn"),
  statusText: document.querySelector("#status-text"),
  scopeButtons: [...document.querySelectorAll("[data-scope]")],
  statusButtons: [...document.querySelectorAll("[data-status]")],
  signatureButtons: [...document.querySelectorAll("[data-signature]")],
  sortSelect: document.querySelector("#sort-select"),
  generationSelect: document.querySelector("#generation-select"),
  gameFilterSelect: document.querySelector("#game-filter-select"),
  archiveBaseCount: document.querySelector("#archive-base-count"),
  archiveFormCount: document.querySelector("#archive-form-count"),
  archiveCaughtCount: document.querySelector("#archive-caught-count"),
  resultsCount: document.querySelector("#results-count"),
  resultsSummary: document.querySelector("#results-summary"),
  sortIndicator: document.querySelector("#sort-indicator"),
  statCaught: document.querySelector("#stat-caught"),
  statMissing: document.querySelector("#stat-missing"),
  statVisible: document.querySelector("#stat-visible"),
  statSelected: document.querySelector("#stat-selected"),
  currentScanRibbon: document.querySelector("#current-scan-ribbon"),
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
  pokemonArt: document.querySelector("#pokemon-art"),
  pokemonDex: document.querySelector("#pokemon-dex"),
  pokemonTypes: document.querySelector("#pokemon-types"),
  detailTabButtons: [...document.querySelectorAll("[data-detail-tab]")],
  detailPanes: [...document.querySelectorAll("[data-detail-panel]")],
  favoriteButton: document.querySelector("#favorite-btn"),
  bookmarkButton: document.querySelector("#bookmark-btn"),
  favoriteTypesButton: document.querySelector("#favorite-types-btn"),
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
  refreshTargetsButton: document.querySelector("#refresh-targets-btn"),
  randomTargetSummary: document.querySelector("#random-target-summary"),
  targetList: document.querySelector("#target-list"),
  shinyTargetList: document.querySelector("#shiny-target-list"),
  toggleShinyChecklistButton: document.querySelector("#toggle-shiny-checklist-btn"),
  shinyChecklist: document.querySelector("#shiny-checklist"),
  favoritesCount: document.querySelector("#favorites-count"),
  favoritesList: document.querySelector("#favorites-list"),
  bookmarksCount: document.querySelector("#bookmarks-count"),
  bookmarksList: document.querySelector("#bookmarks-list"),
  favoriteTypesCount: document.querySelector("#favorite-types-count"),
  favoriteTypesList: document.querySelector("#favorite-types-list"),
  unobtainableCount: document.querySelector("#unobtainable-count"),
  unobtainableSummary: document.querySelector("#unobtainable-summary"),
  unobtainableList: document.querySelector("#unobtainable-list"),
  trackerSummary: document.querySelector("#tracker-summary"),
  trackerGrid: document.querySelector("#tracker-grid"),
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
  notebookStatus: document.querySelector("#notebook-status"),
  trainerNotebook: document.querySelector("#trainer-notebook"),
  companionStatus: document.querySelector("#companion-status"),
  companionInput: document.querySelector("#companion-input"),
  companionAskButton: document.querySelector("#companion-ask-btn"),
  companionAnswer: document.querySelector("#companion-answer"),
  homeFocus: document.querySelector("#home-focus"),
  clearBoxButton: document.querySelector("#clear-box-btn"),
  homeBoxTabs: document.querySelector("#home-box-tabs"),
  homeBoxSummary: document.querySelector("#home-box-summary"),
  homeBoxGrid: document.querySelector("#home-box-grid"),
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

const state = {
  entries: [],
  entriesByName: new Map(),
  baseEntriesByName: new Map(),
  baseNamesSorted: [],
  query: "",
  ui: {
    activeView: "archive",
    activeDetailTab: "overview"
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
  shinyChecklistVisible: false,
  companionReply: "",
  growthRateCache: new Map(),
  speciesCache: new Map(),
  detailCache: new Map(),
  evolutionChainCache: new Map(),
  locationCache: new Map(),
  gameAvailabilityByGame: cachedGameAvailability.map,
  gameAvailabilityReady: cachedGameAvailability.ready,
  gameAvailabilityLoading: false,
  gameAvailabilityError: false,
  currentPokemon: null,
  activeRequestId: 0
};

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

function createDefaultTrackerState() {
  return {
    activeGame: "none",
    games: Object.fromEntries(
      GAME_CATALOG.map((game) => [
        game.id,
        {
          owned: false,
          progress: 0,
          milestone: game.milestones[0],
          hallOfFame: false,
          postgame: false,
          focus: ""
        }
      ])
    )
  };
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

function loadGameAvailabilityCache() {
  const cached = loadStoredObject(GAME_AVAILABILITY_STORAGE_KEY, {});
  const map = createEmptyGameAvailabilityMap();
  let ready = false;

  GAME_CATALOG.forEach((game) => {
    const numbers = Array.isArray(cached[game.id])
      ? cached[game.id].map(Number).filter(Number.isFinite)
      : [];

    if (numbers.length) {
      ready = true;
    }

    map.set(game.id, new Set(numbers));
  });

  return { map, ready };
}

function saveGameAvailabilityCache() {
  const serializable = Object.fromEntries(
    GAME_CATALOG.map((game) => [
      game.id,
      [...(state.gameAvailabilityByGame.get(game.id) ?? new Set())].sort((left, right) => left - right)
    ])
  );

  saveStoredObject(GAME_AVAILABILITY_STORAGE_KEY, serializable);
}

function loadTrackerState() {
  const base = createDefaultTrackerState();
  const loaded = loadProfileStoredObject(TRACKER_STORAGE_KEY, base);

  return {
    activeGame: loaded.activeGame ?? base.activeGame,
    games: GAME_CATALOG.reduce((accumulator, game) => {
      accumulator[game.id] = {
        ...base.games[game.id],
        ...(loaded.games?.[game.id] ?? {})
      };
      return accumulator;
    }, {})
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
}

function saveShinyMap() {
  saveProfileStoredObject(SHINY_STORAGE_KEY, state.shinyMap);
}

function saveTrackerState() {
  saveProfileStoredObject(TRACKER_STORAGE_KEY, state.tracker);
}

function saveExpPlanState() {
  saveProfileStoredObject(EXP_STORAGE_KEY, state.expPlan);
}

function saveNotebookState() {
  saveProfileStoredObject(NOTEBOOK_STORAGE_KEY, { text: state.notebook });
}

function saveFavoritesMap() {
  saveProfileStoredObject(FAVORITES_STORAGE_KEY, state.favoritesMap);
}

function saveBookmarksMap() {
  saveProfileStoredObject(BOOKMARKS_STORAGE_KEY, state.bookmarksMap);
}

function saveFavoriteTypesState() {
  saveProfileStoredObject(FAVORITE_TYPES_STORAGE_KEY, state.favoriteTypes);
}

function saveGameChecklistState() {
  saveProfileStoredObject(GAME_CHECKLIST_STORAGE_KEY, state.gameChecklistState);
}

function saveHomeBoxesState() {
  saveProfileStoredObject(HOME_BOX_STORAGE_KEY, state.homeBoxes);
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

function saveApiCache(cache) {
  saveStoredObject(API_CACHE_STORAGE_KEY, cache);
}

async function fetchJsonCached(url) {
  const apiCache = loadApiCache();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`request-${response.status}`);
    }

    const payload = await response.json();
    apiCache[url] = { savedAt: Date.now(), payload };
    saveApiCache(apiCache);
    return payload;
  } catch (error) {
    if (apiCache[url]?.payload) {
      return apiCache[url].payload;
    }
    throw error;
  }
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

function getOwnedGameIds() {
  return GAME_CATALOG.filter((game) => state.tracker.games[game.id]?.owned).map((game) => game.id);
}

function getUnobtainableEntries() {
  const ownedGames = getOwnedGameIds();

  if (!ownedGames.length || !state.gameAvailabilityReady) {
    return [];
  }

  return state.entries.filter(
    (entry) =>
      !entry.isForm &&
      !ownedGames.some((gameId) => isAvailableInGame(entry.baseNumber, gameId))
  );
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
  const shinyPool = missingBaseEntries.filter((entry) => !isShiny(entry.name));
  const shuffled = shuffleEntries(missingBaseEntries);
  state.randomTargets = shuffled.slice(0, 8);
  state.shinyTargets = shuffleEntries(shinyPool).slice(0, 2);
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

function getPrimaryGameEntry(baseNumber) {
  const ownedGames = getOwnedGameIds();
  if (!state.gameAvailabilityReady) {
    return getGameMeta(getActiveGameId()) ?? (ownedGames[0] ? getGameMeta(ownedGames[0]) : null);
  }
  const ownedMatch = ownedGames.find((gameId) => isAvailableInGame(baseNumber, gameId));
  return ownedMatch ? getGameMeta(ownedMatch) : null;
}

function getActiveProfile() {
  return (
    state.profileMeta.profiles.find((profile) => profile.id === state.profileMeta.activeProfileId) ??
    state.profileMeta.profiles[0]
  );
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
  state.ui.activeView = viewId;
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

function createCollectionItem(entry, note, tags = []) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "collection-item";

  const art = document.createElement("span");
  art.className = "collection-item-art";

  const sprite = document.createElement("img");
  sprite.className = "collection-item-sprite";
  sprite.src = entry.listSprite || buildSpriteUrl(entry.baseNumber);
  sprite.alt = "";
  sprite.loading = "lazy";
  sprite.decoding = "async";
  sprite.addEventListener("error", () => {
    if (sprite.dataset.fallback !== "base" && entry.baseNumber !== entry.id) {
      sprite.dataset.fallback = "base";
      sprite.src = buildSpriteUrl(entry.baseNumber);
      return;
    }

    sprite.classList.add("is-missing");
    sprite.removeAttribute("src");
  });

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

  button.addEventListener("click", () => {
    openPokemonEntry(entry.name);
  });

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

function getHomeTemplateBoxes() {
  const boxCount = Math.max(1, Math.ceil(state.entries.length / 30));

  return Array.from({ length: boxCount }, (_, boxIndex) => {
    const start = boxIndex * 30;
    const slots = Array.from({ length: 30 }, (_, slotIndex) => state.entries[start + slotIndex] ?? null);
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

function buildSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
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
    /(totem|therian|origin|eternamax|crowned|battle-bond|cap|primal|ultra|school|busted|hangry|bloodmoon|family|hero|roaming|terastal|stellar|breed|mode|build|mask|totem)/.test(
      lowerName
    )
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
  detailNote
}) {
  const formFlags = ["form", "special"];
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
    syntheticKind: "appearance",
    listSprite: buildSpriteUrl(baseNumber)
  };

  entry.searchBlob = buildEntrySearchBlob(entry, ["appearance", "cosmetic"]);
  return entry;
}

function buildAppearanceFormEntries(startId, existingNames = new Set()) {
  const entries = [];
  let nextId = startId;

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
          detailNote: `${cream.label} with ${sweet.label.toLowerCase()} is tracked as a cosmetic Alcremie appearance form.`
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
        detailNote: `${pattern.label} is tracked as a cosmetic Vivillon appearance form.`
      })
    );
  });

  return entries;
}

function labelSort(sort) {
  const labels = {
    "id-asc": "Sort: ID Numeric",
    alpha: "Sort: Alphabetical",
    caught: "Sort: Caught First",
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

function compareEntriesWithinGroup(left, right) {
  return (
    Number(left.isForm) - Number(right.isForm) ||
    left.displayName.localeCompare(right.displayName) ||
    left.id - right.id
  );
}

function getEntriesForBaseNumber(baseNumber) {
  return state.entries
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
    entry.searchBlob = buildEntrySearchBlob(entry);
  });
}

async function fetchPokedexSpeciesSet(pokedexName) {
  const payload = await fetchJsonCached(
    `https://pokeapi.co/api/v2/pokedex/${encodeURIComponent(pokedexName)}`
  );
  return new Set(payload.pokemon_entries.map((entry) => extractIdFromUrl(entry.pokemon_species.url)));
}

async function buildGameAvailabilitySet(gameId) {
  const config = SWITCH_GAME_AVAILABILITY[gameId];
  const speciesSet = new Set();

  config?.baseRanges?.forEach((range) => {
    for (let current = range.start; current <= range.end; current += 1) {
      speciesSet.add(current);
    }
  });

  if (config?.pokedexes?.length) {
    const pokedexSets = await Promise.all(config.pokedexes.map(fetchPokedexSpeciesSet));
    pokedexSets.forEach((set) => {
      set.forEach((number) => {
        speciesSet.add(number);
      });
    });
  }

  config?.extraSpecies?.forEach((number) => {
    speciesSet.add(number);
  });

  return speciesSet;
}

function isAvailableInGame(baseNumber, gameId) {
  return Boolean(state.gameAvailabilityByGame.get(gameId)?.has(baseNumber));
}

function getGameAvailabilityRecords(baseNumber) {
  return GAME_CATALOG.map((game) => ({
    ...game,
    available: isAvailableInGame(baseNumber, game.id),
    owned: Boolean(state.tracker.games[game.id]?.owned),
    active: state.tracker.activeGame === game.id,
    sourceLabel: SWITCH_GAME_AVAILABILITY[game.id]?.label ?? "Tracked switch coverage"
  }));
}

function renderGameAvailability(baseNumber) {
  const records = getGameAvailabilityRecords(baseNumber);
  const availableCount = records.reduce((sum, record) => sum + Number(record.available), 0);

  elements.gameAvailabilityList.replaceChildren();

  if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.gameAvailabilityCount.textContent = "Syncing";
    elements.gameAvailabilityNote.textContent =
      "Pulling Switch game dex coverage from the archive now.";
  } else if (!state.gameAvailabilityReady) {
    elements.gameAvailabilityCount.textContent = "Unavailable";
    elements.gameAvailabilityNote.textContent =
      "Switch game availability could not be loaded right now. Refresh the archive and try again.";
  } else {
    elements.gameAvailabilityCount.textContent = `${availableCount}/${GAME_CATALOG.length} games`;
    elements.gameAvailabilityNote.textContent = SWITCH_GAME_AVAILABILITY_NOTE;
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

    if (record.owned || record.active) {
      const flags = document.createElement("div");
      flags.className = "availability-card-flags";

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
  const priorMap = state.gameAvailabilityByGame;
  const results = await Promise.allSettled(
    GAME_CATALOG.map(async (game) => ({
      gameId: game.id,
      speciesSet: await buildGameAvailabilitySet(game.id)
    }))
  );

  let successCount = 0;

  results.forEach((result, index) => {
    const gameId = GAME_CATALOG[index].id;

    if (result.status === "fulfilled") {
      successCount += 1;
      nextMap.set(gameId, result.value.speciesSet);
      return;
    }

    const fallbackSet = priorMap.get(gameId);
    nextMap.set(gameId, fallbackSet ? new Set(fallbackSet) : new Set());
  });

  if (successCount > 0) {
    state.gameAvailabilityByGame = nextMap;
    state.gameAvailabilityReady = true;
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
  const ownedCount = GAME_CATALOG.reduce(
    (sum, game) => sum + Number(Boolean(state.tracker.games[game.id]?.owned)),
    0
  );
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
    ? isShiny(pokemon.name)
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

function flattenEvolutionChain(node, stages = [], depth = 0, detail = null) {
  stages.push({
    speciesName: node.species.name,
    displayName: titleCase(node.species.name),
    depth,
    detail,
    condition: describeEvolutionCondition(detail)
  });

  node.evolves_to.forEach((nextNode) => {
    if (!nextNode.evolution_details.length) {
      flattenEvolutionChain(nextNode, stages, depth + 1, null);
      return;
    }

    nextNode.evolution_details.forEach((nextDetail) => {
      flattenEvolutionChain(nextNode, stages, depth + 1, nextDetail);
    });
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
    .flatMap((nextNode) => {
      const details = nextNode.evolution_details.length ? nextNode.evolution_details : [null];

      return details.map((detail) => {
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
  "lets-go-pikachu": "lgpe",
  "lets-go-eevee": "lgpe",
  sword: "swsh",
  shield: "swsh",
  "brilliant-diamond": "bdsp",
  "shining-pearl": "bdsp",
  "legends-arceus": "pla",
  scarlet: "sv",
  violet: "sv"
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

function buildLocationGameRecords(pokemon, locations = []) {
  const grouped = summarizeLocationGroups(locations);

  return GAME_CATALOG.map((game) => {
    const areas = [...(grouped.get(game.id) ?? [])];
    const available = areas.length > 0 || (state.gameAvailabilityReady && isAvailableInGame(pokemon.baseNumber, game.id));

    return {
      ...game,
      available,
      areas
    };
  }).filter((record) => record.available);
}

function describeLocationRecord(record) {
  if (record.areas.length) {
    const preview = record.areas.slice(0, 4).join(" · ");
    return record.areas.length > 4 ? `${preview} · +${record.areas.length - 4} more` : preview;
  }

  return "Tracked in this Switch title, but route-level area names are not attached in the current archive yet.";
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
      const card = document.createElement("article");
      card.className = "location-card";

      const title = document.createElement("strong");
      title.textContent = `${record.shortName} · ${record.name}`;

      const note = document.createElement("p");
      note.className = "results-summary";
      note.textContent = describeLocationRecord(record);

      card.append(title, note);
      elements.locationList.appendChild(card);
    });
  } catch {
    const records = state.gameAvailabilityReady ? buildLocationGameRecords(pokemon, []) : [];
    elements.locationSummary.textContent = records.length ? `${records.length} games` : "Offline";

    if (records.length) {
      records.forEach((record) => {
        const card = document.createElement("article");
        card.className = "location-card";

        const title = document.createElement("strong");
        title.textContent = `${record.shortName} · ${record.name}`;

        const note = document.createElement("p");
        note.className = "results-summary";
        note.textContent =
          "Tracked in this Switch title, but route-level area names could not be loaded right now.";

        card.append(title, note);
        elements.locationList.appendChild(card);
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
  const caughtBaseCount = baseEntries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
  const shinyBaseCount = baseEntries.reduce((sum, entry) => sum + Number(isShiny(entry.name)), 0);
  const ownedGames = getOwnedGameIds();
  const obtainableEntries =
    ownedGames.length && state.gameAvailabilityReady
      ? baseEntries.filter((entry) =>
          ownedGames.some((gameId) => isAvailableInGame(entry.baseNumber, gameId))
        )
      : [];
  const obtainableCaughtCount = obtainableEntries.reduce(
    (sum, entry) => sum + Number(isCaught(entry.name)),
    0
  );
  const totalCaughtEntries = state.entries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
  const favoriteEntries = Object.keys(state.favoritesMap)
    .map((name) => state.entriesByName.get(name))
    .filter(Boolean)
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
  const bookmarkEntries = Object.keys(state.bookmarksMap)
    .map((name) => state.entriesByName.get(name))
    .filter(Boolean)
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
  const favoriteTypeEntries = getFavoriteTypeEntries();
  const favoriteTypeCount = favoriteTypeEntries.reduce((sum, item) => sum + Number(Boolean(item.entry)), 0);
  const unobtainableEntries = getUnobtainableEntries();
  const currentMissingNames = new Set(baseEntries.filter((entry) => !isCaught(entry.name)).map((entry) => entry.name));

  if (
    (!state.randomTargets.length && baseEntries.length) ||
    state.randomTargets.some((entry) => !currentMissingNames.has(entry.name)) ||
    state.shinyTargets.some((entry) => !currentMissingNames.has(entry.name))
  ) {
    refreshRandomTargets();
  }

  elements.collectionFocus.textContent = `${profile.name} · ${formatCount(totalCaughtEntries)} logged`;

  const mainRatio = baseEntries.length ? caughtBaseCount / baseEntries.length : 0;
  const shinyRatio = baseEntries.length ? shinyBaseCount / baseEntries.length : 0;
  const ownedRatio = obtainableEntries.length ? obtainableCaughtCount / obtainableEntries.length : 0;

  elements.mainProgressText.textContent = baseEntries.length
    ? `${formatPercent(mainRatio)} · ${formatCount(caughtBaseCount)}/${formatCount(baseEntries.length)}`
    : "0%";
  elements.shinyProgressText.textContent = baseEntries.length
    ? `${formatPercent(shinyRatio)} · ${formatCount(shinyBaseCount)}/${formatCount(baseEntries.length)}`
    : "0%";
  elements.ownedProgressText.textContent = obtainableEntries.length
    ? `${formatPercent(ownedRatio)} · ${formatCount(obtainableCaughtCount)}/${formatCount(obtainableEntries.length)}`
    : ownedGames.length
      ? "Syncing game coverage"
      : "Mark owned games";

  setProgressBar(elements.mainProgressBar, mainRatio);
  setProgressBar(elements.shinyProgressBar, shinyRatio);
  setProgressBar(elements.ownedProgressBar, ownedRatio);

  elements.randomTargetSummary.textContent = state.randomTargets.length
    ? `${state.randomTargets.length} living dex targets and ${state.shinyTargets.length} bonus shiny calls are ready for ${profile.name}.`
    : "Everything in the base archive is already logged for this profile. Flip to a fresh profile or start a shiny push.";

  const renderEntryList = (container, entries, emptyText, noteBuilder, tagBuilder = () => []) => {
    container.replaceChildren();

    if (!entries.length) {
      container.appendChild(createCollectionEmptyState(emptyText));
      return;
    }

    entries.forEach((entry) => {
      container.appendChild(createCollectionItem(entry, noteBuilder(entry), tagBuilder(entry)));
    });
  };

  renderEntryList(
    elements.targetList,
    state.randomTargets,
    "No uncaught targets are left in the main dex pool for this profile.",
    (entry) => {
      const game = getPrimaryGameEntry(entry.baseNumber);
      return game
        ? `${game.shortName} available · Generation ${entry.generation}`
        : `Generation ${entry.generation}`;
    },
    () => ["Missing"]
  );

  renderEntryList(
    elements.shinyTargetList,
    state.shinyTargets,
    "No bonus shiny targets are waiting right now.",
    (entry) => {
      const game = getPrimaryGameEntry(entry.baseNumber);
      return game ? `${game.shortName} route ready` : "Missing from main dex";
    },
    () => ["Shiny"]
  );

  elements.toggleShinyChecklistButton.textContent = state.shinyChecklistVisible
    ? "Hide Shiny Checklist"
    : "Show Shiny Checklist";
  elements.shinyChecklist.classList.toggle("hidden", !state.shinyChecklistVisible);
  elements.shinyChecklist.replaceChildren();

  if (state.shinyChecklistVisible) {
    const shinyEntries = baseEntries
      .filter((entry) => isShiny(entry.name))
      .sort((left, right) => left.baseNumber - right.baseNumber);

    if (!shinyEntries.length) {
      elements.shinyChecklist.appendChild(
        createCollectionEmptyState("No shiny targets are logged yet. Open an entry and use Log Shiny to start the list.")
      );
    } else {
      shinyEntries.forEach((entry) => {
        const row = document.createElement("div");
        row.className = "shiny-check-row";

        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = true;
        toggle.addEventListener("change", () => {
          setShinyState(entry.name, toggle.checked);
          if (state.currentPokemon?.name === entry.name) {
            renderCurrentPokemon(state.currentPokemon);
          }
          renderCollections();
          refreshResults();
          setStatus(`${entry.displayName} ${toggle.checked ? "logged as shiny." : "removed from the shiny checklist."}`);
        });

        row.append(toggle, createCollectionItem(entry, isCaught(entry.name) ? "Caught and shiny logged" : "Still missing, shiny planned", ["Shiny"]));
        elements.shinyChecklist.appendChild(row);
      });
    }
  }

  elements.favoritesCount.textContent = formatCount(favoriteEntries.length);
  renderEntryList(
    elements.favoritesList,
    favoriteEntries,
    "Favorite Pokémon will appear here.",
    (entry) => `${getEntryVariantLabel(entry)} · ${isCaught(entry.name) ? "Caught" : "Missing"}`,
    (entry) => (isShiny(entry.name) ? ["Favorite", "Shiny"] : ["Favorite"])
  );

  elements.bookmarksCount.textContent = formatCount(bookmarkEntries.length);
  renderEntryList(
    elements.bookmarksList,
    bookmarkEntries,
    "Bookmark targets to keep a separate catch watchlist.",
    (entry) => `${getEntryVariantLabel(entry)} · ${isCaught(entry.name) ? "Caught" : "Watchlist"}`,
    () => ["Bookmark"]
  );

  elements.favoriteTypesCount.textContent = `${favoriteTypeCount}/${TYPE_NAMES.length}`;
  elements.favoriteTypesList.replaceChildren();
  favoriteTypeEntries.forEach((item) => {
    const label = titleCase(item.typeName);
    if (item.entry) {
      elements.favoriteTypesList.appendChild(
        createCollectionItem(item.entry, `${label} favorite`, [label])
      );
      return;
    }

    elements.favoriteTypesList.appendChild(
      createCollectionPlaceholder(label, "No favorite selected yet.", [label])
    );
  });

  elements.unobtainableCount.textContent = state.gameAvailabilityReady
    ? formatCount(unobtainableEntries.length)
    : "Syncing";
  elements.unobtainableSummary.textContent = !ownedGames.length
    ? "Mark the Switch games you own to calculate which species are unobtainable."
    : !state.gameAvailabilityReady
      ? "Switch game coverage is still syncing, so unobtainable species are temporarily on hold."
      : unobtainableEntries.length
        ? `These base species are outside the dex support of your currently owned Switch games.`
        : "Everything in the current owned-game pool is obtainable somewhere in your library.";
  renderEntryList(
    elements.unobtainableList,
    unobtainableEntries,
    ownedGames.length
      ? "No unobtainable species found across your owned games."
      : "Owned-game tracking will unlock this list.",
    (entry) => `${entry.baseDisplayName} is missing from your owned-game coverage`,
    () => ["Unavailable"]
  );
}

function renderTrainerVault() {
  const profile = getActiveProfile();
  const profileCount = state.profileMeta.profiles.length;

  elements.profilePill.textContent = profile.name;
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
    : getOwnedGameIds().length
      ? `${getOwnedGameIds().length} games tracked`
      : "Offline Helper";
  elements.companionAnswer.textContent =
    state.companionReply ||
    "Ask a question and Dexter will answer from your current archive, trackers, and Pokémon data.";
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

  if (activeRecord?.areas.length) {
    return `${pokemon.displayName} has ${activeRecord.areas.length} tracked ${activeRecord.shortName} locations. First hits: ${activeRecord.areas.slice(0, 4).join(" · ")}.`;
  }

  if (activeRecord) {
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
    return `${pokemon.displayName} is tracked in ${gameList}. Route intel is attached for ${routedRecord.shortName}; first hits: ${routedRecord.areas.slice(0, 4).join(" · ")}.`;
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
    const owned = getOwnedGameIds().map((gameId) => getGameMeta(gameId)?.shortName).filter(Boolean);
    return owned.length
      ? `You currently marked these Switch saves as owned: ${owned.join(", ")}.`
      : "No Switch games are marked as owned yet in the playthrough tracker.";
  }

  if (/(unobtainable|cannot obtain|can.t get)/.test(normalized)) {
    const unobtainable = getUnobtainableEntries();
    return !getOwnedGameIds().length
      ? "Mark the Switch games you own first, then I can calculate the unobtainable pool."
      : !state.gameAvailabilityReady
        ? "Game coverage is still syncing, so the unobtainable pool is not ready yet."
        : unobtainable.length
          ? `${formatCount(unobtainable.length)} base species are unobtainable in your current owned-game library. First few: ${unobtainable.slice(0, 6).map((entry) => entry.displayName).join(", ")}.`
          : "Everything is obtainable somewhere in the games you currently marked as owned.";
  }

  if (/(favorite type|fav of each type|type favorite)/.test(normalized)) {
    const chosen = getFavoriteTypeEntries().filter((entry) => entry.entry);
    return chosen.length
      ? `You have ${chosen.length} type favorites set. First few: ${chosen.slice(0, 6).map((entry) => `${titleCase(entry.typeName)} = ${entry.entry.displayName}`).join(" · ")}.`
      : "No type favorites are set yet. Open a Pokémon entry and use Fav Of Its Types.";
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
  } else if (!currentBox || !targetCount) {
    elements.homeBoxSummary.textContent = "This HOME box is waiting for living-dex targets to load.";
  } else {
    const spareText = spareCount
      ? ` ${spareCount} spare slot${spareCount === 1 ? "" : "s"} remain open in this box.`
      : "";
    elements.homeBoxSummary.textContent =
      `${currentBox.name} covers ${getHomeBoxRangeLabel(currentBox)} (${getHomeBoxSpanLabel(currentBox)}). ` +
      `${filledCount}/${targetCount} marked boxed in HOME, ${caughtCount}/${targetCount} caught in your dex.` +
      `${spareText} Click a slot to mark or unmark that target as boxed in HOME. Use Archive or Scan when you want the full Pokemon page while organizing.`;
  }

  elements.clearBoxButton.disabled = !currentBox || filledCount === 0;
  elements.gameChecklistSummary.textContent = `${linkedCount}/${GAME_CATALOG.length} linked to main dex`;

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
        sprite.src = entry.listSprite || buildSpriteUrl(entry.id);
        sprite.alt = "";
        sprite.loading = "lazy";
        sprite.decoding = "async";
        sprite.addEventListener("error", () => {
          if (sprite.dataset.fallback !== "base" && entry.baseNumber !== entry.id) {
            sprite.dataset.fallback = "base";
            sprite.src = buildSpriteUrl(entry.baseNumber);
            return;
          }

          sprite.classList.add("is-missing");
          sprite.removeAttribute("src");
        });

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
    card.className = "checklist-card";

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

function setActiveGame(gameId) {
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
  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
  void renderExpPlanner();
}

function renderTracker() {
  const { ownedCount, clearedCount } = getOwnedSummary();
  elements.trackerSummary.textContent =
    ownedCount === 0 ? "No games tracked" : `${ownedCount} owned · ${clearedCount} cleared`;
  elements.trackerGrid.replaceChildren();

  GAME_CATALOG.forEach((game) => {
    const trackerState = state.tracker.games[game.id];
    const card = document.createElement("article");
    card.className = "tracker-card";
    card.classList.toggle("active", state.tracker.activeGame === game.id);

    const head = document.createElement("div");
    head.className = "tracker-card-head";

    const titleBlock = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = game.shortName;
    const subtitle = document.createElement("span");
    subtitle.textContent = game.name;
    titleBlock.append(title, subtitle);

    const activeButton = document.createElement("button");
    activeButton.type = "button";
    activeButton.className = "ghost-button tracker-focus-button";
    activeButton.textContent = state.tracker.activeGame === game.id ? "Active" : "Set Active";
    activeButton.disabled = !trackerState.owned;
    activeButton.addEventListener("click", () => {
      setActiveGame(game.id);
    });

    head.append(titleBlock, activeButton);

    const controls = document.createElement("div");
    controls.className = "tracker-controls";

    const ownedLabel = document.createElement("label");
    ownedLabel.className = "tracker-toggle";
    const ownedInput = document.createElement("input");
    ownedInput.type = "checkbox";
    ownedInput.checked = trackerState.owned;
    ownedInput.addEventListener("change", () => {
      trackerState.owned = ownedInput.checked;
      if (!trackerState.owned && state.tracker.activeGame === game.id) {
        state.tracker.activeGame = "none";
      } else if (trackerState.owned && state.tracker.activeGame === "none") {
        state.tracker.activeGame = game.id;
      }
      saveTrackerState();
      renderTracker();
      renderCollections();
      renderHomeOrganizer();
      renderShinyHelper();
      renderSuggestors();
      renderExpGameOptions();
      if (state.currentPokemon) {
        renderCurrentPokemon(state.currentPokemon);
      }
      void renderExpPlanner();
    });
    const ownedText = document.createElement("span");
    ownedText.textContent = "Owned";
    ownedLabel.append(ownedInput, ownedText);

    const hofLabel = document.createElement("label");
    hofLabel.className = "tracker-toggle";
    const hofInput = document.createElement("input");
    hofInput.type = "checkbox";
    hofInput.checked = trackerState.hallOfFame;
    hofInput.addEventListener("change", () => {
      trackerState.hallOfFame = hofInput.checked;
      saveTrackerState();
      renderTracker();
      renderSuggestors();
    });
    const hofText = document.createElement("span");
    hofText.textContent = "Cleared";
    hofLabel.append(hofInput, hofText);

    const postgameLabel = document.createElement("label");
    postgameLabel.className = "tracker-toggle";
    const postgameInput = document.createElement("input");
    postgameInput.type = "checkbox";
    postgameInput.checked = trackerState.postgame;
    postgameInput.addEventListener("change", () => {
      trackerState.postgame = postgameInput.checked;
      saveTrackerState();
      renderTracker();
      renderSuggestors();
    });
    const postgameText = document.createElement("span");
    postgameText.textContent = "Postgame";
    postgameLabel.append(postgameInput, postgameText);

    controls.append(ownedLabel, hofLabel, postgameLabel);

    const progressShell = document.createElement("div");
    progressShell.className = "tracker-progress-shell";

    const progressTop = document.createElement("div");
    progressTop.className = "tracker-progress-top";
    const progressLabel = document.createElement("span");
    progressLabel.textContent = game.progressLabel;
    const progressValue = document.createElement("strong");
    progressValue.textContent = `${trackerState.progress}/${game.progressMax}`;
    progressTop.append(progressLabel, progressValue);

    const progressInput = document.createElement("input");
    progressInput.type = "range";
    progressInput.min = "0";
    progressInput.max = String(game.progressMax);
    progressInput.value = String(trackerState.progress);
    progressInput.addEventListener("input", () => {
      trackerState.progress = Number(progressInput.value);
      saveTrackerState();
      progressValue.textContent = `${trackerState.progress}/${game.progressMax}`;
      renderSuggestors();
    });

    progressShell.append(progressTop, progressInput);

    const milestoneLabel = document.createElement("label");
    milestoneLabel.className = "select-shell compact-field";
    const milestoneText = document.createElement("span");
    milestoneText.textContent = "Milestone";
    const milestoneSelect = document.createElement("select");
    game.milestones.forEach((milestone) => {
      const option = document.createElement("option");
      option.value = milestone;
      option.textContent = milestone;
      option.selected = trackerState.milestone === milestone;
      milestoneSelect.appendChild(option);
    });
    milestoneSelect.addEventListener("change", () => {
      trackerState.milestone = milestoneSelect.value;
      saveTrackerState();
      renderSuggestors();
    });
    milestoneLabel.append(milestoneText, milestoneSelect);

    const focusLabel = document.createElement("label");
    focusLabel.className = "select-shell compact-field";
    const focusText = document.createElement("span");
    focusText.textContent = "Current Focus";
    const focusInput = document.createElement("input");
    focusInput.type = "text";
    focusInput.placeholder = "Example: finish Victory Road";
    focusInput.value = trackerState.focus;
    focusInput.addEventListener("input", () => {
      trackerState.focus = focusInput.value.trim();
      saveTrackerState();
      renderSuggestors();
    });
    focusLabel.append(focusText, focusInput);

    card.append(head, controls, progressShell, milestoneLabel, focusLabel);
    elements.trackerGrid.appendChild(card);
  });
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
  const visible = getFilteredEntries();
  return visible.find((entry) => !isCaught(entry.name)) ?? state.entries.find((entry) => !isCaught(entry.name)) ?? null;
}

function getSuggestedShinyEntry() {
  const visible = getFilteredEntries();
  return (
    visible.find((entry) => isCaught(entry.name) && !isShiny(entry.name)) ||
    state.entries.find((entry) => isCaught(entry.name) && !isShiny(entry.name)) ||
    null
  );
}

function getNextTask() {
  const activeGameId = getActiveGameId();
  const activeGame = getGameMeta(activeGameId);

  if (!activeGame) {
    return {
      title: "Set up your saves",
      detail: "Mark the Switch games you own to unlock game-aware objectives, tracker reminders, and EXP context.",
      focus: "Focus: Setup"
    };
  }

  const trackerState = state.tracker.games[activeGame.id];

  if (!trackerState.hallOfFame) {
    return {
      title: `Push ${activeGame.shortName}`,
      detail: `${activeGame.name} is still in story progress. Current milestone: ${trackerState.milestone}. ${
        trackerState.focus ? `Focus note: ${trackerState.focus}.` : "Set a focus note for your next session."
      }`,
      focus: `Focus: ${activeGame.shortName}`
    };
  }

  if (state.currentPokemon && state.expPlan.targetLevel > state.expPlan.currentLevel) {
    return {
      title: `Train ${state.currentPokemon.displayName}`,
      detail: `Your active EXP route still needs ${state.expPlan.targetLevel - state.expPlan.currentLevel} levels. Keep the current training plan moving.`,
      focus: "Focus: EXP"
    };
  }

  const catchTarget = getSuggestedCatchEntry();
  if (catchTarget) {
    return {
      title: "Advance the living dex",
      detail: `Your next clean pickup is ${catchTarget.displayName}, keeping the archive moving family by family.`,
      focus: "Focus: Living Dex"
    };
  }

  const shinyTarget = getSuggestedShinyEntry();
  if (shinyTarget) {
    return {
      title: "Start a shiny project",
      detail: `${shinyTarget.displayName} is already caught and still missing from your shiny log.`,
      focus: "Focus: Shiny Dex"
    };
  }

  return {
    title: "Archive sweep complete",
    detail: "Everything visible in the current stack is already logged. Flip to another filter or game and choose a new hunt.",
    focus: "Focus: Review"
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
      apiPokemon.sprites.other["official-artwork"].front_default ||
      apiPokemon.sprites.other.home.front_default ||
      apiPokemon.sprites.front_default ||
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
  elements.currentScanName.textContent = pokemon.displayName;
  elements.currentScanMeta.textContent = `${statusBits} · Tap to jump back into the Scan console.`;
  elements.currentScanSprite.src = pokemon.sprite;
  elements.currentScanSprite.alt = `${pokemon.displayName} sprite`;
  elements.currentScanSprite.classList.remove("is-hidden");

  renderTypeChips(
    elements.currentScanTypes,
    pokemon.types.map((name) => ({ name, type: "pokemon-type" })),
    "Unknown",
    (item) => titleCase(item.name)
  );
}

function renderCurrentPokemon(pokemon) {
  state.currentPokemon = pokemon;
  const caught = isCaught(pokemon.name);
  const shiny = isShiny(pokemon.name);
  const favorite = isFavorite(pokemon.name);
  const bookmarked = isBookmarked(pokemon.name);
  const favoritedForAllTypes = pokemon.types.every((typeName) => state.favoriteTypes[typeName] === pokemon.name);

  elements.pokemonName.textContent = pokemon.displayName;
  elements.pokemonArt.src = pokemon.sprite;
  elements.pokemonArt.alt = `${pokemon.displayName} official artwork`;
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
  elements.toggleShinyButton.disabled = false;
  elements.toggleShinyButton.textContent = shiny ? "Shiny Logged" : "Log Shiny";
  elements.toggleShinyButton.classList.toggle("active", shiny);
  elements.favoriteButton.textContent = favorite ? "Favorited" : "Favorite";
  elements.favoriteButton.classList.toggle("active", favorite);
  elements.bookmarkButton.textContent = bookmarked ? "Bookmarked" : "Bookmark";
  elements.bookmarkButton.classList.toggle("active", bookmarked);
  elements.favoriteTypesButton.textContent = favoritedForAllTypes ? "Clear Type Favs" : "Fav Of Its Types";
  elements.favoriteTypesButton.classList.toggle("active", favoritedForAllTypes);
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
  const groupCaughtMap = state.entries.reduce((map, entry) => {
    if (isCaught(entry.name)) {
      map.set(entry.baseNumber, true);
    }
    return map;
  }, new Map());
  const groupSizeMap = state.entries.reduce((map, entry) => {
    map.set(entry.baseNumber, (map.get(entry.baseNumber) ?? 0) + 1);
    return map;
  }, new Map());

  const filtered = state.entries.filter((entry) => {
    const caught = isCaught(entry.name);
    const scopeMatches =
      state.filters.scope === "all" ||
      (state.filters.scope === "base" && !entry.isForm) ||
      (state.filters.scope === "forms" && entry.isForm);
    const statusMatches =
      state.filters.status === "all" ||
      (state.filters.status === "caught" && caught) ||
      (state.filters.status === "missing" && !caught);
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
      scopeMatches &&
      statusMatches &&
      generationMatches &&
      gameMatches &&
      signaturesMatches &&
      queryMatches
    );
  });

  filtered.sort((left, right) => {
    switch (state.filters.sort) {
      case "alpha":
        return (
          left.baseDisplayName.localeCompare(right.baseDisplayName) ||
          compareEntriesWithinGroup(left, right)
        );
      case "caught":
        return (
          Number(Boolean(groupCaughtMap.get(right.baseNumber))) -
            Number(Boolean(groupCaughtMap.get(left.baseNumber))) ||
          left.baseNumber - right.baseNumber ||
          compareEntriesWithinGroup(left, right)
        );
      case "forms":
        return (
          Number((groupSizeMap.get(right.baseNumber) ?? 0) > 1) -
            Number((groupSizeMap.get(left.baseNumber) ?? 0) > 1) ||
          left.baseNumber - right.baseNumber ||
          compareEntriesWithinGroup(left, right)
        );
      case "id-asc":
      default:
        return left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right);
    }
  });

  return filtered;
}

function renderFilterButtons() {
  elements.scopeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.scope === state.filters.scope);
  });
  elements.statusButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.status === state.filters.status);
  });
  elements.signatureButtons.forEach((button) => {
    button.classList.toggle("active", state.filters.signatures.has(button.dataset.signature));
  });
  elements.sortSelect.value = state.filters.sort;
  elements.generationSelect.value = state.filters.generation;
  elements.gameFilterSelect.value = state.filters.game;
  elements.gameFilterSelect.disabled = state.gameAvailabilityLoading && !state.gameAvailabilityReady;
  elements.sortIndicator.textContent = labelSort(state.filters.sort);
}

function renderResultsSummary(filteredEntries) {
  const total = state.entries.length;
  const baseCount = state.entries.reduce((sum, entry) => sum + Number(!entry.isForm), 0);
  const formCount = total - baseCount;
  const caughtCount = state.entries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
  const missingCount = total - caughtCount;

  elements.archiveBaseCount.textContent = formatCount(baseCount);
  elements.archiveFormCount.textContent = formatCount(formCount);
  elements.archiveCaughtCount.textContent = formatCount(caughtCount);
  elements.resultsCount.textContent = formatCount(filteredEntries.length);
  const activeGameFilter = state.filters.game === "all" ? null : getGameMeta(state.filters.game);
  if (activeGameFilter && !state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.resultsSummary.textContent = `Syncing ${activeGameFilter.shortName} game coverage now.`;
  } else if (filteredEntries.length === total && state.filters.game === "all") {
    elements.resultsSummary.textContent = "Guest mode active. Full archive signal online.";
  } else if (activeGameFilter) {
    elements.resultsSummary.textContent = `${formatCount(filteredEntries.length)} archive entities match the ${activeGameFilter.shortName} game filter.`;
  } else {
    elements.resultsSummary.textContent = `${formatCount(filteredEntries.length)} archive entities match the active filter stack.`;
  }
  elements.statCaught.textContent = formatCount(caughtCount);
  elements.statMissing.textContent = formatCount(missingCount);
  elements.statVisible.textContent = formatCount(filteredEntries.length);
  elements.statSelected.textContent = state.currentPokemon?.displayName ?? "None";
}

function makeTag(label) {
  const chip = document.createElement("span");
  chip.className = "tag-chip";
  chip.textContent = label;
  return chip;
}

function renderDexList(filteredEntries) {
  const previousScrollTop = elements.dexList.scrollTop;
  elements.dexList.replaceChildren();

  if (!filteredEntries.length) {
    const empty = document.createElement("div");
    empty.className = "no-signal";
    empty.innerHTML =
      "<strong>AUCUN SIGNAL</strong><p>No entry matches the active scan stack. Adjust the filters and rescan.</p>";
    elements.dexList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();

  filteredEntries.forEach((entry) => {
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

    card.classList.toggle("selected", entry.name === state.currentPokemon?.name);
    card.classList.toggle("caught", caught);
    card.classList.toggle("is-form", entry.isForm);

    checkbox.checked = caught;
    checkbox.addEventListener("change", () => {
      setCaughtState(entry.name, checkbox.checked);
      refreshResults();
      renderCollections();
      renderHomeOrganizer();

      if (state.currentPokemon) {
        renderCurrentPokemon(state.currentPokemon);
      }

      setStatus(
        `${entry.displayName} ${checkbox.checked ? "registered as caught." : "marked missing."}`
      );
    });

    entrySprite.src = entry.listSprite;
    entrySprite.addEventListener("error", () => {
      if (entry.baseNumber !== entry.id && entrySprite.dataset.fallback !== "base") {
        entrySprite.dataset.fallback = "base";
        entrySprite.src = buildSpriteUrl(entry.baseNumber);
        return;
      }

      entrySprite.classList.add("is-missing");
      entrySprite.removeAttribute("src");
    });
    entryNumber.textContent = `#${formatNumber(entry.baseNumber)}`;
    entryName.textContent = entry.displayName;
    entryStatus.textContent = `${caught ? "Caught" : "Missing"} · ${getEntryVariantLabel(entry)} · Generation ${
      entry.generation === "unknown" ? "?" : entry.generation
    }`;

    const tags = [];
    if (shiny) {
      tags.push("Shiny");
    }
    if (entry.syntheticKind === "appearance") {
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
      entryTags.appendChild(makeTag(label));
    });

    entryButton.addEventListener("click", () => {
      openPokemonEntry(entry.name);
    });

    fragment.appendChild(instance);
  });

  elements.dexList.appendChild(fragment);
  elements.dexList.scrollTop = previousScrollTop;
}

function refreshResults() {
  const filteredEntries = getFilteredEntries();
  renderFilterButtons();
  renderResultsSummary(filteredEntries);
  renderDexList(filteredEntries);
  renderSuggestors();
}

function findExactMatch(rawQuery) {
  const query = normalizeSearch(rawQuery);
  if (!query) {
    return null;
  }

  const numeric = Number(query);
  if (!Number.isNaN(numeric) && /^\d+$/.test(query)) {
    return (
      state.entries.find((entry) => !entry.isForm && entry.baseNumber === numeric) ||
      state.entries.find((entry) => entry.id === numeric) ||
      null
    );
  }

  const exactNormalized = query.replace(/\s+/g, "-");

  return (
    state.entries.find((entry) => entry.name === exactNormalized) ||
    state.entries.find((entry) => entry.displayName.toLowerCase() === query) ||
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
    const bootstrapPayload = await fetchJsonCached("https://pokeapi.co/api/v2/pokemon?limit=1");
    const listPayload = await fetchJsonCached(
      `https://pokeapi.co/api/v2/pokemon?limit=${bootstrapPayload.count}`
    );
    const existingNames = new Set(listPayload.results.map((entry) => entry.name));
    const maxExistingId = listPayload.results.reduce(
      (maxId, entry) => Math.max(maxId, extractIdFromUrl(entry.url)),
      0
    );
    const baseEntries = listPayload.results
      .map((entry) => ({ id: extractIdFromUrl(entry.url), name: entry.name }))
      .filter((entry) => entry.id <= BASE_POKEMON_COUNT);

    state.baseEntriesByName = new Map(baseEntries.map((entry) => [entry.name, entry]));
    state.baseNamesSorted = [...state.baseEntriesByName.keys()].sort((left, right) => right.length - left.length);

    const apiEntries = listPayload.results
      .map((entry) => {
        const id = extractIdFromUrl(entry.url);
        const displayName = titleCase(entry.name);
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
          listSprite: buildSpriteUrl(id)
        };

        normalizedEntry.searchBlob = buildEntrySearchBlob(normalizedEntry);
        return normalizedEntry;
      })
      .sort((left, right) => left.id - right.id);

    const appearanceEntries = buildAppearanceFormEntries(maxExistingId + 1, existingNames);
    await repairUnresolvedFormEntries(apiEntries);

    state.entries = [...apiEntries, ...appearanceEntries].sort(
      (left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right)
    );

    state.entriesByName = new Map(state.entries.map((entry) => [entry.name, entry]));
    refreshRandomTargets();
    refreshResults();
    renderCollections();
    renderTrainerVault();
    renderHomeOrganizer();
    setStatus(`${formatCount(state.entries.length)} entities connected. Launch a scan.`);
    fetchPokemonDetail("pikachu");
    void loadSwitchGameAvailability();
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
    refreshResults();
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

  const nextValue = !isShiny(state.currentPokemon.name);
  setShinyState(state.currentPokemon.name, nextValue);
  renderCurrentPokemon(state.currentPokemon);
  renderCollections();
  refreshResults();
  setStatus(
    `${state.currentPokemon.displayName} ${
      nextValue ? "logged as a shiny project." : "removed from the shiny log."
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
elements.currentScanRibbon.addEventListener("click", () => {
  if (!state.currentPokemon) {
    return;
  }

  setActiveView("scan");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

elements.detailTabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveDetailTab(button.dataset.detailTab);
  });
});

elements.searchInput.addEventListener("input", () => {
  state.query = normalizeSearch(elements.searchInput.value);
  refreshResults();
  maybeAutoOpenFromQuery();
});

elements.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  openBestMatch();
});

elements.openEntryButton.addEventListener("click", openBestMatch);
elements.randomButton.addEventListener("click", openRandomEntry);
elements.toggleCaughtButton.addEventListener("click", toggleCurrentCaught);
elements.toggleShinyButton.addEventListener("click", toggleCurrentShiny);
elements.favoriteButton.addEventListener("click", () => {
  if (!state.currentPokemon) {
    return;
  }

  const nextValue = !isFavorite(state.currentPokemon.name);
  setFavoriteState(state.currentPokemon.name, nextValue);
  renderCurrentPokemon(state.currentPokemon);
  renderCollections();
  setStatus(`${state.currentPokemon.displayName} ${nextValue ? "added to" : "removed from"} favorites.`);
});
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
elements.favoriteTypesButton.addEventListener("click", () => {
  if (!state.currentPokemon) {
    return;
  }

  const clearExisting = elements.favoriteTypesButton.classList.contains("active");

  state.currentPokemon.types.forEach((typeName) => {
    if (clearExisting) {
      delete state.favoriteTypes[typeName];
      return;
    }

    state.favoriteTypes[typeName] = state.currentPokemon.name;
  });

  saveFavoriteTypesState();
  renderCurrentPokemon(state.currentPokemon);
  renderCollections();
  setStatus(
    clearExisting
      ? `${state.currentPokemon.displayName} cleared from its type-favorite slots.`
      : `${state.currentPokemon.displayName} set as the favorite for ${state.currentPokemon.types.map(titleCase).join(" / ")}.`
  );
});
elements.refreshTargetsButton.addEventListener("click", () => {
  refreshRandomTargets();
  renderCollections();
  setStatus("Random hunt board refreshed.");
});
elements.toggleShinyChecklistButton.addEventListener("click", () => {
  state.shinyChecklistVisible = !state.shinyChecklistVisible;
  renderCollections();
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

elements.scopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.filters.scope = button.dataset.scope;
    refreshResults();
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
    if (state.filters.signatures.has(signature)) {
      state.filters.signatures.delete(signature);
    } else {
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
fetchDexIndex();
