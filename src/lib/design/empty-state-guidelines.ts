/**
 * U8.3 — Empty state design principles.
 * Every student-facing empty state must educate, motivate, and guide action.
 */

export type EmptyStateSeverity = "critical" | "moderate" | "minor";

export type EmptyStateCategory =
  | "learning"
  | "mockTests"
  | "writing"
  | "speaking"
  | "journey"
  | "achievements"
  | "profile"
  | "analytics"
  | "portfolio"
  | "certifications"
  | "search"
  | "filters"
  | "errorRecovery";

/** Required fields for every empty state. */
export interface EmptyStateContent {
  title: string;
  explanation: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

/** Copy patterns that must never appear in student-facing UI. */
export const FORBIDDEN_EMPTY_STATE_PHRASES = [
  "no data",
  "no records",
  "nothing here",
  "nothing to display",
  "empty",
  "null",
  "undefined",
  "404",
  "failed to load",
  "error loading",
  "database",
  "metadata tags",
  "insufficient tags",
] as const;

/** Approved primary CTA verbs for Cambridge learning surfaces. */
export const APPROVED_EMPTY_STATE_CTAS = [
  "Start learning",
  "Continue learning",
  "Take a mock test",
  "Submit writing",
  "Practice speaking",
  "View journey",
  "Browse mock tests",
  "Explore achievements",
  "View portfolio",
  "Reset filters",
  "Try again",
] as const;

export const EMPTY_STATE_RULES = {
  mustInclude: [
    "Title — student-friendly, Cambridge-themed",
    "Explanation — what the feature is, why it matters, how to start",
    "Primary action — direct path to meaningful next step",
    "Visual support — icon or Cambridge-themed accent (not generic clip art)",
  ] as const,
  optional: [
    "Secondary action — alternative path (e.g. reset filters, browse all)",
    "Compact inline variant for cards and side panels",
  ] as const,
  neverShow: [
    "Technical or developer language",
    "Database-style wording",
    "Raw system states without guidance",
    "Dead-end screens with no CTA when action is possible",
  ] as const,
  differentiate: {
    empty:
      "No user content yet — explain feature value and guide first action",
    error:
      "Request or load failed — explain briefly, offer retry or support path",
    loading:
      "Data is fetching — skeleton or spinner, never empty-state copy",
  } as const,
} as const;

/** Visual language for Cambridge-themed empty states. */
export const EMPTY_STATE_VISUAL_PRINCIPLES = {
  themes: ["pathway", "progress", "growth", "achievement", "learning"] as const,
  avoid: ["generic illustration packs", "cartoon overload", "gaming aesthetics"] as const,
  tone: "educational and premium",
} as const;

/** Accessibility requirements for all empty state components. */
export const EMPTY_STATE_A11Y = {
  role: "status" as const,
  headingLevel: "h3" as const,
  requirements: [
    "Semantic heading for title",
    "Visible focus ring on interactive CTAs",
    "Meaningful aria-label when icon is decorative only",
    "No information conveyed by visuals alone",
  ] as const,
};
