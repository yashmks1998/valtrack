import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trophy, Swords, Zap, Flame, Shield, Calendar } from 'lucide-react';

export default function MatchDetailModal() {
  const { selectedMapForModal, setSelectedMapForModal } = useApp();

  if (!selectedMapForModal) return null;

  const { displayName, mapName, splashImage, matches, wins, losses, winRate } = selectedMapForModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-val-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-val-card border border-val-border rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Header with Map Splash Background */}
        <div className="h-32 relative overflow-hidden bg-val-black shrink-0 flex items-end p-4">
          {splashImage ? (
            <img src={splashImage} alt={displayName} className="w-full h-full object-cover absolute inset-0 opacity-40" />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-val-card via-val-black/70 to-transparent" />

          {/* Close Button */}
          <button
            onClick={() => setSelectedMapForModal(null)}
            className="absolute top-3 right-3 p-2 rounded-lg bg-val-black/80 border border-val-border text-val-muted hover:text-white hover:border-val-red transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Map Title Info */}
          <div className="relative z-10 flex items-center justify-between w-full">
            <div>
              <h2 className="font-val text-3xl text-white font-bold tracking-wider">{displayName || mapName}</h2>
              <p className="text-xs text-val-muted font-mono flex items-center gap-2">
                <span>{matches.length} Shared Match Log</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">{winRate}% Squad Win Rate</span>
              </p>
            </div>

            <div className="px-3 py-1 bg-val-black/80 border border-val-border rounded-lg text-xs font-mono text-gray-300">
              {wins} Wins / {losses} Losses
            </div>
          </div>
        </div>

        {/* Scrollable Match List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {matches.map((sm, index) => {
            return (
              <div
                key={sm.match?.metadata?.matchid || index}
                className={`border rounded-xl p-4 transition-all ${
                  sm.hasWon
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-red-950/20 border-red-500/30'
                }`}
              >
                {/* Match Header Bar */}
                <div className="flex items-center justify-between border-b border-val-border/40 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-val font-bold uppercase tracking-wider ${
                        sm.hasWon ? 'bg-emerald-500 text-val-black' : 'bg-val-red text-white'
                      }`}
                    >
                      {sm.hasWon ? 'VICTORY' : 'DEFEAT'}
                    </span>
                    <span className="text-xs text-val-muted font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {sm.gameStart}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-gray-300">
                    Mode: <span className="text-white font-semibold">{sm.mode}</span>
                  </div>
                </div>

                {/* Squad Members Stats in this Match */}
                <div className="space-y-2">
                  <div className="text-[11px] text-val-muted font-mono uppercase tracking-wider">
                    Squad Performance
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sm.squadMembers.map((sp) => {
                      const stats = sp.stats || {};
                      const kdaStr = `${stats.kills || 0}/${stats.deaths || 0}/${stats.assists || 0}`;
                      return (
                        <div
                          key={sp.puuid}
                          className="bg-val-black/60 border border-val-border/60 rounded-lg p-2 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            {sp.assets?.agent?.small ? (
                              <img
                                src={sp.assets.agent.small}
                                alt={sp.character}
                                className="w-7 h-7 rounded border border-val-border object-contain bg-val-black"
                              />
                            ) : (
                              <Shield className="w-6 h-6 text-val-cyan" />
                            )}
                            <div>
                              <div className="text-xs font-val font-bold text-white truncate max-w-[100px]">
                                {sp.name}
                              </div>
                              <div className="text-[10px] text-val-muted font-mono">{sp.character}</div>
                            </div>
                          </div>

                          <div className="text-right font-mono">
                            <div className="text-xs font-bold text-val-gold">{stats.score || 0} ACS</div>
                            <div className="text-[10px] text-gray-300">{kdaStr}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
