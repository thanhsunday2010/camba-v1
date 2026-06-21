import { MASTERY_LEVELS } from "@/lib/constants";

export type LessonVisualState =
  | "locked"
  | "unlocked"
  | "in-progress"
  | "completed"
  | "mastered"
  | "recommended"
  | "needs-review";

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;

export const LESSON_STATE_STYLES: Record<
  LessonVisualState,
  { bg: string; text: string; border: string }
> = {
  locked: {
    bg: "bg-[var(--surface-sunken)]",
    text: "text-[var(--status-locked)]",
    border: "border-[var(--status-locked)]/20",
  },
  unlocked: {
    bg: "bg-program-muted",
    text: "text-program",
    border: "border-program/25",
  },
  "in-progress": {
    bg: "bg-blue-50",
    text: "text-[var(--status-in-progress)]",
    border: "border-[var(--status-in-progress)]/25",
  },
  completed: {
    bg: "bg-success/10",
    text: "text-success",
    border: "border-success/25",
  },
  mastered: {
    bg: "bg-success/15",
    text: "text-success",
    border: "border-success/35",
  },
  recommended: {
    bg: "bg-violet-50",
    text: "text-[var(--status-recommended)]",
    border: "border-[var(--status-recommended)]/30",
  },
  "needs-review": {
    bg: "bg-orange-50",
    text: "text-[var(--status-needs-review)]",
    border: "border-[var(--status-needs-review)]/30",
  },
};

export const MASTERY_LEVEL_STYLES: Record<
  MasteryLevel,
  { color: string; bg: string; labelKey: string }
> = {
  [MASTERY_LEVELS.NOT_STARTED]: {
    color: "text-[var(--status-locked)]",
    bg: "bg-[var(--surface-sunken)]",
    labelKey: "notStarted",
  },
  [MASTERY_LEVELS.BEGINNER]: {
    color: "text-[var(--status-mastery-1)]",
    bg: "bg-red-50",
    labelKey: "beginner",
  },
  [MASTERY_LEVELS.DEVELOPING]: {
    color: "text-[var(--status-mastery-2)]",
    bg: "bg-amber-50",
    labelKey: "developing",
  },
  [MASTERY_LEVELS.PROFICIENT]: {
    color: "text-[var(--status-mastery-3)]",
    bg: "bg-blue-50",
    labelKey: "proficient",
  },
  [MASTERY_LEVELS.MASTERED]: {
    color: "text-[var(--status-mastery-4)]",
    bg: "bg-green-50",
    labelKey: "mastered",
  },
};

export function masteryFromPercent(completion: number, accuracy: number): MasteryLevel {
  if (completion < 100) {
    if (completion === 0) return 0;
    if (accuracy >= 80) return 2;
    return 1;
  }
  if (accuracy >= 90) return 4;
  if (accuracy >= 75) return 3;
  if (accuracy >= 60) return 2;
  return 1;
}
