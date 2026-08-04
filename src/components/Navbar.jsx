import React from 'react';
import GlassSurface from './GlassSurface';
import GlassButton from './GlassButton';
import { useSquad } from '../context/SquadContext';
import { SQUAD_6_IDS } from './AddPlayerForm';
import { Globe, Users, LayoutGrid, ListFilter, UserCheck, Shield } from 'lucide-react';

export default function Navbar() {
  const { addPlayer, isLoading, players } = useSquad();

  const handleAddFullSquad = async () => {
    for (const item of SQUAD_6_IDS) {
      try {
        await addPlayer(`${item.name}#${item.tag}`, 'ap');
      } catch (e) {}
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Floating Dynamic Island Top Navigation Bar */}
      <div className="relative z-30 pt-3 px-3 sm:pt-4 sm:px-4 max-w-7xl mx-auto">
        <GlassSurface
          level="2"
          useDistortion
          className="!rounded-full px-4 py-2.5 sm:px-5 sm:py-3 flex items-center justify-between gap-3 shadow-2xl"
        >
          {/* Brand & Dynamic Island Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#ff4655] to-pink-600 flex items-center justify-center font-teko text-xl sm:text-2xl font-bold text-white shadow-glow-red tracking-tighter shrink-0">
              V
            </div>
            <div className="truncate">
              <h1 className="font-teko-title text-xl sm:text-2xl text-white font-bold tracking-wider leading-none truncate">
                VALORANT <span className="text-[#ff4655]">SQUAD SYNERGY</span>
              </h1>
              <span className="text-[10px] font-mono text-gray-300 hidden sm:inline-block">
                iOS 26 Liquid Glass Edition
              </span>
            </div>
          </div>

          {/* Region & Load Squad Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>AP Region</span>
            </div>

            <GlassButton
              variant="primary"
              size="sm"
              onClick={handleAddFullSquad}
              disabled={isLoading}
              className="!rounded-full px-3 py-1.5 text-xs"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOAD 6 SQUAD MEMBERS</span>
              <span className="sm:hidden">LOAD 6</span>
            </GlassButton>
          </div>
        </GlassSurface>
      </div>

      {/* iOS-Native Mobile Bottom Glass Tab Bar (Fixed at bottom on mobile viewports) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-[#0a0b0f]/85 border-t border-white/20 backdrop-blur-2xl">
        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
          <button
            type="button"
            onClick={() => scrollToSection('top')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl text-gray-300 active:bg-white/20 transition-all cursor-pointer min-h-[44px]"
          >
            <Shield className="w-4 h-4 text-[#ff4655]" />
            <span className="mt-0.5 font-bold">Home</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('roster-section')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl text-gray-300 active:bg-white/20 transition-all cursor-pointer min-h-[44px]"
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span className="mt-0.5 font-bold">Roster ({players.length})</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('maps-section')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl text-gray-300 active:bg-white/20 transition-all cursor-pointer min-h-[44px]"
          >
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            <span className="mt-0.5 font-bold">Maps</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('matches-section')}
            className="flex flex-col items-center justify-center p-2 rounded-2xl text-gray-300 active:bg-white/20 transition-all cursor-pointer min-h-[44px]"
          >
            <ListFilter className="w-4 h-4 text-emerald-400" />
            <span className="mt-0.5 font-bold">Matches</span>
          </button>
        </div>
      </div>
    </>
  );
}
