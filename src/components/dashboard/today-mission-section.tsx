import { SectionHeader } from "@/components/camba/section-header";
import { MissionCard } from "@/components/camba/cards/mission-reward-cards";
import { RewardSummaryCard } from "@/components/camba/cards/mission-reward-cards";
import { MissionCompletedBanner } from "@/components/camba/feedback/banners";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import type { DailyMissionItem } from "@/components/gamification/daily-missions";
import { Target, Trophy } from "lucide-react";

interface TodayMissionSectionProps {
  missions: DailyMissionItem[];
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    allCompleteTitle: string;
    allCompleteDesc: string;
    progressLabel: string;
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

  return (
    <section aria-labelledby="today-missions-heading">
      <SectionHeader title={labels.title} description={labels.subtitle} icon={Target} />

      {allComplete && (
        <MissionCompletedBanner title={labels.allCompleteTitle} description={labels.allCompleteDesc} className="mb-4" />
      )}

      {missions.length === 0 ? (
        <EmptyStateIllustrated
          icon={Target}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <div className="space-y-4">
          {allComplete && (
            <RewardSummaryCard
              title={labels.allCompleteDesc}
              xp={totalXp}
              coins={totalCoins}
              xpLabel={labels.xpLabel}
              coinsLabel={labels.coinsLabel}
            />
          )}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((mission) => {
              const progress = Math.min(
                100,
                Math.round((mission.currentValue / mission.targetValue) * 100)
              );
              return (
                <MissionCard
                  key={mission.id}
                  title={mission.title}
                  description={
                    mission.description ??
                    `+${mission.xpReward} ${labels.xpLabel}${mission.coinReward ? ` · +${mission.coinReward} ${labels.coinsLabel}` : ""}`
                  }
                  progress={progress}
                  progressLabel={`${mission.currentValue}/${mission.targetValue}`}
                  completed={mission.isCompleted}
                  className={mission.isCompleted ? "ring-1 ring-success/30" : undefined}
                />
              );
            })}
          </div>
          {completed > 0 && !allComplete && (
            <p className="camba-caption text-muted flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-[var(--color-badge)]" />
              {labels.progressLabel.replace("{done}", String(completed)).replace("{total}", String(total))}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
