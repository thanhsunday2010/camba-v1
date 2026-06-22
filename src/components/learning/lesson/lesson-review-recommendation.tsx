"use client";

import { Button } from "@/components/ui/button";
import { EXERCISE_REVIEW_ACCURACY_THRESHOLD } from "@/lib/learning/lesson-ui-utils";
import type {
  LessonCompleteSummaryLabels,
  LessonExerciseSummary,
} from "@/lib/learning/lesson-page-types";
import { RefreshCw } from "lucide-react";

interface LessonReviewRecommendationProps {
  exercises: LessonExerciseSummary[];
  sessionAccuracyByExerciseId?: ReadonlyMap<string, number>;
  labels: Pick<
    LessonCompleteSummaryLabels,
    | "reviewSectionTitle"
    | "reviewSectionSubtitle"
    | "reviewExerciseAction"
    | "reviewReasonLowScore"
  >;
  onOpenExercise: (exerciseId: string) => void;
}

export function LessonReviewRecommendation({
  exercises,
  sessionAccuracyByExerciseId,
  labels,
  onOpenExercise,
}: LessonReviewRecommendationProps) {
  if (exercises.length === 0) return null;

  const sorted = [...exercises].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      aria-labelledby="lesson-review-recommendation-heading"
      className="rounded-2xl border border-orange-200/40 bg-orange-50/25 px-4 py-3 sm:px-5 sm:py-4"
    >
      <div className="space-y-3">
        <div>
          <h3 id="lesson-review-recommendation-heading" className="camba-h3 text-foreground text-base">
            {labels.reviewSectionTitle}
          </h3>
          <p className="camba-caption text-muted mt-0.5">{labels.reviewSectionSubtitle}</p>
        </div>
        <ul className="space-y-2" role="list">
          {sorted.map((exercise) => {
            const sessionAcc = sessionAccuracyByExerciseId?.get(exercise.id);
            const acc =
              sessionAcc ?? exercise.latestAttempt?.accuracyPercent ?? null;
            const showLowScore =
              acc != null && acc > 0 && acc < EXERCISE_REVIEW_ACCURACY_THRESHOLD;

            return (
              <li
                key={exercise.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-white/90 border border-border/60 px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="camba-body font-medium text-foreground truncate">
                      {exercise.title}
                    </p>
                    {showLowScore && (
                      <span className="inline-flex rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--status-needs-review)]">
                        {labels.reviewReasonLowScore}
                      </span>
                    )}
                  </div>
                  {acc != null && acc > 0 && (
                    <p className="camba-caption text-muted mt-0.5 tabular-nums">
                      {Math.round(acc)}%
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-1.5 shrink-0 w-full sm:w-auto"
                  onClick={() => onOpenExercise(exercise.id)}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  {labels.reviewExerciseAction}
                </Button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
