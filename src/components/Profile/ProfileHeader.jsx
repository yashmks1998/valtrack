import React from 'react';
import { RefreshCw } from 'lucide-react';
import ValorantImage from '../ValorantImage';

export default function ProfileHeader({ player, computedStats, selectedSeasonId }) {
  if (!player) return null;

  const bgUrl = player.cardWide || player.cardLarge;
  const rank = player.rank || {};
  const currentTierName = rank.currentTierName || 'Unranked';
  const rankImage = rank.rankImage;
  const elo = rank.elo || 0;
  const rr = rank.rankingInTier || 0;
  
  // Find glow color based on tier
  const tierNameLower = currentTierName.toLowerCase();
  let glowClass = '';
  if (tierNameLower.includes('iron')) glowClass = 'glow-iron';
  else if (tierNameLower.includes('bronze')) glowClass = 'glow-bronze';
  else if (tierNameLower.includes('silver')) glowClass = 'glow-silver';
  else if (tierNameLower.includes('gold')) glowClass = 'glow-gold';
  else if (tierNameLower.includes('platinum')) glowClass = 'glow-platinum';
  else if (tierNameLower.includes('diamond')) glowClass = 'glow-diamond';
  else if (tierNameLower.includes('ascendant')) glowClass = 'glow-ascendant';
  else if (tierNameLower.includes('immortal')) glowClass = 'glow-immortal';
  else if (tierNameLower.includes('radiant')) glowClass = 'glow-radiant';

  const { winRate, avgKD, avgACS, avgHeadshot } = computedStats;

  return (
    <div className="relative w-full h-[220px] bg-[var(--bg-card)] overflow-hidden shrink-0">
      {/* Background Hero Banner */}
      {bgUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 blur-[4px]"
          style={{ backgroundImage: `url(${bgUrl})` }}
        />
      )}
      {/* Dark gradient overlay bottom-to-top */}
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/80 to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        
        {/* Top-right actions */}
        <div className="absolute top-4 right-4">
          <button className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-white transition-colors bg-black/40 px-3 py-1.5 rounded-full border border-[var(--border)] backdrop-blur-md">
            <RefreshCw className="w-3.5 h-3.5" />
            Update
          </button>
        </div>

        <div className="flex items-end justify-between gap-4">
          
          {/* Left: Avatar & Identity */}
          <div className="flex items-center gap-5">
            <div className={`relative w-24 h-24 rounded-full border-2 border-white/20 p-1 bg-black/50 ${glowClass}`}>
              <ValorantImage 
                src={player.cardSmall} 
                alt="Player Card" 
                className="w-full h-full rounded-full object-cover"
                type="cardSmall"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--bg-hover)] border border-[var(--border)] text-[10px] font-mono text-white px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                LVL {player.accountLevel || '?'}
              </div>
            </div>

            <div className="mb-2">
              <h1 className="font-teko text-5xl font-bold leading-none text-white drop-shadow-md flex items-baseline gap-2">
                {player.name}
                <span className="text-2xl text-[var(--muted)]">#{player.tag}</span>
              </h1>
              {rank.highest_rank?.patched_tier && (
                <div className="mt-1 inline-block bg-[var(--bg-hover)] border border-[var(--border)] text-[11px] px-2 py-0.5 rounded text-[var(--muted)] font-mono">
                  Peak: <span className="text-white font-bold">{rank.highest_rank.patched_tier}</span> ({rank.highest_rank.season})
                </div>
              )}
            </div>
          </div>

          {/* Right: Current Rank */}
          <div className="flex flex-col items-end mb-1">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="font-oswald text-[11px] text-[var(--muted)] tracking-widest uppercase mb-0.5">Current Rank</div>
                <div className="font-teko text-3xl font-bold leading-none text-white">{currentTierName}</div>
                <div className="text-[12px] font-mono text-[var(--muted)] flex items-center justify-end gap-2 mt-1">
                  <span><strong className="text-white">{rr}</strong> RR</span>
                  <span><strong className="text-white">{elo}</strong> ELO</span>
                </div>
              </div>
              <div className={`w-16 h-16 rounded-full bg-black/40 flex items-center justify-center p-2 border border-[var(--border)] ${glowClass}`}>
                <ValorantImage src={rankImage} alt="Rank" type="rankSmall" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Inline Stats */}
        <div className="flex items-center gap-6 mt-6 pb-2 pl-[116px]">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase">Win Rate</span>
            <span className="font-teko text-2xl leading-none text-white">{winRate}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase">K/D</span>
            <span className="font-teko text-2xl leading-none text-white">{avgKD}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase">ACS</span>
            <span className="font-teko text-2xl leading-none text-white">{avgACS}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--muted)] uppercase">HS%</span>
            <span className="font-teko text-2xl leading-none text-white">{avgHeadshot}%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
