import { describe, expect, it } from "vitest";
import { resolveAnalyticsDisplayMode } from "@/lib/mock-tests/analytics-empty-state-mode";
import type { MockTestSkillAnalytics } from "@/lib/mock-tests/mock-test-analytics-types";

const emptyAnalytics: MockTestSkillAnalytics = {
  grammarStrengths: [],
  grammarWeaknesses: [],
  vocabularyStrengths: [],
  vocabularyWeaknesses: [],
  grammarBreakdown: [],
  vocabularyBreakdown: [],
  hasData: false,
};

const readyAnalytics: MockTestSkillAnalytics = {
  ...emptyAnalytics,
  hasData: true,
  grammarBreakdown: [
    {
      slug: "present_simple",
      label: "Present simple",
      percent: 80,
      band: "strength",
    },
  ],
};

describe("resolveAnalyticsDisplayMode", () => {
  it("returns no-attempt when learner has not completed a mock", () => {
    expect(resolveAnalyticsDisplayMode(false, null)).toBe("no-attempt");
    expect(resolveAnalyticsDisplayMode(false, emptyAnalytics)).toBe("no-attempt");
  });

  it("returns insufficient-metadata when attempt exists without tagged coverage", () => {
    expect(resolveAnalyticsDisplayMode(true, emptyAnalytics)).toBe(
      "insufficient-metadata"
    );
    expect(resolveAnalyticsDisplayMode(true, null)).toBe("insufficient-metadata");
  });

  it("returns ready when tagged analytics data exists", () => {
    expect(resolveAnalyticsDisplayMode(true, readyAnalytics)).toBe("ready");
  });
});
