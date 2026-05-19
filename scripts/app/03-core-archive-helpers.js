// Caught/shiny helpers, game ownership, suggestions, favorites, and archive controls
// Source chunk generated from the original app.js lines 3655-4398.

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
  return getCaughtCount(name) > 0;
}

function normalizeCaughtCount(value) {
  if (value === true) {
    return 1;
  }

  const numeric = Math.floor(Number(value) || 0);
  return numeric > 0 ? numeric : 0;
}

function normalizeCaughtMap(rawMap = {}) {
  const normalized = {};

  if (!rawMap || typeof rawMap !== "object" || Array.isArray(rawMap)) {
    return normalized;
  }

  Object.entries(rawMap).forEach(([name, value]) => {
    const normalizedName = String(name || "").trim();
    const count = normalizeCaughtCount(value);
    if (normalizedName && count > 0) {
      normalized[normalizedName] = count;
    }
  });

  return normalized;
}

function getCaughtCount(name) {
  return normalizeCaughtCount(state.caughtMap[name]);
}

function getDuplicateCount(name) {
  return Math.max(0, getCaughtCount(name) - 1);
}

function getCaughtStatusLabel(name) {
  const count = getCaughtCount(name);
  if (count <= 0) {
    return "Missing";
  }
  if (count === 1) {
    return "Caught";
  }
  return `Owned x${formatCount(count)}`;
}

function getCaughtCountSummary(count) {
  if (count <= 0) {
    return "No copies tracked";
  }
  if (count === 1) {
    return "1 living copy tracked";
  }
  return `${formatCount(count)} living copies tracked`;
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
  setCaughtCount(name, value ? Math.max(1, getCaughtCount(name)) : 0);
}

function setCaughtCount(name, value) {
  const count = normalizeCaughtCount(value);
  const previousCount = getCaughtCount(name);

  if (count > 0) {
    state.caughtMap[name] = count;
  } else {
    delete state.caughtMap[name];
  }

  if (count !== previousCount) {
    state.duplicatePlannerDirty = true;
  }

  saveCaughtMap();
  return count;
}

function changeCaughtCount(name, delta) {
  return setCaughtCount(name, getCaughtCount(name) + delta);
}

function setShinyState(name, value) {
  if (value) {
    state.shinyMap[name] = true;
  } else {
    delete state.shinyMap[name];
  }

  saveShinyMap();
}

function normalizeUndoNames(names = []) {
  const list = Array.isArray(names) ? names : [names];
  return [...new Set(list.map((name) => String(name || "").trim()).filter(Boolean))];
}

function getHomeBoxedSnapshotValue(name) {
  return typeof isBoxedInHome === "function" ? isBoxedInHome(name) : Boolean(state.homeBoxes.boxedMap[name]);
}

function recordUndoAction({ label, caughtNames = [], shinyNames = [], homeNames = [] } = {}) {
  const caught = normalizeUndoNames(caughtNames).map((name) => ({
    name,
    count: getCaughtCount(name)
  }));
  const shiny = normalizeUndoNames(shinyNames).map((name) => ({
    name,
    value: isShiny(name)
  }));
  const home = normalizeUndoNames(homeNames).map((name) => ({
    name,
    value: getHomeBoxedSnapshotValue(name)
  }));

  if (!caught.length && !shiny.length && !home.length) {
    return;
  }

  state.lastUndoAction = {
    label: label || "last action",
    caught,
    shiny,
    home
  };
  renderUndoActionButton();
}

function clearLastUndoAction() {
  state.lastUndoAction = null;
  renderUndoActionButton();
}

function renderUndoActionButton() {
  if (!elements.undoActionButton) {
    return;
  }

  const action = state.lastUndoAction;
  elements.undoActionButton.disabled = !action;
  elements.undoActionButton.textContent = action ? "Undo Last" : "Undo";
  elements.undoActionButton.title = action
    ? `Undo ${action.label}`
    : "Undo the latest catch, shiny, duplicate, or HOME box change.";
}

function restoreHomeBoxedSnapshot(name, value) {
  if (value) {
    state.homeBoxes.boxedMap[name] = true;
  } else {
    delete state.homeBoxes.boxedMap[name];
  }
}

function refreshAfterUndoAction(action) {
  refreshResults();
  renderCollections();
  renderHomeOrganizer();

  if (action.shiny.length) {
    renderShinyHub();
  }

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function undoLastAction() {
  const action = state.lastUndoAction;
  if (!action) {
    setStatus("No catch, shiny, duplicate, or HOME box change is waiting to undo.");
    return;
  }

  action.caught.forEach(({ name, count }) => {
    setCaughtCount(name, count);
  });
  action.shiny.forEach(({ name, value }) => {
    setShinyState(name, value);
  });
  action.home.forEach(({ name, value }) => {
    restoreHomeBoxedSnapshot(name, value);
  });

  if (action.home.length) {
    saveHomeBoxesState();
  }

  state.lastUndoAction = null;
  refreshAfterUndoAction(action);
  renderUndoActionButton();
  setStatus(`Undid ${action.label}.`);
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

function getAvailabilitySegmentsForDlcScope(gameId, includeDlc = true) {
  const detail = state.gameAvailabilityDetailsByGame.get(gameId);
  const segments = (detail?.segments ?? []).filter((segment) => segment?.speciesSet?.size);

  if (!segments.length) {
    return null;
  }

  return includeDlc ? segments : segments.filter((segment) => segment.kind !== "dlc");
}

function isAvailableInGameDlcScope(baseNumber, gameId, includeDlc = true) {
  const segments = getAvailabilitySegmentsForDlcScope(gameId, includeDlc);

  if (!segments) {
    return isAvailableInGame(baseNumber, gameId);
  }

  return segments.some((segment) => segment.speciesSet.has(baseNumber));
}

function isAvailableInTrackedGameScope(baseNumber, gameId) {
  const includeDlc = !gameHasDlcCoverage(gameId) || trackerHasDlc(gameId);
  return isAvailableInGameDlcScope(baseNumber, gameId, includeDlc);
}

function isAvailableInOwnedGameSelection(baseNumber, gameId) {
  const game = getGameMeta(gameId);
  const trackerGameState = state.tracker.games[gameId];

  if (!game || !trackerGameState?.owned) {
    return false;
  }

  if (!isAvailableInTrackedGameScope(baseNumber, gameId)) {
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

function isEntryAvailableInOwnedGameSelection(entry, gameId) {
  if (!entry || !gameId || gameId === "all") {
    return true;
  }

  if (!isAvailableInOwnedGameSelection(entry.baseNumber, gameId)) {
    return false;
  }

  const supportedGames = getEntryGameSupport(entry);
  return supportedGames ? supportedGames.has(gameId) : true;
}

function isEntryExclusiveToOwnedGameSelection(entry, gameId) {
  if (!entry || !gameId || gameId === "all") {
    return false;
  }

  if (!isEntryAvailableInOwnedGameSelection(entry, gameId)) {
    return false;
  }

  return !getOwnedGameIds()
    .filter((ownedGameId) => ownedGameId !== gameId)
    .some((ownedGameId) => isEntryAvailableInOwnedGameSelection(entry, ownedGameId));
}

function isAvailableViaOwnedDynamaxAdventure(baseNumber) {
  const trackerGameState = state.tracker.games.swsh;
  if (!trackerGameState?.owned || !trackerHasDlc("swsh")) {
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

function isEntryAvailableInOwnedCoverage(entry) {
  if (!entry) {
    return false;
  }

  const ownedGames = getOwnedGameIds();

  if (!ownedGames.length || !state.gameAvailabilityReady) {
    return false;
  }

  return (
    ownedGames.some((gameId) => isEntryAvailableInOwnedGameSelection(entry, gameId)) ||
    (!entry.isForm && isAvailableViaOwnedDynamaxAdventure(entry.baseNumber))
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

function refreshSuggestedCatchBadgeSeed() {
  state.suggestedCatchBadgeSeed = Math.floor(Math.random() * 2147483647);
}

function isSuggestableLivingEntry(entry) {
  return !entry.isForm || entry.syntheticKind === "gender" || entry.syntheticKind === "appearance";
}

function refreshRandomTargets() {
  const missingBaseEntries = state.entries.filter((entry) => isSuggestableLivingEntry(entry) && !isCaught(entry.name));
  const catchPool =
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? missingBaseEntries.filter((entry) => isAvailableInOwnedCoverage(entry.baseNumber))
      : missingBaseEntries;
  const shinyEligibleBaseEntries = missingBaseEntries.filter((entry) => !entry.isForm && !isShinyDexLocked(entry.name));
  const shinyPool =
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? shinyEligibleBaseEntries.filter(
          (entry) => !isShiny(entry.name) && isAvailableInOwnedCoverage(entry.baseNumber)
        )
      : shinyEligibleBaseEntries.filter((entry) => !isShiny(entry.name));
  refreshSuggestedCatchBadgeSeed();
  state.randomTargets = shuffleEntries(catchPool).slice(0, 8);
  state.shinyTargets = shuffleEntries(shinyPool).slice(0, 2);
  ensureSuggestedBoardSelections();
}

function rerollRandomTargetBoard() {
  const missingBaseEntries = state.entries.filter((entry) => isSuggestableLivingEntry(entry) && !isCaught(entry.name));
  const catchPool =
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? missingBaseEntries.filter((entry) => isAvailableInOwnedCoverage(entry.baseNumber))
      : missingBaseEntries;
  refreshSuggestedCatchBadgeSeed();
  state.randomTargets = shuffleEntries(catchPool).slice(0, 8);
  state.ui.selectedRandomTargetName = null;
  ensureSuggestedBoardSelections();
}

function rerollShinyTargetBoard() {
  const missingBaseEntries = state.entries.filter((entry) => !entry.isForm && !isCaught(entry.name));
  const shinyEligibleBaseEntries = missingBaseEntries.filter((entry) => !isShinyDexLocked(entry.name));
  const shinyPool =
    getOwnedGameIds().length && state.gameAvailabilityReady
      ? shinyEligibleBaseEntries.filter(
          (entry) => !isShiny(entry.name) && isAvailableInOwnedCoverage(entry.baseNumber)
        )
      : shinyEligibleBaseEntries.filter((entry) => !isShiny(entry.name));
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
  if (!isCaught(target.name)) {
    recordUndoAction({
      label: `${target.displayName} hunt-board catch`,
      caughtNames: [target.name]
    });
  }
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
    setStatus(`${target.displayName} is shiny-locked and cannot be caught in the shiny dex.`);
    return;
  }

  state.ui.landingActionMode = null;
  state.ui.selectedShinyTargetName = null;
  if (!isCaught(target.name) || !isShiny(target.name)) {
    recordUndoAction({
      label: `${target.displayName} hunt-board shiny`,
      caughtNames: [target.name],
      shinyNames: [target.name]
    });
  }
  setCaughtState(target.name, true);
  setShinyState(target.name, true);

  if (state.currentPokemon?.name === target.name) {
    renderCurrentPokemon(state.currentPokemon);
  }

  renderCollections();
  renderHomeOrganizer();
  refreshResults();
  setStatus(`${target.displayName} caught as a shiny target from the hunt board.`);
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
  return isArchiveShinyMode() ? "Caught Shiny" : "Caught";
}

function getArchiveMissingLabel() {
  return isArchiveShinyMode() ? "Missing Shiny" : "Missing";
}

function getArchiveOwnedMissingLabel() {
  return isArchiveShinyMode() ? "Owned Hunts" : "Owned Gaps";
}

function isArchiveTracked(name) {
  return isArchiveShinyMode() ? isShiny(name) : isCaught(name);
}

function getArchiveOwnedGameOnlyFilterMeta() {
  if (state.filters.game === "all") {
    return {
      enabled: false,
      selectedGame: null,
      comparisonGameCount: 0,
      note: "Pick a Switch game first to compare its unique roster against your owned saves."
    };
  }

  const selectedGame = getGameMeta(state.filters.game);
  if (!selectedGame || !state.tracker.games[selectedGame.id]?.owned) {
    return {
      enabled: false,
      selectedGame,
      comparisonGameCount: 0,
      note: selectedGame
        ? `Mark ${selectedGame.shortName} as owned in Journey to compare what is unique to it.`
        : "Pick a tracked Switch game to compare its unique roster."
    };
  }

  const comparisonGameCount = getOwnedGameIds().filter((gameId) => gameId !== selectedGame.id).length;
  return {
    enabled: true,
    selectedGame,
    comparisonGameCount,
    note: comparisonGameCount
      ? `Show entries that only appear in ${selectedGame.shortName} compared with your other owned games.`
      : `${selectedGame.shortName} is your only owned game right now, so this will show everything obtainable there.`
  };
}

function normalizeArchiveGameFilters() {
  if (!getArchiveOwnedGameOnlyFilterMeta().enabled) {
    state.filters.ownedGameOnly = false;
  }
}

function setArchiveMode(mode) {
  if (!mode || state.ui.archiveMode === mode) {
    return;
  }

  state.ui.archiveMode = mode;
  saveUiSessionState();
  refreshResults();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function setArchiveView(view) {
  if (!VALID_ARCHIVE_VIEW_IDS.has(view) || state.ui.archiveView === view) {
    return;
  }

  state.ui.archiveView = view;
  saveUiSessionState();
  refreshResults();
}

function isArchiveDuplicateMode() {
  return state.ui.archiveDuplicateMode && !isArchiveShinyMode();
}

function setArchiveDuplicateMode(enabled) {
  const nextValue = Boolean(enabled);
  if (state.ui.archiveDuplicateMode === nextValue) {
    return;
  }

  state.ui.archiveDuplicateMode = nextValue;
  saveUiSessionState();
  refreshResults();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function setDuplicatePlannerFilter(filterId) {
  if (!VALID_DUPLICATE_FILTER_IDS.has(filterId) || state.ui.duplicatePlannerFilter === filterId) {
    return;
  }

  state.ui.duplicatePlannerFilter = filterId;
  saveUiSessionState();
  renderDuplicatePlanner();
}

function getPrimaryGameEntry(baseNumber) {
  const ownedGames = getOwnedGameIds();
  if (!state.gameAvailabilityReady) {
    return getGameMeta(getActiveGameId()) ?? (ownedGames[0] ? getGameMeta(ownedGames[0]) : null);
  }
  const ownedMatch = ownedGames.find((gameId) => isAvailableInOwnedGameSelection(baseNumber, gameId));
  return ownedMatch ? getGameMeta(ownedMatch) : null;
}
