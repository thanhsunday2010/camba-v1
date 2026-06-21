import { SectionHeader } from "@/components/camba/section-header";
import { RewardSummaryCard } from "@/components/camba/cards/mission-reward-cards";
import { CelebrationBanner } from "@/components/camba/feedback/banners";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardMissionCard } from "@/components/dashboard/dashboard-mission-card";
import { MissionProgressRing } from "@/components/dashboard/mission-progress-ring";
import type { DailyMissionItem } from "@/components/gamification/daily-missions";
import { Target } from "lucide-react";

interface TodayMissionSectionProps {
  missions: DailyMissionItem[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    allCompleteTitle: string;
    allCompleteDesc: string;
    progressLabel: string;
    progressRingLabel: string;
    pendingXpLabel: string;
    xpLabel: string;
    coinsLabel: string;
  };
}

export function TodayMissionSection({ missions, labels }: TodayMissionSectionProps) {
  const completed = missions.filter((m) => m.isCompleted).length;
  const total = missions.length;
  const allComplete = total > 0 && completed === total;
  const totalXp = missions.reduce((sum, m) => sum + (m.isCompleted ? m.xpReward : 0), 0);
  const totalCoins = missions.reduce((sum, m) => sum + (m.isCompleted ? m.coinReward : 0), 0);
  const pendingXp = missions.reduce(
    (sum, m) => sum + (!m.isCompleted ? m.xpReward : 0),
    0
  );

  return (
    <section aria-labelledby="today-missions-heading" className="camba-scale-in">
      <SectionHeader
        title={labels.title}
        description={labels.subtitle}
        icon={Target}
        action={
          total > 0 ? (
            <MissionProgressRing
              completed={completed}
              total={total}
              label={labels.progressRingLabel}
            />
          ) : undefined
        }
      />

      {allComplete && (
        <CelebrationBanner
          title={labels.allCompleteTitle}
          description={labels.allCompleteDesc}
          className="mb-4"
        />
      )}

      {missions.length === 0 ? (
        <DashboardEmptyState
          icon={Target}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <div className="space-y-4">
          {allComplete && (totalXp > 0 || totalCoins > 0) && (
            <RewardSummaryCard
              title={labels.allCompleteDesc}
              xp={totalXp}
              coins={totalCoins}
              xpLabel={labels.xpLabel}
              coinsLabel={labels.coinsLabel}
            />
          )}

          {!allComplete && pendingXp > 0 && (
            <p className="camba-caption text-muted px-1">
              {labels.pendingXpLabel.replace("{xp}", String(pendingXp)).replace("{label}", labels.xpLabel)}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {missions.map((mission) => {
              const progress = Math.min(
                100,
                Math.round((mission.currentValue / mission.targetValue) * 100)
              );
              return (
                <DashboardMissionCard
                  key={mission.id}
                  title={mission.title}
                  description={mission.description ?? undefined}
                  progress={progress}
                  progressLabel={`${mission.currentValue}/${mission.targetValue}`}
                  completed={mission.isCompleted}
                  xpReward={mission.xpReward}
                  coinReward={mission.coinReward}
                  xpLabel={labels.xpLabel}
                  coinsLabel={labels.coinsLabel}
                />
              );
            })}
          </div>

          {completed > 0 && !allComplete && (
            <p className="camba-caption text-muted text-center sm:text-left">
              {labels.progressLabel
                .replace("{done}", String(completed))
                .replace("{total}", String(total))}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
