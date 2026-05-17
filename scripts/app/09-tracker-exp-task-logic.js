// Scroll preservation, playthrough tracker, EXP planner rendering, and next-task logic
// Source chunk generated from the original app.js lines 12505-13684.

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

function preserveModuleQueueScroll(callback, anchorId = "") {
  const previousX = window.scrollX;
  const previousY = window.scrollY;
  const panelSelector = "[data-tool-panel]";
  const explicitAnchor =
    anchorId && elements.moduleGrid
      ? elements.moduleGrid.querySelector(`${panelSelector}[data-tool-panel="${anchorId}"]`)
      : null;
  const visibleAnchor =
    explicitAnchor ??
    [...(elements.moduleGrid?.querySelectorAll(panelSelector) ?? [])].find((panel) => {
      const rect = panel.getBoundingClientRect();
      return rect.bottom > 120 && rect.top < window.innerHeight - 48;
    }) ??
    null;
  const resolvedAnchorId = visibleAnchor?.dataset.toolPanel ?? "";
  const previousTop = visibleAnchor?.getBoundingClientRect().top ?? null;

  const restore = () => {
    if (resolvedAnchorId && previousTop !== null && elements.moduleGrid) {
      const nextAnchor = elements.moduleGrid.querySelector(
        `${panelSelector}[data-tool-panel="${resolvedAnchorId}"]`
      );
      if (nextAnchor) {
        const delta = nextAnchor.getBoundingClientRect().top - previousTop;
        if (Math.abs(delta) > 1) {
          window.scrollBy(0, delta);
        }
        return;
      }
    }

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
    refreshResults();
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

function renderTracker(options = {}) {
  if (!shouldRenderForViews(["journey"], options.force)) {
    return;
  }

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

async function renderExpPlanner(options = {}) {
  if (!shouldRenderForViews(["lab"], options.force)) {
    return;
  }

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
