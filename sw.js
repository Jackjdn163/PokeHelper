const CACHE_NAME = "pokepilot-shell-v18";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./supabase-config.js",
  "./manifest.webmanifest",
  "./icon.svg"
];

function shouldRuntimeCache(url) {
  return (
    url.origin === self.location.origin ||
    url.origin === "https://cdn.jsdelivr.net" ||
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
