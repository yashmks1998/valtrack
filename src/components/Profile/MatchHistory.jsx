import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOutcome } from '../../lib/playerStats';
import { ChevronDown, Crown } from 'lucide-react';

export default function MatchHistory({ matches, playerPuuid }) {
  const [displayCount, setDisplayCount] = useState(10);
  const [expandedMatchId, setExpandedMatchId] = useState(null);

  if (!matches || matches.length === 0) {
    return (
      <div className="tracker-glass p-8 text-center">
        <div className="text-[var(--muted)] font-inter text-sm">No matches found for the selected filters.</div>
      </div>
    );
  }

  const visibleMatches = matches.slice(0, displayCount);

  return (
    <div className="space-y-2">
      {visibleMatches.map(m => (
        <MatchRow 
          key={m.metadata.matchid} 
          match={m} 
          playerPuuid={playerPuuid} 
          isExpanded={expandedMatchId === m.metadata.matchid}
          onToggle={() => setExpandedMatchId(prev => prev === m.metadata.matchid ? null : m.metadata.matchid)}
        />
      ))}
      
      {matches.length > displayCount && (
        <button 
          onClick={() => setDisplayCount(prev => prev + 10)}
          className="w-full tracker-glass py-3 mt-4 text-[13px] font-oswald text-[var(--muted)] uppercase hover:text-white transition-colors"
        >
          Load More Matches
        </button>
      )}
    </div>
  );
}

function MatchRow({ match, playerPuuid, isExpanded, onToggle }) {
  const outcome = getOutcome(match, playerPuuid);
  const pObj = match.players?.all_players?.find(p => (p.puuid || '').toLowerCase() === (playerPuuid || '').toLowerCase());
  
  if (!pObj) return null;

  const bgClass = outcome === 'win' ? 'bg-[var(--green)]/10 hover:bg-[var(--green)]/15 border-[var(--green)]/20' 
                : outcome === 'loss' ? 'bg-[var(--loss)]/10 hover:bg-[var(--loss)]/15 border-[var(--loss)]/20' 
                : 'bg-[var(--draw)]/10 hover:bg-[var(--draw)]/15 border-[var(--draw)]/20';

  const badgeColor = outcome === 'win' ? 'bg-[var(--green)]' : outcome === 'loss' ? 'bg-[var(--loss)]' : 'bg-[var(--draw)]';

  const stats = pObj.stats || {};
  const kda = `${stats.kills} / ${stats.deaths} / ${stats.assists}`;
  const totalRounds = match.rounds?.length || 1;
  const acs = Math.round((stats.score || 0) / totalRounds);
  
  const mapName = match.metadata?.map || 'Unknown';
  const mode = match.metadata?.mode || 'Unknown';

  // Find team scores
  const pTeam = pObj.team?.toLowerCase();
  const myScore = match.teams?.[pTeam]?.rounds_won || 0;
  const enemyTeam = pTeam === 'red' ? 'blue' : 'red';
  const enemyScore = match.teams?.[enemyTeam]?.rounds_won || 0;
  const scoreStr = `${myScore} - ${enemyScore}`;

  return (
    <div className={`border rounded-lg overflow-hidden transition-colors ${bgClass}`}>
      <div 
        onClick={onToggle}
        className="px-4 py-3 flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <div className={`w-1.5 h-10 rounded-full ${badgeColor}`} />
          <img src={pObj.assets?.agent?.small} alt="Agent" className="w-10 h-10 rounded-md border border-white/10 bg-black/50" />
          <div className="flex flex-col">
            <span className="font-oswald text-white uppercase text-[15px] leading-none mb-1">{mapName}</span>
            <span className="text-[11px] font-inter text-[var(--muted)] capitalize">{mode}</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-between px-4">
          <div className="flex flex-col items-center min-w-[80px]">
            <span className="font-teko text-2xl text-white leading-none">{scoreStr}</span>
            <span className={`text-[10px] font-oswald uppercase tracking-wider ${outcome === 'win' ? 'text-[var(--green)]' : outcome === 'loss' ? 'text-[var(--loss)]' : 'text-[var(--draw)]'}`}>
              {outcome}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-teko text-xl text-white leading-none">{kda}</span>
            <span className="text-[10px] font-oswald text-[var(--muted)] uppercase tracking-wider">K / D / A</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-teko text-xl text-white leading-none">{acs}</span>
            <span className="text-[10px] font-oswald text-[var(--muted)] uppercase tracking-wider">ACS</span>
          </div>
        </div>

        <div className="w-8 flex justify-end">
          <ChevronDown className={`w-4 h-4 text-[var(--muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#0a0b0f]/80 border-t border-black/20"
          >
            <div className="p-4">
              <ScoreboardTable match={match} playerPuuid={playerPuuid} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreboardTable({ match, playerPuuid }) {
  const allPlayers = match.players?.all_players || [];
  if (allPlayers.length === 0) return null;

  // Determine MVP
  let mvpPuuid = null;
  let maxScore = -1;
  allPlayers.forEach(p => {
    if (p.stats?.score > maxScore) {
      maxScore = p.stats.score;
      mvpPuuid = p.puuid;
    }
  });

  const totalRounds = match.rounds?.length || 1;

  // Split teams
  const redTeam = allPlayers.filter(p => p.team?.toLowerCase() === 'red').sort((a,b) => (b.stats?.score || 0) - (a.stats?.score || 0));
  const blueTeam = allPlayers.filter(p => p.team?.toLowerCase() === 'blue').sort((a,b) => (b.stats?.score || 0) - (a.stats?.score || 0));

  const renderTeamTable = (teamPlayers, teamName) => {
    if (teamPlayers.length === 0) return null;
    const teamScore = match.teams?.[teamName]?.rounds_won || 0;
    const won = match.teams?.[teamName]?.has_won;
    const isRed = teamName === 'red';
    
    return (
      <div className="mb-6 last:mb-0">
        <div className={`px-3 py-1.5 mb-2 text-xs font-oswald uppercase tracking-wider flex justify-between rounded ${isRed ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
          <span>{teamName} Team</span>
          <span>{teamScore} Won {won && '(VICTORY)'}</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-[12px] font-inter border-collapse min-w-[500px]">
            <thead>
              <tr className="text-[var(--muted)] font-oswald uppercase tracking-wider border-b border-[var(--border)]">
                <th className="py-2 pl-2 font-normal w-8">Agt</th>
                <th className="py-2 font-normal">Player</th>
                <th className="py-2 font-normal text-right">ACS</th>
                <th className="py-2 font-normal text-right">K</th>
                <th className="py-2 font-normal text-right">D</th>
                <th className="py-2 font-normal text-right">A</th>
                <th className="py-2 font-normal text-right">+/-</th>
                <th className="py-2 pr-2 font-normal text-right">HS%</th>
              </tr>
            </thead>
            <tbody>
              {teamPlayers.map((p) => {
                const s = p.stats || {};
                const isMe = (p.puuid || '').toLowerCase() === (playerPuuid || '').toLowerCase();
                const isMvp = p.puuid === mvpPuuid;
                const acs = Math.round(s.score / totalRounds);
                const plusMinus = s.kills - s.deaths;
                const totalShots = (s.headshots || 0) + (s.bodyshots || 0) + (s.legshots || 0);
                const hs = totalShots > 0 ? Math.round((s.headshots / totalShots) * 100) : 0;

                return (
                  <tr key={p.puuid} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isMe ? 'bg-white/[0.03]' : ''}`}>
                    <td className="py-1.5 pl-2">
                      <img src={p.assets?.agent?.small} alt="Agt" className="w-6 h-6 rounded border border-white/10" />
                    </td>
                    <td className="py-1.5 font-medium text-white flex items-center gap-2">
                      <span className="truncate max-w-[120px]">{p.name}</span>
                      {isMvp && <Crown className="w-3.5 h-3.5 text-[var(--gold)]" />}
                    </td>
                    <td className="py-1.5 text-right font-mono text-gray-300">{acs}</td>
                    <td className="py-1.5 text-right font-mono text-gray-300">{s.kills}</td>
                    <td className="py-1.5 text-right font-mono text-gray-300">{s.deaths}</td>
                    <td className="py-1.5 text-right font-mono text-gray-300">{s.assists}</td>
                    <td className={`py-1.5 text-right font-mono ${plusMinus > 0 ? 'text-[var(--green)]' : plusMinus < 0 ? 'text-[var(--loss)]' : 'text-gray-400'}`}>
                      {plusMinus > 0 ? '+' : ''}{plusMinus}
                    </td>
                    <td className="py-1.5 pr-2 text-right font-mono text-gray-300">{hs}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderTeamTable(blueTeam, 'blue')}
      {renderTeamTable(redTeam, 'red')}
    </div>
  );
}
