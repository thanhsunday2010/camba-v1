/**
 * U8.4 — Mobile component compliance inventory.
 * Tracks responsive status without duplicating component trees.
 */

export type MobileComplianceStatus =
  | "compliant"
  | "optimized-u8"
  | "needs-variant"
  | "acceptable-scroll"
  | "desktop-assumption";

export interface MobileComponentAuditEntry {
  id: string;
  path: string;
  surface: string;
  status: MobileComplianceStatus;
  mobilePattern?: string;
  issue?: string;
  notes?: string;
}

export const MOBILE_COMPONENT_AUDIT: MobileComponentAuditEntry[] = [
  // Layout & navigation
  {
    id: "layout.dashboard-shell",
    path: "src/app/[locale]/(dashboard)/layout.tsx",
    surface: "Global layout",
    status: "optimized-u8",
    mobilePattern: "safe-area padding, responsive page gutters",
  },
  {
    id: "nav.dashboard",
    path: "src/components/layout/dashboard-nav.tsx",
    surface: "Navigation",
    status: "optimized-u8",
    mobilePattern: "hamburger drawer + 44px touch targets",
  },
  {
    id: "layout.student-shell",
    path: "src/components/camba/layout/student-shell.tsx",
    surface: "Page shell",
    status: "compliant",
    mobilePattern: "single column, min-w-0, max-width tokens",
  },
  {
    id: "layout.dashboard-grid",
    path: "src/components/camba/layout/student-shell.tsx",
    surface: "Dashboard two-column",
    status: "compliant",
    mobilePattern: "single column until lg: sidebar stacks below",
    notes: "StudentDashboardLayout",
  },

  // Dashboard
  {
    id: "dashboard.hero",
    path: "src/components/dashboard/dashboard-hero.tsx",
    surface: "Dashboard",
    status: "optimized-u8",
    mobilePattern: "flex-col stack, full-width stat tiles on xs",
  },
  {
    id: "dashboard.stats-strip",
    path: "src/components/dashboard/dashboard-stats-strip.tsx",
    surface: "Dashboard",
    status: "acceptable-scroll",
    mobilePattern: "horizontal snap scroll in compact mode",
    notes: "Intentional carousel on narrow widths",
  },
  {
    id: "dashboard.weekly-progress",
    path: "src/components/dashboard/dashboard-weekly-progress.tsx",
    surface: "Dashboard",
    status: "compliant",
    mobilePattern: "grid-cols-2 → sm:3 → lg:5",
  },
  {
    id: "dashboard.recent-activity",
    path: "src/components/dashboard/dashboard-recent-activity.tsx",
    surface: "Dashboard",
    status: "compliant",
    mobilePattern: "single column list",
  },
  {
    id: "dashboard.achievement-showcase",
    path: "src/components/achievements/achievement-showcase.tsx",
    surface: "Dashboard",
    status: "acceptable-scroll",
    mobilePattern: "horizontal snap carousel",
  },

  // Journey
  {
    id: "journey.view",
    path: "src/components/journey/journey-view.tsx",
    surface: "Journey",
    status: "compliant",
    mobilePattern: "grid-cols-1 → sm:2 → xl:3",
  },
  {
    id: "journey.unit-roadmap",
    path: "src/components/journey/journey-unit-roadmap.tsx",
    surface: "Journey",
    status: "compliant",
    mobilePattern: "vertical timeline",
  },
  {
    id: "journey.progress-summary",
    path: "src/components/journey/journey-progress-summary.tsx",
    surface: "Journey",
    status: "compliant",
    mobilePattern: "grid-cols-2 stat tiles",
  },

  // Mock center
  {
    id: "mock.center-view",
    path: "src/components/mock-tests/mock-center-view.tsx",
    surface: "Mock Center",
    status: "compliant",
    mobilePattern: "single column cards, sm:2 grid",
  },
  {
    id: "mock.hub-filters",
    path: "src/components/mock-tests/mock-test-hub-filters.tsx",
    surface: "Mock Center",
    status: "optimized-u8",
    mobilePattern: "wrap filters, 44px chip targets",
  },
  {
    id: "mock.premium-card",
    path: "src/components/mock-tests/premium-mock-card.tsx",
    surface: "Mock Center",
    status: "compliant",
    mobilePattern: "full-width card stack",
  },

  // Mock detail & take
  {
    id: "mock.detail-shell",
    path: "src/components/mock-tests/mock-test-detail-shell.tsx",
    surface: "Mock Detail",
    status: "compliant",
    mobilePattern: "flex-col CTAs, full-width buttons",
  },
  {
    id: "mock.page-shell",
    path: "src/components/mock-tests/mock-test-page-shell.tsx",
    surface: "Mock Take",
    status: "compliant",
    mobilePattern: "compact hero, vertical stack",
  },
  {
    id: "mock.player",
    path: "src/components/mock-tests/mock-test-player.tsx",
    surface: "Mock Take",
    status: "optimized-u8",
    mobilePattern: "sticky bottom action bar, scrollable section pills",
    issue: "Was: inline nav buttons could be hard to reach one-handed",
  },

  // Exercise / question types
  {
    id: "exercise.multiple-choice",
    path: "src/components/exercises/multiple-choice.tsx",
    surface: "Mock Take / Lessons",
    status: "optimized-u8",
    mobilePattern: "min 44px choice buttons",
  },
  {
    id: "exercise.matching",
    path: "src/components/exercises/matching.tsx",
    surface: "Mock Take / Lessons",
    status: "optimized-u8",
    mobilePattern: "flex-col stack, full-width select, 44px touch",
  },
  {
    id: "exercise.gap-fill",
    path: "src/components/exercises/gap-fill.tsx",
    surface: "Mock Take / Lessons",
    status: "compliant",
    mobilePattern: "full-width inputs",
  },

  // Writing & Speaking
  {
    id: "writing.editor",
    path: "src/components/writing/writing-editor.tsx",
    surface: "Writing AI",
    status: "optimized-u8",
    mobilePattern: "16px input, auto-grow, scroll-margin for keyboard",
  },
  {
    id: "writing.feedback",
    path: "src/components/writing/writing-feedback-card.tsx",
    surface: "Writing AI",
    status: "compliant",
    mobilePattern: "vertical score cards",
  },
  {
    id: "speaking.recorder",
    path: "src/components/speaking/speaking-recorder.tsx",
    surface: "Speaking AI",
    status: "optimized-u8",
    mobilePattern: "large record/stop buttons, transcript panel",
  },

  // Achievements & Profile
  {
    id: "achievements.collection",
    path: "src/components/achievements/achievements-collection-view.tsx",
    surface: "Achievements",
    status: "optimized-u8",
    mobilePattern: "grid-cols-1, touch filter chips",
  },
  {
    id: "profile.view",
    path: "src/components/profile/student-profile-view.tsx",
    surface: "Portfolio",
    status: "compliant",
    mobilePattern: "single column → lg:2",
  },
  {
    id: "profile.snapshot",
    path: "src/components/profile/cambridge-snapshot-card.tsx",
    surface: "Portfolio",
    status: "compliant",
    mobilePattern: "grid-cols-2 stats",
  },

  // Analytics
  {
    id: "analytics.skill-card",
    path: "src/components/mock-tests/analytics/mock-test-skill-analytics-card.tsx",
    surface: "Analytics",
    status: "compliant",
    mobilePattern: "vertical insight sections",
  },
  {
    id: "analytics.grammar-section",
    path: "src/components/mock-tests/analytics/grammar-insight-section.tsx",
    surface: "Analytics",
    status: "compliant",
    mobilePattern: "stacked breakdown lists",
  },

  // Empty states (U8.3)
  {
    id: "empty.feature",
    path: "src/components/camba/empty-states/empty-state.tsx",
    surface: "Global",
    status: "compliant",
    mobilePattern: "responsive padding, wrapped CTAs",
  },

  // Settings
  {
    id: "settings.page",
    path: "src/app/[locale]/(dashboard)/settings/page.tsx",
    surface: "Settings",
    status: "compliant",
    mobilePattern: "single column cards",
  },
];

export function mobileAuditByStatus(
  status: MobileComplianceStatus
): MobileComponentAuditEntry[] {
  return MOBILE_COMPONENT_AUDIT.filter((e) => e.status === status);
}

export function mobileAuditNeedsWork(): MobileComponentAuditEntry[] {
  return MOBILE_COMPONENT_AUDIT.filter(
    (e) => e.status === "needs-variant" || e.status === "desktop-assumption"
  );
}

export function getMobileAuditEntry(id: string): MobileComponentAuditEntry | undefined {
  return MOBILE_COMPONENT_AUDIT.find((e) => e.id === id);
}
