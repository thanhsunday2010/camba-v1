"use client";

import { SPEAKING_DIMENSION_LABELS, SPEAKING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import type { SpeakingDimensionScore } from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
import { cn } from "@/lib/utils";

type SpeakingDimensionBreakdownProps = {
  dimensions: SpeakingDimensionScore[];
  className?: string;
};

export function SpeakingDimensionBreakdown({
  dimensions,
  className,
}: SpeakingDimensionBreakdownProps) {
  const ordered = SPEAKING_DIMENSION_ORDER.map(
    (key) => dimensions.find((d) => d.dimension === key)!
  ).filter(Boolean);

  return (
    <div className={cn("space-y-3", className)}>
      <p className="camba-caption font-medium text-muted">Dimension breakdown</p>
      <div className="space-y-2">
        {ordered.map((dim) => (
          <div key={dim.dimension} className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="camba-caption text-foreground/80">
                {SPEAKING_DIMENSION_LABELS[dim.dimension]}
              </span>
              <span className="camba-caption font-medium text-program">{dim.score}/100</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
              <div
                className="h-full rounded-full bg-program/70 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
              />
            </div>
            <p className="camba-caption text-muted">{dim.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
