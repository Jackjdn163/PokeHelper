// Collection rendering, trainer vault, HOME organizer, and tool workbench
// Source chunk generated from the original app.js lines 10931-12503.

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
