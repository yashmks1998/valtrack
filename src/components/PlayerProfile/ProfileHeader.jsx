import React from 'react';
import GlassSurface from '../GlassSurface';
import { Shield, Sparkles, Swords, Trophy, Target, Crosshair } from 'lucide-react';

export default function ProfileHeader({ player, vitalStats }) {
  if (!player) return null;

  const {
    name = 'Agent',
    tag = 'AP',
    accountLevel = 1,
    cardSmall,
    rank = {},
  } = player;

  const {
    current_tier_patched = 'Unranked',
    ranking_in_tier = 0,
    images = {},
  } = rank;

  const {
    winRate = 0,
    avgACS = 0,
    avgKD = '0.00',
    avgHS = 0,
    wins = 0,
    losses = 0,
  } = vitalStats || {};

  return (
    <GlassSurface level="3" useDistortion className="p-4 sm:p-8 relative overflow-hidden">
      {/* Background Player Card Splash Image with Blur */}
      {cardSmall && (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img src={cardSmall} alt={name} className="w-full h-full object-cover filter blur-md scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-transparent to-transparent" />
        </div>
      )}

      <div className="relative z-10 space-y-6">
        
        {/* Top Row: Avatar, Riot ID, Rank Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            
            {/* Player Card Avatar Container */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/60 border-2 border-[#ff4655] p-1 overflow-hidden shrink-0 shadow-glow-red">
              {cardSmall ? (
                <img src={cardSmall} alt={name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-teko text-2xl text-white font-bold">
                  {name[0]}
                </div>
              )}
            </div>

            {/* Name, Tag, Level */}
            <div className="truncate max-w-[180px] sm:max-w-none">
              <div className="flex items-center gap-2">
                <h2 className="font-teko-title text-3xl sm:text-5xl text-white font-bold tracking-wider leading-none truncate">
                  {name}
                </h2>
                <span className="text-sm sm:text-base font-mono text-gray-400 font-bold shrink-0">
                  #{tag}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-cyan-300">
                <span className="bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                  Level {accountLevel}
                </span>
                <span>•</span>
                <span className="text-gray-300">AP Server</span>
              </div>
            </div>
          </div>

          {/* Competitive Rank Badge */}
          <div className="flex items-center gap-3 bg-black/50 border border-white/20 rounded-2xl p-3 sm:p-4 shrink-0 shadow-lg">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
              {images.small ? (
                <img src={images.small} alt={current_tier_patched} className="w-full h-full object-contain filter drop-shadow-md" />
              ) : (
                <Shield className="w-8 h-8 text-cyan-400" />
              )}
            </div>
            <div>
              <div className="font-oswald-header text-sm sm:text-base text-white font-bold leading-none">
                {current_tier_patched}
              </div>
              <div className="text-xs font-mono text-cyan-300 mt-1 font-bold">
                {ranking_in_tier} RR
              </div>
            </div>
          </div>
        </div>

        {/* Vital Stats Glass Chips Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          
          {/* Chip 1: Win Rate */}
          <GlassSurface level="1" className="p-3 sm:p-4">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-mono uppercase">
              <span>WIN RATE</span>
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className={`font-teko text-2xl sm:text-4xl font-bold mt-1 leading-none ${winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
              {winRate}%
            </div>
            <div className="text-[10px] font-mono text-gray-300 mt-0.5">
              {wins}W - {losses}L
            </div>
          </GlassSurface>

          {/* Chip 2: Avg ACS */}
          <GlassSurface level="1" className="p-3 sm:p-4">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-mono uppercase">
              <span>AVG ACS</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="font-teko text-2xl sm:text-4xl font-bold text-amber-400 mt-1 leading-none">
              {avgACS}
            </div>
            <div className="text-[10px] font-mono text-gray-300 mt-0.5">
              Score Per Round
            </div>
          </GlassSurface>

          {/* Chip 3: K/D Ratio */}
          <GlassSurface level="1" className="p-3 sm:p-4">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-mono uppercase">
              <span>K/D RATIO</span>
              <Swords className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="font-teko text-2xl sm:text-4xl font-bold text-cyan-300 mt-1 leading-none">
              {avgKD}
            </div>
            <div className="text-[10px] font-mono text-gray-300 mt-0.5">
              Kills Per Death
            </div>
          </GlassSurface>

          {/* Chip 4: Headshot % */}
          <GlassSurface level="1" className="p-3 sm:p-4">
            <div className="flex items-center justify-between text-gray-400 text-[10px] font-mono uppercase">
              <span>HEADSHOT %</span>
              <Crosshair className="w-3.5 h-3.5 text-[#ff4655]" />
            </div>
            <div className="font-teko text-2xl sm:text-4xl font-bold text-[#ff4655] mt-1 leading-none">
              {avgHS}%
            </div>
            <div className="text-[10px] font-mono text-gray-300 mt-0.5">
              Precision Aim
            </div>
          </GlassSurface>

        </div>

      </div>
    </GlassSurface>
  );
}
