import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { seasonShortToLabel } from '../../lib/playerStats';

export default function SeasonSelector({ availableSeasons, selectedSeasonId, onSelect, playerRank }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Take the 6 most recent, rest go into dropdown
  const recentSeasons = availableSeasons.slice(0, 6);
  const olderSeasons = availableSeasons.slice(6);

  const getPillClasses = (isActive) => {
    return `px-4 py-1.5 rounded-full text-[13px] font-oswald tracking-wide whitespace-nowrap transition-colors cursor-pointer border ${
      isActive 
        ? 'bg-[var(--red)] border-[var(--red)] text-white shadow-[0_0_10px_rgba(255,70,85,0.4)]' 
        : 'bg-[var(--bg-hover)] border-[var(--border)] text-[var(--muted)] hover:text-white hover:border-white/20'
    }`;
  };

  const getRankIconForSeason = (seasonObj) => {
    if (!playerRank || !playerRank.seasonal || !seasonObj.id) return null;
    const sData = playerRank.seasonal.find(s => s.season?.id === seasonObj.id);
    if (sData?.end_tier?.id) {
      return `https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/${sData.end_tier.id}/smallicon.png`;
    }
    return null;
  };

  return (
    <div className="bg-[var(--bg-card)] border-b border-[var(--border)] px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar relative">
      
      <button 
        onClick={() => onSelect('')}
        className={getPillClasses(selectedSeasonId === '')}
      >
        All Time
      </button>

      {recentSeasons.map((season) => {
        const icon = getRankIconForSeason(season);
        return (
          <button 
            key={season.id}
            onClick={() => onSelect(season.id)}
            className={`${getPillClasses(selectedSeasonId === season.id)} flex items-center gap-2`}
          >
            {season.short ? season.short.toUpperCase() : 'UNKNOWN'}
            {icon && <img src={icon} alt="Rank" className="w-4 h-4 object-contain" />}
          </button>
        );
      })}

      {olderSeasons.length > 0 && (
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`${getPillClasses(olderSeasons.some(s => s.id === selectedSeasonId))} flex items-center gap-1`}
          >
            More {dropdownOpen ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-xl z-50 min-w-[160px] py-1">
              {olderSeasons.map((season) => (
                <button
                  key={season.id}
                  onClick={() => {
                    onSelect(season.id);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-[13px] font-oswald flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors ${selectedSeasonId === season.id ? 'text-[var(--red)]' : 'text-[var(--muted)]'}`}
                >
                  {seasonShortToLabel(season.short)}
                  {getRankIconForSeason(season) && <img src={getRankIconForSeason(season)} alt="Rank" className="w-4 h-4 object-contain" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
