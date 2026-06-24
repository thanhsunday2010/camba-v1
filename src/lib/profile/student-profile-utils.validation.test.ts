import { describe, expect, it } from "vitest";
import {
  averageScore,
  buildFutureGoals,
  computeProfileCompletion,
  parseSpeakingFeedbackRows,
  parseWritingFeedbackRows,
  scoreTrend,
  topFrequencyLabels,
} from "@/lib/profile/student-profile-utils";
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
  levelCompletionPercent: { starters: 40 },
  badgeSlugs: {},
};

describe("U7.5 Student profile utils", () => {
  it("computes profile completion from activity signals", () => {
    expect(
      computeProfileCompletion({
        hasProgram: true,
        lessonsCompleted: 3,
        mocksCompleted: 1,
        writingTasks: 2,
        speakingTasks: 1,
        achievementsUnlocked: 2,
      })
    ).toBe(100);
    expect(
      computeProfileCompletion({
        hasProgram: false,
        lessonsCompleted: 0,
        mocksCompleted: 0,
        writingTasks: 0,
        speakingTasks: 0,
        achievementsUnlocked: 0,
      })
    ).toBe(0);
  });

  it("parses writing feedback rows", () => {
    const items = parseWritingFeedbackRows([
      {
        id: "w1",
        created_at: "2026-01-01T00:00:00Z",
        response_data: {
          overallScore: 82,
          strengths: ["Good vocabulary", "Clear structure"],
          weaknesses: ["Grammar"],
        },
      },
      {
        id: "w2",
        created_at: "2026-01-02T00:00:00Z",
        response_data: { invalid: true },
      },
    ]);
    expect(items).toHaveLength(1);
    expect(items[0]?.overallScore).toBe(82);
    expect(items[0]?.strengths).toContain("Good vocabulary");
  });

  it("parses speaking dimension scores", () => {
    const items = parseSpeakingFeedbackRows([
      {
        id: "s1",
        created_at: "2026-01-01T00:00:00Z",
        response_data: {
          overallScore: 75,
          dimensions: [
            { dimension: "pronunciation", score: 70 },
            { dimension: "fluency", score: 80 },
            { dimension: "vocabulary", score: 72 },
          ],
        },
      },
    ]);
    expect(items[0]?.pronunciationScore).toBe(70);
    expect(items[0]?.fluencyScore).toBe(80);
  });

  it("builds deterministic future goals", () => {
    const goals = buildFutureGoals({
      achievementContext: emptyContext,
      nextAchievement: {
        id: "first-lesson",
        titleKey: "firstLessonTitle",
        descriptionKey: "firstLessonDesc",
        category: "learning",
        rarity: "common",
        icon: "book-open",
        unlocked: false,
        progressPercent: 50,
        progressCurrent: 0,
        progressTarget: 1,
        unlockedAt: null,
        sortOrder: 1,
      },
      recommendedMock: {
        id: "mock-1",
        title: "Starters Mock 1",
        attemptCount: 0,
      } as Parameters<typeof buildFutureGoals>[0]["recommendedMock"],
      nextMilestoneTitle: "milestoneFirstLesson",
      levelName: "Starters",
      currentStreak: 2,
    });
    expect(goals.length).toBeGreaterThan(0);
    expect(goals.some((g) => g.kind === "achievement")).toBe(true);
    expect(goals.some((g) => g.kind === "mock")).toBe(true);
    expect(goals.length).toBeLessThanOrEqual(5);
    expect(goals.every((g) => g.href && g.titleKey)).toBe(true);
  });

  it("derives score trends and label frequency", () => {
    expect(scoreTrend([85, 70])).toBe("improving");
    expect(scoreTrend([70])).toBe("building");
    expect(averageScore([80, 90])).toBe(85);
    expect(topFrequencyLabels(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });
});
