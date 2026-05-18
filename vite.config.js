import { defineConfig } from "vite";
import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));
const runtimeAssetTargets = [
  "app.js",
  "ai-panel.js",
  "assets",
  "game-tools-data.js",
  "icon.svg",
  "manifest.webmanifest",
  "scripts",
  "scroll-memory.js",
  "styles.css",
  "supabase-config.js",
  "sw.js"
];

function copyRuntimeAssets() {
  return {
    name: "copy-pokepilot-runtime-assets",
    apply: "build",
    async closeBundle() {
      await Promise.all(
        runtimeAssetTargets.map(async (target) => {
          const sourcePath = resolve(projectRoot, target);
          const outputPath = resolve(projectRoot, "dist", target);
          await mkdir(dirname(outputPath), { recursive: true });
          await cp(sourcePath, outputPath, { recursive: true, force: true });
        })
      );
    }
  };
}

export default defineConfig({
  plugins: [copyRuntimeAssets()],
  server: {
    port: 3000,
    host: true,
  },
});
