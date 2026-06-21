import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LessonBreadcrumb } from "@/components/learning/lesson/lesson-breadcrumb";
import { LessonHero } from "@/components/learning/lesson/lesson-hero";
import { LessonProgressSummary } from "@/components/learning/lesson/lesson-progress-summary";
import { LessonCompleteState } from "@/components/learning/lesson/lesson-complete-state";
import { isLessonFullyCompleted, countCompletedExercises } from "@/lib/learning/lesson-ui-utils";
import type {
  LessonPageLabels,
  LessonPageViewModel,
} from "@/lib/learning/lesson-page-types";

interface LessonPageShellProps {
  viewModel: LessonPageViewModel;
  labels: LessonPageLabels;
  masteryLabel: string;
  children: ReactNode;
  className?: string;
}

export function LessonPageShell({
  viewModel,
  labels,
  masteryLabel,
  children,
  className,
}: LessonPageShellProps) {
  const { lesson, context, progress, exerciseSummaries } = viewModel;
  const totalCount = exerciseSummaries.length;
  const completedCount = countCompletedExercises(exerciseSummaries);
  const showComplete = isLessonFullyCompleted(exerciseSummaries, progress.completionPercent);

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
        progress={progress}
        completedCount={completedCount}
        totalCount={totalCount}
        labels={{
          completionSummary: labels.completionSummary,
          accuracy: labels.accuracy,
          mastery: labels.mastery,
          completedExercises: labels.completedExercises,
        }}
      />

      {showComplete && (
        <LessonCompleteState
          progress={progress}
          completedCount={completedCount}
          totalCount={totalCount}
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
