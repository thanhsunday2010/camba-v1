/**
 * U8.2 — Canonical motion durations (seconds for Framer Motion).
 * CSS mirror: src/styles/tokens/motion.css
 */

export const MOTION_DURATION = {
  /** Micro-interactions: hover feedback, chip toggle */
  fast: 0.15,
  /** Default UI transitions */
  normal: 0.25,
  /** Progress fills, section reveals */
  slow: 0.4,
  /** Achievement / mock completion moments */
  celebration: 0.6,
  /** Route-level page enter */
  page: 0.3,
  /** Dialog / modal enter */
  modal: 0.25,
  /** Alias for fast micro-interactions */
  microinteraction: 0.15,
} as const;

export type MotionDurationKey = keyof typeof MOTION_DURATION;

export const MOTION_EASE = {
  out: [0.22, 1, 0.36, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
};

export const MOTION_OFFSET = {
  sectionY: 12,
  cardY: 8,
  pageY: 16,
  xpRise: -48,
} as const;

export const MOTION_STAGGER = {
  section: 0.06,
  card: 0.04,
  list: 0.05,
} as const;

/** Map token keys to CSS custom properties */
export const MOTION_CSS_VARS = {
  fast: "--duration-fast",
  normal: "--duration-normal",
  slow: "--duration-slow",
} as const;
