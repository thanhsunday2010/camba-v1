import { SectionHeader } from "@/components/camba/section-header";
import { MissionCard } from "@/components/camba/cards/mission-reward-cards";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import type { DailyMissionItem } from "@/components/gamification/daily-missions";
import { Target } from "lucide-react";

interface DashboardMissionsProps {
  missions: DailyMissionItem[];
  title: string;
  emptyTitle: string;
  emptyDescription: string;
}

export function DashboardMissions({
  missions,
  title,
  emptyTitle,
  emptyDescription,
}: DashboardMissionsProps) {
  return (
    <div>
      <SectionHeader title={title} icon={Target} />
      {missions.length === 0 ? (
        <EmptyStateIllustrated
          icon={Target}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="space-y-3">
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
                  `+${mission.xpReward} XP${mission.coinReward ? ` · +${mission.coinReward} xu` : ""}`
                }
                progress={progress}
                progressLabel={`${mission.currentValue}/${mission.targetValue}`}
                completed={mission.isCompleted}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Compact mission summary for sidebar */
export function DashboardMissionsSummary({
  missions,
  title,
  completedLabel,
}: {
  missions: DailyMissionItem[];
  title: string;
  completedLabel: string;
}) {
  const completed = missions.filter((m) => m.isCompleted).length;
  const total = missions.length;

  if (total === 0) return null;

  return (
    <CambaCard variant="mission" padding="md">
      <p className="camba-caption text-muted">{title}</p>
      <p className="camba-stat text-program text-xl mt-1">
        {completed}/{total}
      </p>
      <p className="camba-caption text-muted mt-1">{completedLabel}</p>
    </CambaCard>
  );
}
