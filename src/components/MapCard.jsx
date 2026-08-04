import React, { useState } from 'react';
import GlassSurface from './GlassSurface';
import MapCardExpanded from './MapCardExpanded';
import { useSquad } from '../context/SquadContext';
import { MapPin, Trophy, Swords, Crown, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapCard({ mapData }) {
  const { setSelectedPlayerForDrawer } = useSquad();
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    map,
    splash,
    gamesPlayed,
    wins,
    losses,
    winRate,
    squadAvgACS,
    squadAvgKD,
    topPerformer,
  } = mapData;

  const winRateColor =
    winRate >= 60 ? 'text-emerald-400' : winRate >= 45 ? 'text-amber-400' : 'text-red-400';

  return (
    <GlassSurface
      level="2"
      hoverable
      useDistortion
      className="p-0 overflow-hidden group flex flex-col justify-between"
    >
      {/* Top Banner with Map Splash Art */}
      <div className="relative h-28 sm:h-36 w-full overflow-hidden">
        {splash ? (
          <img
            src={splash}
            alt={map}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center font-teko text-2xl text-white">
            {map}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-black/40 to-transparent" />

        {/* Map Header Title */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between z-10">
          <div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>AP Server</span>
            </div>
            <h3 className="font-teko-title text-2xl sm:text-3xl text-white font-bold leading-none tracking-wider text-glass-shadow">
              {map}
            </h3>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-gray-300">GAMES</span>
            <div className="font-teko text-2xl sm:text-3xl text-white font-bold leading-none">
              {gamesPlayed}
            </div>
          </div>
        </div>
      </div>

      {/* Card Stats Grid */}
      <div className="p-3.5 sm:p-4 space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center font-mono py-1 border-y border-white/10">
          <div>
            <span className="text-[9px] text-gray-400 block uppercase">Win Rate</span>
            <span className={`font-teko text-xl sm:text-2xl font-bold ${winRateColor}`}>
              {winRate}%
            </span>
          </div>

          <div>
            <span className="text-[9px] text-gray-400 block uppercase">Squad ACS</span>
            <span className="font-teko text-xl sm:text-2xl font-bold text-amber-400">
              {squadAvgACS}
            </span>
          </div>

          <div>
            <span className="text-[9px] text-gray-400 block uppercase">Record</span>
            <span className="font-teko text-xl sm:text-2xl font-bold text-white">
              {wins}W - {losses}L
            </span>
          </div>
        </div>

        {/* MVP Top Performer Badge */}
        {topPerformer ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSelectedPlayerForDrawer(topPerformer);
            }}
            className="bg-black/50 hover:bg-[#ff4655]/20 border border-white/15 hover:border-[#ff4655]/50 rounded-xl p-2 flex items-center justify-between cursor-pointer transition-all group/mvp active:scale-98"
          >
            <div className="flex items-center gap-2 truncate">
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="text-[9px] font-mono text-gray-400">MAP MVP</div>
                <div className="font-oswald-header text-xs text-white font-bold group-hover/mvp:text-[#ff4655] transition-colors truncate">
                  {topPerformer.name}
                  <span className="text-gray-400 font-mono text-[10px] ml-1">#{topPerformer.tag}</span>
                </div>
              </div>
            </div>

            <div className="text-right font-mono text-[10px] shrink-0">
              <div className="text-amber-400 font-bold">{topPerformer.avgACS} ACS</div>
              <div className="text-cyan-300">{topPerformer.avgKD} K/D</div>
            </div>
          </div>
        ) : (
          <div className="text-[10px] font-mono text-gray-400 text-center py-1">
            No MVP logged.
          </div>
        )}

        {/* Expand Breakdown Button (44px touch target) */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/15 text-xs font-mono text-gray-200 hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 min-h-[44px]"
        >
          <span>{isExpanded ? 'Hide Squad Breakdown' : 'Expand Squad Breakdown'}</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Expanded Breakdown */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="overflow-hidden pt-2"
            >
              <MapCardExpanded mapData={mapData} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassSurface>
  );
}
