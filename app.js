const APP_CHUNK_VERSION = "102";
const APP_CHUNKS = [
  "./scripts/app/00-config-data-state.js",
  "./scripts/app/01-storage-profiles-cloud.js",
  "./scripts/app/02-state-loaders-cache.js",
  "./scripts/app/03-core-archive-helpers.js",
  "./scripts/app/04-cloud-accounts.js",
  "./scripts/app/05-dashboard-collections-home-boxes.js",
  "./scripts/app/06-sprites-dex-availability.js",
  "./scripts/app/07-shiny-exp-location-duplicates.js",
  "./scripts/app/08-collections-home-tools.js",
  "./scripts/app/09-tracker-exp-task-logic.js",
  "./scripts/app/10-maps.js",
  "./scripts/app/11-scan-dex-rendering.js",
  "./scripts/app/12-events-bootstrap.js"
];

function buildVersionedChunkUrl(path) {
  const url = new URL(path, import.meta.url);
  url.searchParams.set("v", APP_CHUNK_VERSION);
  return url;
}

function rewriteBundledModuleSpecifiers(source) {
  const gameToolsUrl = new URL("./game-tools-data.js", import.meta.url).href;
  return source.replace(
    'from "./game-tools-data.js";',
    "from " + JSON.stringify(gameToolsUrl) + ";"
  );
}

function showBootFailure(error) {
  console.error("PokePilot app failed to load", error);
  const message = document.createElement("div");
  message.style.cssText =
    "position:fixed;inset:16px;z-index:99999;padding:16px;border:1px solid #f87171;background:#1f1115;color:#fee2e2;font:16px system-ui;border-radius:8px;";
  message.textContent = "PokePilot could not load its app chunks. Refresh once, and if it keeps happening check the browser console.";
  document.body?.prepend(message);
}

async function loadAppChunks() {
  const sources = await Promise.all(
    APP_CHUNKS.map(async (chunkPath) => {
      const url = buildVersionedChunkUrl(chunkPath);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(url.pathname + " returned " + response.status);
      }
      return response.text();
    })
  );

  const source =
    rewriteBundledModuleSpecifiers(sources.join("\n\n")) +
    "\n//# sourceURL=pokepilot-app-v" + APP_CHUNK_VERSION + ".js";
  const blobUrl = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));

  try {
    await import(blobUrl);
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
}

loadAppChunks().catch(showBootFailure);
