"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Award } from "lucide-react";
import { createElement } from "react";
import { useMotionCelebration } from "@/components/camba/motion/motion-celebration-provider";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";

const STORAGE_KEY = "camba_seen_achievements";

function readSeenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function writeSeenIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export type AchievementUnlockToastLabels = {
  unlocked: string;
  celebration: string;
};

interface AchievementUnlockNotifierProps {
  unlockedAchievements: EvaluatedAchievement[];
  resolveTitle: (achievement: EvaluatedAchievement) => string;
  labels: AchievementUnlockToastLabels;
}

export function AchievementUnlockNotifier({
  unlockedAchievements,
  resolveTitle,
  labels,
}: AchievementUnlockNotifierProps) {
  const notifiedRef = useRef(false);
  const motionCelebration = useMotionCelebration();

  useEffect(() => {
    if (notifiedRef.current || unlockedAchievements.length === 0) return;
    notifiedRef.current = true;

    const seen = readSeenIds();
    const newlyUnlocked = unlockedAchievements.filter((a) => a.unlocked && !seen.has(a.id));

    if (newlyUnlocked.length === 0) return;

    for (const achievement of newlyUnlocked.slice(0, 3)) {
      const title = resolveTitle(achievement);
      toast.success(labels.unlocked.replace("{name}", title), {
        description: labels.celebration,
        icon: createElement(Award, { className: "h-4 w-4 text-[var(--color-badge)]" }),
        duration: 4500,
      });
      motionCelebration?.showBadgeMoment(title, labels.celebration);
      seen.add(achievement.id);
    }

    writeSeenIds(seen);
  }, [unlockedAchievements, resolveTitle, labels, motionCelebration]);

  return null;
}

export function showAchievementUnlockToast(
  title: string,
  labels: AchievementUnlockToastLabels
) {
  toast.success(labels.unlocked.replace("{name}", title), {
    description: labels.celebration,
    icon: createElement(Award, { className: "h-4 w-4 text-[var(--color-badge)]" }),
    duration: 4500,
  });
}
