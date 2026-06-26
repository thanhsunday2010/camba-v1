import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/camba/progress-ring";

interface LearningPathProgressSummaryProps {
  levelProgressPercent: number;
  unitCount: number;
  unitsWithContent: number;
  lessonCount: number;
  labels: {
    levelProgress: string;
    units: string;
    lessons: string;
  };
  className?: string;
  compact?: boolean;
}

export function LearningPathProgressSummary({
  levelProgressPercent,
  unitCount,
  unitsWithContent,
  lessonCount,
  labels,
  className,
  compact = false,
}: LearningPathProgressSummaryProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 sm:gap-4 rounded-xl border border-border bg-white/70",
        compact ? "px-3 py-2" : "rounded-2xl px-4 py-3 sm:px-5 gap-4 sm:gap-6",
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <ProgressRing
          value={levelProgressPercent}
          size={compact ? 44 : 52}
          strokeWidth={compact ? 4 : 5}
        />
        <div>
          <p className="camba-caption text-muted">{labels.levelProgress}</p>
          <p className={cn("camba-stat text-program", compact ? "text-lg" : "text-xl")}>
            {levelProgressPercent}%
          </p>
        </div>
      </div>
      <div className="h-8 w-px bg-border hidden sm:block" aria-hidden />
      <div className="flex gap-4 sm:gap-6">
        <div>
          <p className="camba-caption text-muted">{labels.units}</p>
          <p className={cn("text-foreground font-semibold", compact ? "camba-body" : "camba-h3")}>
            {unitsWithContent}/{unitCount}
          </p>
        </div>
        <div>
          <p className="camba-caption text-muted">{labels.lessons}</p>
          <p className={cn("text-foreground font-semibold", compact ? "camba-body" : "camba-h3")}>
            {lessonCount}
          </p>
        </div>
      </div>
    </div>
  );
}
