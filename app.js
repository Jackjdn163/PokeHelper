const APP_CHUNK_VERSION = "117";
const VERCEL_TELEMETRY_HOSTS = ["pokepilot.site", "www.pokepilot.site"];
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

function isVercelTelemetryHost(hostname = window.location.hostname) {
  const normalized = String(hostname || "").trim().toLowerCase();
  return normalized.endsWith(".vercel.app") || VERCEL_TELEMETRY_HOSTS.includes(normalized);
}

function initVercelTelemetry() {
  if (!isVercelTelemetryHost()) {
    return;
  }

  injectVercelAnalytics();
  injectVercelSpeedInsights();
}

function injectTelemetryScript(src, dataset) {
  if (document.head.querySelector(`script[src*="${src}"]`)) {
    return;
  }

  const script = document.createElement("script");
  script.src = src;
  script.defer = true;

  Object.entries(dataset).forEach(([key, value]) => {
    script.dataset[key] = value;
  });

  document.head.appendChild(script);
}

function injectVercelAnalytics() {
  if (!window.va) {
    window.va = function va(...params) {
      window.vaq = window.vaq || [];
      window.vaq.push(params);
    };
  }

  window.vam = "production";
  injectTelemetryScript("/_vercel/insights/script.js", {
    sdkn: "@vercel/analytics",
    sdkv: "2.0.1"
  });
}

function injectVercelSpeedInsights() {
  if (!window.si) {
    window.si = function si(...params) {
      window.siq = window.siq || [];
      window.siq.push(params);
    };
  }

  injectTelemetryScript("/_vercel/speed-insights/script.js", {
    sdkn: "@vercel/speed-insights",
    sdkv: "2.0.0"
  });
}

function buildVersionedChunkUrl(path) {
  const url = new URL(path, document.baseURI);
  url.searchParams.set("v", APP_CHUNK_VERSION);
  return url;
}

function rewriteBundledModuleSpecifiers(source) {
  const gameToolsUrl = new URL("./game-tools-data.js", document.baseURI).href;
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

initVercelTelemetry();
loadAppChunks().catch(showBootFailure);
