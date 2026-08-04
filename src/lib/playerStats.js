/**
 * Pure calculation engine for Single-Player Profile Stats & Dossiers
 * Derives agent mastery, map performance, role distribution, and rank history progression.
 */

// Mapping of Valorant Agents to their official Roles
export const AGENT_ROLE_MAP = {
  jett: 'Duelist',
  raze: 'Duelist',
  reyna: 'Duelist',
  yoru: 'Duelist',
  neon: 'Duelist',
  iso: 'Duelist',
  phoenix: 'Duelist',

  sova: 'Initiator',
  fade: 'Initiator',
  breach: 'Initiator',
  skye: 'Initiator',
  'kay/o': 'Initiator',
  gekko: 'Initiator',

  omen: 'Controller',
  viper: 'Controller',
  brimstone: 'Controller',
  astra: 'Controller',
  harbor: 'Controller',
  clove: 'Controller',

  killjoy: 'Sentinel',
  cypher: 'Sentinel',
  sage: 'Sentinel',
  chamber: 'Sentinel',
  deadlock: 'Sentinel',
  vyse: 'Sentinel',
};

// Colors for Role Badges
export const ROLE_COLOR_MAP = {
  Duelist: '#ff4655',
  Initiator: '#38bdf8',
  Controller: '#a855f7',
  Sentinel: '#34d399',
  Unknown: '#9ca3af',
};

// Extract season UUID from ANY Henrik match metadata shape:
export function extractSeasonId(metadata) {
  if (!metadata) return '';
  if (typeof metadata.season_id === 'string' && metadata.season_id)
    return metadata.season_id.toLowerCase();
  const s = metadata.season;
  if (!s) return '';
  if (typeof s === 'object' && s.id) return String(s.id).toLowerCase();
  if (typeof s === 'string') return s.toLowerCase();
  return '';
}

// Convert season short code to human label:
export function seasonShortToLabel(short = '') {
  if (!short) return 'Unknown Season';
  const s = short.toLowerCase().trim();
  const v = s.match(/^v(\d+)a(\d+)$/);
  if (v) return `${2025 + parseInt(v[1])} Act ${v[2]}`;
  const e = s.match(/^e(\d+)a(\d+)$/);
  if (e) return `Episode ${e[1]} Act ${e[2]}`;
  return short;
}

// Sort season short codes newest first:
export function compareSeasonShort(a = '', b = '') {
  const parse = s => {
    const v = s.match(/^v(\d+)a(\d+)$/);
    if (v) return (100 + parseInt(v[1])) * 10 + parseInt(v[2]);
    const e = s.match(/^e(\d+)a(\d+)$/);
    if (e) return parseInt(e[1]) * 10 + parseInt(e[2]);
    return 0;
  };
  return parse(b) - parse(a); // descending
}

// Normalise UI mode label -> Henrik API param:
export function normaliseMode(mode = '') {
  const map = {
    competitive: 'competitive', ranked: 'competitive',
    unrated: 'unrated', swiftplay: 'swiftplay',
    deathmatch: 'deathmatch', 'team deathmatch': 'teamdeathmatch',
    teamdeathmatch: 'teamdeathmatch', 'spike rush': 'spikerush',
    spikerush: 'spikerush', premier: 'premier', escalation: 'escalation',
  };
  return map[mode.trim().toLowerCase()] ?? mode.trim().toLowerCase();
}

// Client-side season filter:
export function filterMatchesBySeason(matches, seasonUUID) {
  if (!seasonUUID || seasonUUID === 'lifetime') return matches;
  const t = seasonUUID.toLowerCase();
  return matches.filter(m => extractSeasonId(m.metadata) === t);
}

// Outcome per match:
export function getOutcome(match, puuid) {
  const player = match.players?.all_players?.find(p => (p.puuid || '').toLowerCase() === (puuid || '').toLowerCase());
  if (!player) return 'unknown';
  const team = (player.team || '').toLowerCase();
  const won = match.teams?.[team]?.has_won;
  if (won === undefined || won === null) return 'draw'; // Not all modes have win/loss
  return won ? 'win' : 'loss';
}

/**
 * Filter all matches where a specific player participated (by PUUID, Riot ID, or Name)
 */
export function getPlayerMatches(matches = [], player) {
  if (!player || !matches || matches.length === 0) return [];

  const puuidLower = (player.puuid || '').toLowerCase();
  const riotIdLower = (player.riotId || `${player.name}#${player.tag}`).toLowerCase();
  const nameLower = (player.name || '').toLowerCase();

  return matches.filter((m) => {
    if (!m.players || !m.players.all_players) return false;
    return m.players.all_players.some((p) => {
      const pPuuid = (p.puuid || '').toLowerCase();
      const pRiot = `${p.name || ''}#${p.tag || ''}`.toLowerCase();
      const pName = (p.name || '').toLowerCase();

      return (
        (puuidLower && pPuuid === puuidLower) ||
        pRiot === riotIdLower ||
        pName === nameLower
      );
    });
  });
}

/**
 * Compute overall vital statistics for a player
 */
export function computeVitalStats(playerMatches = [], player) {
  if (playerMatches.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      avgACS: 0,
      avgKD: 0.0,
      avgHeadshot: 0,
    };
  }

  let totalScore = 0;
  let totalRoundsPlayed = 0;
  let totalKills = 0;
  let totalDeaths = 0;
  let totalAssists = 0;
  let totalHeadshots = 0;
  let totalBodyshots = 0;
  let totalLegshots = 0;
  let totalDamageMade = 0;
  let totalKAST = 0;
  let wins = 0;
  let gamesCount = 0;

  const puuidLower = (player?.puuid || '').toLowerCase();
  const nameLower = (player?.name || '').toLowerCase();

  playerMatches.forEach((m) => {
    const allPlayers = m.players?.all_players || [];
    const pObj = allPlayers.find((p) => {
      const pPuuid = (p.puuid || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return (puuidLower && pPuuid === puuidLower) || pName === nameLower;
    });

    if (!pObj) return;
    const actualPuuid = pObj.puuid || puuidLower;

    gamesCount++;

    const pTeam = (pObj.team || '').toLowerCase();
    const teamObj = m.teams?.[pTeam];
    const hasWon = teamObj?.has_won ?? false;
    if (hasWon) wins++;

    const stats = pObj.stats || {};
    totalScore += stats.score || 0;
    totalKills += stats.kills || 0;
    totalDeaths += stats.deaths || 0;
    totalAssists += stats.assists || 0;
    totalHeadshots += stats.headshots || 0;
    totalBodyshots += stats.bodyshots || 0;
    totalLegshots += stats.legshots || 0;
    totalDamageMade += stats.damage_made || 0;

    const rounds = m.rounds || [];
    totalRoundsPlayed += rounds.length;

    // KAST Calculation
    rounds.forEach((r) => {
      let k = false;
      let a = false;
      let s = true;
      let t = false; // Trade logic is complex without precise timestamps, we'll approximate S

      const playerStats = (r.player_stats || []).find(ps => (ps.puuid || '').toLowerCase() === actualPuuid.toLowerCase());
      if (playerStats) {
        if (playerStats.kills && playerStats.kills.length > 0) k = true;
      }

      // Check if player died (S)
      (r.player_stats || []).forEach(ps => {
        (ps.kills || []).forEach(kill => {
          if ((kill.victim_puuid || '').toLowerCase() === actualPuuid.toLowerCase()) {
            s = false;
            // Check if killer was traded by a teammate
            const killerPuuid = (kill.killer_puuid || '').toLowerCase();
            const killerDeath = (r.player_stats || []).find(ps2 => 
              (ps2.kills || []).some(k2 => (k2.victim_puuid || '').toLowerCase() === killerPuuid)
            );
            if (killerDeath) t = true;
          }
          if ((kill.assistants || []).some(ast => (ast.puuid || '').toLowerCase() === actualPuuid.toLowerCase())) {
            a = true;
          }
        });
      });

      if (k || a || s || t) {
        totalKAST++;
      }
    });
  });

  const winRate = gamesCount > 0 ? Math.round((wins / gamesCount) * 100) : 0;
  const avgACS = totalRoundsPlayed > 0 ? Math.round(totalScore / totalRoundsPlayed) : 0;
  const avgKD = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);
  const totalShots = totalHeadshots + totalBodyshots + totalLegshots;
  const avgHeadshot = totalShots > 0 ? Math.round((totalHeadshots / totalShots) * 100) : 0;
  const avgADR = totalRoundsPlayed > 0 ? Math.round(totalDamageMade / totalRoundsPlayed) : 0;
  const kastPercent = totalRoundsPlayed > 0 ? Math.round((totalKAST / totalRoundsPlayed) * 100) : 0;

  return {
    totalGames: gamesCount,
    wins,
    losses: gamesCount - wins,
    winRate,
    avgACS,
    avgKD: parseFloat(avgKD),
    avgHeadshot,
    avgADR,
    kastPercent
  };
}

/**
 * Compute Agent Mastery breakdown for a player
 */
export function computeAgentMastery(playerMatches = [], player) {
  if (playerMatches.length === 0) return [];

  const puuidLower = (player?.puuid || '').toLowerCase();
  const nameLower = (player?.name || '').toLowerCase();

  const agentMap = {};

  playerMatches.forEach((m) => {
    const allPlayers = m.players?.all_players || [];
    const pObj = allPlayers.find((p) => {
      const pPuuid = (p.puuid || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return (puuidLower && pPuuid === puuidLower) || pName === nameLower;
    });

    if (!pObj) return;

    const agentName = pObj.character || 'Unknown';
    const agentKey = agentName.toLowerCase();
    const pTeam = (pObj.team || '').toLowerCase();
    const hasWon = m.teams?.[pTeam]?.has_won ?? false;

    if (!agentMap[agentKey]) {
      agentMap[agentKey] = {
        agent: agentName,
        role: AGENT_ROLE_MAP[agentKey] || 'Flex',
        icon: pObj.assets?.agent?.small || null,
        games: 0,
        wins: 0,
        score: 0,
        kills: 0,
        deaths: 0,
        assists: 0,
        mapStats: {},
      };
    }

    const entry = agentMap[agentKey];
    entry.games++;
    if (hasWon) entry.wins++;

    const stats = pObj.stats || {};
    entry.score += stats.score || 0;
    entry.kills += stats.kills || 0;
    entry.deaths += stats.deaths || 0;
    entry.assists += stats.assists || 0;

    const mapName = m.metadata?.map || 'Unknown';
    if (!entry.mapStats[mapName]) {
      entry.mapStats[mapName] = { map: mapName, games: 0, wins: 0, score: 0 };
    }
    const ms = entry.mapStats[mapName];
    ms.games++;
    if (hasWon) ms.wins++;
    ms.score += stats.score || 0;
  });

  const results = Object.values(agentMap).map((entry) => {
    const winRate = entry.games > 0 ? Math.round((entry.wins / entry.games) * 100) : 0;
    const avgACS = entry.games > 0 ? Math.round(entry.score / entry.games) : 0;
    const avgKD = entry.deaths > 0 ? (entry.kills / entry.deaths).toFixed(2) : entry.kills.toFixed(2);
    const kda = entry.deaths > 0 ? ((entry.kills + entry.assists) / entry.deaths).toFixed(2) : (entry.kills + entry.assists).toFixed(2);

    const mapBreakdown = Object.values(entry.mapStats).map((ms) => ({
      map: ms.map,
      games: ms.games,
      winRate: Math.round((ms.wins / ms.games) * 100),
      avgACS: Math.round(ms.score / ms.games),
    }));

    mapBreakdown.sort((a, b) => b.winRate - a.winRate || b.games - a.games);

    return {
      agent: entry.agent,
      role: entry.role,
      icon: entry.icon,
      games: entry.games,
      wins: entry.wins,
      winRate,
      avgACS,
      avgKD: parseFloat(avgKD),
      kda: parseFloat(kda),
      isMain: false,
      mapBreakdown,
    };
  });

  results.sort((a, b) => b.games - a.games || b.winRate - a.winRate);

  // Mark top 1-2 agents as "Mains"
  if (results.length > 0) results[0].isMain = true;
  if (results.length > 1 && results[1].games >= Math.max(1, results[0].games * 0.5)) {
    results[1].isMain = true;
  }

  return results;
}

/**
 * Compute Map Performance breakdown for a single player
 */
export function computePlayerMapPerformance(playerMatches = [], player) {
  if (playerMatches.length === 0) return [];

  const puuidLower = (player?.puuid || '').toLowerCase();
  const nameLower = (player?.name || '').toLowerCase();

  const mapGroups = {};

  playerMatches.forEach((m) => {
    const allPlayers = m.players?.all_players || [];
    const pObj = allPlayers.find((p) => {
      const pPuuid = (p.puuid || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return (puuidLower && pPuuid === puuidLower) || pName === nameLower;
    });

    if (!pObj) return;

    const rawMap = m.metadata?.map || 'Unknown Map';
    const mapName = rawMap.toLowerCase() === 'summit' ? 'Abyss' : rawMap;
    const mapKey = mapName.toLowerCase();
    const pTeam = (pObj.team || '').toLowerCase();
    const hasWon = m.teams?.[pTeam]?.has_won ?? false;

    if (!mapGroups[mapKey]) {
      mapGroups[mapKey] = {
        map: mapName,
        games: 0,
        wins: 0,
        score: 0,
        agentUsage: {},
        agentIcons: {},
      };
    }

    const group = mapGroups[mapKey];
    group.games++;
    if (hasWon) group.wins++;

    const stats = pObj.stats || {};
    group.score += stats.score || 0;

    const agent = pObj.character || 'Unknown';
    group.agentUsage[agent] = (group.agentUsage[agent] || 0) + 1;
    if (pObj.assets?.agent?.small) {
      group.agentIcons[agent] = pObj.assets.agent.small;
    }
  });

  const results = Object.values(mapGroups).map((mg) => {
    const winRate = mg.games > 0 ? Math.round((mg.wins / mg.games) * 100) : 0;
    const avgACS = mg.games > 0 ? Math.round(mg.score / mg.games) : 0;

    let bestAgent = 'Unknown';
    let maxCount = 0;
    Object.entries(mg.agentUsage).forEach(([ag, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestAgent = ag;
      }
    });

    return {
      map: mg.map,
      games: mg.games,
      wins: mg.wins,
      losses: mg.games - mg.wins,
      winRate,
      avgACS,
      bestAgent,
      bestAgentIcon: mg.agentIcons[bestAgent] || null,
    };
  });

  results.sort((a, b) => b.winRate - a.winRate || b.games - a.games);
  return results;
}

/**
 * Compute Role Distribution (% of games played per role)
 */
export function computeRoleDistribution(playerMatches = [], player) {
  if (playerMatches.length === 0) return [];

  const puuidLower = (player?.puuid || '').toLowerCase();
  const nameLower = (player?.name || '').toLowerCase();

  const roleCounts = {
    Duelist: 0,
    Initiator: 0,
    Controller: 0,
    Sentinel: 0,
  };

  let totalPlayed = 0;

  playerMatches.forEach((m) => {
    const allPlayers = m.players?.all_players || [];
    const pObj = allPlayers.find((p) => {
      const pPuuid = (p.puuid || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return (puuidLower && pPuuid === puuidLower) || pName === nameLower;
    });

    if (!pObj) return;

    const agentKey = (pObj.character || '').toLowerCase();
    const role = AGENT_ROLE_MAP[agentKey] || 'Duelist';
    roleCounts[role] = (roleCounts[role] || 0) + 1;
    totalPlayed++;
  });

  if (totalPlayed === 0) return [];

  return Object.entries(roleCounts).map(([role, count]) => ({
    role,
    count,
    percentage: Math.round((count / totalPlayed) * 100),
    color: ROLE_COLOR_MAP[role],
  })).filter((item) => item.count > 0);
}

/**
 * Compute Rank RR Progression data points for charting
 */
export function computeRankProgression(mmrHistory = [], playerMatches = []) {
  if (!mmrHistory || mmrHistory.length === 0) return [];
  
  // Sort mmrHistory oldest to newest for the chart
  const sortedHistory = [...mmrHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const points = [];
  
  sortedHistory.forEach((h, idx) => {
    points.push({
      matchIndex: idx + 1,
      map: h.map?.name || 'Unknown Map',
      hasWon: h.last_mmr_change > 0,
      date: h.date,
      rr: h.ranking_in_tier,
      elo: h.elo,
      result: h.last_mmr_change > 0 ? 'VICTORY' : 'DEFEAT',
      score: 0, // Match score not available in mmrHistory directly
    });
  });

  return points;
}
