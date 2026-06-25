/** U8.5 — Parent-friendly report types (aggregate only, no new scoring). */

export type ReportTrendLabel = "improving" | "stable" | "building" | null;

export type ReportConsistencyLabel = "consistent" | "returning" | "getting-started";

/** Phase C — Single-page overview */
export type ParentProgressSnapshot = {
  studentName: string;
  levelName: string | null;
  programName: string | null;
  cefrEstimate: string | null;
  currentStreak: number;
  bestStreak: number;
  lessonsCompleted: number;
  unitsCompleted: number;
  mocksCompleted: number;
  latestActivityTitle: string | null;
  latestActivityDate: string | null;
  journeyCompletionPercent: number | null;
  journeyCurrentLevel: string | null;
  generatedAt: string;
  hasData: boolean;
};

/** Phase D */
export type LearningProgressSummary = {
  consistency: ReportConsistencyLabel;
  consistencyNote: string;
  recentActivitySummary: string | null;
  unitsCompleted: number;
  lessonsCompleted: number;
  currentStage: string | null;
  progressTrend: ReportTrendLabel;
  progressPercent: number | null;
  isEmpty: boolean;
};

/** Phase E */
export type MockPerformanceSummary = {
  latestScorePercent: number | null;
  bestScorePercent: number | null;
  mocksCompleted: number;
  trendLabel: ReportTrendLabel;
  readinessPercent: number | null;
  readinessBandLabel: string | null;
  recentScores: { title: string; scorePercent: number; date: string }[];
  recentCertifications: { title: string; date: string | null }[];
  isEmpty: boolean;
};

/** Phase F */
export type WritingProgressSummary = {
  tasksCompleted: number;
  averageScore: number | null;
  strengths: string[];
  improvementAreas: string[];
  trendLabel: ReportTrendLabel;
  recentGrowthNote: string | null;
  isEmpty: boolean;
};

/** Phase G */
export type SpeakingProgressSummary = {
  practiceCount: number;
  averageScore: number | null;
  fluencyTrend: ReportTrendLabel;
  pronunciationAvg: number | null;
  fluencyAvg: number | null;
  vocabularyAvg: number | null;
  growthNote: string | null;
  isEmpty: boolean;
};

/** Phase H */
export type ParentSkillSummary = {
  grammarStrengths: string[];
  grammarImprovementAreas: string[];
  vocabularyStrengths: string[];
  vocabularyImprovementAreas: string[];
  hasAnalytics: boolean;
  isEmpty: boolean;
  emptyNote: string | null;
};

/** Phase I */
export type AchievementSummary = {
  recentAchievements: { title: string; date: string | null }[];
  milestonesUnlocked: number;
  totalAchievements: number;
  unlockedCount: number;
  streakDays: number;
  isEmpty: boolean;
};

/** Phase J */
export type JourneySummary = {
  currentLevel: string | null;
  completedLevels: number;
  totalLevels: number;
  currentMilestone: string | null;
  nextMilestone: string | null;
  completionPercent: number | null;
  isEmpty: boolean;
};

/** Phase K — deterministic recommendations from existing data */
export type NextStepRecommendation = {
  id: string;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
};

export type NextStepsSummary = {
  steps: NextStepRecommendation[];
  isEmpty: boolean;
};

export type StudentProgressReportViewModel = {
  snapshot: ParentProgressSnapshot;
  learning: LearningProgressSummary;
  mockPerformance: MockPerformanceSummary;
  writing: WritingProgressSummary;
  speaking: SpeakingProgressSummary;
  skills: ParentSkillSummary;
  achievements: AchievementSummary;
  journey: JourneySummary;
  nextSteps: NextStepsSummary;
  /** False only when literally no portfolio data — PDF still renders guidance */
  hasAnyProgress: boolean;
};

export type ReportExportVariant = "snapshot" | "full";
