import { describe, expect, it } from "vitest";
import {
  percentToShieldScale,
  mergeSkillShields,
  clampShieldRecord,
  DEFAULT_SHIELD_SCALE_MAX,
} from "@/lib/learning/shields";
import { computeShieldEstimate } from "@/lib/learning/mock-test-scoring";

describe("shield scale alignment (0–15)", () => {
  it("maps 100% to max shields", () => {
    expect(percentToShieldScale(100, 15)).toBe(15);
  });

  it("maps 0% to zero shields", () => {
    expect(percentToShieldScale(0, 15)).toBe(0);
  });

  it("uses DEFAULT_SHIELD_SCALE_MAX of 15", () => {
    expect(DEFAULT_SHIELD_SCALE_MAX).toBe(15);
    expect(percentToShieldScale(80)).toBe(12);
  });

  it("merges shields using max per skill capped at scale", () => {
    expect(mergeSkillShields({ reading: 10 }, { reading: 14 }, 15)).toEqual({ reading: 14 });
    expect(mergeSkillShields({ reading: 10 }, { reading: 20 }, 15)).toEqual({ reading: 15 });
  });

  it("clamps out-of-range shield records", () => {
    expect(clampShieldRecord({ reading: -1, writing: 20 }, 15)).toEqual({
      reading: 0,
      writing: 15,
    });
  });

  it("computeShieldEstimate uses 0–15 scale not legacy 1–5", () => {
    const shields = computeShieldEstimate({ reading: 100, writing: 50 }, 15);
    expect(shields.reading).toBe(15);
    expect(shields.writing).toBe(8);
    expect(shields.reading).toBeGreaterThan(5);
  });
});
