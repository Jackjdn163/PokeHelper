// Profile state loaders, saves, API cache, and offline setup
// Source chunk generated from the original app.js lines 3093-3653.

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

function loadShinyHubState() {
  const fallback = createDefaultShinyHubState();
  const loaded = loadProfileStoredObject(SHINY_HUB_STORAGE_KEY, fallback);
  const selectedGameId = GAME_CATALOG.some((game) => game.id === loaded?.selectedGameId)
    ? loaded.selectedGameId
    : null;
  const selectedTargetName = loaded?.selectedTargetName ? String(loaded.selectedTargetName) : null;
  const searchQuery = String(loaded?.searchQuery ?? "");
  const suggestionMap = {};
  const oddsPresetByGame = {};
  const sessions = {};

  GAME_CATALOG.forEach((game) => {
    suggestionMap[game.id] = Array.isArray(loaded?.suggestionMap?.[game.id])
      ? loaded.suggestionMap[game.id].map(String)
      : [];
    oddsPresetByGame[game.id] = typeof loaded?.oddsPresetByGame?.[game.id] === "string"
      ? loaded.oddsPresetByGame[game.id]
      : null;
  });

  if (loaded?.sessions && typeof loaded.sessions === "object") {
    Object.entries(loaded.sessions).forEach(([key, session]) => {
      sessions[key] = {
        encounters: Math.max(0, Number(session?.encounters) || 0),
        incrementAmount: Math.max(1, Number(session?.incrementAmount) || 1),
        decrementAmount: Math.max(1, Number(session?.decrementAmount) || 1),
        elapsedMs: Math.max(0, Number(session?.elapsedMs) || 0),
        timerStartedAt:
          session?.timerRunning && Number.isFinite(Number(session?.timerStartedAt))
            ? Number(session.timerStartedAt)
            : null,
        timerRunning: Boolean(session?.timerRunning)
      };
    });
  }

  return {
    selectedGameId,
    selectedTargetName,
    searchQuery,
    suggestionMap,
    oddsPresetByGame,
    sessions
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

function hasCompleteGameAvailabilityOrder(order, speciesSet) {
  const requiredSpecies = speciesSet instanceof Set ? speciesSet : new Set(speciesSet ?? []);
  if (!requiredSpecies.size) {
    return true;
  }

  if (!Array.isArray(order) || !order.length) {
    return false;
  }

  const orderedSpecies = new Set(order.map(Number).filter(Number.isFinite));
  if (orderedSpecies.size < requiredSpecies.size) {
    return false;
  }

  for (const speciesNumber of requiredSpecies) {
    if (!orderedSpecies.has(speciesNumber)) {
      return false;
    }
  }

  return true;
}

function hasCompleteGameAvailabilityBreakdown(detailsMap) {
  return GAME_CATALOG.every((game) => {
    const detail = detailsMap.get(game.id);
    if (!detail || !hasCompleteGameAvailabilityOrder(detail.order, detail.all)) {
      return false;
    }

    const expectedSegments = getAvailabilitySegmentSpecs(game.id);
    if (!expectedSegments.length) {
      return true;
    }

    if (!detail?.segments?.length) {
      return false;
    }

    const segmentsById = new Map(detail.segments.map((segment) => [segment.id, segment]));
    return expectedSegments.every((segment) => {
      const cachedSegment = segmentsById.get(segment.id);
      return Boolean(cachedSegment?.speciesSet instanceof Set) &&
        hasCompleteGameAvailabilityOrder(cachedSegment.order, cachedSegment.speciesSet);
    });
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

function saveShinyHubState() {
  saveProfileStoredObject(SHINY_HUB_STORAGE_KEY, state.shinyHub);
  markCloudDirty();
}

function loadProfileIntoState() {
  state.caughtMap = loadCaughtMap();
  state.duplicatePlannerDirty = true;
  state.duplicatePlannerRecords = [];
  state.shinyMap = loadShinyMap();
  state.tracker = loadTrackerState();
  state.expPlan = loadExpPlanState();
  state.notebook = loadNotebookState();
  state.favoritesMap = loadFavoritesMap();
  state.bookmarksMap = loadBookmarksMap();
  state.favoriteTypes = loadFavoriteTypesState();
  state.gameChecklistState = loadGameChecklistState();
  state.homeBoxes = loadHomeBoxesState();
  state.shinyHub = loadShinyHubState();
  state.tools = loadToolsState();
}

function switchProfile(profileId) {
  if (!state.profileMeta.profiles.some((profile) => profile.id === profileId)) {
    return;
  }

  state.profileMeta.activeProfileId = profileId;
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
  renderModuleQueue();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  void renderExpPlanner();
}

function createProfile(name) {
  const normalizedInput = String(name || "").trim();
  let normalized = normalizedInput;

  if (!normalized) {
    let nextNumber = state.profileMeta.profiles.length + 1;
    normalized = `Trainer ${nextNumber}`;
    while (state.profileMeta.profiles.some((profile) => profile.name === normalized)) {
      nextNumber += 1;
      normalized = `Trainer ${nextNumber}`;
    }
  }

  const id = `trainer-${Date.now()}`;
  state.profileMeta.profiles.push({ id, name: normalized });
  state.profileMeta.activeProfileId = id;
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
