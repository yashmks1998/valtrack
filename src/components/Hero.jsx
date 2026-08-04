import React from 'react';
import GlassSurface from './GlassSurface';
import { Sparkles, Swords, Shield, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative py-6 max-w-7xl mx-auto px-4">
      <GlassSurface level="1" className="p-6 sm:p-8 text-center sm:text-left relative overflow-hidden">
        {/* Decorative Liquid Lighting */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ff4655]/20 via-pink-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-mono text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Real-Time Squad Match History Analytics</span>
            </div>

            <h2 className="font-teko-title text-4xl sm:text-5xl lg:text-6xl text-white font-bold tracking-wider leading-none">
              SEE WHO REALLY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4655] via-pink-500 to-cyan-400">POPS OFF TOGETHER</span>
            </h2>

            <p className="text-sm text-gray-300 font-sans max-w-2xl leading-relaxed">
              Cross-reference competitive match histories to reveal your squad's map win rates, average ACS, K/D ratios, and MVP crowns.
            </p>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-3 text-xs font-mono text-gray-300 shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-center">
              <div className="text-lg font-bold text-white font-mono">AP</div>
              <div className="text-[10px] text-gray-400 uppercase">Server Region</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-center">
              <div className="text-lg font-bold text-[#ff4655] font-mono">LIVE</div>
              <div className="text-[10px] text-gray-400 uppercase">Api Connected</div>
            </div>
          </div>
        </div>
      </GlassSurface>
    </div>
  );
}
