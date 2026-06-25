/**
 * U8.2 — CAMBA motion design principles (report-only constants).
 */

export type MotionCategory =
  | "navigation"
  | "stateChange"
  | "progress"
  | "celebration"
  | "feedback";

export const MOTION_CATEGORIES: Record<
  MotionCategory,
  { purpose: string; examples: string[]; maxDurationMs: number }
> = {
  navigation: {
    purpose: "Orient the student when moving between major surfaces.",
    examples: ["Page fade-in", "Section stagger on load"],
    maxDurationMs: 300,
  },
  stateChange: {
    purpose: "Confirm UI state updates without surprise.",
    examples: ["Card hover lift", "Filter chip selection", "Tab switch"],
    maxDurationMs: 250,
  },
  progress: {
    purpose: "Make advancement tangible.",
    examples: ["Progress bar fill", "Counter tick-up", "Journey completion %"],
    maxDurationMs: 400,
  },
  celebration: {
    purpose: "Reward meaningful milestones — sparingly.",
    examples: ["Achievement unlock", "Mock complete header", "Badge reveal"],
    maxDurationMs: 600,
  },
  feedback: {
    purpose: "Acknowledge actions immediately.",
    examples: ["XP burst", "Toast complement", "Score reveal"],
    maxDurationMs: 400,
  },
};

export const MOTION_ALLOWED = [
  "Transform (translate, scale)",
  "Opacity",
  "Progress bar scaleX",
  "SVG stroke-dashoffset",
  "Skeleton shimmer (opacity only)",
] as const;

export const MOTION_FORBIDDEN = [
  "Width/height animation on large containers",
  "Autoplay looping celebrations on dashboard load",
  "Confetti or particle spam",
  "Bouncing spring on every card",
  "Motion on long virtualized lists",
  "Blocking route transitions > 400ms",
  "Game-style screen shake",
] as const;

export const MOTION_SCALE_GUIDELINES = {
  subtle: { from: 0.98, to: 1, use: "Sections, cards on enter" },
  emphasis: { from: 0.92, to: 1, use: "Badges, achievements, certification reveal" },
  micro: { from: 1, to: 1.02, use: "Hover on primary CTA only" },
  forbidden: { from: 0.5, to: 1.2, use: "Never — feels game-like" },
} as const;

export const MOTION_EASING_GUIDELINES = {
  out: "Decelerate — enter animations, content reveal",
  spring: "Slight overshoot — celebration only, max 600ms",
  linear: "Shimmer and infinite pulses only",
} as const;
