import React, { useState } from 'react';
import MatchRow from './MatchRow';
import { ListFilter, ChevronDown } from 'lucide-react';

export default function RecentMatchesList({ matchesList = [], player }) {
  const [displayCount, setDisplayCount] = useState(10);

  if (!matchesList || matchesList.length === 0) {
    return (
      <div className="text-xs font-mono text-gray-400 bg-black/40 border border-white/10 rounded-2xl p-6 text-center">
        No recent match history found for this player.
      </div>
    );
  }

  const visibleMatches = matchesList.slice(0, displayCount);
  const hasMore = displayCount < matchesList.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <ListFilter className="w-5 h-5 text-cyan-400" />
          <h3 className="font-oswald-header text-lg text-white font-bold">
            RECENT MATCH HISTORY ({matchesList.length} GAMES LOGGED)
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Tap row to inspect full scoreboard
        </span>
      </div>

      <div className="space-y-3">
        {visibleMatches.map((m, idx) => (
          <MatchRow key={m.metadata?.matchid || idx} match={m} player={player} />
        ))}
      </div>

      {/* Lazy Load / Show More Matches Button */}
      {hasMore && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setDisplayCount((prev) => prev + 10)}
            className="px-6 py-2.5 rounded-2xl glass-primary-btn text-white font-mono text-xs font-bold shadow-glow-red inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Load More Matches ({matchesList.length - displayCount} remaining)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
