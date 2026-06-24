"use client";

import { AchievementShowcase, type AchievementShowcaseLabels } from "@/components/achievements/achievement-showcase";
import { NextAchievementCard, type NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import { AchievementUnlockNotifier } from "@/components/achievements/achievement-unlock-toast";
import { resolveAchievementText } from "@/lib/achievements/achievement-i18n";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";

interface DashboardAchievementsSectionProps {
  recentUnlocked: EvaluatedAchievement[];
  nextAchievement: EvaluatedAchievement | null;
  unlockedCount: number;
  totalCount: number;
  itemLabels: Record<string, { title: string; description: string }>;
  showcaseLabels: AchievementShowcaseLabels;
  nextLabels: NextAchievementCardLabels;
  toastLabels: { unlocked: string; celebration: string };
}

export function DashboardAchievementsSection({
  recentUnlocked,
  nextAchievement,
  unlockedCount,
  totalCount,
  itemLabels,
  showcaseLabels,
  nextLabels,
  toastLabels,
}: DashboardAchievementsSectionProps) {
  const resolveText = (achievement: EvaluatedAchievement) =>
    resolveAchievementText(achievement, itemLabels);

  return (
    <>
      <AchievementUnlockNotifier
        unlockedAchievements={recentUnlocked}
        resolveTitle={(a) => resolveText(a).title}
        labels={toastLabels}
      />
      <AchievementShowcase
        achievements={recentUnlocked}
        unlockedCount={unlockedCount}
        totalCount={totalCount}
        labels={showcaseLabels}
        resolveText={resolveText}
        maxVisible={5}
      />
      <section aria-labelledby="next-achievement-heading" className="space-y-3">
        <h2 id="next-achievement-heading" className="sr-only">
          {nextLabels.title}
        </h2>
        <NextAchievementCard
          achievement={nextAchievement}
          labels={nextLabels}
          resolveText={resolveText}
        />
      </section>
    </>
  );
}
