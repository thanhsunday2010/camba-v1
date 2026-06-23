import type {
  AnalyticsEmptyStateMode,
  MockTestSkillAnalytics,
} from "@/lib/mock-tests/mock-test-analytics-types";

export type AnalyticsDisplayMode = AnalyticsEmptyStateMode | "ready";

/** Select the correct empty-state mode for learning insights UI. */
export function resolveAnalyticsDisplayMode(
  hasAttempt: boolean,
  analytics: MockTestSkillAnalytics | null
): AnalyticsDisplayMode {
  if (!hasAttempt) return "no-attempt";
  if (!analytics?.hasData) return "insufficient-metadata";
  return "ready";
}
