import { SectionHeader } from "@/components/camba/section-header";
import { BadgeCard } from "@/components/camba/gamification/badge-streak-cards";
import { RewardSummaryCard } from "@/components/camba/cards/mission-reward-cards";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { cn } from "@/lib/utils";
import type { BadgeItem } from "@/components/gamification/badge-grid";
import { Award, Lock, Sparkles } from "lucide-react";

interface AchievementSectionProps {
  badges: BadgeItem[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
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
        <DashboardEmptyState
          icon={Award}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <div className="space-y-4">
          {recent.length > 0 && (
            <>
              <p className="camba-caption text-muted font-semibold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[var(--color-badge)]" />
                {labels.recentEarnedTitle}
              </p>
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory scrollbar-none">
                {recent.map((badge) => (
                  <div
                    key={badge.id}
                    className="snap-start shrink-0 w-[9.5rem] sm:w-[10.5rem] relative"
                  >
                    <div className="absolute inset-0 rounded-2xl camba-badge-shine pointer-events-none opacity-60" />
                    <BadgeCard
                      name={badge.name}
                      description={badge.description ?? undefined}
                      earned
                      className={cn("relative ring-2 ring-[var(--color-badge)]/20 shadow-md")}
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {nextBadge && (
            <CambaCard variant="achievement" padding="md" className="border-dashed border-program/20">
              <div className="flex items-start gap-3">
                <div className="camba-icon-box-md bg-gradient-to-br from-[var(--surface-sunken)] to-program-muted text-[var(--status-locked)]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="camba-caption text-program font-bold">{labels.nextBadgeTitle}</p>
                  <p className="camba-h3 text-foreground mt-0.5">{nextBadge.name}</p>
                  {nextBadge.description && (
                    <p className="camba-caption text-muted mt-1 leading-relaxed">
                      {nextBadge.description}
                    </p>
                  )}
                </div>
              </div>
            </CambaCard>
          )}

          {earned.length > 0 && (
            <RewardSummaryCard
              title={labels.earnedSummary}
              badges={earned.slice(0, 3).map((b) => b.name)}
            />
          )}
        </div>
      )}
    </section>
  );
}
