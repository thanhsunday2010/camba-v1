"use client";

import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { AchievementIcon, AchievementRarityBadge, RARITY_STYLES } from "@/components/achievements/achievement-icon";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

export type AchievementCardLabels = {
  rarity: Record<string, string>;
  locked: string;
  unlocked: string;
  progress: string;
};

interface AchievementCardProps {
  achievement: EvaluatedAchievement;
  title: string;
  description: string;
  labels: AchievementCardLabels;
  onClick?: () => void;
  compact?: boolean;
  className?: string;
}

export function AchievementCard({
  achievement,
  title,
  description,
  labels,
  onClick,
  compact,
  className,
}: AchievementCardProps) {
  const styles = RARITY_STYLES[achievement.rarity];
  const rarityLabel = labels.rarity[achievement.rarity] ?? achievement.rarity;

  const body = (
    <CambaCard
      variant={achievement.unlocked ? "achievement" : "default"}
      padding={compact ? "sm" : "md"}
      interactive={!!onClick}
      className={cn(
        "h-full flex flex-col",
        achievement.unlocked && `ring-2 ${styles.ring}`,
        !achievement.unlocked && "opacity-80",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "camba-icon-box shrink-0",
            achievement.unlocked ? styles.bg : "bg-[var(--surface-sunken)]",
            achievement.unlocked ? styles.text : "text-[var(--status-locked)]"
          )}
        >
          {achievement.unlocked ? (
            <AchievementIcon name={achievement.icon} unlocked />
          ) : (
            <Lock className="h-5 w-5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <AchievementRarityBadge rarity={achievement.rarity} label={rarityLabel} />
            <span className="sr-only">
              {achievement.unlocked ? labels.unlocked : labels.locked}
            </span>
          </div>
          <h3 className={cn(compact ? "camba-h3 text-sm" : "camba-h3", "text-foreground")}>
            {title}
          </h3>
          {!compact && (
            <p className="camba-caption text-muted mt-1 line-clamp-2">{description}</p>
          )}
        </div>
      </div>

      {!achievement.unlocked && achievement.progressTarget > 1 && (
        <div className="mt-3 space-y-1">
          <div
            className="h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden"
            role="progressbar"
            aria-valuenow={achievement.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={labels.progress}
          >
            <div
              className="h-full rounded-full bg-program transition-all"
              style={{ width: `${achievement.progressPercent}%` }}
            />
          </div>
          <p className="camba-caption text-muted">
            {achievement.progressCurrent}/{achievement.progressTarget}
          </p>
        </div>
      )}
    </CambaCard>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left camba-focus-ring rounded-2xl"
        aria-label={title}
      >
        {body}
      </button>
    );
  }

  return body;
}
