import React from 'react';
import { motion } from 'framer-motion';

export default function GlassBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#0a0b0f]">
      
      {/* SVG Edge Refraction Distortion Filter Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0, opacity: 0 }} aria-hidden="true">
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Blob 1: Valorant Red Accent */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 65,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -top-24 -left-24 w-[38rem] h-[38rem] rounded-full bg-[#ff4655]/25 filter blur-[100px]"
      />

      {/* Blob 2: Vibrant Cyan Glow */}
      <motion.div
        animate={{
          x: [0, -90, 60, 0],
          y: [0, 80, -50, 0],
          scale: [1, 1.15, 1.3, 1],
        }}
        transition={{
          duration: 75,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-24 w-[42rem] h-[42rem] rounded-full bg-cyan-500/20 filter blur-[120px]"
      />

      {/* Blob 3: Deep Purple / Radiant Pink */}
      <motion.div
        animate={{
          x: [0, 70, -70, 0],
          y: [0, 90, -80, 0],
          scale: [1.1, 0.85, 1.2, 1.1],
        }}
        transition={{
          duration: 85,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 left-1/4 w-[45rem] h-[45rem] rounded-full bg-purple-600/20 filter blur-[130px]"
      />

      {/* Blob 4: Golden Amber Accent */}
      <motion.div
        animate={{
          x: [0, -50, 50, 0],
          y: [0, -40, 60, 0],
          scale: [0.9, 1.2, 0.95, 0.9],
        }}
        transition={{
          duration: 70,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        className="absolute top-2/3 left-10 w-[30rem] h-[30rem] rounded-full bg-amber-500/15 filter blur-[90px]"
      />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0a0b0f]/50 to-[#0a0b0f] opacity-80" />
    </div>
  );
}
