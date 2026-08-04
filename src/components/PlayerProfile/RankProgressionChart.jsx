import React, { useState } from 'react';
import GlassSurface from '../GlassSurface';
import { TrendingUp, Activity } from 'lucide-react';

export default function RankProgressionChart({ points = [] }) {
  const [activePoint, setActivePoint] = useState(null);

  if (!points || points.length === 0) return null;

  // SVG Chart Dimensions
  const width = 800;
  const height = 180;
  const padding = 30;

  const minRR = Math.min(...points.map((p) => p.rr), 0);
  const maxRR = Math.max(...points.map((p) => p.rr), 100);

  const getX = (idx) => {
    if (points.length <= 1) return width / 2;
    return padding + (idx / (points.length - 1)) * (width - padding * 2);
  };

  const getY = (val) => {
    const range = maxRR - minRR || 1;
    return height - padding - ((val - minRR) / range) * (height - padding * 2);
  };

  // Build SVG Path
  const pathD = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.rr)}`)
    .join(' ');

  const areaD = `${pathD} L ${getX(points.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

  return (
    <GlassSurface level="1" className="p-6 space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#ff4655]" />
          <h3 className="font-oswald-header text-lg text-white font-bold">
            RANK PROGRESSION & MATCH ELO TREND
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400">
          Last {points.length} Matches Logged
        </span>
      </div>

      {/* SVG Line / Area Chart Container */}
      <div className="relative w-full overflow-hidden bg-black/40 border border-white/10 rounded-2xl p-4">
        
        {/* Interactive Hover Tooltip */}
        {activePoint && (
          <div
            className="absolute z-30 bg-black/90 border border-cyan-400/50 rounded-xl p-3 shadow-2xl backdrop-blur-xl pointer-events-none transform -translate-x-1/2 -translate-y-full transition-all text-xs font-mono"
            style={{
              left: `${(getX(activePoint.index) / width) * 100}%`,
              top: `${(getY(activePoint.rr) / height) * 100}%`,
            }}
          >
            <div className="font-bold text-white uppercase">{activePoint.map}</div>
            <div className={`font-bold ${activePoint.hasWon ? 'text-emerald-400' : 'text-red-400'}`}>
              {activePoint.result} ({activePoint.rr} RR)
            </div>
            <div className="text-gray-400 text-[10px]">{activePoint.date}</div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
          <defs>
            <linearGradient id="valorantRedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff4655" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ff4655" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={getY(0)} x2={width - padding} y2={getY(0)} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
          <line x1={padding} y1={getY(50)} x2={width - padding} y2={getY(50)} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
          <line x1={padding} y1={getY(100)} x2={width - padding} y2={getY(100)} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />

          {/* Area Fill */}
          <path d={areaD} fill="url(#valorantRedGradient)" />

          {/* Smooth Line */}
          <path d={pathD} fill="none" stroke="#ff4655" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, idx) => {
            const cx = getX(idx);
            const cy = getY(p.rr);
            const isHovered = activePoint?.index === idx;

            return (
              <g key={idx} className="cursor-pointer">
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 4.5}
                  fill={p.hasWon ? '#10b981' : '#ff4655'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  onMouseEnter={() => setActivePoint({ ...p, index: idx })}
                  onMouseLeave={() => setActivePoint(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </GlassSurface>
  );
}
