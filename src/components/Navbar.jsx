import React from 'react';
import GlassSurface from './GlassSurface';
import GlassButton from './GlassButton';
import { useSquad } from '../context/SquadContext';
import { SQUAD_6_IDS } from './AddPlayerForm';
import { Sparkles, Globe, Users, Shield } from 'lucide-react';

export default function Navbar() {
  const { addPlayer, isLoading } = useSquad();

  const handleAddFullSquad = async () => {
    for (const item of SQUAD_6_IDS) {
      try {
        await addPlayer(`${item.name}#${item.tag}`, 'ap');
      } catch (e) {}
    }
  };

  return (
    <div className="relative z-30 pt-4 px-4 max-w-7xl mx-auto">
      <GlassSurface
        level="2"
        className="!rounded-full px-5 py-3 flex items-center justify-between gap-4 shadow-2xl"
      >
        {/* Brand & Dynamic Island Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff4655] to-pink-600 flex items-center justify-center font-teko text-2xl font-bold text-white shadow-glow-red tracking-tighter">
            V
          </div>
          <div>
            <h1 className="font-teko-title text-2xl text-white font-bold tracking-wider leading-none">
              VALORANT <span className="text-[#ff4655]">SQUAD SYNERGY</span>
            </h1>
            <span className="text-[10px] font-mono text-gray-300 hidden sm:inline-block">
              iOS 26 Liquid Glass Edition
            </span>
          </div>
        </div>

        {/* Region & Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-cyan-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>AP Region</span>
          </div>

          <GlassButton
            variant="primary"
            size="sm"
            onClick={handleAddFullSquad}
            disabled={isLoading}
            className="!rounded-full"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">LOAD 6 SQUAD MEMBERS</span>
            <span className="sm:hidden">6 SQUAD</span>
          </GlassButton>
        </div>
      </GlassSurface>
    </div>
  );
}
