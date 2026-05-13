(function () {
  "use strict";

  const scrollPositions = new Map();

  function getActivePanel() {
    return document.querySelector(".app-view.active");
  }

  function saveScrollForView(viewId) {
    if (!viewId || viewId === "landing") return;
    const panel = getActivePanel();
    if (panel) scrollPositions.set(viewId, panel.scrollTop);
  }

  function restoreScrollForView(viewId) {
    if (!viewId || viewId === "landing") return;
    const panel = document.querySelector(`[data-view-panel="${viewId}"], [data-module-view="${viewId}"]`);
    if (!panel) return;
    const container = panel.closest(".app-view") || panel;
    const saved = scrollPositions.get(viewId) ?? 0;
    requestAnimationFrame(() => { container.scrollTop = saved; });
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    const nextView = btn.dataset.view;
    const currentView = document.body.dataset.activeView;
    if (nextView === currentView) return;
    saveScrollForView(currentView);
    requestAnimationFrame(() => restoreScrollForView(nextView));
  }, true);
})();
