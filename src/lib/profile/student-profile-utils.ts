import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import type { StudentAchievementContext } from "@/lib/achievements/achievement-types";
import type { JourneyLevel, JourneyMilestone } from "@/lib/learning/journey/learning-journey-types";
import type { MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import type {
  FutureGoal,
  MockPerformanceRecent,
  SpeakingGrowthItem,
  WritingGrowthItem,
} from "@/lib/profile/student-profile-types";
import type { Json } from "@/types/database";

type AiFeedbackRow = {
  id: string;
  created_at: string;
  response_data: Json;
};

function asRecord(value: Json): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function dimensionScore(
  dimensions: unknown,
  name: string
): number | null {
  if (!Array.isArray(dimensions)) return null;
  for (const item of dimensions) {
    if (item && typeof item === "object" && "dimension" in item && "score" in item) {
      const row = item as { dimension?: string; score?: number };
      if (row.dimension === name && typeof row.score === "number") {
        return row.score;
      }
    }
  }
  return null;
}

export function parseWritingFeedbackRows(rows: AiFeedbackRow[]): WritingGrowthItem[] {
  return rows
    .map((row) => {
      const data = asRecord(row.response_data);
      if (!data || typeof data.overallScore !== "number") return null;
      const strengths = Array.isArray(data.strengths)
        ? data.strengths.filter((s): s is string => typeof s === "string")
        : [];
      const weaknesses = Array.isArray(data.weaknesses)
        ? data.weaknesses.filter((s): s is string => typeof s === "string")
        : [];
      return {
        id: row.id,
        completedAt: row.created_at,
        overallScore: Math.round(data.overallScore),
        strengths,
        weaknesses,
      };
    })
    .filter((item): item is WritingGrowthItem => item != null);
}

export function parseSpeakingFeedbackRows(rows: AiFeedbackRow[]): SpeakingGrowthItem[] {
  return rows
    .map((row) => {
      const data = asRecord(row.response_data);
      if (!data || typeof data.overallScore !== "number") return null;
      return {
        id: row.id,
        completedAt: row.created_at,
        overallScore: Math.round(data.overallScore),
        pronunciationScore: dimensionScore(data.dimensions, "pronunciation"),
        fluencyScore: dimensionScore(data.dimensions, "fluency"),
        vocabularyScore: dimensionScore(data.dimensions, "vocabulary"),
      };
    })
    .filter((item): item is SpeakingGrowthItem => item != null);
}

export function averageScore(scores: number[]): number | null {
  if (scores.length === 0) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function topFrequencyLabels(items: string[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label]) => label);
}

export function scoreTrend(recentScores: number[]): "improving" | "stable" | "building" | null {
  if (recentScores.length < 2) return recentScores.length === 1 ? "building" : null;
  const latest = recentScores[0] ?? 0;
  const previous = recentScores[1] ?? 0;
  if (latest > previous + 3) return "improving";
  if (latest < previous - 3) return "stable";
  return "stable";
}

export function computeProfileCompletion(input: {
  hasProgram: boolean;
  lessonsCompleted: number;
  mocksCompleted: number;
  writingTasks: number;
  speakingTasks: number;
  achievementsUnlocked: number;
}): number {
  let score = 0;
  if (input.hasProgram) score += 15;
  if (input.lessonsCompleted > 0) score += 25;
  if (input.mocksCompleted > 0) score += 20;
  if (input.writingTasks > 0) score += 15;
  if (input.speakingTasks > 0) score += 15;
  if (input.achievementsUnlocked > 0) score += 10;
  return Math.min(100, score);
}

export function deriveMockTrend(recent: MockPerformanceRecent[]): "improving" | "stable" | "building" | null {
  return scoreTrend(recent.map((r) => r.scorePercent));
}

export function buildFutureGoals(input: {
  achievementContext: StudentAchievementContext;
  nextAchievement: EvaluatedAchievement | null;
  recommendedMock: MockTestHubSummary | null;
  nextMilestoneTitle: string | null;
  levelName: string | null;
  currentStreak: number;
}): FutureGoal[] {
  const goals: FutureGoal[] = [];

  if (input.nextAchievement) {
    goals.push({
      id: `achievement-${input.nextAchievement.id}`,
      kind: "achievement",
      titleKey: "goalNextAchievement",
      descriptionKey: input.nextAchievement.titleKey,
      href: "/achievements",
      progressPercent: input.nextAchievement.progressPercent,
    });
  }

  if (input.recommendedMock) {
    goals.push({
      id: `mock-${input.recommendedMock.id}`,
      kind: "mock",
      titleKey: "goalNextMock",
      descriptionKey: "goalNextMockDesc",
      href: `/mock-tests/${input.recommendedMock.id}`,
      progressPercent: input.recommendedMock.attemptCount > 0 ? 50 : 0,
    });
  }

  const nextLevelSlug = pickNextLevelSlug(input.achievementContext.levelCompletionPercent);
  if (nextLevelSlug) {
    goals.push({
      id: `level-${nextLevelSlug}`,
      kind: "level",
      titleKey: "goalCompleteLevel",
      descriptionKey: `goalLevel_${nextLevelSlug}`,
      href: "/journey",
      progressPercent: input.achievementContext.levelCompletionPercent[nextLevelSlug] ?? 0,
    });
  }

  if (input.achievementContext.goldMocksCompleted === 0) {
    goals.push({
      id: "gold-mock-first",
      kind: "mock",
      titleKey: "goalFirstGoldMock",
      descriptionKey: "goalFirstGoldMockDesc",
      href: "/mock-tests",
      progressPercent: 0,
    });
  }

  if (input.achievementContext.writingSubmissions < 5) {
    goals.push({
      id: "writing-improver",
      kind: "writing",
      titleKey: "goalImproveWriting",
      descriptionKey: "goalImproveWritingDesc",
      href: "/learning",
      progressPercent: Math.min(
        100,
        Math.round((input.achievementContext.writingSubmissions / 5) * 100)
      ),
    });
  }

  const streakTarget = input.currentStreak >= 7 ? 30 : 7;
  goals.push({
    id: "streak-target",
    kind: "streak",
    titleKey: streakTarget === 7 ? "goalStreak7" : "goalStreak30",
    descriptionKey: streakTarget === 7 ? "goalStreak7Desc" : "goalStreak30Desc",
    href: "/dashboard",
    progressPercent: Math.min(
      100,
      Math.round((Math.max(input.currentStreak, input.achievementContext.bestStreak) / streakTarget) * 100)
    ),
  });

  return goals.slice(0, 5);
}

function pickNextLevelSlug(
  levelCompletion: Record<string, number>
): string | null {
  const order = ["starters", "movers", "flyers", "ket", "pet"];
  for (const slug of order) {
    const pct = levelCompletion[slug] ?? 0;
    if (pct > 0 && pct < 100) return slug;
    if (pct === 0) return slug;
  }
  return null;
}

export function countCompletedLevels(levels: JourneyLevel[]): number {
  return levels.filter((l) => l.status === "completed").length;
}

export function pickRareAchievements(
  unlocked: EvaluatedAchievement[],
  limit = 3
): EvaluatedAchievement[] {
  const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };
  return [...unlocked]
    .filter((a) => a.rarity !== "common")
    .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
    .slice(0, limit);
}

export function currentAndNextMilestone(milestones: JourneyMilestone[]): {
  current: string | null;
  next: string | null;
} {
  const achieved = milestones.filter((m) => m.achieved);
  const upcoming = milestones.filter((m) => !m.achieved);
  return {
    current: achieved[achieved.length - 1]?.titleKey ?? null,
    next: upcoming[0]?.titleKey ?? null,
  };
}
