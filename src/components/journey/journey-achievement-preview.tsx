"use client";

import { Link } from "@/i18n/routing";
import { AchievementCard, type AchievementCardLabels } from "@/components/achievements/achievement-card";
import { resolveAchievementText } from "@/lib/achievements/achievement-i18n";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardHubHref } from "@/lib/dashboard/dashboard-hub-routes";

interface JourneyAchievementPreviewProps {
  achievements: EvaluatedAchievement[];
  itemLabels: Record<string, { title: string; description: string }>;
  labels: AchievementCardLabels & {
    title: string;
    subtitle: string;
    viewAll: string;
    linkedMilestone: string;
  };
}

export function JourneyAchievementPreview({
  achievements,
  itemLabels,
  labels,
}: JourneyAchievementPreviewProps) {
  if (achievements.length === 0) return null;

  const resolveText = (a: EvaluatedAchievement) => resolveAchievementText(a, itemLabels);

  return (
    <section aria-labelledby="journey-achievements-heading">
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <div>
          <h2
            id="journey-achievements-heading"
            className="camba-h2 text-foreground flex items-center gap-2"
          >
            <Award className="h-5 w-5 text-[var(--color-badge)]" aria-hidden />
            {labels.title}
          </h2>
          <p className="camba-caption text-muted mt-1">{labels.subtitle}</p>
        </div>
        <Link href={dashboardHubHref("achievements")}>
          <Button variant="ghost" size="sm">
            {labels.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {achievements.map((achievement) => {
          const text = resolveText(achievement);
          return (
            <div key={achievement.id} role="listitem">
              <AchievementCard
                achievement={achievement}
                title={text.title}
                description={text.description}
                labels={labels}
                compact
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
