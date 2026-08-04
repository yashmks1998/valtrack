import React, { useState } from 'react';
import GlassSurface from '../GlassSurface';
import { ROLE_COLOR_MAP } from '../../lib/playerStats';
import { ChevronDown, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentMasteryCard({ agentData }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    agent,
    role,
    icon,
    games,
    winRate,
    avgACS,
    avgKD,
    isMain,
    mapBreakdown,
  } = agentData;

  const roleColor = ROLE_COLOR_MAP[role] || '#9ca3af';

  return (
    <GlassSurface
      level="1"
      hoverable
      useDistortion
      className={`p-3 sm:p-4 transition-all relative overflow-hidden flex flex-col justify-between ${
        isMain
          ? '!border-amber-400/50 shadow-glow-gold'
          : 'hover:border-white/30'
      }`}
    >
      {/* "MAIN" Badge */}
      {isMain && (
        <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-md z-10">
          <Sparkles className="w-2.5 h-2.5 text-black" />
          <span>MAIN</span>
        </div>
      )}

      {/* Main Card Content */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer space-y-3"
      >
        {/* Agent Icon & Role */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/60 border border-white/20 p-0.5 overflow-hidden shrink-0">
            {icon ? (
              <img src={icon} alt={agent} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-teko text-white font-bold">
                {agent[0]}
              </div>
            )}
          </div>

          <div className="truncate">
            <h4 className="font-oswald-header text-sm sm:text-base text-white font-bold leading-none truncate">
              {agent}
            </h4>
            <span
              className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase text-white/90"
              style={{ backgroundColor: `${roleColor}33`, borderColor: roleColor, borderWidth: '1px' }}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-1 font-mono text-xs pt-1 border-t border-white/10">
          <div>
            <div className="text-[9px] text-gray-400">WIN RATE</div>
            <div className={`font-bold ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
              {winRate}%
            </div>
          </div>

          <div className="text-right">
            <div className="text-[9px] text-gray-400">AVG ACS</div>
            <div className="text-amber-400 font-bold">{avgACS}</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
          <span>{games} {games === 1 ? 'game' : 'games'}</span>
          <span className="text-cyan-300 font-bold">{avgKD} K/D</span>
        </div>
      </div>

      {/* Accordion Map Breakdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="overflow-hidden mt-3 pt-3 border-t border-white/10 space-y-2"
          >
            <div className="text-[10px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>Map Breakdown</span>
            </div>

            {mapBreakdown.length > 0 ? (
              <div className="space-y-1.5">
                {mapBreakdown.map((mb) => (
                  <div key={mb.map} className="bg-black/50 border border-white/10 rounded-lg p-1.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-white truncate max-w-[60px]">{mb.map}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${mb.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>{mb.winRate}%</span>
                      <span className="text-amber-400">{mb.avgACS}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[10px] font-mono text-gray-400">No map stats.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassSurface>
  );
}
