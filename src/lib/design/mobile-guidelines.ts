/**
 * U8.4 — Mobile-first design principles for CAMBA student surfaces.
 */

export type MobileBreakpoint = 320 | 360 | 375 | 390 | 430 | 768 | 1024;

export const MOBILE_BREAKPOINTS = {
  /** Small phones */
  xs: 320,
  sm: 360,
  /** Standard phones */
  phone: 375,
  phoneLg: 390,
  phoneXl: 430,
  /** Tablet */
  tablet: 768,
  /** Desktop enhancement */
  desktop: 1024,
} as const;

/** WCAG / Apple HIG minimum interactive target. Matches --touch-target-min. */
export const MOBILE_TOUCH_TARGET_MIN_PX = 44;

export const MOBILE_SPACING = {
  pagePaddingX: "var(--space-page-x)",
  pagePaddingY: "var(--space-page-y-mobile, var(--space-page-y))",
  sectionGap: "var(--space-section-mobile, var(--space-section))",
  cardPadding: "var(--space-card)",
  safeAreaBottom: "env(safe-area-inset-bottom, 0px)",
  safeAreaTop: "env(safe-area-inset-top, 0px)",
} as const;

export const MOBILE_TYPOGRAPHY_RULES = {
  /** Prevent iOS input zoom — form controls must be ≥16px */
  inputMinFontSize: "1rem",
  /** Body text remains readable without zoom at 320px */
  bodyMinSize: "0.9375rem",
  /** Display scales down on narrow viewports via CSS tokens */
  displayResponsive: true,
  /** Avoid text smaller than 12px on mobile */
  captionFloor: "0.75rem",
} as const;

export const MOBILE_LAYOUT_RULES = {
  /** Default to single column; add columns at sm/md/lg */
  columnStrategy: "single-column-first",
  /** Cards stack vertically unless horizontal scroll is intentional */
  cardStacking: "vertical-by-default",
  /** Use min-w-0 on flex children to prevent overflow */
  flexOverflow: "min-w-0 on flex children",
  /** Horizontal scroll only for chip rails and carousels */
  horizontalScroll: "intentional-only",
  /** Sticky headers use safe-area-top */
  stickyHeaders: "safe-area-aware",
} as const;

export const MOBILE_BOTTOM_ACTION_PATTERN = {
  /** High-stakes flows (mock take, lesson player) use sticky bottom bar on mobile */
  surfaces: ["mock-take", "lesson-exercise", "speaking-record"],
  className: "camba-mobile-action-bar",
  /** Reserve space so content is not hidden behind bar */
  contentPaddingClass: "camba-mobile-action-spacer",
} as const;

export const MOBILE_FORM_RULES = {
  inputClass: "camba-input-mobile",
  textareaScrollMargin: "scroll-mb-24",
  submitVisibility: "never hidden behind keyboard",
  viewport: "avoid layout jump on focus",
} as const;

export const MOBILE_NAV_RULES = {
  primaryNav: "hamburger + drawer below md",
  touchTarget: "min-h-[var(--touch-target-min)] on mobile nav links",
  backNavigation: "breadcrumb or explicit back link on take/detail flows",
} as const;

export const MOBILE_FORBIDDEN = [
  "fixed pixel widths on content containers",
  "multi-column grids without mobile fallback",
  "touch targets under 44px for primary actions",
  "horizontal page scroll",
  "font-size below 16px on inputs (iOS zoom)",
  "desktop-only sidebars without mobile alternative",
] as const;

export const MOBILE_PERFORMANCE_TARGETS = {
  scrollFps: 60,
  avoidLayoutShift: "reserve space for async content",
  listVirtualization: "future — large achievement grids",
  motionReduced: "respect prefers-reduced-motion (U8.2)",
} as const;

export const MOBILE_A11Y = {
  touchTargetMin: MOBILE_TOUCH_TARGET_MIN_PX,
  contrast: "WCAG AA on mobile outdoors",
  focusVisible: "camba-focus-ring on all interactive elements",
  screenReader: "semantic headings and aria on carousels",
} as const;
