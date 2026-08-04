// Henrik Dev API Wrapper with Rate-Limit Queue & Staggering
// Targets Henrik API v3 endpoints (stable, widely supported)

const HENRIK_BASE_URL = 'https://api.henrikdev.xyz';
const DEFAULT_API_KEY = 'HDEV-438470dc-3822-4c7a-9613-323bcf59ed66';
const DEFAULT_REGION = 'ap';

// Module-level account cache
const accountCache = new Map();

// Queue manager for staggering API requests by 400ms to prevent HTTP 429 rate limit
let requestQueue = Promise.resolve();
const STAGGER_MS = 400;

function enqueueRequest(fn) {
  const result = requestQueue.then(async () => {
    await new Promise((resolve) => setTimeout(resolve, STAGGER_MS));
    return fn();
  });
  requestQueue = result.catch(() => { }); // prevent queue breakage on error
  return result;
}

/**
 * Base fetcher wrapper with error handling and rate limit detection
 */
async function henrikFetch(endpoint, apiKeyOverride = null) {
  const apiKey = apiKeyOverride || import.meta.env.VITE_HENRIK_API_KEY || DEFAULT_API_KEY;

  const headers = {};
  if (apiKey) {
    headers['Authorization'] = apiKey;
  }

  const res = await fetch(`${HENRIK_BASE_URL}${endpoint}`, { headers });

  if (res.status === 401) {
    throw new Error('Invalid or missing Henrik API key. Please check VITE_HENRIK_API_KEY.');
  }
  if (res.status === 404) {
    throw new Error('Riot ID not found. Please verify player Name#Tag format.');
  }
  if (res.status === 429) {
    throw new Error('Henrik API rate limit reached (429). Please wait a moment and retry.');
  }
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      errorBody.errors?.[0]?.message ||
      errorBody.message ||
      `Request failed with HTTP status ${res.status}`
    );
  }

  return res.json();
}

/**
 * Fetch Account Details via /valorant/v1/account/:name/:tag
 */
export async function fetchAccount(name, tag, apiKey = null) {
  const cleanName = name.trim();
  const cleanTag = tag.trim();
  const cacheKey = `${cleanName.toLowerCase()}#${cleanTag.toLowerCase()}`;

  if (accountCache.has(cacheKey)) {
    return accountCache.get(cacheKey);
  }

  return enqueueRequest(async () => {
    const res = await henrikFetch(
      `/valorant/v1/account/${encodeURIComponent(cleanName)}/${encodeURIComponent(cleanTag)}`,
      apiKey
    );

    if (!res || res.status !== 200 || !res.data) {
      throw new Error('Riot ID not found');
    }

    const data = res.data;
    const account = {
      puuid: data.puuid,
      name: data.name,
      tag: data.tag,
      riotId: `${data.name}#${data.tag}`,
      // Henrik returns region on account endpoint sometimes, default ap
      region: data.region?.toLowerCase() || DEFAULT_REGION,
      accountLevel: data.account_level || 1,
      cardSmall: data.card?.small || null,
      cardLarge: data.card?.large || null,
      cardWide: data.card?.wide || null,
    };

    accountCache.set(cacheKey, account);
    return account;
  });
}

/**
 * Fetch Rank (MMR) via /valorant/v3/mmr/:region/pc/:name/:tag
 * Returns a normalised rank object compatible with ProfileHeader.jsx
 */
export async function fetchRank(region = DEFAULT_REGION, name, tag, apiKey = null) {
  const cleanName = encodeURIComponent(name.trim());
  const cleanTag = encodeURIComponent(tag.trim());
  const targetRegion = (region || DEFAULT_REGION).toLowerCase();

  return enqueueRequest(async () => {
    try {
      const res = await henrikFetch(
        `/valorant/v3/mmr/${targetRegion}/pc/${cleanName}/${cleanTag}`,
        apiKey
      );

      if (res?.data) {
        const d = res.data;
        const current = d.current || {};
        const peak = d.peak || {};
        
        return {
          current_tier_patched: current.tier?.name || 'Unranked',
          ranking_in_tier: current.rr ?? 0,
          elo: current.elo ?? 0,
          images: {
            small: current.tier?.id ? `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${current.tier.id}/smallicon.png` : null,
            large: current.tier?.id ? `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${current.tier.id}/largeicon.png` : null,
          },
          seasonal: d.seasonal || [],
          highest_rank: {
            patched_tier: peak.tier?.name || 'Unranked',
            season: peak.season?.short || ''
          }
        };
      }
    } catch (err) {
      console.warn(`Could not fetch rank for ${name}#${tag}:`, err.message);
    }

    // Return safe default that ProfileHeader can display as "Unranked"
    return {
      current_tier_patched: 'Unranked',
      ranking_in_tier: 0,
      elo: 0,
      images: { small: null, large: null },
      seasonal: [],
      highest_rank: null,
    };
  });
}

/**
 * Fetch Match History via /valorant/v3/matches/:region/:name/:tag
 * Fetches up to 'size' recent matches (max 20 per Henrik free tier call).
 * For comprehensive history across seasons we make multiple paginated calls.
 */
export async function fetchMatches(region = DEFAULT_REGION, name, tag, mode = '', apiKey = null) {
  const cleanName = encodeURIComponent(name.trim());
  const cleanTag = encodeURIComponent(tag.trim());
  const targetRegion = (region || DEFAULT_REGION).toLowerCase();

  const mapMode = {
    competitive: 'competitive', ranked: 'competitive',
    unrated: 'unrated', swiftplay: 'swiftplay',
    deathmatch: 'deathmatch', 'team deathmatch': 'teamdeathmatch',
    teamdeathmatch: 'teamdeathmatch', 'spike rush': 'spikerush',
    spikerush: 'spikerush', premier: 'premier', escalation: 'escalation',
  };
  const normMode = mapMode[mode.trim().toLowerCase()] ?? mode.trim().toLowerCase();
  const modeParam = normMode ? `&mode=${normMode}` : '';
  
  let allMatches = [];
  let page = 0;
  let hasMore = true;

  while (hasMore && page < 5) {
    const endpoint = `/valorant/v3/matches/${targetRegion}/${cleanName}/${cleanTag}?size=20&page=${page}${modeParam}`;
    try {
      const res = await enqueueRequest(async () => henrikFetch(endpoint, apiKey));
      if (res?.data && Array.isArray(res.data)) {
        allMatches.push(...res.data);
        if (res.data.length < 20) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.warn(`Could not fetch matches page ${page} for ${name}#${tag}:`, err.message);
      hasMore = false;
    }
    page++;
  }
  return allMatches;
}

/**
 * Fetch stored MMR history via /valorant/v1/stored-mmr-history/:region/:name/:tag
 */
export async function fetchMMRHistory(region = DEFAULT_REGION, name, tag, apiKey = null) {
  const cleanName = encodeURIComponent(name.trim());
  const cleanTag = encodeURIComponent(tag.trim());
  const targetRegion = (region || DEFAULT_REGION).toLowerCase();

  return enqueueRequest(async () => {
    try {
      const res = await henrikFetch(
        `/valorant/v1/stored-mmr-history/${targetRegion}/${cleanName}/${cleanTag}`,
        apiKey
      );
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.warn(`Could not fetch MMR history for ${name}#${tag}:`, err.message);
    }
    return [];
  });
}

/**
 * Search account helper for autocomplete input
 */
export async function searchPlayerAccount(queryInput, apiKey = null) {
  const query = queryInput.trim();
  if (!query || query.length < 2) return [];

  if (query.includes('#')) {
    const [name, tag] = query.split('#');
    if (name.trim() && tag.trim()) {
      try {
        const acc = await fetchAccount(name.trim(), tag.trim(), apiKey);
        if (acc) return [acc];
      } catch (err) { }
    }
  }

  return [];
}
