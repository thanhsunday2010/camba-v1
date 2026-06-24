import { describe, expect, it } from "vitest";
import { buildAchievementViewModel, evaluateStudentAchievements } from "@/lib/achievements/achievement-utils";
import type { StudentAchievementContext } from "@/lib/achievements/achievement-types";

const emptyContext: StudentAchievementContext = {
  lessonsCompleted: 0,
  unitsCompleted: 0,
  mocksCompleted: 0,
  distinctMocksCompleted: 0,
  goldMocksCompleted: 0,
  writingSubmissions: 0,
  speakingSubmissions: 0,
  currentStreak: 0,
  bestStreak: 0,
  maxMockScorePercent: 0,
  levelCompletionPercent: {},
  badgeSlugs: {},
};

describe("U7.4 Achievement evaluation", () => {
  it("unlocks first lesson achievement deterministically", () => {
    const results = evaluateStudentAchievements({
      ...emptyContext,
      lessonsCompleted: 1,
    });
    const firstLesson = results.find((a) => a.id === "first-lesson");
    expect(firstLesson?.unlocked).toBe(true);
    expect(firstLesson?.progressPercent).toBe(100);
  });

  it("tracks progress toward mock explorer", () => {
    const results = evaluateStudentAchievements({
      ...emptyContext,
      distinctMocksCompleted: 2,
    });
    const explorer = results.find((a) => a.id === "mock-explorer");
    expect(explorer?.unlocked).toBe(false);
    expect(explorer?.progressCurrent).toBe(2);
    expect(explorer?.progressTarget).toBe(3);
  });

  it("picks next achievement closest to completion", () => {
    const ctx: StudentAchievementContext = {
      ...emptyContext,
      lessonsCompleted: 1,
      unitsCompleted: 1,
      mocksCompleted: 1,
      distinctMocksCompleted: 2,
    };
    const vm = buildAchievementViewModel(ctx);
    expect(vm.nextAchievement?.id).toBe("mock-explorer");
  });

  it("unlocks streak achievements from best streak", () => {
    const vm = buildAchievementViewModel({
      ...emptyContext,
      bestStreak: 30,
    });
    expect(vm.unlocked.some((a) => a.id === "streak-30")).toBe(true);
    expect(vm.unlocked.some((a) => a.id === "streak-7")).toBe(true);
  });

  it("unlocks journey level achievements from completion percent", () => {
    const vm = buildAchievementViewModel({
      ...emptyContext,
      levelCompletionPercent: { starters: 100, ket: 85 },
    });
    expect(vm.unlocked.some((a) => a.id === "completed-starters")).toBe(true);
    expect(vm.unlocked.some((a) => a.id === "ket-ready")).toBe(true);
  });
});
