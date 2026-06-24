export type AchievementCategory =
  | "learning"
  | "assessment"
  | "writing"
  | "speaking"
  | "consistency"
  | "journey"
  | "certification";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export type AchievementDefinitionStatus = "active" | "hidden";

export type AchievementCriterionType =
  | "lessons_completed"
  | "units_completed"
  | "mocks_completed"
  | "distinct_mocks_completed"
  | "gold_mocks_completed"
  | "writing_submissions"
  | "speaking_submissions"
  | "streak_days"
  | "level_completion_percent"
  | "mock_score_percent"
  | "badge_slug";

export type AchievementCriterion = {
  type: AchievementCriterionType;
  target: number;
  levelSlug?: string;
  badgeSlug?: string;
};

export type AchievementDefinition = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  category: AchievementCategory;
  icon: AchievementIconName;
  rarity: AchievementRarity;
  criteria: AchievementCriterion;
  sortOrder: number;
  status: AchievementDefinitionStatus;
  relatedAchievementId?: string;
};

export type AchievementIconName =
  | "book-open"
  | "map"
  | "flame"
  | "clipboard-list"
  | "trophy"
  | "award"
  | "pen-line"
  | "mic"
  | "sparkles"
  | "star"
  | "target"
  | "graduation-cap";

export type StudentAchievementContext = {
  lessonsCompleted: number;
  unitsCompleted: number;
  mocksCompleted: number;
  distinctMocksCompleted: number;
  goldMocksCompleted: number;
  writingSubmissions: number;
  speakingSubmissions: number;
  currentStreak: number;
  bestStreak: number;
  maxMockScorePercent: number;
  levelCompletionPercent: Record<string, number>;
  badgeSlugs: Record<string, string>;
};

export type EvaluatedAchievement = {
  id: string;
  category: AchievementCategory;
  icon: AchievementIconName;
  rarity: AchievementRarity;
  titleKey: string;
  descriptionKey: string;
  unlocked: boolean;
  unlockedAt: string | null;
  progressCurrent: number;
  progressTarget: number;
  progressPercent: number;
  relatedAchievementId?: string;
  sortOrder: number;
};

export type AchievementViewModel = {
  achievements: EvaluatedAchievement[];
  unlocked: EvaluatedAchievement[];
  locked: EvaluatedAchievement[];
  recentUnlocked: EvaluatedAchievement[];
  nextAchievement: EvaluatedAchievement | null;
  unlockedCount: number;
  totalCount: number;
  byCategory: Record<AchievementCategory, EvaluatedAchievement[]>;
};
