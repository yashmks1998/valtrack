// Mock data generator for offline / Demo Mode

export const DEMO_PLAYERS = [
  {
    puuid: 'mock-puuid-tenz',
    name: 'TenZ',
    tag: 'SEN',
    riotId: 'TenZ#SEN',
    region: 'na',
    accountLevel: 342,
    cardWide: 'https://media.valorant-api.com/playercards/9fb348bc-4141-91a5-8a4e-3796d194c25f/wideart.png',
    cardSmall: 'https://media.valorant-api.com/playercards/9fb348bc-4141-91a5-8a4e-3796d194c25f/displayicon.png',
    rank: {
      currentTierName: 'Radiant',
      tier: 27,
      rankingInTier: 450,
      elo: 2450,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/27/largeicon.png'
    }
  },
  {
    puuid: 'mock-puuid-zekken',
    name: 'zekken',
    tag: 'SEN',
    riotId: 'zekken#SEN',
    region: 'na',
    accountLevel: 289,
    cardWide: 'https://media.valorant-api.com/playercards/fc99571d-407a-9c71-0676-e883b6fa6203/wideart.png',
    cardSmall: 'https://media.valorant-api.com/playercards/fc99571d-407a-9c71-0676-e883b6fa6203/displayicon.png',
    rank: {
      currentTierName: 'Radiant',
      tier: 27,
      rankingInTier: 380,
      elo: 2380,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/27/largeicon.png'
    }
  },
  {
    puuid: 'mock-puuid-tarik',
    name: 'tarik',
    tag: 'NA1',
    riotId: 'tarik#NA1',
    region: 'na',
    accountLevel: 412,
    cardWide: 'https://media.valorant-api.com/playercards/b382d64f-4d33-469b-83c7-8f921f92e448/wideart.png',
    cardSmall: 'https://media.valorant-api.com/playercards/b382d64f-4d33-469b-83c7-8f921f92e448/displayicon.png',
    rank: {
      currentTierName: 'Immortal 3',
      tier: 26,
      rankingInTier: 210,
      elo: 1950,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/26/largeicon.png'
    }
  },
  {
    puuid: 'mock-puuid-kyedae',
    name: 'Kyedae',
    tag: '3333',
    riotId: 'Kyedae#3333',
    region: 'na',
    accountLevel: 195,
    cardWide: 'https://media.valorant-api.com/playercards/6020521e-450f-2b73-05c0-fbb5f71e4695/wideart.png',
    cardSmall: 'https://media.valorant-api.com/playercards/6020521e-450f-2b73-05c0-fbb5f71e4695/displayicon.png',
    rank: {
      currentTierName: 'Ascendant 2',
      tier: 22,
      rankingInTier: 65,
      elo: 1525,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/22/largeicon.png'
    }
  }
];

// Helper to construct realistic Henrik-compatible match objects
function createMockMatch(id, mapName, mode, dateStr, teamWon, squadPlayersStats) {
  const redWon = teamWon;
  const redScore = teamWon ? 13 : Math.floor(Math.random() * 5) + 7;
  const blueScore = teamWon ? Math.floor(Math.random() * 5) + 7 : 13;

  const allPlayers = squadPlayersStats.map((sp) => ({
    puuid: sp.puuid,
    name: sp.name,
    tag: sp.tag,
    team: 'Red',
    character: sp.agent,
    assets: {
      agent: {
        small: `https://media.valorant-api.com/agents/${sp.agentId}/displayicon.png`,
        full: `https://media.valorant-api.com/agents/${sp.agentId}/fullportrait.png`
      }
    },
    stats: {
      score: sp.score,
      kills: sp.kills,
      deaths: sp.deaths,
      assists: sp.assists,
      bodyshots: 24,
      headshots: 18,
      legshots: 2,
    }
  }));

  return {
    metadata: {
      matchid: id,
      map: mapName,
      game_start_patched: dateStr,
      mode: mode,
      rounds_played: redScore + blueScore,
    },
    teams: {
      red: { has_won: redWon, rounds_won: redScore, rounds_lost: blueScore },
      blue: { has_won: !redWon, rounds_won: blueScore, rounds_lost: redScore }
    },
    players: {
      all_players: allPlayers,
    }
  };
}

export const DEMO_MATCHES = [
  // Ascent - Strong Win rate for TenZ & zekken & tarik
  createMockMatch('m-ascent-1', 'Ascent', 'Competitive', '2 hours ago', true, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 26, deaths: 12, assists: 4, score: 320 },
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'Sova', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 19, deaths: 10, assists: 11, score: 265 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Omen', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 16, deaths: 13, assists: 8, score: 215 },
  ]),
  createMockMatch('m-ascent-2', 'Ascent', 'Competitive', 'Yesterday', true, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Yoru', agentId: '7f23dc60-449e-96e3-79e8-e7bfd3e33d74', kills: 24, deaths: 14, assists: 5, score: 290 },
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'KAY/O', agentId: '60144611-4978-d92b-98ee-049f47d22342', kills: 22, deaths: 11, assists: 9, score: 275 },
    { puuid: 'mock-puuid-kyedae', name: 'Kyedae', tag: '3333', agent: 'Killjoy', agentId: '1e58d92b-49cb-fb3a-45e6-89235e4f196d', kills: 14, deaths: 12, assists: 6, score: 190 },
  ]),
  createMockMatch('m-ascent-3', 'Ascent', 'Competitive', '3 days ago', true, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 28, deaths: 9, assists: 3, score: 345 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 20, deaths: 15, assists: 7, score: 250 },
  ]),

  // Bind - Mixed Results
  createMockMatch('m-bind-1', 'Bind', 'Competitive', '4 hours ago', true, [
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 25, deaths: 13, assists: 6, score: 310 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Brimstone', agentId: '9f072be4-4513-a051-d48a-72782e44d56d', kills: 17, deaths: 14, assists: 12, score: 220 },
    { puuid: 'mock-puuid-kyedae', name: 'Kyedae', tag: '3333', agent: 'Viper', agentId: '70773516-4975-158a-3259-d4a4514d2ba0', kills: 12, deaths: 16, assists: 8, score: 170 },
  ]),
  createMockMatch('m-bind-2', 'Bind', 'Competitive', '2 days ago', false, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 18, deaths: 17, assists: 3, score: 230 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Skye', agentId: '6f2a04ca-43e0-be17-7f36-b0908d423b46', kills: 12, deaths: 18, assists: 9, score: 180 },
  ]),

  // Lotus - High Win Rate
  createMockMatch('m-lotus-1', 'Lotus', 'Competitive', '5 hours ago', true, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Omen', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 23, deaths: 11, assists: 10, score: 295 },
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 27, deaths: 10, assists: 7, score: 330 },
    { puuid: 'mock-puuid-kyedae', name: 'Kyedae', tag: '3333', agent: 'Fade', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 15, deaths: 12, assists: 14, score: 210 },
  ]),
  createMockMatch('m-lotus-2', 'Lotus', 'Competitive', '3 days ago', true, [
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'Neon', agentId: 'bb2a4828-46eb-8cd1-e765-15848195d751', kills: 29, deaths: 12, assists: 5, score: 360 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Breach', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 18, deaths: 13, assists: 15, score: 240 },
  ]),

  // Haven - Strategic Dominance
  createMockMatch('m-haven-1', 'Haven', 'Competitive', '1 day ago', true, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 31, deaths: 10, assists: 2, score: 385 },
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'Sova', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 18, deaths: 9, assists: 13, score: 250 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Astra', agentId: '41fb69c1-4189-7b37-f117-bcaf1e96f1bf', kills: 14, deaths: 11, assists: 12, score: 200 },
  ]),
  createMockMatch('m-haven-2', 'Haven', 'Competitive', '4 days ago', true, [
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 23, deaths: 15, assists: 4, score: 280 },
    { puuid: 'mock-puuid-kyedae', name: 'Kyedae', tag: '3333', agent: 'Sage', agentId: '56404661-4044-a488-8677-2a607044856e', kills: 16, deaths: 13, assists: 10, score: 205 },
  ]),

  // Sunset - Tough Map
  createMockMatch('m-sunset-1', 'Sunset', 'Competitive', '2 days ago', false, [
    { puuid: 'mock-puuid-tenz', name: 'TenZ', tag: 'SEN', agent: 'Yoru', agentId: '7f23dc60-449e-96e3-79e8-e7bfd3e33d74', kills: 19, deaths: 18, assists: 3, score: 220 },
    { puuid: 'mock-puuid-zekken', name: 'zekken', tag: 'SEN', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 16, deaths: 19, assists: 4, score: 205 },
    { puuid: 'mock-puuid-tarik', name: 'tarik', tag: 'NA1', agent: 'Cypher', agentId: '1170edd1-409d-61b4-ffd7-96a42aa1a9ed', kills: 11, deaths: 17, assists: 5, score: 160 },
  ]),
];
