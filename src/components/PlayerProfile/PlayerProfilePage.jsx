import React, { useEffect, useMemo } from 'react';
import { useSquad } from '../../context/SquadContext';
import ProfileHeader from './ProfileHeader';
import RankProgressionChart from './RankProgressionChart';
import AgentMasteryGrid from './AgentMasteryGrid';
import MapPerformanceGrid from './MapPerformanceGrid';
import RecentMatchesList from './RecentMatchesList';
import RoleDistributionChart from './RoleDistributionChart';

import {
  getPlayerMatches,
  computeVitalStats,
  computeAgentMastery,
  computePlayerMapPerformance,
  computeRoleDistribution,
  computeRankProgression,
} from '../../lib/playerStats';

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlayerProfilePage({ player, onClose }) {
  const { matches, mapsMetadata } = useSquad();

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Compute player dossier metrics via pure calculation engine
  const playerMatches = useMemo(() => {
    return getPlayerMatches(matches, player);
  }, [matches, player]);

  const vitalStats = useMemo(() => {
    return computeVitalStats(playerMatches, player);
  }, [playerMatches, player]);

  const agentMastery = useMemo(() => {
    return computeAgentMastery(playerMatches, player);
  }, [playerMatches, player]);

  const mapPerformance = useMemo(() => {
    return computePlayerMapPerformance(playerMatches, player);
  }, [playerMatches, player]);

  const roleDistribution = useMemo(() => {
    return computeRoleDistribution(playerMatches, player);
  }, [playerMatches, player]);

  const rankProgression = useMemo(() => {
    return computeRankProgression(playerMatches, player);
  }, [playerMatches, player]);

  if (!player) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 overflow-hidden">
        
        {/* Dimmed Blurred Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl z-0"
        />

        {/* Main High-Tech Profile Screen Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 1 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) onClose();
          }}
          className="relative z-10 w-full max-w-5xl h-[100dvh] sm:h-[90vh] bg-[#0a0b0f]/90 border-0 sm:border border-white/20 rounded-none sm:rounded-[36px] shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
        >
          {/* Mobile Top Drag Handle Bar */}
          <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mt-3 mb-1 shrink-0 sm:hidden" />

          {/* Floating Circular Close Button (44x44px Touch Target) */}
          <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-30">
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-full bg-black/70 border border-white/25 text-white hover:bg-white/20 transition-all flex items-center justify-center backdrop-blur-md cursor-pointer shadow-lg active:scale-95 min-h-[44px] min-w-[44px]"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Scrollable Dossier Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6 pb-20 sm:pb-8 scrollbar-thin scrollbar-thumb-white/20">
            
            {/* 1. Profile Header Hero Panel */}
            <ProfileHeader player={player} vitalStats={vitalStats} />

            {/* 2. Rank Progression RR Area Chart */}
            <RankProgressionChart points={rankProgression} />

            {/* 3. Agent Mastery Grid */}
            <AgentMasteryGrid agentsList={agentMastery} />

            {/* 4. Map Performance Grid */}
            <MapPerformanceGrid mapStats={mapPerformance} mapsMetadata={mapsMetadata} />

            {/* 5. Recent Matches List */}
            <RecentMatchesList matchesList={playerMatches} player={player} />

            {/* 6. Role Distribution Donut Chart */}
            <RoleDistributionChart rolesData={roleDistribution} />

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
