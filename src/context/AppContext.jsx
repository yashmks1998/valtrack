import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchValorantMaps, fetchValorantAgents, fetchCompetitiveTiers } from '../api/valorantApi';
import { fetchPlayerAccount, fetchPlayerRank, fetchPlayerMatches } from '../api/henrik';

const DEFAULT_API_KEY = 'HDEV-f931b513-abaf-4287-a229-e051a2a577ea';
const AP_REGION = 'ap';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [henrikApiKey, setHenrikApiKey] = useState(() => {
    return import.meta.env.VITE_HENRIK_API_KEY || DEFAULT_API_KEY;
  });

  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  
  const [mapsMetadata, setMapsMetadata] = useState([]);
  const [agentsMetadata, setAgentsMetadata] = useState([]);
  const [ranksMetadata, setRanksMetadata] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'compare' | 'roster'
  const [selectedMapForModal, setSelectedMapForModal] = useState(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Load static metadata (maps, agents, rank icons) on initial mount
  useEffect(() => {
    async function loadStaticMetadata() {
      try {
        const [maps, agents, ranks] = await Promise.all([
          fetchValorantMaps(),
          fetchValorantAgents(),
          fetchCompetitiveTiers(),
        ]);
        setMapsMetadata(maps);
        setAgentsMetadata(agents);
        setRanksMetadata(ranks);
      } catch (err) {
        console.error('Failed to load static metadata:', err);
      }
    }
    loadStaticMetadata();
  }, []);

  /**
   * Add a new player by Riot ID (Name#Tag) for AP Region using Henrik Live API
   */
  const addPlayer = async (riotIdInput, region = AP_REGION) => {
    const trimmed = riotIdInput.trim();
    if (!trimmed.includes('#')) {
      throw new Error('Please specify Riot ID format: Name#Tag (e.g. TenZ#SEN)');
    }

    const [name, tag] = trimmed.split('#');
    if (!name || !tag) {
      throw new Error('Invalid Riot ID. Both Name and Tag are required.');
    }

    // Check if player already added
    const cleanTag = tag.trim().toLowerCase();
    const cleanName = name.trim().toLowerCase();
    const existing = players.find(
      (p) => p.name.toLowerCase() === cleanName && p.tag.toLowerCase() === cleanTag
    );
    if (existing) {
      throw new Error(`Player ${name}#${tag} is already in the active roster!`);
    }

    setIsLoading(true);
    setApiError(null);

    try {
      // Live Henrik API account & MMR fetch for AP region
      const account = await fetchPlayerAccount(name, tag, henrikApiKey);
      const rank = await fetchPlayerRank(AP_REGION, name, tag, henrikApiKey);
      
      const newPlayer = {
        ...account,
        region: AP_REGION,
        rank,
      };

      // Fetch recent match history from Henrik Live API for AP region
      const playerMatchHistory = await fetchPlayerMatches(AP_REGION, name, tag, '', henrikApiKey);

      setPlayers((prev) => [...prev, newPlayer]);
      
      if (playerMatchHistory && playerMatchHistory.length > 0) {
        setMatches((prev) => {
          const matchMap = new Map();
          [...prev, ...playerMatchHistory].forEach((m) => {
            if (m.metadata?.matchid) {
              matchMap.set(m.metadata.matchid, m);
            }
          });
          return Array.from(matchMap.values());
        });
      }
      return newPlayer;
    } catch (err) {
      console.error('Error adding player:', err);
      setApiError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove player from roster
   */
  const removePlayer = (puuid) => {
    setPlayers((prev) => prev.filter((p) => p.puuid !== puuid));
  };

  return (
    <AppContext.Provider
      value={{
        henrikApiKey,
        setHenrikApiKey,
        players,
        matches,
        mapsMetadata,
        agentsMetadata,
        ranksMetadata,
        isLoading,
        apiError,
        setApiError,
        addPlayer,
        removePlayer,
        activeTab,
        setActiveTab,
        selectedMapForModal,
        setSelectedMapForModal,
        isApiKeyModalOpen,
        setIsApiKeyModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
