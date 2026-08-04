import React, { useState, useMemo, useEffect } from 'react';
import { SquadProvider, useSquad } from './context/SquadContext';
import GlassBackground from './components/GlassBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AddPlayerForm from './components/AddPlayerForm';
import PlayerChipRow from './components/PlayerChipRow';
import SummaryTiles from './components/SummaryTiles';
import SortFilterBar from './components/SortFilterBar';
import MapCard from './components/MapCard';
import SharedMatchLog from './components/SharedMatchLog';
import PlayerProfilePage from './components/PlayerProfile/PlayerProfilePage';
import ValorantLoader from './components/ValorantLoader';
import EmptyState from './components/EmptyState';
import GlassSurface from './components/GlassSurface';
import { computeMapSynergy } from './lib/synergy';
import { ExternalLink, AlertTriangle, LayoutGrid, ListFilter } from 'lucide-react';

function SquadSynergyAppContent() {
  const { players, matches, mapsMetadata, isLoading, toastMessage, selectedPlayerForDrawer, setSelectedPlayerForDrawer } = useSquad();

  // Active View Tab: 'maps' | 'matchesLog'
  const [viewTab, setViewTab] = useState('maps');

  // Complete Multi-Filter State
  const [filterOptions, setFilterOptions] = useState({
    season: 'all',
    mode: 'all',
    outcome: 'all',
    player: 'all',
  });

  // Sort & Min 3 Games Filter state
  const [sortBy, setSortBy] = useState('winRate');
  const [min3GamesFilter, setMin3GamesFilter] = useState(false);

  const resetAllFilters = () => {
    setFilterOptions({ season: 'all', mode: 'all', outcome: 'all', player: 'all' });
    setSortBy('winRate');
    setMin3GamesFilter(false);
  };

  // Auto-reset player filter if the selected player is removed from the squad roster
  useEffect(() => {
    if (filterOptions.player !== 'all') {
      const stillInSquad = players.some(
        (p) => p.name.toLowerCase() === filterOptions.player.toLowerCase()
      );
      if (!stillInSquad) {
        setFilterOptions((prev) => ({ ...prev, player: 'all' }));
      }
    }
  }, [players, filterOptions.player]);

  // Compute map synergy filtered by complete filterOptions
  const synergyData = useMemo(() => {
    return computeMapSynergy(players, matches, mapsMetadata, filterOptions);
  }, [players, matches, mapsMetadata, filterOptions]);

  // Apply Filter & Sort
  const filteredAndSortedMaps = useMemo(() => {
    if (!synergyData) return [];

    let pool = [...synergyData];
    if (min3GamesFilter) {
      const min3Pool = pool.filter((m) => m.gamesPlayed >= 3);
      if (min3Pool.length > 0) pool = min3Pool;
    }

    pool.sort((a, b) => {
      if (sortBy === 'winRate') return b.winRate - a.winRate || b.gamesPlayed - a.gamesPlayed;
      if (sortBy === 'games') return b.gamesPlayed - a.gamesPlayed || b.winRate - a.winRate;
      if (sortBy === 'acs') return b.squadAvgACS - a.squadAvgACS;
      return 0;
    });

    return pool;
  }, [synergyData, sortBy, min3GamesFilter]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0a0b0f] text-gray-100 relative selection:bg-[#ff4655] selection:text-white overflow-x-hidden">
      
      {/* Animated Liquid Background Refraction Mesh */}
      <GlassBackground />

      {/* High-Tech Custom Loader Screen */}
      {isLoading && <ValorantLoader text="SABAR KARLE MC" />}

      <div className="relative z-10">
        {/* Floating Dynamic Island Navbar */}
        <Navbar />

        {/* Hero Header */}
        <Hero />

        {/* Toast Notification Bar */}
        {toastMessage && (
          <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 text-center text-xs font-mono text-amber-300 flex items-center justify-center gap-2 animate-fadeIn z-50 backdrop-blur-md">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Workspace Container */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* Add Squad Form Section */}
          <AddPlayerForm />

          {/* Player Chips Row */}
          <PlayerChipRow />

          {/* Squad Overview Dashboard Summary Tiles */}
          <SummaryTiles filterOptions={filterOptions} onResetFilters={resetAllFilters} />

          {/* View Tab Switcher */}
          {players.length >= 2 && (
            <GlassSurface level="2" className="!rounded-2xl p-1.5 font-oswald-header text-sm w-fit shadow-xl">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewTab('maps')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    viewTab === 'maps'
                      ? 'glass-primary-btn text-white font-bold shadow-glow-red'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>MAP SYNERGY BREAKDOWN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewTab('matchesLog')}
                  className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                    viewTab === 'matchesLog'
                      ? 'glass-primary-btn text-white font-bold shadow-glow-red'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <ListFilter className="w-4 h-4" />
                  <span>ALL SHARED MATCHES LOG</span>
                </button>
              </div>
            </GlassSurface>
          )}

          {/* Persistent Filter & Sort Control Bar */}
          {players.length >= 2 && (
            <SortFilterBar
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              min3GamesFilter={min3GamesFilter}
              setMin3GamesFilter={setMin3GamesFilter}
              totalMapsCount={filteredAndSortedMaps.length}
            />
          )}

          {/* Main Content Area */}
          {players.length < 2 ? (
            <EmptyState type={players.length === 1 ? 'one_player' : 'no_players'} />
          ) : viewTab === 'matchesLog' ? (
            <SharedMatchLog filterOptions={filterOptions} />
          ) : filteredAndSortedMaps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedMaps.map((mapData) => (
                <MapCard key={mapData.map} mapData={mapData} />
              ))}
            </div>
          ) : (
            <EmptyState type="no_shared_matches" onResetFilters={resetAllFilters} />
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0b0f]/90 backdrop-blur-2xl py-6 px-4 mt-12 text-center text-xs text-gray-400 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#ff4655] to-pink-600 flex items-center justify-center font-teko text-xs text-white font-bold">V</div>
            <span className="font-teko text-lg tracking-wider text-white">VALORANT SQUAD SYNERGY</span>
            <span className="text-gray-400">• iOS 26 Liquid Glass Edition</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
            <span>
              Powered by{' '}
              <a href="https://docs.henrikdev.xyz/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">
                Henrik Dev API <ExternalLink className="w-3 h-3" />
              </a>
            </span>
            <span>•</span>
            <span>
              Assets from{' '}
              <a href="https://valorant-api.com/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center gap-0.5">
                valorant-api.com <ExternalLink className="w-3 h-3" />
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Full High-Tech Player Profile Page Overlay */}
      {selectedPlayerForDrawer && (
        <PlayerProfilePage
          player={selectedPlayerForDrawer}
          onClose={() => setSelectedPlayerForDrawer(null)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <SquadProvider>
      <SquadSynergyAppContent />
    </SquadProvider>
  );
}
