import React from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';

export default function FilterBar({ 
  availableMaps, availableAgents, 
  selectedMode, selectedMap, selectedOutcome, selectedAgent,
  onSelectMode, onSelectMap, onSelectOutcome, onSelectAgent,
  onReset 
}) {
  
  const modes = [
    { value: '', label: 'All Modes' },
    { value: 'competitive', label: 'Competitive' },
    { value: 'unrated', label: 'Unrated' },
    { value: 'swiftplay', label: 'Swiftplay' },
    { value: 'deathmatch', label: 'Deathmatch' },
    { value: 'teamdeathmatch', label: 'Team Deathmatch' },
    { value: 'spikerush', label: 'Spike Rush' },
    { value: 'premier', label: 'Premier' }
  ];

  const outcomes = [
    { value: '', label: 'All Outcomes' },
    { value: 'win', label: 'Win' },
    { value: 'loss', label: 'Loss' },
    { value: 'draw', label: 'Draw' }
  ];

  const maps = [{ value: '', label: 'All Maps' }, ...availableMaps.map(m => ({ value: m, label: m }))];
  const agents = [{ value: '', label: 'All Agents' }, ...availableAgents.map(a => ({ value: a, label: a }))];

  const hasActiveFilters = selectedMode || selectedMap || selectedOutcome || selectedAgent;

  const FilterDropdown = ({ options, value, onChange, placeholder }) => {
    return (
      <div className="relative">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-[var(--bg-hover)] border border-[var(--border)] rounded-md px-3 py-1.5 pr-8 text-[12px] font-inter text-white focus:outline-none focus:border-white/20 cursor-pointer min-w-[140px]"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--muted)] pointer-events-none" />
        {value !== '' && (
          <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[var(--red)] -translate-y-1/2 translate-x-1/2" />
        )}
      </div>
    );
  };

  return (
    <div className="sticky top-0 z-40 bg-[var(--bg-base)] border-b border-[var(--border)] p-3 px-6 flex flex-wrap items-center gap-3">
      <span className="text-[11px] font-oswald text-[var(--muted)] uppercase tracking-wide mr-2">Filters</span>
      
      <FilterDropdown options={modes} value={selectedMode} onChange={onSelectMode} />
      <FilterDropdown options={maps} value={selectedMap} onChange={onSelectMap} />
      <FilterDropdown options={outcomes} value={selectedOutcome} onChange={onSelectOutcome} />
      <FilterDropdown options={agents} value={selectedAgent} onChange={onSelectAgent} />

      {hasActiveFilters && (
        <button 
          onClick={onReset}
          className="ml-auto flex items-center gap-1.5 text-[11px] font-oswald uppercase text-[var(--muted)] hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>
  );
}
