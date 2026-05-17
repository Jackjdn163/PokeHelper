// Supabase account, cloud save sync, and account card rendering
// Source chunk generated from the original app.js lines 4400-5330.

function getActiveProfile() {
  return (
    state.profileMeta.profiles.find((profile) => profile.id === state.profileMeta.activeProfileId) ??
    state.profileMeta.profiles[0]
  );
}

function getCloudUserLabel(user = state.cloud.user) {
  if (!user) {
    return "";
  }

  return String(
    user.user_metadata?.display_name ||
      user.user_metadata?.username ||
      user.user_metadata?.full_name ||
      user.email ||
      "Trainer Account"
  ).trim();
}

function getSessionButtonLabel() {
  if (state.cloud.user) {
    return getCloudUserLabel();
  }

  const profile = getActiveProfile();
  return profile.id === DEFAULT_PROFILE_ID ? "Guest Session" : profile.name;
}

function setCloudMessage(message, tone = "neutral") {
  state.cloud.message = message;
  state.cloud.messageTone = tone;
}

function isCloudSaveStorageMissingError(error) {
  const rawMessage = String(error?.message || error || "").toLowerCase();
  const rawCode = String(error?.code || "").toLowerCase();
  return (
    rawCode === "pgrst205" ||
    rawCode === "42p01" ||
    (rawMessage.includes("cloud_saves") &&
      (rawMessage.includes("schema cache") ||
        rawMessage.includes("could not find") ||
        rawMessage.includes("does not exist") ||
        rawMessage.includes("relation")))
  );
}

function markCloudSaveStorageMissing() {
  state.cloud.saveStoreReady = false;
  state.cloud.remoteSave = null;
  clearCloudAutoPushTimer();
  clearCloudAutoPullLoop();
}

function markCloudSaveStorageReady() {
  state.cloud.saveStoreReady = true;
}

function isCloudAutoSyncEnabled() {
  return Boolean(state.accountSync.autoSyncEnabled);
}

function formatCloudError(error, fallback = "Cloud account action failed.") {
  const rawMessage = String(error?.message || error || fallback).trim();
  const normalized = rawMessage.toLowerCase();

  if (isCloudSaveStorageMissingError(error)) {
    return CLOUD_SAVE_STORAGE_MISSING_MESSAGE;
  }

  if (normalized.includes("invalid login credentials")) {
    return "That email and password combination did not match a trainer account.";
  }

  if (normalized.includes("oauth") && normalized.includes("email")) {
    return "That trainer account uses a social login provider that is not available in this build.";
  }

  if (normalized.includes("provider is not enabled")) {
    return "That sign-in provider is not enabled in your Supabase project yet.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Check your inbox and confirm the account email before signing in.";
  }

  if (normalized.includes("user already registered")) {
    return "That email already has a trainer account. Try signing in instead.";
  }

  if (normalized.includes("failed to fetch")) {
    return "The cloud service could not be reached right now. Check your connection and try again.";
  }

  if (normalized.includes("invalid api key") || normalized.includes("project not found")) {
    return "The Supabase project settings for cloud accounts are not configured correctly yet.";
  }

  return rawMessage || fallback;
}

function getCloudTimestampValue(value) {
  const parsed = Date.parse(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasUnsyncedLocalChanges() {
  if (!state.accountSync.lastLocalChangeAt) {
    return false;
  }

  if (!state.accountSync.lastSyncedAt) {
    return true;
  }

  return new Date(state.accountSync.lastLocalChangeAt) > new Date(state.accountSync.lastSyncedAt);
}

function isCloudLinkedToCurrentUser() {
  return Boolean(
    state.cloud.user &&
      state.accountSync.linkedUserId === state.cloud.user.id &&
      !state.accountSync.pendingResolution
  );
}

function canRunCloudAutoSync() {
  return Boolean(
    isCloudAutoSyncEnabled() &&
      state.cloud.configured &&
      state.cloud.saveStoreReady !== false &&
      state.cloud.user &&
      isCloudLinkedToCurrentUser() &&
      !state.accountSync.pendingResolution
  );
}

function clearCloudAutoPushTimer() {
  if (!state.cloud.autoSyncTimer) {
    return;
  }

  window.clearTimeout(state.cloud.autoSyncTimer);
  state.cloud.autoSyncTimer = null;
}

function clearCloudAutoPullLoop() {
  if (!state.cloud.autoPullIntervalId) {
    return;
  }

  window.clearInterval(state.cloud.autoPullIntervalId);
  state.cloud.autoPullIntervalId = null;
}

function syncCloudAutomationState() {
  if (!canRunCloudAutoSync()) {
    clearCloudAutoPushTimer();
    clearCloudAutoPullLoop();
    return;
  }

  if (!state.cloud.autoPullIntervalId) {
    state.cloud.autoPullIntervalId = window.setInterval(() => {
      if (state.cloud.busy) {
        return;
      }

      void maybeAutoPullCloudSnapshot({ quiet: true, source: "auto" });
    }, CLOUD_AUTO_PULL_INTERVAL_MS);
  }
}

function markCloudSyncChoiceRequired(message) {
  state.accountSync.pendingResolution = true;
  state.accountSync.pendingUserId = state.cloud.user?.id ?? null;
  if (state.cloud.remoteSave?.updated_at) {
    state.accountSync.lastRemoteUpdatedAt = state.cloud.remoteSave.updated_at;
  }
  saveAccountSyncState();
  setCloudMessage(message, "warn");
}

function markCloudDirty() {
  state.accountSync.lastLocalChangeAt = new Date().toISOString();
  saveAccountSyncState();
  scheduleCloudAutoSync();
}

function scheduleCloudAutoSync() {
  if (
    !canRunCloudAutoSync() ||
    state.cloud.busy ||
    hasUnsyncedLocalChanges() === false
  ) {
    return;
  }

  clearCloudAutoPushTimer();

  state.cloud.autoSyncTimer = window.setTimeout(() => {
    state.cloud.autoSyncTimer = null;
    void pushLocalSnapshotToCloud({ quiet: true, source: "auto" });
  }, CLOUD_SYNC_DEBOUNCE_MS);
}

function setCloudAutoSyncEnabled(enabled) {
  const nextValue = Boolean(enabled);
  if (state.accountSync.autoSyncEnabled === nextValue) {
    return;
  }

  state.accountSync.autoSyncEnabled = nextValue;
  saveAccountSyncState();

  if (!nextValue) {
    clearCloudAutoPushTimer();
    clearCloudAutoPullLoop();
    setCloudMessage(
      "Auto Sync is off. Use Push to Cloud and Sync with Cloud whenever you want to move data manually.",
      "neutral"
    );
    renderTrainerVault();
    return;
  }

  setCloudMessage(
    state.cloud.user
      ? "Auto Sync is on. This device will push local changes and pull newer cloud saves when it is safe."
      : "Auto Sync is on. It will start syncing once this device is linked to a cloud account.",
    "success"
  );

  if (state.cloud.user && !isCloudLinkedToCurrentUser()) {
    state.cloud.forcePullOnNextHydration = true;
    renderTrainerVault();
    void hydrateCloudSession("AUTO_SYNC_ENABLED");
    return;
  }

  syncCloudAutomationState();
  renderTrainerVault();
  scheduleCloudAutoSync();
  void maybeAutoPullCloudSnapshot({ quiet: true, source: "auto" });
}

function scheduleSwitchGameAvailabilityLoad() {
  if (
    (state.gameAvailabilityReady && state.gameAvailabilityBreakdownReady) ||
    state.gameAvailabilityLoading ||
    state.gameAvailabilityScheduled
  ) {
    return;
  }

  state.gameAvailabilityScheduled = true;

  const run = () => {
    state.gameAvailabilityScheduled = false;
    void loadSwitchGameAvailability();
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 1500 });
    return;
  }

  window.setTimeout(run, 250);
}

async function ensureCloudClient() {
  if (!state.cloud.configured) {
    return null;
  }

  if (state.cloud.client) {
    return state.cloud.client;
  }

  const createClient = window.supabase?.createClient;
  if (typeof createClient !== "function") {
    setCloudMessage("The cloud account library could not load in this browser session.", "error");
    return null;
  }

  const client = createClient(state.cloud.config.url, state.cloud.config.publishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  state.cloud.client = client;
  state.cloud.ready = true;

  const { data } = client.auth.onAuthStateChange((event, session) => {
    state.cloud.session = session ?? null;
    state.cloud.user = session?.user ?? null;

    setTimeout(() => {
      if (!session?.user) {
        if (event === "SIGNED_OUT") {
          state.accountSync.pendingResolution = false;
          state.accountSync.pendingUserId = null;
          saveAccountSyncState();
          setCloudMessage("This device was signed out of its cloud account.", "neutral");
        }

        renderTrainerVault();
        return;
      }

      void hydrateCloudSession(event);
    }, 0);
  });

  state.cloud.authSubscription = data?.subscription ?? null;

  const {
    data: { session }
  } = await client.auth.getSession();

  state.cloud.session = session ?? null;
  state.cloud.user = session?.user ?? null;

  return client;
}

async function fetchCloudSaveForCurrentUser() {
  const client = await ensureCloudClient();
  if (!client || !state.cloud.user) {
    return null;
  }

  const { data, error } = await client
    .from(CLOUD_SAVE_TABLE)
    .select("user_id, email, snapshot, updated_at, created_at")
    .eq("user_id", state.cloud.user.id);

  if (error) {
    if (isCloudSaveStorageMissingError(error)) {
      markCloudSaveStorageMissing();
      return null;
    }
    throw error;
  }

  markCloudSaveStorageReady();
  return Array.isArray(data) ? data[0] ?? null : null;
}

async function hasRemoteCloudConflictForAutoPush() {
  try {
    if (!canRunCloudAutoSync() || !state.cloud.user) {
      return false;
    }

    const row = await fetchCloudSaveForCurrentUser();
    state.cloud.remoteSave = row;

    if (state.cloud.saveStoreReady === false) {
      setCloudMessage(CLOUD_SAVE_STORAGE_MISSING_MESSAGE, "warn");
      renderTrainerVault();
      return true;
    }

    if (!row?.updated_at) {
      return false;
    }

    if (getCloudTimestampValue(row.updated_at) <= getCloudTimestampValue(state.accountSync.lastRemoteUpdatedAt)) {
      return false;
    }

    markCloudSyncChoiceRequired(
      "Auto Sync paused because the cloud save changed on another device. Push to Cloud to keep this device, or Sync with Cloud to load the newer cloud save."
    );
    renderTrainerVault();
    return true;
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Auto Sync could not compare the cloud save."), "error");
    renderTrainerVault();
    return true;
  }
}

async function applyCloudSnapshotRowToDevice(row, { quiet = false, source = "manual" } = {}) {
  state.cloud.busy = true;
  renderTrainerVault();

  try {
    if (!row?.snapshot) {
      setCloudMessage("No cloud save exists for this trainer account yet.", "warn");
      return false;
    }

    applyCloudSnapshot(row.snapshot);

    const syncedAt = new Date().toISOString();
    state.cloud.remoteSave = row;
    state.accountSync.linkedUserId = state.cloud.user?.id ?? null;
    state.accountSync.pendingUserId = null;
    state.accountSync.pendingResolution = false;
    state.accountSync.lastSyncedAt = syncedAt;
    state.accountSync.lastRemoteUpdatedAt = row.updated_at ?? syncedAt;
    state.accountSync.lastDirection = "pull";
    saveAccountSyncState();

    setCloudMessage(
      source === "auto"
        ? "This device auto-pulled the latest trainer cloud save."
        : "This device was synced from the trainer cloud save.",
      "success"
    );
    if (!quiet) {
      setStatus("Cloud save pulled onto this device.");
    }
    return true;
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Sync with cloud failed."), "error");
    if (!quiet) {
      setStatus("Sync with cloud failed.");
    }
    return false;
  } finally {
    state.cloud.busy = false;
    renderTrainerVault();
  }
}

async function pushLocalSnapshotToCloud({ quiet = false, source = "manual" } = {}) {
  const client = await ensureCloudClient();
  if (!client || !state.cloud.user) {
    setCloudMessage("Sign in to a trainer account before pushing this device to the cloud.", "warn");
    renderTrainerVault();
    return false;
  }

  if (state.cloud.saveStoreReady === false) {
    setCloudMessage(CLOUD_SAVE_STORAGE_MISSING_MESSAGE, "warn");
    renderTrainerVault();
    return false;
  }

  if (source === "auto") {
    const hasConflict = await hasRemoteCloudConflictForAutoPush();
    if (hasConflict) {
      return false;
    }
  }

  state.cloud.busy = true;
  renderTrainerVault();

  const syncedAt = new Date().toISOString();
  const snapshot = buildCloudSnapshot();

  try {
    const { error } = await client.from(CLOUD_SAVE_TABLE).upsert(
      {
        user_id: state.cloud.user.id,
        email: state.cloud.user.email ?? null,
        snapshot,
        updated_at: syncedAt
      },
      { onConflict: "user_id" }
    );

    if (error) {
      throw error;
    }

    markCloudSaveStorageReady();
    state.cloud.remoteSave = {
      user_id: state.cloud.user.id,
      email: state.cloud.user.email ?? null,
      snapshot,
      updated_at: syncedAt
    };
    state.accountSync.linkedUserId = state.cloud.user.id;
    state.accountSync.pendingUserId = null;
    state.accountSync.pendingResolution = false;
    state.accountSync.lastSyncedAt = syncedAt;
    state.accountSync.lastRemoteUpdatedAt = syncedAt;
    state.accountSync.lastDirection = "push";
    saveAccountSyncState();

    setCloudMessage(
      source === "auto"
        ? "This device auto-synced its latest trainer data to the cloud."
        : "This device was pushed to the trainer cloud save.",
      "success"
    );

    if (!quiet) {
      setStatus("Local device data pushed to cloud.");
    }

    return true;
  } catch (error) {
    if (isCloudSaveStorageMissingError(error)) {
      markCloudSaveStorageMissing();
    }
    setCloudMessage(formatCloudError(error), "error");
    if (!quiet) {
      setStatus("Push to cloud failed.");
    }
    return false;
  } finally {
    state.cloud.busy = false;
    renderTrainerVault();
  }
}

async function pullCloudSnapshotToDevice({ quiet = false } = {}) {
  try {
    const row = await fetchCloudSaveForCurrentUser();
    if (state.cloud.saveStoreReady === false) {
      setCloudMessage(CLOUD_SAVE_STORAGE_MISSING_MESSAGE, "warn");
      if (!quiet) {
        setStatus("Cloud save storage is not installed yet.");
      }
      renderTrainerVault();
      return false;
    }
    return await applyCloudSnapshotRowToDevice(row, { quiet });
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Sync with cloud failed."), "error");
    if (!quiet) {
      setStatus("Sync with cloud failed.");
    }
    return false;
  }
}

async function maybeAutoPullCloudSnapshot({ quiet = true, source = "auto" } = {}) {
  try {
    if (!canRunCloudAutoSync() || state.cloud.busy) {
      return false;
    }

    const row = await fetchCloudSaveForCurrentUser();
    state.cloud.remoteSave = row;

    if (state.cloud.saveStoreReady === false) {
      setCloudMessage(CLOUD_SAVE_STORAGE_MISSING_MESSAGE, "warn");
      renderTrainerVault();
      return false;
    }

    if (!row?.snapshot) {
      return false;
    }

    const remoteUpdatedAt = getCloudTimestampValue(row.updated_at);
    const knownRemoteUpdatedAt = Math.max(
      getCloudTimestampValue(state.accountSync.lastRemoteUpdatedAt),
      getCloudTimestampValue(state.accountSync.lastSyncedAt)
    );

    if (remoteUpdatedAt <= knownRemoteUpdatedAt) {
      return false;
    }

    if (hasUnsyncedLocalChanges()) {
      markCloudSyncChoiceRequired(
        "Auto Sync paused because both this device and the cloud save changed. Push to Cloud to keep local data, or Sync with Cloud to load the newer cloud save."
      );
      renderTrainerVault();
      return false;
    }

    return applyCloudSnapshotRowToDevice(row, { quiet, source });
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Auto Sync pull check failed."), "error");
    renderTrainerVault();
    return false;
  }
}

async function hydrateCloudSession(event = "INITIAL_SESSION") {
  if (!state.cloud.user) {
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const row = await fetchCloudSaveForCurrentUser();
    state.cloud.remoteSave = row;
    const autoSyncEnabled = isCloudAutoSyncEnabled();
    const shouldForcePullOnLogin = autoSyncEnabled && (event === "SIGNED_IN" || state.cloud.forcePullOnNextHydration);
    state.cloud.forcePullOnNextHydration = false;

    if (state.cloud.saveStoreReady === false) {
      state.accountSync.pendingResolution = false;
      state.accountSync.pendingUserId = null;
      saveAccountSyncState();
      setCloudMessage(CLOUD_SAVE_STORAGE_MISSING_MESSAGE, "warn");
      return;
    }

    if (!row) {
      if (autoSyncEnabled) {
        await pushLocalSnapshotToCloud({ quiet: true, source: "bootstrap" });
      } else {
        setCloudMessage(
          "No cloud save exists for this trainer account yet. Auto Sync is off, so use Push to Cloud to create the first save.",
          "warn"
        );
      }
      return;
    }

    state.accountSync.lastRemoteUpdatedAt = row.updated_at ?? state.accountSync.lastRemoteUpdatedAt;
    const linkedToThisUser = state.accountSync.linkedUserId === state.cloud.user.id;

    if (shouldForcePullOnLogin) {
      const pulled = await applyCloudSnapshotRowToDevice(row, { quiet: true, source: "auto" });
      if (pulled) {
        setCloudMessage(`Welcome back, ${getCloudUserLabel()}. Your trainer cloud save was pulled automatically.`, "success");
      }
      return;
    }

    if (!linkedToThisUser) {
      state.accountSync.pendingResolution = true;
      state.accountSync.pendingUserId = state.cloud.user.id;
      saveAccountSyncState();
      setCloudMessage(
        `Cloud save found for ${getCloudUserLabel()}. Sync with Cloud to load that save here, or Push to Cloud to replace it with this device's data.`,
        "warn"
      );
      return;
    }

    if (!autoSyncEnabled) {
      state.accountSync.pendingResolution = false;
      state.accountSync.pendingUserId = null;
      saveAccountSyncState();
      setCloudMessage(
        `${getCloudUserLabel()} is signed in. Auto Sync is off, so use Push to Cloud or Sync with Cloud when you want to move data manually.`,
        "neutral"
      );
      return;
    }

    if (hasUnsyncedLocalChanges()) {
      await pushLocalSnapshotToCloud({ quiet: true, source: "auto" });
      return;
    }

    await pullCloudSnapshotToDevice({ quiet: true });
    if (event === "SIGNED_IN") {
      setCloudMessage(`Welcome back, ${getCloudUserLabel()}. Your cloud save is linked on this device.`, "success");
    }
  } catch (error) {
    setCloudMessage(formatCloudError(error, "Cloud account sync could not start."), "error");
  } finally {
    state.cloud.busy = false;
    renderTrainerVault();
  }
}

async function signInCloudAccount() {
  const client = await ensureCloudClient();
  if (!client) {
    setCloudMessage("Cloud accounts are not configured on this build yet.", "warn");
    renderTrainerVault();
    return;
  }

  const email = elements.accountEmailInput.value.trim();
  const password = elements.accountPasswordInput.value;

  if (!email || !password) {
    setCloudMessage("Enter both an email and a password to sign in.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  state.cloud.forcePullOnNextHydration = isCloudAutoSyncEnabled();
  renderTrainerVault();

  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    elements.accountPasswordInput.value = "";
    setCloudMessage(`Signed in as ${email}. Checking your cloud save…`, "success");
  } catch (error) {
    state.cloud.forcePullOnNextHydration = false;
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Sign in failed."), "error");
    renderTrainerVault();
  }
}

async function signUpCloudAccount() {
  const client = await ensureCloudClient();
  if (!client) {
    setCloudMessage("Cloud accounts are not configured on this build yet.", "warn");
    renderTrainerVault();
    return;
  }

  const email = elements.accountEmailInput.value.trim();
  const password = elements.accountPasswordInput.value;

  if (!email || !password) {
    setCloudMessage("Enter both an email and a password to create a cloud account.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: state.cloud.config.redirectTo,
        data: {
          display_name: getActiveProfile()?.name ?? "PokéPilot Trainer"
        }
      }
    });

    if (error) {
      throw error;
    }

    elements.accountPasswordInput.value = "";
    state.cloud.busy = false;

    if (data.session) {
      setCloudMessage(`Account created for ${email}. Linking this device now…`, "success");
      renderTrainerVault();
      return;
    }

    setCloudMessage(
      "Account created. Check your email for the confirmation link, then sign in on this device.",
      "success"
    );
    renderTrainerVault();
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Account creation failed."), "error");
    renderTrainerVault();
  }
}

async function signInCloudAccountWithGoogle() {
  const client = await ensureCloudClient();
  if (!client) {
    setCloudMessage("Cloud accounts are not configured on this build yet.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: state.cloud.config.redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent"
        }
      }
    });

    if (error) {
      throw error;
    }

    setCloudMessage("Redirecting to Google so this device can link with your trainer account…", "success");

    if (data?.url) {
      window.location.assign(data.url);
      return;
    }
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Google sign-in failed."), "error");
    renderTrainerVault();
  }
}

async function signOutCloudAccount() {
  const client = await ensureCloudClient();
  if (!client || !state.cloud.user) {
    setCloudMessage("No cloud account is signed in on this device.", "warn");
    renderTrainerVault();
    return;
  }

  state.cloud.busy = true;
  renderTrainerVault();

  try {
    const { error } = await client.auth.signOut({ scope: "local" });
    if (error) {
      throw error;
    }

    elements.accountPasswordInput.value = "";
    setStatus("Cloud account signed out on this device.");
  } catch (error) {
    state.cloud.busy = false;
    setCloudMessage(formatCloudError(error, "Sign out failed."), "error");
    renderTrainerVault();
  }
}

async function syncCloudNow() {
  if (!state.cloud.user) {
    setCloudMessage("Sign in to a cloud account before syncing with the cloud save.", "warn");
    renderTrainerVault();
    return;
  }

  await pullCloudSnapshotToDevice();
}

function requestCloudAutoSyncRefresh() {
  if (!isCloudAutoSyncEnabled()) {
    return;
  }

  scheduleCloudAutoSync();
  void maybeAutoPullCloudSnapshot({ quiet: true, source: "auto" });
}

function renderCloudAccountCard() {
  const configured = state.cloud.configured;
  const signedIn = Boolean(state.cloud.user);
  const pending = state.accountSync.pendingResolution;
  const linked = isCloudLinkedToCurrentUser();
  const unsynced = hasUnsyncedLocalChanges();
  const autoSyncEnabled = isCloudAutoSyncEnabled();
  const saveStoreReady = state.cloud.saveStoreReady !== false;

  let badge = "Offline Only";
  let summary =
    "Sign in to link this device and move your living dex, notes, trackers, and HOME plan between devices.";

  if (!configured) {
    summary =
      "Cloud account support is installed, but this build still needs Supabase project keys before devices can sync.";
  } else if (state.cloud.busy) {
    badge = "Syncing";
    summary = signedIn
      ? `Working with ${getCloudUserLabel()}'s cloud save.`
      : "Checking cloud account status.";
  } else if (!signedIn) {
    badge = autoSyncEnabled ? "Auto Sync Ready" : "Ready";
    summary =
      "Create a trainer account and sign in with email to link this browser with your cloud save across devices.";
  } else if (!saveStoreReady) {
    badge = "Setup Needed";
    summary =
      `${getCloudUserLabel()} is signed in, but Supabase cloud save storage is missing.`;
  } else if (pending) {
    badge = autoSyncEnabled ? "Auto Sync Paused" : "Needs Choice";
    summary =
      "A cloud save was found, and this device needs a clear direction: push this device upward or sync from the cloud downward.";
  } else if (linked) {
    badge = autoSyncEnabled ? (unsynced ? "Pending Sync" : "Auto Sync On") : "Manual Sync";
    summary = autoSyncEnabled
      ? unsynced
        ? `${getCloudUserLabel()} is linked. Local changes are queued to push, and newer cloud saves will auto-pull when it is safe.`
        : `${getCloudUserLabel()} is linked, and this device is auto-pushing and auto-pulling across sessions.`
      : `${getCloudUserLabel()} is linked. Auto Sync is off, so use Push to Cloud or Sync with Cloud when you want to move data.`;
  } else {
    badge = autoSyncEnabled ? "Auto Sync Ready" : "Signed In";
    summary = autoSyncEnabled
      ? `${getCloudUserLabel()} is signed in. Auto Sync will pull the trainer cloud save on login and keep future changes moving automatically.`
      : `${getCloudUserLabel()} is signed in. Push to Cloud uploads this device, and Sync with Cloud pulls down the trainer save.`;
  }

  elements.accountBadge.textContent = badge;
  elements.accountSummary.textContent = summary;
  elements.accountDetail.textContent =
    state.cloud.message ||
    (!configured
      ? "Add your Supabase URL and publishable key to supabase-config.js, then create the cloud_saves table from supabase/schema.sql."
      : signedIn
        ? !saveStoreReady
          ? CLOUD_SAVE_STORAGE_MISSING_MESSAGE
          : autoSyncEnabled
            ? `Signed in as ${state.cloud.user.email ?? getCloudUserLabel()}. Auto Sync is on, so login pulls the trainer cloud save automatically and later local changes can sync on their own.`
            : `Signed in as ${state.cloud.user.email ?? getCloudUserLabel()}. Auto Sync is off. Push to Cloud uploads local device data, and Sync with Cloud pulls the trainer save onto this device.`
        : `Email/password cloud accounts are ready once Supabase is configured. Auto Sync is ${autoSyncEnabled ? "on" : "off"}.`);
  elements.accountDetail.className = `results-summary account-detail${
    state.cloud.messageTone === "error"
      ? " is-error"
      : state.cloud.messageTone === "success"
        ? " is-success"
        : state.cloud.messageTone === "warn"
          ? " is-warn"
          : ""
  }`;

  elements.accountEmailInput.disabled = !configured || state.cloud.busy;
  elements.accountPasswordInput.disabled = !configured || state.cloud.busy;
  elements.accountSignInButton.disabled = !configured || state.cloud.busy || signedIn;
  elements.accountSignUpButton.disabled = !configured || state.cloud.busy || signedIn;
  elements.accountAutoSyncButton.textContent = autoSyncEnabled ? "Auto Sync On" : "Auto Sync Off";
  elements.accountAutoSyncButton.classList.toggle("active", autoSyncEnabled);
  elements.accountAutoSyncButton.setAttribute("aria-pressed", String(autoSyncEnabled));
  elements.accountAutoSyncButton.disabled = state.cloud.busy;
  elements.accountSignOutButton.disabled = !configured || state.cloud.busy || !signedIn;
  elements.cloudPushButton.disabled = !configured || state.cloud.busy || !signedIn || !saveStoreReady;
  elements.cloudSyncButton.disabled = !configured || state.cloud.busy || !signedIn || !saveStoreReady;
  syncCloudAutomationState();
}
