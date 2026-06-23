import { describe, expect, it } from "vitest";
import {
  getSkillPerformanceBand,
  skillPerformanceBandBarClass,
} from "@/lib/mock-tests/skill-performance-band";
import {
  LEARNER_ANALYTICS_STRENGTH_THRESHOLD,
  LEARNER_ANALYTICS_WEAKNESS_THRESHOLD,
} from "@/lib/learning/learner-skill-analytics";

describe("skill performance band", () => {
  it("maps percent to M1.4 analytics bands", () => {
    expect(getSkillPerformanceBand(LEARNER_ANALYTICS_STRENGTH_THRESHOLD)).toBe(
      "strength"
    );
    expect(getSkillPerformanceBand(69)).toBe("neutral");
    expect(getSkillPerformanceBand(LEARNER_ANALYTICS_WEAKNESS_THRESHOLD - 1)).toBe(
      "weakness"
    );
  });

  it("provides a bar class for each band", () => {
    expect(skillPerformanceBandBarClass("strength")).toContain("success");
    expect(skillPerformanceBandBarClass("neutral")).toContain("program");
    expect(skillPerformanceBandBarClass("weakness")).toContain("needs-review");
  });
});
