import React, { useState } from 'react';
import GlassSurface from '../GlassSurface';
import MatchScoreboard from './MatchScoreboard';
import { ChevronDown, Calendar, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MatchRow({ match, player }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!match || !match.metadata) return null;

  const puuidLower = (player?.puuid || '').toLowerCase();
  const nameLower = (player?.name || '').toLowerCase();

  const pObj = (match.players?.all_players || []).find((p) => {
    const pPuuid = (p.puuid || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    return (puuidLower && pPuuid === puuidLower) || pName === nameLower;
  });

  const pTeam = (pObj?.team || '').toLowerCase();
  const teamObj = match.teams?.[pTeam];
  const isWin = teamObj?.has_won ?? true;

  const stats = pObj?.stats || {};
  const mapName = match.metadata.map || 'Valorant Match';
  const mode = match.metadata.mode || 'Competitive';
  const dateStr = match.metadata.game_start_patched || 'Recent';

  const roundsWon = teamObj?.rounds_won ?? 13;
  const roundsLost = teamObj?.rounds_lost ?? 8;
  const scoreline = `${roundsWon} - ${roundsLost}`;

  const kdaStr = `${stats.kills || 0} / ${stats.deaths || 0} / ${stats.assists || 0}`;
  const totalShots = (stats.headshots || 0) + (stats.bodyshots || 0) + (stats.legshots || 0);
  const hsPercent = totalShots > 0 ? Math.round(((stats.headshots || 0) / totalShots) * 100) : 0;

  return (
    <GlassSurface
      level="1"
      hoverable
      className={`p-4 sm:p-5 border transition-all relative overflow-hidden ${
        isWin ? '!bg-emerald-950/20 !border-emerald-500/40' : '!bg-red-950/20 !border-red-500/40'
      }`}
    >
      {/* Left Outcome Color Strip Accent */}
      <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isWin ? 'bg-emerald-400' : 'bg-[#ff4655]'}`} />

      {/* Main Row Content Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer pl-2"
      >
        {/* Left: Agent Icon, Map & W/L Badge */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-black/60 border border-white/20 p-1 overflow-hidden shrink-0">
            {pObj?.assets?.agent?.small ? (
              <img src={pObj.assets.agent.small} alt={pObj.character} className="w-full h-full object-contain" />
            ) : (
              <Shield className="w-full h-full text-cyan-400 p-2" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold uppercase ${
                isWin ? 'bg-emerald-500 text-black' : 'bg-[#ff4655] text-white'
              }`}>
                {isWin ? 'VICTORY' : 'DEFEAT'}
              </span>
              <h4 className="font-oswald-header text-lg text-white font-bold leading-none">
                {mapName} <span className="text-xs font-mono text-gray-400 font-normal">({mode})</span>
              </h4>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateStr}</span>
              <span>•</span>
              <span className="text-gray-200 font-bold">{scoreline}</span>
            </div>
          </div>
        </div>

        {/* Right: KDA, ACS, HS% & Expand Chevron */}
        <div className="flex items-center justify-between sm:justify-end gap-5">
          <div className="text-right font-mono">
            <div className="text-xs font-bold text-amber-400">{stats.score || 0} ACS</div>
            <div className="text-sm font-bold text-white">{kdaStr}</div>
            <div className="text-[11px] text-[#ff4655]">{hsPercent}% HS</div>
          </div>

          <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180 bg-white/20' : ''}`}>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {/* Accordion Inline Match Scoreboard Extension */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="overflow-hidden mt-4 pt-4 border-t border-white/10"
          >
            <MatchScoreboard match={match} />
          </motion.div>
        )}
      </AnimatePresence>
    </GlassSurface>
  );
}
