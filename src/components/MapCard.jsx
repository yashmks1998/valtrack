import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassSurface, { SPRINGS } from './GlassSurface';
import ValorantImage from './ValorantImage';
import MapCardExpanded from './MapCardExpanded';
import { ChevronDown, Trophy, Shield, Swords } from 'lucide-react';
import { useSquad } from '../context/SquadContext';

export default function MapCard({ mapData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { players: squadPlayers, setSelectedPlayerForDrawer } = useSquad();
  const { displayName, splashImage, gamesPlayed, wins, losses, winRate, squadAvgACS, topPerformer } = mapData;

  // Color coding win rate
  const winRateColorClass =
    winRate >= 60
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      : winRate >= 40
      ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
      : 'text-red-400 border-red-500/40 bg-red-500/10';

  const winPercentage = gamesPlayed > 0 ? (wins / gamesPlayed) * 100 : 0;

  const handleTopPerformerClick = (e) => {
    e.stopPropagation();
    if (!topPerformer) return;
    const matchingSquadPlayer = squadPlayers.find(
      (sp) =>
        (topPerformer.puuid && sp.puuid && sp.puuid.toLowerCase() === topPerformer.puuid.toLowerCase()) ||
        sp.name.toLowerCase() === topPerformer.name.toLowerCase()
    );
    setSelectedPlayerForDrawer(matchingSquadPlayer || topPerformer);
  };

  return (
    <motion.div layout transition={SPRINGS.card} className="h-full">
      <GlassSurface
        level={isExpanded ? '2' : '1'}
        interactive
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-full p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer relative group border border-white/20"
      >
        {/* Background Splash Art with Dark Gradient Overlay */}
        {splashImage && (
          <div className="absolute inset-0 z-0 overflow-hidden rounded-[28px] opacity-25 group-hover:opacity-35 transition-opacity">
            <ValorantImage src={splashImage} alt={displayName} type="map" className="absolute inset-0 w-full h-full" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-[#0a0b0f]/80 to-transparent" />
          </div>
        )}

        {/* Content Container */}
        <div className="relative z-10 space-y-4">
          
          {/* Card Header: Map Name & Win Rate Badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-teko-title text-3xl sm:text-4xl text-white font-bold tracking-wider leading-none text-glass-shadow">
                {displayName}
              </h3>
              <div className="text-xs font-mono text-gray-300 mt-0.5 flex items-center gap-1.5">
                <span>{gamesPlayed} {gamesPlayed === 1 ? 'Game' : 'Games'} Logged</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">{squadAvgACS} ACS</span>
              </div>
            </div>

            {/* Win Rate Pill */}
            <div className={`px-3 py-1 rounded-full border font-mono text-xs font-bold ${winRateColorClass}`}>
              {winRate}% WR
            </div>
          </div>

          {/* Win / Loss Segmented Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-300">
              <span className="text-emerald-400 font-bold">{wins} Wins</span>
              <span className="text-red-400 font-bold">{losses} Losses</span>
            </div>
            <div className="h-2 w-full rounded-full bg-black/60 overflow-hidden flex p-0.5 border border-white/10">
              <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${winPercentage}%` }} />
              <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${100 - winPercentage}%` }} />
            </div>
          </div>

          {/* MVP Top Performer Highlight */}
          {topPerformer && (
            <div
              onClick={handleTopPerformerClick}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 hover:border-cyan-400/50 hover:bg-white/20 flex items-center justify-between transition-all cursor-pointer group/mvp"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-md bg-black/60 p-0.5 shrink-0 flex items-center justify-center">
                  <ValorantImage src={topPerformer.topAgentIcon} alt={topPerformer.topAgent} type="agent" className="w-full h-full" />
                </div>
                <div className="text-xs font-mono text-white truncate">
                  Top MVP: <strong className="text-amber-400 group-hover/mvp:underline">{topPerformer.name}</strong>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">{topPerformer.avgACS} ACS</span>
            </div>
          )}

          {/* Accordion Expandable Section */}
          <AnimatePresence>
            {isExpanded && <MapCardExpanded mapData={mapData} />}
          </AnimatePresence>

        </div>

        {/* Expand Accordion Toggle Bar */}
        <div className="relative z-10 pt-3 flex items-center justify-center text-xs font-mono text-gray-300 hover:text-white">
          <span className="mr-1">{isExpanded ? 'Collapse Stats' : 'Expand Player Breakdown'}</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          </motion.div>
        </div>
      </GlassSurface>
    </motion.div>
  );
}
