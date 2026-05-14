(function () {
  "use strict";

  const SUPABASE_URL = window.DEXTER_SUPABASE_CONFIG?.url || "";
  const EDGE_FN_URL = SUPABASE_URL + "/functions/v1/pokemon-ai";
  const ANON_KEY = window.DEXTER_SUPABASE_CONFIG?.publishableKey || "";

  const history = [];

  // Keys whose raw values are safe to include (small scalars / short strings)
  const SCALAR_KEYS = ["trainer", "profile", "journey", "game-availability"];
  // Keys that are large arrays/objects — summarise instead of dumping
  const SUMMARY_KEYS = ["caught", "shiny", "hunt", "pokedex", "pokepilot", "dexter"];

  function summariseValue(key, raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return { count: parsed.length };
      if (parsed && typeof parsed === "object") {
        // For caught maps: count truthy values
        const entries = Object.entries(parsed);
        if (entries.length > 20) {
          const caught = entries.filter(([, v]) => v).length;
          return { total: entries.length, caught };
        }
        return parsed;
      }
      return parsed;
    } catch {
      return raw?.length > 200 ? raw.slice(0, 200) + "…" : raw;
    }
  }

  function collectAppContext() {
    const ctx = {};

    if (window.POKEPILOT_AI_CONTEXT) {
      Object.assign(ctx, window.POKEPILOT_AI_CONTEXT);
    }

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;

        const isScalar = SCALAR_KEYS.some((k) => key.includes(k));
        const isSummary = SUMMARY_KEYS.some((k) => key.includes(k));

        if (isScalar) {
          // Only include if the value is small
          if (raw.length <= 2000) {
            try { ctx[key] = JSON.parse(raw); } catch { ctx[key] = raw; }
          }
        } else if (isSummary) {
          // Summarise large data rather than dumping it
          ctx[key + "_summary"] = summariseValue(key, raw);
        }
      }
    } catch { /* localStorage unavailable */ }

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
    } catch { /* DOM not ready */ }

    return Object.keys(ctx).length ? ctx : null;
  }

  function dismissWelcome() {
    const chatWindow = document.getElementById("ai-chat-window");
    const welcome = chatWindow?.querySelector(".ai-welcome");
    if (welcome) welcome.remove();
  }

  function appendMessage(role, text, opts = {}) {
    const chatWindow = document.getElementById("ai-chat-window");
    if (!chatWindow) return null;

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
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
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

  async function sendMessage(text) {
    text = text.trim();
    if (!text) return;

    dismissWelcome();

    const input = document.getElementById("ai-input");
    if (input) { input.value = ""; input.style.height = "auto"; }

    appendMessage("user", text);
    history.push({ role: "user", content: text });

    setInputEnabled(false);
    const loadingRef = appendMessage("ai", "Thinking...", { loading: true });

    try {
      const res = await fetch(EDGE_FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ANON_KEY}`,
          "Apikey": ANON_KEY,
        },
        body: JSON.stringify({ messages: history, appContext: collectAppContext() }),
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
      document.getElementById("ai-input")?.focus();
    }
  }

  function renderWelcome() {
    const chatWindow = document.getElementById("ai-chat-window");
    if (!chatWindow || chatWindow.children.length > 0) return;

    const welcome = document.createElement("div");
    welcome.className = "ai-welcome";

    const title = document.createElement("p");
    title.className = "ai-welcome-title";
    title.textContent = "PokePilot AI";

    const sub = document.createElement("p");
    sub.className = "ai-welcome-sub";
    sub.textContent = "Ask me anything about your dex, shiny odds, hunting methods, or team building. I can see your progress data to give personalised answers.";

    const chips = document.createElement("div");
    chips.className = "ai-welcome-chips";

    const suggestions = [
      "What should I hunt next?",
      "Best shiny method for Scarlet/Violet?",
      "How do I complete my living dex faster?"
    ];

    suggestions.forEach((text) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "ai-chip";
      chip.textContent = text;
      chip.addEventListener("click", () => sendMessage(text));
      chips.appendChild(chip);
    });

    welcome.appendChild(title);
    welcome.appendChild(sub);
    welcome.appendChild(chips);
    chatWindow.appendChild(welcome);
  }

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

    inputEl.addEventListener("input", () => {
      inputEl.style.height = "auto";
      inputEl.style.height = Math.min(inputEl.scrollHeight, 140) + "px";
    });

    updateModelPill(SUPABASE_URL ? "Ready" : "Offline");
    renderWelcome();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
