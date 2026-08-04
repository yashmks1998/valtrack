import React from 'react';
import AgentMasteryCard from './AgentMasteryCard';
import { UserCheck } from 'lucide-react';

export default function AgentMasteryGrid({ agentsList = [] }) {
  if (!agentsList || agentsList.length === 0) {
    return (
      <div className="text-xs font-mono text-gray-400 bg-black/40 border border-white/10 rounded-2xl p-6 text-center">
        Not enough match history data to calculate Agent Mastery.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#ff4655]" />
          <h3 className="font-oswald-header text-lg text-white font-bold">
            AGENT MASTERY & MAIN AGENT POOL ({agentsList.length} AGENTS PLAYED)
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-400 hidden sm:inline">
          Tap card for per-map stats
        </span>
      </div>

      {/* Grid: 2 columns minimum on mobile (never 1 full width card) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {agentsList.map((agentData) => (
          <AgentMasteryCard key={agentData.agent} agentData={agentData} />
        ))}
      </div>
    </div>
  );
}
