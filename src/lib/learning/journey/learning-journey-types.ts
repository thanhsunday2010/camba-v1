import type { UnitVisualState } from "@/lib/learning/path-ui-utils";
import type { MockTestDisplayState } from "@/lib/mock-tests/mock-test-types";
import type { CambridgeProgramSlug } from "@/lib/design/cambridge-programs";

export type JourneyLevelStatus =
  | "completed"
  | "current"
  | "in-progress"
  | "upcoming"
  | "not-started";

export type JourneyUnitStatus = "completed" | "current" | "locked" | "upcoming";

export type JourneyMilestoneKind =
  | "level-complete"
  | "first-writing-exam"
  | "first-speaking-exam"
  | "first-gold-mock"
  | "ket-ready"
  | "pet-ready";

export type JourneyReadinessBand = "building" | "developing" | "approaching" | "ready";

export type JourneyLesson = {
  id: string;
  title: string;
  completionPercent: number;
  isUnlocked: boolean;
  isCurrent: boolean;
  href: string;
};

export type JourneyUnit = {
  slug: string;
  title: string;
  unitNumber: number;
  status: JourneyUnitStatus;
  visualState: UnitVisualState;
  completionPercent: number;
  completedLessonCount: number;
  totalLessonCount: number;
  lessons: JourneyLesson[];
  sortOrder: number;
};

export type JourneyMock = {
  id: string;
  title: string;
  levelSlug: string | null;
  displayState: MockTestDisplayState;
  isGoldMock: boolean;
  isRecommended: boolean;
  includesWriting: boolean;
  includesSpeaking: boolean;
  bestScorePercent: number | null;
  href: string;
};

export type JourneyMilestone = {
  id: string;
  kind: JourneyMilestoneKind;
  titleKey: string;
  descriptionKey: string;
  achieved: boolean;
  achievedAt: string | null;
  levelSlug: CambridgeProgramSlug | null;
  href?: string;
};

export type JourneyLevel = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  status: JourneyLevelStatus;
  completionPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  mocksCompleted: number;
  totalMocks: number;
  writingProgressPercent: number;
  speakingProgressPercent: number;
  cefr: string | null;
  units: JourneyUnit[];
  mocks: JourneyMock[];
  isCurrent: boolean;
};

export type JourneyProgressSummary = {
  programName: string;
  programSlug: string;
  currentLevelName: string | null;
  currentLevelSlug: string | null;
  currentUnitTitle: string | null;
  completionPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  mocksCompleted: number;
  totalMocks: number;
  totalXp: number;
  readinessBand: JourneyReadinessBand;
  readinessPercent: number;
  nextMilestoneTitle: string | null;
};

export type JourneyPreview = {
  currentLevelName: string | null;
  currentUnitTitle: string | null;
  nextMilestoneTitle: string | null;
  completionPercent: number;
  href: string;
};

export type LearningJourneyViewModel = {
  programId: string;
  programName: string;
  programSlug: string;
  currentLevelId: string | null;
  levels: JourneyLevel[];
  milestones: JourneyMilestone[];
  summary: JourneyProgressSummary;
  hasLevelSelected: boolean;
  recommendedMockId: string | null;
  nextLessonId: string | null;
};
