import { AchievementEmptyState } from "@/components/camba/empty-states";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { AchievementIcon, RARITY_STYLES } from "@/components/achievements/achievement-icon";
import type { ResolvedEvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { formatAchievementProgressMessage } from "@/lib/achievements/achievement-utils";
import { Link } from "@/i18n/routing";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export type NextAchievementCardLabels = {
  title: string;
  subtitle: string;
  progressRemaining: string;
  progressComplete: string;
  viewAchievements: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
};

interface NextAchievementCardProps {
  achievement: ResolvedEvaluatedAchievement | null;
  labels: NextAchievementCardLabels;
}

export function NextAchievementCard({
  achievement,
  labels,
}: NextAchievementCardProps) {
  if (!achievement) {
    return (
      <AchievementEmptyState
        icon={Target}
        variant="inline"
        title={labels.emptyTitle}
        description={labels.emptyDescription}
        primaryAction={{ label: labels.emptyAction, href: "/learning" }}
      />
    );
  }

  const styles = RARITY_STYLES[achievement.rarity];
  const progressMessage = formatAchievementProgressMessage(achievement, {
    remaining: labels.progressRemaining,
    complete: labels.progressComplete,
  });

  return (
    <CambaCard variant="achievement" padding="md" className={`ring-2 ${styles.ring}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className={`camba-icon-box shrink-0 ${styles.bg} ${styles.text}`}>
            <AchievementIcon name={achievement.icon} />
          </div>
          <div className="min-w-0">
            <p className="camba-caption font-bold text-program uppercase tracking-wide">
              {labels.title}
            </p>
            <p className="camba-h3 text-foreground mt-0.5">{achievement.title}</p>
            <p className="camba-caption text-muted mt-1">{progressMessage}</p>
            <div
              className="mt-2 h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden max-w-xs"
              role="progressbar"
              aria-valuenow={achievement.progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={labels.subtitle}
            >
              <div
                className="h-full rounded-full bg-program"
                style={{ width: `${achievement.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
        <Button variant="outline" size="sm" className="shrink-0" asChild>
          <Link href="/achievements">{labels.viewAchievements}</Link>
        </Button>
      </div>
    </CambaCard>
  );
}
