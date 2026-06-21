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
}

export function LearningPathProgressSummary({
  levelProgressPercent,
  unitCount,
  unitsWithContent,
  lessonCount,
  labels,
  className,
}: LearningPathProgressSummaryProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 sm:gap-6 rounded-2xl border border-border bg-white/70 px-4 py-3 sm:px-5",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <ProgressRing value={levelProgressPercent} size={52} strokeWidth={5} />
        <div>
          <p className="camba-caption text-muted">{labels.levelProgress}</p>
          <p className="camba-stat text-xl text-program">{levelProgressPercent}%</p>
        </div>
      </div>
      <div className="h-10 w-px bg-border hidden sm:block" aria-hidden />
      <div className="flex gap-6">
        <div>
          <p className="camba-caption text-muted">{labels.units}</p>
          <p className="camba-h3 text-foreground">
            {unitsWithContent}/{unitCount}
          </p>
        </div>
        <div>
          <p className="camba-caption text-muted">{labels.lessons}</p>
          <p className="camba-h3 text-foreground">{lessonCount}</p>
        </div>
      </div>
    </div>
  );
}
