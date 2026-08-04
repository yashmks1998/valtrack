// Henrik Dev API Wrapper with Rate-Limit Queue & Staggering

const HENRIK_BASE_URL = 'https://api.henrikdev.xyz';
const DEFAULT_API_KEY = 'HDEV-f931b513-abaf-4287-a229-e051a2a577ea';
const DEFAULT_REGION = 'ap';

// Module-level account cache
const accountCache = new Map();

// Queue manager for staggering API requests by 350ms to prevent HTTP 429 rate limit
let requestQueue = Promise.resolve();
const STAGGER_MS = 350;

function enqueueRequest(fn) {
  const result = requestQueue.then(async () => {
    await new Promise((resolve) => setTimeout(resolve, STAGGER_MS));
    return fn();
  });
  requestQueue = result.catch(() => {}); // prevent queue breakage on error
  return result;
}

/**
 * Base fetcher wrapper with error handling and rate limit detection
 */
async function henrikFetch(endpoint, apiKeyOverride = null) {
  const apiKey = apiKeyOverride || import.meta.env.VITE_HENRIK_API_KEY || DEFAULT_API_KEY;

  const headers = {
    'Content-Type': 'application/json',
  };
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
    throw new Error('Henrik API rate limit reached (429). Retrying shortly...');
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.errors?.[0]?.message || `Request failed with HTTP status ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch Account Details
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
      region: data.region || DEFAULT_REGION,
      accountLevel: data.account_level || 1,
      cardSmall: data.card?.small || null,
      cardLarge: data.card?.large || null,
      cardWide: data.card?.wide || null,
      lastUpdate: data.last_update || null,
    };

    accountCache.set(cacheKey, account);
    return account;
  });
}

/**
 * Fetch Rank (MMR)
 */
export async function fetchRank(region = DEFAULT_REGION, name, tag, apiKey = null) {
  const cleanName = encodeURIComponent(name.trim());
  const cleanTag = encodeURIComponent(tag.trim());
  const targetRegion = (region || DEFAULT_REGION).toLowerCase();

  return enqueueRequest(async () => {
    try {
      const res = await henrikFetch(`/valorant/v2/mmr/${targetRegion}/${cleanName}/${cleanTag}`, apiKey);
      if (res && res.data && res.data.current_data) {
        const curr = res.data.current_data;
        return {
          currentTierName: curr.currenttierpatched || 'Unranked',
          tier: curr.currenttier || 0,
          rankingInTier: curr.ranking_in_tier || 0,
          elo: curr.elo || 0,
          rankImage: curr.images?.small || curr.images?.large || null,
        };
      }
    } catch (err) {
      console.warn(`Could not fetch rank for ${name}#${tag}:`, err.message);
    }
    return {
      currentTierName: 'Unranked',
      tier: 0,
      rankingInTier: 0,
      elo: 0,
      rankImage: null,
    };
  });
}

/**
 * Fetch Match History
 */
export async function fetchMatches(region = DEFAULT_REGION, name, tag, mode = '', apiKey = null) {
  const cleanName = encodeURIComponent(name.trim());
  const cleanTag = encodeURIComponent(tag.trim());
  const targetRegion = (region || DEFAULT_REGION).toLowerCase();
  const modeQuery = mode ? `?mode=${mode}&size=20` : `?size=20`;

  return enqueueRequest(async () => {
    try {
      const res = await henrikFetch(`/valorant/v3/matches/${targetRegion}/${cleanName}/${cleanTag}${modeQuery}`, apiKey);
      if (res && res.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (err) {
      console.warn(`Could not fetch matches for ${name}#${tag}:`, err.message);
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
        const acc = await fetchAccount(name, tag, apiKey);
        if (acc) return [acc];
      } catch (err) {}
    }
  }

  // AP pro fallback candidates for instant search response
  const apTags = ['SEN', 'PRX', 'GEN', 'DRX', 'BLEED', 'Talon', 'RRQ', '111'];
  const matches = [];

  for (const tag of apTags) {
    try {
      const acc = await fetchAccount(query, tag, apiKey);
      if (acc && !matches.some((m) => m.puuid === acc.puuid)) {
        matches.push(acc);
      }
      if (matches.length >= 2) break;
    } catch (err) {}
  }

  return matches;
}
