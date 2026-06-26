import { toast } from "sonner";
import { Sparkles, Trophy, Award } from "lucide-react";
import { createElement } from "react";

export interface RewardToastLabels {
  xpEarned: string;
  levelUp: string;
  badgeEarned: string;
  leaguePromotion?: string;
  coinsEarned?: string;
}

const defaultLabels: RewardToastLabels = {
  xpEarned: "Nhận +{amount} XP",
  levelUp: "Lên cấp {level}!",
  badgeEarned: "Huy hiệu mới: {name}",
  leaguePromotion: "Thăng hạng {tier}! · Hạng #{rank}",
  coinsEarned: "Nhận +{amount} xu",
};

function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

export function showXpEarnedToast(
  amount: number,
  labels: RewardToastLabels = defaultLabels,
  options?: { leagueRank?: number | null; leagueTier?: string | null }
) {
  const rankSuffix =
    options?.leagueRank != null ? ` · Hạng #${options.leagueRank}` : "";
  toast.success(`${interpolate(labels.xpEarned, { amount })}${rankSuffix}`, {
    icon: createElement(Sparkles, { className: "h-4 w-4 text-primary" }),
    duration: 3500,
  });
}

export function showLeaguePromotionToast(
  tierName: string,
  rank: number | null,
  labels: RewardToastLabels = defaultLabels
) {
  const template = labels.leaguePromotion ?? defaultLabels.leaguePromotion!;
  toast.success(
    rank != null
      ? interpolate(template, { tier: tierName, rank })
      : `Thăng hạng ${tierName}!`,
    {
      icon: createElement(Trophy, { className: "h-4 w-4 text-program" }),
      duration: 5000,
    }
  );
}

export function showLevelUpToast(level: number, labels: RewardToastLabels = defaultLabels) {
  toast.success(interpolate(labels.levelUp, { level }), {
    icon: createElement(Trophy, { className: "h-4 w-4 text-warning" }),
    duration: 5000,
  });
}

export function showBadgeEarnedToast(name: string, labels: RewardToastLabels = defaultLabels) {
  toast.success(interpolate(labels.badgeEarned, { name }), {
    icon: createElement(Award, { className: "h-4 w-4 text-warning" }),
    duration: 5000,
  });
}

export function showCoinsEarnedToast(amount: number, labels: RewardToastLabels = defaultLabels) {
  const template = labels.coinsEarned ?? defaultLabels.coinsEarned!;
  toast.success(interpolate(template, { amount }), {
    duration: 3500,
  });
}

export type { RewardToastLabels as CambaRewardLabels };
