export const APP_NAME = "CAMBA";

export const COLORS = {
  primary: "#2563EB",
  accent: "#10B981",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
} as const;

export const ROLES = {
  STUDENT: "student",
  PARENT: "parent",
  TEACHER: "teacher",
  ADMIN: "admin",
} as const;

export type RoleName = (typeof ROLES)[keyof typeof ROLES];

export const MASTERY_LEVELS = {
  NOT_STARTED: 0,
  BEGINNER: 1,
  DEVELOPING: 2,
  PROFICIENT: 3,
  MASTERED: 4,
} as const;

export const MASTERY_UNLOCK_THRESHOLD = MASTERY_LEVELS.PROFICIENT;

export const EXERCISE_TYPES = [
  "multiple_choice",
  "multi_select",
  "matching",
  "drag_drop",
  "gap_fill",
  "sentence_ordering",
  "listening",
  "reading_comprehension",
  "image_selection",
  "writing",
  "speaking",
  "interactive",
] as const;

export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const LEAGUE_TIERS = [
  "bronze",
  "silver",
  "gold",
  "platinum",
  "diamond",
  "master",
  "grandmaster",
  "champion",
] as const;

export const DEFAULT_LOCALE = "vi";

export const SUPPORTED_LOCALES = ["vi", "en", "zh", "ja", "ko"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
