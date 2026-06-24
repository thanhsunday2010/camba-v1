"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { AchievementCard, type AchievementCardLabels } from "@/components/achievements/achievement-card";
import { AchievementDetailDialog, type AchievementDetailLabels } from "@/components/achievements/achievement-detail-dialog";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AchievementShowcaseLabels = AchievementCardLabels &
  AchievementDetailLabels & {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    viewAll: string;
    unlockedSummary: string;
  };

interface AchievementShowcaseProps {
  achievements: EvaluatedAchievement[];
  unlockedCount: number;
  totalCount: number;
  labels: AchievementShowcaseLabels;
  resolveText: (achievement: EvaluatedAchievement) => { title: string; description: string };
  maxVisible?: number;
  showViewAll?: boolean;
}

export function AchievementShowcase({
  achievements,
  unlockedCount,
  totalCount,
  labels,
  resolveText,
  maxVisible = 5,
  showViewAll = true,
}: AchievementShowcaseProps) {
  const [selected, setSelected] = useState<EvaluatedAchievement | null>(null);
  const visible = achievements.slice(0, maxVisible);

  return (
    <section aria-labelledby="achievement-showcase-heading">
      <SectionHeader
        titleId="achievement-showcase-heading"
        title={labels.title}
        description={labels.subtitle.replace("{count}", String(unlockedCount)).replace("{total}", String(totalCount))}
        icon={Award}
        action={
          showViewAll ? (
            <Link href="/achievements">
              <Button variant="ghost" size="sm">
                {labels.viewAll}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          ) : undefined
        }
      />

      {visible.length === 0 ? (
        <DashboardEmptyState
          icon={Award}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <div
          className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scrollbar-none"
          role="list"
          aria-label={labels.title}
        >
          {visible.map((achievement) => {
            const text = resolveText(achievement);
            return (
              <div
                key={achievement.id}
                role="listitem"
                className="snap-start shrink-0 w-[10.5rem] sm:w-[11.5rem]"
              >
                <AchievementCard
                  achievement={achievement}
                  title={text.title}
                  description={text.description}
                  labels={labels}
                  compact
                  onClick={() => setSelected(achievement)}
                />
              </div>
            );
          })}
        </div>
      )}

      <AchievementDetailDialog
        achievement={selected}
        labels={labels}
        resolveText={resolveText}
        open={selected != null}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}
