import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { AchievementIcon, RARITY_STYLES } from "@/components/achievements/achievement-icon";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { formatAchievementProgressMessage } from "@/lib/achievements/achievement-utils";
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
  achievement: EvaluatedAchievement | null;
  labels: NextAchievementCardLabels;
  resolveText: (achievement: EvaluatedAchievement) => { title: string; description: string };
}

export function NextAchievementCard({
  achievement,
  labels,
  resolveText,
}: NextAchievementCardProps) {
  if (!achievement) {
    return (
      <CambaCard variant="default" padding="md" className="border-dashed border-program/20">
        <div className="flex items-start gap-3">
          <div className="camba-icon-box bg-program-muted text-program">
            <Target className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="camba-h3 text-foreground">{labels.emptyTitle}</p>
            <p className="camba-caption text-muted mt-1">{labels.emptyDescription}</p>
            <Button variant="outline" size="sm" className="mt-3" asChild>
              <Link href="/learning">{labels.emptyAction}</Link>
            </Button>
          </div>
        </div>
      </CambaCard>
    );
  }

  const text = resolveText(achievement);
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
            <p className="camba-h3 text-foreground mt-0.5">{text.title}</p>
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
