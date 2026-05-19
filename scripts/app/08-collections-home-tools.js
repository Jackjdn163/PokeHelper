// Collection rendering, trainer vault, HOME organizer, and tool workbench
// Source chunk generated from the original app.js lines 10931-12503.

const ACHIEVEMENT_STARTER_NAMES = [
  "bulbasaur",
  "charmander",
  "squirtle",
  "chikorita",
  "cyndaquil",
  "totodile",
  "treecko",
  "torchic",
  "mudkip",
  "turtwig",
  "chimchar",
  "piplup",
  "snivy",
  "tepig",
  "oshawott",
  "chespin",
  "fennekin",
  "froakie",
  "rowlet",
  "litten",
  "popplio",
  "grookey",
  "scorbunny",
  "sobble",
  "sprigatito",
  "fuecoco",
  "quaxly"
];
const ACHIEVEMENT_KANTO_STARTERS = ["bulbasaur", "charmander", "squirtle"];
const ACHIEVEMENT_EEVEELUTIONS = [
  "eevee",
  "vaporeon",
  "jolteon",
  "flareon",
  "espeon",
  "umbreon",
  "leafeon",
  "glaceon",
  "sylveon"
];
const ACHIEVEMENT_PSEUDO_BASES = [
  "dratini",
  "larvitar",
  "bagon",
  "beldum",
  "gible",
  "deino",
  "goomy",
  "jangmo-o",
  "dreepy",
  "frigibax"
];

function createThresholdAchievement(id, title, detail, target, getValue, tone = "standard") {
  return {
    id,
    title,
    detail,
    target,
    tone,
    evaluate(context) {
      const current = Math.max(0, Number(getValue(context)) || 0);
      return {
        current,
        target,
        unlocked: target > 0 && current >= target
      };
    }
  };
}

function createGenerationAchievement(label) {
  return {
    id: `completed-gen-${label}`,
    title: `Completed Gen ${label}`,
    detail: `Catch every base species from Generation ${label}.`,
    target: 1,
    tone: "generation",
    evaluate(context) {
      const record = context.generationMap.get(label);
      const total = Number(record?.total) || 0;
      const current = Number(record?.caughtCount) || 0;
      return {
        current,
        target: total || 1,
        unlocked: total > 0 && current >= total
      };
    }
  };
}

function createNameSetAchievement(id, title, detail, names, tone = "collection") {
  return {
    id,
    title,
    detail,
    target: names.length,
    tone,
    evaluate(context) {
      const current = context.countCaughtNames(names);
      return {
        current,
        target: names.length,
        unlocked: current >= names.length
      };
    }
  };
}

const ACHIEVEMENT_DEFINITIONS = [
  createThresholdAchievement("first-catch", "First Catch", "Register your first living-dex Pokémon.", 1, (context) => context.caughtBaseCount),
  createThresholdAchievement("twenty-five-species", "25 Species Logged", "Catch 25 base species.", 25, (context) => context.caughtBaseCount),
  createThresholdAchievement("fifty-species", "50 Species Logged", "Catch 50 base species.", 50, (context) => context.caughtBaseCount),
  createThresholdAchievement("hundred-species", "100 Species Logged", "Catch 100 base species.", 100, (context) => context.caughtBaseCount),
  createThresholdAchievement("kanto-count", "151 Club", "Catch 151 base species.", 151, (context) => context.caughtBaseCount),
  createThresholdAchievement("quarter-dex", "250 Species Logged", "Catch 250 base species.", 250, (context) => context.caughtBaseCount),
  createThresholdAchievement("five-hundred-species", "500 Species Logged", "Catch 500 base species.", 500, (context) => context.caughtBaseCount),
  createThresholdAchievement("seven-fifty-species", "750 Species Logged", "Catch 750 base species.", 750, (context) => context.caughtBaseCount),
  createThresholdAchievement("thousand-species", "1,000 Species Logged", "Catch 1,000 base species.", 1000, (context) => context.caughtBaseCount),
  ...GENERATION_RANGES.map((range) => createGenerationAchievement(range.label)),
  createThresholdAchievement("first-shiny", "First Shiny", "Log your first shiny Pokémon.", 1, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("ten-shinies", "10 Shinies", "Log 10 shiny Pokémon.", 10, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("twenty-five-shinies", "25 Shinies", "Log 25 shiny Pokémon.", 25, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("fifty-shinies", "50 Shinies", "Log 50 shiny Pokémon.", 50, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("hundred-shinies", "100 Shinies", "Log 100 shiny Pokémon.", 100, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("two-fifty-shinies", "250 Shinies", "Log 250 shiny Pokémon.", 250, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("five-hundred-shinies", "500 Shinies", "Log 500 shiny Pokémon.", 500, (context) => context.shinyEntryCount, "shiny"),
  createThresholdAchievement("first-home-slot", "First HOME Slot", "Place your first Pokémon into a HOME box slot.", 1, (context) => context.boxedCount, "home"),
  createThresholdAchievement("twenty-five-home", "25 HOME Slots Filled", "Fill 25 HOME organizer slots.", 25, (context) => context.boxedCount, "home"),
  createThresholdAchievement("fifty-home", "50 HOME Slots Filled", "Fill 50 HOME organizer slots.", 50, (context) => context.boxedCount, "home"),
  createThresholdAchievement("hundred-home", "100 HOME Slots Filled", "Fill 100 HOME organizer slots.", 100, (context) => context.boxedCount, "home"),
  createThresholdAchievement("two-fifty-home", "250 HOME Slots Filled", "Fill 250 HOME organizer slots.", 250, (context) => context.boxedCount, "home"),
  createThresholdAchievement("five-hundred-home", "500 HOME Slots Filled", "Fill 500 HOME organizer slots.", 500, (context) => context.boxedCount, "home"),
  createThresholdAchievement("first-save", "First Save Tracked", "Mark one game as owned in Journey.", 1, (context) => context.ownedGameCount, "journey"),
  createThresholdAchievement("three-games", "Three Games Tracked", "Track three owned games.", 3, (context) => context.ownedGameCount, "journey"),
  createThresholdAchievement("all-games", "Current Library Set", "Track every current game family.", GAME_CATALOG.length, (context) => context.ownedGameCount, "journey"),
  createThresholdAchievement(
    "all-releases",
    "Full Release Shelf",
    "Track every individual current release.",
    GAME_CATALOG.reduce((sum, game) => sum + Math.max(1, getGameVersions(game).length), 0),
    (context) => context.ownedReleaseCount,
    "journey"
  ),
  createThresholdAchievement("active-save", "Active Save Set", "Choose an active Journey save.", 1, (context) => context.activeSaveSet, "journey"),
  createThresholdAchievement("first-clear", "First Game Cleared", "Mark one tracked game as cleared.", 1, (context) => context.clearedCount, "journey"),
  createThresholdAchievement("three-clears", "Three Games Cleared", "Clear three tracked game journeys.", 3, (context) => context.clearedCount, "journey"),
  createThresholdAchievement("dlc-ready", "DLC Ready", "Mark DLC ownership for at least one supported game.", 1, (context) => context.dlcOwnedCount, "journey"),
  createThresholdAchievement("first-favorite", "First Favorite", "Add one Pokémon to your Vault favorites.", 1, (context) => context.favoriteCount, "social"),
  createThresholdAchievement("five-favorites", "Favorite Five", "Add five Pokémon to your Vault favorites.", 5, (context) => context.favoriteCount, "social"),
  createThresholdAchievement("ten-favorites", "Favorite Ten", "Add ten Pokémon to your Vault favorites.", 10, (context) => context.favoriteCount, "social"),
  createThresholdAchievement("bookmark-scout", "Bookmark Scout", "Bookmark five Pokémon.", 5, (context) => context.bookmarkCount, "social"),
  createThresholdAchievement("bookmark-board", "Bookmark Board", "Bookmark 20 Pokémon.", 20, (context) => context.bookmarkCount, "social"),
  createNameSetAchievement("kanto-starters", "Kanto Starter Trio", "Catch Bulbasaur, Charmander, and Squirtle.", ACHIEVEMENT_KANTO_STARTERS, "starter"),
  createNameSetAchievement("all-starters", "All Starters Collected", "Catch every first-stage starter Pokémon.", ACHIEVEMENT_STARTER_NAMES, "starter"),
  createNameSetAchievement("eeveelution-master", "Eeveelution Master", "Catch Eevee and all eight Eeveelutions.", ACHIEVEMENT_EEVEELUTIONS, "starter"),
  createNameSetAchievement("pseudo-powerhouse", "Pseudo Powerhouse", "Catch each pseudo-legendary base line starter.", ACHIEVEMENT_PSEUDO_BASES, "collection"),
  createThresholdAchievement("type-curator", "Type Curator", "Fill six type-favorite showcase slots.", 6, (context) => context.favoriteTypeCount, "social"),
  createThresholdAchievement("type-museum", "Type Museum", "Fill every type-favorite showcase slot.", TYPE_NAMES.length, (context) => context.favoriteTypeCount, "social")
];

function getAchievementContext({
  baseEntries,
  shinyDexEntries,
  caughtBaseCount,
  shinyEntryCount,
  boxedCount,
  favoriteEntries,
  bookmarkEntries,
  favoriteTypeCount,
  generationBreakdown,
  ownedGames,
  ownedReleaseCount,
  clearedCount
}) {
  const generationMap = new Map(generationBreakdown.map((record) => [record.label, record]));
  const ownedGameCount = ownedGames.length;
  const dlcOwnedCount = GAME_CATALOG.reduce(
    (sum, game) => sum + Number(Boolean(state.tracker.games[game.id]?.owned && trackerHasDlc(game.id))),
    0
  );

  return {
    baseEntries,
    shinyDexEntries,
    caughtBaseCount,
    shinyEntryCount,
    boxedCount,
    favoriteCount: favoriteEntries.length,
    bookmarkCount: bookmarkEntries.length,
    favoriteTypeCount,
    generationMap,
    ownedGameCount,
    ownedReleaseCount,
    clearedCount,
    activeSaveSet: state.tracker.activeGame && state.tracker.activeGame !== "none" ? 1 : 0,
    dlcOwnedCount,
    countCaughtNames(names) {
      return names.reduce((sum, name) => sum + Number(Boolean(state.entriesByName.has(name) && isCaught(name))), 0);
    }
  };
}

function getAchievementResults(context) {
  return ACHIEVEMENT_DEFINITIONS.map((definition, index) => {
    const rawResult = definition.evaluate(context);
    const target = Math.max(1, Number(rawResult.target ?? definition.target) || 1);
    const current = Math.max(0, Number(rawResult.current) || 0);
    const progress = Math.min(1, current / target);

    return {
      ...definition,
      index,
      current,
      target,
      progress,
      unlocked: Boolean(rawResult.unlocked)
    };
  });
}

function createAchievementBadge(result, options = {}) {
  const badge = document.createElement("article");
  badge.className = `achievement-badge achievement-badge--${result.tone ?? "standard"}`;
  badge.classList.toggle("unlocked", result.unlocked);
  badge.classList.toggle("locked", !result.unlocked);

  const emblem = document.createElement("span");
  emblem.className = "achievement-emblem";
  emblem.textContent = result.unlocked ? "OK" : String(result.index + 1).padStart(2, "0");

  const copy = document.createElement("div");
  copy.className = "achievement-copy";
  const title = document.createElement("strong");
  title.textContent = result.title;
  const detail = document.createElement("span");
  detail.textContent = options.compact
    ? result.unlocked
      ? "Unlocked"
      : `${formatPercent(result.progress)}`
    : result.detail;
  copy.append(title, detail);

  const progress = document.createElement("div");
  progress.className = "achievement-progress";
  const fill = document.createElement("span");
  fill.style.width = `${Math.round(result.progress * 100)}%`;
  progress.appendChild(fill);

  const meta = document.createElement("small");
  meta.className = "achievement-meta";
  meta.textContent = result.unlocked
    ? "Unlocked"
    : `${formatCount(Math.min(result.current, result.target))}/${formatCount(result.target)}`;

  badge.append(emblem, copy, progress, meta);
  return badge;
}

function renderAchievementBadges(results) {
  const unlockedCount = results.reduce((sum, result) => sum + Number(result.unlocked), 0);
  const totalCount = results.length;
  const nextLocked = results.find((result) => !result.unlocked);
  const sortedPreview = [...results].sort(
    (left, right) =>
      Number(right.unlocked) - Number(left.unlocked) ||
      right.progress - left.progress ||
      left.index - right.index
  );

  elements.landingAchievementSummary.textContent = `${formatCount(unlockedCount)}/${formatCount(totalCount)} unlocked${
    nextLocked ? ` · Next: ${nextLocked.title}` : " · All badges complete"
  }`;
  elements.landingAchievementGrid.replaceChildren();
  sortedPreview.slice(0, 8).forEach((result) => {
    elements.landingAchievementGrid.appendChild(createAchievementBadge(result, { compact: true }));
  });

  elements.achievementCount.textContent = `${formatCount(unlockedCount)}/${formatCount(totalCount)}`;
  elements.achievementSummary.textContent = nextLocked
    ? `${formatCount(unlockedCount)} unlocked. Next target: ${nextLocked.title}.`
    : "Every current achievement badge is unlocked.";
  elements.achievementList.replaceChildren();

  const visibleCount = Math.min(state.ui.achievementVisibleCount, totalCount);
  results.slice(0, visibleCount).forEach((result) => {
    elements.achievementList.appendChild(createAchievementBadge(result));
  });

  elements.achievementLoadMoreButton.hidden = visibleCount >= totalCount;
  elements.achievementLoadMoreButton.textContent = `Load More (${formatCount(Math.max(0, totalCount - visibleCount))} left)`;
}

function renderCollections(options = {}) {
  if (!shouldRenderForViews(["landing", "collection", "vault"], options.force)) {
    return;
  }

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
  const suggestableLivingEntries = state.entries.filter((entry) => isSuggestableLivingEntry(entry));
  const catchSeedPool =
    ownedGames.length && state.gameAvailabilityReady
      ? suggestableLivingEntries.filter((entry) => !isCaught(entry.name) && isAvailableInOwnedCoverage(entry.baseNumber))
      : suggestableLivingEntries.filter((entry) => !isCaught(entry.name));
  const shinySeedPool =
    ownedGames.length && state.gameAvailabilityReady
      ? baseEntries.filter(
          (entry) =>
            !isCaught(entry.name) &&
            !isShinyDexLocked(entry.name) &&
            isAvailableInOwnedCoverage(entry.baseNumber)
        )
      : baseEntries.filter((entry) => !isCaught(entry.name) && !isShinyDexLocked(entry.name));

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
  const achievementContext = getAchievementContext({
    baseEntries,
    shinyDexEntries,
    caughtBaseCount,
    shinyEntryCount,
    boxedCount,
    favoriteEntries,
    bookmarkEntries,
    favoriteTypeCount,
    generationBreakdown,
    ownedGames,
    ownedReleaseCount,
    clearedCount
  });
  const achievementResults = getAchievementResults(achievementContext);

  const mainGoal = getMainGoalOption();
  const mainGoalPrefix = state.profileSetup.completed ? `Main goal: ${mainGoal.label}. ` : "";
  elements.landingWelcome.textContent = `Welcome back, ${profile.name}`;
  elements.landingSummary.textContent = mainGoalPrefix + (state.randomTargets.length
    ? `Here’s your progress at a glance. ${state.randomTargets.length} living dex suggestions and ${state.shinyTargets.length} shiny goals are queued up for this profile.`
    : ownedReleaseCount
      ? "Your tracker is loaded. Reroll the hunt board or jump into Dex to plan the next capture."
      : "Your living form archive is online. Mark the games you own and start logging catches to build tailored hunt suggestions.");
  elements.landingProfileMetric.textContent = profile.name;
  elements.landingLivingMetric.textContent = `${formatCount(caughtBaseCount)} / ${formatCount(baseEntries.length)}`;
  elements.landingShinyMetric.textContent = `${formatCount(shinyEntryCount)} / ${formatCount(shinyDexEntries.length)}`;
  elements.landingShinyNote.textContent = latestShinyEntry
    ? `Latest: ${latestShinyEntry.displayName}`
    : "No shiny caught yet";
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
  renderAchievementBadges(achievementResults);

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
    : "Everything in the base archive is already caught for this profile. Flip to a fresh profile or start a shiny push.";
  renderSuggestedCatchLabel(elements.landingTargetSelected, selectedLivingTarget, {
    emptyText: livingSelectionMode ? "Select a target or cancel" : "Choose a target",
    includeVariantDetail: true,
    includeGameBadge: true
  });
  elements.landingShinyTargetSelected.textContent = selectedShinyTarget
    ? `${selectedShinyTarget.displayName} · Shiny Preview`
    : shinySelectionMode
      ? "Select a shiny target or cancel"
      : "Choose a shiny target";
  elements.landingTargetCatchButton.textContent =
    livingSelectionMode && !selectedLivingTarget ? "Cancel" : "Catch";
  elements.landingShinyLogButton.textContent =
    shinySelectionMode && !selectedShinyTarget ? "Cancel" : "Catch Shiny";
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

  renderDuplicatePlanner();

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

  renderShinyHub();
}

function renderTrainerVault() {
  const profile = getActiveProfile();
  const profileCount = state.profileMeta.profiles.length;

  elements.profilePill.textContent = profile.name;
  elements.sessionButton.textContent = getSessionButtonLabel();
  if (elements.profileCount && elements.profileSelect) {
    elements.profileCount.textContent = `${profileCount} profile${profileCount === 1 ? "" : "s"}`;
    elements.profileSelect.replaceChildren();

    state.profileMeta.profiles.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.name;
      option.selected = item.id === profile.id;
      elements.profileSelect.appendChild(option);
    });
  }

  elements.notebookStatus.textContent = state.notebook.trim() ? "Autosaved locally" : "Notebook ready";
  if (elements.trainerNotebook.value !== state.notebook) {
    elements.trainerNotebook.value = state.notebook;
  }

  renderCloudAccountCard();
  renderFavoritePicker();
}

function getFirstRunStepIndex(step = state.ui.firstRun.step) {
  return FIRST_RUN_SETUP_STEPS.indexOf(step);
}

function getFirstRunStepTitle(step = state.ui.firstRun.step) {
  switch (step) {
    case "login":
      return {
        title: "Log in to your trainer account",
        subtitle: "Sign in first, then PokéPilot will open under that cloud account."
      };
    case "account":
      return {
        title: "Create or connect an account",
        subtitle: "Cloud sync is optional, but it keeps your profile, saves, favorites, and setup available on other devices."
      };
    case "profile":
      return {
        title: "Name this trainer profile",
        subtitle: "This is the local profile name PokéPilot uses across Dashboard, Journey, HOME, and settings."
      };
    case "games":
      return {
        title: "Pick the games you own",
        subtitle: "These choices power catchability, missing coverage, suggestions, shiny pools, and Journey filters."
      };
    case "states":
      return {
        title: "Set where those saves are",
        subtitle: "Choose your active save and rough story state. You can fine-tune badges and objectives later in Journey."
      };
    case "goal":
      return {
        title: "Choose your main goal",
        subtitle: "This guides where PokéPilot sends you after setup and keeps the dashboard language focused."
      };
    case "favorite":
      return {
        title: "Pick a favorite Pokémon",
        subtitle: "This only fills your Vault showcase. You will not be asked to mark owned Pokémon during setup."
      };
    default:
      return {
        title: "Welcome to PokéPilot",
        subtitle: "Choose how you want to start, then Rotom will help configure the site around your saves."
      };
  }
}

function hasExistingFirstRunSetupSignals() {
  const hasExtraProfile = state.profileMeta.profiles.some((profile) => profile.id !== DEFAULT_PROFILE_ID);
  const hasOwnedGame = Object.values(state.tracker.games ?? {}).some((game) => game?.owned);
  const hasCaughtPokemon = Object.values(state.caughtMap ?? {}).some((value) => normalizeCaughtCount(value) > 0);
  const hasFavorite = Object.keys(state.favoritesMap ?? {}).length > 0;

  return Boolean(state.profileSetup.completed || hasExtraProfile || hasOwnedGame || hasCaughtPokemon || hasFavorite);
}

function shouldAutoOpenFirstRunHelper() {
  return !state.firstRun.dismissed && !hasExistingFirstRunSetupSignals();
}

function setFirstRunStep(step) {
  state.ui.firstRun.step = step;
  renderFirstRunHelper();
}

function openFirstRunHelper(step = "welcome") {
  state.ui.firstRun.open = true;
  state.ui.firstRun.step = step;
  renderFirstRunHelper();
}

function closeFirstRunHelper() {
  state.ui.firstRun.open = false;
  renderFirstRunHelper();
}

function completeFirstRunGuest() {
  state.firstRun.dismissed = true;
  state.firstRun.guest = true;
  state.firstRun.completedAt = new Date().toISOString();
  saveFirstRunState();
  closeFirstRunHelper();
  setStatus("Guest session ready.");
}

function getFirstRunGoalView(goalId = state.profileSetup.mainGoal) {
  switch (goalId) {
    case "shiny-dex":
      return "shiny";
    case "journey":
      return "journey";
    case "home-boxes":
      return "home";
    case "form-dex":
    case "living-dex":
      return "archive";
    default:
      return "landing";
  }
}

function completeFirstRunSetup() {
  state.profileSetup.completed = true;
  state.profileSetup.finishedAt = new Date().toISOString();
  saveProfileSetupState();

  state.firstRun.dismissed = true;
  state.firstRun.completed = true;
  state.firstRun.guest = false;
  state.firstRun.completedAt = state.profileSetup.finishedAt;
  saveFirstRunState();

  closeFirstRunHelper();
  setActiveView(getFirstRunGoalView());
  setStatus("First-time setup complete.");
}

function refreshFirstRunConnectedViews() {
  saveTrackerState();
  renderTracker();
  renderCollections();
  renderHomeOrganizer();
  renderShinyHelper();
  renderSuggestors();
  refreshResults();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function syncFirstRunAuthFieldsToAccount() {
  const emailInput = elements.firstRunContent.querySelector("[data-first-run-auth-email]");
  const passwordInput = elements.firstRunContent.querySelector("[data-first-run-auth-password]");

  if (emailInput && elements.accountEmailInput) {
    elements.accountEmailInput.value = emailInput.value.trim();
  }

  if (passwordInput && elements.accountPasswordInput) {
    elements.accountPasswordInput.value = passwordInput.value;
  }
}

async function submitFirstRunAuth(mode) {
  syncFirstRunAuthFieldsToAccount();
  const ok = mode === "sign-up" ? await signUpCloudAccount() : await signInCloudAccount();
  renderFirstRunHelper();
  return ok;
}

function applyFirstRunProfileName() {
  const input = elements.firstRunContent.querySelector("[data-first-run-profile-name]");
  const normalized = String(input?.value ?? "").trim();
  if (!normalized) {
    return;
  }

  const profile = getActiveProfile();
  if (profile && profile.name !== normalized) {
    profile.name = normalized;
    saveProfileMeta();
    renderTrainerVault();
    renderCollections();
  }
}

function setFirstRunGameOwned(gameId, owned) {
  const game = getGameMeta(gameId);
  const trackerState = state.tracker.games[gameId];
  if (!game || !trackerState) {
    return;
  }

  if (gameHasSeparateVersions(game)) {
    const versions = getGameVersions(game);
    if (owned && !versions.some((version) => trackerState.versions?.[version.id])) {
      trackerState.versions[versions[0]?.id] = true;
    } else if (!owned) {
      versions.forEach((version) => {
        trackerState.versions[version.id] = false;
      });
    }
  } else {
    trackerState.owned = owned;
  }

  syncTrackerOwnershipSelection(game, trackerState);
  if (owned && state.tracker.activeGame === "none") {
    state.tracker.activeGame = gameId;
  }
  refreshFirstRunConnectedViews();
}

function setFirstRunGameVersion(gameId, versionId, owned) {
  const game = getGameMeta(gameId);
  const trackerState = state.tracker.games[gameId];
  if (!game || !trackerState?.versions) {
    return;
  }

  trackerState.versions[versionId] = owned;
  syncTrackerOwnershipSelection(game, trackerState);
  if (trackerState.owned && state.tracker.activeGame === "none") {
    state.tracker.activeGame = gameId;
  }
  refreshFirstRunConnectedViews();
}

function setFirstRunGameDlc(gameId, owned) {
  const trackerState = state.tracker.games[gameId];
  if (!trackerState) {
    return;
  }

  trackerState.hasDlc = Boolean(owned);
  refreshFirstRunConnectedViews();
}

function getFirstRunGameStage(gameId) {
  const game = getGameMeta(gameId);
  const trackerState = state.tracker.games[gameId];
  if (!game || !trackerState) {
    return "start";
  }

  if (trackerState.postgame) {
    return "postgame";
  }

  if (trackerState.hallOfFame) {
    return "clear";
  }

  return trackerState.progress >= Math.ceil((game.progressMax || 1) * 0.45) ? "mid" : "start";
}

function setFirstRunGameStage(gameId, stage) {
  const game = getGameMeta(gameId);
  const trackerState = state.tracker.games[gameId];
  if (!game || !trackerState) {
    return;
  }

  const milestones = Array.isArray(game.milestones) ? game.milestones : [];
  const progressMax = Number(game.progressMax) || 0;
  const normalizedStage = ["start", "mid", "clear", "postgame"].includes(stage) ? stage : "start";
  trackerState.hallOfFame = normalizedStage === "clear" || normalizedStage === "postgame";
  trackerState.postgame = normalizedStage === "postgame";
  trackerState.progress =
    normalizedStage === "postgame" || normalizedStage === "clear"
      ? progressMax
      : normalizedStage === "mid"
        ? Math.max(1, Math.ceil(progressMax * 0.45))
        : 0;
  trackerState.milestone =
    normalizedStage === "postgame"
      ? milestones[milestones.length - 1] ?? "Postgame"
      : normalizedStage === "clear"
        ? milestones[Math.min(2, milestones.length - 1)] ?? "Main Story Clear"
        : normalizedStage === "mid"
          ? milestones[Math.min(1, milestones.length - 1)] ?? "Mid Story"
          : milestones[0] ?? "New Save";

  refreshFirstRunConnectedViews();
}

function setFirstRunMainGoal(goalId) {
  if (!MAIN_GOAL_OPTION_IDS.has(goalId)) {
    return;
  }

  state.profileSetup.mainGoal = goalId;
  saveProfileSetupState();
  renderCollections();
  renderFirstRunHelper();
}

function getFirstRunFavoriteChoices() {
  if (!state.entries.length) {
    return [];
  }

  const query = normalizeSearch(state.ui.firstRun.favoriteQuery);
  if (query) {
    return state.entries
      .filter((entry) => entry.searchBlob?.includes(query) || normalizeSearch(entry.displayName).includes(query))
      .slice(0, 12);
  }

  const starterNames = [
    "pikachu",
    "eevee",
    "charizard",
    "lucario",
    "gengar",
    "gardevoir",
    "sylveon",
    "greninja",
    "mimikyu",
    "dragonite",
    "arceus",
    "rotom"
  ];
  const starterEntries = starterNames.map((name) => state.entriesByName.get(name)).filter(Boolean);
  return starterEntries.length ? starterEntries : getBaseEntries().slice(0, 12);
}

function chooseFirstRunFavorite(name) {
  const entry = state.entriesByName.get(name);
  if (!entry) {
    return;
  }

  setFavoriteState(entry.name, true);
  state.profileSetup.favoritePokemonName = entry.name;
  saveProfileSetupState();
  syncFavoriteDisplays();
  renderFirstRunHelper();
  setStatus(`${entry.displayName} added to favorites.`);
}

function createFirstRunActionButton(label, action, className = "ghost-button detail-link-button") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.dataset.firstRunAction = action;
  button.textContent = label;
  return button;
}

function createFirstRunCard(title, detail) {
  const card = document.createElement("article");
  card.className = "first-run-card";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const copy = document.createElement("p");
  copy.textContent = detail;
  card.append(heading, copy);
  return card;
}

function renderFirstRunWelcome(container) {
  const intro = createFirstRunCard(
    "Rotom can configure this save in a few pages.",
    "Start fresh, continue as a guest, or log in first. The setup will not ask you to mark every Pokémon you own."
  );
  const actions = document.createElement("div");
  actions.className = "first-run-choice-grid";
  actions.append(
    createFirstRunActionButton("First time here", "start", "primary-action compact"),
    createFirstRunActionButton("Continue as guest", "guest"),
    createFirstRunActionButton("Log in", "login")
  );
  container.append(intro, actions);
}

function renderFirstRunAuth(container, mode = "setup") {
  const signedIn = Boolean(state.cloud.user);
  const card = createFirstRunCard(
    signedIn ? `Signed in as ${getCloudUserLabel()}` : "Cloud account",
    signedIn
      ? "This setup will be saved under the signed-in trainer account once cloud sync runs."
      : "Enter an email and password to create or connect a cloud account. You can skip this and keep using a local guest profile."
  );
  container.appendChild(card);

  if (!signedIn) {
    const fields = document.createElement("div");
    fields.className = "first-run-auth-grid";

    const email = document.createElement("input");
    email.type = "email";
    email.placeholder = "Trainer email";
    email.autocomplete = "email";
    email.dataset.firstRunAuthEmail = "true";
    email.value = elements.accountEmailInput?.value ?? "";

    const password = document.createElement("input");
    password.type = "password";
    password.placeholder = "Password";
    password.autocomplete = mode === "login" ? "current-password" : "new-password";
    password.dataset.firstRunAuthPassword = "true";

    fields.append(email, password);
    container.appendChild(fields);

    const actions = document.createElement("div");
    actions.className = "first-run-inline-actions";
    actions.append(
      createFirstRunActionButton("Sign In", "auth-sign-in", "primary-action compact"),
      createFirstRunActionButton("Create Account", "auth-sign-up")
    );
    if (mode === "setup") {
      actions.append(createFirstRunActionButton("Skip account", "next-step"));
    } else {
      actions.append(createFirstRunActionButton("Continue as guest", "guest"));
    }
    container.appendChild(actions);
  }

  if (state.cloud.message) {
    const detail = document.createElement("p");
    detail.className = `first-run-message is-${state.cloud.messageTone}`;
    detail.textContent = state.cloud.message;
    container.appendChild(detail);
  }
}

function renderFirstRunProfile(container) {
  const profile = getActiveProfile();
  const field = document.createElement("label");
  field.className = "select-shell compact-field first-run-field";
  const label = document.createElement("span");
  label.textContent = "Trainer Profile Name";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Example: Jack";
  input.value = profile?.name === "Guest Trainer" ? "" : profile?.name ?? "";
  input.dataset.firstRunProfileName = "true";
  field.append(label, input);
  container.appendChild(field);
}

function renderFirstRunGames(container) {
  const grid = document.createElement("div");
  grid.className = "first-run-game-grid";

  GAME_CATALOG.forEach((game) => {
    const trackerState = state.tracker.games[game.id];
    const card = document.createElement("article");
    card.className = "first-run-game-card";
    card.classList.toggle("active", Boolean(trackerState?.owned));

    const titleRow = document.createElement("label");
    titleRow.className = "tracker-toggle first-run-owned-toggle";
    const ownedInput = document.createElement("input");
    ownedInput.type = "checkbox";
    ownedInput.checked = Boolean(trackerState?.owned);
    ownedInput.dataset.firstRunOwnedGame = game.id;
    const title = document.createElement("span");
    title.textContent = game.name;
    titleRow.append(ownedInput, title);
    card.appendChild(titleRow);

    if (gameHasSeparateVersions(game)) {
      const versionGrid = document.createElement("div");
      versionGrid.className = "tracker-version-grid first-run-version-grid";
      getGameVersions(game).forEach((version) => {
        const versionLabel = document.createElement("label");
        versionLabel.className = "tracker-version-toggle";
        versionLabel.classList.toggle("active", Boolean(trackerState?.versions?.[version.id]));
        const versionInput = document.createElement("input");
        versionInput.type = "checkbox";
        versionInput.checked = Boolean(trackerState?.versions?.[version.id]);
        versionInput.dataset.firstRunVersionGame = game.id;
        versionInput.dataset.firstRunVersion = version.id;
        const versionText = document.createElement("span");
        versionText.textContent = version.shortLabel ?? version.label;
        versionLabel.append(versionInput, versionText);
        versionGrid.appendChild(versionLabel);
      });
      card.appendChild(versionGrid);
    }

    if (gameHasDlcCoverage(game.id)) {
      const dlcLabel = document.createElement("label");
      dlcLabel.className = "tracker-toggle journey-dlc-toggle";
      dlcLabel.classList.toggle("active", trackerHasDlc(game.id));
      const dlcInput = document.createElement("input");
      dlcInput.type = "checkbox";
      dlcInput.checked = trackerHasDlc(game.id);
      dlcInput.dataset.firstRunDlcGame = game.id;
      const dlcText = document.createElement("span");
      dlcText.textContent = "I own the DLC";
      dlcLabel.append(dlcInput, dlcText);
      card.appendChild(dlcLabel);
    }

    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function renderFirstRunStates(container) {
  const ownedGames = GAME_CATALOG.filter((game) => state.tracker.games[game.id]?.owned);
  if (!ownedGames.length) {
    container.appendChild(
      createFirstRunCard("No owned games selected yet.", "Go back one page and pick at least one game if you want Journey and suggestions configured now.")
    );
    return;
  }

  const grid = document.createElement("div");
  grid.className = "first-run-game-grid";
  ownedGames.forEach((game) => {
    const trackerState = state.tracker.games[game.id];
    const card = document.createElement("article");
    card.className = "first-run-game-card active";

    const heading = document.createElement("div");
    heading.className = "first-run-game-heading";
    const title = document.createElement("strong");
    title.textContent = game.name;
    const activeLabel = document.createElement("label");
    activeLabel.className = "tracker-toggle";
    const activeInput = document.createElement("input");
    activeInput.type = "radio";
    activeInput.name = "first-run-active-game";
    activeInput.checked = state.tracker.activeGame === game.id;
    activeInput.dataset.firstRunActiveGame = game.id;
    const activeText = document.createElement("span");
    activeText.textContent = "Active save";
    activeLabel.append(activeInput, activeText);
    heading.append(title, activeLabel);

    const stageField = document.createElement("label");
    stageField.className = "select-shell compact-field first-run-field";
    const stageLabel = document.createElement("span");
    stageLabel.textContent = "Current State";
    const stageSelect = document.createElement("select");
    stageSelect.dataset.firstRunStageGame = game.id;
    [
      ["start", "Just started"],
      ["mid", "Mid-story"],
      ["clear", "Main story clear"],
      ["postgame", "Postgame / cleanup"]
    ].forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      option.selected = getFirstRunGameStage(game.id) === value;
      stageSelect.appendChild(option);
    });
    stageField.append(stageLabel, stageSelect);

    const note = document.createElement("p");
    note.className = "first-run-card-note";
    note.textContent = `${trackerState.milestone} · ${game.progressLabel}: ${trackerState.progress}/${game.progressMax}`;

    card.append(heading, stageField, note);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

function renderFirstRunGoal(container) {
  const grid = document.createElement("div");
  grid.className = "first-run-choice-grid first-run-choice-grid--goals";
  MAIN_GOAL_OPTIONS.forEach((goal) => {
    const label = document.createElement("label");
    label.className = "first-run-goal-card";
    label.classList.toggle("active", state.profileSetup.mainGoal === goal.id);
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "first-run-main-goal";
    input.value = goal.id;
    input.checked = state.profileSetup.mainGoal === goal.id;
    input.dataset.firstRunGoal = goal.id;
    const title = document.createElement("strong");
    title.textContent = goal.label;
    const detail = document.createElement("span");
    detail.textContent = goal.detail;
    label.append(input, title, detail);
    grid.appendChild(label);
  });
  container.appendChild(grid);
}

function renderFirstRunFavorite(container) {
  const selected = state.profileSetup.favoritePokemonName
    ? state.entriesByName.get(state.profileSetup.favoritePokemonName)
    : null;

  const field = document.createElement("label");
  field.className = "select-shell compact-field first-run-field";
  const label = document.createElement("span");
  label.textContent = "Search Favorite";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search by name or Dex number";
  input.autocomplete = "off";
  input.value = state.ui.firstRun.favoriteQuery;
  input.dataset.firstRunFavoriteSearch = "true";
  field.append(label, input);
  container.appendChild(field);

  if (selected) {
    const selectedCard = createFirstRunCard("Selected Favorite", selected.displayName);
    selectedCard.classList.add("first-run-selected-favorite");
    container.appendChild(selectedCard);
  }

  const list = document.createElement("div");
  list.className = "first-run-favorite-list";
  const choices = getFirstRunFavoriteChoices();
  if (!choices.length) {
    list.appendChild(createCollectionEmptyState("The Dex is still loading. You can finish setup and pick a favorite later in Settings."));
  } else {
    choices.forEach((entry) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "first-run-favorite-choice";
      button.dataset.firstRunFavoriteName = entry.name;

      const sprite = document.createElement("img");
      sprite.src = entry.listSprite;
      sprite.alt = "";
      sprite.loading = "lazy";
      sprite.decoding = "async";

      const copy = document.createElement("span");
      const name = document.createElement("strong");
      name.textContent = entry.displayName;
      const meta = document.createElement("small");
      meta.textContent = `#${formatNumber(entry.baseNumber)} · ${getEntryVariantLabel(entry)}`;
      copy.append(name, meta);
      button.append(sprite, copy);
      list.appendChild(button);
    });
  }

  container.appendChild(list);
}

function renderFirstRunHelper() {
  if (!elements.firstRunOverlay) {
    return;
  }

  const isOpen = Boolean(state.ui.firstRun.open);
  elements.firstRunOverlay.classList.toggle("hidden", !isOpen);
  elements.firstRunOverlay.hidden = !isOpen;
  if (!isOpen) {
    return;
  }

  const step = state.ui.firstRun.step || "welcome";
  const meta = getFirstRunStepTitle(step);
  elements.firstRunTitle.textContent = meta.title;
  elements.firstRunSubtitle.textContent = meta.subtitle;

  const stepIndex = getFirstRunStepIndex(step);
  elements.firstRunProgress.textContent =
    stepIndex >= 0 ? `Step ${stepIndex + 1} of ${FIRST_RUN_SETUP_STEPS.length}` : "Choose a path";
  elements.firstRunBackButton.hidden = step === "welcome";
  elements.firstRunNextButton.hidden = step === "welcome" || step === "login";
  elements.firstRunNextButton.textContent = step === "favorite" ? "Finish Setup" : "Next";

  elements.firstRunContent.replaceChildren();
  switch (step) {
    case "login":
      renderFirstRunAuth(elements.firstRunContent, "login");
      break;
    case "account":
      renderFirstRunAuth(elements.firstRunContent, "setup");
      break;
    case "profile":
      renderFirstRunProfile(elements.firstRunContent);
      break;
    case "games":
      renderFirstRunGames(elements.firstRunContent);
      break;
    case "states":
      renderFirstRunStates(elements.firstRunContent);
      break;
    case "goal":
      renderFirstRunGoal(elements.firstRunContent);
      break;
    case "favorite":
      renderFirstRunFavorite(elements.firstRunContent);
      break;
    default:
      renderFirstRunWelcome(elements.firstRunContent);
      break;
  }
}

function goToNextFirstRunStep() {
  const step = state.ui.firstRun.step;
  if (step === "profile") {
    applyFirstRunProfileName();
  }

  if (step === "favorite") {
    completeFirstRunSetup();
    return;
  }

  const index = getFirstRunStepIndex(step);
  setFirstRunStep(FIRST_RUN_SETUP_STEPS[Math.min(index + 1, FIRST_RUN_SETUP_STEPS.length - 1)] ?? "account");
}

function goToPreviousFirstRunStep() {
  const step = state.ui.firstRun.step;
  if (step === "login" || step === "account") {
    setFirstRunStep("welcome");
    return;
  }

  const index = getFirstRunStepIndex(step);
  setFirstRunStep(FIRST_RUN_SETUP_STEPS[Math.max(index - 1, 0)] ?? "welcome");
}

async function handleFirstRunAction(action) {
  switch (action) {
    case "start":
      setFirstRunStep("account");
      break;
    case "guest":
      completeFirstRunGuest();
      break;
    case "login":
      setFirstRunStep("login");
      break;
    case "next-step":
      goToNextFirstRunStep();
      break;
    case "auth-sign-in": {
      const ok = await submitFirstRunAuth("sign-in");
      if (ok && state.ui.firstRun.step === "login") {
        state.firstRun.dismissed = true;
        state.firstRun.completed = true;
        state.firstRun.guest = false;
        state.firstRun.completedAt = new Date().toISOString();
        saveFirstRunState();
        closeFirstRunHelper();
        setActiveView("landing");
      }
      break;
    }
    case "auth-sign-up": {
      const ok = await submitFirstRunAuth("sign-up");
      if (ok && state.ui.firstRun.step === "account") {
        setFirstRunStep("profile");
      }
      break;
    }
    default:
      break;
  }
}

function handleFirstRunInput(event) {
  const target = event.target;
  if (target?.matches?.("[data-first-run-favorite-search]")) {
    state.ui.firstRun.favoriteQuery = target.value;
    renderFirstRunHelper();
    window.requestAnimationFrame(() => {
      const searchInput = elements.firstRunContent.querySelector("[data-first-run-favorite-search]");
      if (searchInput) {
        searchInput.focus();
        searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
      }
    });
  }
}

function handleFirstRunChange(event) {
  const target = event.target;
  if (!target) {
    return;
  }

  if (target.dataset.firstRunOwnedGame) {
    setFirstRunGameOwned(target.dataset.firstRunOwnedGame, target.checked);
    renderFirstRunHelper();
    return;
  }

  if (target.dataset.firstRunVersionGame && target.dataset.firstRunVersion) {
    setFirstRunGameVersion(target.dataset.firstRunVersionGame, target.dataset.firstRunVersion, target.checked);
    renderFirstRunHelper();
    return;
  }

  if (target.dataset.firstRunDlcGame) {
    setFirstRunGameDlc(target.dataset.firstRunDlcGame, target.checked);
    renderFirstRunHelper();
    return;
  }

  if (target.dataset.firstRunActiveGame) {
    setActiveGame(target.dataset.firstRunActiveGame);
    renderFirstRunHelper();
    return;
  }

  if (target.dataset.firstRunStageGame) {
    setFirstRunGameStage(target.dataset.firstRunStageGame, target.value);
    renderFirstRunHelper();
    return;
  }

  if (target.dataset.firstRunGoal) {
    setFirstRunMainGoal(target.dataset.firstRunGoal);
  }
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

function renderHomeOrganizer(options = {}) {
  if (!shouldRenderForViews(["home"], options.force)) {
    return;
  }

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
      `${spareText}${excludedText} Click a slot to mark or unmark that target as boxed in HOME. Use Dex or Scan when you want the full Pokemon page while organizing.`;
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
      slot.setAttribute("aria-label", entry ? `${entry.displayName} HOME slot ${index + 1}` : `Unused HOME slot ${index + 1}`);

      const number = document.createElement("span");
      number.className = "home-slot-number";
      number.textContent = String(index + 1).padStart(2, "0");
      slot.appendChild(number);

      const artWell = document.createElement("span");
      artWell.className = "home-slot-artwell";

      if (entry) {
        const boxed = isBoxedInHome(entry.name);
        const caught = isCaught(entry.name);
        slot.classList.toggle("boxed", boxed);
        slot.classList.toggle("caught", caught && !boxed);
        slot.classList.toggle("missing", !caught && !boxed);
        slot.classList.toggle("active", state.currentPokemon?.name === entry.name);
        slot.title = `${entry.displayName} · ${boxed ? "Boxed in HOME" : caught ? "Caught in Dex" : "Missing from Dex"}`;

        const sprite = document.createElement("img");
        sprite.className = "home-slot-sprite";
        sprite.loading = "lazy";
        sprite.decoding = "async";
        applyEntrySprite(sprite, entry);
        artWell.appendChild(sprite);

        const label = document.createElement("span");
        label.className = "home-slot-label";
        label.textContent = entry.displayName;

        const meta = document.createElement("div");
        meta.className = "home-slot-meta";

        const dex = document.createElement("span");
        dex.className = "home-slot-dex";
        dex.textContent = `#${formatNumber(entry.baseNumber)}`;

        const variant = document.createElement("span");
        variant.className = "home-slot-variant";
        variant.textContent = getEntryVariantLabel(entry);
        meta.append(dex, variant);

        const status = document.createElement("span");
        status.className = "home-slot-status";
        status.textContent = boxed ? "Boxed" : caught ? "Caught" : "Missing";

        slot.append(artWell, label, meta, status);
      } else {
        slot.classList.add("is-empty");
        slot.title = `${currentBox.name} spare slot ${index + 1}`;
        artWell.classList.add("is-empty");

        const placeholder = document.createElement("span");
        placeholder.className = "home-slot-placeholder";
        placeholder.setAttribute("aria-hidden", "true");
        artWell.appendChild(placeholder);

        const status = document.createElement("span");
        status.className = "home-slot-status";
        status.textContent = "Spare";

        const label = document.createElement("span");
        label.className = "home-slot-label";
        label.textContent = "Unused";

        const meta = document.createElement("div");
        meta.className = "home-slot-meta";

        const note = document.createElement("span");
        note.className = "home-slot-dex";
        note.textContent = "No assigned target";
        meta.appendChild(note);

        slot.append(artWell, label, meta, status);
      }

      slot.addEventListener("click", () => {
        if (!entry) {
          return;
        }

        const nextValue = !isBoxedInHome(entry.name);
        recordUndoAction({
          label: `${entry.displayName} HOME box mark`,
          homeNames: [entry.name]
        });
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
        ? isAvailableInTrackedGameScope(state.currentPokemon.baseNumber, game.id)
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

function renderModuleQueue(options = {}) {
  if (!shouldRenderForViews(["lab"], options.force)) {
    return;
  }

  if (!elements.moduleGrid) {
    return;
  }

  const escapeHtml = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const summarizeCounts = (values = []) => {
    const counts = new Map();
    values.filter(Boolean).forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
    return [...counts.entries()].map(([name, count]) => `${name} x${count}`);
  };

  const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
  const parseMoney = (value) => {
    const parsed = Number.parseFloat(String(value ?? "").trim());
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const getLzaDonutSummary = () => {
    const selectedBerries = state.tools.lza.slots
      .filter((name) => LZA_DONUT_BERRIES_BY_NAME.has(name))
      .map((name) => LZA_DONUT_BERRIES_BY_NAME.get(name));
    const totals = {
      sweet: 0,
      spicy: 0,
      sour: 0,
      bitter: 0,
      fresh: 0,
      level: 0,
      calories: 0
    };

    selectedBerries.forEach((berry) => {
      totals.sweet += berry.sweet;
      totals.spicy += berry.spicy;
      totals.sour += berry.sour;
      totals.bitter += berry.bitter;
      totals.fresh += berry.fresh;
      totals.level += berry.level;
      totals.calories += berry.calories;
    });

    const flavors = LZA_DONUT_FLAVOR_META.map(([key, label]) => ({
      key,
      label,
      value: totals[key]
    })).sort((left, right) => right.value - left.value);
    const highestFlavor = flavors[0]?.value ?? 0;
    const dominantFlavors = highestFlavor
      ? flavors.filter((flavor) => flavor.value === highestFlavor)
      : [];
    const powerPool = [
      ...new Set(
        dominantFlavors.flatMap((flavor) => LZA_DONUT_FLAVOR_POWERS[flavor.key] ?? [])
      )
    ];

    return {
      selectedBerries,
      totals,
      flavors,
      dominantFlavors,
      powerPool,
      berryCount: selectedBerries.length,
      flavorScore: totals.sweet + totals.spicy + totals.sour + totals.bitter + totals.fresh,
      recipeSummary: summarizeCounts(selectedBerries.map((berry) => berry.name))
    };
  };

  const getSelectedPlaRecipe = () =>
    PLA_RECIPES_BY_NAME.get(state.tools.pla.recipeName) ?? PLA_RECIPE_CATALOG[0] ?? null;

  const getPlaRecipeSummary = () => {
    const recipe = getSelectedPlaRecipe();
    const amount = Math.max(1, state.tools.pla.amount || 1);
    if (!recipe) {
      return {
        recipe: null,
        amount,
        materialRows: [],
        craftableNow: 0,
        totalCost: 0,
        missingMaterials: []
      };
    }

    const materialRows = recipe.materials.map((material) => {
      const owned = state.tools.pla.materialCounts[material.name] ?? 0;
      const unitCost = parseMoney(state.tools.pla.materialCosts[material.name]);
      const required = material.count * amount;
      const shortfall = Math.max(0, required - owned);

      return {
        ...material,
        owned,
        required,
        shortfall,
        unitCost,
        totalCost: required * unitCost
      };
    });

    const craftableNow = materialRows.length
      ? Math.min(...materialRows.map((material) => Math.floor(material.owned / material.count)))
      : 0;

    return {
      recipe,
      amount,
      materialRows,
      craftableNow,
      totalCost: materialRows.reduce((sum, material) => sum + material.totalCost, 0),
      missingMaterials: materialRows.filter((material) => material.shortfall > 0)
    };
  };

  const getSelectedSvSandwich = () =>
    SV_SHINY_SANDWICHES_BY_TYPE.get(state.tools.sv.type) ?? SV_SHINY_SANDWICH_RECIPES[0] ?? null;

  const getSupplyTrackerSummary = () => {
    const rows = state.tools.supply.rows;
    const totalQuantity = rows.reduce(
      (sum, row) => sum + Math.max(0, normalizeNonNegativeInteger(row.quantity, 0)),
      0
    );
    const totalCost = rows.reduce(
      (sum, row) =>
        sum + parseMoney(row.unitCost) * Math.max(0, normalizeNonNegativeInteger(row.quantity, 0)),
      0
    );

    return {
      rows,
      totalQuantity,
      totalCost
    };
  };

  const TOOL_PANEL_IDS = {
    showcase: "showcase",
    lza: "lza",
    pla: "pla",
    sv: "sv",
    supply: "supply"
  };

  const saveAndRefreshTools = (statusMessage = "", anchorId = "") => {
    preserveModuleQueueScroll(() => {
      saveToolsState();
      renderModuleQueue();
      if (statusMessage) {
        setStatus(statusMessage);
      }
    }, anchorId);
  };

  const setLzaDonutSlot = (index, berryName) => {
    state.tools.lza.slots[index] = LZA_DONUT_BERRIES_BY_NAME.has(berryName) ? berryName : "";
    saveAndRefreshTools("", TOOL_PANEL_IDS.lza);
  };

  const applyLzaPreset = (presetId) => {
    const preset = LZA_DONUT_PRESETS.find((entry) => entry.id === presetId);
    if (!preset) {
      return;
    }

    state.tools.lza.slots = Array.from({ length: 8 }, (_, index) => preset.berries[index] ?? "");
    saveAndRefreshTools(`${preset.title} loaded into the donut mocker.`, TOOL_PANEL_IDS.lza);
  };

  const clearLzaBuilder = () => {
    state.tools.lza.slots = Array(8).fill("");
    saveAndRefreshTools("Donut builder cleared.", TOOL_PANEL_IDS.lza);
  };

  const setPlaRecipeName = (recipeName) => {
    if (!PLA_RECIPES_BY_NAME.has(recipeName)) {
      return;
    }

    state.tools.pla.recipeName = recipeName;
    saveAndRefreshTools("", TOOL_PANEL_IDS.pla);
  };

  const setPlaRecipeAmount = (value) => {
    state.tools.pla.amount = Math.max(1, normalizeNonNegativeInteger(value, 1));
    saveAndRefreshTools("", TOOL_PANEL_IDS.pla);
  };

  const setPlaMaterialCount = (materialName, value) => {
    const nextValue = Math.max(0, normalizeNonNegativeInteger(value, 0));
    if (nextValue > 0) {
      state.tools.pla.materialCounts[materialName] = nextValue;
    } else {
      delete state.tools.pla.materialCounts[materialName];
    }
    saveAndRefreshTools("", TOOL_PANEL_IDS.pla);
  };

  const setPlaMaterialCost = (materialName, value) => {
    const normalized = normalizeNonNegativeDecimalString(value);
    if (normalized) {
      state.tools.pla.materialCosts[materialName] = normalized;
    } else {
      delete state.tools.pla.materialCosts[materialName];
    }
    saveAndRefreshTools("", TOOL_PANEL_IDS.pla);
  };

  const setSvSandwichType = (type) => {
    if (!SV_SHINY_SANDWICHES_BY_TYPE.has(type)) {
      return;
    }

    state.tools.sv.type = type;
    saveAndRefreshTools("", TOOL_PANEL_IDS.sv);
  };

  const addSupplyTrackerRow = () => {
    state.tools.supply.rows.push(createDefaultSupplyRow());
    saveAndRefreshTools("Added a new supply line.", TOOL_PANEL_IDS.supply);
  };

  const updateSupplyTrackerRow = (rowId, field, value) => {
    const row = state.tools.supply.rows.find((entry) => entry.id === rowId);
    if (!row) {
      return;
    }

    if (field === "unitCost") {
      row.unitCost = normalizeNonNegativeDecimalString(value);
    } else if (field === "quantity") {
      row.quantity = String(Math.max(0, normalizeNonNegativeInteger(value, 1)) || 1);
    } else if (field === "name") {
      row.name = String(value ?? "");
    }

    saveAndRefreshTools("", TOOL_PANEL_IDS.supply);
  };

  const removeSupplyTrackerRow = (rowId) => {
    state.tools.supply.rows = state.tools.supply.rows.filter((row) => row.id !== rowId);
    if (!state.tools.supply.rows.length) {
      state.tools.supply.rows = [createDefaultSupplyRow()];
    }
    saveAndRefreshTools("Removed a supply line.", TOOL_PANEL_IDS.supply);
  };

  const buildBerryOptions = (selectedValue) => {
    const buildOptionMarkup = (berries) =>
      berries
        .map(
          (berry) =>
            `<option value="${escapeHtml(berry.name)}"${berry.name === selectedValue ? " selected" : ""}>${escapeHtml(
              berry.name
            )}</option>`
        )
        .join("");

    return [
      '<option value="">Empty Slot</option>',
      `<optgroup label="Regular Berries">${buildOptionMarkup(
        LZA_DONUT_BERRIES.filter((berry) => berry.tier === "regular")
      )}</optgroup>`,
      `<optgroup label="Hyper Berries">${buildOptionMarkup(
        LZA_DONUT_BERRIES.filter((berry) => berry.tier === "hyper")
      )}</optgroup>`
    ].join("");
  };

  const buildRecipeOptions = (selectedName) =>
    PLA_RECIPE_CATALOG.map(
      (recipe) =>
        `<option value="${escapeHtml(recipe.name)}"${recipe.name === selectedName ? " selected" : ""}>${escapeHtml(
          `${recipe.category} · ${recipe.name}`
        )}</option>`
    ).join("");

  const lzaSummary = getLzaDonutSummary();
  const plaSummary = getPlaRecipeSummary();
  const svRecipe = getSelectedSvSandwich();
  const supplySummary = getSupplyTrackerSummary();
  const renderToolStatChip = (label, value, modifierClass = "") => `
    <span class="tool-stat-chip${modifierClass ? ` ${modifierClass}` : ""}">
      <span class="tool-stat-chip-label">${escapeHtml(label)}</span>
      <strong class="tool-stat-chip-value">${escapeHtml(String(value))}</strong>
    </span>
  `;

  elements.moduleGrid.classList.add("is-toolbox");
  elements.moduleGrid.replaceChildren();

  const showcaseCard = document.createElement("article");
  showcaseCard.className = "module-card tool-showcase-card";
  showcaseCard.dataset.toolPanel = TOOL_PANEL_IDS.showcase;
  showcaseCard.innerHTML = `
    <div class="tool-showcase-copy">
      <span class="module-status queued">Game Tools Workbench</span>
      <strong>Field recipes, shiny prep, and cost math in one tuned station.</strong>
      <p class="results-summary">
        Every calculator here stays tied to the current save profile, so your berry mockups, material counts, sandwich picks, and running costs all move together.
      </p>
      <div class="tool-showcase-game-row">
        <div class="tool-showcase-game-chip tool-showcase-game-chip--lza">
          <img src="${HOME_GAME_ICON_URLS.lza}" alt="Legends: Z-A" class="tool-showcase-game-img" />
          <span>Legends: Z-A</span>
        </div>
        <div class="tool-showcase-game-chip tool-showcase-game-chip--pla">
          <img src="${HOME_GAME_ICON_URLS.pla}" alt="Legends: Arceus" class="tool-showcase-game-img" />
          <span>Legends: Arceus</span>
        </div>
        <div class="tool-showcase-game-chip tool-showcase-game-chip--sv">
          <span class="tool-showcase-game-img-pair">
            <img src="${HOME_GAME_ICON_URLS.sc}" alt="" class="tool-showcase-game-img" />
            <img src="${HOME_GAME_ICON_URLS.vi}" alt="" class="tool-showcase-game-img" />
          </span>
          <span>Scarlet / Violet</span>
        </div>
      </div>
    </div>
    <div class="tool-showcase-grid">
      <article class="tool-showcase-stat tool-showcase-stat--lza">
        <img src="${HOME_GAME_ICON_URLS.lza}" alt="" class="tool-showcase-stat-badge" />
        <strong>${formatCount(LZA_DONUT_PRESETS.length)}</strong>
        <p>preset donut bases</p>
      </article>
      <article class="tool-showcase-stat tool-showcase-stat--pla">
        <img src="${HOME_GAME_ICON_URLS.pla}" alt="" class="tool-showcase-stat-badge" />
        <strong>${formatCount(PLA_RECIPE_CATALOG.length)}</strong>
        <p>crafting recipes</p>
      </article>
      <article class="tool-showcase-stat tool-showcase-stat--sv">
        <span class="tool-showcase-stat-badge-pair">
          <img src="${HOME_GAME_ICON_URLS.sc}" alt="" class="tool-showcase-stat-badge" />
          <img src="${HOME_GAME_ICON_URLS.vi}" alt="" class="tool-showcase-stat-badge" />
        </span>
        <strong>${formatCount(SV_SHINY_SANDWICH_RECIPES.length)}</strong>
        <p>sandwich routes</p>
      </article>
      <article class="tool-showcase-stat tool-showcase-stat--supply">
        <span class="tool-showcase-stat-icon" aria-hidden="true">◈</span>
        <strong>${formatCount(supplySummary.rows.length)}</strong>
        <p>supply lines open</p>
      </article>
    </div>
  `;

  const lzaCard = document.createElement("article");
  lzaCard.className = "module-card tool-station-card tool-station-card--lza tool-station-card--wide";
  lzaCard.dataset.toolPanel = TOOL_PANEL_IDS.lza;
  lzaCard.innerHTML = `
    <div class="tool-card-head">
      <div class="tool-card-meta">
        <div class="tool-card-orb tool-card-orb--img" aria-hidden="true">
          <img src="${HOME_GAME_ICON_URLS.lza}" alt="" />
        </div>
        <div class="tool-card-copy">
          <span class="module-status live">Legends: Z-A</span>
          <strong>Donut Lab</strong>
        </div>
      </div>
      <span class="toolbar-pill">8-slot mocker</span>
    </div>
    <p class="results-summary tool-note-band">
      Common shiny and farming bases on top, then a live mock builder underneath. This previews flavor bias and donut stats — not a guaranteed power roll.
    </p>
    <div class="tool-preset-grid">
      ${LZA_DONUT_PRESETS.map(
        (preset) => `
          <button type="button" class="ghost-button tool-preset-button" data-lza-preset="${escapeHtml(preset.id)}">
            <span class="tool-preset-title">${escapeHtml(preset.title)}</span>
            <small>${escapeHtml(preset.summary)}</small>
            <div class="tool-preset-focus-row">
              ${(preset.focus ?? []).map((f) => `<span class="tool-preset-focus-chip">${escapeHtml(f)}</span>`).join("")}
            </div>
          </button>
        `
      ).join("")}
    </div>
    <div class="tool-lza-builder">
      <div class="tool-lza-builder-head">
        <span class="meta-label">Berry Tray</span>
        <div class="tool-lza-stats">
          <span class="tool-lza-stat-chip"><span class="tool-lza-stat-label">Berries</span><strong>${lzaSummary.berryCount}/8</strong></span>
          <span class="tool-lza-stat-chip"><span class="tool-lza-stat-label">Level</span><strong>+${formatCount(lzaSummary.totals.level)}</strong></span>
          <span class="tool-lza-stat-chip"><span class="tool-lza-stat-label">Cal</span><strong>${formatCount(lzaSummary.totals.calories)}</strong></span>
          <span class="tool-lza-stat-chip"><span class="tool-lza-stat-label">Score</span><strong>${formatCount(lzaSummary.flavorScore)}</strong></span>
        </div>
      </div>
      <div class="tool-slot-grid">
        ${state.tools.lza.slots
          .map(
            (slot, index) => `
              <label class="select-shell compact-field tool-input-shell">
                <span>Slot ${index + 1}</span>
                <select data-lza-slot="${index}">
                  ${buildBerryOptions(slot)}
                </select>
              </label>
            `
          )
          .join("")}
      </div>
      ${lzaSummary.recipeSummary.length ? `<p class="results-summary tool-lza-recipe-summary">${escapeHtml(lzaSummary.recipeSummary.join(" · "))}</p>` : ""}
    </div>
    <div class="tool-detail-grid">
      <article class="tool-detail-card">
        <span class="meta-label">Dominant Flavor</span>
        <strong class="tool-detail-value">${
          lzaSummary.dominantFlavors.length
            ? escapeHtml(lzaSummary.dominantFlavors.map((flavor) => flavor.label).join(" / "))
            : "No bias yet"
        }</strong>
        <p class="results-summary">
          ${
            lzaSummary.flavors.some((flavor) => flavor.value > 0)
              ? escapeHtml(
                  lzaSummary.flavors
                    .filter((flavor) => flavor.value > 0)
                    .map((flavor) => `${flavor.label} ${flavor.value}`)
                    .join(" · ")
                )
              : "Flavor totals appear here once you start filling the tray."
          }
        </p>
      </article>
      <article class="tool-detail-card">
        <span class="meta-label">Likely Power Pool</span>
        <strong class="tool-detail-value">${
          lzaSummary.powerPool.length
            ? escapeHtml(lzaSummary.powerPool.slice(0, 2).join(" + "))
            : "Waiting for dominant flavor"
        }</strong>
        <p class="results-summary">
          ${
            lzaSummary.powerPool.length
              ? escapeHtml(lzaSummary.powerPool.join(" · "))
              : "Sweet aims at Sparkling and Alpha, Sour at Item and Big Haul, Fresh at Encounter and Capture."
          }
        </p>
      </article>
    </div>
    <div class="tool-action-row">
      <button type="button" class="ghost-button detail-link-button" data-clear-lza>Clear Builder</button>
    </div>
  `;

  lzaCard.querySelectorAll("[data-lza-preset]").forEach((button) => {
    button.addEventListener("click", () => applyLzaPreset(button.dataset.lzaPreset));
  });
  lzaCard.querySelectorAll("[data-lza-slot]").forEach((select) => {
    select.addEventListener("change", () => {
      setLzaDonutSlot(Number.parseInt(select.dataset.lzaSlot, 10), select.value);
    });
  });
  lzaCard.querySelector("[data-clear-lza]")?.addEventListener("click", clearLzaBuilder);

  const plaCard = document.createElement("article");
  plaCard.className = "module-card tool-station-card tool-station-card--pla";
  plaCard.dataset.toolPanel = TOOL_PANEL_IDS.pla;
  plaCard.innerHTML = `
    <div class="tool-card-head">
      <div class="tool-card-meta">
        <div class="tool-card-orb tool-card-orb--img" aria-hidden="true">
          <img src="${HOME_GAME_ICON_URLS.pla}" alt="" />
        </div>
        <div class="tool-card-copy">
          <span class="module-status live">Legends: Arceus</span>
          <strong>Crafting Bench</strong>
        </div>
      </div>
      <span class="toolbar-pill">Materials + cost</span>
    </div>
    <p class="results-summary tool-note-band">
      Pick a recipe, set a batch size, then track owned materials and optional per-material costs to see exactly what you can craft right now.
    </p>
    <div class="tool-field-grid">
      <label class="select-shell compact-field tool-input-shell">
        <span>Recipe</span>
        <select data-pla-recipe>
          ${buildRecipeOptions(state.tools.pla.recipeName)}
        </select>
      </label>
      <label class="select-shell compact-field tool-input-shell">
        <span>Batch Amount</span>
        <input type="number" min="1" step="1" value="${escapeHtml(String(state.tools.pla.amount))}" data-pla-amount />
      </label>
    </div>
    <div class="tool-pla-signals">
      <div class="tool-pla-signal${plaSummary.craftableNow > 0 ? " tool-pla-signal--ready" : ""}">
        <span class="tool-pla-signal-label">Craftable Now</span>
        <strong>${formatCount(plaSummary.craftableNow)}</strong>
      </div>
      <div class="tool-pla-signal">
        <span class="tool-pla-signal-label">Materials</span>
        <strong>${formatCount(plaSummary.materialRows.length)}</strong>
      </div>
      <div class="tool-pla-signal${plaSummary.totalCost > 0 ? " tool-pla-signal--cost" : ""}">
        <span class="tool-pla-signal-label">Batch Cost</span>
        <strong>${formatMoney(plaSummary.totalCost)}</strong>
      </div>
      <div class="tool-pla-signal${plaSummary.missingMaterials.length > 0 ? " tool-pla-signal--warn" : " tool-pla-signal--ready"}">
        <span class="tool-pla-signal-label">Missing</span>
        <strong>${formatCount(plaSummary.missingMaterials.length)}</strong>
      </div>
    </div>
    ${
      plaSummary.missingMaterials.length
        ? `<p class="results-summary tool-pla-missing-note">Short on: ${escapeHtml(plaSummary.missingMaterials.map((m) => `${m.name} ×${m.shortfall}`).join(", "))}.</p>`
        : `<p class="results-summary tool-pla-ready-note">Your current stock covers this full batch.</p>`
    }
    <div class="tool-table-shell">
      <div class="tool-table">
        <div class="tool-table-head">
          <span>Material</span>
          <span>Need</span>
          <span>Owned</span>
          <span>Unit Cost</span>
          <span>Shortfall</span>
        </div>
        ${plaSummary.materialRows
          .map(
            (material) => `
              <div class="tool-table-row${material.shortfall > 0 ? " tool-table-row--warn" : material.owned > 0 ? " tool-table-row--ok" : ""}">
                <span class="tool-table-label">${escapeHtml(material.name)}</span>
                <span class="tool-table-value">${formatCount(material.required)}</span>
                <input
                  class="tool-table-input"
                  type="number"
                  min="0"
                  step="1"
                  value="${escapeHtml(String(material.owned))}"
                  data-pla-owned="${escapeHtml(material.name)}"
                />
                <input
                  class="tool-table-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value="${escapeHtml(state.tools.pla.materialCosts[material.name] ?? "")}"
                  data-pla-cost="${escapeHtml(material.name)}"
                />
                <span class="tool-table-value tool-table-shortfall${material.shortfall > 0 ? " is-short" : " is-ready"}">${material.shortfall ? formatCount(material.shortfall) : "✓"}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  plaCard.querySelector("[data-pla-recipe]")?.addEventListener("change", (event) => {
    setPlaRecipeName(event.currentTarget.value);
  });
  plaCard.querySelector("[data-pla-amount]")?.addEventListener("change", (event) => {
    setPlaRecipeAmount(event.currentTarget.value);
  });
  plaCard.querySelectorAll("[data-pla-owned]").forEach((input) => {
    input.addEventListener("change", () => {
      setPlaMaterialCount(input.dataset.plaOwned, input.value);
    });
  });
  plaCard.querySelectorAll("[data-pla-cost]").forEach((input) => {
    input.addEventListener("change", () => {
      setPlaMaterialCost(input.dataset.plaCost, input.value);
    });
  });

  const svTypeKey = (state.tools.sv.type ?? "Normal").toLowerCase();
  const svTypeColor = TYPE_COLORS[svTypeKey] ?? "#59748d";

  const svCard = document.createElement("article");
  svCard.className = "module-card tool-station-card tool-station-card--sv";
  svCard.dataset.toolPanel = TOOL_PANEL_IDS.sv;
  svCard.style.setProperty("--sv-type-color", svTypeColor);
  svCard.innerHTML = `
    <div class="tool-card-head">
      <div class="tool-card-meta">
        <div class="tool-card-orb tool-card-orb--img tool-card-orb--split" aria-hidden="true">
          <img src="${HOME_GAME_ICON_URLS.sc}" alt="" />
          <img src="${HOME_GAME_ICON_URLS.vi}" alt="" />
        </div>
        <div class="tool-card-copy">
          <span class="module-status live">Scarlet / Violet</span>
          <strong>Shiny Sandwich Maker</strong>
        </div>
      </div>
      <span class="toolbar-pill">Sparkling Lv. 3</span>
    </div>
    <p class="results-summary tool-note-band">
      Choose a target type to get the quick shiny sandwich base plus the flexible picnic version that works with almost any pair of Herba.
    </p>
    <div class="tool-sv-selector">
      <label class="select-shell compact-field tool-input-shell">
        <span>Target Type</span>
        <select data-sv-type>
          ${SV_SHINY_SANDWICH_RECIPES.map(
            (recipe) =>
              `<option value="${escapeHtml(recipe.type)}"${recipe.type === state.tools.sv.type ? " selected" : ""}>${escapeHtml(recipe.type)}</option>`
          ).join("")}
        </select>
      </label>
      <div class="tool-sv-type-badge" style="background:${escapeHtml(svTypeColor)}20;border-color:${escapeHtml(svTypeColor)}44;color:${escapeHtml(svTypeColor)}">
        ${escapeHtml(svRecipe?.type ?? "Normal")}
      </div>
    </div>
    <div class="tool-sv-recipe-cards">
      <article class="tool-sv-recipe-card">
        <span class="tool-sv-recipe-label">Minimal Base</span>
        <strong class="tool-sv-ingredient">${escapeHtml(svRecipe?.minimalIngredient ?? "Tofu")}</strong>
        <div class="tool-sv-herba-row">
          ${(svRecipe?.minimalHerba ?? []).map((h) => `<span class="tool-sv-herba-chip">${escapeHtml(h)}</span>`).join("")}
        </div>
        <p class="results-summary">${escapeHtml([svRecipe?.minimalIngredient, ...(svRecipe?.minimalHerba ?? [])].filter(Boolean).join(" + "))}</p>
      </article>
      <article class="tool-sv-recipe-card">
        <span class="tool-sv-recipe-label">Flexible Mode</span>
        <strong class="tool-sv-ingredient">${escapeHtml((svRecipe?.flexibleIngredients ?? []).join(", "))}</strong>
        ${svRecipe?.flexibleHerbaExceptions?.length ? `<p class="results-summary">Avoid: ${escapeHtml(svRecipe.flexibleHerbaExceptions.join(", "))}.</p>` : ""}
      </article>
    </div>
    <div class="tool-sv-odds-grid">
      ${SV_SHINY_ODDS.map((entry) => `
        <div class="tool-sv-odds-chip">
          <span>${escapeHtml(entry.label)}</span>
          <strong>${escapeHtml(String(entry.value))}</strong>
        </div>
      `).join("")}
    </div>
    <p class="results-summary tool-note-band">
      Best route: clear 60 outbreak spawns first, save before the picnic, then stack Sparkling Lv. 3 with the Shiny Charm for the 1/512 ceiling.
    </p>
  `;

  svCard.querySelector("[data-sv-type]")?.addEventListener("change", (event) => {
    setSvSandwichType(event.currentTarget.value);
  });

  const supplyCard = document.createElement("article");
  supplyCard.className = "module-card tool-station-card tool-station-card--supply tool-station-card--wide";
  supplyCard.dataset.toolPanel = TOOL_PANEL_IDS.supply;
  supplyCard.innerHTML = `
    <div class="tool-card-head">
      <div class="tool-card-meta">
        <div class="tool-card-orb tool-card-orb--icon" aria-hidden="true">◈</div>
        <div class="tool-card-copy">
          <span class="module-status live">Shared Utility</span>
          <strong>Supply Cost Tracker</strong>
        </div>
      </div>
      <div class="tool-supply-totals">
        <span class="tool-supply-total-chip"><span>Items</span><strong>${formatCount(supplySummary.totalQuantity)}</strong></span>
        <span class="tool-supply-total-chip tool-supply-total-chip--cost"><span>Total</span><strong>${formatMoney(supplySummary.totalCost)}</strong></span>
      </div>
    </div>
    <p class="results-summary tool-note-band">
      Keep a running list of item costs and counts when you are pricing donuts, crafting batches, sandwich runs, or shopping lists.
    </p>
    <div class="tool-stat-grid tool-stat-grid--supply">
      ${renderToolStatChip("Lines", formatCount(supplySummary.rows.length))}
      ${renderToolStatChip("Quantity", formatCount(supplySummary.totalQuantity))}
      ${renderToolStatChip("Total Cost", formatMoney(supplySummary.totalCost))}
    </div>
    <div class="tool-table-shell">
      <div class="tool-table">
        <div class="tool-table-head tool-table-head--supply">
          <span>Item</span>
          <span>Unit Cost</span>
          <span>Qty</span>
          <span>Total</span>
          <span></span>
        </div>
        ${supplySummary.rows
          .map((row) => {
            const quantity = Math.max(0, normalizeNonNegativeInteger(row.quantity, 0));
            const total = parseMoney(row.unitCost) * quantity;
            return `
              <div class="tool-table-row tool-table-row--supply">
                <input
                  class="tool-table-input"
                  type="text"
                  placeholder="Item name"
                  value="${escapeHtml(row.name)}"
                  data-supply-name="${escapeHtml(row.id)}"
                />
                <input
                  class="tool-table-input"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value="${escapeHtml(row.unitCost)}"
                  data-supply-cost="${escapeHtml(row.id)}"
                />
                <input
                  class="tool-table-input"
                  type="number"
                  min="0"
                  step="1"
                  value="${escapeHtml(row.quantity)}"
                  data-supply-qty="${escapeHtml(row.id)}"
                />
                <span class="tool-table-value">${formatMoney(total)}</span>
                <button type="button" class="ghost-button tool-inline-button" data-remove-supply="${escapeHtml(row.id)}">
                  Remove
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
    <div class="tool-action-row">
      <button type="button" class="ghost-button detail-link-button" data-add-supply>Add Line</button>
    </div>
  `;

  supplyCard.querySelector("[data-add-supply]")?.addEventListener("click", addSupplyTrackerRow);
  supplyCard.querySelectorAll("[data-supply-name]").forEach((input) => {
    input.addEventListener("change", () => {
      updateSupplyTrackerRow(input.dataset.supplyName, "name", input.value);
    });
  });
  supplyCard.querySelectorAll("[data-supply-cost]").forEach((input) => {
    input.addEventListener("change", () => {
      updateSupplyTrackerRow(input.dataset.supplyCost, "unitCost", input.value);
    });
  });
  supplyCard.querySelectorAll("[data-supply-qty]").forEach((input) => {
    input.addEventListener("change", () => {
      updateSupplyTrackerRow(input.dataset.supplyQty, "quantity", input.value);
    });
  });
  supplyCard.querySelectorAll("[data-remove-supply]").forEach((button) => {
    button.addEventListener("click", () => removeSupplyTrackerRow(button.dataset.removeSupply));
  });

  elements.moduleGrid.append(showcaseCard, lzaCard, plaCard, svCard, supplyCard);
}
