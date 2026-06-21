"use client";

import { SectionHeader } from "@/components/camba";
import type {
  LessonExerciseListLabels,
  LessonExerciseSummary,
} from "@/lib/learning/lesson-page-types";
import { LessonExerciseCard } from "@/components/learning/lesson/lesson-exercise-card";
import { ListChecks } from "lucide-react";

interface LessonExerciseListProps {
  summaries: LessonExerciseSummary[];
  sessionCompletedIds: Set<string>;
  nextSuggestedExerciseId?: string | null;
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
  nextSuggestedExerciseId,
  labels,
  onSelectExercise,
}: LessonExerciseListProps) {
  const sorted = [...summaries].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section aria-labelledby="lesson-exercises-heading">
      <SectionHeader
        titleId="lesson-exercises-heading"
        title={labels.exercisesTitle}
        description={labels.exercisesSubtitle}
        icon={ListChecks}
      />
      <div className="space-y-3">
        {sorted.map((summary) => (
          <LessonExerciseCard
            key={summary.id}
            summary={summary}
            sessionCompletedIds={sessionCompletedIds}
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
