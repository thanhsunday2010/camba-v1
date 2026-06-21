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
  unitSortOrder?: number | null;
  programName?: string | null;
};

export type LessonPageProgress = {
  isUnlocked: boolean;
  completionPercent: number;
  accuracyPercent: number;
  masteryLevel: number;
  attemptsCount?: number;
};

/** UI-only lesson hero / shell display state */
export type LessonDisplayState =
  | "locked"
  | "not-started"
  | "in-progress"
  | "completed"
  | "mastered"
  | "needs-review";

export type LessonNextPathLesson = {
  id: string;
  title: string;
} | null;

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
  nextPathLesson: LessonNextPathLesson;
};

export type LessonPageLabels = {
  backToPath: string;
  breadcrumbPath: string;
  breadcrumbLesson: string;
  exercisesTitle: string;
  exercisesSubtitle: string;
  exercisesProgress: string;
  estimatedMinutes: string;
  exerciseCount: string;
  completionSummary: string;
  accuracy: string;
  mastery: string;
  completedExercises: string;
  lessonCompleteTitle: string;
  lessonCompleteDescription: string;
  lessonCompletePerformance: string;
  nextSuggested: string;
  unitLabel: string;
  skillLabel: string;
  continueLesson: string;
  retryLesson: string;
  reviewLesson: string;
  nextPathLesson: string;
  stateLabels: Record<LessonDisplayState, string>;
  heroContinueHint: string;
};

export type AiExerciseLabels = {
  placeholder: string;
  wordCount: string;
  submit: string;
  submitting: string;
  minWordsError: string;
  result: string;
  estimatedLevel: string;
  grammar: string;
  vocabulary: string;
  coherence: string;
  improvements: string;
  pronunciation: string;
  fluency: string;
  suggestions: string;
  overallScore: string;
  startRecording: string;
  stopRecording: string;
  noRecording: string;
  recording: string;
  transcript: string;
  transcriptPlaceholder: string;
  transcriptUnsupported: string;
};

export type LessonChromeLabels = {
  backToList: string;
  exercisePosition: string;
  lessonProgressShort: string;
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
  exerciseTypeLabels: Record<string, string>;
};
