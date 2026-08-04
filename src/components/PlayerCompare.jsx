import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { computePairSynergy } from '../utils/synergy';
import { GitCompare, Trophy, Swords, Zap, ArrowRight, Shield, Crown, Sparkles } from 'lucide-react';

export default function PlayerCompare() {
  const { players, matches, mapsMetadata, loadPresetSquad } = useApp();

  // Selected player IDs for comparison
  const [p1Puuid, setP1Puuid] = useState(() => (players.length > 0 ? players[0].puuid : ''));
  const [p2Puuid, setP2Puuid] = useState(() => (players.length > 1 ? players[1].puuid : ''));

  // Automatically update p1 and p2 if players change
  const validP1 = players.find((p) => p.puuid === p1Puuid) ? p1Puuid : players[0]?.puuid || '';
  const validP2 = players.find((p) => p.puuid === p2Puuid && p.puuid !== validP1)
    ? p2Puuid
    : players.find((p) => p.puuid !== validP1)?.puuid || '';

  // Calculate pair synergy data using pure function
  const pairData = useMemo(() => {
    if (!validP1 || !validP2 || validP1 === validP2) return null;
    return computePairSynergy(validP1, validP2, matches, players, mapsMetadata);
  }, [validP1, validP2, matches, players, mapsMetadata]);

  if (players.length < 2) {
    return (
      <div className="bg-val-card border border-val-border rounded-xl p-10 text-center space-y-4 max-w-2xl mx-auto my-8">
        <GitCompare className="w-12 h-12 text-val-red mx-auto" />
        <div>
          <h3 className="font-val text-2xl text-white">Duo Comparison Mode</h3>
          <p className="text-sm text-val-muted mt-1">
            Compare head-to-head performance and synergy between any 2 players in your roster. Please add at least 2 players to start.
          </p>
        </div>
        <button
          onClick={loadPresetSquad}
          className="bg-val-red hover:bg-val-red-hover text-white font-val tracking-wider px-5 py-2.5 rounded-lg shadow-glow-red inline-flex items-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>LOAD PRO DUO PRESET</span>
        </button>
      </div>
    );
  }

  const p1 = players.find((p) => p.puuid === validP1);
  const p2 = players.find((p) => p.puuid === validP2);

  return (
    <div className="space-y-6">
      
      {/* Player Selection Dropdowns */}
      <div className="bg-val-card border border-val-border rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="w-5 h-5 text-val-red" />
          <h2 className="font-val text-xl tracking-wider text-white">SELECT DUO FOR COMPARISON</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          
          {/* Player 1 Selector */}
          <div className="md:col-span-5 bg-val-black/60 border border-val-border rounded-lg p-3">
            <label className="text-xs text-val-cyan font-mono uppercase mb-1 block">Player 1</label>
            <select
              value={validP1}
              onChange={(e) => setP1Puuid(e.target.value)}
              className="w-full bg-val-card border border-val-border rounded px-3 py-2 text-white outline-none focus:border-val-red text-sm font-semibold"
            >
              {players.map((p) => (
                <option key={p.puuid} value={p.puuid} disabled={p.puuid === validP2}>
                  {p.name}#{p.tag} ({p.rank?.currentTierName || 'Unranked'})
                </option>
              ))}
            </select>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-1 text-center font-val text-2xl font-bold text-val-red">
            VS
          </div>

          {/* Player 2 Selector */}
          <div className="md:col-span-5 bg-val-black/60 border border-val-border rounded-lg p-3">
            <label className="text-xs text-val-cyan font-mono uppercase mb-1 block">Player 2</label>
            <select
              value={validP2}
              onChange={(e) => setP2Puuid(e.target.value)}
              className="w-full bg-val-card border border-val-border rounded px-3 py-2 text-white outline-none focus:border-val-red text-sm font-semibold"
            >
              {players.map((p) => (
                <option key={p.puuid} value={p.puuid} disabled={p.puuid === validP1}>
                  {p.name}#{p.tag} ({p.rank?.currentTierName || 'Unranked'})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Comparison Results */}
      {pairData && p1 && p2 ? (
        <div className="space-y-6">
          
          {/* Duo Summary Stats Banner */}
          <div className="bg-gradient-to-r from-val-card via-val-dark to-val-card border border-val-border rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              
              {/* Player 1 Card */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-val-black border border-val-border p-1 mb-2 shadow-md">
                  {p1.rank?.rankImage ? (
                    <img src={p1.rank.rankImage} alt={p1.rank.currentTierName} className="w-full h-full object-contain" />
                  ) : (
                    <Shield className="w-full h-full text-val-cyan" />
                  )}
                </div>
                <h3 className="font-val text-xl text-white font-bold">{p1.name}</h3>
                <span className="text-xs text-val-muted font-mono">#{p1.tag}</span>
                <div className="mt-2 text-xs font-mono text-val-cyan font-bold">{pairData.p1AvgAcs} AVG ACS</div>
              </div>

              {/* Center Head-to-Head Winrate */}
              <div className="flex flex-col items-center justify-center border-y md:border-y-0 md:border-x border-val-border/60 py-4 md:py-0">
                <div className="text-xs text-val-muted font-mono uppercase tracking-widest">DUO WIN RATE</div>
                <div className="font-val text-4xl text-emerald-400 font-bold tracking-wider my-1">
                  {pairData.winRate}%
                </div>
                <p className="text-xs text-gray-300 font-mono">
                  {pairData.wins} Wins - {pairData.losses} Losses ({pairData.totalSharedMatches} Games Together)
                </p>
              </div>

              {/* Player 2 Card */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-xl bg-val-black border border-val-border p-1 mb-2 shadow-md">
                  {p2.rank?.rankImage ? (
                    <img src={p2.rank.rankImage} alt={p2.rank.currentTierName} className="w-full h-full object-contain" />
                  ) : (
                    <Shield className="w-full h-full text-val-cyan" />
                  )}
                </div>
                <h3 className="font-val text-xl text-white font-bold">{p2.name}</h3>
                <span className="text-xs text-val-muted font-mono">#{p2.tag}</span>
                <div className="mt-2 text-xs font-mono text-val-cyan font-bold">{pairData.p2AvgAcs} AVG ACS</div>
              </div>

            </div>
          </div>

          {/* Best & Worst Map Together */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Best Map */}
            <div className="bg-val-card border border-emerald-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-emerald-400 font-mono uppercase font-bold">BEST DUO MAP</div>
                <div className="font-val text-xl text-white">{pairData.bestMap?.mapName || 'N/A'}</div>
                <p className="text-xs text-val-muted font-mono">
                  {pairData.bestMap ? `${pairData.bestMap.winRate}% Win Rate (${pairData.bestMap.wins}W - ${pairData.bestMap.losses}L)` : 'No games played'}
                </p>
              </div>
            </div>

            {/* Worst Map */}
            <div className="bg-val-card border border-red-500/30 rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-red-400 font-mono uppercase font-bold">WEAKEST DUO MAP</div>
                <div className="font-val text-xl text-white">{pairData.worstMap?.mapName || 'N/A'}</div>
                <p className="text-xs text-val-muted font-mono">
                  {pairData.worstMap ? `${pairData.worstMap.winRate}% Win Rate (${pairData.worstMap.wins}W - ${pairData.worstMap.losses}L)` : 'No games played'}
                </p>
              </div>
            </div>

          </div>

          {/* Map-by-Map Head-to-Head Table */}
          <div className="bg-val-card border border-val-border rounded-xl p-5 shadow-lg">
            <h3 className="font-val text-lg text-white mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-val-gold" />
              MAP-BY-MAP DUO PERFORMANCE
            </h3>

            {pairData.mapBreakdown.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-val-black/60 text-val-muted font-mono uppercase text-[11px] border-b border-val-border">
                    <tr>
                      <th className="p-3">Map</th>
                      <th className="p-3">Games</th>
                      <th className="p-3">Duo Win Rate</th>
                      <th className="p-3">{p1.name} ACS</th>
                      <th className="p-3">{p2.name} ACS</th>
                      <th className="p-3 text-right">Top ACS Carry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-val-border/40">
                    {pairData.mapBreakdown.map((row) => {
                      const p1Higher = row.p1AvgAcs >= row.p2AvgAcs;
                      return (
                        <tr key={row.mapName} className="hover:bg-val-black/40 transition-colors">
                          <td className="p-3 font-val text-sm font-bold text-white">{row.mapName}</td>
                          <td className="p-3 font-mono text-gray-300">{row.matchesCount}</td>
                          <td className="p-3 font-mono font-bold text-emerald-400">{row.winRate}%</td>
                          <td className="p-3 font-mono text-gray-200">{row.p1AvgAcs}</td>
                          <td className="p-3 font-mono text-gray-200">{row.p2AvgAcs}</td>
                          <td className="p-3 text-right font-val text-sm font-semibold">
                            <span className={p1Higher ? 'text-val-cyan' : 'text-val-red'}>
                              {p1Higher ? p1.name : p2.name} (+{Math.abs(row.acsDiff)})
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-val-muted text-xs">
                No shared matches found between {p1.name} and {p2.name}.
              </div>
            )}
          </div>

        </div>
      ) : null}

    </div>
  );
}
