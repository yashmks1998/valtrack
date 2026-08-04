import React from 'react';
import { useSquad } from '../context/SquadContext';
import GlassSurface from './GlassSurface';
import { X, Shield } from 'lucide-react';

export default function PlayerChip({ player }) {
  const { removePlayer, setSelectedPlayerForDrawer } = useSquad();

  const handleChipClick = (e) => {
    e.stopPropagation();
    setSelectedPlayerForDrawer(player);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    removePlayer(player);
  };

  return (
    <GlassSurface
      level="2"
      interactive
      onClick={handleChipClick}
      className="!rounded-2xl p-2.5 flex items-center justify-between gap-3 cursor-pointer shrink-0 snap-start max-w-[240px] shadow-lg group border border-white/20"
    >
      <div className="flex items-center gap-2.5 truncate">
        {/* Card Icon / Avatar */}
        <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/20 p-0.5 overflow-hidden shrink-0 flex items-center justify-center">
          {player.cardSmall ? (
            <img src={player.cardSmall} alt={player.name} className="w-full h-full object-cover rounded-lg" />
          ) : (
            <Shield className="w-5 h-5 text-cyan-400" />
          )}
        </div>

        <div className="truncate">
          <div className="font-oswald-header text-sm text-white font-bold truncate group-hover:text-[#ff4655] transition-colors">
            {player.name}
            <span className="text-gray-400 font-mono font-normal text-xs">#{player.tag}</span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            {player.rank?.rankImage && (
              <img src={player.rank.rankImage} alt={player.rank.currentTierName} className="w-3.5 h-3.5 object-contain" />
            )}
            <span className="text-[10px] font-mono text-cyan-300 truncate">
              {player.rank?.currentTierName || 'Unranked'}
            </span>
          </div>
        </div>
      </div>

      {/* Remove Button (44x44px touch target) */}
      <button
        type="button"
        onClick={handleRemove}
        aria-label={`Remove ${player.name} from squad`}
        className="w-11 h-11 flex items-center justify-center rounded-xl text-gray-400 hover:text-[#ff4655] hover:bg-white/20 transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4 text-gray-300 hover:text-[#ff4655]" />
      </button>
    </GlassSurface>
  );
}
