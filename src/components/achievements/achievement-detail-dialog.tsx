"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AchievementIcon, AchievementRarityBadge, RARITY_STYLES } from "@/components/achievements/achievement-icon";
import type { AchievementCardLabels } from "@/components/achievements/achievement-card";
import type { AchievementCategory, ResolvedEvaluatedAchievement } from "@/lib/achievements/achievement-types";
import { formatAchievementProgressMessage } from "@/lib/achievements/achievement-utils";
import { CheckCircle2, Lock } from "lucide-react";

export type AchievementDetailLabels = AchievementCardLabels & {
  category: Record<AchievementCategory, string>;
  unlockCondition: string;
  progressLabel: string;
  unlockedOn: string;
  relatedMilestone: string;
  progressRemaining: string;
  progressComplete: string;
  nextStep: string;
};

interface AchievementDetailDialogProps {
  achievement: ResolvedEvaluatedAchievement | null;
  labels: AchievementDetailLabels;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AchievementDetailDialog({
  achievement,
  labels,
  open,
  onOpenChange,
}: AchievementDetailDialogProps) {
  if (!achievement) return null;

  const categoryLabel = labels.category[achievement.category] ?? achievement.category;
  const styles = RARITY_STYLES[achievement.rarity];
  const progressMessage = formatAchievementProgressMessage(achievement, {
    remaining: labels.progressRemaining,
    complete: labels.progressComplete,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className={`camba-icon-box-lg shrink-0 ${achievement.unlocked ? styles.bg : "bg-[var(--surface-sunken)]"} ${achievement.unlocked ? styles.text : "text-[var(--status-locked)]"}`}
            >
              {achievement.unlocked ? (
                <AchievementIcon name={achievement.icon} unlocked className="h-6 w-6" />
              ) : (
                <Lock className="h-6 w-6" aria-hidden />
              )}
            </div>
            <div className="min-w-0 text-left">
              <DialogTitle className="camba-h2">{achievement.title}</DialogTitle>
              <DialogDescription className="camba-caption text-muted mt-1">
                {achievement.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 camba-caption">
          <div className="flex flex-wrap gap-2">
            <AchievementRarityBadge
              rarity={achievement.rarity}
              label={labels.rarity[achievement.rarity] ?? achievement.rarity}
            />
            <span className="inline-flex rounded-full bg-[var(--surface-sunken)] px-2 py-0.5 font-medium text-muted">
              {categoryLabel}
            </span>
          </div>

          <div className="rounded-xl border border-border/60 bg-[var(--surface-sunken)]/40 p-3 space-y-2">
            <p className="font-semibold text-foreground">{labels.unlockCondition}</p>
            <p className="text-muted">{achievement.description}</p>
            {!achievement.unlocked && (
              <>
                <p className="font-semibold text-foreground pt-1">{labels.progressLabel}</p>
                <p className="text-muted">{progressMessage}</p>
                <div
                  className="h-2 rounded-full bg-white overflow-hidden"
                  role="progressbar"
                  aria-valuenow={achievement.progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-program"
                    style={{ width: `${achievement.progressPercent}%` }}
                  />
                </div>
              </>
            )}
            {achievement.unlocked && achievement.unlockedAt && (
              <p className="text-muted flex items-center gap-1.5 pt-1">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden />
                {labels.unlockedOn}{" "}
                {new Date(achievement.unlockedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          {achievement.relatedAchievementId && (
            <p className="text-muted">
              <span className="font-semibold text-foreground">{labels.nextStep}: </span>
              {labels.relatedMilestone}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
