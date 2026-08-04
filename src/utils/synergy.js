/**
 * Pure functions to compute Valorant player synergy, map performance, and duo statistics.
 */

/**
 * Filter matches to find games where at least 2 of the provided players participated on the same team.
 */
export function findSharedMatches(players, allMatches) {
  if (!players || players.length < 2 || !allMatches || allMatches.length === 0) {
    return [];
  }

  const playerPuuids = new Set(players.map((p) => p.puuid.toLowerCase()));

  const sharedMatchesMap = new Map();

  allMatches.forEach((match) => {
    if (!match || !match.metadata || !match.players || !match.players.all_players) {
      return;
    }

    const matchId = match.metadata.matchid;
    if (sharedMatchesMap.has(matchId)) return; // Avoid duplication

    // Find squad members present in this match
    const presentSquadMembers = match.players.all_players.filter((p) =>
      playerPuuids.has(p.puuid?.toLowerCase())
    );

    // Synergy requires 2+ squad members in the same game
    if (presentSquadMembers.length >= 2) {
      // Determine if they were on the same team (Red or Blue)
      const teams = new Set(presentSquadMembers.map((m) => m.team?.toLowerCase()));
      
      // If all present squad members share the same team:
      if (teams.size === 1) {
        const teamColor = Array.from(teams)[0];
        const teamWinObj = match.teams?.[teamColor];
        const hasWon = teamWinObj?.has_won ?? false;

        sharedMatchesMap.set(matchId, {
          match,
          mapName: match.metadata.map || 'Unknown Map',
          gameStart: match.metadata.game_start_patched || 'Recent',
          mode: match.metadata.mode || 'Competitive',
          hasWon,
          squadMembers: presentSquadMembers,
        });
      }
    }
  });

  return Array.from(sharedMatchesMap.values());
}

/**
 * Calculate map synergy statistics across all shared matches.
 * Returns an array of map objects sorted by total shared matches & win rate.
 */
export function computeMapSynergy(players, allMatches, mapsMetadata = []) {
  const sharedMatches = findSharedMatches(players, allMatches);

  if (sharedMatches.length === 0) {
    return [];
  }

  // Map metadata lookup map (case insensitive)
  const metaMap = new Map();
  mapsMetadata.forEach((m) => {
    if (m.displayName) metaMap.set(m.displayName.toLowerCase(), m);
  });

  // Group shared matches by map
  const mapGroups = {};

  sharedMatches.forEach((sm) => {
    const rawMap = sm.mapName;
    const mapKey = rawMap.toLowerCase();

    if (!mapGroups[mapKey]) {
      const meta = metaMap.get(mapKey);
      mapGroups[mapKey] = {
        mapName: rawMap,
        displayName: meta?.displayName || rawMap,
        splashImage: meta?.splash || meta?.listViewIcon || null,
        displayIcon: meta?.displayIcon || null,
        matches: [],
        wins: 0,
        losses: 0,
        playerMapStats: {}, // puuid -> { kills, deaths, assists, score, games, agents: {} }
      };
    }

    const group = mapGroups[mapKey];
    group.matches.push(sm);
    if (sm.hasWon) group.wins++;
    else group.losses++;

    // Accumulate individual player stats for this map
    sm.squadMembers.forEach((sp) => {
      const pKey = sp.puuid.toLowerCase();
      if (!group.playerMapStats[pKey]) {
        const matchingPlayer = players.find((p) => p.puuid.toLowerCase() === pKey);
        group.playerMapStats[pKey] = {
          puuid: sp.puuid,
          name: sp.name || matchingPlayer?.name || 'Player',
          tag: sp.tag || matchingPlayer?.tag || '',
          riotId: matchingPlayer?.riotId || `${sp.name}#${sp.tag}`,
          kills: 0,
          deaths: 0,
          assists: 0,
          score: 0,
          games: 0,
          wins: 0,
          agentUsage: {}, // agentName -> count
          agentIcons: {},
        };
      }

      const pStat = group.playerMapStats[pKey];
      pStat.games++;
      if (sm.hasWon) pStat.wins++;

      const stats = sp.stats || {};
      pStat.kills += stats.kills || 0;
      pStat.deaths += stats.deaths || 0;
      pStat.assists += stats.assists || 0;
      pStat.score += stats.score || 0;

      const agentName = sp.character || 'Unknown';
      pStat.agentUsage[agentName] = (pStat.agentUsage[agentName] || 0) + 1;
      if (sp.assets?.agent?.small) {
        pStat.agentIcons[agentName] = sp.assets.agent.small;
      }
    });
  });

  // Calculate averages and top performers for each map
  const results = Object.values(mapGroups).map((mapData) => {
    const totalMatches = mapData.matches.length;
    const winRate = totalMatches > 0 ? Math.round((mapData.wins / totalMatches) * 100) : 0;

    let totalSquadScore = 0;
    let totalSquadKills = 0;
    let totalSquadDeaths = 0;
    let totalSquadAssists = 0;
    let totalPlayerMatchEntries = 0;

    const playerList = Object.values(mapData.playerMapStats).map((ps) => {
      const avgAcs = ps.games > 0 ? Math.round(ps.score / ps.games) : 0;
      const avgKdaRatio =
        ps.deaths > 0
          ? ((ps.kills + ps.assists) / ps.deaths).toFixed(2)
          : (ps.kills + ps.assists).toFixed(2);

      totalSquadScore += ps.score;
      totalSquadKills += ps.kills;
      totalSquadDeaths += ps.deaths;
      totalSquadAssists += ps.assists;
      totalPlayerMatchEntries += ps.games;

      // Find top used agent
      let topAgent = 'Unknown';
      let maxAgentCount = 0;
      Object.entries(ps.agentUsage).forEach(([agent, count]) => {
        if (count > maxAgentCount) {
          maxAgentCount = count;
          topAgent = agent;
        }
      });

      return {
        ...ps,
        avgAcs,
        kdaRatio: parseFloat(avgKdaRatio),
        avgKills: (ps.kills / ps.games).toFixed(1),
        avgDeaths: (ps.deaths / ps.games).toFixed(1),
        avgAssists: (ps.assists / ps.games).toFixed(1),
        topAgent,
        topAgentIcon: ps.agentIcons[topAgent] || null,
        winRate: Math.round((ps.wins / ps.games) * 100),
      };
    });

    // Sort players on this map by avg ACS (descending)
    playerList.sort((a, b) => b.avgAcs - a.avgAcs);

    const squadAvgAcs =
      totalPlayerMatchEntries > 0 ? Math.round(totalSquadScore / totalPlayerMatchEntries) : 0;
    const squadKdaRatio =
      totalSquadDeaths > 0
        ? ((totalSquadKills + totalSquadAssists) / totalSquadDeaths).toFixed(2)
        : (totalSquadKills + totalSquadAssists).toFixed(2);

    return {
      mapName: mapData.mapName,
      displayName: mapData.displayName,
      splashImage: mapData.splashImage,
      displayIcon: mapData.displayIcon,
      totalMatches,
      wins: mapData.wins,
      losses: mapData.losses,
      winRate,
      squadAvgAcs,
      squadKdaRatio,
      players: playerList,
      bestPlayer: playerList[0] || null, // Map MVP
      matches: mapData.matches,
    };
  });

  // Sort maps by highest win rate and then total games
  results.sort((a, b) => b.winRate - a.winRate || b.totalMatches - a.totalMatches);

  return results;
}

/**
 * Compute pair head-to-head synergy statistics between 2 selected players
 */
export function computePairSynergy(player1Puuid, player2Puuid, allMatches, players, mapsMetadata = []) {
  if (!player1Puuid || !player2Puuid || player1Puuid === player2Puuid) {
    return null;
  }

  const p1 = players.find((p) => p.puuid === player1Puuid);
  const p2 = players.find((p) => p.puuid === player2Puuid);

  if (!p1 || !p2) return null;

  const sharedMatches = findSharedMatches([p1, p2], allMatches);

  if (sharedMatches.length === 0) {
    return {
      p1,
      p2,
      totalSharedMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      mapBreakdown: [],
      bestMap: null,
      worstMap: null,
    };
  }

  let wins = 0;
  let losses = 0;
  let p1TotalScore = 0;
  let p2TotalScore = 0;
  let p1TotalKills = 0;
  let p2TotalKills = 0;

  const mapStats = {};

  sharedMatches.forEach((sm) => {
    if (sm.hasWon) wins++;
    else losses++;

    const mapKey = sm.mapName.toLowerCase();
    if (!mapStats[mapKey]) {
      mapStats[mapKey] = {
        mapName: sm.mapName,
        wins: 0,
        losses: 0,
        p1AcsSum: 0,
        p2AcsSum: 0,
        matchesCount: 0,
      };
    }

    const mGroup = mapStats[mapKey];
    mGroup.matchesCount++;
    if (sm.hasWon) mGroup.wins++;
    else mGroup.losses++;

    const p1Member = sm.squadMembers.find((m) => m.puuid.toLowerCase() === player1Puuid.toLowerCase());
    const p2Member = sm.squadMembers.find((m) => m.puuid.toLowerCase() === player2Puuid.toLowerCase());

    if (p1Member?.stats) {
      p1TotalScore += p1Member.stats.score || 0;
      p1TotalKills += p1Member.stats.kills || 0;
      mGroup.p1AcsSum += p1Member.stats.score || 0;
    }
    if (p2Member?.stats) {
      p2TotalScore += p2Member.stats.score || 0;
      p2TotalKills += p2Member.stats.kills || 0;
      mGroup.p2AcsSum += p2Member.stats.score || 0;
    }
  });

  const totalSharedMatches = sharedMatches.length;
  const winRate = Math.round((wins / totalSharedMatches) * 100);

  const mapBreakdown = Object.values(mapStats).map((ms) => {
    const mapWinRate = Math.round((ms.wins / ms.matchesCount) * 100);
    const p1AvgAcs = Math.round(ms.p1AcsSum / ms.matchesCount);
    const p2AvgAcs = Math.round(ms.p2AcsSum / ms.matchesCount);

    const meta = mapsMetadata.find((m) => m.displayName?.toLowerCase() === ms.mapName.toLowerCase());

    return {
      mapName: ms.mapName,
      splashImage: meta?.splash || null,
      matchesCount: ms.matchesCount,
      wins: ms.wins,
      losses: ms.losses,
      winRate: mapWinRate,
      p1AvgAcs,
      p2AvgAcs,
      acsDiff: p1AvgAcs - p2AvgAcs,
    };
  });

  mapBreakdown.sort((a, b) => b.winRate - a.winRate || b.matchesCount - a.matchesCount);

  const bestMap = mapBreakdown.length > 0 ? mapBreakdown[0] : null;
  const worstMap = mapBreakdown.length > 1 ? mapBreakdown[mapBreakdown.length - 1] : null;

  return {
    p1,
    p2,
    totalSharedMatches,
    wins,
    losses,
    winRate,
    p1AvgAcs: Math.round(p1TotalScore / totalSharedMatches),
    p2AvgAcs: Math.round(p2TotalScore / totalSharedMatches),
    p1TotalKills,
    p2TotalKills,
    mapBreakdown,
    bestMap,
    worstMap,
  };
}
