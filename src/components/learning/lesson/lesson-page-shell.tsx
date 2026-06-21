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
  children: ReactNode;
  className?: string;
}

export function LessonPageShell({
  viewModel,
  labels,
  masteryLabel,
  resolvedProgress,
  remainingExercisesLabel,
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
        }}
      />

      <LessonHero
        title={lesson.title}
        description={lesson.description}
        estimatedMinutes={lesson.estimatedMinutes}
        context={context}
        progress={progress}
        masteryLabel={masteryLabel}
        labels={{
          estimatedMinutes: labels.estimatedMinutes,
          skillLabel: labels.skillLabel,
          unitLabel: labels.unitLabel,
        }}
      />

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

      {isLessonCompleteResolved && (
        <LessonCompleteState
          completionPercentResolved={completionPercentResolved}
          serverProgress={progress}
          completedCount={completedCount}
          totalCount={totalExercises}
          masteryLabel={masteryLabel}
          labels={{
            lessonCompleteTitle: labels.lessonCompleteTitle,
            lessonCompleteDescription: labels.lessonCompleteDescription,
            backToPath: labels.backToPath,
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
