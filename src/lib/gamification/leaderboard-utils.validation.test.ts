import { describe, expect, it } from "vitest";
import { buildContextualLeaderboardRows } from "@/lib/gamification/leaderboard-utils";

describe("buildContextualLeaderboardRows", () => {
  const rows = [
    { userId: "a", score: 500 },
    { userId: "b", score: 400 },
    { userId: "c", score: 300 },
    { userId: "d", score: 200 },
    { userId: "e", score: 100 },
    { userId: "f", score: 50 },
    { userId: "g", score: 25 },
    { userId: "h", score: 10 },
    { userId: "me", score: 5 },
  ];

  it("includes current user even when outside the top slice", () => {
    const result = buildContextualLeaderboardRows(rows, "me", 8);
    expect(result.some((row) => row.userId === "me")).toBe(true);
    expect(result.find((row) => row.userId === "me")?.rank).toBe(9);
  });

  it("includes podium ranks", () => {
    const result = buildContextualLeaderboardRows(rows, "me", 8);
    expect(result[0]?.userId).toBe("a");
    expect(result.some((row) => row.userId === "b")).toBe(true);
    expect(result.some((row) => row.userId === "c")).toBe(true);
  });
});
