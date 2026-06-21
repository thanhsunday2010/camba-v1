import { SectionHeader } from "@/components/camba/section-header";
import { BadgeCard } from "@/components/camba/gamification/badge-streak-cards";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import type { BadgeItem } from "@/components/gamification/badge-grid";
import { Award } from "lucide-react";

interface DashboardRecentBadgesProps {
  badges: BadgeItem[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  viewAllLabel?: string;
  earnedCountLabel?: string;
}

export function DashboardRecentBadges({
  badges,
  title,
  emptyTitle,
  emptyDescription,
  viewAllLabel,
  earnedCountLabel,
}: DashboardRecentBadgesProps) {
  const earned = badges.filter((b) => b.earned);
  const recent = [...earned]
    .sort((a, b) => {
      if (!a.earnedAt || !b.earnedAt) return 0;
      return b.earnedAt.localeCompare(a.earnedAt);
    })
    .slice(0, 4);

  return (
    <div>
      <SectionHeader title={title} icon={Award} />
      {recent.length === 0 ? (
        <EmptyStateIllustrated
          icon={Award}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {recent.map((badge) => (
              <BadgeCard
                key={badge.id}
                name={badge.name}
                description={badge.description ?? undefined}
                earned={badge.earned}
              />
            ))}
          </div>
          {earned.length > 4 && earnedCountLabel && (
            <CambaCard variant="default" padding="sm" className="mt-3 text-center">
              <p className="camba-caption text-muted">{earnedCountLabel}</p>
            </CambaCard>
          )}
        </>
      )}
    </div>
  );
}
