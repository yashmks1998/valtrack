import React from 'react';
import { useSquad } from '../context/SquadContext';
import PlayerChip from './PlayerChip';
import { Users } from 'lucide-react';

export default function PlayerChipRow() {
  const { players } = useSquad();

  if (!players || players.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="font-oswald-header text-sm text-white font-bold">
            ACTIVE SQUAD ROSTER ({players.length})
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">
          Tap chip to inspect player stats
        </span>
      </div>

      {/* Horizontally scrollable row with scroll snap and fade edge gradients */}
      <div className="relative">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar snap-x py-1 px-1">
          {players.map((player) => (
            <PlayerChip key={player.puuid || `${player.name}-${player.tag}`} player={player} />
          ))}
        </div>
      </div>
    </div>
  );
}
