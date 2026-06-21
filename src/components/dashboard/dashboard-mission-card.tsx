import { cn } from "@/lib/utils";
import { MissionCard } from "@/components/camba/cards/mission-reward-cards";
import { Coins, Zap } from "lucide-react";

interface DashboardMissionCardProps {
  title: string;
  description?: string;
  progress: number;
  progressLabel?: string;
  completed?: boolean;
  xpReward: number;
  coinReward?: number;
  xpLabel: string;
  coinsLabel: string;
  className?: string;
}

export function DashboardMissionCard({
  title,
  description,
  progress,
  progressLabel,
  completed,
  xpReward,
  coinReward = 0,
  xpLabel,
  coinsLabel,
  className,
}: DashboardMissionCardProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute -top-2 right-3 z-10 flex gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold shadow-sm",
            completed
              ? "bg-success/15 text-success"
              : "bg-[var(--color-xp)]/15 text-[var(--color-xp)]"
          )}
        >
          <Zap className="h-3 w-3" />
          +{xpReward} {xpLabel}
        </span>
        {coinReward > 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold shadow-sm",
              completed
                ? "bg-success/15 text-success"
                : "bg-[var(--color-coins)]/15 text-[var(--color-coins)]"
            )}
          >
            <Coins className="h-3 w-3" />+{coinReward}
          </span>
        )}
      </div>
      <MissionCard
        title={title}
        description={description}
        progress={progress}
        progressLabel={progressLabel}
        completed={completed}
        className={cn(
          "pt-4 transition-shadow duration-200",
          completed && "ring-2 ring-success/25 bg-success/[0.03]",
          !completed && progress > 0 && "ring-1 ring-program/15"
        )}
      />
    </div>
  );
}
