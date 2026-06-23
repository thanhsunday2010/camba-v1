import type { SkillPerformanceBand } from "@/lib/mock-tests/mock-test-analytics-types";
import { skillPerformanceBandBarClass } from "@/lib/mock-tests/skill-performance-band";

interface SkillBreakdownBarProps {
  label: string;
  percent: number;
  percentLabel: string;
  band: SkillPerformanceBand;
}

export function SkillBreakdownBar({
  label,
  percent,
  percentLabel,
  band,
}: SkillBreakdownBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="camba-caption font-medium text-foreground">{label}</span>
        <span className="camba-caption text-muted tabular-nums">{percentLabel}</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--surface-sunken)] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${skillPerformanceBandBarClass(band)}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label} ${percentLabel}`}
        />
      </div>
    </div>
  );
}
