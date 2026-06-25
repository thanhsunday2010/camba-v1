"use client";

import { cn } from "@/lib/utils";

interface SkeletonShimmerProps {
  className?: string;
}

/** Premium skeleton with subtle shimmer — respects reduced motion via CSS. */
export function SkeletonShimmer({ className }: SkeletonShimmerProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-surface-sunken camba-skeleton-shimmer",
        className
      )}
      aria-hidden
    />
  );
}
