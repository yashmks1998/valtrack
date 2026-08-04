import React from 'react';
import { motion } from 'framer-motion';

export const SPRINGS = {
  standard: { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 },
  card: { type: 'spring', stiffness: 300, damping: 28, mass: 1 },
  sheet: { type: 'spring', stiffness: 260, damping: 26, mass: 1 },
};

export default function GlassSurface({
  children,
  level = '1', // '1' | '2' | '3'
  interactive = false,
  hoverable = false,
  className = '',
  onClick,
  style = {},
  ...props
}) {
  const layerClass =
    level === '3'
      ? 'glass-layer-3 glass-specular'
      : level === '2'
      ? 'glass-layer-2 glass-specular'
      : 'glass-layer-1 glass-specular';

  const springConfig = level === '1' ? SPRINGS.card : SPRINGS.standard;

  return (
    <motion.div
      whileHover={
        hoverable || interactive
          ? {
              scale: 1.02,
              y: -3,
              transition: springConfig,
            }
          : undefined
      }
      whileTap={
        interactive
          ? {
              scale: 0.96,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      onClick={onClick}
      className={`${layerClass} text-glass-shadow ${className}`}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
}
