/**
 * U8.1 Design token audit — report-only, no runtime side effects.
 * Documents existing tokens, duplicates, magic numbers, and inconsistencies.
 */

export type AuditSeverity = "critical" | "high" | "medium" | "low";

export type TokenFinding = {
  id: string;
  category: "typography" | "spacing" | "color" | "elevation" | "radius" | "motion";
  severity: AuditSeverity;
  title: string;
  description: string;
  locations?: string[];
  recommendation: string;
};

export type DuplicatePattern = {
  id: string;
  patterns: string[];
  canonical: string;
  severity: AuditSeverity;
};

/** Token sources audited in U8.1 */
export const TOKEN_SOURCES = [
  "src/styles/tokens/colors.css",
  "src/styles/tokens/typography.css",
  "src/styles/tokens/spacing.css",
  "src/styles/tokens/shadows.css",
  "src/styles/tokens/radius.css",
  "src/styles/tokens/motion.css",
  "src/styles/tokens/cambridge-programs.css",
  "src/app/globals.css",
  "tailwind @theme inline (globals.css)",
  "src/lib/design/card-variants.ts",
  "src/lib/design/status-tokens.ts",
  "src/components/ui/button.tsx",
] as const;

export const SPACING_SCALE = {
  xs: "0.25rem (Tailwind 1) / --space-gap-sm 0.5rem",
  sm: "0.5rem / --space-gap-sm",
  md: "0.75rem / --space-gap-md",
  lg: "1rem / --space-gap-lg",
  xl: "1.5rem / --space-gap-xl / --space-section",
  "2xl": "2rem / lg breakpoint --space-section",
} as const;

export const TOKEN_FINDINGS: TokenFinding[] = [
  {
    id: "typography-page-title-split",
    category: "typography",
    severity: "high",
    title: "Page title uses both camba-display and camba-h1",
    description:
      "U7 premium pages (Journey, Mock Center, Achievements, Profile) use camba-display for h1. PageHeader component uses camba-h1. Learning path and mock detail use responsive text-xl sm:text-2xl overrides.",
    locations: [
      "src/components/camba/page-header.tsx",
      "src/components/journey/journey-view.tsx",
      "src/components/mock-tests/mock-test-hero.tsx",
    ],
    recommendation: "Standardize pageTitle on camba-display via PageHeader or shared PageHero pattern in U8.2.",
  },
  {
    id: "typography-h2-empty-state",
    category: "typography",
    severity: "medium",
    title: "Empty states use camba-h2 while sections use camba-h3",
    description: "DashboardEmptyState titles use camba-h2; SectionHeader uses camba-h3 for section titles, creating inverted hierarchy in some views.",
    locations: ["src/components/dashboard/dashboard-empty-state.tsx"],
    recommendation: "Use sectionTitle (camba-h3) for empty-state titles or introduce emptyStateTitle role.",
  },
  {
    id: "spacing-section-stack-override",
    category: "spacing",
    severity: "medium",
    title: "camba-section-stack gap overridden per page",
    description:
      "Base token sets gap: var(--space-section). U7 pages add gap-8 sm:gap-10 or gap-6 sm:gap-8, bypassing the token.",
    locations: [
      "src/components/journey/journey-view.tsx",
      "src/components/achievements/achievements-collection-view.tsx",
      "src/components/profile/student-profile-view.tsx",
    ],
    recommendation: "Add --space-section-lg token or camba-section-stack-lg utility.",
  },
  {
    id: "color-gray-legacy",
    category: "color",
    severity: "high",
    title: "Legacy Tailwind gray-* palette on student surfaces",
    description:
      "Button outline/ghost variants and nav use border-gray-200, text-gray-600. Semantic tokens (--muted, --foreground, --border) exist but are not used consistently.",
    locations: [
      "src/components/ui/button.tsx",
      "src/components/layout/dashboard-nav.tsx",
      "src/components/dashboard/student-progress-overview.tsx",
    ],
    recommendation: "Migrate shadcn button variants to semantic tokens in U8.2.",
  },
  {
    id: "radius-hero-3xl",
    category: "radius",
    severity: "low",
    title: "Hero cards use rounded-3xl outside radius token scale",
    description: "Token scale stops at --radius-2xl (1.5rem). Dashboard/profile heroes use rounded-3xl (1.875rem).",
    locations: [
      "src/components/dashboard/dashboard-hero.tsx",
      "src/components/profile/student-profile-hero.tsx",
    ],
    recommendation: "Add --radius-3xl token or standardize heroes on rounded-2xl.",
  },
  {
    id: "elevation-dual-system",
    category: "elevation",
    severity: "medium",
    title: "Dual card elevation: CambaCard CVA + .camba-card utility",
    description:
      "cambaCardVariants uses shadow-sm/md; globals.css .camba-card uses --shadow-card. Interactive hover on .camba-card-interactive only.",
    locations: ["src/lib/design/card-variants.ts", "src/app/globals.css"],
    recommendation: "Consolidate on CambaCard variants; deprecate raw .camba-card where possible.",
  },
  {
    id: "magic-number-icon-box",
    category: "spacing",
    severity: "low",
    title: "camba-icon-box sizes not tokenized",
    description: "Icon containers use utility classes (h-8 w-8, h-11 w-11) rather than spacing tokens.",
    locations: ["src/components/camba/section-header.tsx", "src/components/achievements/achievement-card.tsx"],
    recommendation: "Document icon-box sizes in design-guidelines.md.",
  },
];

export const DUPLICATE_PATTERNS: DuplicatePattern[] = [
  {
    id: "mock-test-card-triple",
    patterns: [
      "src/components/mock-tests/mock-test-card.tsx",
      "src/components/mock-tests/premium-mock-card.tsx",
      "src/components/camba/cards/learning-cards.tsx (MockTestCard)",
    ],
    canonical: "src/components/mock-tests/premium-mock-card.tsx",
    severity: "high",
  },
  {
    id: "empty-state-triple",
    patterns: [
      "src/components/dashboard/dashboard-empty-state.tsx",
      "src/components/camba/empty-state-illustrated.tsx",
      "src/components/camba/feedback/empty-state.tsx (alias)",
    ],
    canonical: "src/components/dashboard/dashboard-empty-state.tsx (U7 adoption)",
    severity: "medium",
  },
  {
    id: "hero-dual",
    patterns: [
      "src/components/dashboard/dashboard-hero.tsx",
      "src/components/camba/student-hero-card.tsx",
      "src/components/camba/cards/hero-card.tsx",
      "src/components/profile/student-profile-hero.tsx",
    ],
    canonical: "Context-specific heroes until U8.2 extracts shared HeroShell",
    severity: "medium",
  },
  {
    id: "page-header-unused",
    patterns: ["src/components/camba/page-header.tsx", "Custom header blocks in U7 pages"],
    canonical: "src/components/camba/page-header.tsx",
    severity: "medium",
  },
];

export const MAGIC_NUMBERS = [
  { value: "4.5rem", usage: "DashboardEmptyState icon box", file: "dashboard-empty-state.tsx" },
  { value: "6.5rem", usage: "Dashboard hero stat min-width", file: "dashboard-hero.tsx" },
  { value: "h-48", usage: "Profile loading skeleton hero height", file: "profile/loading.tsx" },
  { value: "min-h-[10rem]", usage: "Writing editor textarea", file: "writing-editor.tsx" },
] as const;

export function countFindingsBySeverity(severity: AuditSeverity): number {
  return TOKEN_FINDINGS.filter((f) => f.severity === severity).length;
}
