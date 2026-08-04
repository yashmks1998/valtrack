import React from 'react';
import GlassSurface from '../GlassSurface';
import ValorantImage from '../ValorantImage';
import { Trophy, Swords, Crosshair, TrendingUp, Shield, Sparkles } from 'lucide-react';

export default function ProfileHeader({ player, vitalStats }) {
  if (!player) return null;

  const cardArt = player.cardWide || player.cardSmall || 'https://media.valorant-api.com/playercards/e9dcc215-4b83-90e4-ba3b-4f8d32568eb6/wideart.png';
  const rank = player.rank || {};
  const tierName = rank.currentTierName || 'Platinum 1';
  const rankImage = rank.rankImage || 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/18/largeicon.png';

  const { winRate, avgACS, avgKD, avgHeadshot, totalGames } = vitalStats;

  return (
    <GlassSurface level="2" className="relative overflow-hidden p-6 sm:p-8 shadow-2xl !rounded-[32px] border border-white/20">
      
      {/* Background Player Card Art with Dark Refractive Gradient Overlay */}
      <div className="absolute inset-0 z-0 opacity-25 overflow-hidden">
        <ValorantImage src={cardArt} alt="Card Art" type="card" className="absolute inset-0 w-full h-full" style={{ filter: 'blur(2px)', transform: 'scale(1.05)' }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0f] via-[#0a0b0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-transparent to-[#0a0b0f]/40" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Side: Avatar, Name, Rank & Level */}
        <div className="flex items-center gap-5">
          {/* Avatar Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/60 border-2 border-white/30 p-1 overflow-hidden shrink-0 shadow-2xl relative">
            <ValorantImage src={player.cardSmall || cardArt} alt={player.name} type="card" className="w-full h-full rounded-xl" />
            <div className="absolute top-1 right-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded-full text-[9px] font-mono text-cyan-300 font-bold border border-cyan-400/40">
              Lvl {player.accountLevel || 100}
            </div>
          </div>

          {/* Player Name & Rank Info */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-teko-title text-4xl sm:text-5xl text-white font-bold tracking-wide leading-none text-glass-shadow">
                {player.name}
              </h1>
              <span className="font-mono text-lg text-gray-300 font-normal">#{player.tag}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {/* Rank Badge */}
              <div className="flex items-center gap-2 bg-black/50 border border-white/20 px-3 py-1.5 rounded-2xl backdrop-blur-md">
                <ValorantImage src={rankImage} alt={tierName} type="rank" className="w-6 h-6" />
                <div className="font-mono text-xs">
                  <span className="text-white font-bold uppercase">{tierName}</span>
                  <span className="text-cyan-300 ml-1.5">({rank.rankingInTier || 50} RR)</span>
                </div>
              </div>

              {/* Peak Rank Sub-label */}
              <div className="text-[11px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Peak: {tierName} (EP 9)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: 4 Floating Vital Stat Glass Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Win Rate Chip */}
          <div className="bg-black/50 border border-white/15 rounded-2xl p-3.5 text-center backdrop-blur-xl hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-gray-300 uppercase">
              <Trophy className="w-3 h-3 text-emerald-400" />
              <span>WIN RATE</span>
            </div>
            <div className="font-teko text-3xl font-bold text-emerald-400 leading-none mt-1">
              {winRate}%
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-0.5">{totalGames} Games</div>
          </div>

          {/* Avg ACS Chip */}
          <div className="bg-black/50 border border-white/15 rounded-2xl p-3.5 text-center backdrop-blur-xl hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-gray-300 uppercase">
              <Swords className="w-3 h-3 text-amber-400" />
              <span>AVG ACS</span>
            </div>
            <div className="font-teko text-3xl font-bold text-amber-400 leading-none mt-1">
              {avgACS}
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-0.5">Combat Score</div>
          </div>

          {/* Avg K/D Chip */}
          <div className="bg-black/50 border border-white/15 rounded-2xl p-3.5 text-center backdrop-blur-xl hover:border-cyan-500/40 transition-all">
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-gray-300 uppercase">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span>K/D RATIO</span>
            </div>
            <div className="font-teko text-3xl font-bold text-cyan-400 leading-none mt-1">
              {avgKD}
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-0.5">Kills per Death</div>
          </div>

          {/* Headshot % Chip */}
          <div className="bg-black/50 border border-white/15 rounded-2xl p-3.5 text-center backdrop-blur-xl hover:border-[#ff4655]/40 transition-all">
            <div className="flex items-center justify-center gap-1 text-[10px] font-mono text-gray-300 uppercase">
              <Crosshair className="w-3 h-3 text-[#ff4655]" />
              <span>HEADSHOT %</span>
            </div>
            <div className="font-teko text-3xl font-bold text-[#ff4655] leading-none mt-1">
              {avgHeadshot}%
            </div>
            <div className="text-[10px] font-mono text-gray-400 mt-0.5">Precision Accuracy</div>
          </div>

        </div>

      </div>
    </GlassSurface>
  );
}
