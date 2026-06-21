"use client";

import { useCallback, useMemo, useState } from "react";
import { deriveResolvedLessonProgress } from "@/lib/learning/lesson-ui-utils";
import type {
  LessonExerciseListLabels,
  LessonPageLabels,
  LessonPageViewModel,
} from "@/lib/learning/lesson-page-types";
import { LessonPageShell } from "@/components/learning/lesson/lesson-page-shell";
import { LessonPlayer } from "@/components/learning/lesson-player";

interface LessonPageContentProps {
  viewModel: LessonPageViewModel;
  labels: LessonPageLabels;
  masteryLabel: string;
  listLabels: LessonExerciseListLabels & {
    exercisesTitle: string;
    exercisesSubtitle: string;
    nextSuggested: string;
    backToList: string;
    remainingExercises?: string;
  };
}

export function LessonPageContent({
  viewModel,
  labels,
  masteryLabel,
  listLabels,
}: LessonPageContentProps) {
  const [sessionCompletedExerciseIds, setSessionCompletedExerciseIds] = useState(
    () => new Set(viewModel.completedExerciseIds)
  );

  const resolvedProgress = useMemo(
    () =>
      deriveResolvedLessonProgress(
        viewModel.exerciseSummaries,
        sessionCompletedExerciseIds,
        viewModel.progress.completionPercent
      ),
    [
      viewModel.exerciseSummaries,
      viewModel.progress.completionPercent,
      sessionCompletedExerciseIds,
    ]
  );

  const onExerciseCompleted = useCallback((exerciseId: string) => {
    setSessionCompletedExerciseIds((prev) => new Set([...prev, exerciseId]));
  }, []);

  return (
    <LessonPageShell
      viewModel={viewModel}
      labels={labels}
      masteryLabel={masteryLabel}
      resolvedProgress={resolvedProgress}
      remainingExercisesLabel={listLabels.remainingExercises}
    >
      <LessonPlayer
        lessonId={viewModel.lesson.id}
        exercises={viewModel.exercises}
        exerciseSummaries={viewModel.exerciseSummaries}
        sessionCompletedExerciseIds={sessionCompletedExerciseIds}
        onExerciseCompleted={onExerciseCompleted}
        resolvedProgress={resolvedProgress}
        listLabels={listLabels}
      />
    </LessonPageShell>
  );
}
