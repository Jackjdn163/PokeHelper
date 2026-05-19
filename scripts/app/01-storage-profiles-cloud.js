// Local storage, profiles, and cloud snapshot serialization
// Source chunk generated from the original app.js lines 2369-3091.

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
    archiveDuplicateMode: false,
    scanVisualMode: "home",
    journeySelectedGame: null,
    duplicatePlannerFilter: "all",
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
  const archiveDuplicateMode = Boolean(loaded?.archiveDuplicateMode);
  const scanVisualMode = "home";
  const journeySelectedGame = GAME_CATALOG.some((game) => game.id === loaded?.journeySelectedGame)
    ? loaded.journeySelectedGame
    : null;
  const duplicatePlannerFilter = VALID_DUPLICATE_FILTER_IDS.has(loaded?.duplicatePlannerFilter)
    ? loaded.duplicatePlannerFilter
    : "all";
  const currentPokemonName = loaded?.currentPokemonName ? String(loaded.currentPokemonName) : null;

  return {
    activeView,
    activeDetailTab,
    archiveView,
    archiveDuplicateMode,
    scanVisualMode,
    journeySelectedGame,
    duplicatePlannerFilter,
    currentPokemonName
  };
}

function saveUiSessionState() {
  saveStoredObject(UI_SESSION_STORAGE_KEY, {
    activeView: state.ui.activeView,
    activeDetailTab: state.ui.activeDetailTab,
    archiveView: state.ui.archiveView,
    archiveDuplicateMode: state.ui.archiveDuplicateMode,
    scanVisualMode: state.ui.scanVisualMode,
    journeySelectedGame: state.ui.journeySelectedGame,
    duplicatePlannerFilter: state.ui.duplicatePlannerFilter,
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
    autoSyncEnabled: true,
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

function createDefaultFirstRunState() {
  return {
    dismissed: false,
    completed: false,
    guest: false,
    completedAt: null
  };
}

function loadFirstRunState() {
  const loaded = loadStoredObject(FIRST_RUN_STORAGE_KEY, createDefaultFirstRunState());

  return {
    dismissed: Boolean(loaded?.dismissed),
    completed: Boolean(loaded?.completed),
    guest: Boolean(loaded?.guest),
    completedAt: loaded?.completedAt ? String(loaded.completedAt) : null
  };
}

function saveFirstRunState() {
  saveStoredObject(FIRST_RUN_STORAGE_KEY, state.firstRun);
}

function createDefaultProfileSetupState() {
  return {
    completed: false,
    mainGoal: DEFAULT_MAIN_GOAL_ID,
    favoritePokemonName: null,
    finishedAt: null
  };
}

function normalizeProfileSetupState(value = {}) {
  const mainGoal = MAIN_GOAL_OPTION_IDS.has(value?.mainGoal) ? value.mainGoal : DEFAULT_MAIN_GOAL_ID;
  return {
    completed: Boolean(value?.completed),
    mainGoal,
    favoritePokemonName: value?.favoritePokemonName ? String(value.favoritePokemonName) : null,
    finishedAt: value?.finishedAt ? String(value.finishedAt) : null
  };
}

function loadProfileSetupState() {
  return normalizeProfileSetupState(
    loadProfileStoredObject(PROFILE_SETUP_STORAGE_KEY, createDefaultProfileSetupState())
  );
}

function saveProfileSetupState() {
  saveProfileStoredObject(PROFILE_SETUP_STORAGE_KEY, state.profileSetup);
  markCloudDirty();
}

function getMainGoalOption(goalId = state.profileSetup?.mainGoal) {
  return MAIN_GOAL_OPTIONS.find((option) => option.id === goalId) ?? MAIN_GOAL_OPTIONS[0];
}

function createToolRowId() {
  return `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultSupplyRow() {
  return {
    id: createToolRowId(),
    name: "",
    unitCost: "",
    quantity: "1"
  };
}

function createDefaultToolsState() {
  const defaultLzaSlots = Array.from({ length: 8 }, (_, index) => LZA_DONUT_PRESETS[0]?.berries?.[index] ?? "");

  return {
    lza: {
      slots: defaultLzaSlots
    },
    pla: {
      recipeName: PLA_RECIPES_BY_NAME.has("Jet Ball")
        ? "Jet Ball"
        : PLA_RECIPE_CATALOG[0]?.name ?? "",
      amount: 1,
      materialCounts: {},
      materialCosts: {}
    },
    sv: {
      type: SV_SHINY_SANDWICH_RECIPES[0]?.type ?? "Normal"
    },
    supply: {
      rows: [createDefaultSupplyRow()]
    }
  };
}

function normalizeNonNegativeInteger(value, fallback = 0) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function normalizeNonNegativeDecimalString(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return "";
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? normalized : "";
}

function normalizeToolsIntegerMap(rawValue = {}) {
  if (!rawValue || typeof rawValue !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawValue)
      .map(([name, value]) => [String(name), normalizeNonNegativeInteger(value, 0)])
      .filter(([, value]) => value > 0)
  );
}

function normalizeToolsDecimalMap(rawValue = {}) {
  if (!rawValue || typeof rawValue !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(rawValue)
      .map(([name, value]) => [String(name), normalizeNonNegativeDecimalString(value)])
      .filter(([, value]) => value)
  );
}

function normalizeSupplyRows(rows = []) {
  const normalizedRows = Array.isArray(rows)
    ? rows
        .map((row) => ({
          id: row?.id ? String(row.id) : createToolRowId(),
          name: String(row?.name ?? ""),
          unitCost: normalizeNonNegativeDecimalString(row?.unitCost),
          quantity: String(Math.max(0, normalizeNonNegativeInteger(row?.quantity, 1)) || 1)
        }))
        .filter((row) => row.id)
    : [];

  return normalizedRows.length ? normalizedRows : [createDefaultSupplyRow()];
}

function loadToolsState() {
  const fallback = createDefaultToolsState();
  const loaded = loadProfileStoredObject(TOOLS_STORAGE_KEY, fallback);
  const lzaSlots = Array.from({ length: 8 }, (_, index) => {
    const slotValue = Array.isArray(loaded?.lza?.slots) ? loaded.lza.slots[index] : "";
    return LZA_DONUT_BERRIES_BY_NAME.has(slotValue) ? slotValue : fallback.lza.slots[index] ?? "";
  });
  const recipeName = PLA_RECIPES_BY_NAME.has(loaded?.pla?.recipeName)
    ? loaded.pla.recipeName
    : fallback.pla.recipeName;
  const amount = Math.max(1, normalizeNonNegativeInteger(loaded?.pla?.amount, fallback.pla.amount));
  const materialCounts = normalizeToolsIntegerMap(loaded?.pla?.materialCounts);
  const materialCosts = normalizeToolsDecimalMap(loaded?.pla?.materialCosts);
  const svType = SV_SHINY_SANDWICHES_BY_TYPE.has(loaded?.sv?.type)
    ? loaded.sv.type
    : fallback.sv.type;

  return {
    lza: {
      slots: lzaSlots
    },
    pla: {
      recipeName,
      amount,
      materialCounts,
      materialCosts
    },
    sv: {
      type: svType
    },
    supply: {
      rows: normalizeSupplyRows(loaded?.supply?.rows)
    }
  };
}

function saveToolsState() {
  saveProfileStoredObject(TOOLS_STORAGE_KEY, state.tools);
  markCloudDirty();
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

function createDefaultShinyHubSessionState() {
  return {
    encounters: 0,
    incrementAmount: 1,
    decrementAmount: 1,
    elapsedMs: 0,
    timerStartedAt: null,
    timerRunning: false
  };
}

function createDefaultShinyHubState() {
  return {
    selectedGameId: null,
    selectedTargetName: null,
    searchQuery: "",
    suggestionMap: {},
    oddsPresetByGame: {},
    sessions: {}
  };
}

function getGameVersions(game) {
  return Array.isArray(game?.versions) ? game.versions : [];
}

function gameHasSeparateVersions(game) {
  return getGameVersions(game).length > 0;
}

function gameHasDlcCoverage(gameOrId) {
  const gameId = typeof gameOrId === "string" ? gameOrId : gameOrId?.id;
  const availabilitySegments = SWITCH_GAME_AVAILABILITY[gameId]?.segments ?? [];
  const journeyDlcItems = getJourneyConfig(gameId)?.dlc ?? [];

  return journeyDlcItems.length > 0 || availabilitySegments.some((segment) => segment.kind === "dlc");
}

function trackerHasDlc(gameId) {
  return Boolean(gameHasDlcCoverage(gameId) && state.tracker.games[gameId]?.hasDlc);
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
  trackerState.hasDlc = gameHasDlcCoverage(game) ? Boolean(trackerState.hasDlc) : false;

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
          hasDlc: false,
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
    case "profileSetup":
      return createDefaultProfileSetupState();
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
    case "shinyHub":
      return createDefaultShinyHubState();
    case "tools":
      return createDefaultToolsState();
    default:
      return {};
  }
}

function cloneCloudProfileField(field, value) {
  if (field === "caughtMap") {
    return normalizeCaughtMap(value);
  }

  if (field === "profileSetup") {
    return normalizeProfileSetupState(value);
  }

  return cloneJson(value, getCloudProfileFieldFallback(field));
}

function readCloudFieldForProfile(profileId, baseKey, field) {
  const fallback = getCloudProfileFieldFallback(field);
  const scopedKey = getProfileScopedStorageKey(baseKey, profileId);
  const scopedValue = loadStoredObject(scopedKey, null);

  if (scopedValue && typeof scopedValue === "object") {
    return cloneCloudProfileField(field, scopedValue);
  }

  if (profileId === DEFAULT_PROFILE_ID) {
    if (field === "notebook") {
      return {
        text: String(loadStoredObject(baseKey, { text: "" }).text ?? "")
      };
    }

    return cloneCloudProfileField(field, loadStoredObject(baseKey, fallback));
  }

  return cloneCloudProfileField(field, fallback);
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
    profileSetup: readCloudFieldForProfile(profileId, PROFILE_SETUP_STORAGE_KEY, "profileSetup"),
    gameChecklistState: readCloudFieldForProfile(profileId, GAME_CHECKLIST_STORAGE_KEY, "gameChecklistState"),
    homeBoxes: readCloudFieldForProfile(profileId, HOME_BOX_STORAGE_KEY, "homeBoxes"),
    shinyHub: readCloudFieldForProfile(profileId, SHINY_HUB_STORAGE_KEY, "shinyHub"),
    tools: readCloudFieldForProfile(profileId, TOOLS_STORAGE_KEY, "tools")
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
    normalizeCaughtMap(normalizedPayload.caughtMap)
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
    getProfileScopedStorageKey(PROFILE_SETUP_STORAGE_KEY, profileId),
    normalizeProfileSetupState(normalizedPayload.profileSetup)
  );
  saveStoredObject(
    getProfileScopedStorageKey(GAME_CHECKLIST_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.gameChecklistState, createDefaultGameChecklistState())
  );
  saveStoredObject(
    getProfileScopedStorageKey(HOME_BOX_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.homeBoxes, createDefaultHomeBoxesState())
  );
  saveStoredObject(
    getProfileScopedStorageKey(SHINY_HUB_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.shinyHub, createDefaultShinyHubState())
  );
  saveStoredObject(
    getProfileScopedStorageKey(TOOLS_STORAGE_KEY, profileId),
    cloneJson(normalizedPayload.tools, createDefaultToolsState())
  );
}

function applyCloudSnapshot(snapshot) {
  const normalizedMeta = sanitizeCloudProfileMeta(snapshot?.profileMeta);
  const payloads = snapshot?.profiles && typeof snapshot.profiles === "object" ? snapshot.profiles : {};

  normalizedMeta.profiles.forEach((profile) => {
    writeProfileCloudPayload(profile.id, payloads[profile.id]);
  });

  state.profileMeta = normalizedMeta;
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
  renderModuleQueue();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  void renderExpPlanner();
}

function loadCaughtMap() {
  return normalizeCaughtMap(loadProfileStoredObject(STORAGE_KEY, {}));
}
