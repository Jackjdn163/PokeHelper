// Coverage Maps tab, Hisui overlays, and Legends Z-A wild zone badges
// Source chunk generated from the original app.js lines 13686-14217.

// ─── Maps Tab ────────────────────────────────────────────────────────────────

const MAPS_GAME_CATALOG = [
  {
    id: "sv",
    label: "Scarlet / Violet",
    maps: [
      { title: "Paldea",             url: "./assets/maps/sv-paldea.png" },
      { title: "Kitakami",           url: "./assets/maps/sv-kitakami.png" },
      { title: "Blueberry Academy",  url: "./assets/maps/sv-blueberry-academy.png" }
    ]
  },
  {
    id: "swsh",
    label: "Sword / Shield",
    maps: [
      { title: "Galar",              url: "./assets/maps/swsh-galar.png" },
      { title: "Crown Tundra",       url: "./assets/maps/swsh-crown-tundra.png" },
      { title: "Isle of Armor",      url: "./assets/maps/swsh-isle-of-armor.png" }
    ]
  },
  {
    id: "lgpe",
    label: "Let's Go",
    maps: [
      { title: "Kanto",              url: "./assets/maps/lgpe-kanto.png" }
    ]
  },
  {
    id: "lza",
    label: "Legends: Z-A",
    maps: [
      { title: "Lumiose City",         url: "./assets/maps/lza-lumiose-city-4096.png" },
      { title: "The Sewers (Bleu)",    url: "./assets/maps/lza-sewers-bleu.png" },
      { title: "The Sewers (Magenta)", url: "./assets/maps/lza-sewers-magenta.png" },
      { title: "Lysandre Labs B1F",    url: "./assets/maps/lza-lysandre-b1f.png" },
      { title: "Lysandre Labs B2F",    url: "./assets/maps/lza-lysandre-b2f.png" },
      { title: "Lysandre Labs B3F",    url: "./assets/maps/lza-lysandre-b3f.png" }
    ]
  },
  {
    id: "bdsp",
    label: "Brilliant Diamond / Shining Pearl",
    maps: [
      { title: "Sinnoh",             url: "./assets/maps/bdsp-sinnoh.png" }
    ]
  },
  {
    id: "pla",
    label: "Legends: Arceus",
    maps: [
      { title: "Hisui",               url: "./assets/maps/pla-hisui.png" },
      { title: "Obsidian Fieldlands", url: "./assets/maps/pla-obsidian.png" },
      { title: "Crimson Mirelands",   url: "./assets/maps/pla-crimson.png" },
      { title: "Cobalt Coastlands",   url: "./assets/maps/pla-cobalt.png" },
      { title: "Coronet Highlands",   url: "./assets/maps/pla-coronet.png" },
      { title: "Alabaster Icelands",  url: "./assets/maps/pla-alabaster.png" },
      { title: "Jubilife Village",    url: "./assets/maps/pla-jubilife.png" }
    ]
  }
];

function showMapsSelectScreen() {
  const selectScreen = document.getElementById("maps-select-screen");
  const mapScreen    = document.getElementById("maps-map-screen");
  const selector     = document.getElementById("maps-map-selector");
  if (!selectScreen || !mapScreen) return;
  selectScreen.classList.remove("hidden");
  mapScreen.classList.add("hidden");
  if (selector) {
    selector.classList.add("hidden");
    selector.replaceChildren();
  }
}

// ── Hisui region sprite + hit-polygon data ────────────────────────────────────
// Visible sprites are full-size overlays; hit sprites preserve the original mask behavior.
const HISUI_OVERLAY_ASSET_VERSION = "110";
const HISUI_REGIONS = [
  {
    id: "obsidian",
    label: "Obsidian Fieldlands",
    mapTitle: "Obsidian Fieldlands",
    sprite: "./assets/maps/Obsidian_Fieldlands.png",
    hitSprite: "./assets/maps/hisui-hitmasks/Obsidian_Fieldlands.png",
    hitMode: "floodfill"
  },
  {
    id: "crimson",
    label: "Crimson Mirelands",
    mapTitle: "Crimson Mirelands",
    sprite: "./assets/maps/Crimson_Mirelands.png",
    hitSprite: "./assets/maps/hisui-hitmasks/Crimson_Mirelands.png",
    hitMode: "floodfill"
  },
  {
    id: "cobalt",
    label: "Cobalt Coastlands",
    mapTitle: "Cobalt Coastlands",
    sprite: "./assets/maps/Cobalt_Coastlands.png",
    hitMode: "floodfill",
    closedEdges: ["right"]
  },
  {
    id: "coronet",
    label: "Coronet Highlands",
    mapTitle: "Coronet Highlands",
    sprite: "./assets/maps/Coronet_Highlands.png",
    hitSprite: "./assets/maps/hisui-hitmasks/Coronet_Highlands.png",
    hitMode: "floodfill"
  },
  {
    id: "alabaster",
    label: "Alabaster Icelands",
    mapTitle: "Alabaster Icelands",
    sprite: "./assets/maps/Alabaster_Icelands.png",
    hitMode: "floodfill"
  },
  {
    id: "jubilife",
    label: "Jubilife Village",
    mapTitle: "Jubilife Village",
    sprite: "./assets/maps/Jubilife_Village.png",
    hitSprite: "./assets/maps/hisui-hitmasks/Jubilife_Village.png",
    hitMode: "floodfill"
  }
];

function getVersionedHisuiOverlayAsset(path) {
  return `${path}?v=${HISUI_OVERLAY_ASSET_VERSION}`;
}

// ── LZA wild zones ────────────────────────────────────────────────────────────
// Base map: lza-lumiose-city-4096.png (4096x4096, square, city fills the frame).
// Positions mapped from the reference webp (1024×576):
//   - The city circle in the webp is centred at ~512,288 and has radius ~230px
//     out of the 576px image height — so the circle spans ~80% of image height
//     and is centred at 50%,50%.
//   - The square base map has the city filling the full frame.
//   - Conversion: webp_x_pct → (webp_x/1024 - 0.1) / 0.8 * 100 for x
//                 webp_y_pct → (webp_y/576  - 0.1) / 0.8 * 100 for y
// Each zone has: cx/cy = centre % on square map, w/h = size % on square map.
// cx/cy are % positions on the square map image for badge center placement
const LZA_WILD_ZONES = [
  { id: "zone1",   label: "Zone 1",         badge: 1,  cx: 59.5, cy: 92.1 },
  { id: "zone2",   label: "Zone 2",         badge: 2,  cx: 62.3, cy: 66.6 },
  { id: "zone3",   label: "Zone 3",         badge: 3,  cx: 50.1, cy: 27.5 },
  { id: "zone4",   label: "Zone 4",         badge: 4,  cx: 57.3, cy: 14.8 },
  { id: "zone5",   label: "Zone 5",         badge: 5,  cx: 41.8, cy: 60.3 },
  { id: "zone6",   label: "Zone 6",         badge: 6,  cx: 92.6, cy: 53.4 },
  { id: "zone7",   label: "Zone 7",         badge: 7,  cx: 29.2, cy: 43.1 },
  { id: "zone8",   label: "Zone 8",         badge: 8,  cx: 71.7, cy: 42.3 },
  { id: "zone9",   label: "Zone 9",         badge: 9,  cx: 12.5, cy: 56.2 },
  { id: "zone10",  label: "Zone 10",        badge: 10, cx: 16.1, cy: 65.9 },
  { id: "zone11",  label: "Zone 11",        badge: 11, cx: 83.0, cy: 60.6 },
  { id: "zone12",  label: "Zone 12",        badge: 12, cx: 42.7, cy: 82.5 },
  { id: "zone13",  label: "Zone 13",        badge: 13, cx: 40.4, cy: 7.0  },
  { id: "zone14",  label: "Zone 14",        badge: 14, cx: 9.7,  cy: 43.1 },
  { id: "zone15",  label: "Zone 15",        badge: 15, cx: 81.5, cy: 19.2 },
  { id: "zone16",  label: "Zone 16",        badge: 16, cx: 36.8, cy: 68.2 },
  { id: "zone17",  label: "Zone 17",        badge: 17, cx: 76.8, cy: 77.4 },
  { id: "zone18",  label: "Zone 18",        badge: 18, cx: 20.5, cy: 18.3 },
  { id: "zone19",  label: "Zone 19",        badge: 19, cx: 81.4, cy: 30.9 },
  { id: "center",  label: "Central Plaza",  badge: 20, cx: 50.2, cy: 49.9 },
];

function buildHisuiOverlay(onRegionSelect = null) {
  const sizer = document.createElement("div");
  sizer.className = "maps-hisui-sizer";

  const inner = document.createElement("div");
  inner.className = "maps-interactive-wrap maps-hisui-wrap";

  // Base map always visible — dimmed via CSS class when a region is active
  const baseImg = document.createElement("img");
  baseImg.className = "maps-overlay-img maps-hisui-base";
  baseImg.src       = "./assets/maps/Hisui_Map.png";
  baseImg.alt       = "Hisui";
  baseImg.decoding  = "async";
  inner.appendChild(baseImg);

  // Region sprite images — hidden by default, shown on hover
  // Each is loaded into an offscreen canvas for pixel-perfect hit testing
  const spriteEls = {};
  const spriteCanvases = {};

  function buildRegionHitMask(sprite, region, hitMask) {
    const W = sprite.naturalWidth;
    const H = sprite.naturalHeight;
    if (!W || !H) return;

    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width  = W;
    tmpCanvas.height = H;
    const ctx = tmpCanvas.getContext("2d");
    ctx.drawImage(sprite, 0, 0);
    const imgData = ctx.getImageData(0, 0, W, H).data;

    hitMask.width  = W;
    hitMask.height = H;
    hitMask.data   = null;
    hitMask.alpha  = null;

    if (region.hitMode === "floodfill") {
      const outside = new Uint8Array(W * H);
      const queue = [];

      function enqueue(x, y) {
        if (x < 0 || y < 0 || x >= W || y >= H) return;
        const i = y * W + x;
        if (outside[i]) return;
        if (imgData[i * 4 + 3] > 20) return;
        outside[i] = 1;
        queue.push(x, y);
      }

      const closedEdges = new Set(region.closedEdges ?? []);
      if (!closedEdges.has("top")) {
        for (let x = 0; x < W; x++) enqueue(x, 0);
      }
      if (!closedEdges.has("bottom")) {
        for (let x = 0; x < W; x++) enqueue(x, H - 1);
      }
      if (!closedEdges.has("left")) {
        for (let y = 0; y < H; y++) enqueue(0, y);
      }
      if (!closedEdges.has("right")) {
        for (let y = 0; y < H; y++) enqueue(W - 1, y);
      }

      let qi = 0;
      while (qi < queue.length) {
        const x = queue[qi++];
        const y = queue[qi++];
        enqueue(x - 1, y); enqueue(x + 1, y);
        enqueue(x, y - 1); enqueue(x, y + 1);
      }
      hitMask.data = outside;
    } else {
      const alpha = new Uint8Array(W * H);
      for (let i = 0; i < W * H; i++) alpha[i] = imgData[i * 4 + 3];
      hitMask.alpha = alpha;
    }
  }

  for (const region of HISUI_REGIONS) {
    const sprite = document.createElement("img");
    sprite.className = "maps-hisui-region-sprite";
    sprite.alt       = "";
    sprite.crossOrigin = "anonymous";
    sprite.dataset.regionId = region.id;

    // Build hit mask once the preserved mask sprite loads.
    // floodfill mode: BFS from corners over transparent pixels; anything unreachable = inside.
    // alpha mode: direct alpha check for any fallback stroke-only masks.
    const hitMask = { data: null, alpha: null, width: 0, height: 0, mode: region.hitMode };
    spriteCanvases[region.id] = hitMask;

    const hitSprite = document.createElement("img");
    hitSprite.alt = "";
    hitSprite.crossOrigin = "anonymous";
    hitSprite.addEventListener("load", () => buildRegionHitMask(hitSprite, region, hitMask), { once: true });
    hitSprite.src = getVersionedHisuiOverlayAsset(region.hitSprite ?? region.sprite);

    sprite.src = getVersionedHisuiOverlayAsset(region.sprite);
    inner.appendChild(sprite);
    spriteEls[region.id] = sprite;

    if (hitSprite.complete && hitSprite.naturalWidth > 0) {
      buildRegionHitMask(hitSprite, region, hitMask);
    }
  }

  const tooltip = document.createElement("div");
  tooltip.className = "maps-region-tooltip hidden";

  let activeRegionId = null;

  function hitTestRegion(regionId, px, py) {
    const mask = spriteCanvases[regionId];
    if (!mask || mask.width === 0) return false;
    const ix = Math.floor(px * mask.width);
    const iy = Math.floor(py * mask.height);
    if (ix < 0 || iy < 0 || ix >= mask.width || iy >= mask.height) return false;
    if (mask.mode === "floodfill") {
      return mask.data !== null && mask.data[iy * mask.width + ix] === 0;
    } else {
      return mask.alpha !== null && mask.alpha[iy * mask.width + ix] > 20;
    }
  }

  function setActiveRegion(regionId) {
    if (activeRegionId === regionId) return;
    if (activeRegionId) {
      spriteEls[activeRegionId].classList.remove("is-visible");
    }
    activeRegionId = regionId;
    if (regionId) {
      spriteEls[regionId].classList.add("is-visible");
    } else {
      tooltip.classList.add("hidden");
    }
  }

  function getRegionFromEvent(e) {
    const rect = inner.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;

    for (const region of HISUI_REGIONS) {
      if (hitTestRegion(region.id, px, py)) {
        return region;
      }
    }

    return null;
  }

  // Single mousemove listener on inner — checks all region canvases
  inner.addEventListener("mousemove", (e) => {
    const hit = getRegionFromEvent(e);
    if (hit) {
      setActiveRegion(hit.id);
      tooltip.textContent = hit.label;
      tooltip.classList.remove("hidden");
      positionTooltipFromSvg(e, tooltip, inner);
    } else {
      setActiveRegion(null);
    }
  });

  inner.addEventListener("click", (e) => {
    if (typeof onRegionSelect !== "function") return;
    const hit = getRegionFromEvent(e);
    if (hit) onRegionSelect(hit);
  });

  inner.addEventListener("mouseleave", () => {
    setActiveRegion(null);
  });

  inner.appendChild(tooltip);
  sizer.appendChild(inner);
  return sizer;
}

function buildLzaOverlay() {
  const wrap = document.createElement("div");
  wrap.className = "maps-interactive-wrap maps-lza-wrap";

  const img = document.createElement("img");
  img.className  = "maps-overlay-img";
  img.src        = "./assets/maps/lza-lumiose-city-4096.png";
  img.alt        = "Lumiose City";
  img.decoding   = "async";
  wrap.appendChild(img);

  const tooltip = document.createElement("div");
  tooltip.className = "maps-region-tooltip hidden";

  for (const zone of LZA_WILD_ZONES) {
    const pin = document.createElement("div");
    pin.className = "lza-badge-pin";
    pin.style.left = `${zone.cx}%`;
    pin.style.top  = `${zone.cy}%`;

    const badge = document.createElement("img");
    badge.className = "lza-badge-img";
    badge.src = `./assets/game-badges/lza-zone-badges/zone-${String(zone.badge).padStart(2, "0")}.png`;
    badge.alt = zone.label;
    badge.decoding = "async";

    pin.appendChild(badge);

    pin.addEventListener("mouseenter", (e) => {
      pin.classList.add("is-hovered");
      tooltip.textContent = zone.label;
      tooltip.classList.remove("hidden");
      positionTooltipFromSvg(e, tooltip, wrap);
    });
    pin.addEventListener("mousemove", (e) => positionTooltipFromSvg(e, tooltip, wrap));
    pin.addEventListener("mouseleave", () => {
      pin.classList.remove("is-hovered");
      tooltip.classList.add("hidden");
    });

    wrap.appendChild(pin);
  }

  wrap.appendChild(tooltip);
  return wrap;
}

function positionTooltipFromSvg(mouseEvent, tooltip, container) {
  const rect = container.getBoundingClientRect();
  const x = mouseEvent.clientX - rect.left + 14;
  const y = mouseEvent.clientY - rect.top  - 36;
  tooltip.style.left = `${x}px`;
  tooltip.style.top  = `${y}px`;
}

function getMapScreenTitle(game, map, mapIndex) {
  if (game.id === "lza" && mapIndex === 0) {
    return "Lumiose City — Wild Zones";
  }
  return map.title;
}

function buildMapsStaticImage(map, className = "maps-main-img") {
  const img = document.createElement("img");
  img.className = className;
  img.src       = map.url;
  img.alt       = map.title;
  img.decoding  = "async";
  return img;
}

function renderMapsMapSelector(game, selectedMapIndex, selectorEl) {
  if (!selectorEl) return;
  selectorEl.replaceChildren();

  if (!Array.isArray(game.maps) || game.maps.length <= 1) {
    selectorEl.classList.add("hidden");
    return;
  }

  selectorEl.classList.remove("hidden");

  game.maps.forEach((map, mapIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "maps-map-selector-btn";
    button.textContent = map.title;
    button.setAttribute("aria-pressed", mapIndex === selectedMapIndex ? "true" : "false");

    if (mapIndex === selectedMapIndex) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => showMapsMapScreen(game, mapIndex));
    selectorEl.appendChild(button);
  });
}

function getHisuiRegionMapIndex(game, region) {
  return game.maps.findIndex((map) => map.title === region.mapTitle);
}

function showMapsMapScreen(game, selectedMapIndex = 0) {
  const selectScreen = document.getElementById("maps-select-screen");
  const mapScreen    = document.getElementById("maps-map-screen");
  const gameLabelEl  = document.getElementById("maps-map-game-label");
  const titleEl      = document.getElementById("maps-map-title");
  const viewer       = document.getElementById("maps-map-viewer");
  const selector     = document.getElementById("maps-map-selector");
  if (!selectScreen || !mapScreen || !gameLabelEl || !titleEl || !viewer) return;

  const safeMapIndex = Math.min(Math.max(Number(selectedMapIndex) || 0, 0), game.maps.length - 1);
  const currentMap = game.maps[safeMapIndex] ?? game.maps[0];
  gameLabelEl.textContent = game.label;
  titleEl.textContent     = getMapScreenTitle(game, currentMap, safeMapIndex);
  renderMapsMapSelector(game, safeMapIndex, selector);

  viewer.replaceChildren();
  viewer.className = "maps-map-viewer";

  if (game.id === "pla" && safeMapIndex === 0) {
    viewer.classList.add("maps-map-viewer--interactive");
    viewer.appendChild(buildHisuiOverlay((region) => {
      const regionMapIndex = getHisuiRegionMapIndex(game, region);
      if (regionMapIndex > 0) {
        showMapsMapScreen(game, regionMapIndex);
      }
    }));
  } else if (game.id === "lza" && safeMapIndex === 0) {
    viewer.classList.add("maps-map-viewer--interactive");
    viewer.appendChild(buildLzaOverlay());
  } else if (game.id === "swsh" && safeMapIndex === 0) {
    // Galar — full scrollable image, no height cap
    viewer.classList.add("maps-map-viewer--scroll");
    viewer.appendChild(buildMapsStaticImage(currentMap, "maps-main-img maps-main-img--scroll"));
  } else {
    viewer.appendChild(buildMapsStaticImage(currentMap));
  }

  selectScreen.classList.add("hidden");
  mapScreen.classList.remove("hidden");
}

function renderMapsTab(options = {}) {
  if (!shouldRenderForViews(["maps"], options.force)) {
    return;
  }

  const gameListEl = document.getElementById("maps-game-list");
  const backBtn    = document.getElementById("maps-back-btn");
  if (!gameListEl) return;

  // Back button
  if (backBtn) {
    backBtn.onclick = () => showMapsSelectScreen();
  }

  // Build game selection cards (only on first render or force)
  if (gameListEl.childElementCount > 0 && !options.force) return;
  gameListEl.innerHTML = "";

  for (const game of MAPS_GAME_CATALOG) {
    const icons     = SUGGESTED_GAME_BADGE_SYMBOLS[game.id];
    const iconPaths = Array.isArray(icons) ? icons : (icons ? [icons] : []);

    const card = document.createElement("button");
    card.type      = "button";
    card.className = "maps-game-card";
    card.dataset.gameId = game.id;

    const iconWrap = document.createElement("div");
    iconWrap.className = "maps-game-card-icons";
    for (const path of iconPaths) {
      const img = document.createElement("img");
      img.src     = path;
      img.alt     = "";
      img.decoding = "async";
      iconWrap.appendChild(img);
    }

    const info = document.createElement("div");
    info.className = "maps-game-card-info";

    const labelEl = document.createElement("strong");
    labelEl.className   = "maps-game-card-label";
    labelEl.textContent = game.label;

    const countEl = document.createElement("span");
    countEl.className   = "maps-game-card-count";
    countEl.textContent = game.maps.length === 1 ? "1 map" : `${game.maps.length} maps`;

    info.appendChild(labelEl);
    info.appendChild(countEl);

    const arrow = document.createElement("span");
    arrow.className   = "maps-game-card-arrow";
    arrow.textContent = "→";
    arrow.setAttribute("aria-hidden", "true");

    card.appendChild(iconWrap);
    card.appendChild(info);
    card.appendChild(arrow);

    card.addEventListener("click", () => showMapsMapScreen(game));
    gameListEl.appendChild(card);
  }

  // Always start on the selection screen when the tab is rendered fresh
  showMapsSelectScreen();
}
