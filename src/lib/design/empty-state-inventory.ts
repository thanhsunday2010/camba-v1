/**
 * U8.3 — Master empty-state inventory (single source of truth).
 * Maps surface IDs to category, severity, component, and i18n keys.
 */

import type { EmptyStateCategory, EmptyStateSeverity } from "@/lib/design/empty-state-guidelines";

export type EmptyStateComponent =
  | "FeatureEmptyState"
  | "LearningEmptyState"
  | "MockEmptyState"
  | "AchievementEmptyState"
  | "AnalyticsEmptyState"
  | "PortfolioEmptyState"
  | "ErrorRecoveryState"
  | "InlineEmptyState";

export interface EmptyStateInventoryEntry {
  id: string;
  category: EmptyStateCategory;
  severity: EmptyStateSeverity;
  surface: string;
  component: EmptyStateComponent;
  i18nNamespace: string;
  titleKey: string;
  descriptionKey: string;
  primaryActionKey?: string;
  secondaryActionKey?: string;
  notes?: string;
}

export const EMPTY_STATE_INVENTORY: EmptyStateInventoryEntry[] = [
  // Dashboard
  {
    id: "dashboard.daily-mission",
    category: "learning",
    severity: "moderate",
    surface: "Dashboard — daily mission",
    component: "FeatureEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "dailyMissionEmpty",
    descriptionKey: "dailyMissionEmptyDesc",
    primaryActionKey: "startLearning",
  },
  {
    id: "dashboard.continue-learning",
    category: "learning",
    severity: "critical",
    surface: "Dashboard — continue learning",
    component: "LearningEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "continueEmptyTitle",
    descriptionKey: "continueEmptyDesc",
    primaryActionKey: "startLearning",
  },
  {
    id: "dashboard.mock-tests",
    category: "mockTests",
    severity: "critical",
    surface: "Dashboard — mock test shortcut",
    component: "MockEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "mockTestsEmpty",
    descriptionKey: "mockTestsEmptyDesc",
    primaryActionKey: "startMockTest",
  },
  {
    id: "dashboard.achievements-showcase",
    category: "achievements",
    severity: "moderate",
    surface: "Dashboard — achievement showcase",
    component: "AchievementEmptyState",
    i18nNamespace: "achievements",
    titleKey: "showcaseEmptyTitle",
    descriptionKey: "showcaseEmptyDescription",
    primaryActionKey: "showcaseEmptyAction",
  },
  {
    id: "dashboard.achievements-next",
    category: "achievements",
    severity: "minor",
    surface: "Dashboard — next achievement",
    component: "AchievementEmptyState",
    i18nNamespace: "achievements",
    titleKey: "nextEmptyTitle",
    descriptionKey: "nextEmptyDescription",
    primaryActionKey: "showcaseEmptyAction",
  },
  {
    id: "dashboard.skill-insights",
    category: "analytics",
    severity: "moderate",
    surface: "Dashboard — skill insights",
    component: "AnalyticsEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "skillInsightsEmpty",
    descriptionKey: "skillInsightsEmptyDesc",
    primaryActionKey: "skillProgressEmptyAction",
  },
  {
    id: "dashboard.recent-activity",
    category: "profile",
    severity: "moderate",
    surface: "Dashboard — recent activity",
    component: "FeatureEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "recentActivityEmpty",
    descriptionKey: "recentActivityEmptyDesc",
    primaryActionKey: "startLearning",
  },
  {
    id: "dashboard.journey-preview",
    category: "journey",
    severity: "critical",
    surface: "Dashboard — journey preview",
    component: "FeatureEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "journeyPreviewEmptyTitle",
    descriptionKey: "journeyPreviewEmptyDesc",
    primaryActionKey: "journeyPreviewEmptyAction",
  },
  {
    id: "dashboard.missions",
    category: "learning",
    severity: "minor",
    surface: "Dashboard — missions list (legacy panel)",
    component: "FeatureEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "missionsEmpty",
    descriptionKey: "missionsEmptyDesc",
    primaryActionKey: "missionsEmptyAction",
  },
  {
    id: "dashboard.skill-progress",
    category: "learning",
    severity: "moderate",
    surface: "Dashboard — skill progress",
    component: "LearningEmptyState",
    i18nNamespace: "dashboard",
    titleKey: "skillProgressEmpty",
    descriptionKey: "skillProgressEmptyDesc",
    primaryActionKey: "skillProgressEmptyAction",
  },
  // Learning
  {
    id: "learning.path-empty",
    category: "learning",
    severity: "critical",
    surface: "Learning path — no level selected",
    component: "LearningEmptyState",
    i18nNamespace: "learning",
    titleKey: "noLevelTitle",
    descriptionKey: "noLevelDesc",
  },
  {
    id: "learning.lesson-empty",
    category: "learning",
    severity: "moderate",
    surface: "Lesson — no exercises",
    component: "LearningEmptyState",
    i18nNamespace: "learning.lesson",
    titleKey: "emptyTitle",
    descriptionKey: "emptyDescription",
    primaryActionKey: "backToPath",
  },
  // Mock tests
  {
    id: "mock.hub-empty",
    category: "mockTests",
    severity: "critical",
    surface: "Mock center — no tests",
    component: "MockEmptyState",
    i18nNamespace: "mockTests.hub",
    titleKey: "emptyTitle",
    descriptionKey: "emptyDescription",
    primaryActionKey: "emptyAction",
    notes: "Hub-level empty when program has no mocks",
  },
  {
    id: "mock.hub-filter",
    category: "filters",
    severity: "minor",
    surface: "Mock center — filter no match",
    component: "MockEmptyState",
    i18nNamespace: "mockTests.hub",
    titleKey: "filterEmptyTitle",
    descriptionKey: "filterEmptyDescription",
    secondaryActionKey: "filterResetAction",
  },
  {
    id: "mock.gold-empty",
    category: "certifications",
    severity: "moderate",
    surface: "Mock center — Gold mocks",
    component: "MockEmptyState",
    i18nNamespace: "mockTests.center",
    titleKey: "goldEmptyTitle",
    descriptionKey: "goldEmptyDescription",
    primaryActionKey: "goldEmptyAction",
  },
  {
    id: "mock.readiness-empty",
    category: "analytics",
    severity: "moderate",
    surface: "Mock center — readiness",
    component: "MockEmptyState",
    i18nNamespace: "mockTests.center",
    titleKey: "readinessEmptyTitle",
    descriptionKey: "readinessEmptyDescription",
    primaryActionKey: "readinessEmptyAction",
  },
  {
    id: "mock.recent-empty",
    category: "mockTests",
    severity: "moderate",
    surface: "Mock center — recent results",
    component: "MockEmptyState",
    i18nNamespace: "mockTests.center",
    titleKey: "recentEmptyTitle",
    descriptionKey: "recentEmptyDescription",
    primaryActionKey: "recentEmptyAction",
  },
  {
    id: "mock.analytics-no-attempt",
    category: "analytics",
    severity: "moderate",
    surface: "Mock analytics — no attempt",
    component: "AnalyticsEmptyState",
    i18nNamespace: "mockTests.analytics",
    titleKey: "noAttemptTitle",
    descriptionKey: "noAttemptMessage",
    primaryActionKey: "noAttemptAction",
  },
  {
    id: "mock.analytics-insufficient",
    category: "analytics",
    severity: "moderate",
    surface: "Mock analytics — expanding tags",
    component: "AnalyticsEmptyState",
    i18nNamespace: "mockTests.analytics",
    titleKey: "insufficientMetadataTitle",
    descriptionKey: "insufficientMetadataMessage",
  },
  // Writing & Speaking
  {
    id: "profile.writing",
    category: "portfolio",
    severity: "critical",
    surface: "Portfolio — writing growth",
    component: "PortfolioEmptyState",
    i18nNamespace: "profile",
    titleKey: "writingEmptyTitle",
    descriptionKey: "writingEmptyDescription",
    primaryActionKey: "writingEmptyAction",
  },
  {
    id: "profile.speaking",
    category: "portfolio",
    severity: "critical",
    surface: "Portfolio — speaking growth",
    component: "PortfolioEmptyState",
    i18nNamespace: "profile",
    titleKey: "speakingEmptyTitle",
    descriptionKey: "speakingEmptyDescription",
    primaryActionKey: "speakingEmptyAction",
  },
  // Achievements
  {
    id: "achievements.collection",
    category: "achievements",
    severity: "moderate",
    surface: "Achievements — filter empty",
    component: "AchievementEmptyState",
    i18nNamespace: "achievements",
    titleKey: "emptyTitle",
    descriptionKey: "emptyDescription",
    primaryActionKey: "emptyAction",
    secondaryActionKey: "resetFiltersAction",
  },
  {
    id: "achievements.showcase",
    category: "achievements",
    severity: "critical",
    surface: "Achievements — no unlocked",
    component: "AchievementEmptyState",
    i18nNamespace: "achievements",
    titleKey: "showcaseEmptyTitle",
    descriptionKey: "showcaseEmptyDescription",
    primaryActionKey: "showcaseEmptyAction",
  },
  // Journey & Profile
  {
    id: "profile.learning",
    category: "portfolio",
    severity: "moderate",
    surface: "Portfolio — learning progress",
    component: "PortfolioEmptyState",
    i18nNamespace: "profile",
    titleKey: "learningEmptyTitle",
    descriptionKey: "learningEmptyDescription",
    primaryActionKey: "learningEmptyAction",
  },
  {
    id: "profile.mock",
    category: "portfolio",
    severity: "moderate",
    surface: "Portfolio — mock performance",
    component: "PortfolioEmptyState",
    i18nNamespace: "profile",
    titleKey: "mockEmptyTitle",
    descriptionKey: "mockEmptyDescription",
    primaryActionKey: "mockEmptyAction",
  },
  {
    id: "profile.certifications",
    category: "portfolio",
    severity: "moderate",
    surface: "Portfolio — certifications",
    component: "PortfolioEmptyState",
    i18nNamespace: "profile",
    titleKey: "certificationsEmptyTitle",
    descriptionKey: "certificationsEmptyDescription",
    primaryActionKey: "certificationsEmptyAction",
  },
  {
    id: "profile.journey",
    category: "portfolio",
    severity: "critical",
    surface: "Portfolio — journey progress",
    component: "PortfolioEmptyState",
    i18nNamespace: "profile",
    titleKey: "journeyEmptyTitle",
    descriptionKey: "journeyEmptyDescription",
    primaryActionKey: "journeyEmptyAction",
  },
  {
    id: "profile.goals",
    category: "portfolio",
    severity: "minor",
    surface: "Portfolio — future goals",
    component: "InlineEmptyState",
    i18nNamespace: "profile",
    titleKey: "goalsEmptyTitle",
    descriptionKey: "goalsEmptyDescription",
  },
  {
    id: "journey.mock-empty",
    category: "mockTests",
    severity: "moderate",
    surface: "Journey — mock milestone",
    component: "MockEmptyState",
    i18nNamespace: "journey",
    titleKey: "mockEmptyTitle",
    descriptionKey: "mockEmptyDescription",
    primaryActionKey: "mockEmptyAction",
  },
  // Error recovery
  {
    id: "error.generic",
    category: "errorRecovery",
    severity: "critical",
    surface: "Global — load failure",
    component: "ErrorRecoveryState",
    i18nNamespace: "common",
    titleKey: "errorRecoveryTitle",
    descriptionKey: "errorRecoveryDescription",
    primaryActionKey: "errorRecoveryRetry",
  },
];

export function inventoryByCategory(category: EmptyStateCategory): EmptyStateInventoryEntry[] {
  return EMPTY_STATE_INVENTORY.filter((e) => e.category === category);
}

export function inventoryBySeverity(severity: EmptyStateSeverity): EmptyStateInventoryEntry[] {
  return EMPTY_STATE_INVENTORY.filter((e) => e.severity === severity);
}

export function getEmptyStateEntry(id: string): EmptyStateInventoryEntry | undefined {
  return EMPTY_STATE_INVENTORY.find((e) => e.id === id);
}
