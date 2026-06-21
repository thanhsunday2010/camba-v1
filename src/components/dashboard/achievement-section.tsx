import { SectionHeader } from "@/components/camba/section-header";
import { BadgeCard } from "@/components/camba/gamification/badge-streak-cards";
import { RewardSummaryCard } from "@/components/camba/cards/mission-reward-cards";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { BadgeItem } from "@/components/gamification/badge-grid";
import { Award, Lock } from "lucide-react";

interface AchievementSectionProps {
  badges: BadgeItem[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    nextBadgeTitle: string;
    recentEarnedTitle: string;
    earnedSummary: string;
  };
}

export function AchievementSection({ badges, labels }: AchievementSectionProps) {
  const earned = badges.filter((b) => b.earned);
  const locked = badges.filter((b) => !b.earned);
  const recent = [...earned]
    .sort((a, b) => {
      if (!a.earnedAt || !b.earnedAt) return 0;
      return b.earnedAt.localeCompare(a.earnedAt);
    })
    .slice(0, 4);
  const nextBadge = locked[0];

  return (
    <section aria-labelledby="achievements-heading">
      <SectionHeader title={labels.title} description={labels.subtitle} icon={Award} />

      {earned.length === 0 && !nextBadge ? (
        <EmptyStateIllustrated
          icon={Award}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <div className="space-y-4">
          {recent.length > 0 && (
            <>
              <p className="camba-caption text-muted font-semibold">{labels.recentEarnedTitle}</p>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                {recent.map((badge) => (
                  <div key={badge.id} className="snap-start shrink-0 w-[140px]">
                    <BadgeCard
                      name={badge.name}
                      description={badge.description ?? undefined}
                      earned
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {nextBadge && (
            <CambaCard variant="achievement" padding="md">
              <div className="flex items-start gap-3">
                <div className="camba-icon-box-md bg-[var(--surface-sunken)] text-[var(--status-locked)]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="camba-caption text-muted">{labels.nextBadgeTitle}</p>
                  <p className="camba-h3 text-foreground mt-0.5">{nextBadge.name}</p>
                  {nextBadge.description && (
                    <p className="camba-caption text-muted mt-1">{nextBadge.description}</p>
                  )}
                </div>
              </div>
            </CambaCard>
          )}

          {earned.length > 0 && (
            <RewardSummaryCard title={labels.earnedSummary} badges={earned.slice(0, 3).map((b) => b.name)} />
          )}
        </div>
      )}
    </section>
  );
}
