"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LessonBreadcrumb } from "@/components/learning/lesson/lesson-breadcrumb";
import { LessonHero } from "@/components/learning/lesson/lesson-hero";
import { LessonProgressSummary } from "@/components/learning/lesson/lesson-progress-summary";
import { LessonCompleteState } from "@/components/learning/lesson/lesson-complete-state";
import type {
  LessonPageLabels,
  LessonPageViewModel,
  ResolvedLessonProgress,
} from "@/lib/learning/lesson-page-types";

interface LessonPageShellProps {
  viewModel: LessonPageViewModel;
  labels: LessonPageLabels;
  masteryLabel: string;
  resolvedProgress: ResolvedLessonProgress;
  remainingExercisesLabel?: string;
  activeExerciseId?: string | null;
  onPrimaryHeroAction?: () => void;
  onReviewLesson?: () => void;
  children: ReactNode;
  className?: string;
}

export function LessonPageShell({
  viewModel,
  labels,
  masteryLabel,
  resolvedProgress,
  remainingExercisesLabel,
  activeExerciseId,
  onPrimaryHeroAction,
  onReviewLesson,
  children,
  className,
}: LessonPageShellProps) {
  const { lesson, context, progress } = viewModel;
  const {
    completedCount,
    totalExercises,
    completionPercentResolved,
    isLessonCompleteResolved,
    remainingCount,
  } = resolvedProgress;

  const isActiveExercise = Boolean(activeExerciseId);

  const remainingLabel =
    remainingExercisesLabel && remainingCount > 0 && !isLessonCompleteResolved
      ? remainingExercisesLabel.replace("{count}", String(remainingCount))
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
        onPrimaryAction={onPrimaryHeroAction}
        labels={{
          estimatedMinutes: labels.estimatedMinutes,
          unitLabel: labels.unitLabel,
          exerciseCount: labels.exerciseCount,
          continueLesson: labels.continueLesson,
          retryLesson: labels.retryLesson,
          reviewLesson: labels.reviewLesson,
          heroContinueHint: labels.heroContinueHint,
          stateLabels: labels.stateLabels,
        }}
      />

      {!isActiveExercise && (
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

      {isLessonCompleteResolved && !isActiveExercise && (
        <LessonCompleteState
          completionPercentResolved={completionPercentResolved}
          serverProgress={progress}
          completedCount={completedCount}
          totalCount={totalExercises}
          masteryLabel={masteryLabel}
          nextPathLesson={viewModel.nextPathLesson}
          onReviewLesson={onReviewLesson}
          labels={{
            lessonCompleteTitle: labels.lessonCompleteTitle,
            lessonCompleteDescription: labels.lessonCompleteDescription,
            lessonCompletePerformance: labels.lessonCompletePerformance,
            backToPath: labels.backToPath,
            retryLesson: labels.retryLesson,
            nextPathLesson: labels.nextPathLesson,
            completedExercises: labels.completedExercises,
            completionSummary: labels.completionSummary,
            accuracy: labels.accuracy,
          }}
        />
      )}

      {children}
    </div>
  );
}
