/**
 * Canonical CAMBA typography scale.
 * Maps semantic roles to existing CSS utility classes (typography.css).
 * Use these helpers in new code; migrate legacy pages gradually in U8.2+.
 */

export type TypographyRole =
  | "display"
  | "pageTitle"
  | "sectionTitle"
  | "cardTitle"
  | "body"
  | "caption"
  | "stat"
  | "status";

/** CSS class for each semantic typography role */
export const TYPOGRAPHY_CLASS: Record<TypographyRole, string> = {
  display: "camba-display",
  pageTitle: "camba-display",
  sectionTitle: "camba-h3",
  cardTitle: "camba-h3",
  body: "camba-body",
  caption: "camba-caption",
  stat: "camba-stat",
  status: "camba-caption font-semibold",
};

/** HTML element recommendation per role (for accessible heading hierarchy) */
export const TYPOGRAPHY_ELEMENT: Record<TypographyRole, keyof HTMLElementTagNameMap> = {
  display: "h1",
  pageTitle: "h1",
  sectionTitle: "h2",
  cardTitle: "h3",
  body: "p",
  caption: "p",
  stat: "p",
  status: "span",
};

/** CSS custom properties backing the scale (read-only reference) */
export const TYPOGRAPHY_TOKENS = {
  display: { size: "2rem", weight: 800, lineHeight: 1.15 },
  h1: { size: "1.5rem", weight: 700, lineHeight: 1.25 },
  h2: { size: "1.25rem", weight: 700, lineHeight: 1.3 },
  h3: { size: "1.125rem", weight: 600, lineHeight: 1.35 },
  body: { size: "0.9375rem", weight: 400, lineHeight: 1.5 },
  caption: { size: "0.8125rem", weight: 500, lineHeight: 1.4 },
  stat: { size: "1.75rem", weight: 800, lineHeight: 1.1 },
} as const;

/** Known legacy patterns — prefer TYPOGRAPHY_CLASS instead (U8.1 audit) */
export const DEPRECATED_TYPOGRAPHY_PATTERNS = [
  "text-2xl font-bold text-gray-900",
  "text-xl sm:text-2xl",
  "camba-display text-xl sm:text-2xl",
  "camba-h2 for empty-state titles (use sectionTitle/cardTitle consistently)",
] as const;

export function typographyClass(role: TypographyRole): string {
  return TYPOGRAPHY_CLASS[role];
}
