import { cn } from "@/lib/utils";
import type { LessonCompleteSummaryLabels } from "@/lib/learning/lesson-page-types";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

interface LessonFinalExerciseResultFrameProps {
  exerciseTitle: string;
  accuracyPercent?: number | null;
  showReviewTag?: boolean;
  labels: Pick<
    LessonCompleteSummaryLabels,
    | "finalExerciseHeading"
    | "finalExerciseSubtitle"
    | "finalExerciseReviewTag"
    | "lessonLevelScoreNote"
    | "finalExerciseDetailsLabel"
    | "backToCompleteSummary"
  >;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export function LessonFinalExerciseResultFrame({
  exerciseTitle,
  accuracyPercent,
  showReviewTag,
  labels,
  onClose,
  children,
  className,
}: LessonFinalExerciseResultFrameProps) {
  const subtitle = labels.finalExerciseSubtitle(exerciseTitle);

  return (
    <section
      aria-labelledby="lesson-final-exercise-result-heading"
      className={cn("pt-5 mt-3 border-t border-dashed border-border/70", className)}
    >
      {onClose && (
        <div className="mb-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 px-2.5 text-muted font-semibold -ml-1"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            {labels.backToCompleteSummary}
          </Button>
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-muted/25 px-3 py-2 sm:px-3.5 mb-2.5">
        <div className="flex items-center gap-2 text-muted">
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
          <p className="camba-caption font-medium text-[11px] sm:text-xs">
            {labels.finalExerciseDetailsLabel}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-muted/10 px-3 py-2.5 sm:px-3.5 space-y-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3
              id="lesson-final-exercise-result-heading"
              className="camba-caption font-semibold text-muted uppercase tracking-wide text-[11px]"
            >
              {labels.finalExerciseHeading}
            </h3>
            <p className="camba-caption text-muted mt-0.5 text-xs">{subtitle}</p>
            <p className="camba-caption text-muted/70 mt-1 text-[10px] leading-snug">
              {labels.lessonLevelScoreNote}
            </p>
          </div>
          {showReviewTag && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--status-needs-review)] shrink-0">
              <AlertCircle className="h-3 w-3" />
              {labels.finalExerciseReviewTag}
            </span>
          )}
          {!showReviewTag && accuracyPercent != null && accuracyPercent > 0 && (
            <span className="camba-caption text-muted/80 shrink-0 tabular-nums text-xs">
              {accuracyPercent}%
            </span>
          )}
        </div>
      </div>

      <div className="mt-2 rounded-lg border border-border/30 bg-muted/10 p-1.5 sm:p-2 [&_.shadow-md]:shadow-none [&_[data-slot=card]]:border-0 [&_[data-slot=card]]:shadow-none [&_[data-slot=card]]:bg-transparent">
        {children}
      </div>
    </section>
  );
}
