import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useSquad } from '../../context/SquadContext';
import { 
  getPlayerMatches, 
  filterMatchesBySeason,
  computeVitalStats,
  extractSeasonId,
  normaliseMode,
  getOutcome,
  compareSeasonShort
} from '../../lib/playerStats';

import ProfileHeader from './ProfileHeader';
import SeasonSelector from './SeasonSelector';
import FilterBar from './FilterBar';
import StatsOverview from './StatsOverview';
import RRChart from './RRChart';
import AgentBreakdown from './AgentBreakdown';
import MapPerformance from './MapPerformance';
import MatchHistory from './MatchHistory';

export default function PlayerProfile({ player, onClose }) {
  const { matches: globalMatches } = useSquad();
  
  // All raw matches for this player from context
  const allMatches = useMemo(() => getPlayerMatches(globalMatches, player), [globalMatches, player]);

  // Filters State
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedMap, setSelectedMap] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  // Auto-select latest season on mount if available
  useEffect(() => {
    if (player?.rank?.seasonal && player.rank.seasonal.length > 0) {
      // Sort seasonal to get latest
      const sorted = [...player.rank.seasonal].sort((a, b) => compareSeasonShort(a.season?.short, b.season?.short));
      if (sorted[0]?.season?.id) {
        setSelectedSeasonId(sorted[0].season.id.toLowerCase());
      }
    }
  }, [player]);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Derived filtered matches
  const filteredMatches = useMemo(() => {
    let filtered = filterMatchesBySeason(allMatches, selectedSeasonId);
    
    if (selectedMode) {
      const targetMode = normaliseMode(selectedMode);
      filtered = filtered.filter(m => normaliseMode(m.metadata?.mode) === targetMode);
    }
    
    if (selectedMap) {
      const targetMap = selectedMap.toLowerCase();
      filtered = filtered.filter(m => (m.metadata?.map || '').toLowerCase() === targetMap);
    }
    
    if (selectedAgent) {
      const targetAgent = selectedAgent.toLowerCase();
      filtered = filtered.filter(m => {
        const pObj = m.players?.all_players?.find(p => (p.puuid || '').toLowerCase() === (player.puuid || '').toLowerCase());
        return (pObj?.character || '').toLowerCase() === targetAgent;
      });
    }

    if (selectedOutcome) {
      filtered = filtered.filter(m => getOutcome(m, player.puuid) === selectedOutcome);
    }
    
    return filtered.sort((a, b) => new Date(b.metadata?.started_at) - new Date(a.metadata?.started_at));
  }, [allMatches, selectedSeasonId, selectedMode, selectedMap, selectedAgent, selectedOutcome, player.puuid]);

  // Computed KPI Stats
  const computedStats = useMemo(() => computeVitalStats(filteredMatches, player), [filteredMatches, player]);

  // Available Filter Options (Union of rank data and matches data)
  const availableSeasons = useMemo(() => {
    const map = new Map();
    // From MMR seasonal
    if (player?.rank?.seasonal) {
      player.rank.seasonal.forEach(s => {
        if (s.season?.id) map.set(s.season.id.toLowerCase(), { id: s.season.id.toLowerCase(), short: s.season.short });
      });
    }
    // From matches
    allMatches.forEach(m => {
      const id = extractSeasonId(m.metadata);
      if (id && !map.has(id)) {
        let short = '';
        if (m.metadata?.season?.short) short = m.metadata.season.short;
        map.set(id, { id, short });
      }
    });
    return Array.from(map.values()).sort((a, b) => compareSeasonShort(a.short, b.short));
  }, [player, allMatches]);

  const availableMaps = useMemo(() => {
    const s = new Set();
    allMatches.forEach(m => {
      if (m.metadata?.map) s.add(m.metadata.map);
    });
    return Array.from(s).sort();
  }, [allMatches]);

  const availableAgents = useMemo(() => {
    const s = new Set();
    allMatches.forEach(m => {
      const pObj = m.players?.all_players?.find(p => (p.puuid || '').toLowerCase() === (player.puuid || '').toLowerCase());
      if (pObj?.character) s.add(pObj.character);
    });
    return Array.from(s).sort();
  }, [allMatches, player.puuid]);

  if (!player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
        
        {/* Dimmed Blurred Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0f1115]/90 backdrop-blur-sm z-0"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 1 }}
          className="relative z-10 w-full max-w-[1200px] h-full sm:h-[95vh] bg-[var(--bg-base)] sm:border border-[var(--border)] rounded-none sm:rounded-xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Top Bar Floating Circular Close Button */}
          <div className="absolute top-4 right-4 z-40">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/60 border border-[var(--border)] text-white hover:bg-[var(--bg-hover)] transition-all flex items-center justify-center backdrop-blur-md cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Dossier Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/20">
            
            <ProfileHeader 
              player={player} 
              computedStats={computedStats} 
              selectedSeasonId={selectedSeasonId}
            />

            <SeasonSelector 
              availableSeasons={availableSeasons}
              selectedSeasonId={selectedSeasonId}
              onSelect={setSelectedSeasonId}
              playerRank={player?.rank}
            />

            <FilterBar 
              availableMaps={availableMaps}
              availableAgents={availableAgents}
              selectedMode={selectedMode}
              selectedMap={selectedMap}
              selectedOutcome={selectedOutcome}
              selectedAgent={selectedAgent}
              onSelectMode={setSelectedMode}
              onSelectMap={setSelectedMap}
              onSelectOutcome={setSelectedOutcome}
              onSelectAgent={setSelectedAgent}
              onReset={() => {
                setSelectedMode('');
                setSelectedMap('');
                setSelectedOutcome('');
                setSelectedAgent('');
              }}
            />

            <div className="p-4 sm:p-6 space-y-6 max-w-[1200px] mx-auto">
              
              <StatsOverview 
                stats={computedStats} 
                player={player} 
                filteredMatches={filteredMatches}
                selectedSeasonId={selectedSeasonId}
              />

              {(!selectedMode || normaliseMode(selectedMode) === 'competitive') && (
                <RRChart 
                  mmrHistory={player.mmrHistory} 
                  selectedSeasonId={selectedSeasonId} 
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <MatchHistory 
                    matches={filteredMatches} 
                    playerPuuid={player.puuid} 
                  />
                </div>
                <div className="space-y-6">
                  <AgentBreakdown 
                    matches={filteredMatches} 
                    player={player} 
                  />
                  <MapPerformance 
                    matches={filteredMatches} 
                    player={player} 
                  />
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
