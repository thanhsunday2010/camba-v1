import type { Exercise } from "@/types/learning";

export type ExerciseUiState = "available" | "in_progress" | "completed" | "needs_review";

export type LessonExerciseSummary = {
  id: string;
  lessonId: string;
  title: string;
  instructions?: string | null;
  exerciseType: string;
  sortOrder: number;
  questionCount: number;
  latestAttempt?: {
    score?: number | null;
    accuracyPercent?: number | null;
    completedAt?: string | null;
    attemptCount?: number | null;
  } | null;
  uiState: ExerciseUiState;
};

export type LessonPageContext = {
  programId?: string | null;
  programSlug?: string | null;
  levelId?: string | null;
  levelSlug?: string | null;
  levelName?: string | null;
  skillId?: string | null;
  skillSlug?: string | null;
  skillName?: string | null;
  unitId?: string | null;
  unitSlug?: string | null;
  unitTitle?: string | null;
};

export type LessonPageProgress = {
  isUnlocked: boolean;
  completionPercent: number;
  accuracyPercent: number;
  masteryLevel: number;
};

/** UI/session overlay — derived from server snapshot + in-session completions (not mastery) */
export type ResolvedLessonProgress = {
  totalExercises: number;
  resolvedCompletedExerciseIds: string[];
  completedCount: number;
  remainingCount: number;
  completionPercentResolved: number;
  isLessonCompleteResolved: boolean;
  nextIncompleteExerciseId: string | null;
  nextSuggestedExerciseId: string | null;
};

export type LessonPageViewModel = {
  lesson: {
    id: string;
    title: string;
    description?: string | null;
    estimatedMinutes?: number | null;
    sortOrder?: number | null;
  };
  context: LessonPageContext;
  progress: LessonPageProgress;
  exercises: Exercise[];
  exerciseSummaries: LessonExerciseSummary[];
  completedExerciseIds: string[];
  nextSuggestedExerciseId: string | null;
};

export type LessonPageLabels = {
  backToPath: string;
  breadcrumbPath: string;
  exercisesTitle: string;
  exercisesSubtitle: string;
  estimatedMinutes: string;
  completionSummary: string;
  accuracy: string;
  mastery: string;
  completedExercises: string;
  lessonCompleteTitle: string;
  lessonCompleteDescription: string;
  nextSuggested: string;
  unitLabel: string;
  skillLabel: string;
};

export type LessonExerciseListLabels = {
  startExercise: string;
  continueExercise: string;
  retryExercise: string;
  reviewExercise: string;
  available: string;
  inProgress: string;
  completed: string;
  needsReview: string;
  questionCount: string;
  writingAi: string;
  speakingAi: string;
  latestScore: string;
};
