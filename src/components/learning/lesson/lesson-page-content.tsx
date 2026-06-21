"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveResolvedLessonProgress } from "@/lib/learning/lesson-ui-utils";
import { useCelebrationOptional } from "@/components/camba/celebration/celebration-provider";
import type {
  AiExerciseLabels,
  LessonChromeLabels,
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
    exercisesProgress: string;
    nextSuggested: string;
    backToList: string;
    remainingExercises?: string;
  };
  aiLabels: AiExerciseLabels;
  chromeLabels: LessonChromeLabels;
}

export function LessonPageContent({
  viewModel,
  labels,
  masteryLabel,
  listLabels,
  aiLabels,
  chromeLabels,
}: LessonPageContentProps) {
  const [sessionCompletedExerciseIds, setSessionCompletedExerciseIds] = useState(
    () => new Set(viewModel.completedExerciseIds)
  );
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const celebrate = useCelebrationOptional();
  const wasCompleteRef = useRef(false);

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

  useEffect(() => {
    if (resolvedProgress.isLessonCompleteResolved && !wasCompleteRef.current) {
      celebrate?.celebrateMission();
    }
    wasCompleteRef.current = resolvedProgress.isLessonCompleteResolved;
  }, [resolvedProgress.isLessonCompleteResolved, celebrate]);

  const onExerciseCompleted = useCallback((exerciseId: string) => {
    setSessionCompletedExerciseIds((prev) => new Set([...prev, exerciseId]));
  }, []);

  const onPrimaryHeroAction = useCallback(() => {
    const targetId =
      resolvedProgress.nextSuggestedExerciseId ??
      resolvedProgress.nextIncompleteExerciseId;
    if (targetId) {
      setActiveExerciseId(targetId);
    } else {
      setActiveExerciseId(null);
    }
  }, [resolvedProgress.nextSuggestedExerciseId, resolvedProgress.nextIncompleteExerciseId]);

  const onReviewLesson = useCallback(() => {
    setActiveExerciseId(null);
  }, []);

  const listSubtitle = listLabels.exercisesProgress
    .replace("{completed}", String(resolvedProgress.completedCount))
    .replace("{total}", String(resolvedProgress.totalExercises));

  return (
    <LessonPageShell
      viewModel={viewModel}
      labels={labels}
      masteryLabel={masteryLabel}
      resolvedProgress={resolvedProgress}
      remainingExercisesLabel={listLabels.remainingExercises}
      activeExerciseId={activeExerciseId}
      onPrimaryHeroAction={onPrimaryHeroAction}
      onReviewLesson={onReviewLesson}
    >
      <LessonPlayer
        lessonId={viewModel.lesson.id}
        lessonTitle={viewModel.lesson.title}
        exercises={viewModel.exercises}
        exerciseSummaries={viewModel.exerciseSummaries}
        sessionCompletedExerciseIds={sessionCompletedExerciseIds}
        onExerciseCompleted={onExerciseCompleted}
        resolvedProgress={resolvedProgress}
        activeExerciseId={activeExerciseId}
        onActiveExerciseChange={setActiveExerciseId}
        aiLabels={aiLabels}
        chromeLabels={chromeLabels}
        listLabels={{
          ...listLabels,
          exercisesSubtitle: listSubtitle,
        }}
      />
    </LessonPageShell>
  );
}
