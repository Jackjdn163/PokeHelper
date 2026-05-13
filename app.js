// PokePilot AI Panel
(function () {
  "use strict";

  const SUPABASE_URL = window.DEXTER_SUPABASE_CONFIG?.url || "";
  const EDGE_FN_URL = SUPABASE_URL + "/functions/v1/pokemon-ai";
  const ANON_KEY = window.DEXTER_SUPABASE_CONFIG?.publishableKey || "";

  // Conversation history (role/content pairs sent to OpenAI)
  const history = [];

  // ── App context collector ──────────────────────────────────────────────────
  // Reads whatever PokePilot data is available from localStorage.
  // The main app can also set window.POKEPILOT_AI_CONTEXT for richer data.
  function collectAppContext() {
    const ctx = {};

    // Allow the main app to inject structured context
    if (window.POKEPILOT_AI_CONTEXT) {
      Object.assign(ctx, window.POKEPILOT_AI_CONTEXT);
    }

    // Scrape available localStorage keys that look like PokePilot data
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        // Include any key that looks like app data (not auth tokens)
        if (
          key.includes("dexter") ||
          key.includes("pokepilot") ||
          key.includes("pokedex") ||
          key.includes("caught") ||
          key.includes("shiny") ||
          key.includes("hunt") ||
          key.includes("journey") ||
          key.includes("trainer") ||
          key.includes("game-availability") ||
          key.includes("profile")
        ) {
          try {
            const raw = localStorage.getItem(key);
            ctx[key] = JSON.parse(raw);
          } catch {
            ctx[key] = localStorage.getItem(key);
          }
        }
      }
    } catch {
      // localStorage may be unavailable in some contexts
    }

    // Add visible UI state hints
    try {
      const trainerName = document.getElementById("landing-profile-metric")?.textContent?.trim();
      if (trainerName && trainerName !== "Guest Trainer") ctx.trainerName = trainerName;

      const currentGame = document.getElementById("landing-current-game-name")?.textContent?.trim();
      if (currentGame) ctx.currentGame = currentGame;

      const caughtText = document.getElementById("stat-caught")?.textContent?.trim();
      if (caughtText) ctx.caughtCount = caughtText;

      const archiveCaught = document.getElementById("archive-caught-count")?.textContent?.trim();
      if (archiveCaught) ctx.archiveCaughtCount = archiveCaught;

      const shinyProgress = document.getElementById("shiny-progress-text")?.textContent?.trim();
      if (shinyProgress) ctx.shinyProgress = shinyProgress;

      const activeHuntTarget = document.getElementById("shiny-tracker-target")?.textContent?.trim();
      if (activeHuntTarget) ctx.activeHuntTarget = activeHuntTarget;
    } catch {
      // DOM may not be ready
    }

    return Object.keys(ctx).length ? ctx : null;
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────
  function appendMessage(role, text, opts = {}) {
    const window_ = document.getElementById("ai-chat-window");
    if (!window_) return null;

    const msg = document.createElement("div");
    msg.className = `ai-message ai-message--${role}${opts.loading ? " ai-message--loading" : ""}${opts.error ? " ai-message--error" : ""}`;

    const avatar = document.createElement("div");
    avatar.className = "ai-message-avatar";
    avatar.textContent = role === "user" ? "YOU" : "AI";

    const bubble = document.createElement("div");
    bubble.className = "ai-message-bubble";
    bubble.textContent = text;

    msg.appendChild(avatar);
    msg.appendChild(bubble);
    window_.appendChild(msg);
    window_.scrollTop = window_.scrollHeight;
    return { el: msg, bubble };
  }

  function setInputEnabled(enabled) {
    const input = document.getElementById("ai-input");
    const btn = document.getElementById("ai-send-btn");
    if (input) input.disabled = !enabled;
    if (btn) btn.disabled = !enabled;
  }

  function updateModelPill(text) {
    const pill = document.getElementById("ai-model-pill");
    if (pill) pill.textContent = text;
  }

  // ── Send message ───────────────────────────────────────────────────────────
  async function sendMessage(text) {
    text = text.trim();
    if (!text) return;

    const input = document.getElementById("ai-input");
    if (input) input.value = "";

    appendMessage("user", text);
    history.push({ role: "user", content: text });

    setInputEnabled(false);
    const loadingRef = appendMessage("ai", "Thinking...", { loading: true });

    try {
      const appContext = collectAppContext();

      const res = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANON_KEY}`,
          "Apikey": ANON_KEY,
        },
        body: JSON.stringify({ messages: history, appContext }),
      });

      const data = await res.json();

      if (loadingRef?.el) loadingRef.el.remove();

      if (data.error) {
        appendMessage("ai", data.error, { error: true });
        history.pop();
      } else {
        appendMessage("ai", data.reply);
        history.push({ role: "assistant", content: data.reply });
        updateModelPill("Online");
      }
    } catch (err) {
      if (loadingRef?.el) loadingRef.el.remove();
      appendMessage("ai", "Could not reach the AI. Check your connection and try again.", { error: true });
      history.pop();
      console.error("AI panel error:", err);
    } finally {
      setInputEnabled(true);
      const inputEl = document.getElementById("ai-input");
      if (inputEl) inputEl.focus();
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    const sendBtn = document.getElementById("ai-send-btn");
    const inputEl = document.getElementById("ai-input");

    if (!sendBtn || !inputEl) return;

    sendBtn.addEventListener("click", () => sendMessage(inputEl.value));

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputEl.value);
      }
    });

    // Auto-resize textarea
    inputEl.addEventListener("input", () => {
      inputEl.style.height = "auto";
      inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
    });

    updateModelPill(SUPABASE_URL ? "Ready" : "Offline");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
