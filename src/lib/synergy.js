/**
 * Pure calculation engine for Valorant Squad Synergy
 * Cross-references match history to group shared games and compute map win rates, squad ACS/KD, and individual player stats.
 */

import { resolveSeasonName } from '../api/valorantApi.js';

// Normalizes map names from Henrik API to match valorant-api.com display names
export function normalizeMapName(rawMapName) {
  if (!rawMapName) return 'Unknown Map';
  const trimmed = rawMapName.trim();
  if (trimmed.toLowerCase() === 'summit') return 'Abyss';
  return trimmed;
}

/**
 * Filter matches to find games where 2+ squad members played on the same team.
 * Supports filterOptions as object { season, mode, outcome, player } OR string selectedSeason.
 */
export function findSharedMatches(players, allMatches, filterOptions = {}) {
  if (!players || players.length < 2 || !allMatches || allMatches.length === 0) {
    return [];
  }

  let season = 'all';
  let mode = 'all';
  let outcome = 'all';
  let player = 'all';

  if (typeof filterOptions === 'string') {
    season = filterOptions;
  } else if (filterOptions && typeof filterOptions === 'object') {
    season = filterOptions.season || 'all';
    mode = filterOptions.mode || 'all';
    outcome = filterOptions.outcome || 'all';
    player = filterOptions.player || 'all';
  }

  let matchesPool = allMatches;

  // 1. Season / Act Filter
  if (season && season !== 'all') {
    const seasonLower = season.toLowerCase();
    matchesPool = matchesPool.filter((m) => {
      const mSeasonId = (m.metadata?.season_id || m.metadata?.season || '').toLowerCase();
      if (!mSeasonId) return true;
      return mSeasonId.includes(seasonLower) || seasonLower.includes(mSeasonId);
    });
  }

  // 2. Game Mode Filter
  if (mode && mode !== 'all') {
    const modeLower = mode.toLowerCase();
    matchesPool = matchesPool.filter((m) => {
      const mMode = (m.metadata?.mode || '').toLowerCase();
      return mMode.includes(modeLower);
    });
  }

  // Create lookups for squad members
  const squadPuuids = new Set(players.map((p) => (p.puuid || '').toLowerCase()).filter(Boolean));
  const squadRiotIds = new Set(players.map((p) => (p.riotId || `${p.name}#${p.tag}`).toLowerCase()));
  const squadNames = new Set(players.map((p) => (p.name || '').toLowerCase()));

  const sharedMap = new Map();

  matchesPool.forEach((match) => {
    if (!match || !match.metadata || !match.players || !match.players.all_players) {
      return;
    }

    const matchId = match.metadata.matchid;
    if (!matchId || sharedMap.has(matchId)) return;

    const allPlayers = match.players.all_players;

    // Identify squad members present in this match
    const presentSquadMembers = allPlayers.filter((p) => {
      const pPuuid = (p.puuid || '').toLowerCase();
      const pRiotId = `${p.name || ''}#${p.tag || ''}`.toLowerCase();
      const pName = (p.name || '').toLowerCase();

      return (
        (pPuuid && squadPuuids.has(pPuuid)) ||
        squadRiotIds.has(pRiotId) ||
        squadNames.has(pName)
      );
    });

    // 3. Player Filter
    if (player && player !== 'all') {
      const targetPlayerLower = player.toLowerCase();
      const playerPresent = presentSquadMembers.some((m) => {
        const pRiot = `${m.name}#${m.tag}`.toLowerCase();
        return (
          m.name.toLowerCase() === targetPlayerLower ||
          pRiot === targetPlayerLower ||
          (m.puuid && m.puuid.toLowerCase() === targetPlayerLower)
        );
      });
      if (!playerPresent) return;
    }

    // Require at least 2 squad members in the same match
    if (presentSquadMembers.length >= 2) {
      const gameMode = (match.metadata.mode || '').toLowerCase();
      const isDeathmatch = gameMode.includes('deathmatch');

      if (isDeathmatch) {
        const mapName = normalizeMapName(match.metadata.map);
        sharedMap.set(matchId, {
          match,
          matchId,
          mapName,
          gameStart: match.metadata.game_start_patched || 'Recent',
          mode: match.metadata.mode || 'Deathmatch',
          hasWon: true,
          seasonId: match.metadata.season_id || match.metadata.season || 'Current',
          squadMembers: presentSquadMembers,
        });
      } else {
        const teamColors = new Set(
          presentSquadMembers.map((m) => (m.team || '').toLowerCase()).filter(Boolean)
        );

        if (teamColors.size === 1) {
          const teamColor = Array.from(teamColors)[0];
          const teamObj = match.teams?.[teamColor];
          const hasWon = teamObj?.has_won ?? false;
          const roundsWon = teamObj?.rounds_won ?? 0;
          const roundsLost = teamObj?.rounds_lost ?? 0;

          // 4. Outcome Filter
          if (outcome === 'victory' && !hasWon) return;
          if (outcome === 'defeat' && hasWon) return;

          const mapName = normalizeMapName(match.metadata.map);

          sharedMap.set(matchId, {
            match,
            matchId,
            mapName,
            gameStart: match.metadata.game_start_patched || 'Recent',
            mode: match.metadata.mode || 'Competitive',
            hasWon,
            roundsWon,
            roundsLost,
            scoreline: `${roundsWon} - ${roundsLost}`,
            teamColor,
            seasonId: match.metadata.season_id || match.metadata.season || 'Current',
            squadMembers: presentSquadMembers,
          });
        }
      }
    }
  });

  return Array.from(sharedMap.values());
}

/**
 * Compute Map Synergy metrics for all shared matches.
 */
export function computeMapSynergy(players, allMatches, mapsMetadata = [], filterOptions = {}) {
  const sharedMatches = findSharedMatches(players, allMatches, filterOptions);

  if (sharedMatches.length === 0) {
    return [];
  }

  const metaMap = new Map();
  mapsMetadata.forEach((m) => {
    if (m.displayName) metaMap.set(m.displayName.toLowerCase(), m);
  });

  const mapGroups = {};

  sharedMatches.forEach((sm) => {
    const normMap = sm.mapName;
    const mapKey = normMap.toLowerCase();

    if (!mapGroups[mapKey]) {
      const meta = metaMap.get(mapKey);
      mapGroups[mapKey] = {
        map: normMap,
        displayName: meta?.displayName || normMap,
        splashImage: meta?.splash || meta?.listViewIcon || null,
        displayIcon: meta?.displayIcon || null,
        matches: [],
        wins: 0,
        losses: 0,
        playerMapStats: {},
      };
    }

    const group = mapGroups[mapKey];
    group.matches.push(sm);
    if (sm.hasWon) group.wins++;
    else group.losses++;

    sm.squadMembers.forEach((sp) => {
      const pKey = (sp.name || '').toLowerCase();
      
      if (!group.playerMapStats[pKey]) {
        const matchingPlayer = players.find((p) => p.name.toLowerCase() === pKey);
        group.playerMapStats[pKey] = {
          puuid: sp.puuid || matchingPlayer?.puuid || pKey,
          name: sp.name || matchingPlayer?.name || 'Player',
          tag: sp.tag || matchingPlayer?.tag || '',
          riotId: `${sp.name}#${sp.tag}`,
          kills: 0,
          deaths: 0,
          assists: 0,
          score: 0,
          headshots: 0,
          bodyshots: 0,
          legshots: 0,
          games: 0,
          wins: 0,
          agentUsage: {},
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
      pStat.headshots += stats.headshots || 0;
      pStat.bodyshots += stats.bodyshots || 0;
      pStat.legshots += stats.legshots || 0;

      const agentName = sp.character || 'Unknown';
      pStat.agentUsage[agentName] = (pStat.agentUsage[agentName] || 0) + 1;
      if (sp.assets?.agent?.small) {
        pStat.agentIcons[agentName] = sp.assets.agent.small;
      }
    });
  });

  const results = Object.values(mapGroups).map((mapData) => {
    const gamesPlayed = mapData.matches.length;
    const winRate = gamesPlayed > 0 ? Math.round((mapData.wins / gamesPlayed) * 100) : 0;

    let totalSquadScore = 0;
    let totalSquadKills = 0;
    let totalSquadDeaths = 0;
    let totalSquadAssists = 0;
    let totalPlayerEntries = 0;

    const playerList = Object.values(mapData.playerMapStats).map((ps) => {
      const avgACS = ps.games > 0 ? Math.round(ps.score / ps.games) : 0;
      const avgKD = ps.deaths > 0 ? (ps.kills / ps.deaths).toFixed(2) : ps.kills.toFixed(2);

      const totalShots = ps.headshots + ps.bodyshots + ps.legshots;
      const avgHeadshot = totalShots > 0 ? Math.round((ps.headshots / totalShots) * 100) : 0;

      totalSquadScore += ps.score;
      totalSquadKills += ps.kills;
      totalSquadDeaths += ps.deaths;
      totalSquadAssists += ps.assists;
      totalPlayerEntries += ps.games;

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
        avgACS,
        avgKD: parseFloat(avgKD),
        avgHeadshot,
        topAgent,
        topAgentIcon: ps.agentIcons[topAgent] || null,
        winRate: Math.round((ps.wins / ps.games) * 100),
        isTopPerformer: false,
      };
    });

    playerList.sort((a, b) => b.avgACS - a.avgACS);
    if (playerList.length > 0) {
      playerList[0].isTopPerformer = true;
    }

    const squadAvgACS = totalPlayerEntries > 0 ? Math.round(totalSquadScore / totalPlayerEntries) : 0;
    const squadKDRatio =
      totalSquadDeaths > 0
        ? ((totalSquadKills + totalSquadAssists) / totalSquadDeaths).toFixed(2)
        : (totalSquadKills + totalSquadAssists).toFixed(2);

    return {
      map: mapData.map,
      displayName: mapData.displayName,
      splashImage: mapData.splashImage,
      displayIcon: mapData.displayIcon,
      gamesPlayed,
      wins: mapData.wins,
      losses: mapData.losses,
      winRate,
      squadAvgACS,
      squadKDRatio: parseFloat(squadKDRatio),
      players: playerList,
      topPerformer: playerList[0] || null,
      matches: mapData.matches,
    };
  });

  results.sort((a, b) => b.winRate - a.winRate || b.gamesPlayed - a.gamesPlayed);
  return results;
}
