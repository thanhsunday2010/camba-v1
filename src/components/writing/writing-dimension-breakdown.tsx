"use client";

import type { WritingDimensionScore } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { WRITING_DIMENSION_LABELS, WRITING_DIMENSION_ORDER } from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
import { cn } from "@/lib/utils";

type WritingDimensionBreakdownProps = {
  dimensions: WritingDimensionScore[];
  className?: string;
};

export function WritingDimensionBreakdown({
  dimensions,
  className,
}: WritingDimensionBreakdownProps) {
  const ordered = WRITING_DIMENSION_ORDER.map(
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
                {WRITING_DIMENSION_LABELS[dim.dimension]}
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
