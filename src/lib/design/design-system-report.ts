/**
 * U8.1 Design system report — executive summary for tooling and U8.x milestones.
 */

import {
  DUPLICATE_PATTERNS,
  TOKEN_FINDINGS,
  countFindingsBySeverity,
} from "@/lib/design/design-system-audit";
import { ALL_INVENTORY, inventoryByStatus } from "@/lib/design/component-inventory";
import { DEPRECATED_TYPOGRAPHY_PATTERNS, TYPOGRAPHY_CLASS } from "@/lib/design/typography";

export const U8_1_REPORT_VERSION = "1.0.0";
export const U8_1_AUDIT_DATE = "2026-06-22";

export const EXECUTIVE_SUMMARY = {
  mission:
    "Audit and document UX consistency across U7 premium surfaces without feature changes or visual regressions.",
  surfacesAudited: [
    "Dashboard (U7.1)",
    "Learning Journey (U7.2)",
    "Mock Center (U7.3)",
    "Achievements (U7.4)",
    "Student Portfolio (U7.5)",
    "Learning Path & Lessons",
    "Writing AI",
    "Speaking AI",
  ],
  overallConsistency: "moderate",
  primaryGaps: [
    "Page header pattern fragmentation (PageHeader vs custom camba-display blocks)",
    "Three mock card implementations",
    "Legacy gray-* palette on shadcn Button and nav",
    "Inconsistent section vertical rhythm (gap-6 vs gap-8 vs gap-10)",
    "Loading skeleton patterns differ per route",
  ],
  strengths: [
    "CambaCard CVA with semantic variants",
    "camba-* typography utilities and CSS tokens",
    "DashboardEmptyState adopted widely across U7",
    "SectionHeader consistent on U7 section blocks",
    "Strong aria-labelledby usage on U7 sections",
  ],
} as const;

export const FINDINGS_SUMMARY = {
  tokenFindings: TOKEN_FINDINGS.length,
  critical: countFindingsBySeverity("critical"),
  high: countFindingsBySeverity("high"),
  medium: countFindingsBySeverity("medium"),
  low: countFindingsBySeverity("low"),
  duplicatePatterns: DUPLICATE_PATTERNS.length,
  legacyComponents: inventoryByStatus("legacy").length,
  duplicateComponents: inventoryByStatus("duplicate").length,
  totalInventory: ALL_INVENTORY.length,
};

export const MIGRATION_PRIORITIES = [
  {
    phase: "U8.2",
    title: "Animation & micro-interaction layer",
    blockers: ["Establish canonical page hero shell", "Unify section spacing token"],
  },
  {
    phase: "U8.3",
    title: "Empty state redesign",
    blockers: ["Empty state inventory complete (U8.1)", "Single EmptyState API"],
  },
  {
    phase: "U8.4",
    title: "Mobile polish",
    blockers: ["Responsive issue list from U8.1", "Touch target audit on filter chips"],
  },
  {
    phase: "U8.5",
    title: "Legacy cleanup",
    blockers: ["Deprecate legacy dashboard panels", "Consolidate mock cards"],
  },
] as const;

export const APPROVED_PATTERNS = {
  typography: TYPOGRAPHY_CLASS,
  pageShell: "StudentPageShell + camba-section-stack",
  sectionHeader: "SectionHeader with titleId + optional icon",
  primaryCard: "CambaCard variant default | elevated | lesson | mockTest",
  emptyState: "DashboardEmptyState with icon, title, description, quest CTA",
  statusPill: "LessonStatusPill + LESSON_STATE_STYLES",
  achievementBadge: "AchievementRarityBadge + RARITY_STYLES",
} as const;

export const DEPRECATED_PATTERNS = [
  ...DEPRECATED_TYPOGRAPHY_PATTERNS,
  "Raw shadcn Card without CambaCard on student surfaces",
  "text-gray-* on student-facing components",
  "Custom page headers duplicating PageHeader",
  "mock-test-card.tsx for new features (use PremiumMockCard)",
  "achievement-section.tsx / dashboard-achievement-strip.tsx",
  "LearningPathSkeleton for Journey loading (semantic mismatch)",
] as const;

export function getDesignSystemReport() {
  return {
    version: U8_1_REPORT_VERSION,
    auditDate: U8_1_AUDIT_DATE,
    summary: EXECUTIVE_SUMMARY,
    findings: FINDINGS_SUMMARY,
    migration: MIGRATION_PRIORITIES,
    approved: APPROVED_PATTERNS,
    deprecated: DEPRECATED_PATTERNS,
  };
}
