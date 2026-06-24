import { ACTIVE_ACHIEVEMENT_DEFINITIONS } from "@/lib/achievements/achievement-definitions";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";

export function resolveAchievementText(
  achievement: EvaluatedAchievement,
  items: Record<string, { title: string; description: string }>
): { title: string; description: string } {
  const item = items[achievement.titleKey];
  if (item) return item;
  return {
    title: achievement.titleKey,
    description: achievement.descriptionKey,
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
