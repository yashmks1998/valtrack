/**
 * ValorantImage - Resilient image with auto-retry on CDN flakiness.
 *
 * Keeps it simple: just an <img> with onError retry logic.
 * No skeleton/absolute positioning that breaks CSS layout.
 *
 * On first error  → retries once after 1s with a cache-bust param.
 * On second error → renders an SVG placeholder instead.
 */
import React, { useState, useEffect, useRef } from 'react';

function AgentPlaceholder({ className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RankPlaceholder({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon
        points="20,4 25,15 37,15 28,23 31,35 20,28 9,35 12,23 3,15 15,15"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}

function Placeholder({ type, className }) {
  const base = 'text-white/25 w-full h-full p-1.5';
  if (type === 'rank') return <RankPlaceholder className={`${base} ${className || ''}`} />;
  return <AgentPlaceholder className={`${base} ${className || ''}`} />;
}

export default function ValorantImage({
  src,
  alt = '',
  className = '',   // applied directly to <img> or placeholder wrapper
  type = 'agent',   // 'agent' | 'rank' | 'card' | 'map'
  style,
  loading = 'lazy',
  fallbackSrc,      // optional secondary URL to try before placeholder
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(src || '');
  const [failed, setFailed] = useState(false);
  const retryCount = useRef(0);
  const triedFallback = useRef(false);

  // Reset when the src prop changes (e.g. different player selected)
  useEffect(() => {
    setCurrentSrc(src || '');
    setFailed(false);
    retryCount.current = 0;
    triedFallback.current = false;
  }, [src]);

  const handleError = () => {
    // Step 1: try the fallbackSrc if provided
    if (fallbackSrc && !triedFallback.current) {
      triedFallback.current = true;
      setCurrentSrc(fallbackSrc);
      return;
    }

    // Step 2: retry original with cache-bust once
    if (retryCount.current < 1 && src) {
      retryCount.current++;
      const bust = src.includes('?') ? `&_r=${Date.now()}` : `?_r=${Date.now()}`;
      setTimeout(() => {
        triedFallback.current = true; // don't loop through fallback again
        setCurrentSrc(src + bust);
      }, 1000);
      return;
    }

    // Step 3: give up, show placeholder
    setFailed(true);
  };

  // Show placeholder if no src or all retries exhausted
  if (!src || failed) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        style={style}
        aria-label={alt}
      >
        <Placeholder type={type} />
      </span>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={`object-contain ${className}`}
      style={style}
      {...rest}
    />
  );
}
