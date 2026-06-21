import { toast } from "sonner";
import { Sparkles, Trophy, Award, Flame } from "lucide-react";
import { createElement } from "react";

export interface RewardToastLabels {
  xpEarned: string;
  levelUp: string;
  badgeEarned: string;
  missionComplete: string;
  coinsEarned?: string;
}

const defaultLabels: RewardToastLabels = {
  xpEarned: "Nhận +{amount} XP",
  levelUp: "Lên cấp {level}!",
  badgeEarned: "Huy hiệu mới: {name}",
  missionComplete: "Hoàn thành nhiệm vụ!",
  coinsEarned: "Nhận +{amount} xu",
};

function interpolate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

export function showXpEarnedToast(amount: number, labels: RewardToastLabels = defaultLabels) {
  toast.success(interpolate(labels.xpEarned, { amount }), {
    icon: createElement(Sparkles, { className: "h-4 w-4 text-primary" }),
    duration: 3500,
  });
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

export function showMissionCompleteToast(labels: RewardToastLabels = defaultLabels) {
  toast.success(labels.missionComplete, {
    icon: createElement(Flame, { className: "h-4 w-4 text-error" }),
    duration: 4000,
  });
}

export function showCoinsEarnedToast(amount: number, labels: RewardToastLabels = defaultLabels) {
  const template = labels.coinsEarned ?? defaultLabels.coinsEarned!;
  toast.success(interpolate(template, { amount }), {
    duration: 3500,
  });
}

export type { RewardToastLabels as CambaRewardLabels };
