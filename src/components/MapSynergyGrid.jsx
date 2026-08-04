import React, { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext';
import { computeMapSynergy } from '../utils/synergy';
import MapSynergyCard from './MapSynergyCard';
import { LayoutGrid, Filter, Trophy, Swords, Zap, AlertCircle } from 'lucide-react';

export default function MapSynergyGrid() {
  const { players, matches, mapsMetadata } = useApp();
  const [sortBy, setSortBy] = useState('winRate'); // 'winRate' | 'matches' | 'acs'

  // Compute map synergy data using pure function
  const synergyData = useMemo(() => {
    return computeMapSynergy(players, matches, mapsMetadata);
  }, [players, matches, mapsMetadata]);

  // Sorted Synergy Data
  const sortedData = useMemo(() => {
    if (!synergyData) return [];
    return [...synergyData].sort((a, b) => {
      if (sortBy === 'winRate') return b.winRate - a.winRate || b.totalMatches - a.totalMatches;
      if (sortBy === 'matches') return b.totalMatches - a.totalMatches || b.winRate - a.winRate;
      if (sortBy === 'acs') return b.squadAvgAcs - a.squadAvgAcs;
      return 0;
    });
  }, [synergyData, sortBy]);

  // Calculate overall summary metrics
  const totalSharedGames = useMemo(() => {
    return synergyData.reduce((acc, curr) => acc + curr.totalMatches, 0);
  }, [synergyData]);

  const totalWins = useMemo(() => {
    return synergyData.reduce((acc, curr) => acc + curr.wins, 0);
  }, [synergyData]);

  const overallWinRate = totalSharedGames > 0 ? Math.round((totalWins / totalSharedGames) * 100) : 0;

  const topMap = sortedData.length > 0 ? sortedData[0] : null;

  // Empty State logic
  if (players.length < 2) {
    return (
      <div className="bg-val-card border border-val-border rounded-xl p-10 text-center space-y-4 max-w-2xl mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-val-red/10 border border-val-red/30 flex items-center justify-center mx-auto text-val-red">
          <Swords className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-val text-2xl text-white">Minimum 2 Players Required</h3>
          <p className="text-sm text-val-muted mt-1">
            To track player synergy and map win rates, please search and add at least 2 Valorant players to your active roster above.
          </p>
        </div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="bg-val-card border border-val-border rounded-xl p-10 text-center space-y-4 max-w-2xl mx-auto my-8">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <div>
          <h3 className="font-val text-2xl text-white">No Shared Matches Found</h3>
          <p className="text-sm text-val-muted mt-1">
            We searched recent match history for the {players.length} active players, but found 0 recent games where 2 or more played together on the same team.
          </p>
        </div>
        <p className="text-xs text-val-muted">
          Tip: Add players who actively queue competitive, unranked, or custom games together in the same region.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Overview Summary Dashboard Banner */}
      <div className="bg-gradient-to-r from-val-card via-val-dark to-val-card border border-val-border rounded-xl p-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 divide-y md:divide-y-0 md:divide-x divide-val-border/60">
          
          {/* Total Shared Games */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-val-black border border-val-border flex items-center justify-center text-val-cyan shrink-0">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-val-muted font-mono uppercase">Shared Squad Games</div>
              <div className="font-val text-2xl text-white font-bold tracking-wide">
                {totalSharedGames} <span className="text-xs font-normal text-val-muted font-mono">({totalWins} Wins)</span>
              </div>
            </div>
          </div>

          {/* Overall Duo/Squad Win Rate */}
          <div className="flex items-center gap-3 md:pl-4 pt-3 md:pt-0">
            <div className="w-10 h-10 rounded-lg bg-val-black border border-val-border flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-val-muted font-mono uppercase">Overall Synergy Win Rate</div>
              <div className="font-val text-2xl text-emerald-400 font-bold tracking-wide">
                {overallWinRate}%
              </div>
            </div>
          </div>

          {/* Top Map Performer */}
          <div className="flex items-center gap-3 md:pl-4 pt-3 md:pt-0">
            <div className="w-10 h-10 rounded-lg bg-val-black border border-val-border flex items-center justify-center text-val-gold shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-val-muted font-mono uppercase">Strongest Map</div>
              <div className="font-val text-2xl text-val-gold font-bold tracking-wide">
                {topMap?.displayName || 'N/A'} <span className="text-xs font-mono font-normal text-emerald-400">({topMap?.winRate}%)</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Grid Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-val-red" />
          <h2 className="font-val text-xl tracking-wider text-white">
            MAP SYNERGY BREAKDOWN ({sortedData.length} MAPS)
          </h2>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-val-muted" />
          <span className="text-val-muted font-mono">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-val-card border border-val-border rounded-lg px-3 py-1.5 text-white outline-none cursor-pointer focus:border-val-red"
          >
            <option value="winRate">Highest Win Rate %</option>
            <option value="matches">Most Shared Games</option>
            <option value="acs">Highest Squad ACS</option>
          </select>
        </div>
      </div>

      {/* Map Synergy Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedData.map((mapData) => (
          <MapSynergyCard key={mapData.mapName} mapData={mapData} />
        ))}
      </div>

    </div>
  );
}
