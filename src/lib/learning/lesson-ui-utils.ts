import type {
  ExerciseUiState,
  LessonExerciseSummary,
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
  sessionCompletedIds: Set<string>
): ExerciseUiState {
  if (sessionCompletedIds.has(summary.id)) {
    if (summary.uiState === "needs_review") return "needs_review";
    return "completed";
  }
  return summary.uiState;
}

/** Exercises with a persisted completed attempt */
export function getPersistedCompletedExerciseIds(
  summaries: LessonExerciseSummary[]
): string[] {
  return summaries
    .filter((s) => s.uiState === "completed" || s.uiState === "needs_review")
    .map((s) => s.id);
}

export function resolveNextSuggestedExerciseId(
  summaries: LessonExerciseSummary[]
): string | null {
  const sorted = [...summaries].sort((a, b) => a.sortOrder - b.sortOrder);

  const nextActive = sorted.find(
    (s) => s.uiState === "available" || s.uiState === "in_progress"
  );
  if (nextActive) return nextActive.id;

  const review = sorted.find((s) => s.uiState === "needs_review");
  if (review) return review.id;

  return sorted[0]?.id ?? null;
}

export function isLessonFullyCompleted(
  summaries: LessonExerciseSummary[],
  completionPercent: number
): boolean {
  if (summaries.length === 0) return false;
  if (completionPercent >= 100) return true;
  return summaries.every(
    (s) => s.uiState === "completed" || s.uiState === "needs_review"
  );
}

export function countCompletedExercises(
  summaries: LessonExerciseSummary[],
  sessionCompletedIds?: Set<string>
): number {
  if (!sessionCompletedIds?.size) {
    return getPersistedCompletedExerciseIds(summaries).length;
  }

  return summaries.filter((s) => {
    const state = resolveExerciseDisplayState(s, sessionCompletedIds);
    return state === "completed" || state === "needs_review";
  }).length;
}
