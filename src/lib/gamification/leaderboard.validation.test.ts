import { describe, expect, it } from "vitest";
import { getTierFromWeeklyXp } from "@/lib/gamification/constants";
import { getNextLeagueTierInfo } from "@/lib/gamification/leaderboard-types";

describe("leaderboard tier rules", () => {
  it("maps weekly XP to league tiers", () => {
    expect(getTierFromWeeklyXp(0)).toBe("bronze");
    expect(getTierFromWeeklyXp(199)).toBe("bronze");
    expect(getTierFromWeeklyXp(200)).toBe("silver");
    expect(getTierFromWeeklyXp(7500)).toBe("champion");
  });

  it("returns XP needed for next tier", () => {
    expect(getNextLeagueTierInfo(150)).toEqual({ tier: "silver", xpNeeded: 50 });
    expect(getNextLeagueTierInfo(7500)).toBeNull();
  });
});
