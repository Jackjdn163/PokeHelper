const CACHE_NAME = "pokepilot-shell-v100";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=95",
  "./app.js?v=100",
  "./scripts/app/00-config-data-state.js?v=100",
  "./scripts/app/01-storage-profiles-cloud.js?v=100",
  "./scripts/app/02-state-loaders-cache.js?v=100",
  "./scripts/app/03-core-archive-helpers.js?v=100",
  "./scripts/app/04-cloud-accounts.js?v=100",
  "./scripts/app/05-dashboard-collections-home-boxes.js?v=100",
  "./scripts/app/06-sprites-dex-availability.js?v=100",
  "./scripts/app/07-shiny-exp-location-duplicates.js?v=100",
  "./scripts/app/08-collections-home-tools.js?v=100",
  "./scripts/app/09-tracker-exp-task-logic.js?v=100",
  "./scripts/app/10-maps.js?v=100",
  "./scripts/app/11-scan-dex-rendering.js?v=100",
  "./scripts/app/12-events-bootstrap.js?v=100",
  "./assets/game-badges/lgpe-badge.png",
  "./assets/game-badges/swsh-badge.png",
  "./assets/game-badges/bdsp-badge.png",
  "./assets/game-badges/pla-badge.png",
  "./assets/game-badges/sv-badge.png",
  "./assets/game-badges/lza-emblem.png",
  "./game-tools-data.js",
  "./supabase-config.js?v=96",
  "./manifest.webmanifest",
  "./icon.svg"
];

function shouldRuntimeCache(url) {
  return (
    url.origin === self.location.origin ||
    url.origin === "https://cdn.jsdelivr.net" ||
    url.origin === "https://img.pokemondb.net" ||
    url.origin === "https://pokeapi.co" ||
    url.origin === "https://raw.githubusercontent.com" ||
    url.origin === "https://www.serebii.net" ||
    url.origin === "https://fonts.googleapis.com" ||
    url.origin === "https://fonts.gstatic.com"
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (!shouldRuntimeCache(url)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkRequest = fetch(event.request)
        .then((response) => {
          if (response.ok || response.type === "opaque") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).catch(() => {});
          }

          return response;
        })
        .catch(() => cachedResponse);

      if (cachedResponse) {
        event.waitUntil(networkRequest.catch(() => {}));
        return cachedResponse;
      }

      return networkRequest;
    })
  );
});
