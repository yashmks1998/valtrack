import React, { useState } from 'react';
import GlassSurface from '../GlassSurface';
import ValorantImage from '../ValorantImage';
import { ROLE_COLOR_MAP } from '../../lib/playerStats';
import { ChevronDown, Sparkles, Swords, Trophy, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentMasteryCard({ agentData, agentsMetadata = [] }) {
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

  // Look up the icon from static agentsMetadata as a guaranteed fallback
  const metaAgent = agentsMetadata.find(
    (a) => a.displayName?.toLowerCase() === agent?.toLowerCase()
  );
  const fallbackIcon = metaAgent?.displayIconSmall || metaAgent?.displayIcon || null;

  const roleColor = ROLE_COLOR_MAP[role] || '#9ca3af';

  return (
    <GlassSurface
      level="1"
      hoverable
      className={`p-4 sm:p-5 transition-all relative overflow-hidden ${
        isMain
          ? '!border-amber-400/50 shadow-glow-gold'
          : 'hover:border-white/30'
      }`}
    >
      {/* "MAIN AGENT" Accent Badge for Top 1-2 Agents */}
      {isMain && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-2 py-0.5 rounded-full text-[9px] font-mono font-bold flex items-center gap-1 shadow-md z-10">
          <Sparkles className="w-3 h-3 text-black" />
          <span>MAIN AGENT</span>
        </div>
      )}

      {/* Main Card Content Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between cursor-pointer group"
      >
        {/* Left: Agent Icon & Name */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/20 p-1 overflow-hidden shrink-0 group-hover:scale-105 transition-all">
            <ValorantImage src={icon || fallbackIcon} alt={agent} type="agent" fallbackSrc={fallbackIcon} className="w-full h-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-oswald-header text-lg text-white font-bold leading-none">
                {agent}
              </h4>
              <span
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase text-white/90"
                style={{ backgroundColor: `${roleColor}33`, borderColor: roleColor, borderWidth: '1px' }}
              >
                {role}
              </span>
            </div>

            <div className="text-xs font-mono text-gray-400 mt-1">
              {games} {games === 1 ? 'game' : 'games'} played
            </div>
          </div>
        </div>

        {/* Right: Quick Stats & Expand Chevron */}
        <div className="flex items-center gap-4">
          <div className="text-right font-mono">
            <div className={`text-sm font-bold ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
              {winRate}% WR
            </div>
            <div className="text-xs text-amber-400 font-bold">{avgACS} ACS</div>
            <div className="text-[11px] text-gray-300">{avgKD} K/D</div>
          </div>

          <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180 bg-white/20' : ''}`}>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Accordion Inline Map Breakdown Extension */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="overflow-hidden mt-4 pt-4 border-t border-white/10 space-y-3"
          >
            <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{agent} Map Performance Breakdown</span>
            </div>

            {mapBreakdown.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mapBreakdown.map((mb) => (
                  <div key={mb.map} className="bg-black/40 border border-white/10 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{mb.map}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400">{mb.games}g</span>
                      <span className={`font-bold ${mb.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>{mb.winRate}%</span>
                      <span className="text-amber-400">{mb.avgACS} ACS</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs font-mono text-gray-400">No map specific breakdown available yet.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </GlassSurface>
  );
}
