/**
 * U8.1 Component inventory — canonical vs legacy vs duplicate.
 * Used by design-system-report and migration planning.
 */

export type ComponentStatus =
  | "canonical"
  | "preferred-u7"
  | "preferred-u8"
  | "legacy"
  | "legacy-wrapper"
  | "duplicate"
  | "internal"
  | "showcase-only";

export type ComponentEntry = {
  path: string;
  name: string;
  status: ComponentStatus;
  surface: string;
  notes?: string;
};

export const CAMBA_PRIMITIVES: ComponentEntry[] = [
  { path: "src/components/camba/primitives/camba-card.tsx", name: "CambaCard", status: "canonical", surface: "Global" },
  { path: "src/components/camba/section-header.tsx", name: "SectionHeader", status: "canonical", surface: "U7 sections" },
  { path: "src/components/camba/page-header.tsx", name: "PageHeader", status: "canonical", surface: "Global", notes: "Underused vs custom U7 headers" },
  { path: "src/components/camba/layout/student-shell.tsx", name: "StudentPageShell", status: "canonical", surface: "All dashboard routes" },
  { path: "src/components/camba/primitives/lesson-status-pill.tsx", name: "LessonStatusPill", status: "canonical", surface: "Learning, mocks" },
  { path: "src/components/camba/status-chip.tsx", name: "StatusChip", status: "legacy", surface: "Pre-U7", notes: "Superseded by LessonStatusPill in most flows" },
  { path: "src/components/camba/feedback/skeletons.tsx", name: "DashboardSkeleton", status: "canonical", surface: "Loading" },
  { path: "src/components/camba/design-system-showcase.tsx", name: "DesignSystemShowcase", status: "showcase-only", surface: "/design-system" },
];

export const DASHBOARD_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/dashboard/student-dashboard-view.tsx", name: "StudentDashboardView", status: "preferred-u7", surface: "Dashboard" },
  { path: "src/components/dashboard/dashboard-hero.tsx", name: "DashboardHero", status: "preferred-u7", surface: "Dashboard" },
  { path: "src/components/camba/empty-states/", name: "Camba Empty States (U8.3)", status: "preferred-u8", surface: "Empty states (canonical)" },
  { path: "src/components/dashboard/dashboard-empty-state.tsx", name: "DashboardEmptyState", status: "legacy-wrapper", surface: "Empty states — wraps FeatureEmptyState" },
  { path: "src/components/dashboard/dashboard-daily-mission-card.tsx", name: "DashboardDailyMissionCard", status: "preferred-u7", surface: "Dashboard" },
  { path: "src/components/dashboard/dashboard-continue-learning-card.tsx", name: "DashboardContinueLearningCard", status: "preferred-u7", surface: "Dashboard" },
  { path: "src/components/dashboard/dashboard-achievements-section.tsx", name: "DashboardAchievementsSection", status: "preferred-u7", surface: "Dashboard" },
  { path: "src/components/dashboard/achievement-section.tsx", name: "AchievementSection", status: "legacy", surface: "Dashboard", notes: "Replaced by dashboard-achievements-section" },
  { path: "src/components/dashboard/dashboard-achievement-strip.tsx", name: "DashboardAchievementStrip", status: "legacy", surface: "Dashboard", notes: "Not wired in U7.1 view" },
  { path: "src/components/dashboard/continue-learning-panel.tsx", name: "ContinueLearningPanel", status: "legacy", surface: "Dashboard" },
  { path: "src/components/dashboard/dashboard-missions.tsx", name: "DashboardMissions", status: "legacy", surface: "Dashboard" },
  { path: "src/components/dashboard/today-mission-section.tsx", name: "TodayMissionSection", status: "legacy", surface: "Dashboard" },
  { path: "src/components/dashboard/smart-recommendation-panel.tsx", name: "SmartRecommendationPanel", status: "legacy", surface: "Dashboard" },
  { path: "src/components/dashboard/mock-test-panel.tsx", name: "MockTestPanel", status: "legacy", surface: "Dashboard" },
  { path: "src/components/dashboard/program-progress-hero-card.tsx", name: "ProgramProgressHeroCard", status: "legacy", surface: "Dashboard" },
  { path: "src/components/dashboard/student-progress-overview.tsx", name: "StudentProgressOverview", status: "internal", surface: "Parent/Teacher", notes: "Uses gray-* typography" },
];

export const JOURNEY_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/journey/journey-view.tsx", name: "JourneyView", status: "preferred-u7", surface: "Journey" },
  { path: "src/components/journey/journey-progress-summary.tsx", name: "JourneyProgressSummary", status: "preferred-u7", surface: "Journey" },
  { path: "src/components/journey/journey-level-card.tsx", name: "JourneyLevelCard", status: "preferred-u7", surface: "Journey" },
  { path: "src/components/journey/journey-unit-roadmap.tsx", name: "JourneyUnitRoadmap", status: "preferred-u7", surface: "Journey" },
  { path: "src/components/journey/journey-mock-milestone.tsx", name: "JourneyMockMilestone", status: "preferred-u7", surface: "Journey" },
  { path: "src/components/journey/journey-milestone-section.tsx", name: "JourneyMilestoneSection", status: "preferred-u7", surface: "Journey" },
];

export const MOCK_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/mock-tests/mock-center-view.tsx", name: "MockCenterView", status: "preferred-u7", surface: "Mock Center" },
  { path: "src/components/mock-tests/premium-mock-card.tsx", name: "PremiumMockCard", status: "preferred-u7", surface: "Mock Center, Profile" },
  { path: "src/components/mock-tests/mock-test-card.tsx", name: "MockTestCard", status: "duplicate", surface: "Hub filters", notes: "Legacy list card" },
  { path: "src/components/camba/cards/learning-cards.tsx", name: "MockTestCard (camba)", status: "duplicate", surface: "Dashboard shortcut", notes: "Third mock card variant" },
  { path: "src/components/mock-tests/mock-test-hero.tsx", name: "MockTestHero", status: "preferred-u7", surface: "Mock detail" },
  { path: "src/components/mock-tests/mock-test-page-shell.tsx", name: "MockTestPageShell", status: "preferred-u7", surface: "Mock detail/take" },
  { path: "src/components/mock-tests/mock-test-hub-filters.tsx", name: "MockTestHubFilters", status: "legacy", surface: "Pre-U7.3 hub", notes: "Superseded by MockCenterView" },
];

export const ACHIEVEMENT_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/achievements/achievements-collection-view.tsx", name: "AchievementsCollectionView", status: "preferred-u7", surface: "Achievements" },
  { path: "src/components/achievements/achievement-card.tsx", name: "AchievementCard", status: "preferred-u7", surface: "Achievements" },
  { path: "src/components/achievements/achievement-showcase.tsx", name: "AchievementShowcase", status: "preferred-u7", surface: "Dashboard, Profile" },
  { path: "src/components/achievements/next-achievement-card.tsx", name: "NextAchievementCard", status: "preferred-u7", surface: "Dashboard, Profile, Mock" },
  { path: "src/components/achievements/achievement-icon.tsx", name: "AchievementRarityBadge", status: "preferred-u7", surface: "Achievements" },
];

export const PROFILE_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/profile/student-profile-view.tsx", name: "StudentProfileView", status: "preferred-u7", surface: "Profile" },
  { path: "src/components/profile/student-profile-hero.tsx", name: "StudentProfileHero", status: "preferred-u7", surface: "Profile" },
  { path: "src/components/profile/cambridge-snapshot-card.tsx", name: "CambridgeSnapshotCard", status: "preferred-u7", surface: "Profile" },
  { path: "src/components/profile/portfolio-link.tsx", name: "PortfolioLink", status: "preferred-u7", surface: "Cross-surface nav" },
];

export const LEARNING_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/learning/learning-path-view.tsx", name: "LearningPathView", status: "preferred-u7", surface: "Learning path" },
  { path: "src/components/learning/learning-path-hero.tsx", name: "LearningPathHero", status: "preferred-u7", surface: "Learning path" },
  { path: "src/components/camba/cards/learning-cards.tsx", name: "LessonCard", status: "canonical", surface: "Learning path" },
  { path: "src/components/learning/lesson/lesson-hero.tsx", name: "LessonHero", status: "preferred-u7", surface: "Lesson player" },
];

export const AI_COMPONENTS: ComponentEntry[] = [
  { path: "src/components/writing/writing-player.tsx", name: "WritingPlayer", status: "preferred-u7", surface: "Writing AI" },
  { path: "src/components/writing/writing-editor.tsx", name: "WritingEditor", status: "preferred-u7", surface: "Writing AI" },
  { path: "src/components/writing/writing-feedback-card.tsx", name: "WritingFeedbackCard", status: "preferred-u7", surface: "Writing AI" },
  { path: "src/components/speaking/speaking-player.tsx", name: "SpeakingPlayer", status: "preferred-u7", surface: "Speaking AI" },
  { path: "src/components/speaking/speaking-recorder.tsx", name: "SpeakingRecorder", status: "preferred-u7", surface: "Speaking AI" },
  { path: "src/components/speaking/speaking-feedback-card.tsx", name: "SpeakingFeedbackCard", status: "preferred-u7", surface: "Speaking AI" },
  { path: "src/components/mock-tests/mock-ai-skill-badges.tsx", name: "MockAiSkillBadges", status: "preferred-u7", surface: "Mock, Profile" },
];

export const ALL_INVENTORY: ComponentEntry[] = [
  ...CAMBA_PRIMITIVES,
  ...DASHBOARD_COMPONENTS,
  ...JOURNEY_COMPONENTS,
  ...MOCK_COMPONENTS,
  ...ACHIEVEMENT_COMPONENTS,
  ...PROFILE_COMPONENTS,
  ...LEARNING_COMPONENTS,
  ...AI_COMPONENTS,
];

export function inventoryByStatus(status: ComponentStatus): ComponentEntry[] {
  return ALL_INVENTORY.filter((c) => c.status === status);
}

export function inventoryBySurface(surface: string): ComponentEntry[] {
  return ALL_INVENTORY.filter((c) => c.surface.includes(surface));
}
