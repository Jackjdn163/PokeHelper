# App Source Chunks

`/app.js` is a small loader. It fetches these files in order, stitches them back into one module, and runs the app with the same scope/hoisting behavior as the original single-file build.

- `00-config-data-state.js` - constants, game data, DOM references, initial state
- `01-storage-profiles-cloud.js` - local storage, profiles, cloud snapshot serialization
- `02-state-loaders-cache.js` - profile state loaders, saves, API cache, offline setup
- `03-core-archive-helpers.js` - caught/shiny helpers, ownership, suggestions, favorites, archive controls
- `04-cloud-accounts.js` - Supabase account and cloud save sync
- `05-dashboard-collections-home-boxes.js` - view routing, dashboard, collections, vault picker, checklists, HOME box helpers
- `06-sprites-dex-availability.js` - sprite URLs, dex cache/building, game availability
- `07-shiny-exp-location-duplicates.js` - shiny hub, EXP helpers, evolution/location intel, duplicate planner
- `08-collections-home-tools.js` - collection rendering, trainer vault, HOME organizer, tool workbench
- `09-tracker-exp-task-logic.js` - playthrough tracker, EXP planner rendering, next-task logic
- `10-maps.js` - Coverage Maps tab, Hisui overlays, Legends Z-A wild zones
- `11-scan-dex-rendering.js` - Pokemon detail rendering, dex list rendering, detail fetching
- `12-events-bootstrap.js` - event listeners and boot sequence

When adding a new chunk, update the `APP_CHUNKS` array in `/app.js` and the service worker cache list in `/sw.js`.
