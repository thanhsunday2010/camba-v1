import { describe, expect, it } from "vitest";
import { getMonthBounds } from "@/lib/gamification/constants";

describe("getMonthBounds", () => {
  it("returns the full calendar month in Asia/Ho_Chi_Minh", () => {
    const bounds = getMonthBounds(new Date("2026-06-15T12:00:00.000Z"));
    expect(bounds.monthStart).toBe("2026-06-01");
    expect(bounds.monthEnd).toBe("2026-06-30");
  });
});
