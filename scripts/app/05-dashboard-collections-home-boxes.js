// View routing, dashboard, collections, vault picker, checklists, and HOME box helpers
// Source chunk generated from the original app.js lines 5332-6541.

function getBaseEntries() {
  return state.entries.filter((entry) => !entry.isForm);
}

function setProgressBar(element, ratio) {
  const normalized = Math.max(0, Math.min(ratio || 0, 1));
  element.style.width = `${normalized * 100}%`;
}

function markViewsDirty(...viewIds) {
  viewIds.flat().forEach((viewId) => {
    if (VALID_VIEW_IDS.has(viewId)) {
      state.deferredViewRenders.add(viewId);
    }
  });
}

function clearDirtyViews(...viewIds) {
  viewIds.flat().forEach((viewId) => {
    state.deferredViewRenders.delete(viewId);
  });
}

function isAnyViewDirty(...viewIds) {
  return viewIds.flat().some((viewId) => state.deferredViewRenders.has(viewId));
}

function shouldRenderForViews(viewIds, force = false) {
  const normalizedViewIds = [...new Set(viewIds.flat().filter((viewId) => VALID_VIEW_IDS.has(viewId)))];
  if (force || normalizedViewIds.includes(state.ui.activeView)) {
    clearDirtyViews(normalizedViewIds);
    return true;
  }

  markViewsDirty(normalizedViewIds);
  return false;
}

function flushDeferredViewRenders(viewId = state.ui.activeView) {
  switch (viewId) {
    case "landing":
    case "collection":
    case "vault":
      if (isAnyViewDirty("landing", "collection", "vault")) {
        renderCollections({ force: true });
      }
      if (viewId === "vault") {
        renderTrainerVault();
      }
      break;
    case "scan":
      if (isAnyViewDirty("scan")) {
        if (state.currentPokemon) {
          renderCurrentPokemon(state.currentPokemon, { force: true });
        } else {
          clearDirtyViews("scan");
          renderShinyHelper(state.currentPokemon, { force: true });
        }
      }
      break;
    case "shiny":
      if (isAnyViewDirty("shiny")) {
        renderShinyHub({ force: true });
      }
      break;
    case "home":
      if (isAnyViewDirty("home")) {
        renderHomeOrganizer({ force: true });
      }
      break;
    case "journey":
      if (isAnyViewDirty("journey")) {
        renderTracker({ force: true });
      }
      break;
    case "lab":
      if (isAnyViewDirty("lab")) {
        renderSuggestors({ force: true });
        renderModuleQueue({ force: true });
        renderExpGameOptions();
        void renderExpPlanner({ force: true });
      }
      break;
    case "maps":
      if (isAnyViewDirty("maps")) {
        renderMapsTab({ force: true });
      }
      break;
    default:
      break;
  }
}

function renderActiveView() {
  const activeView = state.ui.activeView;
  const systemViews = new Set(["collection", "home", "journey", "lab", "vault", "ai"]);
  document.body.dataset.activeView = activeView;

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
  if (viewId !== "vault" && state.ui.favoritePicker.open) {
    closeFavoritePicker();
  }
  state.ui.activeView = viewId;
  saveUiSessionState();
  renderActiveView();
  flushDeferredViewRenders(viewId);
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
  saveUiSessionState();
  renderDetailTabs();
}

function getScanVisualMode() {
  return VALID_SCAN_VISUAL_MODE_IDS.has(state.ui.scanVisualMode) ? state.ui.scanVisualMode : "home";
}

function isScanArtworkMode() {
  return getScanVisualMode() === "artwork";
}

function renderScanVisualToggle() {
  const activeMode = getScanVisualMode();

  elements.scanVisualButtons.forEach((button) => {
    const isActive = button.dataset.scanVisual === activeMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  if (elements.pokemonVisualFrame) {
    elements.pokemonVisualFrame.classList.toggle("is-home-mode", activeMode === "home");
  }
}

function renderCurrentPokemonVisual() {
  if (!state.currentPokemon) {
    return;
  }

  applyPokemonVisual(elements.pokemonArt, state.currentPokemon, { preferArtwork: isScanArtworkMode() });
  renderScanVisualToggle();
}

function setScanVisualMode(mode) {
  if (!VALID_SCAN_VISUAL_MODE_IDS.has(mode) || mode === state.ui.scanVisualMode) {
    return;
  }

  state.ui.scanVisualMode = mode;
  saveUiSessionState();
  renderScanVisualToggle();
  renderCurrentPokemonVisual();
}

function openPokemonEntry(nameOrId) {
  const shouldResetDetailTab = state.ui.activeView !== "scan";
  setActiveView("scan");

  if (shouldResetDetailTab) {
    setActiveDetailTab("overview");
    state.ui.scanVisualMode = "home";
    saveUiSessionState();
    renderScanVisualToggle();
  }

  void fetchPokemonDetail(nameOrId);
}

function createCollectionEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "results-summary collection-empty";
  empty.textContent = message;
  return empty;
}

function createDashboardEmptyState(message) {
  const empty = document.createElement("p");
  empty.className = "results-summary dashboard-empty";
  empty.textContent = message;
  return empty;
}

function getProfileTrainerCode(profile) {
  const seed = `${profile?.id ?? ""}:${profile?.name ?? ""}`;
  const checksum = Array.from(seed).reduce(
    (sum, character) => (sum * 31 + character.charCodeAt(0)) % 10000,
    0
  );
  return `#${String(checksum).padStart(4, "0")}`;
}

function getRecentCaughtEntries(limit = 4) {
  return Object.keys(state.caughtMap)
    .slice()
    .reverse()
    .map((name) => state.entriesByName.get(name))
    .filter(Boolean)
    .slice(0, limit);
}

function renderLandingRecentCatches() {
  const recentEntries = getRecentCaughtEntries();
  elements.landingRecentList.replaceChildren();

  if (!recentEntries.length) {
    elements.landingRecentList.appendChild(
      createDashboardEmptyState("Nothing has been caught yet. Catch your first target to start the recent feed.")
    );
    return;
  }

  recentEntries.forEach((entry, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "dashboard-recent-item";
    button.addEventListener("click", () => {
      openPokemonEntry(entry.name);
    });

    const sprite = document.createElement("img");
    applyEntrySprite(sprite, entry, { forceShiny: isShiny(entry.name) });

    const meta = document.createElement("div");
    meta.className = "dashboard-recent-meta";
    const title = document.createElement("strong");
    title.textContent = entry.displayName;
    const note = document.createElement("span");
    note.textContent = `${getEntryVariantLabel(entry)} · ${isShiny(entry.name) ? "Shiny Caught" : "Caught"}`;
    meta.append(title, note);

    const stamp = document.createElement("span");
    stamp.className = "dashboard-recent-stamp";
    stamp.textContent = index === 0 ? "Latest" : index === 1 ? "Recent" : "Archive";

    button.append(sprite, meta, stamp);
    elements.landingRecentList.appendChild(button);
  });
}

function createDashboardProgressBar(ratio) {
  const bar = document.createElement("div");
  bar.className = "progress-bar";
  const fill = document.createElement("span");
  setProgressBar(fill, ratio);
  bar.appendChild(fill);
  return bar;
}

function renderLandingCompletionBreakdown(games) {
  elements.landingCompletionBreakdown.replaceChildren();

  if (!games.length) {
    elements.landingCompletionBreakdown.appendChild(
      createDashboardEmptyState("Mark owned games in Journey to unlock regional completion slices.")
    );
    return;
  }

  games.forEach((game) => {
    const entries = getGameChecklistEntries(game.id);
    const caughtCount = entries.reduce((sum, entry) => sum + Number(isCaught(entry.name)), 0);
    const ratio = entries.length ? caughtCount / entries.length : 0;

    const item = document.createElement("article");
    item.className = "dashboard-breakdown-item";

    const copy = document.createElement("div");
    copy.className = "dashboard-breakdown-copy";
    const label = document.createElement("strong");
    label.textContent = game.shortName;
    const value = document.createElement("span");
    value.textContent = entries.length
      ? `${formatCount(caughtCount)} / ${formatCount(entries.length)}`
      : "Coverage syncing";
    copy.append(label, value);

    const percent = document.createElement("strong");
    percent.className = "dashboard-breakdown-percent";
    percent.textContent = entries.length ? formatPercent(ratio) : "--";

    item.append(copy, percent);
    elements.landingCompletionBreakdown.appendChild(item);
  });
}

function renderLandingTaskList(task, catchTarget, shinyTarget, currentBox) {
  elements.landingTaskList.replaceChildren();

  const tasks = [
    {
      title: task.title,
      detail: task.detail,
      tag: task.focus.replace("Focus: ", "")
    }
  ];

  if (catchTarget) {
    tasks.push({
      title: `Catch ${catchTarget.displayName}`,
      detail: `${catchTarget.displayName} is ready in the suggestion queue and can be caught from the dashboard.`,
      tag: "Collection"
    });
  }

  if (shinyTarget) {
    tasks.push({
      title: `Log ${shinyTarget.displayName} as a shiny goal`,
      detail: `Keep the shiny pressure on with ${shinyTarget.displayName} queued in the bonus hunt lane.`,
      tag: "Shiny"
    });
  }

  if (currentBox) {
    tasks.push({
      title: `Fill ${currentBox.name}`,
      detail: `${getFilledBoxCount(currentBox)}/${getHomeBoxTargetCount(currentBox)} slots are marked in your HOME living-form template.`,
      tag: "Boxes"
    });
  }

  tasks.slice(0, 3).forEach((item) => {
    const row = document.createElement("article");
    row.className = "dashboard-task-item";

    const copy = document.createElement("div");
    copy.className = "dashboard-task-copy";
    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    copy.append(title, detail);

    const tag = document.createElement("span");
    tag.className = "dashboard-task-tag";
    tag.textContent = item.tag;

    row.append(copy, tag);
    elements.landingTaskList.appendChild(row);
  });
}

function renderLandingJourneyCards() {
  elements.landingJourneyGrid.replaceChildren();
  const ownedGames = GAME_CATALOG.filter((game) => state.tracker.games[game.id]?.owned);

  if (!ownedGames.length) {
    elements.landingJourneyGrid.appendChild(
      createDashboardEmptyState("No games are marked as owned yet. Open Journey to start tracking your saves.")
    );
    return;
  }

  ownedGames.slice(0, 4).forEach((game) => {
    const trackerState = state.tracker.games[game.id];
    const checkpoint = getGameProgressCheckpoint(game, trackerState);
    const ratio = game.progressMax ? trackerState.progress / game.progressMax : 0;

    const card = document.createElement("article");
    card.className = "dashboard-journey-card";

    const title = document.createElement("strong");
    title.textContent = game.name;

    const milestone = document.createElement("p");
    milestone.textContent = checkpoint.currentMilestone;

    const progress = document.createElement("div");
    progress.className = "dashboard-journey-progress";
    const counts = document.createElement("span");
    counts.textContent = `${game.progressLabel}: ${trackerState.progress}/${game.progressMax}`;
    progress.append(counts, createDashboardProgressBar(ratio));

    card.append(title, milestone, progress);
    elements.landingJourneyGrid.appendChild(card);
  });
}

function renderLandingSuggestionBoard(task, shinyTarget, currentBox) {
  elements.landingSuggestionGrid.replaceChildren();

  const cards = [
    {
      title: "Focus Area",
      detail: task.title,
      note: task.focus
    },
    {
      title: "Shiny Goal",
      detail: shinyTarget ? shinyTarget.displayName : "No shiny target selected",
      note: shinyTarget ? "Ready in the dashboard bonus lane" : "Catch more targets or reroll the shiny queue"
    },
    {
      title: "Collection Goal",
      detail: currentBox ? currentBox.name : "HOME template standby",
      note: currentBox
        ? `${getFilledBoxCount(currentBox)}/${getHomeBoxTargetCount(currentBox)} slots marked boxed`
        : "Open Boxes to start your living-form layout"
    },
    {
      title: "Weekly Goal",
      detail: `${formatCount(state.randomTargets.length)} catch targets ready`,
      note: "Reroll the dashboard board whenever you want a fresh route"
    }
  ];

  cards.forEach((item) => {
    const card = document.createElement("article");
    card.className = "dashboard-suggestion-card";

    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    const note = document.createElement("small");
    note.textContent = item.note;

    card.append(title, detail, note);
    elements.landingSuggestionGrid.appendChild(card);
  });
}

function renderLandingSmartSuggestions(catchTarget, shinyTarget, task) {
  elements.landingSmartGrid.replaceChildren();

  const suggestions = [
    {
      title: catchTarget ? `Catch ${catchTarget.displayName}` : "Open the Dex",
      detail: catchTarget
        ? `${catchTarget.displayName} is ready in the current suggestion queue.`
        : "Scan the archive and build a fresh catch queue.",
      actionLabel: catchTarget ? "Open Scan" : "Open Dex",
      onClick: catchTarget ? () => openPokemonEntry(catchTarget.name) : () => setActiveView("archive")
    },
    {
      title: shinyTarget ? `Shiny ${shinyTarget.displayName}` : "Plan a shiny push",
      detail: shinyTarget
        ? `${shinyTarget.displayName} is the cleanest bonus shiny follow-up right now.`
        : "No bonus shiny call is available yet. Keep catching or reroll the lane.",
      actionLabel: shinyTarget ? "Open Shiny" : "Open Collection",
      onClick: shinyTarget ? () => openPokemonEntry(shinyTarget.name) : () => setActiveView("collection")
    },
    {
      title: task.title,
      detail: task.detail,
      actionLabel: "Open Journey",
      onClick: () => setActiveView("journey")
    },
    {
      title: "Organize Your Boxes",
      detail: "Move over to the HOME living-form template and keep your box plan in sync.",
      actionLabel: "Go to Boxes",
      onClick: () => setActiveView("home")
    }
  ];

  suggestions.forEach((item) => {
    const card = document.createElement("article");
    card.className = "dashboard-smart-card";

    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("p");
    detail.textContent = item.detail;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "ghost-button dashboard-link-button";
    button.textContent = item.actionLabel;
    button.addEventListener("click", item.onClick);

    card.append(title, detail, button);
    elements.landingSmartGrid.appendChild(card);
  });
}

function getSuggestedCatchGenderBadgeLabel(entry) {
  const variantLabel = getEntryVariantLabel(entry);
  return variantLabel === "Male" || variantLabel === "Female" ? variantLabel : "";
}

function getSuggestedCatchGenderBadgeMeta(entry) {
  const label = getSuggestedCatchGenderBadgeLabel(entry);
  if (!label) {
    return null;
  }

  return {
    label,
    symbol: label === "Male" ? "♂" : "♀",
    tone: label === "Male" ? "male" : "female"
  };
}

const POKEMONDB_HOME_SPRITE_BASE = "https://img.pokemondb.net/sprites/home/normal";

const HOME_GAME_ICON_URLS = {
  lgpp: "./assets/game-badges/home-lets-go-pikachu.png",
  lgpe: "./assets/game-badges/home-lets-go-eevee.png",
  sw:   "./assets/game-badges/home-sword.png",
  sh:   "./assets/game-badges/home-shield.png",
  bd:   "./assets/game-badges/home-brilliant-diamond.png",
  sp:   "./assets/game-badges/home-shining-pearl.png",
  pla:  "./assets/game-badges/home-legends-arceus.png",
  sc:   "./assets/game-badges/home-scarlet.png",
  vi:   "./assets/game-badges/home-violet.png",
  lza:  "./assets/game-badges/home-legends-za.png"
};

// Maps each game version ID (as stored in state.tracker.games[gameId].versions) to its icon URL.
const GAME_VERSION_ICON_URLS = {
  "lets-go-pikachu": HOME_GAME_ICON_URLS.lgpp,
  "lets-go-eevee":   HOME_GAME_ICON_URLS.lgpe,
  "sword":           HOME_GAME_ICON_URLS.sw,
  "shield":          HOME_GAME_ICON_URLS.sh,
  "brilliant-diamond": HOME_GAME_ICON_URLS.bd,
  "shining-pearl":   HOME_GAME_ICON_URLS.sp,
  "scarlet":         HOME_GAME_ICON_URLS.sc,
  "violet":          HOME_GAME_ICON_URLS.vi
};

// For single-version or unversioned games, the fallback icon.
const SUGGESTED_GAME_BADGE_SYMBOLS = {
  lgpe: [HOME_GAME_ICON_URLS.lgpp, HOME_GAME_ICON_URLS.lgpe],
  swsh: [HOME_GAME_ICON_URLS.sw,   HOME_GAME_ICON_URLS.sh],
  bdsp: [HOME_GAME_ICON_URLS.bd,   HOME_GAME_ICON_URLS.sp],
  pla:  HOME_GAME_ICON_URLS.pla,
  sv:   [HOME_GAME_ICON_URLS.sc,   HOME_GAME_ICON_URLS.vi],
  lza:  HOME_GAME_ICON_URLS.lza
};

// Returns the single icon URL to show for a game, respecting which versions are owned.
// - If only one version is checked: show that version's icon.
// - If both versions are checked: pick one at random using the entry seed.
// - If no versions are checked (game not owned / fallback): return null.
function resolveGameBadgeIconUrl(game, entrySeed = 0) {
  const trackerGame = state.tracker.games[game.id];
  const gameVersions = getGameVersions(game);

  if (!gameVersions.length) {
    // Single-version game — use the static symbol directly.
    return SUGGESTED_GAME_BADGE_SYMBOLS[game.id] ?? null;
  }

  const ownedVersionIds = gameVersions
    .filter((v) => trackerGame?.versions?.[v.id])
    .map((v) => v.id);

  if (!ownedVersionIds.length) {
    // Game is owned but versions not yet synced — fall back to first icon.
    const fallback = SUGGESTED_GAME_BADGE_SYMBOLS[game.id];
    return Array.isArray(fallback) ? fallback[entrySeed % fallback.length] : (fallback ?? null);
  }

  const picked = ownedVersionIds[entrySeed % ownedVersionIds.length];
  return GAME_VERSION_ICON_URLS[picked] ?? null;
}

function getSuggestedCatchBadgeGame(entry) {
  if (!entry || !state.gameAvailabilityReady) {
    return null;
  }

  const ownedGameIds = getOwnedGameIds().filter((gameId) => isEntryAvailableInGame(entry, gameId));
  const fallbackGameIds = GAME_CATALOG.map((game) => game.id).filter((gameId) =>
    isEntryAvailableInGame(entry, gameId)
  );
  const eligibleGameIds = ownedGameIds.length ? ownedGameIds : fallbackGameIds;

  if (!eligibleGameIds.length) {
    return null;
  }

  const seedSource = `${state.suggestedCatchBadgeSeed}:${state.profileMeta.activeProfileId}:${entry.name}`;
  let hash = 0;
  for (const character of seedSource) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  const game = getGameMeta(eligibleGameIds[hash % eligibleGameIds.length]) ?? null;
  return game ? { game, seed: hash } : null;
}

function createSuggestedGameBadge(game, options = {}) {
  if (!game) {
    return null;
  }

  const { inline = false, entrySeed = 0 } = options;
  const badge = document.createElement("span");
  badge.className = inline
    ? "suggested-entry-game-badge suggested-game-symbol-badge suggested-game-symbol-badge--inline"
    : "suggested-hunt-badge suggested-hunt-badge--game suggested-game-symbol-badge";
  badge.dataset.game = game.id;
  badge.title = `${game.name} catch suggestion`;
  badge.setAttribute("role", "img");
  badge.setAttribute("aria-label", `${game.name} catch suggestion`);

  const iconUrl = resolveGameBadgeIconUrl(game, entrySeed);
  if (iconUrl) {
    const symbol = document.createElement("img");
    symbol.className = "suggested-game-symbol";
    symbol.src = iconUrl;
    symbol.alt = "";
    symbol.decoding = "async";
    symbol.onerror = () => {
      symbol.onerror = null;
      symbol.classList.add("is-missing");
      symbol.removeAttribute("src");
    };
    badge.appendChild(symbol);
    return badge;
  }

  const monogram = document.createElement("span");
  monogram.className = "suggested-game-symbol-monogram";
  monogram.textContent = game.id === "lza" ? "ZA" : game.shortName.slice(0, 2).toUpperCase();
  badge.appendChild(monogram);
  return badge;
}

function appendSuggestedCatchGameBadge(element, entry) {
  const result = getSuggestedCatchBadgeGame(entry);
  if (!result) {
    return;
  }

  const badge = createSuggestedGameBadge(result.game, { inline: true, entrySeed: result.seed });
  if (badge) {
    element.appendChild(badge);
  }
}

function renderSuggestedCatchLabel(element, entry, options = {}) {
  const { emptyText = "", includeVariantDetail = false, includeGameBadge = false } = options;
  element.replaceChildren();

  if (!entry) {
    element.textContent = emptyText;
    return;
  }

  const genderBadgeMeta = getSuggestedCatchGenderBadgeMeta(entry);
  const primaryLabel = genderBadgeMeta && entry.baseDisplayName ? entry.baseDisplayName : entry.displayName;
  element.append(document.createTextNode(primaryLabel));

  if (genderBadgeMeta) {
    const badge = document.createElement("span");
    badge.className = `suggested-entry-gender-badge suggested-entry-gender-badge--${genderBadgeMeta.tone}`;
    badge.textContent = genderBadgeMeta.symbol;
    badge.title = genderBadgeMeta.label;
    badge.setAttribute("aria-label", genderBadgeMeta.label);
    element.appendChild(badge);
  } else if (includeVariantDetail) {
    element.append(document.createTextNode(` · ${getEntryVariantLabel(entry)}`));
  }

  if (includeGameBadge) {
    appendSuggestedCatchGameBadge(element, entry);
  }
}

function createSuggestedHuntTile(entry, options = {}) {
  const {
    selected = false,
    forceShiny = false,
    onSelect = null,
    genderBadgeLabel = "",
    gameBadgeGame = null,
    gameBadgeSeed = 0
  } = options;
  const button = document.createElement("button");
  button.type = "button";
  button.className = `suggested-hunt-tile${selected ? " is-selected" : ""}`;
  button.setAttribute("aria-pressed", String(selected));
  button.setAttribute(
    "aria-label",
    `${entry.displayName}${forceShiny ? " shiny" : ""} suggestion`
  );
  button.title = entry.displayName;

  const pod = document.createElement("span");
  pod.className = "suggested-hunt-pod";

  const sprite = document.createElement("img");
  sprite.className = "suggested-hunt-sprite";
  sprite.loading = "lazy";
  sprite.decoding = "async";
  applyEntrySprite(sprite, entry, { forceShiny });

  const dexBadge = document.createElement("span");
  dexBadge.className = "suggested-hunt-dex";
  dexBadge.textContent = `#${formatNumber(entry.baseNumber)}`;

  const genderBadgeMeta = genderBadgeLabel
    ? {
        label: genderBadgeLabel,
        symbol: genderBadgeLabel === "Male" ? "♂" : "♀",
        tone: genderBadgeLabel === "Male" ? "male" : "female"
      }
    : null;

  if (gameBadgeGame) {
    const gameBadge = createSuggestedGameBadge(gameBadgeGame, { entrySeed: gameBadgeSeed });
    if (gameBadge) {
      pod.appendChild(gameBadge);
    }
  }

  if (genderBadgeMeta) {
    const genderBadge = document.createElement("span");
    genderBadge.className = `suggested-hunt-gender-badge suggested-hunt-gender-badge--${genderBadgeMeta.tone}`;
    genderBadge.textContent = genderBadgeMeta.symbol;
    genderBadge.title = genderBadgeMeta.label;
    genderBadge.setAttribute("aria-label", genderBadgeMeta.label);
    pod.appendChild(genderBadge);
  }

  pod.append(sprite, dexBadge);
  button.appendChild(pod);

  button.addEventListener("click", () => {
    onSelect?.(entry);
  });

  return button;
}

function renderSuggestedHuntBoard(container, entries, options = {}) {
  const {
    kind = "living",
    selectedName = null,
    emptyText = "No hunt targets are ready.",
    forceShiny = false
  } = options;

  container.replaceChildren();

  if (!entries.length) {
    container.appendChild(createCollectionEmptyState(emptyText));
    return;
  }

  entries.forEach((entry) => {
    const suggestedResult = kind === "living" ? getSuggestedCatchBadgeGame(entry) : null;
    container.appendChild(
      createSuggestedHuntTile(entry, {
        selected: entry.name === selectedName,
        forceShiny,
        genderBadgeLabel: kind === "living" ? getSuggestedCatchGenderBadgeLabel(entry) : "",
        gameBadgeGame: suggestedResult?.game ?? null,
        gameBadgeSeed: suggestedResult?.seed ?? 0,
        onSelect: (nextEntry) => {
          const selectionMode =
            kind === "shiny" ? state.ui.landingActionMode === "shiny" : state.ui.landingActionMode === "living";
          setSelectedSuggestedTarget(kind, nextEntry.name);
          if (selectionMode) {
            renderCollections();
            return;
          }

          renderCollections();
          openPokemonEntry(nextEntry.name);
        }
      })
    );
  });
}

function createCollectionItem(entry, note, tags = [], options = {}) {
  const interactive = options.interactive !== false;
  const button = document.createElement(interactive ? "button" : "div");
  if (interactive) {
    button.type = "button";
  }
  button.className = "collection-item";

  const art = document.createElement("span");
  art.className = "collection-item-art";

  const sprite = document.createElement("img");
  sprite.className = "collection-item-sprite";
  sprite.loading = "lazy";
  sprite.decoding = "async";
  applyEntrySprite(sprite, entry, options);

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

  if (interactive) {
    button.addEventListener("click", () => {
      openPokemonEntry(entry.name);
    });
  }

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

function createManagerActionButton(label, onClick, variant = "ghost") {
  const button = document.createElement("button");
  button.type = "button";
  button.className =
    variant === "primary"
      ? "primary-action compact manager-action-button"
      : "ghost-button detail-link-button manager-action-button";
  button.textContent = label;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  });
  return button;
}

function createVaultManagerItem(contentNode, actions = []) {
  const shell = document.createElement("div");
  shell.className = "vault-manager-item";
  shell.appendChild(contentNode);

  if (actions.length) {
    const actionRow = document.createElement("div");
    actionRow.className = "vault-manager-actions";
    actions.forEach((action) => {
      actionRow.appendChild(createManagerActionButton(action.label, action.onClick, action.variant));
    });
    shell.appendChild(actionRow);
  }

  return shell;
}

function syncFavoriteDisplays() {
  renderCollections();
  renderTrainerVault();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function closeFavoritePicker() {
  state.ui.favoritePicker.open = false;
  state.ui.favoritePicker.mode = "favorites";
  state.ui.favoritePicker.typeName = null;
  state.ui.favoritePicker.query = "";
  state.ui.favoritePicker.loading = false;
  renderFavoritePicker();
}

function openFavoritePicker(mode, typeName = null) {
  state.ui.favoritePicker.open = true;
  state.ui.favoritePicker.mode = mode;
  state.ui.favoritePicker.typeName = typeName;
  state.ui.favoritePicker.query = "";
  state.ui.favoritePicker.loading = mode === "type";
  renderFavoritePicker();

  window.requestAnimationFrame(() => {
    elements.favoritePickerSearch?.focus();
  });

  if (mode === "type" && typeName) {
    void ensureTypeFavoritePool(typeName)
      .catch(() => [])
      .then(() => {
        if (
          !state.ui.favoritePicker.open ||
          state.ui.favoritePicker.mode !== "type" ||
          state.ui.favoritePicker.typeName !== typeName
        ) {
          return;
        }

        state.ui.favoritePicker.loading = false;
        renderFavoritePicker();
      });
    return;
  }

  state.ui.favoritePicker.loading = false;
  renderFavoritePicker();
}

function applyFavoritePickerSelection(entry) {
  if (state.ui.favoritePicker.mode === "type" && state.ui.favoritePicker.typeName) {
    const typeName = state.ui.favoritePicker.typeName;
    setFavoriteTypeState(typeName, entry.name);
    closeFavoritePicker();
    syncFavoriteDisplays();
    setStatus(`${entry.displayName} is now your ${titleCase(typeName)} type favorite.`);
    return;
  }

  setFavoriteState(entry.name, true);
  closeFavoritePicker();
  syncFavoriteDisplays();
  setStatus(`${entry.displayName} added to favorites.`);
}

function renderFavoritePicker() {
  const picker = state.ui.favoritePicker;
  const isOpen = picker.open;

  elements.favoritePickerOverlay.classList.toggle("hidden", !isOpen);
  elements.favoritePickerOverlay.hidden = !isOpen;
  if (!isOpen) {
    return;
  }

  const activeType = picker.typeName ? titleCase(picker.typeName) : null;
  const currentSelectionName = getFavoritePickerCurrentSelectionName();
  const currentSelection = currentSelectionName ? state.entriesByName.get(currentSelectionName) ?? null : null;
  const pool =
    picker.mode === "type" && picker.typeName
      ? state.typeFavoritePoolCache.get(picker.typeName) ?? []
      : getFavoritePickerEntryPool();
  const filteredEntries = getFavoritePickerFilteredEntries(pool);
  const visibleEntries = filteredEntries.slice(0, FAVORITE_PICKER_RESULT_LIMIT);

  if (elements.favoritePickerSearch.value !== picker.query) {
    elements.favoritePickerSearch.value = picker.query;
  }

  elements.favoritePickerTitle.textContent =
    picker.mode === "type" && activeType ? `Choose ${activeType} Favorite` : "Add New Favorite";
  elements.favoritePickerNote.textContent =
    picker.mode === "type" && activeType
      ? `Search the archive for a ${activeType}-type Pokémon, then pick the one you want to showcase in the Vault.`
      : "Search the archive, then pick the Pokémon you want to save to your Vault showcase.";
  const showClearSelection = picker.mode === "type" && Boolean(currentSelection);
  elements.favoritePickerClearButton.hidden = !showClearSelection;
  elements.favoritePickerClearButton.classList.toggle("hidden", !showClearSelection);
  elements.favoritePickerClearButton.parentElement?.classList.toggle("hidden", !showClearSelection);
  if (elements.favoritePickerClearButton.parentElement) {
    elements.favoritePickerClearButton.parentElement.hidden = !showClearSelection;
  }
  elements.favoritePickerResultsSummary.textContent = picker.loading
    ? "Loading the eligible archive pool for this type..."
    : filteredEntries.length
      ? filteredEntries.length > FAVORITE_PICKER_RESULT_LIMIT
        ? `${formatCount(filteredEntries.length)} matches found. Showing the first ${formatCount(FAVORITE_PICKER_RESULT_LIMIT)} to keep the picker fast. Keep typing to narrow it down.`
        : `${formatCount(filteredEntries.length)} matches ready. Scroll or search to narrow the list.`
      : "No matches found for the current search.";

  elements.favoritePickerList.replaceChildren();

  if (picker.loading) {
    elements.favoritePickerList.appendChild(
      createCollectionEmptyState("Syncing the type-accurate picker list.")
    );
    return;
  }

  if (!filteredEntries.length) {
    elements.favoritePickerList.appendChild(
      createCollectionEmptyState("No Pokémon matched that search. Try a different name, form, or Dex number.")
    );
    return;
  }

  visibleEntries.forEach((entry) => {
    const note = `${getEntryVariantLabel(entry)} · ${isCaught(entry.name) ? "Caught" : "Missing"}`;
    const tags = [
      picker.mode === "type" && activeType ? activeType : "Favorite",
      ...(isShiny(entry.name) ? ["Shiny"] : [])
    ];
    const choiceButton = document.createElement("button");
    choiceButton.type = "button";
    choiceButton.className = "vault-picker-choice";
    choiceButton.appendChild(createCollectionItem(entry, note, tags, { interactive: false }));
    choiceButton.addEventListener("click", () => {
      applyFavoritePickerSelection(entry);
    });
    elements.favoritePickerList.appendChild(choiceButton);
  });
}

function getGameChecklistEntries(gameId) {
  if (!state.gameAvailabilityReady) {
    return [];
  }

  return getBaseEntries().filter((entry) => isAvailableInTrackedGameScope(entry.baseNumber, gameId));
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

function getHomeBoxCompatibilityMeta(entry) {
  if (!entry.isForm || entry.syntheticKind === "appearance") {
    return {
      homeBoxCompatible: true,
      homeBoxTag: "Boxable",
      homeBoxReason: "",
      parkedOnly: false
    };
  }

  const matchedRule = HOME_BOX_COMPATIBILITY_RULES.find((rule) => rule.matches(entry));
  if (!matchedRule) {
    return {
      homeBoxCompatible: true,
      homeBoxTag: "Boxable",
      homeBoxReason: "",
      parkedOnly: false
    };
  }

  return {
    homeBoxCompatible: false,
    homeBoxTag: matchedRule.tag,
    homeBoxReason: matchedRule.reason,
    parkedOnly: !matchedRule.archiveVisible
  };
}

function getHomeBoxEntries() {
  return state.entries.filter((entry) => entry.homeBoxCompatible !== false);
}

function getHomeExcludedEntries() {
  return [...state.entries, ...state.parkedEntries]
    .filter((entry) => entry.homeBoxCompatible === false)
    .sort((left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right));
}

function getHomeTemplateBoxes() {
  const homeEntries = getHomeBoxEntries();
  const boxCount = Math.max(1, Math.ceil(homeEntries.length / 30));

  return Array.from({ length: boxCount }, (_, boxIndex) => {
    const start = boxIndex * 30;
    const slots = Array.from({ length: 30 }, (_, slotIndex) => homeEntries[start + slotIndex] ?? null);
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
