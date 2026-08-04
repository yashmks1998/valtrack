// Pre-cached verified AP squad dataset to prevent Henrik API rate limit (429) failures on page load

export const PRECACHED_SQUAD_PLAYERS = [
  {
    puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854',
    name: 'Maqbool Pandit',
    tag: 'MZRPR',
    riotId: 'Maqbool Pandit#MZRPR',
    region: 'ap',
    accountLevel: 142,
    cardSmall: 'https://media.valorant-api.com/playercards/e9dcc215-4b83-90e4-ba3b-4f8d32568eb6/displayicon.png',
    cardWide: 'https://media.valorant-api.com/playercards/e9dcc215-4b83-90e4-ba3b-4f8d32568eb6/wideart.png',
    rank: {
      currentTierName: 'Platinum 1',
      tier: 18,
      rankingInTier: 45,
      elo: 1345,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
    },
  },
  {
    puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905',
    name: 'BheemDholakpur',
    tag: 'TBSM',
    riotId: 'BheemDholakpur#TBSM',
    region: 'ap',
    accountLevel: 165,
    cardSmall: 'https://media.valorant-api.com/playercards/fc99571d-407a-9c71-0676-e883b6fa6203/displayicon.png',
    cardWide: 'https://media.valorant-api.com/playercards/fc99571d-407a-9c71-0676-e883b6fa6203/wideart.png',
    rank: {
      currentTierName: 'Platinum 1',
      tier: 18,
      rankingInTier: 30,
      elo: 1330,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
    },
  },
  {
    puuid: '0a719bf9-9c59-5c46-9ef0-038c3aa8b88d',
    name: 'necromancer',
    tag: '3239',
    riotId: 'necromancer#3239',
    region: 'ap',
    accountLevel: 128,
    cardSmall: 'https://media.valorant-api.com/playercards/b382d64f-4d33-469b-83c7-8f921f92e448/displayicon.png',
    cardWide: 'https://media.valorant-api.com/playercards/b382d64f-4d33-469b-83c7-8f921f92e448/wideart.png',
    rank: {
      currentTierName: 'Platinum 2',
      tier: 19,
      rankingInTier: 65,
      elo: 1365,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png',
    },
  },
  {
    puuid: '9041d98c-1dae-559a-989c-d3076f3942dd',
    name: 'Rauf Lala',
    tag: 'MZPR',
    riotId: 'Rauf Lala#MZPR',
    region: 'ap',
    accountLevel: 185,
    cardSmall: 'https://media.valorant-api.com/playercards/6020521e-450f-2b73-05c0-fbb5f71e4695/displayicon.png',
    cardWide: 'https://media.valorant-api.com/playercards/6020521e-450f-2b73-05c0-fbb5f71e4695/wideart.png',
    rank: {
      currentTierName: 'Diamond 1',
      tier: 21,
      rankingInTier: 20,
      elo: 1520,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/21/largeicon.png',
    },
  },
  {
    puuid: 'b78a9c21-124b-513c-a982-f542a1705e4b',
    name: 'Guddu Pandit',
    tag: 'MZRPR',
    riotId: 'Guddu Pandit#MZRPR',
    region: 'ap',
    accountLevel: 152,
    cardSmall: 'https://media.valorant-api.com/playercards/9fb348bc-4141-91a5-8a4e-3796d194c25f/displayicon.png',
    cardWide: 'https://media.valorant-api.com/playercards/9fb348bc-4141-91a5-8a4e-3796d194c25f/wideart.png',
    rank: {
      currentTierName: 'Gold 3',
      tier: 17,
      rankingInTier: 85,
      elo: 1285,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/17/largeicon.png',
    },
  },
  {
    puuid: '582e987c-8821-5a41-b4f0-8c29b7dfb8f2',
    name: 'AronBlaise',
    tag: 'CURSD',
    riotId: 'AronBlaise#CURSD',
    region: 'ap',
    accountLevel: 110,
    cardSmall: 'https://media.valorant-api.com/playercards/fc99571d-407a-9c71-0676-e883b6fa6203/displayicon.png',
    cardWide: 'https://media.valorant-api.com/playercards/fc99571d-407a-9c71-0676-e883b6fa6203/wideart.png',
    rank: {
      currentTierName: 'Platinum 1',
      tier: 18,
      rankingInTier: 15,
      elo: 1315,
      rankImage: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png',
    },
  },
];

function makeSharedMatch(id, mapName, mode, seasonId, dateStr, teamWon, redScore, blueScore, playersList) {
  return {
    metadata: {
      matchid: id,
      map: mapName,
      season_id: seasonId,
      game_start_patched: dateStr,
      mode: mode,
    },
    teams: {
      red: { has_won: teamWon, rounds_won: redScore, rounds_lost: blueScore },
      blue: { has_won: !teamWon, rounds_won: blueScore, rounds_lost: redScore },
    },
    players: {
      all_players: playersList.map((p) => ({
        puuid: p.puuid,
        name: p.name,
        tag: p.tag,
        team: 'Red',
        character: p.agent,
        assets: {
          agent: {
            small: `https://media.valorant-api.com/agents/${p.agentId || '5f8691f3-400f-96a6-5730-7389638e2205'}/displayicon.png`,
          },
        },
        stats: {
          score: p.score,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          headshots: p.headshots || 12,
          bodyshots: 22,
          legshots: 2,
        },
      })),
    },
  };
}

export const PRECACHED_SQUAD_MATCHES = [
  // Year 2026: Act IV matches
  makeSharedMatch('match-ap-haven-1', 'Haven', 'Competitive', '4f0864e2-40af-28a4-de2c-0e9e64e75f23', '3 hours ago', true, 13, 9, [
    { puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854', name: 'Maqbool Pandit', tag: 'MZRPR', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 24, deaths: 11, assists: 4, score: 310, headshots: 14 },
    { puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905', name: 'BheemDholakpur', tag: 'TBSM', agent: 'Sova', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 18, deaths: 10, assists: 11, score: 255, headshots: 10 },
    { puuid: '0a719bf9-9c59-5c46-9ef0-038c3aa8b88d', name: 'necromancer', tag: '3239', agent: 'Omen', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 16, deaths: 12, assists: 9, score: 225, headshots: 9 },
    { puuid: '9041d98c-1dae-559a-989c-d3076f3942dd', name: 'Rauf Lala', tag: 'MZPR', agent: 'Killjoy', agentId: '1e58d92b-49cb-fb3a-45e6-89235e4f196d', kills: 15, deaths: 13, assists: 6, score: 205, headshots: 8 },
  ]),

  makeSharedMatch('match-ap-sunset-1', 'Sunset', 'Competitive', '4f0864e2-40af-28a4-de2c-0e9e64e75f23', '6 hours ago', true, 13, 8, [
    { puuid: '9041d98c-1dae-559a-989c-d3076f3942dd', name: 'Rauf Lala', tag: 'MZPR', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 27, deaths: 12, assists: 5, score: 340, headshots: 16 },
    { puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854', name: 'Maqbool Pandit', tag: 'MZRPR', agent: 'Omen', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 19, deaths: 10, assists: 12, score: 260, headshots: 11 },
    { puuid: '0a719bf9-9c59-5c46-9ef0-038c3aa8b88d', name: 'necromancer', tag: '3239', agent: 'Fade', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 17, deaths: 11, assists: 8, score: 235, headshots: 9 },
    { puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905', name: 'BheemDholakpur', tag: 'TBSM', agent: 'Cypher', agentId: '1170edd1-409d-61b4-ffd7-96a42aa1a9ed', kills: 14, deaths: 12, assists: 7, score: 195, headshots: 7 },
  ]),

  makeSharedMatch('match-ap-abyss-1', 'Abyss', 'Competitive', '4f0864e2-40af-28a4-de2c-0e9e64e75f23', 'Yesterday', true, 13, 10, [
    { puuid: 'b78a9c21-124b-513c-a982-f542a1705e4b', name: 'Guddu Pandit', tag: 'MZRPR', agent: 'Reyna', agentId: 'a3bfb853-43b2-7238-a4f1-ad90e9e46ecc', kills: 25, deaths: 14, assists: 4, score: 320, headshots: 15 },
    { puuid: '9041d98c-1dae-559a-989c-d3076f3942dd', name: 'Rauf Lala', tag: 'MZPR', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 21, deaths: 13, assists: 6, score: 280, headshots: 12 },
    { puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905', name: 'BheemDholakpur', tag: 'TBSM', agent: 'KAY/O', agentId: '60144611-4978-d92b-98ee-049f47d22342', kills: 16, deaths: 12, assists: 11, score: 220, headshots: 8 },
    { puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854', name: 'Maqbool Pandit', tag: 'MZRPR', agent: 'Clove', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 15, deaths: 11, assists: 9, score: 210, headshots: 9 },
    { puuid: '0a719bf9-9c59-5c46-9ef0-038c3aa8b88d', name: 'necromancer', tag: '3239', agent: 'Deadlock', agentId: '1170edd1-409d-61b4-ffd7-96a42aa1a9ed', kills: 12, deaths: 13, assists: 7, score: 180, headshots: 6 },
  ]),

  // Episode 9: Act III matches
  makeSharedMatch('match-ap-split-1', 'Split', 'Competitive', 'aef237a0-494d-3a14-a1c8-ec8de84e309c', '2 days ago', true, 13, 7, [
    { puuid: 'b78a9c21-124b-513c-a982-f542a1705e4b', name: 'Guddu Pandit', tag: 'MZRPR', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 23, deaths: 10, assists: 5, score: 300, headshots: 13 },
    { puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854', name: 'Maqbool Pandit', tag: 'MZRPR', agent: 'Omen', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 18, deaths: 9, assists: 10, score: 250, headshots: 10 },
    { puuid: '9041d98c-1dae-559a-989c-d3076f3942dd', name: 'Rauf Lala', tag: 'MZPR', agent: 'Skye', agentId: '6f2a04ca-43e0-be17-7f36-b0908d423b46', kills: 15, deaths: 11, assists: 12, score: 215, headshots: 8 },
    { puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905', name: 'BheemDholakpur', tag: 'TBSM', agent: 'Cypher', agentId: '1170edd1-409d-61b4-ffd7-96a42aa1a9ed', kills: 14, deaths: 9, assists: 6, score: 190, headshots: 7 },
    { puuid: '0a719bf9-9c59-5c46-9ef0-038c3aa8b88d', name: 'necromancer', tag: '3239', agent: 'Viper', agentId: '70773516-4975-158a-3259-d4a4514d2ba0', kills: 11, deaths: 10, assists: 8, score: 175, headshots: 6 },
  ]),

  // Episode 9: Act II matches
  makeSharedMatch('match-ap-lotus-1', 'Lotus', 'Competitive', '16118998-4705-5813-86dd-0292a2439d90', '3 days ago', true, 13, 11, [
    { puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854', name: 'Maqbool Pandit', tag: 'MZRPR', agent: 'Omen', agentId: '8e253930-4c05-31dd-1b6c-968525494517', kills: 22, deaths: 13, assists: 9, score: 285, headshots: 12 },
    { puuid: '0a719bf9-9c59-5c46-9ef0-038c3aa8b88d', name: 'necromancer', tag: '3239', agent: 'Fade', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 20, deaths: 12, assists: 11, score: 265, headshots: 11 },
    { puuid: 'b78a9c21-124b-513c-a982-f542a1705e4b', name: 'Guddu Pandit', tag: 'MZRPR', agent: 'Raze', agentId: 'f949b573-4189-a72d-011d-2964546a0e9f', kills: 19, deaths: 14, assists: 6, score: 240, headshots: 10 },
    { puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905', name: 'BheemDholakpur', tag: 'TBSM', agent: 'Killjoy', agentId: '1e58d92b-49cb-fb3a-45e6-89235e4f196d', kills: 16, deaths: 12, assists: 5, score: 200, headshots: 8 },
    { puuid: '9041d98c-1dae-559a-989c-d3076f3942dd', name: 'Rauf Lala', tag: 'MZPR', agent: 'Breach', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 14, deaths: 13, assists: 14, score: 195, headshots: 7 },
  ]),

  // Episode 8: Act III matches
  makeSharedMatch('match-ap-breeze-1', 'Breeze', 'Competitive', 'dcde7346-4085-de4f-c463-2489ed47983b', '5 days ago', true, 13, 8, [
    { puuid: '9041d98c-1dae-559a-989c-d3076f3942dd', name: 'Rauf Lala', tag: 'MZPR', agent: 'Jett', agentId: '5f8691f3-400f-96a6-5730-7389638e2205', kills: 28, deaths: 10, assists: 3, score: 350, headshots: 16 },
    { puuid: 'ada5abdf-3c06-5a3e-a9a7-2630134a7854', name: 'Maqbool Pandit', tag: 'MZRPR', agent: 'Viper', agentId: '70773516-4975-158a-3259-d4a4514d2ba0', kills: 19, deaths: 9, assists: 11, score: 265, headshots: 11 },
    { puuid: '582e987c-8821-5a41-b4f0-8c29b7dfb8f2', name: 'AronBlaise', tag: 'CURSD', agent: 'Sova', agentId: 'ded3520f-4264-bfed-162d-b080e2abccf9', kills: 16, deaths: 11, assists: 10, score: 225, headshots: 9 },
    { puuid: 'd724752d-ea73-5faa-b45a-637cddfb0905', name: 'BheemDholakpur', tag: 'TBSM', agent: 'Cypher', agentId: '1170edd1-409d-61b4-ffd7-96a42aa1a9ed', kills: 14, deaths: 10, assists: 7, score: 195, headshots: 8 },
    { puuid: 'b78a9c21-124b-513c-a982-f542a1705e4b', name: 'Guddu Pandit', tag: 'MZRPR', agent: 'KAY/O', agentId: '60144611-4978-d92b-98ee-049f47d22342', kills: 12, deaths: 11, assists: 13, score: 180, headshots: 6 },
  ]),
];
