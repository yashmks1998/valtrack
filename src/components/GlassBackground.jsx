import React from 'react';
import { motion } from 'framer-motion';

export default function GlassBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#0a0b0f]">
      {/* Blob 1: Valorant Red/Pink (Top Left) */}
      <motion.div
        animate={{
          x: ['0%', '12%', '-8%', '0%'],
          y: ['0%', '-10%', '8%', '0%'],
          rotate: [0, 120, 240, 360],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 70,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full bg-gradient-to-br from-[#ff4655]/25 via-pink-600/20 to-transparent blur-[90px]"
      />

      {/* Blob 2: Cyan/Indigo (Top Right) */}
      <motion.div
        animate={{
          x: ['0%', '-15%', '10%', '0%'],
          y: ['0%', '12%', '-10%', '0%'],
          rotate: [360, 240, 120, 0],
          scale: [1, 1.1, 0.85, 1],
        }}
        transition={{
          duration: 80,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -right-32 w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-tl from-[#00f0ff]/20 via-indigo-600/15 to-transparent blur-[100px]"
      />

      {/* Blob 3: Deep Magenta/Purple (Bottom Left) */}
      <motion.div
        animate={{
          x: ['0%', '10%', '-12%', '0%'],
          y: ['0%', '15%', '-8%', '0%'],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 85,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-1/4 w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-purple-700/20 via-fuchsia-600/15 to-transparent blur-[110px]"
      />

      {/* Blob 4: Soft Emerald Accent (Center Right) */}
      <motion.div
        animate={{
          x: ['0%', '-10%', '10%', '0%'],
          y: ['0%', '-12%', '10%', '0%'],
          scale: [0.9, 1.1, 0.95, 0.9],
        }}
        transition={{
          duration: 90,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/3 right-1/3 w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-600/10 to-transparent blur-[120px]"
      />

      {/* Subdued Noise Texture Overlay */}
      <div className="absolute inset-0 bg-repeat opacity-[0.025] mix-blend-overlay pointer-events-none" />
    </div>
  );
}
