"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LevelUpModal } from "@/components/camba/celebration/level-up-modal";
import { BadgeUnlockModal } from "@/components/camba/celebration/badge-unlock-modal";
import {
  showBadgeEarnedToast,
  showLevelUpToast,
  showMissionCompleteToast,
  showXpEarnedToast,
  type RewardToastLabels,
} from "@/lib/design/rewards";

interface CelebrationContextValue {
  celebrateXp: (amount: number) => void;
  celebrateLevelUp: (level: number) => void;
  celebrateBadge: (name: string, description?: string) => void;
  celebrateMission: () => void;
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

interface CelebrationProviderProps {
  children: React.ReactNode;
  labels?: RewardToastLabels;
  useModalsForMajorEvents?: boolean;
}

export function CelebrationProvider({
  children,
  labels,
  useModalsForMajorEvents = true,
}: CelebrationProviderProps) {
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState<string | undefined>();

  const celebrateXp = useCallback(
    (amount: number) => {
      showXpEarnedToast(amount, labels);
    },
    [labels]
  );

  const celebrateLevelUp = useCallback(
    (level: number) => {
      showLevelUpToast(level, labels);
      if (useModalsForMajorEvents) {
        setLevelUpLevel(level);
        setLevelUpOpen(true);
      }
    },
    [labels, useModalsForMajorEvents]
  );

  const celebrateBadge = useCallback(
    (name: string, description?: string) => {
      showBadgeEarnedToast(name, labels);
      if (useModalsForMajorEvents) {
        setBadgeName(name);
        setBadgeDescription(description);
        setBadgeOpen(true);
      }
    },
    [labels, useModalsForMajorEvents]
  );

  const celebrateMission = useCallback(() => {
    showMissionCompleteToast(labels);
  }, [labels]);

  const value = useMemo(
    () => ({ celebrateXp, celebrateLevelUp, celebrateBadge, celebrateMission }),
    [celebrateXp, celebrateLevelUp, celebrateBadge, celebrateMission]
  );

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <LevelUpModal open={levelUpOpen} onOpenChange={setLevelUpOpen} level={levelUpLevel} />
      <BadgeUnlockModal
        open={badgeOpen}
        onOpenChange={setBadgeOpen}
        badgeName={badgeName}
        badgeDescription={badgeDescription}
      />
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext);
  if (!ctx) {
    throw new Error("useCelebration must be used within CelebrationProvider");
  }
  return ctx;
}

/** Safe hook when provider may be absent (e.g. auth pages) */
export function useCelebrationOptional() {
  return useContext(CelebrationContext);
}
