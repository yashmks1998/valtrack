import React from 'react';
import GlassSurface from '../GlassSurface';
import { MapPin, Trophy, Shield } from 'lucide-react';

export default function MapPerformanceGrid({ mapStats = [], mapsMetadata = [] }) {
  if (!mapStats || mapStats.length === 0) return null;

  const metaMap = new Map();
  mapsMetadata.forEach((m) => {
    if (m.displayName) metaMap.set(m.displayName.toLowerCase(), m);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <h3 className="font-oswald-header text-lg text-white font-bold">
            PLAYER MAP PERFORMANCE BREAKDOWN ({mapStats.length} MAPS)
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mapStats.map((ms) => {
          const meta = metaMap.get(ms.map.toLowerCase());
          const splash = meta?.splash || meta?.listViewIcon || null;

          return (
            <GlassSurface
              key={ms.map}
              level="1"
              hoverable
              className="relative overflow-hidden p-5 flex flex-col justify-between h-48 border border-white/15 group"
            >
              {/* Background Map Splash */}
              {splash && (
                <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-45 transition-opacity">
                  <img src={splash} alt={ms.map} className="w-full h-full object-cover filter blur-[1px] group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-[#0a0b0f]/60 to-transparent" />
                </div>
              )}

              {/* Map Title Header */}
              <div className="relative z-10 flex items-center justify-between">
                <h4 className="font-teko-title text-3xl text-white font-bold tracking-wide uppercase leading-none text-glass-shadow">
                  {ms.map}
                </h4>
                <div className="px-2.5 py-1 rounded-xl bg-black/60 border border-white/20 text-xs font-mono font-bold text-gray-200 backdrop-blur-md">
                  {ms.games} {ms.games === 1 ? 'Game' : 'Games'}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase">WIN RATE</div>
                  <div className={`font-teko text-4xl font-bold leading-none text-glass-shadow ${ms.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {ms.winRate}%
                  </div>
                  <div className="text-xs font-mono text-gray-300 mt-0.5">
                    {ms.wins}W - {ms.losses}L
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[10px] text-gray-400 uppercase">AVG ACS</div>
                  <div className="text-xl font-bold text-amber-400">{ms.avgACS}</div>
                  
                  {ms.bestAgent && (
                    <div className="flex items-center justify-end gap-1.5 mt-1 text-xs text-white">
                      {ms.bestAgentIcon && (
                        <img src={ms.bestAgentIcon} alt={ms.bestAgent} className="w-4 h-4 object-contain" />
                      )}
                      <span className="font-bold">{ms.bestAgent}</span>
                    </div>
                  )}
                </div>
              </div>

            </GlassSurface>
          );
        })}
      </div>
    </div>
  );
}
