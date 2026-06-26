import type { Exercise } from "@/types/learning";
import type { VocabularyWord } from "@/lib/learning/vocabulary-bank";

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
  kind: "next-lesson" | "next-skill" | "next-unit";
  skillName?: string;
  unitTitle?: string;
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
  vocabularyBank: VocabularyWord[];
};

export type LessonPageLabels = {
  backToPath: string;
  breadcrumbPath: string;
  breadcrumbLesson: string;
  exercisesTitle: string;
  exercisesSubtitle: string;
  estimatedMinutes: string;
  completionSummary: string;
  accuracy: string;
  mastery: string;
  completedExercises: string;
  nextSuggested: string;
  unitLabel: string;
  skillLabel: string;
  continueLesson: string;
  retryLesson: string;
  reviewLesson: string;
  stateLabels: Record<LessonDisplayState, string>;
  heroContinueHint: string;
  openVocabularyBank: string;
};

export type LessonCompleteRecommendationVariant =
  | "exercisesNeedReview"
  | "lessonNeedsReview"
  | "finalQuizLow"
  | "greatJobContinue";

export type LessonCompleteSummaryLabels = {
  title: string;
  performanceNote: string;
  recommendationLessonNeedsReview: string;
  recommendationFinalQuizLow: string;
  recommendationGreatJob: string;
  backToPath: string;
  retryLesson: string;
  reviewSectionTitle: string;
  reviewSectionSubtitle: string;
  reviewExerciseAction: string;
  finalExerciseHeading: string;
  finalExerciseReviewTag: string;
  lessonLevelScoreNote: string;
  victorySubtitle: string;
  metricLabelExercises: string;
  metricLabelLesson: string;
  metricLabelAccuracy: string;
  recommendationSupportGreatJob: string;
  recommendationSupportReview: string;
  recommendationSupportFinalQuiz: string;
  recommendationSupportLessonReview: string;
  reviewReasonLowScore: string;
  finalExerciseDetailsLabel: string;
  ctaZoneTitle: string;
  ctaNextLesson: string;
  ctaNextSkill: string;
  ctaNextUnit: string;
  backToCompleteSummary: string;
};

export type LessonExerciseCompletionMeta = {
  exerciseId: string;
  accuracyPercent?: number;
  gamification?: import("@/lib/gamification/gamification-types").ExerciseGamificationSummary;
};

export type AiExerciseLabels = {
  placeholder: string;
  wordCount: string;
  submit: string;
  submitting: string;
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
  micAccessDenied: string;
  micNotFound: string;
  micInsecureContext: string;
  micNotSupported: string;
  micRecorderUnsupported: string;
  micUnknownError: string;
  errorHighlights: string;
  correctedVersion: string;
  modelAnswer: string;
  bestPhrase: string;
  focusFix: string;
  questionAudioPlaying: string;
  replayQuestion: string;
  stopAudio: string;
  modelAnswerAudioPlaying: string;
  replayModelAnswer: string;
  retrySamePrompt: string;
  retryHint: string;
  scoreDelta: string;
  focusFixTitle: string;
  attemptPrevious: string;
  attemptCurrent: string;
};

export type LessonChromeLabels = {
  backToList: string;
  submitFailed: string;
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
  writingAi: string;
  speakingAi: string;
  exerciseTypeLabels: Record<string, string>;
};
