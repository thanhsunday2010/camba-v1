import { describe, expect, it } from "vitest";
import { LESSON_PRACTICE_DAILY_LIMITS, AI_DAILY_LIMITS } from "@/lib/subscriptions/subscription-catalog";

describe("subscription tier benefits", () => {
  it("grants all tiers full course access via unlimited or explicit practice rules", () => {
    expect(LESSON_PRACTICE_DAILY_LIMITS.pro).toBeNull();
    expect(LESSON_PRACTICE_DAILY_LIMITS.vip).toBeNull();
    expect(LESSON_PRACTICE_DAILY_LIMITS.free).toBe(1);
  });

  it("keeps AI grading limits unchanged by tier", () => {
    expect(AI_DAILY_LIMITS).toEqual({
      free: 1,
      pro: 5,
      vip: 10,
    });
  });
});
