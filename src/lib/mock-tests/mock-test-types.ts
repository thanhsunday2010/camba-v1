import type { MockTestData } from "@/types/learning";

export type MockTestDisplayState =
  | "not-started"
  | "in-progress"
  | "completed"
  | "needs-review";

export type MockTestRecommendationVariant = "great-job" | "solid" | "needs-review";

export type MockTestPrimaryCta = "start" | "retake";

export type MockTestHubSummary = {
  id: string;
  title: string;
  description: string | null;
  levelName: string | null;
  durationMinutes: number;
  questionCount: number;
  sectionCount: number;
  attemptCount: number;
  bestScorePercent: number | null;
  latestScorePercent: number | null;
  displayState: MockTestDisplayState;
  latestCompletedAt: string | null;
  skillTags: string[];
};

export type MockTestAttemptSummary = {
  attemptId: string;
  score: number;
  maxScore: number;
  scorePercent: number;
  completedAt: string | null;
  timeSpentSeconds: number | null;
  skillBreakdown: Record<string, number>;
  shieldEstimate: Record<string, number>;
  needsReview: boolean;
  recommendationVariant: MockTestRecommendationVariant;
};

export type MockTestSectionSummary = {
  id: string;
  title: string;
  sortOrder: number;
  questionCount: number;
  timeLimitMinutes: number | null;
  skillSlug: string | null;
  skillName: string | null;
};

export type MockTestDetailViewModel = {
  id: string;
  title: string;
  description: string | null;
  levelName: string | null;
  durationMinutes: number;
  totalScore: number;
  questionCount: number;
  sectionCount: number;
  displayState: MockTestDisplayState;
  primaryCta: MockTestPrimaryCta;
  attemptCount: number;
  bestScorePercent: number | null;
  sections: MockTestSectionSummary[];
  latestAttempt: MockTestAttemptSummary | null;
  takeHref: string;
};

export type MockTestHubViewModel = {
  tests: MockTestHubSummary[];
  totalCount: number;
};

export type MockTestHubLabels = {
  title: string;
  subtitle: string;
  availableCount: string;
  filterAll: string;
  filterNotStarted: string;
  filterCompleted: string;
  filterNeedsReview: string;
  level: string;
  minutes: string;
  questions: string;
  sections: string;
  bestScore: string;
  latestScore: string;
  attempts: string;
  viewDetail: string;
  emptyTitle: string;
  emptyDescription: string;
  statusLabels: Record<MockTestDisplayState, string>;
};

export type MockTestDetailLabels = {
  backToHub: string;
  breadcrumbHub: string;
  level: string;
  minutes: string;
  questions: string;
  sections: string;
  structureTitle: string;
  structureSubtitle: string;
  sectionLabel: string;
  sectionQuestions: string;
  sectionMinutes: string;
  latestResultTitle: string;
  startTest: string;
  retakeTest: string;
  viewLatestResult: string;
  seeStructure: string;
  backToHubCta: string;
  attemptsSummary: string;
  notAvailable: string;
  statusLabels: Record<MockTestDisplayState, string>;
};

export type MockTestCompleteLabels = {
  title: string;
  victorySubtitle: string;
  overallScore: string;
  rawScore: string;
  scoreLine: string;
  skillBreakdownTitle: string;
  shieldsTitle: string;
  shieldsNote: string;
  performanceNote: string;
  retakeTest: string;
  backToHub: string;
  backToDetail: string;
  reviewTest: string;
  recommendationGreatJob: string;
  recommendationSolid: string;
  recommendationNeedsReview: string;
  supportGreatJob: string;
  supportSolid: string;
  supportNeedsReview: string;
};

export type MockTestReviewLabels = {
  title: string;
  subtitle: string;
  weakSkill: string;
  retakeHint: string;
  reviewSkillAction: string;
};

export type MockTestPageLabels = {
  hub: MockTestHubLabels;
  detail: MockTestDetailLabels;
  complete: MockTestCompleteLabels;
  review: MockTestReviewLabels;
  take: MockTestTakeLabels;
};

export type MockTestTakeQuestionSummary = {
  id: string;
  sectionId: string;
  sectionTitle: string;
  skillName: string | null;
  skillSlug: string | null;
  position: number;
  questionText: string;
};

export type MockTestTakeViewModel = {
  id: string;
  title: string;
  description: string | null;
  levelName: string | null;
  durationMinutes: number;
  questionCount: number;
  sectionCount: number;
  sections: MockTestSectionSummary[];
  questions: MockTestTakeQuestionSummary[];
  test: MockTestData;
  detailHref: string;
  hubHref: string;
  hasPriorAttempts: boolean;
};

export type ResolvedMockTestProgress = {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredCount: number;
  completionPercent: number;
  isTestCompleteResolved: boolean;
  currentSectionTitle: string | null;
  currentSectionId: string | null;
};

export type MockTestTakeLabels = {
  backToDetail: string;
  breadcrumbDetail: string;
  section: string;
  question: string;
  of: string;
  previous: string;
  next: string;
  submit: string;
  submitting: string;
  submitFailed: string;
  progressSummary: string;
  questionsAnswered: string;
  reviewTest: string;
  reviewQuestion: string;
  backToResults: string;
  backToReviewList: string;
  exitReviewMode: string;
  framedHeading: string;
  framedSubtitle: string;
  framedDetailsLabel: string;
  framedScoreNote: string;
  reviewListTitle: string;
  reviewListSubtitle: string;
  questionPosition: string;
  backToHub: string;
  retakeTest: string;
  viewDetail: string;
  reviewWeakSkill: string;
  completeModeSubtitle: string;
};
