import React from "react";

export default function SkeletonRow() {
  return (
    <div className="py-6 space-y-4 px-4 md:px-12 select-none animate-pulse">
      {/* Category Title Skeleton */}
      <div className="h-6 w-48 bg-neutral-800 rounded-md" />

      {/* Row Rail of Cards */}
      <div className="flex gap-4 overflow-hidden py-2 no-scrollbar">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-none w-[160px] sm:w-[200px] md:w-[240px] aspect-[2/3] bg-neutral-900 rounded-lg overflow-hidden flex flex-col justify-end p-4 space-y-3 relative"
          >
            {/* Shimmer Light Reflection Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

            {/* Content lines inside skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-neutral-800 rounded" />
              <div className="h-3 w-1/2 bg-neutral-800 rounded" />
            </div>

            {/* Little metadata block skeleton */}
            <div className="flex gap-2 pt-1 border-t border-neutral-800">
              <div className="h-3 w-8 bg-neutral-800 rounded" />
              <div className="h-3 w-12 bg-neutral-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
