/**
 * valorant-api.com Integration for Static Metadata
 * Fetches maps, agents, competitive tiers, and seasons metadata once and caches them in module scope.
 */

let mapsCache = null;
let agentsCache = null;
let tiersCache = null;
let seasonsCache = null;

const BASE_URL = 'https://valorant-api.com/v1';

// Comprehensive map of all Valorant Episode & Act UUIDs from Episode 1 through Episode 9 & Year 2026
export const ALL_VALORANT_SEASONS_MAP = {
  // Year 2026 (V26)
  '4f0864e2-40af-28a4-de2c-0e9e64e75f23': 'Year 2026: Act IV (Current)',
  '8102cd81-43a0-d0d7-bd59-47b8fe9bed1b': 'Year 2026: Act V',
  'd816f426-48ea-f052-117f-9697a155b319': 'Year 2026: Act VI',

  // Episode 9
  'aef237a0-494d-3a14-a1c8-ec8de84e309c': 'Episode 9: Act III',
  '16118998-4705-5813-86dd-0292a2439d90': 'Episode 9: Act II',
  '476b0893-4c2e-abd6-c5fe-708facff0772': 'Episode 9: Act I',

  // Episode 8
  'dcde7346-4085-de4f-c463-2489ed47983b': 'Episode 8: Act III',
  '292f58db-4c17-89a7-b1c0-ba988f0e9d98': 'Episode 8: Act II',
  '52ca6698-41c1-e7de-4008-8994d2221209': 'Episode 8: Act I',

  // Episode 7
  '4539cac3-47ae-90e5-3d01-b3812ca3274e': 'Episode 7: Act III',
  '22d10d66-4d2a-a340-6c54-408c7bd53807': 'Episode 7: Act II',
  'ec876e6c-43e8-fa63-ffc1-2e8d4db25525': 'Episode 7: Act I',

  // Episode 6
  '4401f9fd-4170-2e4c-4bc3-f3b4d7d150d1': 'Episode 6: Act III',
  '03dfd004-45d4-ebfd-ab0a-948ce780dac4': 'Episode 6: Act II',
  '0981a882-4e7d-371a-70c4-c3b4f46c504a': 'Episode 6: Act I',

  // Episode 5
  '2de5423b-4aad-02ad-8d9b-c0a931958861': 'Episode 5: Act III',
  '34093c29-4306-43de-452f-3f944bde22be': 'Episode 5: Act II',
  '9c91a445-4f78-1baa-a3ea-8f8aadf4914d': 'Episode 5: Act I',

  // Episode 4
  'aca29595-40e4-01f5-3f35-b1b3d304c96e': 'Episode 4: Act III',
  '7a85de9a-4032-61a9-61d8-f4aa2b4a84b6': 'Episode 4: Act II',
  '67e373c7-48f7-b422-641b-079ace30b427': 'Episode 4: Act I',

  // Episode 3
  '3e47230a-463c-a301-eb7d-67bb60357d4f': 'Episode 3: Act III',
  'd929bc38-4ab6-7da4-94f0-ee84f8ac141e': 'Episode 3: Act II',
  '573f53ac-41a5-3a7d-d9ce-d6a6298e5704': 'Episode 3: Act I',

  // Episode 2
  'a16955a5-4ad0-f761-5e9e-389df1c892fb': 'Episode 2: Act III',
  '4cb622e1-4244-6da3-7276-8daaf1c01be2': 'Episode 2: Act II',
  '2a27e5d2-4d30-c9e2-b15a-93b8909a442c': 'Episode 2: Act I',

  // Episode 1
  '46ea6166-4573-1128-9cea-60a15640059b': 'Episode 1: Act III',
  '0530b9c4-4980-f2ee-df5d-09864cd00542': 'Episode 1: Act II',
  '3f61c772-4560-cd3f-5d3f-a7ab5abda6b3': 'Episode 1: Act I',
};

export async function getValorantMaps() {
  if (mapsCache) return mapsCache;

  try {
    const res = await fetch(`${BASE_URL}/maps`);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching maps`);
    const data = await res.json();
    mapsCache = data.data || [];
    return mapsCache;
  } catch (err) {
    console.error('Error in getValorantMaps:', err);
    return [];
  }
}

export async function getValorantAgents() {
  if (agentsCache) return agentsCache;

  try {
    const res = await fetch(`${BASE_URL}/agents?isPlayableCharacter=true`);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching agents`);
    const data = await res.json();
    agentsCache = data.data || [];
    return agentsCache;
  } catch (err) {
    console.error('Error in getValorantAgents:', err);
    return [];
  }
}

export async function getCompetitiveTiers() {
  if (tiersCache) return tiersCache;

  try {
    const res = await fetch(`${BASE_URL}/competitivetiers`);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching competitive tiers`);
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      const latestTierSet = data.data[data.data.length - 1];
      tiersCache = latestTierSet.tiers || [];
    } else {
      tiersCache = [];
    }
    return tiersCache;
  } catch (err) {
    console.error('Error in getCompetitiveTiers:', err);
    return [];
  }
}

export async function getValorantSeasons() {
  if (seasonsCache) return seasonsCache;

  try {
    const res = await fetch(`${BASE_URL}/seasons`);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching seasons`);
    const data = await res.json();
    seasonsCache = data.data || [];
    return seasonsCache;
  } catch (err) {
    console.error('Error in getValorantSeasons:', err);
    return [];
  }
}

// Resolves season UUID to human readable label across all Episodes & Acts
export function resolveSeasonName(seasonId, seasonsList = []) {
  if (!seasonId) return 'Current Season';
  const lowerId = seasonId.toLowerCase();

  if (ALL_VALORANT_SEASONS_MAP[lowerId]) {
    return ALL_VALORANT_SEASONS_MAP[lowerId];
  }

  const found = seasonsList.find((s) => s.uuid?.toLowerCase() === lowerId);
  if (found) {
    return found.displayName || seasonId;
  }

  return seasonId;
}
