import React from 'react';
import { motion } from 'framer-motion';

export default function ValorantLoader({ text = "SABAR KARLE MC" }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0b0f]/95 backdrop-blur-2xl text-white select-none">
      
      {/* Animated Glowing Valorant V Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.95, 1.05, 0.95], opacity: 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center"
      >
        {/* Pulsing Backlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff4655] to-cyan-500 rounded-3xl filter blur-2xl opacity-40 animate-pulse" />

        {/* Liquid Glass Hexagon Frame */}
        <div className="relative w-full h-full bg-white/10 border-2 border-white/30 rounded-3xl p-4 flex items-center justify-center backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shimmer" />

          {/* Valorant Styled Geometric V Icon */}
          <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 fill-current text-[#ff4655] drop-shadow-[0_0_15px_rgba(255,70,85,0.8)]">
            <path d="M 20,20 L 50,80 L 40,80 L 10,20 Z" fill="#ff4655" />
            <path d="M 80,20 L 50,80 L 60,80 L 90,20 Z" fill="#ffffff" />
            <polygon points="50,45 62,20 38,20" fill="#38bdf8" />
          </svg>
        </div>
      </motion.div>

      {/* High-Tech Custom Text Header */}
      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-center space-y-2"
      >
        <h2 className="font-teko-title text-4xl sm:text-6xl text-white font-bold tracking-widest uppercase drop-shadow-[0_0_20px_rgba(255,70,85,0.7)]">
          {text}
        </h2>
        <div className="text-xs font-mono text-cyan-300 tracking-wider flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-ping" />
          <span>SYNCHRONIZING AP SQUAD MATCH DATA...</span>
        </div>
      </motion.div>

      {/* Sleek Progress Bar */}
      <div className="w-48 sm:w-64 h-1.5 bg-black/60 rounded-full overflow-hidden mt-6 border border-white/10 p-0.5">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full h-full bg-gradient-to-r from-[#ff4655] via-cyan-400 to-[#ff4655] rounded-full"
        />
      </div>

    </div>
  );
}
