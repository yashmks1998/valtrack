import React, { useMemo } from 'react';
import GlassSurface from './GlassSurface';
import { useSquad } from '../context/SquadContext';
import { ALL_VALORANT_SEASONS_MAP, resolveSeasonName } from '../api/valorantApi';
import { ArrowUpDown, Layers, Calendar, Filter, Swords, User, Trophy } from 'lucide-react';

export default function SortFilterBar({
  sortBy,
  setSortBy,
  filterOptions,
  setFilterOptions,
  min3GamesFilter,
  setMin3GamesFilter,
  totalMapsCount,
}) {
  const { players, matches, seasonsMetadata } = useSquad();

  const handleFilterChange = (key, value) => {
    setFilterOptions((prev) => ({ ...prev, [key]: value }));
  };

  // Build complete list of all Episode & Act options for dropdown
  const seasonOptions = useMemo(() => {
    const list = [
      ['all', 'All Seasons & Acts (Default)'],
      ...Object.entries(ALL_VALORANT_SEASONS_MAP),
    ];

    // Extract any unexpected season IDs present in matches
    const existingKeys = new Set(list.map(([k]) => k.toLowerCase()));
    matches.forEach((m) => {
      const sId = m.metadata?.season_id || m.metadata?.season;
      if (sId && !existingKeys.has(sId.toLowerCase())) {
        const resolvedName = resolveSeasonName(sId, seasonsMetadata);
        list.push([sId, resolvedName]);
        existingKeys.add(sId.toLowerCase());
      }
    });

    return list;
  }, [matches, seasonsMetadata]);

  return (
    <GlassSurface level="2" className="p-4 sm:p-5 flex flex-col space-y-4 shadow-xl">
      {/* Title & Active Filter Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#ff4655]" />
          <span className="font-oswald-header text-lg text-white">
            MAP PERFORMANCE & MATCH FILTERS ({totalMapsCount} MAPS)
          </span>
        </div>

        {/* Reset All Filters Button */}
        <button
          type="button"
          onClick={() => {
            setFilterOptions({ season: 'all', mode: 'all', outcome: 'all', player: 'all' });
            setSortBy('winRate');
            setMin3GamesFilter(false);
          }}
          className="text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

      {/* Filter Dropdowns Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        
        {/* 1. Complete Episodes & Acts Filter */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-2xl px-3 py-2 text-gray-200">
          <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex-1 truncate">
            <div className="text-[10px] text-gray-400 font-mono">EPISODE / ACT</div>
            <select
              value={filterOptions.season || 'all'}
              onChange={(e) => handleFilterChange('season', e.target.value)}
              className="bg-transparent text-white font-mono text-xs outline-none cursor-pointer w-full"
            >
              {seasonOptions.map(([id, label]) => (
                <option key={id} value={id} className="bg-[#0a0b0f] text-white">
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Game Mode Filter */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-2xl px-3 py-2 text-gray-200">
          <Swords className="w-4 h-4 text-[#ff4655] shrink-0" />
          <div className="flex-1 truncate">
            <div className="text-[10px] text-gray-400 font-mono">GAME MODE</div>
            <select
              value={filterOptions.mode || 'all'}
              onChange={(e) => handleFilterChange('mode', e.target.value)}
              className="bg-transparent text-white font-mono text-xs outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-[#0a0b0f] text-white">All Game Modes</option>
              <option value="competitive" className="bg-[#0a0b0f] text-white">Competitive</option>
              <option value="unrated" className="bg-[#0a0b0f] text-white">Unrated</option>
              <option value="swiftplay" className="bg-[#0a0b0f] text-white">Swiftplay</option>
              <option value="deathmatch" className="bg-[#0a0b0f] text-white">Deathmatch</option>
            </select>
          </div>
        </div>

        {/* 3. Outcome / Result Filter */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-2xl px-3 py-2 text-gray-200">
          <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="flex-1 truncate">
            <div className="text-[10px] text-gray-400 font-mono">OUTCOME</div>
            <select
              value={filterOptions.outcome || 'all'}
              onChange={(e) => handleFilterChange('outcome', e.target.value)}
              className="bg-transparent text-white font-mono text-xs outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-[#0a0b0f] text-white">All Outcomes</option>
              <option value="victory" className="bg-[#0a0b0f] text-white">Victories (Wins)</option>
              <option value="defeat" className="bg-[#0a0b0f] text-white">Defeats (Losses)</option>
            </select>
          </div>
        </div>

        {/* 4. Squad Player Filter */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-2xl px-3 py-2 text-gray-200">
          <User className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="flex-1 truncate">
            <div className="text-[10px] text-gray-400 font-mono">FILTER PLAYER</div>
            <select
              value={filterOptions.player || 'all'}
              onChange={(e) => handleFilterChange('player', e.target.value)}
              className="bg-transparent text-white font-mono text-xs outline-none cursor-pointer w-full"
            >
              <option value="all" className="bg-[#0a0b0f] text-white">All Squad Members</option>
              {players.map((p) => (
                <option key={p.puuid || p.name} value={p.name} className="bg-[#0a0b0f] text-white">
                  {p.name}#{p.tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 5. Sort By Dropdown */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-2xl px-3 py-2 text-gray-200">
          <ArrowUpDown className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex-1 truncate">
            <div className="text-[10px] text-gray-400 font-mono">SORT BY</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white font-mono text-xs outline-none cursor-pointer w-full"
            >
              <option value="winRate" className="bg-[#0a0b0f] text-white">Win Rate %</option>
              <option value="games" className="bg-[#0a0b0f] text-white">Most Games Played</option>
              <option value="acs" className="bg-[#0a0b0f] text-white">Highest Squad ACS</option>
            </select>
          </div>
        </div>

      </div>
    </GlassSurface>
  );
}
