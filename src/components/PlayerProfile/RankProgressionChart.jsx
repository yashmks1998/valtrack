import React from 'react';
import GlassSurface from '../GlassSurface';
import { TrendingUp, Shield } from 'lucide-react';

export default function RankProgressionChart({ points = [] }) {
  if (!points || points.length === 0) {
    return (
      <GlassSurface level="1" className="p-5 text-center">
        <div className="text-xs font-mono text-gray-400">
          Rank Progression history currently unavailable.
        </div>
      </GlassSurface>
    );
  }

  // Calculate bounding box for custom SVG Area Chart
  const values = points.map((p) => p.rr);
  const minVal = Math.min(...values) - 10;
  const maxVal = Math.max(...values) + 10;
  const range = maxVal - minVal || 1;

  const width = 800;
  const height = 180;

  // Build SVG path points
  const coords = points.map((p, index) => {
    const x = (index / (points.length - 1 || 1)) * width;
    const y = height - ((p.rr - minVal) / range) * (height - 30) - 15;
    return { x, y, rr: p.rr, match: p.match, tier: p.tier };
  });

  const linePath = coords.reduce(
    (acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x},${curr.y}`,
    ''
  );

  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <GlassSurface level="2" useDistortion className="p-4 sm:p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 className="font-oswald-header text-lg text-white font-bold">
            RANK PROGRESSION (COMPETITIVE RR TREND)
          </h3>
        </div>
        <div className="text-xs font-mono text-cyan-300 font-bold bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
          {points[points.length - 1]?.rr || 0} RR Current
        </div>
      </div>

      {/* SVG Responsive Area Chart */}
      <div className="relative w-full h-40 sm:h-52 bg-black/40 border border-white/10 rounded-2xl p-2 sm:p-4 overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full preserve-3d overflow-visible">
          <defs>
            <linearGradient id="rrGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#rrGradient)" />

          {/* Line Stroke */}
          <path d={linePath} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {coords.map((pt, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={pt.x}
                cy={pt.y}
                r="5"
                fill="#ff4655"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-transform group-hover:scale-150"
              />
            </g>
          ))}
        </svg>

        {/* Legend / Timeline Hint */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mt-1">
          <span>Earliest Logged Game</span>
          <span>Most Recent Match</span>
        </div>
      </div>
    </GlassSurface>
  );
}
