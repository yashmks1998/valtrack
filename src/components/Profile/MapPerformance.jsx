import React from 'react';
import { computePlayerMapPerformance } from '../../lib/playerStats';

export default function MapPerformance({ matches, player }) {
  const maps = computePlayerMapPerformance(matches, player);

  if (!maps || maps.length === 0) return null;

  return (
    <div className="tracker-glass overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-card)]">
        <h3 className="font-oswald uppercase text-white tracking-wide text-sm">Map Performance</h3>
      </div>

      <div className="flex flex-col gap-[1px] bg-[var(--border)]">
        {maps.map((mapInfo) => {
          // Normalize names for splash image fetching
          const mapImgName = mapInfo.map.toLowerCase() === 'summit' ? 'abyss' : mapInfo.map.toLowerCase();
          
          return (
            <div 
              key={mapInfo.map} 
              className="group relative bg-[var(--bg-base)] hover:bg-[var(--bg-hover)] transition-colors p-3 pr-4 flex items-center justify-between overflow-hidden min-h-[60px]"
            >
              {/* Hover Splash Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ backgroundImage: `url(https://media.valorant-api.com/maps/${mapImgName}/listviewicon.png)` }} 
              />
              {/* Gradient mask for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)] via-transparent to-[var(--bg-base)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Left Side: Map Info & Win Bar */}
              <div className="flex flex-col gap-1 w-1/2 relative z-10">
                <div className="font-oswald text-white uppercase text-[13px] tracking-wide">
                  {mapInfo.map}
                </div>
                
                {/* Horizontal Win/Loss Bar */}
                <div className="w-full h-1.5 flex rounded overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[var(--green)]" style={{ width: `${mapInfo.winRate}%` }} />
                  <div className="bg-[var(--loss)]" style={{ width: `${100 - mapInfo.winRate}%` }} />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--muted)] px-0.5">
                  <span className="text-[var(--green)]">{mapInfo.wins}W</span>
                  <span className="text-[var(--loss)]">{mapInfo.losses}L</span>
                </div>
              </div>

              {/* Right Side: Stats */}
              <div className="flex items-center gap-4 text-right relative z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-oswald text-[var(--muted)] uppercase">Win %</span>
                  <span className={`font-teko text-xl leading-none ${mapInfo.winRate >= 50 ? 'text-white' : 'text-gray-400'}`}>
                    {mapInfo.winRate}%
                  </span>
                </div>
                <div className="flex flex-col w-8">
                  <span className="text-[10px] font-oswald text-[var(--muted)] uppercase">ACS</span>
                  <span className="font-teko text-xl leading-none text-white">
                    {mapInfo.avgACS}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
