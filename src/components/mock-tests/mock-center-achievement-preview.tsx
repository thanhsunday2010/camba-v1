"use client";

import { Link } from "@/i18n/routing";
import { NextAchievementCard, type NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import { AchievementCard, type AchievementCardLabels } from "@/components/achievements/achievement-card";
import { resolveAchievementText } from "@/lib/achievements/achievement-i18n";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { Award } from "lucide-react";

interface MockCenterAchievementPreviewProps {
  recentUnlocked: EvaluatedAchievement[];
  nextAchievement: EvaluatedAchievement | null;
  itemLabels: Record<string, { title: string; description: string }>;
  cardLabels: AchievementCardLabels;
  nextLabels: NextAchievementCardLabels;
  labels: {
    title: string;
    subtitle: string;
  };
}

export function MockCenterAchievementPreview({
  recentUnlocked,
  nextAchievement,
  itemLabels,
  cardLabels,
  nextLabels,
  labels,
}: MockCenterAchievementPreviewProps) {
  const resolveText = (a: EvaluatedAchievement) => resolveAchievementText(a, itemLabels);

  return (
    <section aria-labelledby="mock-achievements-heading" className="space-y-4">
      <header>
        <h2
          id="mock-achievements-heading"
          className="camba-h2 text-foreground flex items-center gap-2"
        >
          <Award className="h-5 w-5 text-[var(--color-badge)]" aria-hidden />
          {labels.title}
        </h2>
        <p className="camba-caption text-muted mt-1">{labels.subtitle}</p>
      </header>

      {recentUnlocked.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2" role="list">
          {recentUnlocked.map((achievement) => {
            const text = resolveText(achievement);
            return (
              <div key={achievement.id} role="listitem">
                <Link href="/achievements" className="block camba-focus-ring rounded-2xl">
                  <AchievementCard
                    achievement={achievement}
                    title={text.title}
                    description={text.description}
                    labels={cardLabels}
                    compact
                  />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {nextAchievement && (
        <NextAchievementCard
          achievement={nextAchievement}
          labels={nextLabels}
          resolveText={resolveText}
        />
      )}
    </section>
  );
}
