// Shiny hub, EXP planner helpers, evolution/location intel, and duplicate planner
// Source chunk generated from the original app.js lines 8555-10929.

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

function clampPositiveInteger(value, fallback = 1) {
  const numeric = Math.floor(Number(value));
  if (!Number.isFinite(numeric) || numeric < 1) {
    return fallback;
  }
  return numeric;
}

function formatDurationClock(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
}

function formatDurationEstimate(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    return "--";
  }

  const totalMinutes = Math.round(milliseconds / 60000);
  if (totalMinutes < 60) {
    return `~${totalMinutes}m`;
  }

  const hours = totalMinutes / 60;
  if (hours < 24) {
    return `~${hours.toFixed(hours >= 10 ? 0 : 1)}h`;
  }

  const days = hours / 24;
  return `~${days.toFixed(days >= 10 ? 0 : 1)}d`;
}

function getShinyHubSelectedGame() {
  return state.shinyHub.selectedGameId ? getGameMeta(state.shinyHub.selectedGameId) : null;
}

function getGameShinyOddsConfig(gameId) {
  return GAME_SHINY_ODDS[gameId] ?? {
    base: { text: "1 / 4096", rolls: 4096 },
    defaultPresetId: "base",
    presets: [
      {
        id: "base",
        label: "Base Encounter",
        detail: "Default full-odds route.",
        text: "1 / 4096",
        rolls: 4096
      }
    ]
  };
}

function getSelectedShinyOddsPreset(gameId) {
  const config = getGameShinyOddsConfig(gameId);
  const selectedPresetId = state.shinyHub.oddsPresetByGame?.[gameId];
  return (
    config.presets.find((preset) => preset.id === selectedPresetId) ??
    config.presets.find((preset) => preset.id === config.defaultPresetId) ??
    config.presets[0]
  );
}

function setShinyHubOddsPreset(gameId, presetId) {
  if (!gameId) {
    return;
  }

  const config = getGameShinyOddsConfig(gameId);
  const nextPreset = config.presets.find((preset) => preset.id === presetId);
  if (!nextPreset) {
    return;
  }

  state.shinyHub.oddsPresetByGame[gameId] = nextPreset.id;
  saveShinyHubState();
  renderShinyHub();
}

function getGameShinyOdds(gameId) {
  const config = getGameShinyOddsConfig(gameId);
  const selectedPreset = getSelectedShinyOddsPreset(gameId);
  return {
    baseText: config.base.text,
    boostedText: selectedPreset?.text ?? config.base.text,
    boostedLabel: selectedPreset?.label ?? "Base Encounter",
    boostedDetail: selectedPreset?.detail ?? "Default full-odds route.",
    estimateRolls: selectedPreset?.rolls ?? config.base.rolls,
    presets: config.presets,
    selectedPresetId: selectedPreset?.id ?? config.defaultPresetId
  };
}

function isShinyLockedInGame(name, gameId) {
  if (isShinyDexLocked(name)) {
    return true;
  }

  return Boolean(GAME_SPECIFIC_SHINY_LOCKED_ENTRY_NAMES[gameId]?.has(name));
}

function getGameShinyHuntableEntries(gameId) {
  if (!gameId || !state.gameAvailabilityReady) {
    return [];
  }

  return getBaseEntries()
    .filter(
      (entry) => isAvailableInTrackedGameScope(entry.baseNumber, gameId) && !isShinyLockedInGame(entry.name, gameId)
    )
    .sort((left, right) => compareEntriesByGameDexOrder(left, right, gameId));
}

function getGameShinyLockedEntries(gameId) {
  if (!gameId || !state.gameAvailabilityReady) {
    return [];
  }

  return getBaseEntries()
    .filter(
      (entry) => isAvailableInTrackedGameScope(entry.baseNumber, gameId) && isShinyLockedInGame(entry.name, gameId)
    )
    .sort((left, right) => compareEntriesByGameDexOrder(left, right, gameId));
}

function getGameShinyProgress(gameId) {
  const entries = getGameShinyHuntableEntries(gameId);
  const caughtCount = entries.reduce((sum, entry) => sum + Number(isShiny(entry.name)), 0);

  return {
    entries,
    caughtCount,
    total: entries.length,
    ratio: entries.length ? caughtCount / entries.length : 0
  };
}

function getShinyHubSuggestionEntries(gameId) {
  if (!gameId) {
    return [];
  }

  const pool = getGameShinyHuntableEntries(gameId).filter((entry) => !isShiny(entry.name));
  const storedNames = state.shinyHub.suggestionMap[gameId] ?? [];
  const entriesByName = new Map(pool.map((entry) => [entry.name, entry]));
  const entries = storedNames.map((name) => entriesByName.get(name)).filter(Boolean);

  if (!entries.length && pool.length) {
    rerollShinyHubSuggestions(gameId, { silent: true });
    return getShinyHubSuggestionEntries(gameId);
  }

  return entries;
}

function rerollShinyHubSuggestions(gameId, options = {}) {
  if (!gameId) {
    return;
  }

  const { silent = false } = options;
  const pool = getGameShinyHuntableEntries(gameId).filter((entry) => !isShiny(entry.name));
  state.shinyHub.suggestionMap[gameId] = shuffleEntries(pool)
    .slice(0, 8)
    .map((entry) => entry.name);
  saveShinyHubState();

  if (!silent) {
    renderShinyHub();
  }
}

function getShinyHubSearchResults(gameId) {
  const pool = getGameShinyHuntableEntries(gameId);
  const query = normalizeSearch(state.shinyHub.searchQuery);
  if (!query) {
    return pool;
  }

  return pool.filter((entry) => buildEntrySearchBlob(entry).includes(query));
}

function getShinyHubSelectedTarget() {
  const game = getShinyHubSelectedGame();
  if (!game || !state.shinyHub.selectedTargetName) {
    return null;
  }

  return (
    getGameShinyHuntableEntries(game.id).find((entry) => entry.name === state.shinyHub.selectedTargetName) ??
    null
  );
}

function normalizeShinyHubSelection() {
  const game = getShinyHubSelectedGame();
  if (!game) {
    state.shinyHub.selectedTargetName = null;
    state.shinyHub.searchQuery = "";
    return;
  }

  const entries = getGameShinyHuntableEntries(game.id);
  if (!entries.some((entry) => entry.name === state.shinyHub.selectedTargetName)) {
    state.shinyHub.selectedTargetName = null;
  }
}

function setShinyHubGame(gameId) {
  state.shinyHub.selectedGameId = gameId || null;
  state.shinyHub.searchQuery = "";
  normalizeShinyHubSelection();
  if (state.shinyHub.selectedGameId && !(state.shinyHub.suggestionMap[state.shinyHub.selectedGameId] ?? []).length) {
    rerollShinyHubSuggestions(state.shinyHub.selectedGameId, { silent: true });
  }
  saveShinyHubState();
  renderShinyHub();
}

function setShinyHubTarget(name) {
  state.shinyHub.selectedTargetName = name || null;
  saveShinyHubState();
  renderShinyHub();
}

function getShinyHubSessionKey(gameId, targetName) {
  if (!gameId || !targetName) {
    return null;
  }

  return `${gameId}::${targetName}`;
}

function ensureShinyHubSession(gameId, targetName) {
  const key = getShinyHubSessionKey(gameId, targetName);
  if (!key) {
    return null;
  }

  if (!state.shinyHub.sessions[key]) {
    state.shinyHub.sessions[key] = createDefaultShinyHubSessionState();
  }

  return state.shinyHub.sessions[key];
}

function getActiveShinyHubSession() {
  const game = getShinyHubSelectedGame();
  const target = getShinyHubSelectedTarget();
  if (!game || !target) {
    return null;
  }

  return ensureShinyHubSession(game.id, target.name);
}

function getShinyHubSessionElapsedMs(session) {
  if (!session) {
    return 0;
  }

  return session.elapsedMs + (session.timerRunning && session.timerStartedAt ? Date.now() - session.timerStartedAt : 0);
}

function getShinyHubEncounterRate(session) {
  const elapsedHours = getShinyHubSessionElapsedMs(session) / 3600000;
  if (!session || session.encounters < 1 || elapsedHours <= 0) {
    return 0;
  }

  return session.encounters / elapsedHours;
}

function getShinyHubEstimateMs(session, gameId) {
  const pace = getShinyHubEncounterRate(session);
  if (!pace) {
    return null;
  }

  const odds = getGameShinyOdds(gameId);
  return (odds.estimateRolls / pace) * 3600000;
}

function updateShinyHubTrackerLiveMetrics() {
  const game = getShinyHubSelectedGame();
  const session = getActiveShinyHubSession();
  if (!elements.shinyTrackerTimer || !game || !session) {
    return;
  }

  const rate = getShinyHubEncounterRate(session);
  elements.shinyTrackerTimer.textContent = formatDurationClock(getShinyHubSessionElapsedMs(session));
  elements.shinyTrackerPace.textContent = rate
    ? `${Math.round(rate).toLocaleString()} enc/hr`
    : "Pace waiting";
  elements.shinyTrackerEta.textContent = formatDurationEstimate(getShinyHubEstimateMs(session, game.id));
}

function syncShinyHubTimerLoop() {
  const session = getActiveShinyHubSession();
  const shouldRun = Boolean(session?.timerRunning);

  if (!shouldRun) {
    if (state.shinyHubRuntime.intervalId) {
      window.clearInterval(state.shinyHubRuntime.intervalId);
      state.shinyHubRuntime.intervalId = null;
    }
    return;
  }

  if (state.shinyHubRuntime.intervalId) {
    return;
  }

  state.shinyHubRuntime.intervalId = window.setInterval(() => {
    if (state.ui.activeView === "shiny") {
      updateShinyHubTrackerLiveMetrics();
    }
  }, 1000);
}

function toggleShinyHubTimer() {
  const session = getActiveShinyHubSession();
  if (!session) {
    setStatus("Choose a shiny game and target before starting the hunt timer.");
    return;
  }

  if (session.timerRunning) {
    session.elapsedMs = getShinyHubSessionElapsedMs(session);
    session.timerRunning = false;
    session.timerStartedAt = null;
  } else {
    session.timerRunning = true;
    session.timerStartedAt = Date.now();
  }

  saveShinyHubState();
  renderShinyHub();
}

function resetShinyHubSession() {
  const session = getActiveShinyHubSession();
  if (!session) {
    setStatus("No active shiny hunt session is selected right now.");
    return;
  }

  Object.assign(session, createDefaultShinyHubSessionState());
  saveShinyHubState();
  renderShinyHub();
}

function adjustShinyHubEncounters(direction) {
  const session = getActiveShinyHubSession();
  if (!session) {
    setStatus("Choose a shiny target before changing the encounter counter.");
    return;
  }

  const delta =
    direction > 0 ? clampPositiveInteger(session.incrementAmount, 1) : clampPositiveInteger(session.decrementAmount, 1);
  session.encounters = Math.max(0, session.encounters + delta * direction);
  saveShinyHubState();
  renderShinyHub();
}

function updateShinyHubSessionAmount(kind, rawValue) {
  const session = getActiveShinyHubSession();
  if (!session) {
    return;
  }

  if (kind === "increment") {
    session.incrementAmount = clampPositiveInteger(rawValue, session.incrementAmount);
  } else {
    session.decrementAmount = clampPositiveInteger(rawValue, session.decrementAmount);
  }

  saveShinyHubState();
  renderShinyHub();
}

function catchSelectedShinyHubTarget() {
  const game = getShinyHubSelectedGame();
  const target = getShinyHubSelectedTarget();
  if (!game || !target) {
    setStatus("Select a shiny game and target before marking a shiny caught.");
    return;
  }

  if (isShinyLockedInGame(target.name, game.id)) {
    setStatus(`${target.displayName} is shiny-locked in ${game.name} right now.`);
    return;
  }

  setCaughtState(target.name, true);
  setShinyState(target.name, true);
  if (state.currentPokemon?.name === target.name) {
    renderCurrentPokemon(state.currentPokemon);
  }
  rerollShinyHubSuggestions(game.id, { silent: true });
  renderCollections();
  renderHomeOrganizer();
  refreshResults();
  setStatus(`${target.displayName} caught as a shiny in ${game.name}.`);
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
    option.textContent = game.name;
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
  const available = pokemon ? isAvailableInTrackedGameScope(pokemon.baseNumber, gameId) : true;
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

  if (isShinyLockedInGame(pokemon.name, gameId)) {
    const gameName = getGameMeta(gameId)?.name ?? gameId.toUpperCase();
    return {
      status: "locked",
      method: "Shiny Locked",
      detail: isShinyDexLocked(pokemon.name)
        ? `${pokemon.displayName} does not have a legitimate shiny release right now, so it is excluded from the shiny dex and hunt planner.`
        : `${pokemon.displayName} has a legal shiny somewhere in the series, but ${gameName} keeps this target shiny-locked.`,
      note: isShinyDexLocked(pokemon.name)
        ? "Keep it in the living dex, but do not count it toward shiny-dex completion until a legal shiny release exists."
        : "Use another Switch title if you want to hunt this species shiny. This particular game does not offer a legal shiny route for it.",
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

function renderShinyHelper(pokemon = state.currentPokemon, options = {}) {
  if (!shouldRenderForViews(["scan"], options.force)) {
    return;
  }

  if (!elements.huntFocus || !elements.huntSummary || !elements.huntGrid) {
    return;
  }

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

      if (isAvailableInTrackedGameScope(pokemon.baseNumber, game.id) && isShiny(pokemon.name)) {
        flags.appendChild(makeTag("Shiny Caught"));
      }

      if (flags.childElementCount) {
        card.appendChild(flags);
      }
    }

    elements.huntGrid.appendChild(card);
  });
}

function renderShinyHub(options = {}) {
  if (!shouldRenderForViews(["shiny"], options.force)) {
    return;
  }

  const shinyDexBaseEntries = getBaseEntries().filter((entry) => !isShinyDexLocked(entry.name));
  const shinyCaughtCount = shinyDexBaseEntries.reduce((sum, entry) => sum + Number(isShiny(entry.name)), 0);
  const totalRatio = shinyDexBaseEntries.length ? shinyCaughtCount / shinyDexBaseEntries.length : 0;
  const selectedGame = getShinyHubSelectedGame();

  normalizeShinyHubSelection();

  elements.shinyHubFocus.textContent = selectedGame
    ? `${selectedGame.name} · Shiny hunting grid active`
    : "Choose a game to start a hunt grid.";
  elements.shinyTotalProgressText.textContent = shinyDexBaseEntries.length
    ? `${formatPercent(totalRatio)} · ${formatCount(shinyCaughtCount)}/${formatCount(shinyDexBaseEntries.length)}`
    : "0%";
  setProgressBar(elements.shinyTotalProgressBar, totalRatio);
  elements.shinyTotalProgressNote.textContent = shinyDexBaseEntries.length
    ? "Global shiny progress across every archive entry that currently has a legal shiny release."
    : "Shiny-eligible archive entries will populate here once the dex has finished loading.";

  elements.shinyGameGrid.replaceChildren();
  GAME_CATALOG.forEach((game) => {
    const gameProgress = getGameShinyProgress(game.id);
    const displayTitle = getJourneyDisplayTitle(game.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shiny-game-button";
    button.classList.toggle("active", selectedGame?.id === game.id);
    button.addEventListener("click", () => {
      setShinyHubGame(game.id);
    });

    const title = document.createElement("strong");
    title.textContent = displayTitle;

    const detail = document.createElement("span");
    detail.textContent = !state.gameAvailabilityReady
      ? "Syncing huntable roster"
      : `${formatCount(gameProgress.caughtCount)} / ${formatCount(gameProgress.total)} shiny caught`;

    const meta = document.createElement("div");
    meta.className = "shiny-game-button-meta";
    if (state.tracker.activeGame === game.id) {
      meta.appendChild(makeTag("Active Save"));
    }
    if (state.tracker.games[game.id]?.owned) {
      meta.appendChild(makeTag("Owned"));
    }

    button.append(title, detail);
    if (meta.childElementCount) {
      button.appendChild(meta);
    }
    elements.shinyGameGrid.appendChild(button);
  });

  const hasSelectedGame = Boolean(selectedGame);
  elements.shinyGameEmpty.hidden = hasSelectedGame;
  elements.shinyGameEmpty.classList.toggle("hidden", hasSelectedGame);
  elements.shinyGameContent.hidden = !hasSelectedGame;
  elements.shinyGameContent.classList.toggle("hidden", !hasSelectedGame);

  if (!selectedGame) {
    elements.shinyGameProgressTitle.textContent = "Selected Game Shiny Progress";
    elements.shinyGameProgressText.textContent = "Select a game";
    elements.shinyGameProgressNote.textContent =
      "Pick a Switch title to unlock its shiny-huntable roster, methods, and tracker.";
    setProgressBar(elements.shinyGameProgressBar, 0);
    elements.shinyOddsChecklist.replaceChildren();
    syncShinyHubTimerLoop();
    return;
  }

  const gameProgress = getGameShinyProgress(selectedGame.id);
  const selectedTarget = getShinyHubSelectedTarget();
  const plan = selectedTarget ? getShinyPlan(selectedGame.id, selectedTarget) : null;
  const odds = getGameShinyOdds(selectedGame.id);
  const lockedEntries = getGameShinyLockedEntries(selectedGame.id);
  const searchResults = getShinyHubSearchResults(selectedGame.id);
  const visibleSearchResults = searchResults.slice(0, SHINY_HUB_RESULT_LIMIT);
  const suggestionEntries = getShinyHubSuggestionEntries(selectedGame.id);
  const session = getActiveShinyHubSession();
  const huntableReady = state.gameAvailabilityReady;
  const selectedTargetAlreadyCaught = Boolean(selectedTarget && isShiny(selectedTarget.name));

  elements.shinyGameProgressTitle.textContent = `${getJourneyDisplayTitle(selectedGame.id)} Shiny Progress`;
  elements.shinyGameProgressText.textContent = huntableReady
    ? `${formatPercent(gameProgress.ratio)} · ${formatCount(gameProgress.caughtCount)}/${formatCount(gameProgress.total)}`
    : "Syncing";
  elements.shinyGameProgressNote.textContent = huntableReady
    ? `${formatCount(gameProgress.total)} shiny-huntable species are tracked for this game right now.`
    : "The selected game's huntable roster is still syncing from the dex coverage cache.";
  setProgressBar(elements.shinyGameProgressBar, huntableReady ? gameProgress.ratio : 0);

  elements.shinyOddsBase.textContent = odds.baseText;
  elements.shinyOddsBoosted.textContent = odds.boostedText;
  elements.shinyOddsMethod.textContent = odds.boostedLabel;
  elements.shinyOddsNote.textContent = selectedTarget
    ? `${selectedTarget.displayName} is loaded below. Pick the odds setup that matches the route you are actually using so the ETA and tracker stay realistic.`
    : `${getJourneyDisplayTitle(selectedGame.id)} starts at ${odds.baseText}. Use the checklist below to match your active hunt setup.`;
  elements.shinyOddsChecklist.replaceChildren();
  odds.presets.forEach((preset) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "shiny-odds-option";
    option.classList.toggle("active", preset.id === odds.selectedPresetId);
    option.addEventListener("click", () => {
      setShinyHubOddsPreset(selectedGame.id, preset.id);
    });

    const titleRow = document.createElement("div");
    titleRow.className = "shiny-odds-option-head";

    const title = document.createElement("strong");
    title.textContent = preset.label;

    const value = document.createElement("span");
    value.className = "shiny-odds-option-value";
    value.textContent = preset.text;

    titleRow.append(title, value);

    const detail = document.createElement("p");
    detail.className = "results-summary";
    detail.textContent = preset.detail;

    option.append(titleRow, detail);
    elements.shinyOddsChecklist.appendChild(option);
  });

  elements.shinySuggestSummary.textContent = !huntableReady
    ? `Syncing the shiny-huntable roster for ${getJourneyDisplayTitle(selectedGame.id)}.`
    : suggestionEntries.length
      ? `${suggestionEntries.length} missing shiny targets are queued up for ${getJourneyDisplayTitle(selectedGame.id)}. Click one to load it into the method panel and tracker.`
      : `Everything shiny-huntable in ${getJourneyDisplayTitle(selectedGame.id)} is already caught for this profile.`;
  elements.shinySuggestSelected.textContent = selectedTarget
    ? `${selectedTarget.displayName} · ${isShiny(selectedTarget.name) ? "Shiny already caught" : "Ready to hunt"}`
    : "Choose a shiny target";
  elements.shinySuggestCatchButton.textContent = selectedTargetAlreadyCaught ? "Already Caught" : "Catch Shiny";
  elements.shinySuggestCatchButton.disabled = !huntableReady || selectedTargetAlreadyCaught;
  elements.shinySuggestRerollButton.disabled = !huntableReady || !gameProgress.total;

  elements.shinySuggestGrid.replaceChildren();
  if (!huntableReady) {
    elements.shinySuggestGrid.appendChild(
      createCollectionEmptyState("Syncing shiny-hunt suggestions for this game.")
    );
  } else if (!suggestionEntries.length) {
    elements.shinySuggestGrid.appendChild(
      createCollectionEmptyState("No uncaught shiny targets are left in this game's huntable pool.")
    );
  } else {
    suggestionEntries.forEach((entry) => {
      elements.shinySuggestGrid.appendChild(
        createSuggestedHuntTile(entry, {
          selected: entry.name === selectedTarget?.name,
          forceShiny: true,
          onSelect: (nextEntry) => {
            setShinyHubTarget(nextEntry.name);
          }
        })
      );
    });
  }

  elements.shinySearchInput.disabled = !huntableReady;
  if (elements.shinySearchInput.value !== state.shinyHub.searchQuery) {
    elements.shinySearchInput.value = state.shinyHub.searchQuery;
  }
  elements.shinySearchResultsSummary.textContent = !huntableReady
    ? `Syncing the shiny-huntable roster for ${getJourneyDisplayTitle(selectedGame.id)}.`
    : searchResults.length
      ? searchResults.length > SHINY_HUB_RESULT_LIMIT
        ? `${formatCount(searchResults.length)} huntable matches found. Showing the first ${formatCount(
            SHINY_HUB_RESULT_LIMIT
          )}; keep typing to narrow it down.`
        : `${formatCount(searchResults.length)} shiny-huntable match${searchResults.length === 1 ? "" : "es"} ready.`
      : "No shiny-huntable Pokémon matched that search in the selected game.";
  elements.shinySearchList.replaceChildren();

  if (!huntableReady) {
    elements.shinySearchList.appendChild(
      createCollectionEmptyState("The selected game's shiny hunt pool is still loading.")
    );
  } else if (!searchResults.length) {
    elements.shinySearchList.appendChild(
      createCollectionEmptyState("No shiny-huntable Pokémon matched the current search.")
    );
  } else {
    visibleSearchResults.forEach((entry) => {
      const choice = document.createElement("button");
      choice.type = "button";
      choice.className = "vault-picker-choice";
      choice.appendChild(
        createCollectionItem(
          entry,
          `${getEntryVariantLabel(entry)} · ${isShiny(entry.name) ? "Shiny Caught" : "Shiny Huntable"}`,
          isShiny(entry.name) ? ["Shiny Caught"] : ["Huntable"],
          { interactive: false, forceShiny: isShiny(entry.name) }
        )
      );
      choice.addEventListener("click", () => {
        setShinyHubTarget(entry.name);
      });
      elements.shinySearchList.appendChild(choice);
    });
  }

  elements.shinyGameLockedCount.textContent = !huntableReady
    ? "Syncing"
    : `${formatCount(lockedEntries.length)} locked`;
  elements.shinyGameLockedSummary.textContent = !huntableReady
    ? "The selected game's lock table is syncing now."
    : lockedEntries.length
      ? `These species cannot be shiny hunted inside ${getJourneyDisplayTitle(selectedGame.id)}, even if some of them can be shiny in other games.`
      : `${getJourneyDisplayTitle(selectedGame.id)} does not have any tracked game-specific shiny locks in its current huntable roster.`;
  elements.shinyGameLockedList.replaceChildren();
  if (!huntableReady) {
    elements.shinyGameLockedList.appendChild(
      createCollectionEmptyState("Syncing the game-specific shiny lock list.")
    );
  } else if (!lockedEntries.length) {
    elements.shinyGameLockedList.appendChild(
      createCollectionEmptyState("No tracked game-specific shiny locks for this title right now.")
    );
  } else {
    lockedEntries.forEach((entry) => {
      elements.shinyGameLockedList.appendChild(
        createCollectionItem(
          entry,
          `${getEntryVariantLabel(entry)} · Locked in ${selectedGame.shortName}`,
          ["Locked"],
          { interactive: true }
        )
      );
    });
  }

  elements.shinyMethodStatus.textContent = plan
    ? plan.status === "locked"
      ? "Locked"
      : plan.status === "unavailable"
        ? "Unavailable"
        : isShiny(selectedTarget?.name ?? "")
          ? "Shiny Caught"
          : "Ready"
    : "Idle";
  elements.shinyMethodTitle.textContent = selectedTarget ? selectedTarget.displayName : "No target selected";
  elements.shinyMethodSummary.textContent = selectedTarget
    ? `${selectedTarget.displayName} is loaded for ${getJourneyDisplayTitle(selectedGame.id)}.`
    : `Select a shiny-huntable Pokémon from ${getJourneyDisplayTitle(selectedGame.id)} to build a method plan.`;
  elements.shinyMethodDetail.textContent = plan
    ? plan.detail
    : "The method planner will explain the cleanest route for the selected game and target.";
  elements.shinyMethodNote.textContent = plan
    ? plan.note
    : "Pick a target from the suggestions or search panel to fill this out.";
  elements.shinyMethodTags.replaceChildren();
  if (plan?.prep?.length) {
    plan.prep.forEach((label) => {
      elements.shinyMethodTags.appendChild(makeTag(label));
    });
  } else if (selectedTarget && isShiny(selectedTarget.name)) {
    elements.shinyMethodTags.appendChild(makeTag("Shiny Caught"));
  }

  const trackerImage = elements.shinyTrackerSprite;
  elements.shinyTrackerGame.textContent = selectedGame.name;
  if (selectedTarget) {
    trackerImage.hidden = false;
    applyEntrySprite(trackerImage, selectedTarget, { forceShiny: true });
    elements.shinyTrackerTarget.textContent = selectedTarget.displayName;
    elements.shinyTrackerCount.textContent = `${formatCount(session?.encounters ?? 0)} encounter${
      (session?.encounters ?? 0) === 1 ? "" : "s"
    }`;
    elements.shinyTrackerIncrementInput.value = String(session?.incrementAmount ?? 1);
    elements.shinyTrackerDecrementInput.value = String(session?.decrementAmount ?? 1);
    elements.shinyTrackerPlusButton.disabled = false;
    elements.shinyTrackerMinusButton.disabled = false;
    elements.shinyTrackerIncrementInput.disabled = false;
    elements.shinyTrackerDecrementInput.disabled = false;
    elements.shinyTrackerStartButton.disabled = false;
    elements.shinyTrackerResetButton.disabled = false;
    elements.shinyTrackerStartButton.textContent = session?.timerRunning ? "Pause Timer" : "Start Timer";
  } else {
    trackerImage.hidden = true;
    trackerImage.removeAttribute("src");
    elements.shinyTrackerTarget.textContent = "No target selected";
    elements.shinyTrackerCount.textContent = "0 encounters";
    elements.shinyTrackerIncrementInput.value = "1";
    elements.shinyTrackerDecrementInput.value = "1";
    elements.shinyTrackerPlusButton.disabled = true;
    elements.shinyTrackerMinusButton.disabled = true;
    elements.shinyTrackerIncrementInput.disabled = true;
    elements.shinyTrackerDecrementInput.disabled = true;
    elements.shinyTrackerStartButton.disabled = true;
    elements.shinyTrackerResetButton.disabled = true;
    elements.shinyTrackerStartButton.textContent = "Start Timer";
    elements.shinyTrackerTimer.textContent = "00:00:00";
    elements.shinyTrackerPace.textContent = "Pace waiting";
    elements.shinyTrackerEta.textContent = "--";
  }

  updateShinyHubTrackerLiveMetrics();
  syncShinyHubTimerLoop();
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

function normalizePokemonDbLocationKey(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/♀/g, " female")
    .replace(/♂/g, " male")
    .replace(/type:\s*null/gi, "type null")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getPokemonDbLocationDataUrl() {
  return new URL(POKEMONDB_LOCATION_DATA_URL, document.baseURI).href;
}

async function loadPokemonDbLocationIndex() {
  if (state.pokemonDbLocationIndex) {
    return state.pokemonDbLocationIndex;
  }

  if (!state.pokemonDbLocationPromise) {
    state.pokemonDbLocationPromise = fetchJsonCached(getPokemonDbLocationDataUrl())
      .then((payload) => {
        state.pokemonDbLocationIndex = payload;
        state.pokemonDbLocationError = false;
        return payload;
      })
      .catch((error) => {
        state.pokemonDbLocationError = true;
        state.pokemonDbLocationPromise = null;
        throw error;
      });
  }

  return state.pokemonDbLocationPromise;
}

function getPokemonDbLocationLookupKeys(pokemon) {
  const keys = new Set(
    [
      pokemon?.name,
      pokemon?.speciesName,
      pokemon?.basePokemonName,
      pokemon?.displayName,
      pokemon?.baseDisplayName
    ]
      .map(normalizePokemonDbLocationKey)
      .filter(Boolean)
  );

  [...keys].forEach((key) => {
    [
      "-alola",
      "-galar",
      "-hisui",
      "-paldea",
      "-female",
      "-male",
      "-mega",
      "-gmax",
      "-origin"
    ].forEach((suffix) => {
      if (key.endsWith(suffix)) {
        keys.add(key.slice(0, -suffix.length));
      }
    });
  });

  return [...keys];
}

function getPokemonDbLocationRecords(pokemon, index) {
  const recordsByPokemon = index?.recordsByPokemon ?? {};
  for (const key of getPokemonDbLocationLookupKeys(pokemon)) {
    const records = recordsByPokemon[key];
    if (Array.isArray(records) && records.length) {
      return records;
    }
  }

  return [];
}

function formatPokemonDbVersions(versions = []) {
  const labels = {
    all: "All versions",
    lets_go_pikachu: "Let's Go Pikachu",
    lets_go_eevee: "Let's Go Eevee",
    sword: "Sword",
    shield: "Shield",
    brilliant_diamond: "Brilliant Diamond",
    shining_pearl: "Shining Pearl",
    scarlet: "Scarlet",
    violet: "Violet"
  };

  return versions.map((version) => labels[version] ?? titleCase(version.replace(/_/g, " "))).join(" / ");
}

function formatPokemonDbStatus(status) {
  switch (status) {
    case "available":
      return "Locations";
    case "transfer":
      return "Transfer";
    case "unavailable":
      return "Unavailable";
    case "unknown":
      return "Pending";
    default:
      return "PokemonDB";
  }
}

function cleanPokemonDbAreaName(area, routePrefix = "") {
  const cleaned = String(area ?? "")
    .replace(/^(?:Max Raid Battles|Mass outbreaks|Grand Underground|Underground|Pok(?:e|\u00e9) Radar):\s*/i, "")
    .replace(/\.$/, "")
    .trim();

  if (routePrefix && /^\d+[a-z]?$/i.test(cleaned)) {
    return `${routePrefix} ${cleaned}`;
  }

  return cleaned;
}

function getPokemonDbLocationAreas(record) {
  if (record?.s !== "available") {
    return [];
  }

  const unavailableTokens = ["not available", "location data not yet available", "trade", "migrate", "transfer"];
  const rawLocation = String(record.l ?? "");
  if (unavailableTokens.some((token) => rawLocation.toLowerCase().includes(token))) {
    return [];
  }

  let routePrefix = "";
  return rawLocation
    .split(/\s*(?:\||,|;)\s*/)
    .map((area) => {
      const prefixMatch = area.trim().match(/^(Route|Sea Route)\s+/i);
      if (prefixMatch) {
        routePrefix = titleCase(prefixMatch[1]);
      }
      return cleanPokemonDbAreaName(area, routePrefix);
    })
    .filter(Boolean);
}

function mergeLocationAreas(...areaGroups) {
  const merged = [];
  const seen = new Set();

  areaGroups.flat().forEach((area) => {
    const normalizedArea = normalizeMapToken(area);
    if (!normalizedArea || seen.has(normalizedArea)) {
      return;
    }

    seen.add(normalizedArea);
    merged.push(area);
  });

  return merged;
}

function groupPokemonDbRecordsByGame(records = []) {
  const grouped = new Map();

  records.forEach((record) => {
    if (!record?.g) {
      return;
    }

    if (!grouped.has(record.g)) {
      grouped.set(record.g, {
        records: [],
        availableRecords: [],
        transferRecords: [],
        unknownRecords: [],
        unavailableRecords: [],
        areas: []
      });
    }

    const group = grouped.get(record.g);
    group.records.push(record);
    if (record.s === "available") {
      group.availableRecords.push(record);
      group.areas = mergeLocationAreas(group.areas, getPokemonDbLocationAreas(record));
    } else if (record.s === "transfer") {
      group.transferRecords.push(record);
    } else if (record.s === "unknown") {
      group.unknownRecords.push(record);
    } else if (record.s === "unavailable") {
      group.unavailableRecords.push(record);
    }
  });

  return grouped;
}

function getPokemonDbVersionSummary(records = []) {
  const versions = [
    ...new Set(records.flatMap((record) => (Array.isArray(record.v) ? record.v : [])).filter(Boolean))
  ];
  return versions.length ? formatPokemonDbVersions(versions) : "";
}

function getPokemonDbSourceRows(record) {
  return [
    ...(record.pokemonDbAvailableRecords ?? []),
    ...(record.pokemonDbTransferRecords ?? []),
    ...(record.pokemonDbUnknownRecords ?? [])
  ];
}

function getPokemonDbSourceNote(record) {
  const availableVersions = getPokemonDbVersionSummary(record.pokemonDbAvailableRecords);
  if (record.pokemonDbAvailableRecords?.length && availableVersions) {
    return `PokemonDB source: ${availableVersions}.`;
  }

  const transferVersions = getPokemonDbVersionSummary(record.pokemonDbTransferRecords);
  if (record.pokemonDbTransferRecords?.length && transferVersions) {
    return `PokemonDB lists this for ${transferVersions} by transfer or migration.`;
  }

  if (record.pokemonDbUnknownRecords?.length) {
    return "PokemonDB has this game tracked, but exact location rows are still pending.";
  }

  return "";
}

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
    return `${surfaceRecord.matchedAreas.length} location${
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

function buildLocationGameRecords(pokemon, locations = [], pokemonDbRecords = []) {
  const grouped = summarizeLocationGroups(locations);
  const pokemonDbByGame = groupPokemonDbRecordsByGame(pokemonDbRecords);

  return GAME_CATALOG.map((game) => {
    const archivedAreas = [...(grouped.get(game.id) ?? [])];
    const pokemonDbGame = pokemonDbByGame.get(game.id) ?? {
      records: [],
      availableRecords: [],
      transferRecords: [],
      unknownRecords: [],
      unavailableRecords: [],
      areas: []
    };
    const areas = mergeLocationAreas(pokemonDbGame.areas, archivedAreas);
    const pokemonDbUnavailableOnly =
      pokemonDbGame.records.length > 0 && pokemonDbGame.records.every((record) => record.s === "unavailable");
    const trackedCoverageAllowsCatch =
      !state.gameAvailabilityReady || isAvailableInTrackedGameScope(pokemon.baseNumber, game.id);
    const archiveAvailable =
      trackedCoverageAllowsCatch &&
      (archivedAreas.length > 0 ||
        (state.gameAvailabilityReady && isAvailableInTrackedGameScope(pokemon.baseNumber, game.id)));
    const routeAvailable = trackedCoverageAllowsCatch && (areas.length > 0 || (!pokemonDbUnavailableOnly && archiveAvailable));
    const transferAvailable = pokemonDbGame.transferRecords.length > 0;
    const surfaceRecords = trackedCoverageAllowsCatch
      ? buildLocationSurfaceRecords(game.id, pokemon.baseNumber, areas, routeAvailable)
      : [];

    return {
      ...game,
      available: routeAvailable || transferAvailable || surfaceRecords.length > 0,
      areas,
      archivedAreas,
      pokemonDbRecords: pokemonDbGame.records,
      pokemonDbAvailableRecords: pokemonDbGame.availableRecords,
      pokemonDbTransferRecords: pokemonDbGame.transferRecords,
      pokemonDbUnknownRecords: pokemonDbGame.unknownRecords,
      baseNumber: pokemon.baseNumber,
      surfaceRecords
    };
  }).filter((record) => record.available);
}

function describeLocationRecord(record) {
  const sourceNote = getPokemonDbSourceNote(record);
  if (record.areas.length) {
    const preview = record.areas.slice(0, 4).join(" · ");
    const suffix =
      record.surfaceRecords?.length > 1
        ? ` Use the surface tabs to compare ${record.shortName}'s main-game and DLC breakdowns.`
        : "";
    const locationText = record.areas.length > 4
      ? `${preview} · +${record.areas.length - 4} more.${suffix}`
      : `${preview}.${suffix}`;
    return sourceNote ? `${locationText} ${sourceNote}` : locationText;
  }

  if (sourceNote) {
    return sourceNote;
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
  if (record.areas.length) {
    status.textContent = `${record.areas.length} location${record.areas.length === 1 ? "" : "s"}`;
  } else if (record.pokemonDbTransferRecords?.length) {
    status.textContent = "Transfer";
  } else if (record.surfaceRecords.length > 1) {
    status.textContent = `${record.surfaceRecords.length} map views`;
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
      const toolbar = document.createElement("div");
      toolbar.className = "location-map-toolbar";

      const toolbarTitle = document.createElement("strong");
      toolbarTitle.textContent = "Location Breakdown";

      const badge = document.createElement("span");
      badge.className = "location-map-badge";
      badge.textContent = `${record.shortName} · PokemonDB`;

      toolbar.append(toolbarTitle, badge);
      shell.appendChild(toolbar);

      const meta = document.createElement("div");
      meta.className = "location-map-meta";

      const sourceName = document.createElement("strong");
      sourceName.textContent = record.name;

      const sourceStatus = document.createElement("span");
      sourceStatus.className = "location-map-status";
      sourceStatus.textContent = getPokemonDbSourceRows(record).map((row) => formatPokemonDbStatus(row.s)).join(" · ");

      meta.append(sourceName, sourceStatus);
      shell.appendChild(meta);

      const sourceNote = document.createElement("p");
      sourceNote.className = "location-map-surface-note";
      sourceNote.textContent = getPokemonDbSourceNote(record);
      shell.appendChild(sourceNote);

      const legend = document.createElement("div");
      legend.className = "location-map-legend";
      getPokemonDbSourceRows(record).forEach((row) => {
        const chip = document.createElement("span");
        chip.className = "location-map-chip";
        chip.textContent = `${formatPokemonDbVersions(row.v)} · ${row.l}`;
        legend.appendChild(chip);
      });
      shell.appendChild(legend);
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
    const [locations, pokemonDbIndex] = await Promise.all([
      pokemon?.encounterUrl ? loadLocationEntries(pokemon.encounterUrl) : [],
      loadPokemonDbLocationIndex().catch(() => null)
    ]);
    if (!state.currentPokemon || state.currentPokemon.name !== pokemon.name) {
      return;
    }

    const pokemonDbRecords = getPokemonDbLocationRecords(pokemon, pokemonDbIndex);
    const records = buildLocationGameRecords(pokemon, locations, pokemonDbRecords);
    const pokemonDbLinked = records.some((record) => record.pokemonDbRecords?.length);
    elements.locationSummary.textContent = records.length
      ? `${records.length} games${pokemonDbLinked ? " · PokemonDB" : ""}`
      : "No route data";

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

async function loadSpeciesByBaseNumber(baseNumber) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${encodeURIComponent(baseNumber)}/`;
  if (state.speciesCache.has(url)) {
    return state.speciesCache.get(url);
  }

  const payload = await fetchJsonCached(url);
  state.speciesCache.set(url, payload);
  return payload;
}

const EVOLUTION_REGIONAL_FORM_TOKENS = ["alola", "galar", "hisui", "paldea"];
const EVOLUTION_FORM_PATH_GROUPS = [
  {
    key: "flower",
    familyNames: new Set(["flabebe", "floette", "florges"]),
    tokens: ["red", "yellow", "orange", "blue", "white"],
    defaultToken: "red"
  },
  {
    key: "sea",
    familyNames: new Set(["shellos", "gastrodon"]),
    tokens: ["east"],
    defaultToken: "west"
  },
  {
    key: "season",
    familyNames: new Set(["deerling", "sawsbuck"]),
    tokens: ["summer", "autumn", "winter"],
    defaultToken: "spring"
  },
  {
    key: "cloak",
    familyNames: new Set(["burmy", "wormadam"]),
    tokens: ["sandy", "trash"],
    defaultToken: "plant"
  },
  {
    key: "authenticity",
    familyNames: new Set(["sinistea", "polteageist"]),
    tokens: ["antique"],
    defaultToken: "phony"
  },
  {
    key: "matcha",
    familyNames: new Set(["poltchageist", "sinistcha"]),
    tokens: [
      { match: "artisan", path: "rare" },
      { match: "masterpiece", path: "rare" }
    ],
    defaultToken: "common"
  }
];

function getEvolutionEntryName(entry) {
  return String(entry?.name || "").trim().toLowerCase();
}

function getEvolutionEntryBaseName(entry) {
  return String(entry?.basePokemonName || entry?.name || "").trim().toLowerCase();
}

function getEvolutionEntryFormFlags(entry) {
  return new Set(Array.isArray(entry?.formFlags) ? entry.formFlags.map((flag) => String(flag).toLowerCase()) : []);
}

function getEvolutionRegionalPath(entry) {
  const name = getEvolutionEntryName(entry);
  return EVOLUTION_REGIONAL_FORM_TOKENS.find((token) => name.includes(`-${token}`)) || "base";
}

function getEvolutionGroupedFormPath(entry) {
  const baseName = getEvolutionEntryBaseName(entry);
  const name = getEvolutionEntryName(entry);
  const variantLabel = String(entry?.variantLabel || "").trim().toLowerCase();

  const group = EVOLUTION_FORM_PATH_GROUPS.find((item) => item.familyNames.has(baseName));
  if (!group) {
    return null;
  }

  const token = group.tokens.find((candidate) => {
    const match = typeof candidate === "string" ? candidate : candidate.match;
    return name === `${baseName}-${match}` || name.endsWith(`-${match}`) || variantLabel.includes(match);
  });

  if (!token && name && name !== baseName) {
    return `${group.key}:custom:${name}`;
  }

  const path = typeof token === "string" ? token : token?.path;

  return `${group.key}:${path || group.defaultToken}`;
}

function getEvolutionGenderPath(entry) {
  const name = getEvolutionEntryName(entry);
  const variantLabel = String(entry?.variantLabel || "").trim().toLowerCase();
  const genderText = `${name} ${variantLabel}`;

  if (/(^|[-\s])female($|[-\s])/.test(genderText)) {
    return "female";
  }

  if (/(^|[-\s])male($|[-\s])/.test(genderText)) {
    return "male";
  }

  return null;
}

function getEvolutionRequirementGenderPath(evolutionNode) {
  const details = Array.isArray(evolutionNode?.evolution_details) ? evolutionNode.evolution_details : [];

  if (details.some((detail) => Number(detail?.gender) === 1)) {
    return "female";
  }

  if (details.some((detail) => Number(detail?.gender) === 2)) {
    return "male";
  }

  return null;
}

function getEvolutionPathSignature(entry) {
  return {
    regionalPath: getEvolutionRegionalPath(entry),
    groupedFormPath: getEvolutionGroupedFormPath(entry),
    genderPath: getEvolutionGenderPath(entry)
  };
}

function isBlockedDuplicateEvolutionTarget(entry) {
  const name = getEvolutionEntryName(entry);
  const formFlags = getEvolutionEntryFormFlags(entry);
  return name.includes("-gmax") || name.includes("-mega") || formFlags.has("gmax") || formFlags.has("mega");
}

function canDuplicateEvolutionTargetMatchSource(sourceEntry, targetEntry, evolutionNode = null) {
  if (isBlockedDuplicateEvolutionTarget(targetEntry)) {
    return false;
  }

  if (!sourceEntry) {
    return true;
  }

  const sourcePath = getEvolutionPathSignature(sourceEntry);
  const targetPath = getEvolutionPathSignature(targetEntry);
  const requiredGenderPath = getEvolutionRequirementGenderPath(evolutionNode);

  if (sourcePath.regionalPath !== targetPath.regionalPath) {
    return false;
  }

  if (targetPath.groupedFormPath && sourcePath.groupedFormPath !== targetPath.groupedFormPath) {
    return false;
  }

  if (requiredGenderPath && sourcePath.genderPath && sourcePath.genderPath !== requiredGenderPath) {
    return false;
  }

  if (targetPath.genderPath && sourcePath.genderPath && sourcePath.genderPath !== targetPath.genderPath) {
    return false;
  }

  if (targetPath.genderPath && requiredGenderPath && targetPath.genderPath !== requiredGenderPath) {
    return false;
  }

  return true;
}

function collectMissingEvolutionCoverageTargets(node, sourceEntry = null, targets = [], seenSpecies = new Set()) {
  if (!node?.evolves_to?.length) {
    return targets;
  }

  node.evolves_to.forEach((nextNode) => {
    const speciesName = String(nextNode?.species?.name || "").trim().toLowerCase();
    if (!speciesName) {
      return;
    }

    collectMissingEvolutionSpeciesTargets(speciesName, sourceEntry, nextNode, targets, seenSpecies);
  });

  node.evolves_to.forEach((nextNode) => {
    collectMissingEvolutionCoverageTargets(nextNode, sourceEntry, targets, seenSpecies);
  });

  return targets;
}

function getEvolutionCoverageEntriesForSpecies(speciesName, sourceEntry = null, evolutionNode = null) {
  const normalizedName = String(speciesName || "").trim().toLowerCase();
  if (!normalizedName) {
    return [];
  }

  return state.entries
    .filter((entry) => {
      const entryName = String(entry.name || "").trim().toLowerCase();
      const entryBaseName = String(entry.basePokemonName || entry.name || "").trim().toLowerCase();
      return entryName === normalizedName || entryBaseName === normalizedName;
    })
    .filter((entry) => canDuplicateEvolutionTargetMatchSource(sourceEntry, entry, evolutionNode))
    .sort(compareEntriesWithinGroup);
}

function collectMissingEvolutionSpeciesTargets(speciesName, sourceEntry, evolutionNode, targets, seenTargets) {
  const normalizedName = String(speciesName || "").trim().toLowerCase();
  const coverageEntries = getEvolutionCoverageEntriesForSpecies(normalizedName, sourceEntry, evolutionNode);

  if (!coverageEntries.length) {
    if (!seenTargets.has(normalizedName) && !sourceEntry && !isCaught(normalizedName)) {
      seenTargets.add(normalizedName);
      targets.push({
        speciesName: normalizedName,
        entryName: normalizedName,
        displayName: titleCase(normalizedName)
      });
    }
    return;
  }

  coverageEntries.forEach((entry) => {
    const entryName = String(entry.name || "").trim().toLowerCase();
    if (!entryName || seenTargets.has(entryName) || isCaught(entry.name)) {
      return;
    }

    seenTargets.add(entryName);
    targets.push({
      speciesName: normalizedName,
      entryName,
      displayName: entry.displayName || titleCase(entryName)
    });
  });
}

function summarizeDuplicateEvolutionAssignments(assignments = []) {
  const groupedAssignments = [];

  assignments.forEach((assignment) => {
    const speciesName = String(assignment?.speciesName || "").trim().toLowerCase();
    const entryName = String(assignment?.entryName || speciesName).trim().toLowerCase();
    if (!entryName) {
      return;
    }

    const existing = groupedAssignments.find((item) => item.entryName === entryName);
    if (existing) {
      existing.count += 1;
      return;
    }

    groupedAssignments.push({
      speciesName,
      entryName,
      displayName: assignment.displayName || titleCase(speciesName),
      count: 1
    });
  });

  return groupedAssignments;
}

function formatDuplicateEvolutionAssignments(assignments = []) {
  const groupedAssignments = summarizeDuplicateEvolutionAssignments(assignments);
  const parts = groupedAssignments.map(
    (assignment) => `${formatCount(assignment.count)} to ${assignment.displayName}`
  );

  if (!parts.length) {
    return "";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return `${parts[0]} and ${parts[1]}`;
  }

  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function getDuplicatePlannerEntries() {
  return state.entries
    .filter((entry) => getDuplicateCount(entry.name) > 0)
    .sort(
      (left, right) =>
        getDuplicateCount(right.name) - getDuplicateCount(left.name) ||
        left.baseNumber - right.baseNumber ||
        compareEntriesWithinGroup(left, right)
    );
}

function buildDuplicatePlannerRecordNote(record) {
  const steps = [`${formatCount(record.duplicateCount)} extra ${record.duplicateCount === 1 ? "copy" : "copies"} ready.`];

  if (record.evolveCount > 0) {
    steps.push(`Evolve ${formatDuplicateEvolutionAssignments(record.evolveAssignments)}.`);
  }

  if (record.tradeCount > 0) {
    const tradeTargetLabel =
      record.tradeCount === 1 ? "the remaining copy" : `the remaining ${formatCount(record.tradeCount)} copies`;
    steps.push(
      record.evolveCount > 0 || record.releaseCount > 0
        ? `Wonder trade ${tradeTargetLabel}.`
        : `Wonder trade ${formatCount(record.tradeCount)} ${record.tradeCount === 1 ? "copy" : "copies"}.`
    );
  }

  if (record.releaseCount > 0) {
    steps.push(
      record.evolveCount > 0 || record.tradeCount > 0
        ? `Release ${record.releaseCount === 1 ? "the last copy" : `the last ${formatCount(record.releaseCount)} copies`}.`
        : `Release ${formatCount(record.releaseCount)} ${record.releaseCount === 1 ? "copy" : "copies"}.`
    );
  }

  if (!record.evolutionDataReady && record.evolveCount === 0) {
    steps.push("Evolution data is still syncing, so extras are staged for trading first.");
  }

  return steps.join(" ");
}

async function buildDuplicatePlannerRecord(entry) {
  const caughtCount = getCaughtCount(entry.name);
  const duplicateCount = getDuplicateCount(entry.name);
  let evolveCount = 0;
  let evolveAssignments = [];
  let evolutionDataReady = false;

  try {
    const species = await loadSpeciesByBaseNumber(entry.baseNumber);
    const chain = await loadEvolutionChain(species.evolution_chain?.url ?? "");
    const speciesName = entry.basePokemonName ?? species.name ?? entry.name;
    const currentNode = findEvolutionNode(chain?.chain, speciesName);
    const missingCoverageTargets = collectMissingEvolutionCoverageTargets(currentNode, entry);
    evolveAssignments = missingCoverageTargets.slice(0, duplicateCount);
    evolveCount = evolveAssignments.length;
    evolutionDataReady = true;
  } catch {
    evolveCount = 0;
    evolveAssignments = [];
  }

  const remainingCount = Math.max(0, duplicateCount - evolveCount);
  const tradeCapacity = 3;
  const tradeCount = Math.min(remainingCount, tradeCapacity);
  const releaseCount = Math.max(0, remainingCount - tradeCount);
  const recommendedAction = evolveCount > 0 ? "evolve" : tradeCount > 0 ? "trade" : "release";
  const tags = [`Dupes ${formatCount(duplicateCount)}`];
  const evolveTargets = summarizeDuplicateEvolutionAssignments(evolveAssignments).map(
    (assignment) => assignment.displayName
  );

  if (evolveCount > 0) {
    tags.push(`Evolve ${formatCount(evolveCount)}`);
  }
  if (tradeCount > 0) {
    tags.push(`Trade ${formatCount(tradeCount)}`);
  }
  if (releaseCount > 0) {
    tags.push(`Release ${formatCount(releaseCount)}`);
  }

  const record = {
    entry,
    caughtCount,
    duplicateCount,
    evolveCount,
    evolveAssignments,
    evolveTargets,
    tradeCount,
    releaseCount,
    evolutionDataReady,
    recommendedAction,
    tags
  };

  return {
    ...record,
    note: buildDuplicatePlannerRecordNote(record)
  };
}

function getFilteredDuplicatePlannerRecords(records = state.duplicatePlannerRecords) {
  switch (state.ui.duplicatePlannerFilter) {
    case "evolve":
      return records.filter((record) => record.evolveCount > 0);
    case "trade":
      return records.filter((record) => record.tradeCount > 0);
    case "release":
      return records.filter((record) => record.releaseCount > 0);
    case "all":
    default:
      return records;
  }
}

function sortDuplicatePlannerRecords(records) {
  const actionRank = { evolve: 0, trade: 1, release: 2 };
  return [...records].sort(
    (left, right) =>
      actionRank[left.recommendedAction] - actionRank[right.recommendedAction] ||
      right.duplicateCount - left.duplicateCount ||
      left.entry.baseNumber - right.entry.baseNumber ||
      compareEntriesWithinGroup(left.entry, right.entry)
  );
}

function renderDuplicatePlannerFilterButtons() {
  elements.duplicatePlannerFilterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.duplicateFilter === state.ui.duplicatePlannerFilter);
  });
}

function renderDuplicatePlannerRecords(records, totalDuplicateCopies) {
  const filteredRecords = getFilteredDuplicatePlannerRecords(records);
  const evolveTotal = records.reduce((sum, record) => sum + record.evolveCount, 0);
  const tradeTotal = records.reduce((sum, record) => sum + record.tradeCount, 0);
  const releaseTotal = records.reduce((sum, record) => sum + record.releaseCount, 0);

  elements.duplicatePlannerCount.textContent = formatCount(totalDuplicateCopies);
  elements.duplicatePlannerSummary.textContent =
    state.ui.duplicatePlannerFilter === "all"
      ? `${formatCount(totalDuplicateCopies)} extra copies across ${formatCount(records.length)} entries. Evolve ${formatCount(
          evolveTotal
        )}, wonder trade ${formatCount(tradeTotal)}, release ${formatCount(releaseTotal)}.`
      : state.ui.duplicatePlannerFilter === "evolve"
        ? `${formatCount(evolveTotal)} extra copies can still fill unregistered evolutions.`
        : state.ui.duplicatePlannerFilter === "trade"
          ? `${formatCount(tradeTotal)} extra copies are staged for wonder trades.`
          : `${formatCount(releaseTotal)} extra copies are safe to release after the higher-value actions are done.`;

  elements.duplicatePlannerList.replaceChildren();
  if (!filteredRecords.length) {
    const emptyMessages = {
      all: "No duplicate living-dex copies are tracked yet.",
      evolve: "No tracked duplicates are currently needed for missing evolutions.",
      trade: "No tracked duplicates are currently staged for wonder trades.",
      release: "No tracked duplicates are currently queued for release."
    };
    elements.duplicatePlannerList.appendChild(
      createCollectionEmptyState(emptyMessages[state.ui.duplicatePlannerFilter] ?? emptyMessages.all)
    );
    return;
  }

  filteredRecords.forEach((record) => {
    elements.duplicatePlannerList.appendChild(
      createCollectionItem(record.entry, record.note, record.tags)
    );
  });
}

function renderDuplicatePlanner() {
  const duplicateEntries = getDuplicatePlannerEntries();
  const totalDuplicateCopies = duplicateEntries.reduce((sum, entry) => sum + getDuplicateCount(entry.name), 0);

  renderDuplicatePlannerFilterButtons();

  if (!duplicateEntries.length) {
    state.duplicatePlannerRecords = [];
    state.duplicatePlannerDirty = false;
    elements.duplicatePlannerCount.textContent = "0";
    elements.duplicatePlannerSummary.textContent =
      "Track more than one copy in the living dex and PokéPilot will sort the extras into evolve, wonder trade, and release routes here.";
    elements.duplicatePlannerList.replaceChildren(
      createCollectionEmptyState("No duplicate living-dex copies are tracked yet.")
    );
    return;
  }

  if (!state.duplicatePlannerDirty && state.duplicatePlannerRecords.length) {
    renderDuplicatePlannerRecords(state.duplicatePlannerRecords, totalDuplicateCopies);
    return;
  }

  const requestToken = ++state.duplicatePlannerRequestToken;
  elements.duplicatePlannerCount.textContent = formatCount(totalDuplicateCopies);
  elements.duplicatePlannerSummary.textContent = `Analyzing ${formatCount(totalDuplicateCopies)} extra living-dex copies.`;
  elements.duplicatePlannerList.replaceChildren(
    createCollectionEmptyState("Scanning evolution lines and duplicate action routes.")
  );

  void Promise.all(duplicateEntries.map((entry) => buildDuplicatePlannerRecord(entry)))
    .then((records) => {
      if (requestToken !== state.duplicatePlannerRequestToken) {
        return;
      }

      state.duplicatePlannerRecords = sortDuplicatePlannerRecords(records);
      state.duplicatePlannerDirty = false;
      renderDuplicatePlannerRecords(state.duplicatePlannerRecords, totalDuplicateCopies);
    })
    .catch(() => {
      if (requestToken !== state.duplicatePlannerRequestToken) {
        return;
      }

      elements.duplicatePlannerSummary.textContent =
        "Duplicate counts are still tracked, but the evolve / trade / release planner could not finish loading right now.";
      elements.duplicatePlannerList.replaceChildren(
        createCollectionEmptyState("Duplicate planning is temporarily offline.")
      );
    });
}
