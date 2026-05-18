import fs from "node:fs";

const outputPath = process.argv[2] ?? "assets/data/pokemondb-location-index.json";
const NATIONAL_DEX_URL = "https://pokemondb.net/pokedex/national";
const POKEMONDB_BASE_URL = "https://pokemondb.net";
const CONCURRENCY = 8;

const SUPPORTED_GAME_LABELS = {
  "Let's Go Pikachu": { gameId: "lgpe", version: "lets_go_pikachu" },
  "Let's Go Eevee": { gameId: "lgpe", version: "lets_go_eevee" },
  Sword: { gameId: "swsh", version: "sword" },
  Shield: { gameId: "swsh", version: "shield" },
  "Brilliant Diamond": { gameId: "bdsp", version: "brilliant_diamond" },
  "Shining Pearl": { gameId: "bdsp", version: "shining_pearl" },
  "Legends: Arceus": { gameId: "pla", version: "all" },
  Scarlet: { gameId: "sv", version: "scarlet" },
  Violet: { gameId: "sv", version: "violet" },
  "Legends: Z-A": { gameId: "lza", version: "all" }
};

const GAME_SORT_ORDER = ["lgpe", "swsh", "bdsp", "pla", "sv", "lza"];

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "-")
    .replace(/&ndash;/g, "-")
    .replace(/&eacute;/g, "\u00e9")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'");
}

function stripHtml(value) {
  return decodeHtml(
    String(value ?? "")
      .replace(/<br\s*\/?>/gi, " | ")
      .replace(/<small[^>]*>/gi, "")
      .replace(/<\/small>/gi, "")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .trim();
}

function normalizePokemonKey(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’'`]/g, "")
    .replace(/♀/g, " female")
    .replace(/♂/g, " male")
    .replace(/type:\s*null/gi, "type null")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function getStatus(locationText) {
  const normalized = locationText.toLowerCase();
  if (normalized.includes("not available")) {
    return "unavailable";
  }
  if (normalized.includes("location data not yet available")) {
    return "unknown";
  }
  if (normalized.includes("trade") || normalized.includes("migrate") || normalized.includes("transfer")) {
    return "transfer";
  }
  return "available";
}

function getNationalDexSlugs(html) {
  return [
    ...new Set(
      [...html.matchAll(/href="\/pokedex\/([a-z0-9-]+)"/g)]
        .map((match) => match[1])
        .filter((slug) => !["national", "all"].includes(slug))
    )
  ];
}

function getLocationTableHtml(html) {
  const headingIndex = html.indexOf("Where to find");
  if (headingIndex < 0) {
    return "";
  }

  const tableStart = html.indexOf("<table", headingIndex);
  const tableEnd = html.indexOf("</table>", tableStart);
  if (tableStart < 0 || tableEnd < 0) {
    return "";
  }

  return html.slice(tableStart, tableEnd + "</table>".length);
}

function getHeadingKey(html) {
  const headingMatch = html.match(/<h2>Where to find\s+([^<]+)<\/h2>/);
  return headingMatch ? normalizePokemonKey(decodeHtml(headingMatch[1])) : "";
}

function getGameLabels(thHtml) {
  return [...thHtml.matchAll(/<span class="igame [^"]+">([\s\S]*?)<\/span>/g)]
    .map((match) => stripHtml(match[1]))
    .filter(Boolean);
}

function parseLocationRows(slug, html) {
  const tableHtml = getLocationTableHtml(html);
  if (!tableHtml) {
    return [];
  }

  return [...tableHtml.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].flatMap((rowMatch) => {
    const rowHtml = rowMatch[1];
    const thMatch = rowHtml.match(/<th[^>]*>([\s\S]*?)<\/th>/);
    const tdMatch = rowHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/);
    if (!thMatch || !tdMatch) {
      return [];
    }

    const locationText = stripHtml(tdMatch[1]);
    if (!locationText) {
      return [];
    }

    const labelsByGame = new Map();
    getGameLabels(thMatch[1]).forEach((label) => {
      const meta = SUPPORTED_GAME_LABELS[label];
      if (!meta) {
        return;
      }

      const record = labelsByGame.get(meta.gameId) ?? {
        g: meta.gameId,
        v: [],
        l: locationText,
        s: getStatus(locationText),
        source: slug
      };
      record.v.push(meta.version);
      labelsByGame.set(meta.gameId, record);
    });

    return [...labelsByGame.values()].map((record) => ({
      ...record,
      v: [...new Set(record.v)]
    }));
  });
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "PokePilot location data builder; https://github.com/Jackjdn163/PokeHelper"
    }
  });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.text();
}

async function mapConcurrent(items, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  async function runWorker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, runWorker));
  return results;
}

const nationalHtml = await fetchText(NATIONAL_DEX_URL);
const slugs = getNationalDexSlugs(nationalHtml);
const recordsByPokemon = {};
const failures = [];

await mapConcurrent(slugs, async (slug, index) => {
  try {
    const url = `${POKEMONDB_BASE_URL}/pokedex/${slug}`;
    const html = await fetchText(url);
    const records = parseLocationRows(slug, html).sort(
      (left, right) =>
        GAME_SORT_ORDER.indexOf(left.g) - GAME_SORT_ORDER.indexOf(right.g) ||
        left.l.localeCompare(right.l)
    );

    if (records.length) {
      recordsByPokemon[slug] = records;
      const headingKey = getHeadingKey(html);
      if (headingKey && headingKey !== slug) {
        recordsByPokemon[headingKey] = records;
      }
    }

    if ((index + 1) % 100 === 0) {
      console.log(`Fetched ${index + 1}/${slugs.length} PokemonDB pages...`);
    }
  } catch (error) {
    failures.push({ slug, error: error.message });
  }
});

const payload = {
  meta: {
    version: 1,
    source: "Pokemon Database",
    sourceUrl: "https://pokemondb.net/pokedex/national",
    fetchedAt: new Date().toISOString(),
    pokemonPages: slugs.length,
    failures: failures.length
  },
  recordsByPokemon
};

fs.mkdirSync(outputPath.split("/").slice(0, -1).join("/"), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload)}\n`);

console.log(
  `Wrote ${outputPath} with ${Object.keys(recordsByPokemon).length} PokemonDB lookup keys.`
);
if (failures.length) {
  console.log("Failures:", failures.slice(0, 10));
}
