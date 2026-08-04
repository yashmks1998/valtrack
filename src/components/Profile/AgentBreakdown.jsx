import React, { useState } from 'react';
import { computeAgentMastery } from '../../lib/playerStats';

export default function AgentBreakdown({ matches, player }) {
  const [sortBy, setSortBy] = useState('games');
  
  const agents = computeAgentMastery(matches, player);

  if (!agents || agents.length === 0) return null;

  // Sort logic
  const sortedAgents = [...agents].sort((a, b) => {
    if (sortBy === 'winRate') return b.winRate - a.winRate;
    if (sortBy === 'kda') return b.kda - a.kda;
    if (sortBy === 'acs') return b.avgACS - a.avgACS;
    return b.games - a.games; // default
  });

  return (
    <div className="tracker-glass overflow-hidden">
      <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]">
        <h3 className="font-oswald uppercase text-white tracking-wide text-sm">Top Agents</h3>
        
        <div className="flex bg-[#0a0b0f] rounded border border-[var(--border)] p-0.5">
          {['games', 'winRate', 'kda'].map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-3 py-1 text-[11px] font-oswald uppercase rounded transition-colors ${
                sortBy === s ? 'bg-[var(--bg-hover)] text-white' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {s === 'games' ? 'Matches' : s === 'winRate' ? 'Win %' : 'KDA'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-[1px] bg-[var(--border)]">
        {sortedAgents.slice(0, 6).map((agent, i) => (
          <div 
            key={agent.agent} 
            className={`bg-[var(--bg-base)] p-3 flex items-center gap-3 relative overflow-hidden group hover:bg-[var(--bg-hover)] transition-colors ${
              i === 0 ? 'before:absolute before:inset-0 before:border before:border-[var(--gold)]/30 before:pointer-events-none' : ''
            }`}
          >
            {/* Background subtle role tint */}
            <div 
              className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity" 
              style={{ backgroundColor: getRoleColor(agent.role) }} 
            />

            <img 
              src={agent.icon} 
              alt={agent.agent} 
              className="w-12 h-12 rounded object-cover border border-[var(--border)] bg-[#0a0b0f] z-10 shrink-0" 
            />
            
            <div className="flex-1 min-w-0 z-10">
              <div className="flex items-center justify-between">
                <div className="font-oswald text-white uppercase text-sm truncate">{agent.agent}</div>
                <div className="font-teko text-lg text-white leading-none">{agent.winRate}%</div>
              </div>
              <div className="text-[10px] font-inter text-[var(--muted)] mt-0.5 truncate flex items-center justify-between">
                <span>{agent.games} Matches</span>
                <span>{agent.kda} KDA</span>
              </div>
              
              {/* Mini Win Rate Bar */}
              <div className="w-full h-1 bg-[#0a0b0f] rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-[var(--green)] rounded-full" 
                  style={{ width: `${agent.winRate}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getRoleColor(role) {
  switch (role) {
    case 'Duelist': return 'var(--red)';
    case 'Initiator': return '#38bdf8';
    case 'Controller': return '#a855f7';
    case 'Sentinel': return '#34d399';
    default: return 'var(--muted)';
  }
}
