import type {
  ExerciseUiState,
  LessonCompleteRecommendationVariant,
  LessonDisplayState,
  LessonExerciseSummary,
  LessonPageProgress,
  ResolvedLessonProgress,
} from "@/lib/learning/lesson-page-types";
import type { LessonVisualState } from "@/lib/design/status-tokens";

/** UI-only threshold — mirrors path weak-accuracy signal, not a mastery formula */
export const EXERCISE_REVIEW_ACCURACY_THRESHOLD = 70;

type AttemptRow = {
  is_completed: boolean;
  accuracy_percent: number;
};

export function getExerciseUiState(attempts: AttemptRow[]): ExerciseUiState {
  if (attempts.length === 0) return "available";

  const latest = attempts[0];
  if (!latest.is_completed) return "in_progress";

  const accuracy = Number(latest.accuracy_percent);
  if (accuracy > 0 && accuracy < EXERCISE_REVIEW_ACCURACY_THRESHOLD) {
    return "needs_review";
  }

  return "completed";
}

export function exerciseUiStateToVisualState(state: ExerciseUiState): LessonVisualState {
  switch (state) {
    case "available":
      return "unlocked";
    case "in_progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "needs_review":
      return "needs-review";
  }
}

export function resolveExerciseDisplayState(
  summary: LessonExerciseSummary,
  sessionCompletedExerciseIds: Set<string>,
  sessionAccuracyByExerciseId?: ReadonlyMap<string, number>
): ExerciseUiState {
  if (sessionCompletedExerciseIds.has(summary.id)) {
    if (summary.uiState === "needs_review") return "needs_review";
    const sessionAccuracy = sessionAccuracyByExerciseId?.get(summary.id);
    if (
      sessionAccuracy != null &&
      sessionAccuracy > 0 &&
      sessionAccuracy < EXERCISE_REVIEW_ACCURACY_THRESHOLD
    ) {
      return "needs_review";
    }
    return "completed";
  }
  return summary.uiState;
}

function isExerciseDoneForProgress(
  summary: LessonExerciseSummary,
  sessionCompletedExerciseIds: Set<string>
): boolean {
  const state = resolveExerciseDisplayState(summary, sessionCompletedExerciseIds);
  return state === "completed" || state === "needs_review";
}

/** Exercises with a persisted completed attempt (server snapshot only) */
export function getPersistedCompletedExerciseIds(
  summaries: LessonExerciseSummary[]
): string[] {
  return summaries
    .filter((s) => s.uiState === "completed" || s.uiState === "needs_review")
    .map((s) => s.id);
}

/**
 * Single source for session-aware lesson completion UI.
 * Does not compute mastery or write to the database.
 */
export function deriveResolvedLessonProgress(
  exerciseSummaries: LessonExerciseSummary[],
  sessionCompletedExerciseIds: Set<string>,
  serverCompletionPercent: number
): ResolvedLessonProgress {
  const sorted = [...exerciseSummaries].sort((a, b) => a.sortOrder - b.sortOrder);
  const totalExercises = sorted.length;

  const resolvedCompletedExerciseIds = sorted
    .filter((s) => isExerciseDoneForProgress(s, sessionCompletedExerciseIds))
    .map((s) => s.id);

  const completedCount = resolvedCompletedExerciseIds.length;
  const remainingCount = Math.max(0, totalExercises - completedCount);
  const completionPercentResolved =
    totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;

  const isLessonCompleteResolved =
    totalExercises > 0 &&
    (completedCount >= totalExercises || serverCompletionPercent >= 100);

  const nextIncompleteExercise = sorted.find(
    (s) => !isExerciseDoneForProgress(s, sessionCompletedExerciseIds)
  );
  const nextIncompleteExerciseId = nextIncompleteExercise?.id ?? null;

  let nextSuggestedExerciseId: string | null = null;
  if (!isLessonCompleteResolved) {
    const nextActive = sorted.find((s) => {
      const state = resolveExerciseDisplayState(s, sessionCompletedExerciseIds);
      return state === "available" || state === "in_progress";
    });
    if (nextActive) {
      nextSuggestedExerciseId = nextActive.id;
    } else {
      const review = sorted.find(
        (s) =>
          resolveExerciseDisplayState(s, sessionCompletedExerciseIds) === "needs_review"
      );
      nextSuggestedExerciseId = review?.id ?? null;
    }
  }

  return {
    totalExercises,
    resolvedCompletedExerciseIds,
    completedCount,
    remainingCount,
    completionPercentResolved,
    isLessonCompleteResolved,
    nextIncompleteExerciseId,
    nextSuggestedExerciseId,
  };
}

/** @deprecated Prefer deriveResolvedLessonProgress */
export function resolveNextSuggestedExerciseId(
  summaries: LessonExerciseSummary[],
  sessionCompletedExerciseIds: Set<string> = new Set()
): string | null {
  return deriveResolvedLessonProgress(
    summaries,
    sessionCompletedExerciseIds,
    0
  ).nextSuggestedExerciseId;
}

/** @deprecated Prefer deriveResolvedLessonProgress */
export function isLessonFullyCompleted(
  summaries: LessonExerciseSummary[],
  completionPercent: number,
  sessionCompletedExerciseIds?: Set<string>
): boolean {
  return deriveResolvedLessonProgress(
    summaries,
    sessionCompletedExerciseIds ?? new Set(getPersistedCompletedExerciseIds(summaries)),
    completionPercent
  ).isLessonCompleteResolved;
}

/** @deprecated Prefer deriveResolvedLessonProgress */
export function countCompletedExercises(
  summaries: LessonExerciseSummary[],
  sessionCompletedExerciseIds?: Set<string>
): number {
  return deriveResolvedLessonProgress(
    summaries,
    sessionCompletedExerciseIds ??
      new Set(getPersistedCompletedExerciseIds(summaries)),
    0
  ).completedCount;
}

/** UI-only — mirrors path review rules using server snapshot fields */
export function needsReviewFromLessonProgress(
  progress: LessonPageProgress,
  isLessonCompleteResolved: boolean
): boolean {
  const completion = Math.max(
    progress.completionPercent,
    isLessonCompleteResolved ? 100 : 0
  );
  const mastery = progress.masteryLevel ?? 0;
  const accuracy = progress.accuracyPercent ?? 0;
  const attempts = progress.attemptsCount ?? 0;

  if (completion >= 100 && mastery < 3) return true;
  if (attempts >= 2 && mastery <= 2 && completion > 0) return true;
  if (completion >= 100 && accuracy > 0 && accuracy < 70 && mastery < 4) return true;
  return false;
}

export function getLessonDisplayState(
  progress: LessonPageProgress,
  resolved: ResolvedLessonProgress,
  isUnlocked: boolean
): LessonDisplayState {
  if (!isUnlocked) return "locked";

  const isComplete = resolved.isLessonCompleteResolved;

  if (isComplete || progress.completionPercent >= 100) {
    if (needsReviewFromLessonProgress(progress, isComplete)) return "needs-review";
    if (progress.masteryLevel >= 4) return "mastered";
    return "completed";
  }

  if (resolved.completedCount > 0 || progress.completionPercent > 0) {
    return "in-progress";
  }

  return "not-started";
}

export function lessonDisplayStateToVisualState(
  state: LessonDisplayState
): LessonVisualState {
  switch (state) {
    case "locked":
      return "locked";
    case "not-started":
      return "unlocked";
    case "in-progress":
      return "in-progress";
    case "completed":
      return "completed";
    case "mastered":
      return "mastered";
    case "needs-review":
      return "needs-review";
  }
}

/** Exercises flagged for review from server snapshot or in-session low accuracy */
export function getReviewableExerciseSummaries(
  summaries: LessonExerciseSummary[],
  sessionCompletedExerciseIds: Set<string>,
  sessionAccuracyByExerciseId?: ReadonlyMap<string, number>
): LessonExerciseSummary[] {
  return summaries.filter((summary) => {
    if (
      resolveExerciseDisplayState(summary, sessionCompletedExerciseIds) ===
      "needs_review"
    ) {
      return true;
    }
    const sessionAccuracy = sessionAccuracyByExerciseId?.get(summary.id);
    return (
      sessionCompletedExerciseIds.has(summary.id) &&
      sessionAccuracy != null &&
      sessionAccuracy > 0 &&
      sessionAccuracy < EXERCISE_REVIEW_ACCURACY_THRESHOLD
    );
  });
}

export function getLessonCompleteRecommendationVariant(
  progress: LessonPageProgress,
  isLessonCompleteResolved: boolean,
  reviewableExerciseCount: number,
  finalExerciseAccuracy?: number | null
): LessonCompleteRecommendationVariant {
  if (reviewableExerciseCount > 0) return "exercisesNeedReview";
  if (needsReviewFromLessonProgress(progress, isLessonCompleteResolved)) {
    return "lessonNeedsReview";
  }
  if (
    finalExerciseAccuracy != null &&
    finalExerciseAccuracy > 0 &&
    finalExerciseAccuracy < EXERCISE_REVIEW_ACCURACY_THRESHOLD
  ) {
    return "finalQuizLow";
  }
  return "greatJobContinue";
}

export function getLastExerciseSummary(
  summaries: LessonExerciseSummary[]
): LessonExerciseSummary | null {
  if (summaries.length === 0) return null;
  return [...summaries].sort((a, b) => a.sortOrder - b.sortOrder).at(-1) ?? null;
}
