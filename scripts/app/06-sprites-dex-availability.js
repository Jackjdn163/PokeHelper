// Sprite resolution, dex cache/building, and game availability rendering
// Source chunk generated from the original app.js lines 6543-8553.

function titleCase(value) {
  return String(value)
    .split(/[-\s]/g)
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function buildSpriteUrl(id, shiny = false) {
  const shinySegment = shiny ? "/shiny" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shinySegment}/${id}.png`;
}

function buildApiHomeSpriteUrl(id, shiny = false) {
  const numericId = Number(id) || 0;
  if (numericId <= 0) {
    return "";
  }

  return `${POKEAPI_HOME_SPRITE_BASE_URL}/${shiny ? "shiny/" : ""}${numericId}.png`;
}

function buildProjectPokemonImageUrl(baseNumber) {
  const imageNumber = formatHybridImageNumber(baseNumber);
  if (!imageNumber || imageNumber === "0000") {
    return "";
  }

  return `${PROJECTPOKEMON_SV_HOME_BASE_URL}/${imageNumber}.png`;
}

function isProjectPokemonBaseSpriteCandidate(identity) {
  const baseNumber = Number(identity?.baseNumber ?? identity?.dexNumber ?? identity?.id) || 0;
  const normalizedName = normalizeHomeThumbnailSlug(identity?.name);
  const normalizedBase = normalizeHomeThumbnailSlug(identity?.basePokemonName || identity?.name);

  return baseNumber > 0 && baseNumber <= 905 && normalizedName === normalizedBase;
}

function buildProjectPokemonImageUrlsFromIdentity(identity) {
  if (!isProjectPokemonBaseSpriteCandidate(identity)) {
    return [];
  }

  return uniqUrls([buildProjectPokemonImageUrl(identity.baseNumber ?? identity.dexNumber ?? identity.id)]);
}

function formatHybridImageNumber(value) {
  const numeric = Number(value) || 0;
  return String(Math.max(numeric, 0)).padStart(4, "0");
}

function titleCaseHybridFormToken(token) {
  const normalized = String(token || "").toLowerCase();
  const tokenMap = {
    gmax: "Gmax",
    mega: "Mega",
    x: "X",
    y: "Y",
    z: "Z",
    alola: "Alola",
    galar: "Galar",
    hisui: "Hisui",
    paldea: "Paldea",
    hoenn: "Hoenn",
    kalos: "Kalos",
    sinnoh: "Sinnoh",
    unova: "Unova",
    original: "Original",
    partner: "Partner",
    world: "World",
    starter: "Starter",
    poke: "Poke",
    ball: "Ball",
    phd: "Phd",
    f: "F",
    female: "Female",
    male: "Male"
  };

  return tokenMap[normalized] ?? normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function buildHybridFormSuffix(formSlug) {
  const normalized = String(formSlug || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!normalized) {
    return "";
  }

  return `-${normalized
    .split("-")
    .filter(Boolean)
    .map((token) => titleCaseHybridFormToken(token))
    .join("-")}`;
}

function addHybridImageUrlCandidate(candidates, baseNumber, formSlug = "") {
  const imageNumber = formatHybridImageNumber(baseNumber);
  if (!imageNumber || imageNumber === "0000") {
    return;
  }

  const suffix = buildHybridFormSuffix(formSlug);
  const url = `${HYBRIDSHIVAM_HQ_IMAGE_BASE_URL}/${imageNumber}${suffix}.png`;
  if (!candidates.includes(url)) {
    candidates.push(url);
  }
}

function buildHybridImageUrlsFromIdentity(identity, { includeBaseFallback = true } = {}) {
  const baseNumber = identity?.baseNumber ?? identity?.dexNumber ?? identity?.id;
  const baseName = normalizeHomeThumbnailSlug(identity?.basePokemonName || identity?.name);
  const name = normalizeHomeThumbnailSlug(identity?.name);
  const urls = [];
  const seenSlugs = new Set();
  const addFormSlug = (slug) => {
    const normalizedSlug = normalizeHomeThumbnailSlug(slug);
    if (seenSlugs.has(normalizedSlug)) {
      return;
    }

    seenSlugs.add(normalizedSlug);
    addHybridImageUrlCandidate(urls, baseNumber, normalizedSlug);
  };

  if (name && baseName && name !== baseName && name.startsWith(`${baseName}-`)) {
    const formSlug = name.slice(baseName.length + 1);
    addFormSlug(formSlug);

    if (formSlug.endsWith("-pattern")) {
      addFormSlug(formSlug.replace(/-pattern$/, ""));
    }
    if (formSlug.endsWith("-sweet")) {
      addFormSlug(formSlug.replace(/-(berry|clover|flower|love|ribbon|star|strawberry)-sweet$/, "-$1"));
    }
    if (formSlug === "female") {
      addFormSlug("f");
    }
    if (formSlug.endsWith("-breed")) {
      addFormSlug(formSlug.replace(/-breed$/, ""));
    }
  }

  if (includeBaseFallback) {
    addHybridImageUrlCandidate(urls, baseNumber);
  }
  return urls;
}

function normalizeHomeThumbnailSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildPokemonDbHomeSpriteUrl(slug, shiny = false) {
  const normalizedSlug = normalizeHomeThumbnailSlug(slug);
  if (!normalizedSlug) {
    return "";
  }

  return `${POKEMONDB_HOME_SPRITE_BASE_URL}/${shiny ? "shiny" : "normal"}/${normalizedSlug}.png`;
}

function addPokemonDbSlugCandidate(candidates, value) {
  const normalizedValue = normalizeHomeThumbnailSlug(value);
  if (!normalizedValue || candidates.includes(normalizedValue)) {
    return;
  }

  candidates.push(normalizedValue);
}

const POKEMONDB_FORM_TOKEN_ALIASES = [
  [/-alola(?=-|$)/, "-alolan"],
  [/-galar(?=-|$)/, "-galarian"],
  [/-hisui(?=-|$)/, "-hisuian"],
  [/-paldea(?=-|$)/, "-paldean"],
  [/(squawkabilly-(green|blue|yellow|white))-plumage$/, "$1"]
];

function buildPokemonDbSlugCandidates(name, baseName = "", { includeBaseFallback = true } = {}) {
  const candidates = [];
  const exactAliases = {
    ogerpon: "ogerpon-teal",
    shellos: "shellos-west",
    gastrodon: "gastrodon-west",
    deerling: "deerling-spring",
    sawsbuck: "sawsbuck-spring",
    burmy: "burmy-plant",
    furfrou: "furfrou-natural",
    vivillon: "vivillon-meadow",
    "maushold-family-of-three": "maushold-family3",
    "maushold-family-of-four": "maushold-family4",
    "squawkabilly-green-plumage": "squawkabilly-green",
    "squawkabilly-blue-plumage": "squawkabilly-blue",
    "squawkabilly-yellow-plumage": "squawkabilly-yellow",
    "squawkabilly-white-plumage": "squawkabilly-white"
  };
  const addVariants = (value) => {
    const slug = normalizeHomeThumbnailSlug(value);
    if (!slug) {
      return;
    }

    addPokemonDbSlugCandidate(candidates, exactAliases[slug]);
    addPokemonDbSlugCandidate(candidates, slug);

    if (slug.endsWith("-female")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-female$/, "-f"));
    }

    if (includeBaseFallback && slug.endsWith("-male")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-male$/, ""));
    }

    if (slug.endsWith("-gmax")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-gmax$/, "-gigantamax"));
    }

    POKEMONDB_FORM_TOKEN_ALIASES.forEach(([pattern, replacement]) => {
      const aliasedSlug = slug.replace(pattern, replacement);
      if (aliasedSlug !== slug) {
        addVariants(aliasedSlug);
      }
    });

    if (slug.includes("-family-of-")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-family-of-three$/, "-family3"));
      addPokemonDbSlugCandidate(candidates, slug.replace(/-family-of-four$/, "-family4"));
      if (includeBaseFallback) {
        addPokemonDbSlugCandidate(candidates, slug.replace(/-family-of-(three|four)$/, ""));
      }
    }

    if (/-sweet$/.test(slug)) {
      addPokemonDbSlugCandidate(
        candidates,
        slug.replace(/-(berry|clover|flower|love|ribbon|star|strawberry)-sweet$/, "-$1")
      );
    }

    if (slug.endsWith("-pattern")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-pattern$/, ""));
    }

    if (slug.endsWith("-mask")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-(wellspring|hearthflame|cornerstone)-mask$/, "-$1"));
    }

    if (slug.endsWith("-breed")) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-(combat|aqua|blaze)-breed$/, ""));
    }

    if (includeBaseFallback && /(antique|artisan|masterpiece)$/.test(slug)) {
      addPokemonDbSlugCandidate(candidates, slug.replace(/-(antique|artisan|masterpiece)$/, ""));
    }

    const strippedDefaultSlug = slug.replace(
      /-(altered|aria|average|incarnate|meadow|midday|natural|ordinary|plant|rapid-strike|red-striped|single-strike|spring|standard|unremarkable|west)$/,
      ""
    );
    if (includeBaseFallback && strippedDefaultSlug !== slug) {
      addPokemonDbSlugCandidate(candidates, strippedDefaultSlug);
      addPokemonDbSlugCandidate(candidates, exactAliases[strippedDefaultSlug]);
    }
  };

  addVariants(name);

  if (includeBaseFallback && baseName && baseName !== name) {
    addVariants(baseName);
  }

  buildHomeThumbnailSlugCandidates(name, baseName, { includeBaseFallback }).forEach(addVariants);
  return candidates;
}

function getPokemonDbHomeUrlsFromIdentity(identity, shiny = false, options = {}) {
  const candidates = buildPokemonDbSlugCandidates(identity?.name, identity?.basePokemonName, options);
  return uniqUrls(candidates.map((slug) => buildPokemonDbHomeSpriteUrl(slug, shiny)));
}

function buildHomeThumbnailUrl(slug, shiny = false) {
  const normalizedSlug = normalizeHomeThumbnailSlug(slug);
  if (!normalizedSlug) {
    return "";
  }

  return `${POKESS_HOME_THUMBNAIL_BASE_URL}/${shiny ? "shiny" : "normal"}/${normalizedSlug}.png`;
}

function addHomeThumbnailSlugCandidate(candidates, value) {
  const normalizedValue = normalizeHomeThumbnailSlug(value);
  if (!normalizedValue || candidates.includes(normalizedValue)) {
    return;
  }

  candidates.push(normalizedValue);
}

function buildHomeThumbnailSlugCandidates(name, baseName = "", { includeBaseFallback = true } = {}) {
  const candidates = [];
  const addVariants = (value) => {
    const slug = normalizeHomeThumbnailSlug(value);
    if (!slug) {
      return;
    }

    addHomeThumbnailSlugCandidate(candidates, slug);

    if (slug.endsWith("-female")) {
      addHomeThumbnailSlugCandidate(candidates, slug.replace(/-female$/, "-f"));
    }

    if (includeBaseFallback && slug.endsWith("-male")) {
      addHomeThumbnailSlugCandidate(candidates, slug.replace(/-male$/, ""));
    }

    if (/-sweet$/.test(slug)) {
      addHomeThumbnailSlugCandidate(
        candidates,
        slug.replace(/-(berry|clover|flower|love|ribbon|star|strawberry)-sweet$/, "-$1")
      );
    }

    if (slug.endsWith("-pattern")) {
      addHomeThumbnailSlugCandidate(candidates, slug.replace(/-pattern$/, ""));
    }

    if (slug.includes("-family-of-")) {
      if (includeBaseFallback) {
        addHomeThumbnailSlugCandidate(candidates, slug.replace(/-family-of-(three|four)$/, ""));
      }
    }

    if (slug.endsWith("-mask")) {
      addHomeThumbnailSlugCandidate(candidates, slug.replace(/-(wellspring|hearthflame|cornerstone)-mask$/, "-$1"));
    }

    if (slug.endsWith("-breed")) {
      addHomeThumbnailSlugCandidate(candidates, slug.replace(/-(combat|aqua|blaze)-breed$/, ""));
    }

    if (includeBaseFallback && /(antique|artisan|masterpiece)$/.test(slug)) {
      addHomeThumbnailSlugCandidate(candidates, slug.replace(/-(antique|artisan|masterpiece)$/, ""));
    }

    if (
      includeBaseFallback &&
      /-(altered|aria|average|incarnate|meadow|midday|natural|ordinary|plant|rapid-strike|red-striped|single-strike|spring|standard|unremarkable|west)$/.test(
        slug
      )
    ) {
      addHomeThumbnailSlugCandidate(
        candidates,
        slug.replace(
          /-(altered|aria|average|incarnate|meadow|midday|natural|ordinary|plant|rapid-strike|red-striped|single-strike|spring|standard|unremarkable|west)$/,
          ""
        )
      );
    }
  };

  addVariants(name);

  if (includeBaseFallback && baseName && baseName !== name) {
    addVariants(baseName);
  }

  return candidates;
}

function getHomeThumbnailUrlsFromIdentity(identity, shiny = false, options = {}) {
  const candidates = buildHomeThumbnailSlugCandidates(identity?.name, identity?.basePokemonName, options);
  return uniqUrls(candidates.map((slug) => buildHomeThumbnailUrl(slug, shiny)));
}

function buildFormSpriteUrl(baseNumber, formSlug, shiny = false) {
  if (!formSlug) {
    return buildSpriteUrl(baseNumber, shiny);
  }

  const shinySegment = shiny ? "/shiny" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shinySegment}/${baseNumber}-${formSlug}.png`;
}

function buildGenderSpriteUrl(id, shiny = false, gender = "female") {
  const shinySegment = shiny ? "/shiny" : "";
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon${shinySegment}/${gender}/${id}.png`;
}

function uniqUrls(urls) {
  return [...new Set(urls.filter(Boolean))];
}

function shouldUseShinySprite(name, { forceShiny = false, preferTrackedShiny = true } = {}) {
  return forceShiny || (preferTrackedShiny && isShiny(name));
}

function hasDistinctIdentitySprite(identity) {
  const name = normalizeHomeThumbnailSlug(identity?.name);
  const baseName = normalizeHomeThumbnailSlug(identity?.basePokemonName || identity?.name);
  return Boolean(identity?.syntheticKind) || Boolean(identity?.isForm) || Boolean(name && baseName && name !== baseName);
}

function getIdentityApiSpriteUrl(identity, shiny = false) {
  if (identity?.syntheticKind) {
    return "";
  }

  const id = Number(identity?.id ?? identity?.dexNumber ?? 0);
  return id > 0 ? buildSpriteUrl(id, shiny) : "";
}

function getIdentityApiHomeSpriteUrl(identity, shiny = false) {
  if (identity?.syntheticKind) {
    return "";
  }

  const normalizedName = normalizeHomeThumbnailSlug(identity?.name);
  const id = Number(POKEAPI_HOME_SPRITE_ID_ALIASES[normalizedName] ?? identity?.id ?? identity?.dexNumber ?? 0);
  return id > 0 ? buildApiHomeSpriteUrl(id, shiny) : "";
}

function getEntrySpriteUrls(entry, options = {}) {
  const wantsShiny = shouldUseShinySprite(entry.name, options);
  const hasDistinctSprite = hasDistinctIdentitySprite(entry);
  const formRegular = hasDistinctSprite
    ? uniqUrls([
        ...getPokemonDbHomeUrlsFromIdentity(entry, false, { includeBaseFallback: false }),
        getIdentityApiHomeSpriteUrl(entry),
        ...getHomeThumbnailUrlsFromIdentity(entry, false, { includeBaseFallback: false }),
        entry.listSprite,
        getIdentityApiSpriteUrl(entry),
        ...buildHybridImageUrlsFromIdentity(entry, { includeBaseFallback: false })
      ])
    : [];
  const formShiny = hasDistinctSprite
    ? uniqUrls([
        ...getPokemonDbHomeUrlsFromIdentity(entry, true, { includeBaseFallback: false }),
        getIdentityApiHomeSpriteUrl(entry, true),
        ...getHomeThumbnailUrlsFromIdentity(entry, true, { includeBaseFallback: false }),
        entry.shinyListSprite,
        getIdentityApiSpriteUrl(entry, true)
      ])
    : [];
  const baseRegular = uniqUrls([
    ...getPokemonDbHomeUrlsFromIdentity(entry),
    getIdentityApiHomeSpriteUrl(entry),
    ...getHomeThumbnailUrlsFromIdentity(entry),
    ...buildProjectPokemonImageUrlsFromIdentity(entry),
    ...buildHybridImageUrlsFromIdentity(entry),
    entry.listSprite,
    getIdentityApiSpriteUrl(entry),
    buildSpriteUrl(entry.baseNumber)
  ]);

  if (wantsShiny) {
    return uniqUrls([
      ...formShiny,
      ...formRegular,
      ...getPokemonDbHomeUrlsFromIdentity(entry, true),
      ...getHomeThumbnailUrlsFromIdentity(entry, true),
      entry.shinyListSprite,
      getIdentityApiSpriteUrl(entry, true),
      buildSpriteUrl(entry.baseNumber, true),
      ...baseRegular
    ]);
  }

  return uniqUrls([...formRegular, ...baseRegular]);
}

function getPokemonVisualUrls(pokemon, options = {}) {
  const wantsShiny = shouldUseShinySprite(pokemon.name, options);
  const { preferArtwork = false } = options;
  const hasDistinctSprite = hasDistinctIdentitySprite(pokemon);
  const visualRegular = [pokemon.sprite, pokemon.artwork];
  const visualShiny = [pokemon.spriteShiny, pokemon.artworkShiny];
  const artworkRegular = [pokemon.artwork, pokemon.sprite];
  const artworkShiny = [pokemon.artworkShiny, pokemon.spriteShiny];
  const formRegularFallback = hasDistinctSprite
    ? uniqUrls([
        ...getPokemonDbHomeUrlsFromIdentity(pokemon, false, { includeBaseFallback: false }),
        getIdentityApiHomeSpriteUrl(pokemon),
        ...getHomeThumbnailUrlsFromIdentity(pokemon, false, { includeBaseFallback: false }),
        ...visualRegular,
        getIdentityApiSpriteUrl(pokemon),
        ...buildHybridImageUrlsFromIdentity(pokemon, { includeBaseFallback: false })
      ])
    : [];
  const formShinyFallback = hasDistinctSprite
    ? uniqUrls([
        ...getPokemonDbHomeUrlsFromIdentity(pokemon, true, { includeBaseFallback: false }),
        getIdentityApiHomeSpriteUrl(pokemon, true),
        ...getHomeThumbnailUrlsFromIdentity(pokemon, true, { includeBaseFallback: false }),
        ...visualShiny,
        getIdentityApiSpriteUrl(pokemon, true)
      ])
    : [];
  const baseRegularFallback = uniqUrls([
    ...getPokemonDbHomeUrlsFromIdentity(pokemon),
    getIdentityApiHomeSpriteUrl(pokemon),
    ...getHomeThumbnailUrlsFromIdentity(pokemon),
    ...buildProjectPokemonImageUrlsFromIdentity(pokemon),
    ...buildHybridImageUrlsFromIdentity(pokemon),
    ...visualRegular,
    getIdentityApiSpriteUrl(pokemon),
    buildSpriteUrl(pokemon.baseNumber ?? pokemon.dexNumber ?? pokemon.id)
  ]);

  if (preferArtwork) {
    if (wantsShiny) {
      return uniqUrls([
        ...(hasDistinctSprite ? [...artworkShiny, ...artworkRegular, ...formShinyFallback, ...formRegularFallback] : []),
        ...artworkShiny,
        ...artworkRegular,
        ...getPokemonDbHomeUrlsFromIdentity(pokemon, true),
        getIdentityApiHomeSpriteUrl(pokemon, true),
        ...getHomeThumbnailUrlsFromIdentity(pokemon, true),
        getIdentityApiSpriteUrl(pokemon, true),
        ...baseRegularFallback
      ]);
    }

    return uniqUrls([
      ...(hasDistinctSprite ? [...artworkRegular, ...formRegularFallback] : []),
      ...artworkRegular,
      ...baseRegularFallback
    ]);
  }

  if (wantsShiny) {
    return uniqUrls([
      ...formShinyFallback,
      ...formRegularFallback,
      ...getPokemonDbHomeUrlsFromIdentity(pokemon, true),
      ...getHomeThumbnailUrlsFromIdentity(pokemon, true),
      ...visualShiny,
      getIdentityApiSpriteUrl(pokemon, true),
      ...baseRegularFallback
    ]);
  }

  return uniqUrls([...formRegularFallback, ...baseRegularFallback]);
}

function applyImageSources(image, sources, alt = "") {
  const queue = uniqUrls(sources);
  image.alt = alt;
  image.classList.remove("is-missing", "is-hidden");

  if (!queue.length) {
    image.classList.add("is-missing");
    image.removeAttribute("src");
    image.onerror = null;
    return;
  }

  let index = 0;
  image.onerror = () => {
    index += 1;
    if (index < queue.length) {
      image.src = queue[index];
      return;
    }

    image.classList.add("is-missing");
    image.removeAttribute("src");
    image.onerror = null;
  };
  image.src = queue[index];
}

function applyEntrySprite(image, entry, options = {}) {
  applyImageSources(
    image,
    getEntrySpriteUrls(entry, options),
    `${entry.displayName}${shouldUseShinySprite(entry.name, options) ? " shiny" : ""} sprite`
  );
}

function applyPokemonVisual(image, pokemon, options = {}) {
  applyImageSources(
    image,
    getPokemonVisualUrls(pokemon, options),
    `${pokemon.displayName}${shouldUseShinySprite(pokemon.name, options) ? " shiny" : ""} ${
      options.preferArtwork ? "artwork" : "sprite"
    }`
  );
}

function formatNumber(value) {
  return String(value).padStart(4, "0");
}

function formatCount(value) {
  return Number(value).toLocaleString();
}

function normalizeSearch(value) {
  return String(value).trim().toLowerCase();
}

function buildEntrySearchBlob(entry, extraTerms = []) {
  return [
    entry.id,
    entry.baseNumber,
    entry.name,
    entry.name.replace(/-/g, " "),
    entry.displayName.toLowerCase(),
    entry.basePokemonName ?? "",
    String(entry.basePokemonName ?? "").replace(/-/g, " "),
    entry.baseDisplayName.toLowerCase(),
    entry.variantLabel ?? "",
    `gen ${entry.generation}`,
    ...(entry.formFlags ?? []),
    ...extraTerms
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizeCachedDexEntry(entry) {
  if (!entry || typeof entry !== "object" || !entry.name) {
    return null;
  }

  const id = Number(entry.id) || 0;
  const baseNumber = Number(entry.baseNumber) || id;
  const basePokemonName = String(entry.basePokemonName || entry.name).trim();
  const formFlags = Array.isArray(entry.formFlags) ? entry.formFlags.map(String) : detectFormFlags(entry.name, id);
  const normalizedEntry = {
    ...entry,
    id,
    baseNumber,
    name: String(entry.name).trim(),
    displayName: String(entry.displayName || titleCase(entry.name)).trim(),
    isForm: Boolean(entry.isForm),
    basePokemonName,
    baseDisplayName: String(entry.baseDisplayName || titleCase(basePokemonName)).trim(),
    formFlags,
    variantLabel: entry.variantLabel ?? null,
    detailNote: String(entry.detailNote ?? ""),
    listSprite: String(entry.listSprite ?? buildSpriteUrl(id || baseNumber)),
    shinyListSprite: String(entry.shinyListSprite ?? buildSpriteUrl(id || baseNumber, true)),
    archiveVisible: entry.archiveVisible !== false,
    showInFormsTab: entry.showInFormsTab !== false
  };
  applyTrackedGenderPairIdentity(normalizedEntry);
  normalizedEntry.generation = determineEntryGeneration(normalizedEntry);
  const homeMeta = getHomeBoxCompatibilityMeta(normalizedEntry);

  Object.assign(normalizedEntry, homeMeta, {
    parkedOnly: normalizedEntry.archiveVisible === false || homeMeta.parkedOnly
  });
  normalizedEntry.searchBlob = buildEntrySearchBlob(normalizedEntry);
  return normalizedEntry;
}

function commitDexIndexState(snapshot, options = {}) {
  const { renderUi = true } = options;
  const baseEntries = Array.isArray(snapshot?.baseEntries)
    ? snapshot.baseEntries
        .map((entry) => ({
          id: Number(entry?.id) || 0,
          name: String(entry?.name || "").trim()
        }))
        .filter((entry) => entry.id && entry.name)
    : [];
  const normalizedSnapshotEntries = Array.isArray(snapshot?.entries)
    ? snapshot.entries.map(normalizeCachedDexEntry).filter(Boolean)
    : [];
  const normalizedSnapshotParkedEntries = Array.isArray(snapshot?.parkedEntries)
    ? snapshot.parkedEntries.map(normalizeCachedDexEntry).filter(Boolean)
    : [];
  const normalizedEntriesByName = new Map();

  [...normalizedSnapshotEntries, ...normalizedSnapshotParkedEntries].forEach((entry) => {
    normalizedEntriesByName.set(entry.name, entry);
  });

  const normalizedAllEntries = [...normalizedEntriesByName.values()].sort(
    (left, right) => left.baseNumber - right.baseNumber || compareEntriesWithinGroup(left, right)
  );
  const normalizedEntries = normalizedAllEntries.filter((entry) => !entry.parkedOnly);
  const normalizedParkedEntries = normalizedAllEntries.filter((entry) => entry.parkedOnly);

  if (!normalizedEntries.length || !baseEntries.length) {
    return false;
  }

  state.baseEntriesByName = new Map(baseEntries.map((entry) => [entry.name, entry]));
  state.baseNamesSorted = Array.isArray(snapshot?.baseNamesSorted) && snapshot.baseNamesSorted.length
    ? snapshot.baseNamesSorted.map((name) => String(name))
    : [...state.baseEntriesByName.keys()].sort((left, right) => right.length - left.length);
  state.entries = normalizedEntries;
  state.parkedEntries = normalizedParkedEntries;
  state.archiveStats.baseCount = state.entries.reduce((sum, entry) => sum + Number(!entry.isForm), 0);
  state.archiveStats.formCount = state.entries.length - state.archiveStats.baseCount;
  state.entriesByName = new Map(
    [...state.entries, ...state.parkedEntries.filter((entry) => entry.showInFormsTab)].map((entry) => [
      entry.name,
      entry
    ])
  );

  refreshRandomTargets();

  if (renderUi) {
    refreshResults();
    renderCollections();
    renderTrainerVault();
    renderHomeOrganizer();
    renderSuggestors();
    renderFirstRunHelper();
    if (state.currentPokemon) {
      renderCurrentPokemon(state.currentPokemon);
    }
  }

  return true;
}

function hydrateDexIndexFromCache() {
  const cached = loadDexIndexCache();
  const hydrated = commitDexIndexState(cached, { renderUi: false });

  if (hydrated) {
    setStatus(`${formatCount(state.entries.length)} cached entities ready. Refreshing live Dex...`);
  }

  return hydrated;
}

async function restorePersistedCurrentScan() {
  const targetName = state.sessionRestore.currentPokemonName;

  if (!targetName || state.sessionRestore.restoring || state.currentPokemon?.name === targetName) {
    return;
  }

  if (!state.entriesByName.has(targetName)) {
    state.sessionRestore.currentPokemonName = null;
    saveUiSessionState();
    return;
  }

  state.sessionRestore.restoring = true;
  try {
    await fetchPokemonDetail(targetName);
  } finally {
    state.sessionRestore.restoring = false;
  }
}

function setStatus(message) {
  elements.statusText.textContent = message;
}

function setLoadingState(loading) {
  elements.searchInput.disabled = loading;
  elements.openEntryButton.disabled = loading;
  elements.randomButton.disabled = loading;
  elements.toggleCaughtButton.disabled = loading || !state.currentPokemon;
}

function sanitizeFlavorText(value) {
  return String(value || "")
    .replace(/[\f\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatVersionName(versionName) {
  return String(versionName)
    .split("-")
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
}

function buildPokedexEntries(species) {
  const englishEntries = species.flavor_text_entries
    .filter((entry) => entry.language.name === "en")
    .map((entry, index) => {
      const meta = FLAVOR_VERSION_META[entry.version.name];

      return {
        versionName: entry.version.name,
        label: meta?.label ?? formatVersionName(entry.version.name),
        priority: meta?.priority ?? 100 + index,
        text: sanitizeFlavorText(entry.flavor_text),
        index
      };
    })
    .filter((entry) => entry.text);

  const preferredEntries = englishEntries.filter((entry) => FLAVOR_VERSION_META[entry.versionName]);
  const scopedEntries = preferredEntries.length ? preferredEntries : englishEntries;
  const groupedEntries = [];

  [...scopedEntries]
    .sort((left, right) => left.priority - right.priority || left.index - right.index)
    .forEach((entry) => {
      const existing = groupedEntries.find((group) => group.text === entry.text);
      if (existing) {
        if (!existing.labels.includes(entry.label)) {
          existing.labels.push(entry.label);
        }
        return;
      }

      groupedEntries.push({
        text: entry.text,
        labels: [entry.label]
      });
    });

  const limit = preferredEntries.length ? 8 : 6;

  return {
    entries: groupedEntries.slice(0, limit).map((group) => ({
      text: group.text,
      sourceLabel: group.labels.join(" / ")
    })),
    scopeLabel: preferredEntries.length ? "Switch notes" : "Archive notes"
  };
}

function extractIdFromUrl(url) {
  const parts = String(url).split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

function determineGeneration(number) {
  const generation = GENERATION_RANGES.find((entry) => number >= entry.start && number <= entry.end);
  return generation ? generation.label : "unknown";
}

function determineEntryGeneration(entry) {
  const baseGeneration = determineGeneration(entry?.baseNumber ?? entry?.id ?? 0);
  const name = String(entry?.name ?? "").toLowerCase();
  const basePokemonName = String(entry?.basePokemonName ?? entry?.name ?? "").toLowerCase();
  const formFlags = new Set(entry?.formFlags ?? []);
  const isForm = Boolean(entry?.isForm || entry?.syntheticKind || formFlags.has("form"));

  if (!isForm || !name || name === basePokemonName) {
    return baseGeneration;
  }

  if (name.includes("-mega") || name.includes("-primal")) {
    return "6";
  }

  if (
    name.includes("-alola") ||
    name === "greninja-ash" ||
    name === "greninja-battle-bond" ||
    (name.startsWith("zygarde-") && name !== "zygarde") ||
    name.startsWith("necrozma-") ||
    /pikachu-.*-cap$/.test(name)
  ) {
    return name.includes("world-cap") ? "8" : "7";
  }

  if (
    name.includes("-galar") ||
    name.includes("-hisui") ||
    name.includes("-gmax") ||
    name.includes("rapid-strike") ||
    name.includes("single-strike") ||
    name.includes("eternamax") ||
    name === "dialga-origin" ||
    name === "palkia-origin"
  ) {
    return "8";
  }

  if (
    name.includes("-paldea") ||
    name.includes("bloodmoon") ||
    name.includes("combat-breed") ||
    name.includes("aqua-breed") ||
    name.includes("blaze-breed") ||
    name.includes("family-of-") ||
    name.includes("roaming") ||
    name.includes("masterpiece") ||
    name.includes("artisan") ||
    name.includes("cornerstone-mask") ||
    name.includes("hearthflame-mask") ||
    name.includes("wellspring-mask") ||
    name.includes("teal-mask") ||
    name.includes("terastal") ||
    name.includes("stellar")
  ) {
    return "9";
  }

  return baseGeneration;
}

function resolveBaseEntry(name, id) {
  if (id <= BASE_POKEMON_COUNT) {
    return state.baseEntriesByName.get(name) ?? null;
  }

  const baseName = state.baseNamesSorted.find(
    (candidate) => name === candidate || name.startsWith(`${candidate}-`)
  );

  return baseName ? state.baseEntriesByName.get(baseName) ?? null : null;
}

function detectFormFlags(name, id) {
  const flags = [];
  const lowerName = name.toLowerCase();
  const segments = lowerName.split("-").filter(Boolean);
  const segmentSet = new Set(segments);
  const hasCompoundSegments = (...compoundSegments) =>
    compoundSegments.every((segment, index) => segments[index + Math.max(0, segments.length - compoundSegments.length)] === segment) ||
    compoundSegments.every((segment, index) => {
      const startIndex = segments.indexOf(compoundSegments[0]);
      return startIndex !== -1 && segments[startIndex + index] === segment;
    });

  if (id > BASE_POKEMON_COUNT) {
    flags.push("form");
  }
  if (segmentSet.has("mega")) {
    flags.push("mega");
  }
  if (segmentSet.has("gmax")) {
    flags.push("gmax");
  }
  if (
    segmentSet.has("alola") ||
    segmentSet.has("galar") ||
    segmentSet.has("hisui") ||
    segmentSet.has("paldea")
  ) {
    flags.push("regional");
  }
  if (
    [
      "totem",
      "therian",
      "origin",
      "eternamax",
      "crowned",
      "primal",
      "ultra",
      "school",
      "busted",
      "hangry",
      "bloodmoon",
      "family",
      "hero",
      "roaming",
      "terastal",
      "stellar",
      "breed",
      "mode",
      "build",
      "mask",
      "zen",
      "construct",
      "gulping",
      "gorging",
      "noice",
      "pirouette",
      "crowned"
    ].some((token) => segmentSet.has(token)) ||
    hasCompoundSegments("battle", "bond") ||
    segmentSet.has("cap")
  ) {
    flags.push("special");
  }

  return [...new Set(flags)];
}

function createAppearanceEntry({
  id,
  name,
  displayName,
  baseNumber,
  basePokemonName,
  variantLabel,
  detailNote,
  spriteSlug = "",
  listSprite,
  shinyListSprite,
  formFlags = ["form", "appearance"],
  syntheticKind = "appearance",
  extraSearchTerms = ["appearance", "cosmetic"],
  archiveVisible = true,
  showInFormsTab = true
}) {
  const entry = {
    id,
    name,
    displayName,
    isForm: true,
    baseNumber,
    basePokemonName,
    baseDisplayName: titleCase(basePokemonName),
    formFlags,
    variantLabel,
    detailNote,
    syntheticKind,
    archiveVisible,
    showInFormsTab,
    listSprite: listSprite ?? buildFormSpriteUrl(baseNumber, spriteSlug),
    shinyListSprite: shinyListSprite ?? buildFormSpriteUrl(baseNumber, spriteSlug, true)
  };

  entry.generation = determineEntryGeneration(entry);
  entry.searchBlob = buildEntrySearchBlob(entry, extraSearchTerms);
  return entry;
}

function buildAppearanceFormEntries(startId, existingNames = new Set(), sourceEntries = []) {
  const entries = [];
  let nextId = startId;
  const sourceEntriesById = new Map(sourceEntries.map((entry) => [entry.id, entry]));

  ALCREMIE_CREAMS.forEach((cream) => {
    ALCREMIE_SWEETS.forEach((sweet) => {
      if (cream.slug === "vanilla-cream" && sweet.slug === "strawberry-sweet") {
        return;
      }

      const name = `alcremie-${cream.slug}-${sweet.slug}`;
      if (existingNames.has(name)) {
        return;
      }

      entries.push(
        createAppearanceEntry({
          id: nextId++,
          name,
          displayName: `Alcremie ${cream.label} ${sweet.label}`,
          baseNumber: 869,
          basePokemonName: "alcremie",
          variantLabel: `${cream.label} ${sweet.label}`,
          detailNote: `${cream.label} with ${sweet.label.toLowerCase()} is tracked as a cosmetic Alcremie appearance form.`,
          spriteSlug: `${cream.slug}-${sweet.slug}`
        })
      );
    });
  });

  VIVILLON_PATTERNS.forEach((pattern) => {
    if (pattern.slug === "meadow-pattern") {
      return;
    }

    const name = `vivillon-${pattern.slug}`;
    if (existingNames.has(name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `Vivillon ${pattern.label}`,
        baseNumber: 666,
        basePokemonName: "vivillon",
        variantLabel: pattern.label,
        detailNote: `${pattern.label} is tracked as a cosmetic Vivillon appearance form.`,
        spriteSlug: pattern.slug.replace(/-pattern$/, "")
      })
    );
  });

  FURFROU_TRIMS.forEach((trim) => {
    if (trim.slug === "natural") {
      return;
    }

    const name = `furfrou-${trim.slug}`;
    if (existingNames.has(name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `Furfrou ${trim.label}`,
        baseNumber: 676,
        basePokemonName: "furfrou",
        variantLabel: trim.label,
        detailNote: `${trim.label} is tracked as a cosmetic Furfrou appearance form.`,
        spriteSlug: trim.slug
      })
    );
  });

  KALOS_FLOWER_FAMILIES.forEach((family) => {
    KALOS_FLOWER_COLORS.forEach((color) => {
      if (color.isDefault) {
        return;
      }

      const name = `${family.basePokemonName}-${color.slug}`;
      if (existingNames.has(name)) {
        return;
      }

      entries.push(
        createAppearanceEntry({
          id: nextId++,
          name,
          displayName: `${family.displayLabel} ${color.label}`,
          baseNumber: family.baseNumber,
          basePokemonName: family.basePokemonName,
          variantLabel: color.label,
          detailNote: `${color.label} is tracked as a cosmetic ${family.displayLabel} color variant.`,
          spriteSlug: color.slug,
          extraSearchTerms: ["appearance", "cosmetic", "flower", "color"]
        })
      );
    });
  });

  BURMY_CLOAKS.forEach((cloak) => {
    if (cloak.isDefault) {
      return;
    }

    const name = `burmy-${cloak.slug}`;
    if (existingNames.has(name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `Burmy ${cloak.label}`,
        baseNumber: 412,
        basePokemonName: "burmy",
        variantLabel: cloak.label,
        detailNote: `${cloak.label} is tracked as a cosmetic Burmy cloak variant.`,
        spriteSlug: cloak.slug,
        extraSearchTerms: ["appearance", "cosmetic", "cloak", "burmy"]
      })
    );
  });

  SINNOH_EAST_SEA_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        spriteSlug: variant.spriteSlug,
        extraSearchTerms: ["appearance", "cosmetic", "sea", "sinnoh"]
      })
    );
  });

  UNOVA_SEASON_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        spriteSlug: variant.spriteSlug,
        extraSearchTerms: ["appearance", "cosmetic", "season", "unova"]
      })
    );
  });

  UNOWN_FORM_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: variant.id,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        listSprite: variant.listSprite,
        shinyListSprite: variant.shinyListSprite,
        extraSearchTerms: variant.extraSearchTerms
      })
    );
  });

  AUTHENTICITY_FORM_VARIANTS.forEach((variant) => {
    if (existingNames.has(variant.name)) {
      return;
    }

    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name: variant.name,
        displayName: variant.displayName,
        baseNumber: variant.baseNumber,
        basePokemonName: variant.basePokemonName,
        variantLabel: variant.variantLabel,
        detailNote: variant.detailNote,
        listSprite: buildSpriteUrl(variant.baseNumber),
        shinyListSprite: buildSpriteUrl(variant.baseNumber, true),
        archiveVisible: false,
        showInFormsTab: true,
        extraSearchTerms: variant.extraSearchTerms
      })
    );
  });

  FEMALE_SPRITE_DIFFERENCE_IDS.forEach((id) => {
    const sourceEntry = sourceEntriesById.get(id);
    if (!sourceEntry) {
      return;
    }

    const rootName = stripTrackedGenderSuffix(sourceEntry.name);
    const name = `${rootName}-female`;
    if (existingNames.has(name)) {
      return;
    }

    const baseLabel = titleCase(rootName);
    entries.push(
      createAppearanceEntry({
        id: nextId++,
        name,
        displayName: `${baseLabel} Female`,
        baseNumber: sourceEntry.baseNumber,
        basePokemonName: rootName,
        variantLabel: "Female",
        detailNote: `Female ${baseLabel} is tracked here because it has an official visual gender difference.`,
        listSprite: buildGenderSpriteUrl(sourceEntry.id),
        shinyListSprite: buildGenderSpriteUrl(sourceEntry.id, true),
        formFlags: ["form", "gender"],
        syntheticKind: "gender",
        extraSearchTerms: ["gender", "female", "difference", "visual"]
      })
    );
  });

  return entries;
}

function labelSort(sort) {
  const labels = {
    "id-asc": "Sort: ID Numeric",
    alpha: "Sort: Alphabetical",
    caught: isArchiveShinyMode() ? "Sort: Shiny Caught First" : "Sort: Caught First",
    forms: "Sort: Form Priority"
  };

  return labels[sort] ?? "Sort: ID Numeric";
}

function formatFormFlagLabel(flag) {
  const labels = {
    gmax: "G-Max",
    mega: "Mega",
    regional: "Regional",
    special: "Special",
    gender: "Gender",
    appearance: "Appearance",
    form: "Form"
  };

  return labels[flag] ?? titleCase(String(flag ?? "").replace(/-/g, " "));
}

function getEntryVariantLabel(entry) {
  if (entry.variantLabel) {
    return entry.variantLabel;
  }

  if (!entry.isForm) {
    return "Base";
  }

  const labeledFlag = entry.formFlags.find((flag) => flag !== "form");
  return labeledFlag ? `${formatFormFlagLabel(labeledFlag)} Form` : "Form Variant";
}

function getEntryAccentKey(entry) {
  if (!entry?.isForm) {
    return "base";
  }

  if (entry.syntheticKind === "gender") {
    return "gender";
  }

  if (entry.syntheticKind === "appearance") {
    return "appearance";
  }

  const flags = new Set(entry.formFlags ?? []);

  if (flags.has("gmax")) {
    return "gmax";
  }

  if (flags.has("mega")) {
    return "mega";
  }

  if (flags.has("regional")) {
    return "regional";
  }

  if (flags.has("special")) {
    return "special";
  }

  return "form";
}

function getEntryWithinGroupOrder(entry) {
  if (!entry?.isForm) {
    return 0;
  }

  if (entry.syntheticKind === "gender") {
    return 1;
  }

  return 2;
}

function getUnownWithinGroupOrder(entry) {
  if (!entry || Number(entry.baseNumber) !== 201) {
    return null;
  }

  return UNOWN_FORM_ORDER.get(String(entry.name ?? "").toLowerCase()) ?? null;
}

function compareEntriesWithinGroup(left, right) {
  const leftUnownOrder = getUnownWithinGroupOrder(left);
  const rightUnownOrder = getUnownWithinGroupOrder(right);

  return (
    (leftUnownOrder !== null && rightUnownOrder !== null
      ? leftUnownOrder - rightUnownOrder
      : 0) ||
    getEntryWithinGroupOrder(left) - getEntryWithinGroupOrder(right) ||
    left.displayName.localeCompare(right.displayName) ||
    left.id - right.id
  );
}

function getEntriesForBaseNumber(baseNumber) {
  return [...state.entries, ...state.parkedEntries.filter((entry) => entry.showInFormsTab)]
    .filter((entry) => entry.baseNumber === baseNumber)
    .sort(compareEntriesWithinGroup);
}

async function repairUnresolvedFormEntries(entries) {
  const unresolvedForms = entries.filter(
    (entry) =>
      entry.isForm &&
      !entry.syntheticKind &&
      (!entry.basePokemonName || entry.baseNumber === entry.id)
  );

  if (!unresolvedForms.length) {
    return;
  }

  const repairs = await Promise.allSettled(
    unresolvedForms.map(async (entry) => {
      const payload = await fetchJsonCached(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(entry.name)}`
      );

      return {
        entry,
        speciesName: payload.species?.name ?? entry.basePokemonName ?? entry.name,
        speciesId: payload.species?.url ? extractIdFromUrl(payload.species.url) : entry.baseNumber
      };
    })
  );

  repairs.forEach((result) => {
    if (result.status !== "fulfilled") {
      return;
    }

    const { entry, speciesName, speciesId } = result.value;
    entry.basePokemonName = speciesName;
    entry.baseDisplayName = titleCase(speciesName);
    entry.baseNumber = speciesId;
    entry.generation = determineEntryGeneration(entry);
    entry.listSprite = buildSpriteUrl(entry.id);
    entry.shinyListSprite = buildSpriteUrl(entry.id, true);
    entry.searchBlob = buildEntrySearchBlob(entry);
  });
}

function buildSpeciesOrderFromNames(speciesNames = []) {
  const seen = new Set();
  const order = [];
  const resolveBaseOrderEntry = (name) => {
    const normalizedName = String(name ?? "").trim().toLowerCase();
    if (!normalizedName) {
      return null;
    }

    const directEntry = state.baseEntriesByName.get(normalizedName);
    if (directEntry) {
      return directEntry;
    }

    for (const suffix of SPECIES_ORDER_DEFAULT_FORM_SUFFIXES) {
      const defaultFormEntry = state.baseEntriesByName.get(`${normalizedName}-${suffix}`);
      if (defaultFormEntry) {
        return defaultFormEntry;
      }
    }

    return null;
  };

  speciesNames.forEach((name) => {
    const baseEntry = resolveBaseOrderEntry(name);
    const speciesNumber = baseEntry?.id;

    if (!Number.isFinite(speciesNumber) || seen.has(speciesNumber)) {
      return;
    }

    seen.add(speciesNumber);
    order.push(speciesNumber);
  });

  return order;
}

async function fetchPokedexSpeciesOrder(pokedexName) {
  const payload = await fetchJsonCached(
    `https://pokeapi.co/api/v2/pokedex/${encodeURIComponent(pokedexName)}`
  );
  return payload.pokemon_entries
    .slice()
    .sort((left, right) => left.entry_number - right.entry_number)
    .map((entry) => extractIdFromUrl(entry.pokemon_species.url));
}

async function buildAvailabilitySpeciesData(config) {
  const speciesSet = new Set();
  const order = [];

  const appendNumber = (number) => {
    if (!Number.isFinite(number) || speciesSet.has(number)) {
      return;
    }

    speciesSet.add(number);
    order.push(number);
  };

  config?.baseRanges?.forEach((range) => {
    for (let current = range.start; current <= range.end; current += 1) {
      appendNumber(current);
    }
  });

  if (config?.pokedexes?.length) {
    const pokedexOrders = await Promise.all(config.pokedexes.map(fetchPokedexSpeciesOrder));
    pokedexOrders.forEach((pokedexOrder) => {
      pokedexOrder.forEach((number) => {
        appendNumber(number);
      });
    });
  }

  if (config?.speciesOrderNames?.length) {
    buildSpeciesOrderFromNames(config.speciesOrderNames).forEach((number) => {
      appendNumber(number);
    });
  }

  config?.extraSpecies?.forEach((number) => {
    appendNumber(number);
  });

  config?.speciesNumbers?.forEach((number) => {
    appendNumber(number);
  });

  return { speciesSet, order };
}

async function buildGameAvailabilityDetail(gameId) {
  const config = SWITCH_GAME_AVAILABILITY[gameId];
  const detail = createGameAvailabilityDetail(gameId);

  if (!config) {
    return detail;
  }

  const allData = await buildAvailabilitySpeciesData(config);
  detail.all = allData.speciesSet;
  detail.order = allData.order;
  detail.orderIndex = buildGameAvailabilityOrderIndex(detail.order);

  if (detail.segments.length) {
    detail.segments = await Promise.all(
      detail.segments.map(async (segment) => {
        const segmentData = await buildAvailabilitySpeciesData(segment);
        return {
          ...segment,
          speciesSet: segmentData.speciesSet,
          order: segmentData.order,
          orderIndex: buildGameAvailabilityOrderIndex(segmentData.order)
        };
      })
    );
  }

  return detail;
}

function isAvailableInGame(baseNumber, gameId) {
  return Boolean(state.gameAvailabilityByGame.get(gameId)?.has(baseNumber));
}

function getEntryGameSupport(entry) {
  if (!entry) {
    return null;
  }

  const name = String(entry.name ?? "").toLowerCase();
  const basePokemonName = String(entry.basePokemonName ?? "").toLowerCase();
  const formFlags = new Set(entry.formFlags ?? []);

  if (!entry.isForm) {
    return null;
  }

  if (entry.syntheticKind === "gender") {
    return null;
  }

  if (GAME_FILTER_UNOBTAINABLE_FORM_PATTERN.test(name)) {
    return FORM_GAME_SUPPORT.none;
  }

  if (name.includes("-gmax")) {
    return FORM_GAME_SUPPORT.swshOnly;
  }

  if (name.includes("-mega")) {
    return FORM_GAME_SUPPORT.lzaOnly;
  }

  if (name.includes("-primal")) {
    return FORM_GAME_SUPPORT.none;
  }

  if (name === "gimmighoul-roaming" || name === "ursaluna-bloodmoon") {
    return FORM_GAME_SUPPORT.svOnly;
  }

  if (name.startsWith("unown-")) {
    return FORM_GAME_SUPPORT.bdspPla;
  }

  if (name === "basculin-blue-striped") {
    return FORM_GAME_SUPPORT.swshSv;
  }

  if (name === "basculin-white-striped") {
    return FORM_GAME_SUPPORT.plaSv;
  }

  if (name === "shellos-east" || name === "gastrodon-east") {
    return FORM_GAME_SUPPORT.bdspPlaSwshSv;
  }

  if (
    basePokemonName === "deerling" ||
    basePokemonName === "sawsbuck" ||
    basePokemonName === "vivillon"
  ) {
    return FORM_GAME_SUPPORT.svOnly;
  }

  if (basePokemonName === "alcremie") {
    return FORM_GAME_SUPPORT.swshSv;
  }

  if (
    basePokemonName === "burmy" ||
    basePokemonName === "wormadam" ||
    basePokemonName === "mothim"
  ) {
    return FORM_GAME_SUPPORT.bdspPla;
  }

  if (
    basePokemonName === "flabebe" ||
    basePokemonName === "floette" ||
    basePokemonName === "florges"
  ) {
    return FORM_GAME_SUPPORT.svLza;
  }

  if (formFlags.has("regional")) {
    if (name.includes("alola")) {
      return FORM_GAME_SUPPORT.lgpeSwshSv;
    }
    if (name.includes("galar")) {
      return FORM_GAME_SUPPORT.swshOnly;
    }
    if (name.includes("hisui")) {
      return FORM_GAME_SUPPORT.plaOnly;
    }
    if (name.includes("paldea")) {
      return FORM_GAME_SUPPORT.svOnly;
    }
  }

  return null;
}

function isBaseFormUnavailableInGame(entry, gameId) {
  if (!entry || entry.isForm || !gameId || gameId === "all") {
    return false;
  }

  const blockedSpecies = GAME_BASE_FORM_UNAVAILABLE_SPECIES[gameId];
  if (!blockedSpecies?.size) {
    return false;
  }

  const normalizedName = String(entry.name ?? "")
    .toLowerCase()
    .replace(DEFAULT_GAME_VARIANT_BASE_NAME_PATTERN, "");
  return blockedSpecies.has(normalizedName);
}

function isEntryAvailableInGame(entry, gameId) {
  if (!entry || !gameId || gameId === "all") {
    return true;
  }

  if (!isAvailableInTrackedGameScope(entry.baseNumber, gameId)) {
    return false;
  }

  if (isBaseFormUnavailableInGame(entry, gameId)) {
    return false;
  }

  const supportedGames = getEntryGameSupport(entry);
  return supportedGames ? supportedGames.has(gameId) : true;
}

function getGameDexOrderIndex(baseNumber, gameId) {
  const detail = state.gameAvailabilityDetailsByGame.get(gameId);
  return detail?.orderIndex?.get(baseNumber) ?? Number.MAX_SAFE_INTEGER;
}

function compareEntriesByGameDexOrder(left, right, gameId) {
  return (
    getGameDexOrderIndex(left.baseNumber, gameId) - getGameDexOrderIndex(right.baseNumber, gameId) ||
    left.baseNumber - right.baseNumber ||
    compareEntriesWithinGroup(left, right)
  );
}

function getAvailabilitySegmentVersionLabel(segment, baseNumber) {
  if (!segment?.available) {
    return "";
  }

  const swordNative = segment.versionNative?.sword?.includes(baseNumber);
  const shieldNative = segment.versionNative?.shield?.includes(baseNumber);

  if (swordNative && shieldNative) {
    return "Sword / Shield";
  }

  if (swordNative) {
    return "Sword Native";
  }

  if (shieldNative) {
    return "Shield Native";
  }

  return segment.defaultVersionLabel ?? "";
}

function getGameAvailabilityRecords(baseNumber) {
  return GAME_CATALOG.map((game) => {
    const detail =
      state.gameAvailabilityDetailsByGame.get(game.id) ?? createGameAvailabilityDetail(game.id);
    const trackerGameState = state.tracker.games[game.id];
    const ownsBaseGame = Boolean(trackerGameState?.owned);
    const hasDlcCoverage = gameHasDlcCoverage(game.id);
    const ownsDlc = trackerHasDlc(game.id);
    const segmentRecords = detail.segments.map((segment) => {
      const segmentKind = segment.kind ?? "segment";
      const segmentAvailable = segment.speciesSet.has(baseNumber);
      const dlcLocked = Boolean(
        segmentAvailable && ownsBaseGame && hasDlcCoverage && segmentKind === "dlc" && !ownsDlc
      );

      return {
        id: segment.id,
        kind: segmentKind,
        label: segment.label,
        sourceLabel: segment.sourceLabel ?? segment.label,
        available: segmentAvailable,
        catchable: segmentAvailable && !dlcLocked,
        dlcLocked,
        versionNative: segment.versionNative,
        defaultVersionLabel: segment.defaultVersionLabel,
        versionLabel: getAvailabilitySegmentVersionLabel(
          {
            ...segment,
            available: segmentAvailable
          },
          baseNumber
        )
      };
    });

    return {
      ...game,
      available: isAvailableInGame(baseNumber, game.id),
      owned: isAvailableInOwnedGameSelection(baseNumber, game.id),
      active: state.tracker.activeGame === game.id,
      hasDlcCoverage,
      dlcOwned: ownsDlc,
      dlcBlocked: segmentRecords.some((segment) => segment.dlcLocked),
      versionExclusiveLabel: isAvailableInGame(baseNumber, game.id)
        ? getVersionExclusiveLabel(game.id, baseNumber)
        : "",
      versionExclusiveClasses: isAvailableInGame(baseNumber, game.id)
        ? getVersionExclusiveBadgeClasses(game.id, baseNumber)
        : [],
      sourceLabel: SWITCH_GAME_AVAILABILITY[game.id]?.label ?? "Tracked switch coverage",
      segmentRecords
    };
  });
}

function renderGameAvailability(baseNumber) {
  const records = getGameAvailabilityRecords(baseNumber);
  const availableCount = records.reduce((sum, record) => sum + Number(record.available), 0);
  const dynamaxAdventureRecord = records
    .find((record) => record.id === "swsh")
    ?.segmentRecords.find((segment) => segment.id === "dynamax-adventure" && segment.available);

  elements.gameAvailabilityList.replaceChildren();

  if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
    elements.gameAvailabilityCount.textContent = "Syncing";
    elements.gameAvailabilityNote.textContent =
      "Pulling Switch game dex coverage from the Dex now.";
  } else if (!state.gameAvailabilityReady) {
    elements.gameAvailabilityCount.textContent = "Unavailable";
    elements.gameAvailabilityNote.textContent =
      "Switch game availability could not be loaded right now. Refresh the Dex and try again.";
  } else if (!state.gameAvailabilityBreakdownReady && state.gameAvailabilityLoading) {
    elements.gameAvailabilityCount.textContent = `${availableCount}/${GAME_CATALOG.length} games`;
    elements.gameAvailabilityNote.textContent =
      "Refreshing the split between each main game and its DLC dex coverage now.";
  } else {
    elements.gameAvailabilityCount.textContent = `${availableCount}/${GAME_CATALOG.length} games`;
    elements.gameAvailabilityNote.textContent = `${SWITCH_GAME_AVAILABILITY_NOTE}${
      dynamaxAdventureRecord
        ? " Dynamax Adventure native labels show which version hosts that path by default; online co-op can still surface opposite-version paths."
        : ""
    }`;
  }

  records.forEach((record) => {
    const card = document.createElement("article");
    card.className = "availability-card";
    card.dataset.game = record.id;
    card.classList.toggle("available", state.gameAvailabilityReady && record.available);
    card.classList.toggle("active", record.active);
    card.classList.toggle("has-version-exclusive", Boolean(record.versionExclusiveLabel));
    if (record.versionExclusiveClasses?.length) {
      card.classList.add(
        ...record.versionExclusiveClasses.map((className) => `availability-card--${className}`)
      );
    }

    const head = document.createElement("div");
    head.className = "availability-card-head";

    const title = document.createElement("strong");
    title.textContent = record.shortName;

    const badge = document.createElement("span");
    badge.className = "availability-badge";

    if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
      badge.classList.add("syncing");
      badge.textContent = "Syncing";
    } else if (!state.gameAvailabilityReady) {
      badge.classList.add("unavailable");
      badge.textContent = "Unknown";
    } else if (record.segmentRecords.length) {
      const mainSegment =
        record.segmentRecords.find((segment) => segment.kind === "main") ?? record.segmentRecords[0];
      const mainAvailable = Boolean(mainSegment?.available);
      const hasDlc = record.segmentRecords.some((segment) => segment.kind === "dlc");
      const dlcAvailable = record.segmentRecords.some(
        (segment) => segment.kind === "dlc" && segment.available
      );
      const dlcCatchable = record.segmentRecords.some(
        (segment) => segment.kind === "dlc" && segment.catchable
      );

      if (mainAvailable && hasDlc && dlcCatchable) {
        badge.classList.add("available");
        badge.textContent = "Main + DLC";
      } else if (mainAvailable) {
        badge.classList.add("available");
        badge.textContent = "Main Game";
      } else if (record.dlcBlocked) {
        badge.classList.add("unavailable");
        badge.textContent = "DLC Off";
      } else if (dlcAvailable) {
        badge.classList.add("owned");
        badge.textContent = "DLC Only";
      } else {
        badge.classList.add("unavailable");
        badge.textContent = "Not in Dex";
      }
    } else if (record.available) {
      badge.classList.add("available");
      badge.textContent = "Available";
    } else {
      badge.classList.add("unavailable");
      badge.textContent = "Not in Dex";
    }

    head.append(title, badge);

    const name = document.createElement("p");
    name.className = "availability-card-name";
    name.textContent = record.name;

    const note = document.createElement("p");
    note.className = "availability-card-note";
    note.textContent = record.sourceLabel;

    card.append(head, name, note);

    if (record.segmentRecords.length) {
      const segmentRow = document.createElement("div");
      segmentRow.className = "availability-segment-row";

      record.segmentRecords.forEach((segment) => {
        const segmentCard = document.createElement("div");
        segmentCard.className = `availability-segment ${segment.kind ?? "segment"}`;

        if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
          segmentCard.classList.add("syncing");
        } else if (!state.gameAvailabilityReady) {
          segmentCard.classList.add("unavailable");
        } else if (segment.catchable) {
          segmentCard.classList.add("available");
        } else {
          segmentCard.classList.add("unavailable");
        }

        const copy = document.createElement("div");
        copy.className = "availability-segment-copy";

        const label = document.createElement("strong");
        label.textContent = segment.label;

        const source = document.createElement("span");
        source.textContent =
          state.gameAvailabilityReady && segment.available && segment.versionLabel
            ? `${segment.sourceLabel} · ${segment.versionLabel}`
            : segment.sourceLabel;

        copy.append(label, source);

        const status = document.createElement("span");
        status.className = "availability-segment-state";

        if (!state.gameAvailabilityReady && state.gameAvailabilityLoading) {
          status.textContent = "Syncing";
        } else if (!state.gameAvailabilityReady) {
          status.textContent = "Unknown";
        } else if (segment.dlcLocked) {
          status.textContent = "DLC off";
        } else if (segment.available) {
          status.textContent = "In Dex";
        } else {
          status.textContent = "Missing";
        }

        segmentCard.append(copy, status);
        segmentRow.appendChild(segmentCard);
      });

      card.appendChild(segmentRow);
    }

    if (record.owned || record.active || record.versionExclusiveLabel || record.dlcBlocked) {
      const flags = document.createElement("div");
      flags.className = "availability-card-flags";

      if (record.versionExclusiveLabel) {
        const versionBadge = document.createElement("span");
        versionBadge.className = "availability-badge version-exclusive";
        versionBadge.dataset.game = record.id;
        if (record.versionExclusiveClasses?.length) {
          versionBadge.classList.add(...record.versionExclusiveClasses);
        }
        versionBadge.textContent = record.versionExclusiveLabel;
        flags.appendChild(versionBadge);
      }

      if (record.active) {
        const activeBadge = document.createElement("span");
        activeBadge.className = "availability-badge syncing";
        activeBadge.textContent = "Active Save";
        flags.appendChild(activeBadge);
      }

      if (record.owned) {
        const ownedBadge = document.createElement("span");
        ownedBadge.className = "availability-badge owned";
        ownedBadge.textContent = "Owned";
        flags.appendChild(ownedBadge);
      }

      if (record.dlcBlocked) {
        const dlcBlockedBadge = document.createElement("span");
        dlcBlockedBadge.className = "availability-badge unavailable";
        dlcBlockedBadge.textContent = "DLC Not Owned";
        flags.appendChild(dlcBlockedBadge);
      }

      card.appendChild(flags);
    }

    elements.gameAvailabilityList.appendChild(card);
  });
}

async function loadSwitchGameAvailability() {
  if (state.gameAvailabilityLoading) {
    return;
  }

  state.gameAvailabilityLoading = true;
  state.gameAvailabilityError = false;
  refreshResults();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }

  const nextMap = createEmptyGameAvailabilityMap();
  const nextDetails = createEmptyGameAvailabilityDetailsMap();
  const priorMap = state.gameAvailabilityByGame;
  const priorDetails = state.gameAvailabilityDetailsByGame;
  const results = await Promise.allSettled(
    GAME_CATALOG.map(async (game) => ({
      gameId: game.id,
      detail: await buildGameAvailabilityDetail(game.id)
    }))
  );

  let successCount = 0;

  results.forEach((result, index) => {
    const gameId = GAME_CATALOG[index].id;

    if (result.status === "fulfilled") {
      successCount += 1;
      nextMap.set(gameId, new Set(result.value.detail.all));
      nextDetails.set(gameId, result.value.detail);
      return;
    }

    const fallbackSet = priorMap.get(gameId);
    const fallbackDetail = cloneGameAvailabilityDetail(priorDetails.get(gameId), gameId);
    if (!fallbackDetail.all.size && fallbackSet?.size) {
      fallbackDetail.all = new Set(fallbackSet);
    }
    nextMap.set(gameId, fallbackSet ? new Set(fallbackSet) : new Set(fallbackDetail.all));
    nextDetails.set(gameId, fallbackDetail);
  });

  if (successCount > 0) {
    state.gameAvailabilityByGame = nextMap;
    state.gameAvailabilityDetailsByGame = nextDetails;
    state.gameAvailabilityReady = true;
    state.gameAvailabilityBreakdownReady = hasCompleteGameAvailabilityBreakdown(nextDetails);
    saveGameAvailabilityCache();
  }

  state.gameAvailabilityError = successCount !== GAME_CATALOG.length;
  state.gameAvailabilityLoading = false;
  refreshResults();
  renderCollections();
  renderHomeOrganizer();

  if (state.currentPokemon) {
    renderCurrentPokemon(state.currentPokemon);
  }
}

function getGameMeta(gameId) {
  return GAME_CATALOG.find((game) => game.id === gameId) ?? null;
}
