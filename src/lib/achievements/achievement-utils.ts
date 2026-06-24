import { ACTIVE_ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/achievement-definitions";
import type {
  AchievementCategory,
  AchievementCriterion,
  AchievementViewModel,
  EvaluatedAchievement,
  StudentAchievementContext,
} from "@/lib/achievements/achievement-types";

const ALL_CATEGORIES: AchievementCategory[] = [
  "learning",
  "assessment",
  "writing",
  "speaking",
  "consistency",
  "journey",
  "certification",
];

function criterionProgress(
  criteria: AchievementCriterion,
  ctx: StudentAchievementContext
): { current: number; target: number } {
  const target = criteria.target;

  switch (criteria.type) {
    case "lessons_completed":
      return { current: ctx.lessonsCompleted, target };
    case "units_completed":
      return { current: ctx.unitsCompleted, target };
    case "mocks_completed":
      return { current: ctx.mocksCompleted, target };
    case "distinct_mocks_completed":
      return { current: ctx.distinctMocksCompleted, target };
    case "gold_mocks_completed":
      return { current: ctx.goldMocksCompleted, target };
    case "writing_submissions":
      return { current: ctx.writingSubmissions, target };
    case "speaking_submissions":
      return { current: ctx.speakingSubmissions, target };
    case "streak_days":
      return {
        current: Math.max(ctx.currentStreak, ctx.bestStreak),
        target,
      };
    case "level_completion_percent": {
      const slug = criteria.levelSlug ?? "";
      return {
        current: ctx.levelCompletionPercent[slug] ?? 0,
        target,
      };
    }
    case "mock_score_percent":
      return { current: ctx.maxMockScorePercent, target };
    case "badge_slug": {
      const slug = criteria.badgeSlug ?? "";
      const earned = slug in ctx.badgeSlugs;
      return { current: earned ? 1 : 0, target: 1 };
    }
    default:
      return { current: 0, target };
  }
}

function resolveUnlockedAt(
  criteria: AchievementCriterion,
  ctx: StudentAchievementContext,
  unlocked: boolean
): string | null {
  if (!unlocked) return null;

  if (criteria.type === "badge_slug" && criteria.badgeSlug) {
    return ctx.badgeSlugs[criteria.badgeSlug] ?? null;
  }

  return null;
}

export function evaluateStudentAchievements(
  ctx: StudentAchievementContext
): EvaluatedAchievement[] {
  return ACTIVE_ACHIEVEMENT_DEFINITIONS.map((def) => {
    const { current, target } = criterionProgress(def.criteria, ctx);
    const unlocked = current >= target;
    const progressPercent =
      target > 0 ? Math.min(100, Math.round((current / target) * 100)) : unlocked ? 100 : 0;

    return {
      id: def.id,
      category: def.category,
      icon: def.icon,
      rarity: def.rarity,
      titleKey: def.titleKey,
      descriptionKey: def.descriptionKey,
      unlocked,
      unlockedAt: resolveUnlockedAt(def.criteria, ctx, unlocked),
      progressCurrent: Math.min(current, target),
      progressTarget: target,
      progressPercent,
      relatedAchievementId: def.relatedAchievementId,
      sortOrder: def.sortOrder,
    };
  });
}

export function buildAchievementViewModel(
  ctx: StudentAchievementContext
): AchievementViewModel {
  const achievements = evaluateStudentAchievements(ctx);
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  const recentUnlocked = [...unlocked]
    .sort((a, b) => {
      if (!a.unlockedAt && !b.unlockedAt) return a.sortOrder - b.sortOrder;
      if (!a.unlockedAt) return 1;
      if (!b.unlockedAt) return -1;
      return b.unlockedAt.localeCompare(a.unlockedAt);
    })
    .slice(0, 5);

  const nextAchievement = pickNextAchievement(achievements);

  const byCategory = ALL_CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = achievements.filter((a) => a.category === category);
      return acc;
    },
    {} as Record<AchievementCategory, EvaluatedAchievement[]>
  );

  return {
    achievements,
    unlocked,
    locked,
    recentUnlocked,
    nextAchievement,
    unlockedCount: unlocked.length,
    totalCount: achievements.length,
    byCategory,
  };
}

export function pickNextAchievement(
  achievements: EvaluatedAchievement[]
): EvaluatedAchievement | null {
  const locked = achievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => {
      const aRemaining = a.progressTarget - a.progressCurrent;
      const bRemaining = b.progressTarget - b.progressCurrent;
      if (aRemaining !== bRemaining) return aRemaining - bRemaining;
      return a.sortOrder - b.sortOrder;
    });

  return locked[0] ?? null;
}

export function formatAchievementProgressMessage(
  achievement: EvaluatedAchievement,
  templates: {
    remaining: string;
    complete: string;
  }
): string {
  if (achievement.unlocked) return templates.complete;

  const remaining = achievement.progressTarget - achievement.progressCurrent;
  return templates.remaining.replace("{count}", String(Math.max(remaining, 1)));
}
