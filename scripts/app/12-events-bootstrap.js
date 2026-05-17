// Event listeners and application boot sequence
// Source chunk generated from the original app.js lines 15568-15982.

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
elements.scanVisualButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setScanVisualMode(button.dataset.scanVisual);
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
elements.scanCaughtMinusButton.addEventListener("click", () => {
  if (!state.currentPokemon || !isArchiveDuplicateMode()) {
    return;
  }

  changeLivingDexCount(state.currentPokemon, -1);
});
elements.scanCaughtPlusButton.addEventListener("click", () => {
  if (!state.currentPokemon || !isArchiveDuplicateMode()) {
    return;
  }

  changeLivingDexCount(state.currentPokemon, 1);
});
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
elements.shinySuggestCatchButton.addEventListener("click", () => {
  catchSelectedShinyHubTarget();
});
elements.shinySuggestRerollButton.addEventListener("click", () => {
  const selectedGame = getShinyHubSelectedGame();
  if (!selectedGame) {
    setStatus("Choose a shiny game before rerolling the hunt board.");
    return;
  }

  rerollShinyHubSuggestions(selectedGame.id);
  setStatus(`${selectedGame.name} shiny hunt suggestions rerolled.`);
});
elements.shinySearchInput.addEventListener("input", () => {
  state.shinyHub.searchQuery = elements.shinySearchInput.value;
  saveShinyHubState();
  renderShinyHub();
});
elements.shinyTrackerPlusButton.addEventListener("click", () => {
  adjustShinyHubEncounters(1);
});
elements.shinyTrackerMinusButton.addEventListener("click", () => {
  adjustShinyHubEncounters(-1);
});
elements.shinyTrackerIncrementInput.addEventListener("change", () => {
  updateShinyHubSessionAmount("increment", elements.shinyTrackerIncrementInput.value);
});
elements.shinyTrackerDecrementInput.addEventListener("change", () => {
  updateShinyHubSessionAmount("decrement", elements.shinyTrackerDecrementInput.value);
});
elements.shinyTrackerStartButton.addEventListener("click", () => {
  toggleShinyHubTimer();
});
elements.shinyTrackerResetButton.addEventListener("click", () => {
  resetShinyHubSession();
});
if (elements.profileSelect) {
  elements.profileSelect.addEventListener("change", () => {
    switchProfile(elements.profileSelect.value);
  });
}
if (elements.createProfileButton) {
  elements.createProfileButton.addEventListener("click", () => {
    const nextId = createProfile(elements.profileNameInput?.value ?? "");
    if (!nextId) {
      setStatus("Unable to create a new local trainer profile right now.");
      return;
    }

    if (elements.profileNameInput) {
      elements.profileNameInput.value = "";
    }
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
}
if (elements.profileNameInput && elements.createProfileButton) {
  elements.profileNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      elements.createProfileButton.click();
    }
  });
}
elements.accountSignInButton.addEventListener("click", () => {
  void signInCloudAccount();
});
elements.accountSignUpButton.addEventListener("click", () => {
  void signUpCloudAccount();
});
elements.accountAutoSyncButton.addEventListener("click", () => {
  setCloudAutoSyncEnabled(!isCloudAutoSyncEnabled());
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
window.addEventListener("focus", requestCloudAutoSyncRefresh);
window.addEventListener("online", requestCloudAutoSyncRefresh);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    requestCloudAutoSyncRefresh();
  }
});
elements.trainerNotebook.addEventListener("input", () => {
  state.notebook = elements.trainerNotebook.value;
  saveNotebookState();
  elements.notebookStatus.textContent = "Autosaved locally";
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

elements.ownedGameOnlyToggle.addEventListener("change", () => {
  state.filters.ownedGameOnly = elements.ownedGameOnlyToggle.checked;
  refreshResults();
});
elements.archiveDuplicateModeToggle.addEventListener("change", () => {
  setArchiveDuplicateMode(elements.archiveDuplicateModeToggle.checked);
});
elements.duplicatePlannerFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setDuplicatePlannerFilter(button.dataset.duplicateFilter);
  });
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
flushDeferredViewRenders();
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
  if (state.cloud.user) {
    void hydrateCloudSession("INITIAL_SESSION");
  }
  renderTrainerVault();
});
if (bootedFromDexCache) {
  void restorePersistedCurrentScan();
}
fetchDexIndex();
