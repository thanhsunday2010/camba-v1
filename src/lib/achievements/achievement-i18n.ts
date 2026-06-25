import { ACTIVE_ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/achievement-definitions";
import type {
  AchievementViewModel,
  EvaluatedAchievement,
  ResolvedAchievementViewModel,
  ResolvedEvaluatedAchievement,
} from "@/lib/achievements/achievement-types";

export type AchievementItemLabels = Record<string, { title: string; description: string }>;

export function resolveAchievementText(
  achievement: EvaluatedAchievement,
  items: AchievementItemLabels
): { title: string; description: string } {
  const item = items[achievement.titleKey];
  if (item) return item;
  return {
    title: achievement.titleKey,
    description: achievement.descriptionKey,
  };
}

export function withAchievementText(
  achievement: EvaluatedAchievement,
  items: AchievementItemLabels
): ResolvedEvaluatedAchievement {
  return { ...achievement, ...resolveAchievementText(achievement, items) };
}

export function withAchievementTexts(
  achievements: EvaluatedAchievement[],
  items: AchievementItemLabels
): ResolvedEvaluatedAchievement[] {
  return achievements.map((achievement) => withAchievementText(achievement, items));
}

export function resolveAchievementViewModel(
  model: AchievementViewModel,
  items: AchievementItemLabels
): ResolvedAchievementViewModel {
  return {
    ...model,
    achievements: withAchievementTexts(model.achievements, items),
    unlocked: withAchievementTexts(model.unlocked, items),
    locked: withAchievementTexts(model.locked, items),
    recentUnlocked: withAchievementTexts(model.recentUnlocked, items),
    nextAchievement: model.nextAchievement
      ? withAchievementText(model.nextAchievement, items)
      : null,
    byCategory: Object.fromEntries(
      Object.entries(model.byCategory).map(([category, achievements]) => [
        category,
        withAchievementTexts(achievements, items),
      ])
    ) as ResolvedAchievementViewModel["byCategory"],
  };
}

export function buildAchievementItemLabels(
  t: (key: string) => string
): Record<string, { title: string; description: string }> {
  const result: Record<string, { title: string; description: string }> = {};
  for (const def of ACTIVE_ACHIEVEMENT_DEFINITIONS) {
    result[def.titleKey] = {
      title: t(def.titleKey),
      description: t(def.descriptionKey),
    };
  }
  return result;
}

export function buildSharedAchievementLabels(t: (key: string) => string) {
  return {
    locked: t("locked"),
    unlocked: t("unlocked"),
    progress: t("progress"),
    unlockCondition: t("unlockCondition"),
    progressLabel: t("progressLabel"),
    unlockedOn: t("unlockedOn"),
    relatedMilestone: t("relatedMilestone"),
    nextStep: t("nextStep"),
    progressRemaining: t("progressRemaining"),
    progressComplete: t("progressComplete"),
    rarity: {
      common: t("rarityCommon"),
      rare: t("rarityRare"),
      epic: t("rarityEpic"),
      legendary: t("rarityLegendary"),
    },
    category: {
      learning: t("categoryLearning"),
      assessment: t("categoryAssessment"),
      writing: t("categoryWriting"),
      speaking: t("categorySpeaking"),
      consistency: t("categoryConsistency"),
      journey: t("categoryJourney"),
      certification: t("categoryCertification"),
    },
    itemLabels: buildAchievementItemLabels(t),
  };
}
