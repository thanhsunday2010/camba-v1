"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { deriveResolvedLessonProgress } from "@/lib/learning/lesson-ui-utils";
import { useCelebrationOptional } from "@/components/camba/celebration/celebration-provider";
import { useMascotOptional } from "@/components/mascot/mascot-provider";
import type {
  AiExerciseLabels,
  LessonChromeLabels,
  LessonCompleteSummaryLabels,
  LessonExerciseCompletionMeta,
  LessonExerciseListLabels,
  LessonPageLabels,
  LessonPageViewModel,
} from "@/lib/learning/lesson-page-types";
import { useLessonI18nFormatters } from "@/lib/learning/use-lesson-i18n-formatters";
import { LessonPageShell } from "@/components/learning/lesson/lesson-page-shell";
import { LessonPlayer } from "@/components/learning/lesson-player";
import {
  VocabularyLessonDialog,
  type VocabularyLessonDialogLabels,
} from "@/components/learning/vocabulary/vocabulary-lesson-dialog";

interface LessonPageContentProps {
  viewModel: LessonPageViewModel;
  labels: LessonPageLabels;
  completeSummaryLabels: LessonCompleteSummaryLabels;
  masteryLabel: string;
  listLabels: LessonExerciseListLabels & {
    exercisesTitle: string;
    exercisesSubtitle: string;
    nextSuggested: string;
    backToList: string;
    reviewExercisesSubtitle?: string;
    backToComplete?: string;
  };
  aiLabels: AiExerciseLabels;
  chromeLabels: LessonChromeLabels;
  vocabularyLabels?: VocabularyLessonDialogLabels;
}

export function LessonPageContent({
  viewModel,
  labels,
  completeSummaryLabels,
  masteryLabel,
  listLabels,
  aiLabels,
  chromeLabels,
  vocabularyLabels,
}: LessonPageContentProps) {
  const fmt = useLessonI18nFormatters();
  const [vocabularyDialogOpen, setVocabularyDialogOpen] = useState(false);
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
  const mascot = useMascotOptional();
  const wasCompleteRef = useRef(false);
  const prevLessonCompleteRef = useRef(false);

  const hasVocabularyBank = viewModel.vocabularyBank.length > 0 && Boolean(vocabularyLabels);

  useEffect(() => {
    if (hasVocabularyBank) {
      setVocabularyDialogOpen(true);
    }
  }, [hasVocabularyBank, viewModel.lesson.id]);

  const openVocabularyBank = useCallback(() => {
    setVocabularyDialogOpen(true);
  }, []);

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
      mascot?.cheerLessonComplete();
    }
    wasCompleteRef.current = resolvedProgress.isLessonCompleteResolved;
  }, [resolvedProgress.isLessonCompleteResolved, celebrate, mascot]);

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

        if (meta.accuracyPercent >= 75) {
          mascot?.cheerHighScore(meta.accuracyPercent);
        } else {
          mascot?.cheerExerciseComplete();
        }
      }
      setLastCompletedMeta({
        exerciseId,
        accuracyPercent: meta?.accuracyPercent,
      });
    },
    [mascot]
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
    : fmt.exercisesProgress(
        resolvedProgress.completedCount,
        resolvedProgress.totalExercises
      );

  return (
    <>
      {hasVocabularyBank && vocabularyLabels && (
        <VocabularyLessonDialog
          open={vocabularyDialogOpen}
          onOpenChange={setVocabularyDialogOpen}
          words={viewModel.vocabularyBank}
          lessonTitle={viewModel.lesson.title}
          labels={vocabularyLabels}
        />
      )}

      <LessonPageShell
        viewModel={viewModel}
        labels={labels}
        completeSummaryLabels={completeSummaryLabels}
        masteryLabel={masteryLabel}
        resolvedProgress={resolvedProgress}
        sessionCompletedExerciseIds={sessionCompletedExerciseIds}
        sessionAccuracyByExerciseId={sessionAccuracyByExerciseId}
        lastCompletedMeta={lastCompletedMeta}
        activeExerciseId={activeExerciseId}
        isReviewingLesson={isReviewingLesson}
        onPrimaryHeroAction={onPrimaryHeroAction}
        onReviewLesson={enterReviewMode}
        onOpenReviewExercise={onOpenReviewExercise}
        onOpenVocabularyBank={hasVocabularyBank ? openVocabularyBank : undefined}
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
    </>
  );
}
