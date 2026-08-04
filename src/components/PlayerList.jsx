import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, Trophy, Shield, User, Sparkles } from 'lucide-react';

export default function PlayerList() {
  const { players, removePlayer, matches } = useApp();

  if (players.length === 0) {
    return (
      <div className="bg-val-card/50 border border-dashed border-val-border rounded-xl p-8 text-center text-val-muted">
        <User className="w-10 h-10 mx-auto text-val-muted/40 mb-2" />
        <h3 className="font-val text-lg text-gray-300">No Players in Roster</h3>
        <p className="text-xs text-val-muted max-w-sm mx-auto mt-1">
          Add at least 2 Valorant players above to cross-reference their match history and calculate map synergy scores.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-val text-lg tracking-wide text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-val-gold" />
          Active Player Roster ({players.length})
        </h3>
        <span className="text-xs text-val-muted">
          Showing rank & account stats
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {players.map((player) => {
          // Calculate how many matches in history belong to this player
          const playerMatchesCount = matches.filter((m) =>
            m.players?.all_players?.some((p) => p.puuid?.toLowerCase() === player.puuid?.toLowerCase())
          ).length;

          return (
            <div
              key={player.puuid}
              className="bg-val-card border border-val-border rounded-xl overflow-hidden glass-panel-hover group relative flex flex-col justify-between"
            >
              {/* Header Card Wide Image Background or Gradient */}
              <div className="h-20 bg-val-black/60 relative overflow-hidden flex items-center justify-center">
                {player.cardWide ? (
                  <img
                    src={player.cardWide}
                    alt={player.riotId}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-val-black via-val-dark to-val-card" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-val-card via-val-card/40 to-transparent" />

                {/* Account Level Badge */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-val-black/80 text-[10px] font-mono text-val-cyan border border-val-cyan/30">
                  Lvl {player.accountLevel || 1}
                </span>

                {/* Region Badge */}
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-val-black/80 text-[10px] font-mono text-gray-300 border border-val-border uppercase">
                  {player.region || 'NA'}
                </span>
              </div>

              {/* Player Body Details */}
              <div className="p-4 pt-0 -mt-6 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    {/* Rank Icon or Avatar */}
                    <div className="w-12 h-12 rounded-lg bg-val-black border border-val-border p-1 shadow-md flex items-center justify-center shrink-0">
                      {player.rank?.rankImage ? (
                        <img
                          src={player.rank.rankImage}
                          alt={player.rank.currentTierName}
                          className="w-10 h-10 object-contain"
                        />
                      ) : player.cardSmall ? (
                        <img
                          src={player.cardSmall}
                          alt={player.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <Shield className="w-6 h-6 text-val-cyan" />
                      )}
                    </div>

                    {/* Remove Player Button */}
                    <button
                      onClick={() => removePlayer(player.puuid)}
                      className="p-1.5 rounded-lg text-val-muted hover:text-val-red hover:bg-val-red/10 transition-colors"
                      title="Remove player from roster"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Riot ID */}
                  <div className="mt-2">
                    <h4 className="font-val text-base font-bold tracking-wide text-white truncate">
                      {player.name}
                      <span className="text-val-muted font-mono text-xs font-normal">
                        #{player.tag}
                      </span>
                    </h4>

                    {/* Rank Tier Name */}
                    <p className="text-xs text-val-cyan font-medium flex items-center gap-1 mt-0.5">
                      {player.rank?.currentTierName || 'Unranked'}
                      {player.rank?.rankingInTier ? (
                        <span className="text-[10px] text-val-muted font-mono">
                          ({player.rank.rankingInTier} RR)
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>

                {/* Match Stats Counter */}
                <div className="mt-3 pt-2 border-t border-val-border/60 flex items-center justify-between text-xs text-val-muted">
                  <span>Tracked Matches</span>
                  <span className="font-mono text-white font-semibold">{playerMatchesCount} games</span>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
