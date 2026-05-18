// Suggestors, type chips, Pokemon details, dex list rendering, and detail fetching
// Source chunk generated from the original app.js lines 14219-15566.

function renderSuggestors(options = {}) {
  if (!shouldRenderForViews(["lab"], options.force)) {
    return;
  }

  const catchTarget = getSuggestedCatchEntry();
  const shinyTarget = getSuggestedShinyEntry();
  const task = getNextTask();

  elements.advisorFocus.textContent = task.focus;

  renderSuggestedCatchLabel(elements.suggestCatchName, catchTarget, {
    emptyText: "All visible entries logged",
    includeGameBadge: true
  });
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
  const preferKnownEntrySprite = hasDistinctIdentitySprite(knownEntry);
  const preferKnownEntryArtworkFallback = Boolean(knownEntry?.syntheticKind && preferKnownEntrySprite);
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
    syntheticKind: knownEntry?.syntheticKind ?? null,
    sprite:
      (preferKnownEntrySprite ? knownEntry?.listSprite : apiPokemon.sprites.other.home.front_default) ||
      (preferKnownEntrySprite ? apiPokemon.sprites.other.home.front_default : knownEntry?.listSprite) ||
      apiPokemon.sprites.front_default ||
      apiPokemon.sprites.other["official-artwork"].front_default ||
      "",
    spriteShiny:
      (preferKnownEntrySprite ? knownEntry?.shinyListSprite : apiPokemon.sprites.other.home.front_shiny) ||
      (preferKnownEntrySprite ? apiPokemon.sprites.other.home.front_shiny : knownEntry?.shinyListSprite) ||
      apiPokemon.sprites.front_shiny ||
      apiPokemon.sprites.other["official-artwork"].front_shiny ||
      (preferKnownEntrySprite ? knownEntry?.listSprite : apiPokemon.sprites.other.home.front_default) ||
      (preferKnownEntrySprite ? apiPokemon.sprites.other.home.front_default : knownEntry?.listSprite) ||
      apiPokemon.sprites.front_default ||
      "",
    artwork:
      (preferKnownEntryArtworkFallback ? knownEntry?.listSprite : apiPokemon.sprites.other["official-artwork"].front_default) ||
      (preferKnownEntryArtworkFallback ? apiPokemon.sprites.other["official-artwork"].front_default : knownEntry?.listSprite) ||
      apiPokemon.sprites.other.home.front_default ||
      apiPokemon.sprites.front_default ||
      knownEntry?.shinyListSprite ||
      apiPokemon.sprites.front_shiny ||
      "",
    artworkShiny:
      (preferKnownEntryArtworkFallback ? knownEntry?.shinyListSprite : apiPokemon.sprites.other["official-artwork"].front_shiny) ||
      (preferKnownEntryArtworkFallback ? apiPokemon.sprites.other["official-artwork"].front_shiny : knownEntry?.shinyListSprite) ||
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
    generation: `Generation ${
      knownEntry?.generation ?? determineEntryGeneration(knownEntry ?? { baseNumber: species.id, name: species.name })
    }`.replace("Generation unknown", "Unknown"),
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
  const highlightedGameId =
    state.filters.game !== "all"
      ? state.filters.game
      : state.tracker.activeGame !== "none"
        ? state.tracker.activeGame
        : null;
  const visibleVarieties =
    highlightedGameId && state.gameAvailabilityReady
      ? varieties.filter((form) =>
          isEntryAvailableInGame(state.entriesByName.get(form.name) ?? form, highlightedGameId)
        )
      : varieties;

  elements.formList.replaceChildren();
  elements.formCount.textContent =
    highlightedGameId && state.gameAvailabilityReady && visibleVarieties.length !== varieties.length
      ? `${visibleVarieties.length}/${varieties.length} forms`
      : `${visibleVarieties.length} forms`;

  if (!visibleVarieties.length) {
    const empty = document.createElement("span");
    empty.className = "matchup-chip";
    empty.textContent =
      highlightedGameId && state.gameAvailabilityReady
        ? "No obtainable variants in the highlighted game"
        : "No alternate forms";
    empty.style.background = "rgba(89, 200, 255, 0.1)";
    elements.formList.appendChild(empty);
    return;
  }

  visibleVarieties.forEach((form) => {
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

  const caughtCount = getCaughtCount(pokemon.name);
  const statusBits = [
    `#${formatNumber(pokemon.dexNumber)}`,
    getCaughtStatusLabel(pokemon.name),
    isShiny(pokemon.name) ? "Shiny caught" : null
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

renderScanVisualToggle();

function renderScanCaughtControls(pokemon = state.currentPokemon) {
  const duplicateMode = isArchiveDuplicateMode();
  const count = pokemon ? getCaughtCount(pokemon.name) : 0;
  const caught = count > 0;

  elements.toggleCaughtButton.hidden = duplicateMode;
  elements.toggleCaughtButton.classList.toggle("hidden", duplicateMode);
  elements.scanCaughtStepperShell.hidden = !duplicateMode;
  elements.scanCaughtStepperShell.classList.toggle("hidden", !duplicateMode);

  if (duplicateMode) {
    elements.scanCaughtMinusButton.disabled = !pokemon || count <= 0;
    elements.scanCaughtPlusButton.disabled = !pokemon;
    elements.scanCaughtCount.textContent = formatCount(count);
    return;
  }

  elements.toggleCaughtButton.disabled = !pokemon;
  if (!pokemon) {
    elements.toggleCaughtButton.textContent = "Register Caught";
    elements.toggleCaughtButton.classList.remove("caught");
    return;
  }

  elements.toggleCaughtButton.textContent =
    count > 1 ? `Caught x${formatCount(count)}` : caught ? "Caught Registered" : "Register Caught";
  elements.toggleCaughtButton.classList.toggle("caught", caught);
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
  renderScanCaughtControls(null);
  elements.toggleShinyButton.disabled = true;
  elements.toggleShinyButton.textContent = "Catch Shiny";
  elements.toggleShinyButton.classList.remove("active");
  elements.clearScanButton.disabled = true;
  elements.clearScanButton.classList.add("hidden");
  elements.bookmarkButton.textContent = "Bookmark";
  elements.bookmarkButton.classList.remove("active");
  renderScanVisualToggle();
  setStatus("Current scan cleared.");
}

function renderCurrentPokemon(pokemon, options = {}) {
  const previousPokemonName = state.currentPokemon?.name ?? null;
  state.currentPokemon = pokemon;
  state.sessionRestore.currentPokemonName = pokemon.name;
  saveUiSessionState();
  setSelectedDexEntryCard(pokemon.name, previousPokemonName);
  renderCurrentScanRibbon();

  if (!options.force && state.ui.activeView !== "scan") {
    markViewsDirty("scan");
    return;
  }

  clearDirtyViews("scan");
  const shiny = isShiny(pokemon.name);
  const shinyLocked = isShinyDexLocked(pokemon.name);
  const bookmarked = isBookmarked(pokemon.name);

  elements.pokemonName.textContent = pokemon.displayName;
  renderCurrentPokemonVisual();
  elements.pokemonDex.textContent = `Dex #${formatNumber(pokemon.dexNumber)}`;
  elements.pokemonFlavor.textContent = pokemon.flavorText;
  elements.pokemonGenus.textContent = pokemon.genus;
  elements.pokemonHeight.textContent = pokemon.height;
  elements.pokemonWeight.textContent = pokemon.weight;
  elements.pokemonAbilities.textContent = pokemon.abilities.join(", ");
  elements.pokemonHabitat.textContent = pokemon.habitat;
  elements.pokemonGeneration.textContent = pokemon.generation;
  renderPokedexEntries(pokemon);
  elements.bstTotal.textContent = `BST ${pokemon.bst}`;
  renderScanCaughtControls(pokemon);
  elements.toggleShinyButton.disabled = shinyLocked;
  elements.toggleShinyButton.textContent = shinyLocked ? "Shiny Locked" : shiny ? "Shiny Caught" : "Catch Shiny";
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
    const ownedMissing = !tracked && isEntryAvailableInOwnedCoverage(entry);
    const scopeMatches =
      state.filters.scope === "all" ||
      (state.filters.scope === "base" && !entry.isForm) ||
      (state.filters.scope === "forms" && entry.isForm);
    const statusMatches =
      state.filters.status === "all" ||
      (state.filters.status === "caught" && tracked) ||
      (state.filters.status === "missing" && !tracked) ||
      (state.filters.status === "owned-missing" && ownedMissing);
    const generationMatches =
      state.filters.generation === "all" || String(entry.generation) === state.filters.generation;
    const gameMatches =
      state.filters.game === "all" ||
      (!state.gameAvailabilityReady && state.gameAvailabilityLoading) ||
      (state.filters.ownedGameOnly
        ? isEntryExclusiveToOwnedGameSelection(entry, state.filters.game)
        : isEntryAvailableInGame(entry, state.filters.game));
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
    } else if (button.dataset.status === "owned-missing") {
      button.textContent = getArchiveOwnedMissingLabel();
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
  const ownedGameOnlyMeta = getArchiveOwnedGameOnlyFilterMeta();
  elements.ownedGameOnlyToggle.checked = state.filters.ownedGameOnly;
  elements.ownedGameOnlyToggle.disabled = !ownedGameOnlyMeta.enabled;
  elements.ownedGameOnlyToggleShell.classList.toggle("disabled", !ownedGameOnlyMeta.enabled);
  elements.ownedGameOnlyNote.textContent = ownedGameOnlyMeta.note;
  const duplicateModeAvailable = !isArchiveShinyMode();
  elements.archiveDuplicateModeToggle.checked = state.ui.archiveDuplicateMode;
  elements.archiveDuplicateModeToggle.disabled = !duplicateModeAvailable;
  elements.archiveDuplicateModeShell.classList.toggle("disabled", !duplicateModeAvailable);
  elements.archiveDuplicateNote.textContent = duplicateModeAvailable
    ? state.ui.archiveDuplicateMode
      ? "Plus and minus counters are live across Dex and Scan for living-dex copy tracking."
      : "Turn this on to swap living-dex catch toggles into copy counters."
    : "Duplicate counting is only available while the Dex is in Living Dex mode.";
  elements.sortIndicator.textContent = labelSort(state.filters.sort);
  elements.archiveModeIndicator.textContent = `Mode ${getArchiveModeLabel()} - Public Access`;
  elements.archiveRegistryLabel.textContent = isArchiveShinyMode() ? "Shiny Registry" : "Registry";
  elements.statTrackedLabel.textContent = isArchiveShinyMode() ? "Caught Shiny" : "Caught";
  elements.statMissingLabel.textContent = getArchiveMissingLabel();
  elements.dexList.classList.toggle("is-grid", isArchiveGridView());
  elements.dexList.classList.toggle("is-dupe-mode", isArchiveDuplicateMode());
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
  const ownedGameOnlyMeta = getArchiveOwnedGameOnlyFilterMeta();
  if (activeGameFilter && state.filters.ownedGameOnly && !state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.resultsSummary.textContent = `Syncing ${activeGameFilter.shortName} unique owned-game coverage now.`;
  } else if (activeGameFilter && !state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.resultsSummary.textContent = `Syncing ${activeGameFilter.shortName} game coverage now.`;
  } else if (filteredEntries.length === total && state.filters.game === "all") {
    elements.resultsSummary.textContent = `Guest mode active. Full ${modeLabel.toLowerCase()} Dex signal online.`;
  } else if (activeGameFilter && state.filters.ownedGameOnly) {
    elements.resultsSummary.textContent = ownedGameOnlyMeta.comparisonGameCount
      ? `${formatCount(filteredEntries.length)} ${modeLabel.toLowerCase()} entities are unique to ${activeGameFilter.shortName} within your owned games.`
      : `${formatCount(filteredEntries.length)} ${modeLabel.toLowerCase()} entities are obtainable in your only owned game, ${activeGameFilter.shortName}.`;
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

function describeCaughtCountChange(entry, previousCount, nextCount) {
  if (nextCount <= 0) {
    return `${entry.displayName} cleared from your living dex.`;
  }

  if (previousCount <= 0 && nextCount === 1) {
    return `${entry.displayName} registered with 1 living copy.`;
  }

  return `${entry.displayName} now tracks ${formatCount(nextCount)} ${
    nextCount === 1 ? "copy" : "copies"
  } in the living dex.`;
}

function updateLivingDexCount(entry, nextCount) {
  const previousCount = getCaughtCount(entry.name);
  const normalizedCount = setCaughtCount(entry.name, nextCount);

  if (normalizedCount === previousCount) {
    return;
  }

  refreshResults();
  renderCollections();
  renderHomeOrganizer();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  setStatus(describeCaughtCountChange(entry, previousCount, normalizedCount));
}

function getActiveArchiveVersionExclusiveMeta(entry) {
  const gameId = state.filters.game;
  if (!entry || !gameId || gameId === "all" || !state.gameAvailabilityReady) {
    return null;
  }

  const versions = getVersionExclusiveVersions(gameId, entry.baseNumber);
  if (!versions.length) {
    return null;
  }

  return {
    label: getVersionExclusiveLabel(gameId, entry.baseNumber),
    classes: getVersionExclusiveBadgeClasses(gameId, entry.baseNumber)
  };
}

function applyArchiveVersionExclusiveCardState(card, entry) {
  const meta = getActiveArchiveVersionExclusiveMeta(entry);
  card.classList.toggle("has-version-exclusive", Boolean(meta));

  if (!meta) {
    return null;
  }

  card.classList.add(...meta.classes);
  card.dataset.versionExclusive = meta.label;
  card.title = card.title ? `${card.title} - ${meta.label}` : meta.label;
  return meta;
}

function changeLivingDexCount(entry, delta) {
  updateLivingDexCount(entry, getCaughtCount(entry.name) + delta);
}

function createCaughtCountStepper(entry, options = {}) {
  const variant = options.variant ?? "list";
  const count = getCaughtCount(entry.name);
  const shell = document.createElement("div");
  shell.className = `caught-count-stepper caught-count-stepper--${variant}`;
  shell.classList.toggle("is-active", count > 0);
  shell.setAttribute("aria-label", `Adjust living-dex copy count for ${entry.displayName}`);

  const minusButton = document.createElement("button");
  minusButton.type = "button";
  minusButton.className = "caught-count-button";
  minusButton.textContent = "-";
  minusButton.disabled = count <= 0;
  minusButton.setAttribute("aria-label", `Remove one ${entry.displayName} copy`);
  minusButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    changeLivingDexCount(entry, -1);
  });

  const value = document.createElement("span");
  value.className = "caught-count-value";
  value.textContent = formatCount(count);

  const plusButton = document.createElement("button");
  plusButton.type = "button";
  plusButton.className = "caught-count-button";
  plusButton.textContent = "+";
  plusButton.setAttribute("aria-label", `Add one ${entry.displayName} copy`);
  plusButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    changeLivingDexCount(entry, 1);
  });

  shell.append(minusButton, value, plusButton);
  return shell;
}

function buildDexEntryListNode(entry) {
  const instance = elements.dexEntryTemplate.content.cloneNode(true);
  const card = instance.querySelector(".dex-entry");
  const toggle = instance.querySelector(".entry-toggle");
  const checkbox = instance.querySelector(".entry-checkbox");
  const entryButton = instance.querySelector(".dex-entry-button");
  const entrySprite = instance.querySelector(".entry-sprite");
  const entryNumber = instance.querySelector(".entry-number");
  const entryName = instance.querySelector(".entry-name");
  const entryStatus = instance.querySelector(".entry-status");
  const entryTags = instance.querySelector(".entry-tags");
  const duplicateMode = isArchiveDuplicateMode();
  const caught = isCaught(entry.name);
  const caughtCount = getCaughtCount(entry.name);
  const shiny = isShiny(entry.name);
  const tracked = isArchiveTracked(entry.name);
  const accentKey = getEntryAccentKey(entry);

  card.dataset.entryName = entry.name;
  card.dataset.accent = accentKey;
  entryButton.dataset.entryName = entry.name;
  card.classList.toggle("selected", entry.name === state.currentPokemon?.name);
  card.classList.toggle("caught", tracked);
  card.classList.toggle("is-form", entry.isForm);
  card.classList.toggle("count-mode", duplicateMode);
  const versionExclusiveMeta = applyArchiveVersionExclusiveCardState(card, entry);

  if (duplicateMode) {
    toggle.classList.add("count-mode");
    toggle.replaceChildren(createCaughtCountStepper(entry, { variant: "list" }));
  } else {
    checkbox.dataset.entryName = entry.name;
    checkbox.checked = tracked;
    checkbox.setAttribute(
      "aria-label",
      `${isArchiveShinyMode() ? "Toggle shiny state" : "Toggle caught state"} for ${entry.displayName}`
    );
  }

  applyEntrySprite(entrySprite, entry, {
    forceShiny: isArchiveShinyMode(),
    preferTrackedShiny: isArchiveShinyMode()
  });
  entryNumber.textContent = `#${formatNumber(entry.baseNumber)}`;
  entryName.textContent = entry.displayName;
  const livingStatus = duplicateMode
    ? caughtCount > 0
      ? `${getCaughtCountSummary(caughtCount)}${
          getDuplicateCount(entry.name) ? ` · ${formatCount(getDuplicateCount(entry.name))} dupes` : ""
        }`
      : "No copies tracked"
    : caught
      ? "Caught"
      : "Missing";
  entryStatus.textContent = `${
    isArchiveShinyMode()
      ? tracked
        ? "Shiny caught"
        : "Missing shiny"
      : livingStatus
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
    tags.push(...entry.formFlags.filter((flag) => flag !== "form").map(formatFormFlagLabel));
    if (!tags.length) {
      tags.push("Form");
    }
  } else {
    tags.push("Base");
  }

  tags.slice(0, 2).forEach((label) => {
    entryTags.appendChild(makeTag(label, label === "Shiny" ? null : accentKey));
  });
  if (versionExclusiveMeta?.label) {
    entryTags.appendChild(makeTag(versionExclusiveMeta.label, "version-exclusive"));
  }

  state.archiveRender.renderedCardsByName.set(entry.name, card);
  return instance;
}

function buildDexEntryGridNode(entry) {
  const card = document.createElement("article");
  const openButton = document.createElement("button");
  const number = document.createElement("span");
  const sprite = document.createElement("img");
  const name = document.createElement("strong");
  const duplicateMode = isArchiveDuplicateMode();
  const tracked = isArchiveTracked(entry.name);
  const caught = isCaught(entry.name);
  const shinyLocked = isShinyDexLocked(entry.name);

  card.className = "archive-grid-card";
  card.dataset.entryName = entry.name;
  card.classList.toggle("selected", entry.name === state.currentPokemon?.name);
  card.classList.toggle("caught", tracked);
  card.classList.toggle("is-form", entry.isForm);
  card.classList.toggle("count-mode", duplicateMode);
  card.dataset.accent = getEntryAccentKey(entry);
  applyArchiveVersionExclusiveCardState(card, entry);

  openButton.type = "button";
  openButton.className = "archive-grid-open";
  openButton.dataset.entryName = entry.name;

  number.className = "archive-grid-number";
  number.textContent = `#${formatNumber(entry.baseNumber)}`;

  sprite.className = "archive-grid-sprite";
  applyEntrySprite(sprite, entry, {
    forceShiny: isArchiveShinyMode(),
    preferTrackedShiny: isArchiveShinyMode()
  });

  name.className = "archive-grid-name";
  name.textContent = entry.displayName;

  openButton.append(number, sprite, name);

  if (duplicateMode) {
    card.append(openButton, createCaughtCountStepper(entry, { variant: "grid" }));
  } else {
    const catchButton = document.createElement("button");
    catchButton.type = "button";
    catchButton.className = "archive-grid-catch-btn";
    catchButton.dataset.entryName = entry.name;
    catchButton.classList.toggle("caught", tracked);
    catchButton.disabled = isArchiveShinyMode() && shinyLocked;
    catchButton.textContent = isArchiveShinyMode()
      ? shinyLocked
        ? "Locked"
        : tracked
          ? "Caught"
          : "Catch"
      : caught
        ? "Caught"
        : "Catch";
    catchButton.setAttribute(
      "aria-label",
      `${isArchiveShinyMode() ? "Toggle shiny state" : "Toggle caught state"} for ${entry.displayName}`
    );
    card.append(openButton, catchButton);
  }

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
  normalizeArchiveGameFilters();
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
          ? "caught in the shiny dex."
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

function resolvePokemonDetailFetchTarget(nameOrId, knownEntry = null) {
  if (!knownEntry || typeof nameOrId !== "string") {
    return nameOrId;
  }

  if (!knownEntry.syntheticKind) {
    return knownEntry.name;
  }

  return knownEntry.basePokemonName || knownEntry.name || nameOrId;
}

async function fetchDexIndex() {
  setStatus("Syncing full Dex index...");

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
        const formFlags = detectFormFlags(entry.name, id);
        const normalizedEntry = {
          id,
          name: entry.name,
          displayName,
          isForm: id > BASE_POKEMON_COUNT,
          baseNumber,
          basePokemonName: baseEntry?.name ?? entry.name,
          baseDisplayName,
          formFlags,
          variantLabel: variantMeta?.variantLabel,
          detailNote: variantMeta?.detailNote ?? "",
          listSprite: buildSpriteUrl(id),
          shinyListSprite: buildSpriteUrl(id, true)
        };

        applyTrackedGenderPairIdentity(normalizedEntry);
        normalizedEntry.generation = determineEntryGeneration(normalizedEntry);
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
    setStatus("The Dex could not reach PokeAPI. Refresh the interface and try again.");
  }
}

async function fetchPokemonDetail(nameOrId) {
  const requestId = ++state.activeRequestId;
  const lookupName =
    typeof nameOrId === "string" ? normalizeSearch(nameOrId).replace(/\s+/g, "-") : null;
  const knownEntry = lookupName ? state.entriesByName.get(lookupName) ?? null : null;
  const fetchTarget = resolvePokemonDetailFetchTarget(nameOrId, knownEntry);
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
