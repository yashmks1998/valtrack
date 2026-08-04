import React, { useMemo } from 'react';
import { useSquad } from '../context/SquadContext';
import { computeMapSynergy, findSharedMatches } from '../lib/synergy';
import GlassSurface, { SPRINGS } from './GlassSurface';
import GlassButton from './GlassButton';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Trophy, Swords, Zap, Crown, Target } from 'lucide-react';

export default function PlayerDrawer() {
  const { selectedPlayerForDrawer, setSelectedPlayerForDrawer, players, matches, mapsMetadata } = useSquad();

  const handleClose = () => {
    setSelectedPlayerForDrawer(null);
  };

  const playerStats = useMemo(() => {
    if (!selectedPlayerForDrawer) return null;

    const pName = selectedPlayerForDrawer.name.toLowerCase();
    const shared = findSharedMatches(players, matches);
    const mapSynergy = computeMapSynergy(players, matches, mapsMetadata);

    let totalSquadGames = 0;
    let totalSquadWins = 0;
    let totalScore = 0;
    let totalKills = 0;
    let totalDeaths = 0;
    let totalAssists = 0;
    let totalHeadshots = 0;
    let totalShots = 0;

    const agentMap = {};

    shared.forEach((sm) => {
      const matchPlayer = sm.squadMembers.find((sp) => (sp.name || '').toLowerCase() === pName);
      if (matchPlayer) {
        totalSquadGames++;
        if (sm.hasWon) totalSquadWins++;

        const stats = matchPlayer.stats || {};
        totalScore += stats.score || 0;
        totalKills += stats.kills || 0;
        totalDeaths += stats.deaths || 0;
        totalAssists += stats.assists || 0;

        const hs = stats.headshots || 0;
        const bs = stats.bodyshots || 0;
        const ls = stats.legshots || 0;
        totalHeadshots += hs;
        totalShots += hs + bs + ls;

        const agentName = matchPlayer.character || 'Unknown';
        if (!agentMap[agentName]) {
          agentMap[agentName] = {
            agent: agentName,
            icon: matchPlayer.assets?.agent?.small || null,
            games: 0,
            wins: 0,
            score: 0,
          };
        }
        const aObj = agentMap[agentName];
        aObj.games++;
        if (sm.hasWon) aObj.wins++;
        aObj.score += stats.score || 0;
      }
    });

    const topAgents = Object.values(agentMap).map((a) => ({
      ...a,
      winRate: Math.round((a.wins / a.games) * 100),
      avgACS: Math.round(a.score / a.games),
    }));
    topAgents.sort((a, b) => b.games - a.games || b.winRate - a.winRate);

    const winRate = totalSquadGames > 0 ? Math.round((totalSquadWins / totalSquadGames) * 100) : 0;
    const avgACS = totalSquadGames > 0 ? Math.round(totalScore / totalSquadGames) : 0;
    const avgKD = totalDeaths > 0 ? (totalKills / totalDeaths).toFixed(2) : totalKills.toFixed(2);
    const avgHS = totalShots > 0 ? Math.round((totalHeadshots / totalShots) * 100) : 0;

    return {
      totalSquadGames,
      totalSquadWins,
      winRate,
      avgACS,
      avgKD,
      avgHS,
      topAgents: topAgents.slice(0, 3),
    };
  }, [selectedPlayerForDrawer, players, matches, mapsMetadata]);

  if (!selectedPlayerForDrawer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Dimmed Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black backdrop-blur-sm z-40"
        />

        {/* Sheet / Drawer Container */}
        <motion.div
          initial={{ y: '100%', x: 0 }}
          animate={{ y: 0, x: 0 }}
          exit={{ y: '100%', x: 0 }}
          transition={SPRINGS.sheet}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(e, info) => {
            if (info.offset.y > 100) {
              handleClose();
            }
          }}
          className="fixed inset-x-0 bottom-0 max-h-[85vh] rounded-t-[32px] md:relative md:inset-y-0 md:right-0 md:w-96 md:max-h-full md:rounded-l-[32px] md:rounded-r-none z-50 overflow-hidden safe-pb"
        >
          <GlassSurface level="3" className="h-full p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            
            {/* Top iOS Drag Handle (Mobile) */}
            <div className="w-full flex flex-col items-center">
              <div className="w-9 h-1 rounded-full bg-white/30 mb-2 md:hidden" />
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 uppercase font-bold">
                  SQUAD MEMBER CAREER DOSSIER
                </span>
                <GlassButton variant="secondary" size="sm" onClick={handleClose} className="!p-2 !rounded-full">
                  <X className="w-4 h-4 text-white" />
                </GlassButton>
              </div>
            </div>

            {/* Player Card Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-5">
              <div className="w-16 h-16 rounded-2xl bg-black/60 border border-white/20 p-1 overflow-hidden shrink-0 flex items-center justify-center shadow-2xl">
                {selectedPlayerForDrawer.cardSmall ? (
                  <img src={selectedPlayerForDrawer.cardSmall} alt={selectedPlayerForDrawer.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Shield className="w-8 h-8 text-cyan-400" />
                )}
              </div>

              <div>
                <h3 className="font-teko-title text-3xl text-white font-bold tracking-wider leading-none text-glass-shadow">
                  {selectedPlayerForDrawer.name}
                  <span className="text-gray-400 font-mono text-base font-normal">#{selectedPlayerForDrawer.tag}</span>
                </h3>

                <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-gray-300">
                  {selectedPlayerForDrawer.rank?.rankImage && (
                    <img src={selectedPlayerForDrawer.rank.rankImage} alt={selectedPlayerForDrawer.rank.currentTierName} className="w-4 h-4 object-contain" />
                  )}
                  <span className="text-cyan-300 font-bold">
                    {selectedPlayerForDrawer.rank?.currentTierName || 'Unranked'}
                  </span>
                  <span>•</span>
                  <span>Level {selectedPlayerForDrawer.accountLevel || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Stat Line Grid */}
            {playerStats && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-gray-400 uppercase font-bold">
                  Squad Match Stats ({playerStats.totalSquadGames} Games)
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="text-[10px] font-mono text-gray-400">WIN RATE</div>
                    <div className="text-2xl font-teko font-bold text-emerald-400 text-glass-shadow">
                      {playerStats.winRate}%
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="text-[10px] font-mono text-gray-400">AVG ACS</div>
                    <div className="text-2xl font-teko font-bold text-amber-400 text-glass-shadow">
                      {playerStats.avgACS}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="text-[10px] font-mono text-gray-400">K/D RATIO</div>
                    <div className="text-2xl font-teko font-bold text-white text-glass-shadow">
                      {playerStats.avgKD}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                    <div className="text-[10px] font-mono text-gray-400">HEADSHOT %</div>
                    <div className="text-2xl font-teko font-bold text-cyan-300 text-glass-shadow">
                      {playerStats.avgHS}%
                    </div>
                  </div>
                </div>

                {/* Top 3 Played Agents in Squad Matches */}
                {playerStats.topAgents.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono text-gray-400 uppercase font-bold">
                      Top Squad Agents
                    </div>

                    <div className="space-y-2">
                      {playerStats.topAgents.map((ag) => (
                        <div key={ag.agent} className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/20 p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                              {ag.icon ? (
                                <img src={ag.icon} alt={ag.agent} className="w-full h-full object-contain" />
                              ) : (
                                <Shield className="w-4 h-4 text-cyan-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-oswald-header text-sm text-white font-bold">{ag.agent}</div>
                              <div className="text-[10px] text-gray-400 font-mono">{ag.games} {ag.games === 1 ? 'game' : 'games'}</div>
                            </div>
                          </div>

                          <div className="text-right font-mono">
                            <div className="text-xs font-bold text-emerald-400">{ag.winRate}% WR</div>
                            <div className="text-[10px] text-amber-300">{ag.avgACS} ACS</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Close CTA Button */}
            <div className="pt-4 border-t border-white/10">
              <GlassButton variant="primary" size="lg" onClick={handleClose} className="w-full">
                CLOSE DOSSIER
              </GlassButton>
            </div>

          </GlassSurface>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
