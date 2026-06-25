import { describe, expect, it } from "vitest";
import { MOTION_DURATION } from "@/lib/design/motion-tokens";
import { motionDuration, motionTransition } from "@/lib/design/motion-utils";
import { MOTION_CATEGORIES } from "@/lib/design/motion-principles";

describe("U8.2 Motion system", () => {
  it("defines canonical duration tokens", () => {
    expect(MOTION_DURATION.fast).toBe(0.15);
    expect(MOTION_DURATION.normal).toBe(0.25);
    expect(MOTION_DURATION.celebration).toBe(0.6);
    expect(MOTION_DURATION.page).toBe(0.3);
  });

  it("zeroes duration when reduced motion is preferred", () => {
    expect(motionDuration("normal", true)).toBe(0);
    expect(motionDuration("normal", false)).toBe(0.25);
    expect(motionTransition("celebration", true).duration).toBe(0);
  });

  it("documents motion categories with max durations", () => {
    expect(Object.keys(MOTION_CATEGORIES)).toHaveLength(5);
    expect(MOTION_CATEGORIES.celebration.maxDurationMs).toBeLessThanOrEqual(600);
  });
});
