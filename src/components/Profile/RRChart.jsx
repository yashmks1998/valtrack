import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { seasonShortToLabel } from '../../lib/playerStats';

export default function RRChart({ mmrHistory, selectedSeasonId }) {
  const [activePoint, setActivePoint] = useState(null);

  if (!mmrHistory || mmrHistory.length === 0) return null;

  // Filter by season if provided
  let filtered = [...mmrHistory].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (selectedSeasonId) {
    filtered = filtered.filter(h => h.season?.id === selectedSeasonId || h.season?.short === selectedSeasonId);
  }

  if (filtered.length === 0) return null;

  // Determine net change to color area
  const startElo = filtered[0].elo || 0;
  const endElo = filtered[filtered.length - 1].elo || 0;
  const isPositive = endElo >= startElo;
  const areaColor = isPositive ? '#22c55e' : '#ff4655'; // green or red

  // Determine acts for dividers if "All Time" (selectedSeasonId is empty)
  const actDividers = [];
  if (!selectedSeasonId) {
    let currentShort = '';
    filtered.forEach((h, idx) => {
      const short = h.season?.short || '';
      if (short !== currentShort) {
        if (currentShort !== '') actDividers.push({ idx, label: seasonShortToLabel(short) });
        currentShort = short;
      }
    });
  }

  // SVG Chart Dimensions
  const width = 800;
  const height = 180;
  const padding = 30;

  // Calculate local min/max RR/Elo for graphing to scale nicely
  const maxElo = Math.max(...filtered.map(p => p.elo), startElo + 1);
  const minElo = Math.min(...filtered.map(p => p.elo), startElo - 1);

  const getX = (idx) => {
    if (filtered.length <= 1) return width / 2;
    return padding + (idx / (filtered.length - 1)) * (width - padding * 2);
  };

  const getY = (val) => {
    const range = maxElo - minElo || 1;
    return height - padding - ((val - minElo) / range) * (height - padding * 2);
  };

  // Build SVG Path
  const pathD = filtered
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.elo)}`)
    .join(' ');

  const areaD = `${pathD} L ${getX(filtered.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

  return (
    <div className="tracker-glass overflow-hidden mt-6">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${isPositive ? 'text-[var(--green)]' : 'text-[var(--red)]'}`} />
          <h3 className="font-oswald uppercase text-white tracking-wide text-sm">Rating Progression</h3>
        </div>
        <div className="text-[12px] font-mono text-[var(--muted)]">
          {filtered.length} Matches • Net {isPositive ? '+' : ''}{endElo - startElo} ELO
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-[var(--bg-base)] p-4 pt-8">
        
        {/* Interactive Hover Tooltip */}
        {activePoint && (
          <div
            className="absolute z-30 bg-black/90 border border-white/20 rounded-lg p-3 shadow-2xl backdrop-blur-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all text-xs font-mono min-w-[140px]"
            style={{
              left: `${(getX(activePoint.index) / width) * 100}%`,
              top: `${(getY(activePoint.elo) / height) * 100}%`,
              marginTop: '-12px'
            }}
          >
            <div className="font-bold text-white uppercase text-sm mb-1">{activePoint.map?.name || 'Match'}</div>
            <div className={`font-bold ${activePoint.last_mmr_change >= 0 ? 'text-[var(--green)]' : 'text-[var(--red)]'}`}>
              {activePoint.last_mmr_change >= 0 ? 'VICTORY' : 'DEFEAT'} {activePoint.last_mmr_change > 0 ? '+' : ''}{activePoint.last_mmr_change} RR
            </div>
            <div className="text-gray-300 mt-1">{activePoint.tier?.name} • {activePoint.ranking_in_tier} RR</div>
            <div className="text-[var(--muted)] text-[10px] mt-1">{new Date(activePoint.date).toLocaleString()}</div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={areaColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={areaColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={getY(minElo)} x2={width - padding} y2={getY(minElo)} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          <line x1={padding} y1={getY(maxElo)} x2={width - padding} y2={getY(maxElo)} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

          {/* Act Dividers */}
          {actDividers.map(div => (
            <g key={div.idx}>
              <line 
                x1={getX(div.idx)} y1={0} 
                x2={getX(div.idx)} y2={height - padding} 
                stroke="rgba(255,255,255,0.15)" strokeDasharray="4 2" 
              />
              <text 
                x={getX(div.idx) + 5} y={15} 
                fill="var(--muted)" 
                fontSize="10" 
                fontFamily="Oswald" 
                className="uppercase tracking-wider"
              >
                {div.label}
              </text>
            </g>
          ))}

          {/* Area Fill */}
          <path d={areaD} fill="url(#areaGradient)" />

          {/* Smooth Line */}
          <path d={pathD} fill="none" stroke={areaColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {filtered.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.elo);
            const isHovered = activePoint?.index === idx;
            const dotColor = p.last_mmr_change > 0 ? 'var(--green)' : p.last_mmr_change < 0 ? 'var(--loss)' : 'var(--draw)';

            return (
              <g key={idx} className="cursor-pointer">
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 3.5}
                  fill={dotColor}
                  stroke="#16181d"
                  strokeWidth="1.5"
                  onMouseEnter={() => setActivePoint({ ...p, index: idx })}
                  onMouseLeave={() => setActivePoint(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
