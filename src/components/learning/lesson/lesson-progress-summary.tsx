import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/camba/progress-ring";
import { MasteryMeter } from "@/components/camba/cambridge/shield-progress";
import type { LessonPageProgress } from "@/lib/learning/lesson-page-types";

interface LessonProgressSummaryProps {
  progress: LessonPageProgress;
  completedCount: number;
  totalCount: number;
  labels: {
    completionSummary: string;
    accuracy: string;
    mastery: string;
    completedExercises: string;
  };
  className?: string;
}

export function LessonProgressSummary({
  progress,
  completedCount,
  totalCount,
  labels,
  className,
}: LessonProgressSummaryProps) {
  const showAccuracy = progress.accuracyPercent > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white/80 px-4 py-4 sm:px-5 sm:py-5",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <ProgressRing
            value={progress.completionPercent}
            size={56}
            strokeWidth={5}
            label={`${progress.completionPercent}%`}
          />
          <div>
            <p className="camba-caption text-muted">{labels.completionSummary}</p>
            <p className="camba-stat text-xl text-program">{progress.completionPercent}%</p>
          </div>
        </div>

        <div className="h-10 w-px bg-border hidden sm:block" aria-hidden />

        <div className="flex flex-wrap gap-5 sm:gap-6">
          <div>
            <p className="camba-caption text-muted">{labels.completedExercises}</p>
            <p className="camba-h3 text-foreground">
              {completedCount}/{totalCount}
            </p>
          </div>
          {showAccuracy && (
            <div>
              <p className="camba-caption text-muted">{labels.accuracy}</p>
              <p className="camba-h3 text-foreground">{progress.accuracyPercent}%</p>
            </div>
          )}
        </div>
      </div>

      <MasteryMeter
        className="mt-4"
        level={progress.masteryLevel}
        label={labels.mastery}
      />
    </div>
  );
}
