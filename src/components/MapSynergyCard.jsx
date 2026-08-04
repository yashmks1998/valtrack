import React from 'react';
import { Trophy, Swords, Zap, ChevronRight, Crown, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MapSynergyCard({ mapData }) {
  const { setSelectedMapForModal } = useApp();

  const {
    displayName,
    mapName,
    splashImage,
    totalMatches,
    wins,
    losses,
    winRate,
    squadAvgAcs,
    squadKdaRatio,
    bestPlayer,
    players,
  } = mapData;

  // Win Rate Color Coding
  const getWinRateBadgeClass = (wr) => {
    if (wr >= 60) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-cyan';
    if (wr >= 45) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-red-500/20 text-red-400 border-red-500/40';
  };

  return (
    <div className="bg-val-card border border-val-border rounded-xl overflow-hidden glass-panel-hover group relative flex flex-col justify-between shadow-xl">
      
      {/* Background Splash Art with Dark Gradient Overlay */}
      <div className="h-44 relative overflow-hidden bg-val-black">
        {splashImage ? (
          <img
            src={splashImage}
            alt={displayName}
            className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-val-black via-val-dark to-val-card opacity-80" />
        )}
        
        {/* Dark Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-val-card via-val-black/60 to-transparent" />

        {/* Map Header Title & Win Rate Badge */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div>
            <h3 className="font-val text-2xl font-bold tracking-wider text-white drop-shadow-md">
              {displayName || mapName}
            </h3>
            <p className="text-xs text-gray-300 font-mono flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-val-cyan" />
              {totalMatches} {totalMatches === 1 ? 'Shared Match' : 'Shared Matches'} ({wins}W - {losses}L)
            </p>
          </div>

          {/* Win Rate Badge */}
          <div className={`px-3 py-1 rounded-lg border font-val text-lg tracking-wide ${getWinRateBadgeClass(winRate)}`}>
            {winRate}% WR
          </div>
        </div>

        {/* Squad Performance Highlights Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
          {/* Combined ACS */}
          <div className="bg-val-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-val-border text-gray-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-val-gold" />
            <span>Squad ACS: <strong className="text-white font-mono">{squadAvgAcs}</strong></span>
          </div>

          {/* Squad KDA */}
          <div className="bg-val-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-val-border text-gray-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-val-red" />
            <span>KDA: <strong className="text-white font-mono">{squadKdaRatio}</strong></span>
          </div>
        </div>

      </div>

      {/* Card Content - Top Performer Highlight & Roster Breakdown */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        {/* Best Performer MVP Banner */}
        {bestPlayer ? (
          <div className="bg-val-black/60 border border-val-gold/30 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-val-gold/20 border border-val-gold flex items-center justify-center overflow-hidden">
                  {bestPlayer.topAgentIcon ? (
                    <img src={bestPlayer.topAgentIcon} alt={bestPlayer.topAgent} className="w-7 h-7 object-contain" />
                  ) : (
                    <Crown className="w-4 h-4 text-val-gold" />
                  )}
                </div>
                <span className="absolute -top-1 -right-1 bg-val-gold text-val-black p-0.5 rounded-full">
                  <Crown className="w-2.5 h-2.5 fill-val-black" />
                </span>
              </div>

              <div>
                <div className="text-[10px] text-val-gold uppercase font-bold tracking-widest flex items-center gap-1">
                  MAP MVP
                </div>
                <div className="text-xs font-val font-bold text-white tracking-wide">
                  {bestPlayer.name}
                  <span className="text-[10px] text-val-muted font-normal ml-1">({bestPlayer.topAgent})</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-bold text-val-gold">{bestPlayer.avgAcs} ACS</div>
              <div className="text-[10px] text-val-muted font-mono">{bestPlayer.kdaRatio} KDA</div>
            </div>
          </div>
        ) : null}

        {/* Squad Performance Mini Leaderboard */}
        <div className="space-y-1.5 pt-1">
          <div className="text-[11px] text-val-muted font-mono uppercase tracking-wider">Squad Performance Leaderboard</div>
          {players.slice(0, 3).map((p, idx) => (
            <div key={p.puuid} className="flex items-center justify-between text-xs py-1 border-b border-val-border/40 last:border-0">
              <div className="flex items-center gap-2 truncate">
                <span className="text-[10px] font-mono text-val-muted w-3">{idx + 1}.</span>
                <span className="font-medium text-gray-200 truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-gray-300">{p.avgAcs} ACS</span>
                <span className="text-val-muted text-[11px]">{p.kdaRatio} K/D</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Match History Button */}
        <button
          onClick={() => setSelectedMapForModal(mapData)}
          className="w-full mt-2 py-2 px-3 bg-val-black/80 hover:bg-val-red/20 text-xs font-val tracking-wider text-gray-200 hover:text-white border border-val-border hover:border-val-red/50 rounded-lg flex items-center justify-center gap-1.5 transition-all"
        >
          <span>VIEW MATCH LOG ({totalMatches})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
}
