"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LevelUpModal } from "@/components/camba/celebration/level-up-modal";
import { BadgeUnlockModal } from "@/components/camba/celebration/badge-unlock-modal";
import {
  MotionCelebrationProvider,
  useMotionCelebration,
} from "@/components/camba/motion/motion-celebration-provider";
import { useMascotOptional } from "@/components/mascot/mascot-provider";
import {
  showBadgeEarnedToast,
  showLevelUpToast,
  showXpEarnedToast,
  type RewardToastLabels,
} from "@/lib/design/rewards";

interface CelebrationContextValue {
  celebrateXp: (amount: number) => void;
  celebrateLevelUp: (level: number) => void;
  celebrateBadge: (name: string, description?: string) => void;
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

interface CelebrationProviderInnerProps {
  children: React.ReactNode;
  labels?: RewardToastLabels;
  useModalsForMajorEvents?: boolean;
}

function CelebrationProviderInner({
  children,
  labels,
  useModalsForMajorEvents = true,
}: CelebrationProviderInnerProps) {
  const motionCelebration = useMotionCelebration();
  const mascot = useMascotOptional();
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState<string | undefined>();

  const celebrateXp = useCallback(
    (amount: number) => {
      showXpEarnedToast(amount, labels);
      motionCelebration?.showXpBurst(amount);
      mascot?.cheerXp(amount);
    },
    [labels, motionCelebration, mascot]
  );

  const celebrateLevelUp = useCallback(
    (level: number) => {
      showLevelUpToast(level, labels);
      motionCelebration?.showXpBurst(level * 10);
      mascot?.cheerLevelUp(level);
      if (useModalsForMajorEvents) {
        setLevelUpLevel(level);
        setLevelUpOpen(true);
      }
    },
    [labels, useModalsForMajorEvents, motionCelebration, mascot]
  );

  const celebrateBadge = useCallback(
    (name: string, description?: string) => {
      showBadgeEarnedToast(name, labels);
      motionCelebration?.showBadgeMoment(name, description);
      mascot?.cheerBadge(name);
      if (useModalsForMajorEvents) {
        setBadgeName(name);
        setBadgeDescription(description);
        setBadgeOpen(true);
      }
    },
    [labels, useModalsForMajorEvents, motionCelebration, mascot]
  );

  const value = useMemo(
    () => ({ celebrateXp, celebrateLevelUp, celebrateBadge }),
    [celebrateXp, celebrateLevelUp, celebrateBadge]
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

interface CelebrationProviderProps {
  children: React.ReactNode;
  labels?: RewardToastLabels;
  useModalsForMajorEvents?: boolean;
}

export function CelebrationProvider(props: CelebrationProviderProps) {
  return (
    <MotionCelebrationProvider>
      <CelebrationProviderInner {...props} />
    </MotionCelebrationProvider>
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
