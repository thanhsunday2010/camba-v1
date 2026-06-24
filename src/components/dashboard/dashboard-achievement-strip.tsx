import { SectionHeader } from "@/components/camba/section-header";
import { BadgeCard } from "@/components/camba/gamification/badge-streak-cards";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { BadgeItem } from "@/components/gamification/badge-grid";
import { Award } from "lucide-react";

interface DashboardAchievementStripProps {
  badges: BadgeItem[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
  };
  maxVisible?: number;
}

export function DashboardAchievementStrip({
  badges,
  labels,
  maxVisible = 5,
}: DashboardAchievementStripProps) {
  const earned = badges
    .filter((b) => b.earned)
    .sort((a, b) => {
      if (!a.earnedAt || !b.earnedAt) return 0;
      return b.earnedAt.localeCompare(a.earnedAt);
    })
    .slice(0, maxVisible);

  return (
    <section aria-labelledby="achievements-strip-heading">
      <SectionHeader
        titleId="achievements-strip-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Award}
      />

      {earned.length === 0 ? (
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
          {earned.map((badge) => (
            <div
              key={badge.id}
              role="listitem"
              className="snap-start shrink-0 w-[9.5rem] sm:w-[10.5rem]"
            >
              <BadgeCard
                name={badge.name}
                description={badge.description ?? undefined}
                earned
                className="ring-2 ring-[var(--color-badge)]/15 shadow-sm h-full"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
