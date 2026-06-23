"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { LessonBreadcrumb } from "@/components/learning/lesson/lesson-breadcrumb";
import { LessonHero } from "@/components/learning/lesson/lesson-hero";
import { LessonProgressSummary } from "@/components/learning/lesson/lesson-progress-summary";
import { LessonCompleteSummaryCard } from "@/components/learning/lesson/lesson-complete-summary-card";
import { LessonReviewRecommendation } from "@/components/learning/lesson/lesson-review-recommendation";
import {
  getReviewableExerciseSummaries,
} from "@/lib/learning/lesson-ui-utils";
import type {
  LessonCompleteSummaryLabels,
  LessonExerciseCompletionMeta,
  LessonPageLabels,
  LessonPageViewModel,
  ResolvedLessonProgress,
} from "@/lib/learning/lesson-page-types";
import { useLessonI18nFormatters } from "@/lib/learning/use-lesson-i18n-formatters";

interface LessonPageShellProps {
  viewModel: LessonPageViewModel;
  labels: LessonPageLabels;
  completeSummaryLabels: LessonCompleteSummaryLabels;
  masteryLabel: string;
  resolvedProgress: ResolvedLessonProgress;
  sessionCompletedExerciseIds: Set<string>;
  sessionAccuracyByExerciseId: ReadonlyMap<string, number>;
  lastCompletedMeta: LessonExerciseCompletionMeta | null;
  activeExerciseId?: string | null;
  isReviewingLesson?: boolean;
  onPrimaryHeroAction?: () => void;
  onReviewLesson?: () => void;
  onOpenReviewExercise?: (exerciseId: string) => void;
  children: ReactNode;
  className?: string;
}

export function LessonPageShell({
  viewModel,
  labels,
  completeSummaryLabels,
  masteryLabel,
  resolvedProgress,
  sessionCompletedExerciseIds,
  sessionAccuracyByExerciseId,
  lastCompletedMeta,
  activeExerciseId,
  isReviewingLesson = false,
  onPrimaryHeroAction,
  onReviewLesson,
  onOpenReviewExercise,
  children,
  className,
}: LessonPageShellProps) {
  const fmt = useLessonI18nFormatters();
  const { lesson, context, progress, exerciseSummaries } = viewModel;
  const {
    completedCount,
    totalExercises,
    completionPercentResolved,
    isLessonCompleteResolved,
    remainingCount,
  } = resolvedProgress;

  const isActiveExercise = Boolean(activeExerciseId);
  const showCompleteLayer = isLessonCompleteResolved && !isReviewingLesson;

  const reviewableExercises = useMemo(
    () =>
      getReviewableExerciseSummaries(
        exerciseSummaries,
        sessionCompletedExerciseIds,
        sessionAccuracyByExerciseId
      ),
    [exerciseSummaries, sessionCompletedExerciseIds, sessionAccuracyByExerciseId]
  );

  const finalExerciseAccuracy = useMemo(() => {
    if (lastCompletedMeta?.accuracyPercent != null) {
      return lastCompletedMeta.accuracyPercent;
    }
    if (!activeExerciseId) return null;
    return sessionAccuracyByExerciseId.get(activeExerciseId) ?? null;
  }, [activeExerciseId, lastCompletedMeta, sessionAccuracyByExerciseId]);

  const remainingLabel =
    remainingCount > 0 && !isLessonCompleteResolved
      ? fmt.remainingExercises(remainingCount)
      : undefined;

  return (
    <div className={cn("camba-section-stack", className)}>
      <LessonBreadcrumb
        context={context}
        labels={{
          backToPath: labels.backToPath,
          breadcrumbPath: labels.breadcrumbPath,
          breadcrumbLesson: labels.breadcrumbLesson,
          skillLabel: labels.skillLabel,
          unitLabel: labels.unitLabel,
        }}
      />

      <LessonHero
        title={lesson.title}
        description={lesson.description}
        estimatedMinutes={lesson.estimatedMinutes}
        context={context}
        serverProgress={progress}
        resolvedProgress={resolvedProgress}
        masteryLabel={masteryLabel}
        isActiveExercise={isActiveExercise}
        isReviewingLesson={isReviewingLesson}
        isCompleteMode={showCompleteLayer}
        onPrimaryAction={onPrimaryHeroAction}
        labels={{
          estimatedMinutes: labels.estimatedMinutes,
          unitLabel: labels.unitLabel,
          continueLesson: labels.continueLesson,
          retryLesson: labels.retryLesson,
          reviewLesson: labels.reviewLesson,
          heroContinueHint: labels.heroContinueHint,
          stateLabels: labels.stateLabels,
        }}
      />

      {!isActiveExercise && !showCompleteLayer && (
        <LessonProgressSummary
          serverProgress={progress}
          completionPercentResolved={completionPercentResolved}
          completedCount={completedCount}
          totalCount={totalExercises}
          remainingLabel={remainingLabel}
          labels={{
            completionSummary: labels.completionSummary,
            accuracy: labels.accuracy,
            mastery: labels.mastery,
            completedExercises: labels.completedExercises,
          }}
        />
      )}

      {showCompleteLayer && (
        <div className="space-y-4 -mt-1">
          <LessonCompleteSummaryCard
            context={context}
            serverProgress={progress}
            resolvedProgress={resolvedProgress}
            masteryLabel={masteryLabel}
            nextPathLesson={viewModel.nextPathLesson}
            reviewableExerciseCount={reviewableExercises.length}
            finalExerciseAccuracy={finalExerciseAccuracy}
            onReviewLesson={onReviewLesson}
            labels={completeSummaryLabels}
          />

          {reviewableExercises.length > 0 && onOpenReviewExercise && (
            <LessonReviewRecommendation
              exercises={reviewableExercises}
              sessionAccuracyByExerciseId={sessionAccuracyByExerciseId}
              labels={completeSummaryLabels}
              onOpenExercise={onOpenReviewExercise}
            />
          )}
        </div>
      )}

      <div className={cn(showCompleteLayer && activeExerciseId && "mt-0")}>{children}</div>
    </div>
  );
}
