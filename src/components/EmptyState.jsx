import React, { useState } from 'react';
import { useSquad } from '../context/SquadContext';
import { SQUAD_6_IDS } from './AddPlayerForm';
import GlassSurface from './GlassSurface';
import GlassButton from './GlassButton';
import { UserPlus, Swords, Sparkles, Loader2, Users, Filter } from 'lucide-react';

export default function EmptyState({ type = 'no_players', onResetFilters }) {
  const { players, addPlayer } = useSquad();
  const [isImporting, setIsImporting] = useState(false);

  const handleImportAll6Squad = async () => {
    setIsImporting(true);
    for (const item of SQUAD_6_IDS) {
      try {
        await addPlayer(`${item.name}#${item.tag}`, 'ap');
      } catch (err) {}
    }
    setIsImporting(false);
  };

  if (type === 'one_player' || players.length === 1) {
    return (
      <GlassSurface level="1" className="p-8 sm:p-12 text-center max-w-xl mx-auto my-6 space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#ff4655]/20 border border-[#ff4655]/40 flex items-center justify-center mx-auto text-[#ff4655] shadow-glow-red">
          <UserPlus className="w-8 h-8" />
        </div>

        <div>
          <h3 className="font-teko-title text-3xl sm:text-4xl text-white font-bold">
            ADD YOUR REMAINING SQUAD MEMBERS
          </h3>
          <p className="text-sm text-gray-300 mt-1 max-w-md mx-auto">
            You currently have <strong className="text-white font-mono">{players[0]?.name}</strong> in your squad. Add at least 2 players to cross-reference shared AP match histories and calculate map win rates.
          </p>
        </div>

        <GlassButton
          variant="primary"
          size="lg"
          onClick={handleImportAll6Squad}
          disabled={isImporting}
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>LOADING 6 SQUAD MEMBERS...</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>LOAD FULL 6-PLAYER SQUAD</span>
            </>
          )}
        </GlassButton>
      </GlassSurface>
    );
  }

  if (type === 'no_shared_matches') {
    return (
      <GlassSurface level="1" className="p-8 sm:p-12 text-center max-w-xl mx-auto my-6 space-y-5">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-glow-red">
          <Swords className="w-8 h-8" />
        </div>

        <div>
          <h3 className="font-teko-title text-3xl sm:text-4xl text-white font-bold">
            NO SHARED MATCHES FOUND
          </h3>
          <p className="text-sm text-gray-300 mt-1 max-w-md mx-auto">
            We searched competitive match histories for your active squad members, but found 0 games for the current filter selection.
          </p>
        </div>

        {onResetFilters && (
          <div className="pt-2">
            <GlassButton variant="primary" size="md" onClick={onResetFilters} className="mx-auto">
              <Filter className="w-4 h-4" />
              <span>RESET ALL FILTERS</span>
            </GlassButton>
          </div>
        )}

        <div className="text-xs font-mono text-gray-300 bg-black/40 border border-white/10 rounded-2xl p-3.5 max-w-sm mx-auto">
          Tip: Ensure squad members actively queue competitive or custom games together on AP servers.
        </div>
      </GlassSurface>
    );
  }

  return (
    <GlassSurface level="1" className="p-8 sm:p-12 text-center max-w-xl mx-auto my-6 space-y-5">
      <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
        <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
      </div>

      <div>
        <h3 className="font-teko-title text-3xl sm:text-4xl text-white font-bold">
          TRACK YOUR SQUAD'S MAP SYNERGY
        </h3>
        <p className="text-sm text-gray-300 mt-1 max-w-md mx-auto">
          Add your squad's Riot IDs to uncover win rates, squad ACS/KD, and map MVPs across shared match histories.
        </p>
      </div>

      <GlassButton
        variant="primary"
        size="lg"
        onClick={handleImportAll6Squad}
        disabled={isImporting}
      >
        {isImporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>LOADING SQUAD MEMBERS...</span>
          </>
        ) : (
          <>
            <Users className="w-4 h-4" />
            <span>LOAD FULL 6-PLAYER SQUAD</span>
          </>
        )}
      </GlassButton>
    </GlassSurface>
  );
}
