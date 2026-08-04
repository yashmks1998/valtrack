import React from 'react';
import { motion } from 'framer-motion';
import { SPRINGS } from './GlassSurface';

export default function GlassButton({
  children,
  variant = 'secondary', // 'primary' | 'secondary' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses =
    variant === 'primary'
      ? 'glass-primary-btn text-white font-oswald-header font-bold tracking-wider hover:bg-[#ff4655]/35 shadow-glow-red'
      : 'glass-layer-2 glass-specular text-white font-oswald-header font-bold tracking-wider hover:bg-white/20';

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs rounded-xl'
      : size === 'lg'
      ? 'px-6 py-3 text-base rounded-2xl'
      : 'px-4.5 py-2.5 text-sm rounded-2xl';

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={
        !disabled
          ? {
              scale: 1.02,
              y: -2,
              transition: SPRINGS.standard,
            }
          : undefined
      }
      whileTap={
        !disabled
          ? {
              scale: 0.96,
              transition: { duration: 0.1 },
            }
          : undefined
      }
      className={`inline-flex items-center justify-center gap-2 cursor-pointer transition-colors text-glass-shadow disabled:opacity-50 disabled:cursor-not-allowed ${baseClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
