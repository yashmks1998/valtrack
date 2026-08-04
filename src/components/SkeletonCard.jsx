import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-tracker-card border border-tracker-border rounded-xl overflow-hidden shadow-lg animate-pulse flex flex-col justify-between">
      {/* Top Splash Block Skeleton */}
      <div className="h-36 sm:h-40 bg-tracker-bg/80 relative p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-7 w-28 bg-tracker-border/60 rounded-md" />
            <div className="h-3 w-20 bg-tracker-border/40 rounded" />
          </div>
          <div className="h-6 w-16 bg-tracker-border/60 rounded-full" />
        </div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="h-3 w-12 bg-tracker-border/40 rounded" />
            <div className="h-9 w-20 bg-tracker-border/60 rounded-md" />
          </div>
          <div className="h-8 w-24 bg-tracker-border/50 rounded-lg" />
        </div>
      </div>

      {/* Segmented Bar Skeleton */}
      <div className="px-3 pt-2 pb-1 bg-tracker-card flex items-center gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-1.5 flex-1 rounded-full bg-tracker-border/60" />
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="p-3 bg-tracker-card flex items-center justify-between border-t border-tracker-border/40">
        <div className="h-3 w-24 bg-tracker-border/40 rounded" />
        <div className="h-3 w-16 bg-tracker-border/40 rounded" />
      </div>
    </div>
  );
}
