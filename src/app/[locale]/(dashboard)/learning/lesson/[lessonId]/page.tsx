import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { ensureLessonUnlockedForUser } from "@/lib/queries/learning";
import { getLessonPageViewModel } from "@/lib/learning/lesson-page";
import { StudentPageShell } from "@/components/camba";
import { LessonPageContent } from "@/components/learning/lesson/lesson-page-content";
import { LessonLockedState } from "@/components/learning/lesson/lesson-locked-state";
import { LessonEmptyState } from "@/components/learning/lesson/lesson-empty-state";
import type { LessonDisplayState, LessonCompleteSummaryLabels } from "@/lib/learning/lesson-page-types";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

const EXERCISE_TYPE_KEYS = [
  "default",
  "writing",
  "speaking",
  "listening",
  "reading",
  "vocabulary",
  "grammar",
  "gapFill",
  "matching",
  "multipleChoice",
  "multiSelect",
  "sentenceOrdering",
] as const;

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  await ensureLessonUnlockedForUser(user.id, lessonId);

  const viewModel = await getLessonPageViewModel(user.id, lessonId);
  if (!viewModel) notFound();

  const t = await getTranslations("learning.lesson");
  const tcs = await getTranslations("learning.lesson.completeSummary");
  const tl = await getTranslations("learning");
  const tm = await getTranslations("mastery");

  const masteryKeys = ["notStarted", "beginner", "developing", "proficient", "mastered"] as const;
  const masteryLevel = Math.min(4, Math.max(0, viewModel.progress.masteryLevel));
  const masteryLabel = tm(masteryKeys[masteryLevel]);

  const stateLabels: Record<LessonDisplayState, string> = {
    locked: tl("stateLocked"),
    "not-started": tl("unitStateNotStarted"),
    "in-progress": tl("stateInProgress"),
    completed: tl("stateCompleted"),
    mastered: tl("stateMastered"),
    "needs-review": tl("stateNeedsReview"),
  };

  const exerciseTypeLabels = Object.fromEntries(
    EXERCISE_TYPE_KEYS.map((key) => [key, t(`exerciseTypes.${key}` as "exerciseTypes.default")])
  );

  const pageLabels = {
    backToPath: t("backToPath"),
    breadcrumbPath: t("breadcrumbPath"),
    breadcrumbLesson: t("breadcrumbLesson"),
    exercisesTitle: t("exercisesTitle"),
    exercisesSubtitle: t("exercisesSubtitle"),
    exercisesProgress: (completed: number, total: number) =>
      t("exercisesProgress", { completed, total }),
    estimatedMinutes: t("estimatedMinutes"),
    exerciseCount: (count: number) => t("exerciseCount", { count }),
    completionSummary: t("completionSummary"),
    accuracy: t("accuracy"),
    mastery: t("mastery"),
    completedExercises: t("completedExercises"),
    nextSuggested: t("nextSuggested"),
    unitLabel: t("unitLabel"),
    skillLabel: t("skillLabel"),
    continueLesson: t("continueLesson"),
    retryLesson: t("retryLesson"),
    reviewLesson: t("reviewLesson"),
    nextPathLesson: (lesson: string) => t("nextPathLesson", { lesson }),
    heroContinueHint: t("heroContinueHint"),
    stateLabels,
  };

  const completeSummaryLabels: LessonCompleteSummaryLabels = {
    title: tcs("title"),
    performanceNote: tcs("performanceNote"),
    recommendationExercisesNeedReview: (count: number) =>
      tcs("recommendationExercisesNeedReview", { count }),
    recommendationLessonNeedsReview: tcs("recommendationLessonNeedsReview"),
    recommendationFinalQuizLow: tcs("recommendationFinalQuizLow"),
    recommendationGreatJob: tcs("recommendationGreatJob"),
    backToPath: t("backToPath"),
    retryLesson: t("retryLesson"),
    nextPathLesson: (lesson: string) => t("nextPathLesson", { lesson }),
    reviewSectionTitle: tcs("reviewSectionTitle"),
    reviewSectionSubtitle: tcs("reviewSectionSubtitle"),
    reviewExerciseAction: tcs("reviewExerciseAction"),
    finalExerciseHeading: tcs("finalExerciseHeading"),
    finalExerciseSubtitle: (title: string) => tcs("finalExerciseSubtitle", { title }),
    finalExerciseReviewTag: tcs("finalExerciseReviewTag"),
    lessonLevelScoreNote: tcs("lessonLevelScoreNote"),
    victorySubtitle: tcs("victorySubtitle"),
    metricLabelExercises: tcs("metricLabelExercises"),
    metricLabelLesson: tcs("metricLabelLesson"),
    metricLabelAccuracy: tcs("metricLabelAccuracy"),
    recommendationSupportGreatJob: tcs("recommendationSupportGreatJob"),
    recommendationSupportReview: tcs("recommendationSupportReview"),
    recommendationSupportFinalQuiz: tcs("recommendationSupportFinalQuiz"),
    recommendationSupportLessonReview: tcs("recommendationSupportLessonReview"),
    reviewReasonLowScore: tcs("reviewReasonLowScore"),
    finalExerciseDetailsLabel: tcs("finalExerciseDetailsLabel"),
    backToCompleteSummary: tcs("backToCompleteSummary"),
    ctaZoneTitle: tcs("ctaZoneTitle"),
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
    questionCount: (count: number) => t("questionCount", { count }),
    writingAi: t("writingAi"),
    speakingAi: t("speakingAi"),
    latestScore: (score: number) => t("latestScore", { score }),
    remainingExercises: (count: number) => t("remainingExercises", { count }),
    exercisesTitle: t("exercisesTitle"),
    exercisesSubtitle: t("exercisesSubtitle"),
    exercisesProgress: (completed: number, total: number) =>
      t("exercisesProgress", { completed, total }),
    nextSuggested: t("nextSuggested"),
    backToList: t("backToList"),
    reviewExercisesSubtitle: t("reviewExercisesSubtitle"),
    backToComplete: t("backToComplete"),
    exerciseTypeLabels,
  };

  const aiLabels = {
    placeholder: t("ai.placeholder"),
    wordCount: t("ai.wordCount"),
    submit: t("ai.submit"),
    submitting: t("ai.submitting"),
    minWordsError: (min: number) => t("ai.minWordsError", { min }),
    result: t("ai.result"),
    estimatedLevel: t("ai.estimatedLevel"),
    grammar: t("ai.grammar"),
    vocabulary: t("ai.vocabulary"),
    coherence: t("ai.coherence"),
    improvements: t("ai.improvements"),
    pronunciation: t("ai.pronunciation"),
    fluency: t("ai.fluency"),
    suggestions: t("ai.suggestions"),
    overallScore: t("ai.overallScore"),
    startRecording: t("ai.startRecording"),
    stopRecording: t("ai.stopRecording"),
    noRecording: t("ai.noRecording"),
    recording: t("ai.recording"),
    transcript: t("ai.transcript"),
    transcriptPlaceholder: t("ai.transcriptPlaceholder"),
    transcriptUnsupported: t("ai.transcriptUnsupported"),
    micAccessDenied: t("ai.micAccessDenied"),
    micNotFound: t("ai.micNotFound"),
    micInsecureContext: t("ai.micInsecureContext"),
    micNotSupported: t("ai.micNotSupported"),
    micRecorderUnsupported: t("ai.micRecorderUnsupported"),
    micUnknownError: t("ai.micUnknownError"),
  };

  const chromeLabels = {
    backToList: t("backToList"),
    exercisePosition: (current: number, total: number) =>
      t("exercisePosition", { current, total }),
    lessonProgressShort: (percent: number) => t("lessonProgressShort", { percent }),
    submitFailed: t("submitFailed"),
    embeddedResultHeading: (percent: number) => t("embeddedResultHeading", { percent }),
    embeddedResultScore: (score: number, maxScore: number) =>
      t("embeddedResultScore", { score, maxScore }),
  };

  if (!viewModel.progress.isUnlocked) {
    const continueHref = viewModel.nextPathLesson
      ? `/learning/lesson/${viewModel.nextPathLesson.id}`
      : null;

    return (
      <StudentPageShell narrow>
        <LessonLockedState
          continueLessonHref={continueHref}
          labels={{
            lockedTitle: t("lockedTitle"),
            lockedDescription: t("lockedDescription"),
            backToPath: t("backToPath"),
            lockedHint: tl("lockedHint"),
            lockContinueLabel: tl("lockContinueLabel"),
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
        completeSummaryLabels={completeSummaryLabels}
        masteryLabel={masteryLabel}
        listLabels={listLabels}
        aiLabels={aiLabels}
        chromeLabels={chromeLabels}
      />
    </StudentPageShell>
  );
}
