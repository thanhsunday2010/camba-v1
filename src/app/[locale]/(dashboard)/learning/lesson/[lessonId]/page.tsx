import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ensureLessonUnlockedForUser } from "@/lib/queries/learning";
import { getLessonPageViewModel } from "@/lib/learning/lesson-page";
import { StudentPageShell } from "@/components/camba";
import { LessonPageContent } from "@/components/learning/lesson/lesson-page-content";
import { LessonLockedState } from "@/components/learning/lesson/lesson-locked-state";
import { LessonEmptyState } from "@/components/learning/lesson/lesson-empty-state";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await ensureLessonUnlockedForUser(user.id, lessonId);

  const viewModel = await getLessonPageViewModel(user.id, lessonId);
  if (!viewModel) notFound();

  const t = await getTranslations("learning.lesson");
  const tl = await getTranslations("learning");
  const tm = await getTranslations("mastery");

  const masteryKeys = ["notStarted", "beginner", "developing", "proficient", "mastered"] as const;
  const masteryLevel = Math.min(4, Math.max(0, viewModel.progress.masteryLevel));
  const masteryLabel = tm(masteryKeys[masteryLevel]);

  const pageLabels = {
    backToPath: t("backToPath"),
    breadcrumbPath: t("breadcrumbPath"),
    exercisesTitle: t("exercisesTitle"),
    exercisesSubtitle: t("exercisesSubtitle"),
    estimatedMinutes: t("estimatedMinutes"),
    completionSummary: t("completionSummary"),
    accuracy: t("accuracy"),
    mastery: t("mastery"),
    completedExercises: t("completedExercises"),
    lessonCompleteTitle: t("lessonCompleteTitle"),
    lessonCompleteDescription: t("lessonCompleteDescription"),
    nextSuggested: t("nextSuggested"),
    unitLabel: t("unitLabel"),
    skillLabel: t("skillLabel"),
  };

  const listLabels = {
    startExercise: t("startExercise"),
    continueExercise: t("continueExercise"),
    retryExercise: t("retryExercise"),
    reviewExercise: t("reviewExercise"),
    completed: t("completed"),
    inProgress: t("inProgress"),
    needsReview: t("needsReview"),
    available: t("available"),
    questionCount: t("questionCount"),
    writingAi: t("writingAi"),
    speakingAi: t("speakingAi"),
    latestScore: t("latestScore"),
    remainingExercises: t("remainingExercises"),
    exercisesTitle: t("exercisesTitle"),
    exercisesSubtitle: t("exercisesSubtitle"),
    nextSuggested: t("nextSuggested"),
    backToList: t("backToList"),
  };

  if (!viewModel.progress.isUnlocked) {
    return (
      <StudentPageShell narrow>
        <LessonLockedState
          labels={{
            lockedTitle: t("lockedTitle"),
            lockedDescription: t("lockedDescription"),
            backToPath: t("backToPath"),
            lockedHint: tl("lockedHint"),
          }}
        />
      </StudentPageShell>
    );
  }

  if (viewModel.exerciseSummaries.length === 0) {
    return (
      <StudentPageShell narrow>
        <LessonEmptyState
          labels={{
            emptyTitle: t("emptyTitle"),
            emptyDescription: t("emptyDescription"),
            backToPath: t("backToPath"),
          }}
        />
      </StudentPageShell>
    );
  }

  return (
    <StudentPageShell narrow>
      <LessonPageContent
        viewModel={viewModel}
        labels={pageLabels}
        masteryLabel={masteryLabel}
        listLabels={listLabels}
      />
    </StudentPageShell>
  );
}
