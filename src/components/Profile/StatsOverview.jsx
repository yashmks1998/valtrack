import React from 'react';
import { Trophy, Shield, Swords, Sparkles, Crosshair, TrendingUp } from 'lucide-react';

export default function StatsOverview({ stats, player, filteredMatches, selectedSeasonId }) {
  
  const StatCard = ({ icon: Icon, title, value, subtext, highlightColor }) => (
    <div className="tracker-glass p-5 flex flex-col justify-between hover:bg-[var(--bg-hover)] transition-colors h-full">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: highlightColor }} />
        <span className="text-[12px] font-oswald uppercase text-[var(--muted)] tracking-wide">{title}</span>
      </div>
      <div>
        <div className="font-teko text-5xl font-bold leading-none text-white drop-shadow-sm">{value}</div>
        {subtext && <div className="text-[12px] font-inter text-[var(--muted)] mt-1">{subtext}</div>}
      </div>
    </div>
  );

  const kdaRaw = stats.avgKD ? parseFloat(stats.avgKD) : 0;
  
  // Winrate doughnut calculation
  const winPercent = stats.winRate;
  const dashArray = `${winPercent} ${100 - winPercent}`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      
      {/* Win Rate Card with Doughnut */}
      <div className="tracker-glass p-4 hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-between col-span-2 md:col-span-1 lg:col-span-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 mb-2">
            <Trophy className="w-3.5 h-3.5 text-[var(--green)]" />
            <span className="text-[11px] font-oswald uppercase text-[var(--muted)]">Win Rate</span>
          </div>
          <div className="font-teko text-4xl font-bold text-white leading-none">{stats.winRate}%</div>
          <div className="text-[11px] font-inter text-[var(--muted)] mt-1">
            <span className="text-[var(--green)] font-semibold">{stats.wins}W</span> - <span className="text-[var(--loss)] font-semibold">{stats.losses}L</span>
          </div>
        </div>
        
        {/* SVG Doughnut */}
        <div className="relative w-16 h-16 mr-2">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.91549" fill="transparent" stroke="var(--loss)" strokeWidth="4" />
            <circle cx="18" cy="18" r="15.91549" fill="transparent" stroke="var(--green)" strokeWidth="4" 
              strokeDasharray={dashArray} strokeDashoffset="0" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <StatCard 
        icon={Shield} title="K/D Ratio" 
        value={stats.avgKD} 
        subtext={`${stats.totalGames > 0 ? (kdaRaw > 1.2 ? 'Excellent' : kdaRaw > 1.0 ? 'Good' : 'Needs Work') : 'N/A'}`}
        highlightColor="var(--cyan)"
      />
      <StatCard 
        icon={Swords} title="Avg ACS" 
        value={stats.avgACS} 
        subtext="Combat Score"
        highlightColor="#f59e0b" // gold
      />
      <StatCard 
        icon={Sparkles} title="Avg ADR" 
        value={stats.avgADR} 
        subtext="Damage Per Round"
        highlightColor="#f97316" // orange
      />
      <StatCard 
        icon={Crosshair} title="Headshot %" 
        value={`${stats.avgHeadshot}%`} 
        subtext="Accuracy"
        highlightColor="var(--red)"
      />
      <StatCard 
        icon={TrendingUp} title="KAST %" 
        value={`${stats.kastPercent}%`} 
        subtext="Round Impact"
        highlightColor="#a855f7" // purple
      />

    </div>
  );
}
