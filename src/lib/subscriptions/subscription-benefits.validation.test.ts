import { describe, expect, it } from "vitest";
import { LESSON_PRACTICE_DAILY_LIMITS, AI_DAILY_LIMITS } from "@/lib/subscriptions/subscription-catalog";

describe("subscription tier benefits", () => {
  it("grants all tiers unlimited daily lesson practice", () => {
    expect(LESSON_PRACTICE_DAILY_LIMITS.free).toBeNull();
    expect(LESSON_PRACTICE_DAILY_LIMITS.pro).toBeNull();
    expect(LESSON_PRACTICE_DAILY_LIMITS.vip).toBeNull();
  });

  it("keeps AI grading limits unchanged by tier", () => {
    expect(AI_DAILY_LIMITS).toEqual({
      free: 1,
      pro: 10,
      vip: 30,
    });
  });
});
