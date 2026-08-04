import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const SPRINGS = {
  standard: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 },
  card: { type: 'spring', stiffness: 300, damping: 28, mass: 1 },
  sheet: { type: 'spring', stiffness: 260, damping: 26, mass: 1 },
};

/**
 * Super-Realistic 3-Layer Liquid Glass Component
 * - Layer A (bottom): Frosted backdrop-filter blur & saturation
 * - Layer B (middle): Inset SVG displacement filter edge refraction
 * - Layer C (top): Sharp foreground content layer with pointer-tracking specular highlight
 */
export default function GlassSurface({
  children,
  level = '1',
  interactive = false,
  hoverable = false,
  className = '',
  onClick,
  useDistortion = false,
  ...props
}) {
  const cardRef = useRef(null);
  const [isTapped, setIsTapped] = useState(false);

  // Level-dependent glass intensity recipes
  const levelStyles = {
    '1': 'bg-white/[0.07] backdrop-blur-2xl border-white/15 shadow-xl',
    '2': 'bg-white/[0.11] backdrop-blur-3xl border-white/25 shadow-2xl',
    '3': 'bg-white/[0.16] backdrop-blur-3xl border-white/35 shadow-2xl',
  };

  // Pointer-follow specular light reflection tracking (desktop)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--glow-x', `${x.toFixed(1)}%`);
    cardRef.current.style.setProperty('--glow-y', `${y.toFixed(1)}%`);
  };

  // Mobile tap light-sweep trigger
  const handleTap = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 750);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={(e) => {
        handleTap();
        if (onClick) onClick(e);
      }}
      whileHover={
        interactive || hoverable
          ? { scale: 1.02, y: -3, transition: SPRINGS.standard }
          : undefined
      }
      whileTap={
        interactive || onClick
          ? { scale: 0.96, transition: { duration: 0.1 } }
          : undefined
      }
      className={`relative overflow-hidden rounded-[28px] glass-specular-glow glass-chromatic-border transition-all duration-300 ${levelStyles[level]} ${className}`}
      {...props}
    >
      {/* LAYER A (Bottom): Blur & saturation glass base */}
      <div className="absolute inset-0 z-0 rounded-[28px] pointer-events-none" />

      {/* LAYER B (Middle): Inset SVG Displacement Filter Edge Refraction */}
      {useDistortion && (
        <div
          className="absolute inset-[3px] z-[1] rounded-[26px] pointer-events-none opacity-40 glass-edge-refraction"
          aria-hidden="true"
        />
      )}

      {/* Mobile Diagonal Light-Sweep Animation Effect */}
      {isTapped && (
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden rounded-[28px]">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-light-sweep" />
        </div>
      )}

      {/* LAYER C (Top): Sharp foreground content sitting on top of glass */}
      <div className="relative z-[3] w-full h-full text-glass-shadow">
        {children}
      </div>
    </motion.div>
  );
}
