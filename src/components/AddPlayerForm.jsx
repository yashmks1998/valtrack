import React, { useState, useEffect, useRef } from 'react';
import { useSquad } from '../context/SquadContext';
import { searchPlayerAccount, fetchAccount } from '../api/henrik';
import GlassSurface from './GlassSurface';
import GlassButton from './GlassButton';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserPlus, Loader2, CheckCircle2, AlertCircle, Shield, Sparkles, Users } from 'lucide-react';

export const SUGGESTED_PLAYERS = [
  { name: 'Maqbool Pandit', tag: 'MZRPR', note: 'AP Region' },
  { name: 'BheemDholakpur', tag: 'TBSM', note: 'AP Region' },
  { name: 'necromancer', tag: '3239', note: 'AP Region' },
  { name: 'Rauf Lala', tag: 'MZPR', note: 'AP Region' },
  { name: 'Guddu Pandit', tag: 'MZRPR', note: 'AP Region' },
  { name: 'AronBlaise', tag: 'CURSD', note: 'AP Region' },
];

export const SQUAD_6_IDS = SUGGESTED_PLAYERS;

export default function AddPlayerForm() {
  const { addPlayer, isLoading, players } = useSquad();
  const [riotIdInput, setRiotIdInput] = useState('');
  
  const [isValidating, setIsValidating] = useState(false);
  const [isValidAccount, setIsValidAccount] = useState(null);
  const [inputError, setInputError] = useState('');
  
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const query = riotIdInput.trim();

    if (!query || query.length < 2) {
      setIsValidAccount(null);
      setInputError('');
      setSuggestions([]);
      setShowDropdown(false);
      setIsValidating(false);
      return;
    }

    setShowDropdown(true);

    const timer = setTimeout(async () => {
      if (query.includes('#')) {
        const [name, tag] = query.split('#');
        if (name.trim() && tag.trim()) {
          setIsValidating(true);
          try {
            const acc = await fetchAccount(name, tag);
            if (acc) {
              setIsValidAccount(true);
              setInputError('');
            } else {
              setIsValidAccount(false);
              setInputError('Riot ID not found');
            }
          } catch (err) {
            setIsValidAccount(false);
            setInputError(err.message || 'Player not found');
          } finally {
            setIsValidating(false);
          }
        }
      } else {
        setIsValidAccount(null);
        setInputError('');
      }

      try {
        const liveResults = await searchPlayerAccount(query);
        setSuggestions(liveResults);
      } catch (err) {
        setSuggestions([]);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [riotIdInput]);

  const handleAddSubmit = async (riotIdToAdd) => {
    setShowDropdown(false);
    setInputError('');

    try {
      await addPlayer(riotIdToAdd, 'ap');
      setRiotIdInput('');
      setIsValidAccount(null);
    } catch (err) {
      setInputError(err.message || 'Failed to add player.');
      setIsValidAccount(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!riotIdInput.trim()) {
      setInputError('Please enter a Riot ID in Name#Tag format');
      return;
    }
    handleAddSubmit(riotIdInput);
  };

  const queryLower = riotIdInput.trim().toLowerCase();
  const matchedSquadSuggestions = SUGGESTED_PLAYERS.filter(
    (p) =>
      p.name.toLowerCase().includes(queryLower) ||
      `${p.name}#${p.tag}`.toLowerCase().includes(queryLower) ||
      p.tag.toLowerCase().includes(queryLower)
  );

  return (
    <GlassSurface level="2" className="p-5 sm:p-6 shadow-2xl overflow-visible space-y-4">
      
      {/* Title & Instructions */}
      <div>
        <h3 className="font-oswald-header text-xl sm:text-2xl text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ff4655] animate-pulse" />
          SELECT SQUAD PLAYER OR SEARCH RIOT ID
        </h3>
        <p className="text-xs font-mono text-gray-300 mt-1">
          Select a player from suggestions or type any Riot ID to call the Live Henrik API.
        </p>
      </div>

      {/* Suggested Players Grid Chips */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-cyan-300 font-bold uppercase flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>SUGGESTED PLAYERS (TAP TO FETCH LIVE DATA)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {SUGGESTED_PLAYERS.map((p) => {
            const isAdded = players.some(
              (sp) => sp.name.toLowerCase() === p.name.toLowerCase() && sp.tag.toLowerCase() === p.tag.toLowerCase()
            );

            return (
              <motion.button
                key={`${p.name}-${p.tag}`}
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => !isAdded && handleAddSubmit(`${p.name}#${p.tag}`)}
                disabled={isAdded || isLoading}
                className={`p-3 rounded-2xl border text-left font-mono transition-all flex flex-col justify-between cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-950/20 border-emerald-500/40 opacity-60 cursor-not-allowed'
                    : 'bg-black/40 border-white/20 hover:border-[#ff4655]/60 hover:bg-white/10 shadow-lg'
                }`}
              >
                <div className="truncate">
                  <div className="font-oswald-header text-sm text-white font-bold truncate">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-gray-400">#{p.tag}</div>
                </div>

                <div className="mt-2 text-[10px] font-bold">
                  {isAdded ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ADDED
                    </span>
                  ) : (
                    <span className="text-[#ff4655]">+ FETCH LIVE API</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Manual Search Bar */}
      <form onSubmit={handleSubmit} className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3 relative" ref={wrapperRef}>
          <div className="relative flex-1">
            <input
              type="text"
              value={riotIdInput}
              onChange={(e) => setRiotIdInput(e.target.value)}
              onFocus={() => {
                if (riotIdInput.trim().length >= 2) setShowDropdown(true);
              }}
              placeholder="Or type any Riot ID (e.g. TenZ#SEN)..."
              disabled={isLoading}
              className={`w-full bg-black/40 backdrop-blur-xl border rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-gray-400 outline-none transition-all ${
                isValidAccount === true
                  ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                  : isValidAccount === false || inputError
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-white/20 focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655]'
              }`}
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-4 pointer-events-none" />

            <div className="absolute right-3.5 top-3.5 flex items-center gap-1">
              {isValidating ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : isValidAccount === true ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : isValidAccount === false ? (
                <AlertCircle className="w-4 h-4 text-red-400" />
              ) : null}
            </div>

            {/* Dropdown Results */}
            <AnimatePresence>
              {showDropdown && (suggestions.length > 0 || matchedSquadSuggestions.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  style={{ transformOrigin: 'top center' }}
                  className="absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden"
                >
                  <GlassSurface level="3" className="!rounded-2xl p-0 overflow-hidden max-h-80 overflow-y-auto divide-y divide-white/10">
                    <div className="px-3 py-2 bg-black/40 text-[10px] font-mono text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" /> Live Suggestions
                      </span>
                      <span>AP Region</span>
                    </div>

                    {/* Live API Search Suggestions */}
                    {suggestions.map((acc) => (
                      <div
                        key={acc.puuid}
                        onClick={() => handleAddSubmit(acc.riotId)}
                        className="p-3 hover:bg-white/10 cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-black/60 border border-white/20 p-0.5 overflow-hidden shrink-0">
                            {acc.cardSmall ? (
                              <img src={acc.cardSmall} alt={acc.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Shield className="w-full h-full text-cyan-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-oswald-header text-sm text-white group-hover:text-cyan-300 transition-colors">
                              {acc.name}<span className="text-gray-400 text-xs font-normal font-mono">#{acc.tag}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono">
                              Level {acc.accountLevel} • AP Region
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-cyan-300">+ Call Live API</span>
                      </div>
                    ))}
                  </GlassSurface>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <GlassButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || isValidating}
            className="shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>FETCHING LIVE API...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>FETCH LIVE API</span>
              </>
            )}
          </GlassButton>
        </div>

        {inputError && (
          <div className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1.5 animate-fadeIn">
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>{inputError}</span>
          </div>
        )}
      </form>

    </GlassSurface>
  );
}
