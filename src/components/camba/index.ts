// Theme & layout
export { CambridgeProgramTheme } from "./cambridge-program-theme";
export {
  StudentPageShell,
  ContentSection,
  StudentDashboardLayout,
} from "./layout/student-shell";

// Headers
export { PageHeader } from "./page-header";
export { SectionHeader } from "./section-header";

// Primitives
export { CambaCard } from "./primitives/camba-card";
export { StatusChip } from "./status-chip";
export {
  LessonStatusPill,
  MasteryBadge,
  LevelBadge,
  CoinChip,
  FilterChip,
  ProgressPill,
} from "./primitives/lesson-status-pill";
export { ProgressRing } from "./progress-ring";
export { AppTabs, InfoTooltip } from "./primitives/app-tabs";

// Cards
export { HeroCard } from "./cards/hero-card";
export { StudentHeroCard } from "./student-hero-card";
export { ContinueLearningCard } from "./continue-learning-card";
export { StatCard, ProgressCard, AchievementCard } from "./cards/stat-progress-cards";
export {
  MissionCard,
  RewardSummaryCard,
  RecommendationCard,
  EmptyStateCard,
} from "./cards/mission-reward-cards";
export { LessonCard, UnitCard, SkillCard, MockTestCard } from "./cards/learning-cards";

// Gamification
export { XPBar } from "./xp-bar";
export { BadgeCard, StreakCard } from "./gamification/badge-streak-cards";

// Cambridge
export { CambridgeShield } from "./cambridge-shield";
export { ProgramBadge } from "./cambridge/program-badge";
export {
  CambridgeShieldCard,
  SkillShieldProgress,
  ProgressSegmentBar,
  MasteryMeter,
} from "./cambridge/shield-progress";

// Feedback
export {
  FeedbackBanner,
  CelebrationBanner,
  MasteryUnlockedBanner,
  MissionCompletedBanner,
} from "./feedback/banners";
export { SkeletonCard, SkeletonList, DashboardSkeleton } from "./feedback/skeletons";
export { EmptyStateIllustrated } from "./empty-state-illustrated";
export { EmptyIllustratedState } from "./feedback/empty-state";

// Celebration
export {
  CelebrationProvider,
  useCelebration,
  useCelebrationOptional,
} from "./celebration/celebration-provider";
export { LevelUpModal } from "./celebration/level-up-modal";
export { BadgeUnlockModal } from "./celebration/badge-unlock-modal";

// Design tokens (re-export for page authors)
export {
  CAMBRIDGE_PROGRAM_THEMES,
  getProgramTheme,
  getUiDensity,
  normalizeProgramSlug,
} from "@/lib/design/cambridge-programs";
export {
  LESSON_STATE_STYLES,
  MASTERY_LEVEL_STYLES,
  type LessonVisualState,
  type MasteryLevel,
} from "@/lib/design/status-tokens";
export { cambaCardVariants, bannerVariants } from "@/lib/design/card-variants";
