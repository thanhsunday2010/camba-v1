import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import type { JourneyMilestone, JourneyProgressSummary } from "@/lib/learning/journey/learning-journey-types";
import type { MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import type { MockCenterReadiness } from "@/lib/mock-tests/mock-center-utils";
import type { NextLessonContext } from "@/lib/queries/dashboard";

export type PortfolioShareSnapshot = {
  studentName: string;
  levelName: string | null;
  cefrEstimate: string | null;
  lessonsCompleted: number;
  mocksCompleted: number;
  achievementsUnlocked: number;
  certificationsCount: number;
  generatedAt: string;
};

export type StudentProfileIdentity = {
  name: string;
  email: string;
  avatarUrl: string | null;
  joinDate: string | null;
  profileCompletionPercent: number;
};

export type StudentProfileHero = {
  levelName: string | null;
  programName: string | null;
  programSlug: string | null;
  cefrEstimate: string | null;
  totalXp: number;
  level: number;
  levelProgressPercent: number;
  currentStreak: number;
  bestStreak: number;
};

export type CambridgeSnapshot = {
  levelName: string | null;
  cefrEstimate: string | null;
  unitsCompleted: number;
  mocksCompleted: number;
  writingTasksCompleted: number;
  speakingTasksCompleted: number;
  certificationsEarned: number;
  achievementsUnlocked: number;
  hasProgram: boolean;
};

export type LearningProgressPortfolio = {
  currentUnitTitle: string | null;
  currentLessonTitle: string | null;
  unitsCompleted: number;
  lessonsCompleted: number;
  progressPercent: number;
  nextMilestoneTitle: string | null;
  journeyHref: string;
  hasProgress: boolean;
};

export type MockPerformanceRecent = {
  mockTitle: string;
  scorePercent: number;
  completedAt: string;
  detailHref: string;
};

export type MockPerformancePortfolio = {
  mocksCompleted: number;
  bestScorePercent: number | null;
  latestScorePercent: number | null;
  recommendedMock: MockTestHubSummary | null;
  readiness: MockCenterReadiness;
  recentResults: MockPerformanceRecent[];
  trendLabel: "improving" | "stable" | "building" | null;
  hasMocks: boolean;
};

export type WritingGrowthItem = {
  id: string;
  completedAt: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
};

export type WritingGrowthPortfolio = {
  tasksCompleted: number;
  averageScore: number | null;
  topStrengths: string[];
  improvementAreas: string[];
  recentItems: WritingGrowthItem[];
  trendLabel: "improving" | "stable" | "building" | null;
  hasHistory: boolean;
};

export type SpeakingGrowthItem = {
  id: string;
  completedAt: string;
  overallScore: number;
  pronunciationScore: number | null;
  fluencyScore: number | null;
  vocabularyScore: number | null;
};

export type SpeakingGrowthPortfolio = {
  tasksCompleted: number;
  averageScore: number | null;
  pronunciationAvg: number | null;
  fluencyAvg: number | null;
  vocabularyAvg: number | null;
  recentItems: SpeakingGrowthItem[];
  trendLabel: "improving" | "stable" | "building" | null;
  hasHistory: boolean;
};

export type CertificationEntry = {
  id: string;
  title: string;
  subtitle: string;
  kind: "gold-mock" | "level-complete" | "achievement";
  earnedAt: string | null;
  href: string | null;
};

export type CertificationPortfolio = {
  entries: CertificationEntry[];
  goldMocksCompleted: number;
  hasCertifications: boolean;
};

export type AchievementPortfolioSlice = {
  recentUnlocked: EvaluatedAchievement[];
  rareUnlocked: EvaluatedAchievement[];
  nextAchievement: EvaluatedAchievement | null;
  unlockedCount: number;
  totalCount: number;
};

export type JourneyProgressPortfolio = {
  summary: JourneyProgressSummary | null;
  milestones: JourneyMilestone[];
  completedLevelCount: number;
  totalLevelCount: number;
  currentMilestoneTitle: string | null;
  nextMilestoneTitle: string | null;
  journeyHref: string;
  hasJourney: boolean;
};

export type FutureGoalKind =
  | "level"
  | "mock"
  | "writing"
  | "speaking"
  | "achievement"
  | "streak";

export type FutureGoal = {
  id: string;
  kind: FutureGoalKind;
  titleKey: string;
  descriptionKey: string;
  href: string;
  progressPercent: number;
};

export type StudentPortfolioViewModel = {
  identity: StudentProfileIdentity;
  hero: StudentProfileHero;
  snapshot: CambridgeSnapshot;
  learning: LearningProgressPortfolio;
  mockPerformance: MockPerformancePortfolio;
  writing: WritingGrowthPortfolio;
  speaking: SpeakingGrowthPortfolio;
  certifications: CertificationPortfolio;
  achievements: AchievementPortfolioSlice;
  journey: JourneyProgressPortfolio;
  futureGoals: FutureGoal[];
  shareReady: PortfolioShareSnapshot;
};

export type ProfileNextLessonContext = NextLessonContext | null;
