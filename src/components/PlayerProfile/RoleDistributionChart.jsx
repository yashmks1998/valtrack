import React from 'react';
import GlassSurface from '../GlassSurface';
import { PieChart } from 'lucide-react';

export default function RoleDistributionChart({ rolesData = [] }) {
  if (!rolesData || rolesData.length === 0) return null;

  return (
    <GlassSurface level="1" className="p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2">
        <PieChart className="w-5 h-5 text-purple-400" />
        <h3 className="font-oswald-header text-lg text-white font-bold">
          AGENT ROLE DISTRIBUTION & VERSATILITY
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 bg-black/40 border border-white/10 rounded-2xl p-6">
        {/* CSS Donut Chart */}
        <div className="relative w-36 h-36 rounded-full flex items-center justify-center shrink-0">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(${rolesData
                .map((r, i) => {
                  const prevSum = rolesData.slice(0, i).reduce((acc, curr) => acc + curr.percentage, 0);
                  const currSum = prevSum + r.percentage;
                  return `${r.color} ${prevSum}% ${currSum}%`;
                })
                .join(', ')})`,
            }}
          />
          <div className="absolute inset-4 rounded-full bg-[#0a0b0f] flex flex-col items-center justify-center text-center font-mono">
            <span className="text-xl font-bold text-white leading-none">{rolesData.length}</span>
            <span className="text-[10px] text-gray-400 uppercase mt-0.5">Roles Played</span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-3 font-mono text-xs flex-1 max-w-xs">
          {rolesData.map((r) => (
            <div key={r.role} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                <span className="text-white font-bold">{r.role}</span>
              </div>
              <div className="text-right">
                <span className="text-cyan-300 font-bold">{r.percentage}%</span>
                <span className="text-gray-400 text-[10px] ml-1.5">({r.count} games)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassSurface>
  );
}
