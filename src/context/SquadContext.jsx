import React, { createContext, useContext, useState, useEffect } from 'react';
import { getValorantMaps, getValorantAgents, getCompetitiveTiers, getValorantSeasons } from '../api/valorantApi';
import { fetchAccount, fetchRank, fetchMatches } from '../api/henrik';
import { PRECACHED_SQUAD_MATCHES } from '../utils/squadCache';

const SquadContext = createContext();

const LOCAL_STORAGE_PLAYERS_KEY = 'valosquad_players_v4';
const LOCAL_STORAGE_MATCHES_KEY = 'valosquad_matches_v4';

export function SquadProvider({ children }) {
  const [players, setPlayers] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PLAYERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Preserve comprehensive historical match dataset for all seasons/episodes
  const [matches, setMatches] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MATCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return PRECACHED_SQUAD_MATCHES;
  });

  const [mapsMetadata, setMapsMetadata] = useState([]);
  const [agentsMetadata, setAgentsMetadata] = useState([]);
  const [ranksMetadata, setRanksMetadata] = useState([]);
  const [seasonsMetadata, setSeasonsMetadata] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const [selectedPlayerForDrawer, setSelectedPlayerForDrawer] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAYERS_KEY, JSON.stringify(players));
    } catch (e) {}
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MATCHES_KEY, JSON.stringify(matches));
    } catch (e) {}
  }, [matches]);

  // Load static metadata ONCE on mount
  useEffect(() => {
    async function loadStaticMetadata() {
      try {
        const [maps, agents, ranks, seasons] = await Promise.all([
          getValorantMaps(),
          getValorantAgents(),
          getCompetitiveTiers(),
          getValorantSeasons(),
        ]);
        setMapsMetadata(maps);
        setAgentsMetadata(agents);
        setRanksMetadata(ranks);
        setSeasonsMetadata(seasons);
      } catch (err) {
        console.error('Failed loading static metadata:', err);
      }
    }
    loadStaticMetadata();
  }, []);

  /**
   * User-triggered Live API call: Add player by Riot ID (name#tag)
   * Merges live API results with comprehensive multi-season match history dataset
   */
  const addPlayer = async (riotIdInput, region = 'ap') => {
    const trimmed = riotIdInput.trim();
    if (!trimmed.includes('#')) {
      throw new Error('Please enter Riot ID format: Name#Tag (e.g. TenZ#SEN)');
    }

    const [name, tag] = trimmed.split('#');
    if (!name.trim() || !tag.trim()) {
      throw new Error('Both player Name and Tag are required.');
    }

    const cleanName = name.trim().toLowerCase();
    const cleanTag = tag.trim().toLowerCase();
    const existing = players.find(
      (p) => p.name.toLowerCase() === cleanName && p.tag.toLowerCase() === cleanTag
    );
    if (existing) {
      throw new Error(`Player ${name}#${tag} is already in your squad!`);
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Live Henrik API Calls
      const account = await fetchAccount(name, tag);
      const effectiveRegion = account.region || region || 'ap';
      
      const [rank, playerMatches] = await Promise.all([
        fetchRank(effectiveRegion, name, tag).catch(() => null),
        fetchMatches(effectiveRegion, name, tag).catch(() => []),
      ]);

      const newPlayer = {
        ...account,
        region: effectiveRegion,
        rank: rank || account.rank,
      };

      setPlayers((prev) => [...prev, newPlayer]);

      // Merge live matches into multi-season match pool
      setMatches((prev) => {
        const matchMap = new Map();
        
        // Retain precached multi-season historical matches
        PRECACHED_SQUAD_MATCHES.forEach((m) => {
          if (m.metadata?.matchid) matchMap.set(m.metadata.matchid, m);
        });

        // Retain existing state matches
        prev.forEach((m) => {
          if (m.metadata?.matchid) matchMap.set(m.metadata.matchid, m);
        });

        // Add new live matches
        if (playerMatches && playerMatches.length > 0) {
          playerMatches.forEach((m) => {
            if (m.metadata?.matchid) matchMap.set(m.metadata.matchid, m);
          });
        }

        return Array.from(matchMap.values());
      });

      setToastMessage(`Live data for ${newPlayer.name}#${newPlayer.tag} fetched!`);
      setTimeout(() => setToastMessage(null), 3500);

      return newPlayer;
    } catch (err) {
      console.error('Error adding player to squad:', err);
      if (err.message?.includes('429') || err.message?.includes('rate limit')) {
        setToastMessage('Henrik API rate limit reached. Displaying pre-cached squad data.');
        setTimeout(() => setToastMessage(null), 4000);
      }
      setApiError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove player from squad
   */
  const removePlayer = (playerToRemove) => {
    let targetPuuid = null;
    let targetName = null;
    let targetTag = null;

    if (typeof playerToRemove === 'string') {
      targetPuuid = playerToRemove;
    } else if (playerToRemove && typeof playerToRemove === 'object') {
      targetPuuid = playerToRemove.puuid;
      targetName = playerToRemove.name?.toLowerCase();
      targetTag = playerToRemove.tag?.toLowerCase();
    }

    setPlayers((prev) =>
      prev.filter((p) => {
        const pPuuid = p.puuid;
        const pName = (p.name || '').toLowerCase();
        const pTag = (p.tag || '').toLowerCase();

        if (targetPuuid && pPuuid && pPuuid.toLowerCase() === targetPuuid.toLowerCase()) {
          return false;
        }
        if (targetName && targetTag && pName === targetName && pTag === targetTag) {
          return false;
        }
        if (targetName && pName === targetName) {
          return false;
        }
        return true;
      })
    );

    if (
      selectedPlayerForDrawer &&
      ((targetPuuid && selectedPlayerForDrawer.puuid?.toLowerCase() === targetPuuid.toLowerCase()) ||
        (targetName && selectedPlayerForDrawer.name?.toLowerCase() === targetName))
    ) {
      setSelectedPlayerForDrawer(null);
    }
  };

  /**
   * Reset squad to empty
   */
  const resetToDefaultSquad = () => {
    setPlayers([]);
    setMatches(PRECACHED_SQUAD_MATCHES);
  };

  return (
    <SquadContext.Provider
      value={{
        players,
        matches,
        mapsMetadata,
        agentsMetadata,
        ranksMetadata,
        seasonsMetadata,
        isLoading,
        apiError,
        toastMessage,
        setApiError,
        addPlayer,
        removePlayer,
        resetToDefaultSquad,
        selectedPlayerForDrawer,
        setSelectedPlayerForDrawer,
      }}
    >
      {children}
    </SquadContext.Provider>
  );
}

export function useSquad() {
  const context = useContext(SquadContext);
  if (!context) {
    throw new Error('useSquad must be used within a SquadProvider');
  }
  return context;
}
