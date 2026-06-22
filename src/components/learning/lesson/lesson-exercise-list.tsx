"use client";

import { SectionHeader } from "@/components/camba";
import { Button } from "@/components/ui/button";
import type {
  LessonExerciseListLabels,
  LessonExerciseSummary,
} from "@/lib/learning/lesson-page-types";
import { LessonExerciseCard } from "@/components/learning/lesson/lesson-exercise-card";
import { ArrowLeft, ListChecks } from "lucide-react";

interface LessonExerciseListProps {
  summaries: LessonExerciseSummary[];
  sessionCompletedIds: Set<string>;
  sessionAccuracyByExerciseId?: ReadonlyMap<string, number>;
  nextSuggestedExerciseId?: string | null;
  isReviewMode?: boolean;
  onExitReviewMode?: () => void;
  exitReviewLabel?: string;
  labels: LessonExerciseListLabels & {
    exercisesTitle: string;
    exercisesSubtitle: string;
    nextSuggested: string;
  };
  onSelectExercise: (exerciseId: string) => void;
}

export function LessonExerciseList({
  summaries,
  sessionCompletedIds,
  sessionAccuracyByExerciseId,
  nextSuggestedExerciseId,
  isReviewMode,
  onExitReviewMode,
  exitReviewLabel,
  labels,
  onSelectExercise,
}: LessonExerciseListProps) {
  const sorted = [...summaries].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section aria-labelledby="lesson-exercises-heading">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <SectionHeader
          titleId="lesson-exercises-heading"
          title={labels.exercisesTitle}
          description={labels.exercisesSubtitle}
          icon={ListChecks}
          className="flex-1 min-w-0"
        />
        {isReviewMode && onExitReviewMode && exitReviewLabel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 shrink-0 text-program font-semibold self-start"
            onClick={onExitReviewMode}
          >
            <ArrowLeft className="h-4 w-4" />
            {exitReviewLabel}
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {sorted.map((summary) => (
          <LessonExerciseCard
            key={summary.id}
            summary={summary}
            sessionCompletedIds={sessionCompletedIds}
            sessionAccuracyByExerciseId={sessionAccuracyByExerciseId}
            isSuggested={summary.id === nextSuggestedExerciseId}
            suggestedLabel={labels.nextSuggested}
            labels={labels}
            onSelect={() => onSelectExercise(summary.id)}
          />
        ))}
      </div>
    </section>
  );
}
