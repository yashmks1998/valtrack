import React from 'react';
import { Shield } from 'lucide-react';

export default function MatchScoreboard({ match }) {
  if (!match || !match.players || !match.players.all_players) return null;

  const allPlayers = match.players.all_players;

  // Separate team Red and team Blue
  const redTeam = allPlayers.filter((p) => (p.team || '').toLowerCase() === 'red');
  const blueTeam = allPlayers.filter((p) => (p.team || '').toLowerCase() === 'blue');

  const redWon = match.teams?.red?.has_won ?? false;
  const blueWon = match.teams?.blue?.has_won ?? false;

  const renderTeamTable = (teamPlayers, teamName, isWinner, roundsWon, roundsLost) => (
    <div className="space-y-2">
      <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
        isWinner
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
          : 'bg-red-950/40 border-red-500/40 text-red-400'
      }`}>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          <span>TEAM {teamName.toUpperCase()} ({isWinner ? 'VICTORY' : 'DEFEAT'})</span>
        </div>
        <div>Score: {roundsWon} - {roundsLost}</div>
      </div>

      {/* Responsive Horizontal Scroll Table Container with Visual Hints */}
      <div className="overflow-x-auto no-scrollbar border border-white/10 rounded-xl bg-black/40">
        <table className="w-full text-left text-xs font-mono border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-[10px] uppercase bg-black/60">
              <th className="py-2 px-3 sticky left-0 bg-[#0a0b0f] z-10 min-w-[140px]">Player</th>
              <th className="py-2 px-3 text-right">ACS</th>
              <th className="py-2 px-3 text-right">K / D / A</th>
              <th className="py-2 px-3 text-right">KD</th>
              <th className="py-2 px-3 text-right">HS%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {teamPlayers.map((p, idx) => {
              const stats = p.stats || {};
              const kdRatio = stats.deaths > 0 ? (stats.kills / stats.deaths).toFixed(2) : stats.kills;
              const totalShots = (stats.headshots || 0) + (stats.bodyshots || 0) + (stats.legshots || 0);
              const hsPercent = totalShots > 0 ? Math.round(((stats.headshots || 0) / totalShots) * 100) : 0;

              return (
                <tr key={p.puuid || p.name || idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-2 px-3 flex items-center gap-2 sticky left-0 bg-[#0a0b0f] z-10">
                    <div className="w-6 h-6 rounded-lg bg-black/60 border border-white/20 overflow-hidden shrink-0">
                      {p.assets?.agent?.small ? (
                        <img src={p.assets.agent.small} alt={p.character} className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-white">?</div>
                      )}
                    </div>
                    <div className="truncate max-w-[100px]">
                      <span className="font-bold text-white truncate block">{p.name}</span>
                      <span className="text-[10px] text-gray-400 font-normal">#{p.tag}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-amber-400">{stats.score || 0}</td>
                  <td className="py-2 px-3 text-right text-gray-200">{stats.kills || 0} / {stats.deaths || 0} / {stats.assists || 0}</td>
                  <td className="py-2 px-3 text-right text-cyan-300">{kdRatio}</td>
                  <td className="py-2 px-3 text-right text-[#ff4655]">{hsPercent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 pt-2">
      {renderTeamTable(
        redTeam,
        'Red',
        redWon,
        match.teams?.red?.rounds_won ?? 0,
        match.teams?.red?.rounds_lost ?? 0
      )}

      {renderTeamTable(
        blueTeam,
        'Blue',
        blueWon,
        match.teams?.blue?.rounds_won ?? 0,
        match.teams?.blue?.rounds_lost ?? 0
      )}
    </div>
  );
}
