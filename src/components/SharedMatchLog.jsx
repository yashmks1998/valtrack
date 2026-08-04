import React from 'react';
import { useSquad } from '../context/SquadContext';
import { findSharedMatches } from '../lib/synergy';
import GlassSurface from './GlassSurface';
import { Swords, Calendar, Shield } from 'lucide-react';

export default function SharedMatchLog({ filterOptions = {} }) {
  const { players: squadPlayers, matches, setSelectedPlayerForDrawer } = useSquad();

  const sharedMatches = findSharedMatches(squadPlayers, matches, filterOptions);

  if (squadPlayers.length < 2) return null;

  if (sharedMatches.length === 0) {
    return (
      <GlassSurface level="1" className="p-8 text-center text-gray-300 font-mono text-xs">
        No shared matches found for selected filter combination.
      </GlassSurface>
    );
  }

  const handlePlayerClick = (e, sp) => {
    e.stopPropagation();
    const matchingSquadPlayer = squadPlayers.find(
      (p) =>
        (sp.puuid && p.puuid && p.puuid.toLowerCase() === sp.puuid.toLowerCase()) ||
        p.name.toLowerCase() === sp.name.toLowerCase()
    );
    setSelectedPlayerForDrawer(matchingSquadPlayer || sp);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-[#ff4655]" />
          <h3 className="font-oswald-header text-xl text-white font-bold">
            ALL SHARED SQUAD MATCHES ({sharedMatches.length} GAMES LOGGED)
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Tap any player row to view profile
        </span>
      </div>

      <div className="space-y-3">
        {sharedMatches.map((sm, idx) => {
          const isWin = sm.hasWon;
          return (
            <GlassSurface
              key={sm.matchId || idx}
              level="1"
              hoverable
              className={`p-4 sm:p-5 border transition-all ${
                isWin
                  ? '!bg-emerald-950/20 !border-emerald-500/40'
                  : '!bg-red-950/20 !border-red-500/40'
              }`}
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-xl font-oswald-header text-xs font-bold uppercase tracking-wider ${
                      isWin
                        ? 'bg-emerald-500 text-black shadow-glow-cyan'
                        : 'bg-[#ff4655] text-white'
                    }`}
                  >
                    {isWin ? 'VICTORY' : 'DEFEAT'}
                  </span>

                  <div>
                    <h4 className="font-teko-title text-2xl text-white font-bold leading-none">
                      {sm.mapName} <span className="text-sm font-mono text-gray-400 font-normal">({sm.mode})</span>
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-200">
                  {sm.scoreline && (
                    <div className="px-3 py-1 bg-black/40 border border-white/15 rounded-xl text-white font-bold">
                      Score: {sm.scoreline}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{sm.gameStart}</span>
                  </div>
                </div>
              </div>

              {/* Player Stats Grid */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-gray-400 uppercase font-bold">
                  Squad Performance ({sm.squadMembers.length} Members) - Tap to inspect profile
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {sm.squadMembers.map((sp) => {
                    const stats = sp.stats || {};
                    const kdaStr = `${stats.kills || 0} / ${stats.deaths || 0} / ${stats.assists || 0}`;
                    const shots = (stats.headshots || 0) + (stats.bodyshots || 0) + (stats.legshots || 0);
                    const hsPercent = shots > 0 ? Math.round(((stats.headshots || 0) / shots) * 100) : 0;

                    return (
                      <div
                        key={sp.puuid || sp.name}
                        onClick={(e) => handlePlayerClick(e, sp)}
                        className="bg-black/40 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/20 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                            {sp.assets?.agent?.small ? (
                              <img src={sp.assets.agent.small} alt={sp.character} className="w-full h-full object-contain" />
                            ) : (
                              <Shield className="w-4 h-4 text-cyan-400" />
                            )}
                          </div>

                          <div className="truncate">
                            <div className="font-oswald-header text-sm text-white font-bold group-hover:text-cyan-300 transition-colors truncate">
                              {sp.name}<span className="text-gray-400 text-[11px] font-mono">#{sp.tag}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">{sp.character}</div>
                          </div>
                        </div>

                        <div className="text-right font-mono shrink-0">
                          <div className="text-xs font-bold text-amber-400">{stats.score || 0} ACS</div>
                          <div className="text-[11px] text-gray-200">{kdaStr}</div>
                          <div className="text-[10px] text-cyan-300">{hsPercent}% HS</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </GlassSurface>
          );
        })}
      </div>
    </div>
  );
}
