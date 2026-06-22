"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveResolvedLessonProgress } from "@/lib/learning/lesson-ui-utils";
import { useCelebrationOptional } from "@/components/camba/celebration/celebration-provider";
import type {
  AiExerciseLabels,
  LessonChromeLabels,
  LessonCompleteSummaryLabels,
  LessonExerciseCompletionMeta,
  LessonExerciseListLabels,
  LessonPageLabels,
  LessonPageViewModel,
} from "@/lib/learning/lesson-page-types";
import { LessonPageShell } from "@/components/learning/lesson/lesson-page-shell";
import { LessonPlayer } from "@/components/learning/lesson-player";

interface LessonPageContentProps {
  viewModel: LessonPageViewModel;
  labels: LessonPageLabels;
  completeSummaryLabels: LessonCompleteSummaryLabels;
  masteryLabel: string;
  listLabels: LessonExerciseListLabels & {
    exercisesTitle: string;
    exercisesSubtitle: string;
    exercisesProgress: string;
    nextSuggested: string;
    backToList: string;
    remainingExercises?: string;
    reviewExercisesSubtitle?: string;
    backToComplete?: string;
  };
  aiLabels: AiExerciseLabels;
  chromeLabels: LessonChromeLabels;
}

export function LessonPageContent({
  viewModel,
  labels,
  completeSummaryLabels,
  masteryLabel,
  listLabels,
  aiLabels,
  chromeLabels,
}: LessonPageContentProps) {
  const [sessionCompletedExerciseIds, setSessionCompletedExerciseIds] = useState(
    () => new Set(viewModel.completedExerciseIds)
  );
  const [sessionAccuracyByExerciseId, setSessionAccuracyByExerciseId] = useState(
    () => new Map<string, number>()
  );
  const [lastCompletedMeta, setLastCompletedMeta] =
    useState<LessonExerciseCompletionMeta | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [isReviewingLesson, setIsReviewingLesson] = useState(false);
  const celebrate = useCelebrationOptional();
  const wasCompleteRef = useRef(false);
  const prevLessonCompleteRef = useRef(false);

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

  useEffect(() => {
    const justCompleted =
      resolvedProgress.isLessonCompleteResolved && !prevLessonCompleteRef.current;
    if (justCompleted) {
      setIsReviewingLesson(false);
    }
    prevLessonCompleteRef.current = resolvedProgress.isLessonCompleteResolved;
  }, [resolvedProgress.isLessonCompleteResolved]);

  const enterReviewMode = useCallback(() => {
    setIsReviewingLesson(true);
    setActiveExerciseId(null);
  }, []);

  const exitReviewMode = useCallback(() => {
    setIsReviewingLesson(false);
    setActiveExerciseId(null);
  }, []);

  const onExerciseCompleted = useCallback(
    (exerciseId: string, meta?: LessonExerciseCompletionMeta) => {
      setSessionCompletedExerciseIds((prev) => new Set([...prev, exerciseId]));
      if (meta?.accuracyPercent != null) {
        setSessionAccuracyByExerciseId((prev) => {
          const next = new Map(prev);
          next.set(exerciseId, meta.accuracyPercent!);
          return next;
        });
      }
      setLastCompletedMeta({
        exerciseId,
        accuracyPercent: meta?.accuracyPercent,
      });
    },
    []
  );

  const onPrimaryHeroAction = useCallback(() => {
    if (resolvedProgress.isLessonCompleteResolved) {
      enterReviewMode();
      return;
    }

    const targetId =
      resolvedProgress.nextSuggestedExerciseId ??
      resolvedProgress.nextIncompleteExerciseId;
    if (targetId) {
      setActiveExerciseId(targetId);
    } else {
      enterReviewMode();
    }
  }, [
    enterReviewMode,
    resolvedProgress.isLessonCompleteResolved,
    resolvedProgress.nextSuggestedExerciseId,
    resolvedProgress.nextIncompleteExerciseId,
  ]);

  const onOpenReviewExercise = useCallback((exerciseId: string) => {
    setActiveExerciseId(exerciseId);
  }, []);

  const closeFramedExercise = useCallback(() => {
    setActiveExerciseId(null);
  }, []);

  const listSubtitle = isReviewingLesson && listLabels.reviewExercisesSubtitle
    ? listLabels.reviewExercisesSubtitle
    : listLabels.exercisesProgress
        .replace("{completed}", String(resolvedProgress.completedCount))
        .replace("{total}", String(resolvedProgress.totalExercises));

  return (
    <LessonPageShell
      viewModel={viewModel}
      labels={labels}
      completeSummaryLabels={completeSummaryLabels}
      masteryLabel={masteryLabel}
      resolvedProgress={resolvedProgress}
      sessionCompletedExerciseIds={sessionCompletedExerciseIds}
      sessionAccuracyByExerciseId={sessionAccuracyByExerciseId}
      lastCompletedMeta={lastCompletedMeta}
      remainingExercisesLabel={listLabels.remainingExercises}
      activeExerciseId={activeExerciseId}
      isReviewingLesson={isReviewingLesson}
      onPrimaryHeroAction={onPrimaryHeroAction}
      onReviewLesson={enterReviewMode}
      onOpenReviewExercise={onOpenReviewExercise}
    >
      <LessonPlayer
        lessonId={viewModel.lesson.id}
        lessonTitle={viewModel.lesson.title}
        exercises={viewModel.exercises}
        exerciseSummaries={viewModel.exerciseSummaries}
        sessionCompletedExerciseIds={sessionCompletedExerciseIds}
        sessionAccuracyByExerciseId={sessionAccuracyByExerciseId}
        onExerciseCompleted={onExerciseCompleted}
        resolvedProgress={resolvedProgress}
        activeExerciseId={activeExerciseId}
        isReviewingLesson={isReviewingLesson}
        onActiveExerciseChange={setActiveExerciseId}
        onCloseFramedExercise={closeFramedExercise}
        onExitReviewMode={exitReviewMode}
        completeSummaryLabels={completeSummaryLabels}
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
