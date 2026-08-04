import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield } from 'lucide-react';
import { useSquad } from '../context/SquadContext';

export default function MapCardExpanded({ mapData }) {
  const { players: squadPlayers, setSelectedPlayerForDrawer } = useSquad();
  const { players } = mapData;

  const handlePlayerClick = (e, playerObj) => {
    e.stopPropagation();
    const matchingSquadPlayer = squadPlayers.find(
      (sp) =>
        (playerObj.puuid && sp.puuid && sp.puuid.toLowerCase() === playerObj.puuid.toLowerCase()) ||
        sp.name.toLowerCase() === playerObj.name.toLowerCase()
    );
    setSelectedPlayerForDrawer(matchingSquadPlayer || playerObj);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, delay: 0.08 }}
      className="pt-4 border-t border-white/10 space-y-2.5"
    >
      <div className="text-[11px] font-mono text-gray-400 uppercase font-bold tracking-wider flex items-center justify-between">
        <span>SQUAD PERFORMANCE BREAKDOWN</span>
        <span>TAP PLAYER FOR PROFILE</span>
      </div>

      <div className="space-y-2">
        {players.map((p) => (
          <div
            key={p.puuid || p.name}
            onClick={(e) => handlePlayerClick(e, p)}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer hover:border-cyan-400/50 hover:bg-white/10 ${
              p.isTopPerformer
                ? 'bg-[#ff4655]/15 border-[#ff4655]/40 shadow-glow-red'
                : 'bg-black/40 border-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              {/* Agent Icon */}
              <div className="w-8 h-8 rounded-lg bg-black/60 border border-white/20 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
                {p.topAgentIcon ? (
                  <img src={p.topAgentIcon} alt={p.topAgent} className="w-full h-full object-contain" />
                ) : (
                  <Shield className="w-4 h-4 text-cyan-400" />
                )}
              </div>

              <div className="truncate">
                <div className="font-oswald-header text-sm text-white font-bold flex items-center gap-1 truncate group-hover:text-cyan-300">
                  {p.name}
                  {p.isTopPerformer && (
                    <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0 inline animate-bounce" />
                  )}
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  {p.topAgent} • {p.games} {p.games === 1 ? 'game' : 'games'}
                </div>
              </div>
            </div>

            {/* Stats: ACS, KD, HS% */}
            <div className="text-right font-mono shrink-0">
              <div className="text-xs font-bold text-amber-400">{p.avgACS} ACS</div>
              <div className="text-[11px] text-gray-200">
                {p.avgKD} K/D • <span className="text-cyan-300">{p.avgHeadshot}% HS</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
