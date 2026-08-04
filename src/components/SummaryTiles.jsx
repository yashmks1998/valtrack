import React, { useMemo } from 'react';
import { useSquad } from '../context/SquadContext';
import { computeMapSynergy, findSharedMatches } from '../lib/synergy';
import GlassSurface from './GlassSurface';
import { Swords, Trophy, MapPin, Crown, TrendingUp, Filter } from 'lucide-react';

export default function SummaryTiles({ filterOptions = {}, onResetFilters }) {
  const { players, matches, mapsMetadata } = useSquad();

  const synergy = useMemo(() => {
    return computeMapSynergy(players, matches, mapsMetadata, filterOptions);
  }, [players, matches, mapsMetadata, filterOptions]);

  const sharedMatches = useMemo(() => {
    return findSharedMatches(players, matches, filterOptions);
  }, [players, matches, filterOptions]);

  if (players.length < 2) return null;

  const totalSharedGames = sharedMatches.length;
  const totalWins = sharedMatches.filter((m) => m.hasWon).length;
  const totalLosses = totalSharedGames - totalWins;
  const squadWinRate = totalSharedGames > 0 ? Math.round((totalWins / totalSharedGames) * 100) : 0;

  let mostPlayedMap = 'N/A';
  let mostPlayedCount = 0;
  if (synergy.length > 0) {
    const sortedByGames = [...synergy].sort((a, b) => b.gamesPlayed - a.gamesPlayed);
    mostPlayedMap = sortedByGames[0].map;
    mostPlayedCount = sortedByGames[0].gamesPlayed;
  }

  let bestMap = 'N/A';
  let bestWinRate = 0;
  let bestGamesCount = 0;
  if (synergy.length > 0) {
    const min3Pool = synergy.filter((m) => m.gamesPlayed >= 3);
    const poolToUse = min3Pool.length > 0 ? min3Pool : synergy;
    bestMap = poolToUse[0].map;
    bestWinRate = poolToUse[0].winRate;
    bestGamesCount = poolToUse[0].gamesPlayed;
  }

  const activeFilters = Object.entries(filterOptions).filter(([_, v]) => v && v !== 'all');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">
          SQUAD OVERVIEW DASHBOARD
        </span>
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              {activeFilters.length} Active Filters Applied
            </span>
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-[10px] font-mono font-bold text-[#ff4655] hover:text-white bg-[#ff4655]/20 hover:bg-[#ff4655] px-2.5 py-0.5 rounded-full border border-[#ff4655]/40 transition-all cursor-pointer flex items-center gap-1 shadow-glow-red"
              >
                <Filter className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tile 1: Total Shared Matches */}
        <GlassSurface level="1" hoverable className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-300 uppercase">SHARED MATCHES</span>
            <Swords className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <div className="font-teko text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-none text-glass-shadow">
              {totalSharedGames}
            </div>
            <div className="text-xs font-mono text-gray-300 mt-1">
              {totalWins} Wins - {totalLosses} Losses
            </div>
          </div>
        </GlassSurface>

        {/* Tile 2: Overall Squad Win Rate */}
        <GlassSurface level="1" hoverable className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-300 uppercase">SQUAD WIN RATE</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <div className="font-teko text-3xl sm:text-4xl lg:text-5xl text-emerald-400 font-bold leading-none flex items-center gap-1.5 text-glass-shadow">
              {squadWinRate}%
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs font-mono text-gray-300 mt-1">
              Across Shared Games
            </div>
          </div>
        </GlassSurface>

        {/* Tile 3: Most Played Map */}
        <GlassSurface level="1" hoverable className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-300 uppercase">MOST PLAYED MAP</span>
            <MapPin className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <div className="font-teko text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-none truncate text-glass-shadow">
              {mostPlayedMap}
            </div>
            <div className="text-xs font-mono text-gray-300 mt-1">
              {mostPlayedCount} {mostPlayedCount === 1 ? 'game' : 'games'} logged
            </div>
          </div>
        </GlassSurface>

        {/* Tile 4: Best Map */}
        <GlassSurface level="1" hoverable className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-300 uppercase">BEST MAP</span>
            <Crown className="w-4 h-4 text-[#ff4655]" />
          </div>
          <div className="mt-3">
            <div className="font-teko text-3xl sm:text-4xl lg:text-5xl text-[#ff4655] font-bold leading-none truncate text-glass-shadow">
              {bestMap}
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold mt-1">
              {bestWinRate}% WR ({bestGamesCount} games)
            </div>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
