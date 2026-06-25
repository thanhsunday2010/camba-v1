"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { XPGainAnimation, type XPBurst } from "@/components/camba/motion/xp-gain-animation";
import {
  BadgeUnlockAnimation,
  type BadgeUnlockMoment,
} from "@/components/camba/motion/badge-unlock-animation";

interface MotionCelebrationContextValue {
  showXpBurst: (amount: number) => void;
  showBadgeMoment: (title: string, subtitle?: string) => void;
}

const MotionCelebrationContext = createContext<MotionCelebrationContextValue | null>(null);

let burstCounter = 0;

export function MotionCelebrationProvider({ children }: { children: ReactNode }) {
  const [xpBursts, setXpBursts] = useState<XPBurst[]>([]);
  const [badgeMoments, setBadgeMoments] = useState<BadgeUnlockMoment[]>([]);

  const dismissXp = useCallback((id: string) => {
    setXpBursts((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const dismissBadge = useCallback((id: string) => {
    setBadgeMoments((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const showXpBurst = useCallback((amount: number) => {
    const id = `xp-${++burstCounter}`;
    setXpBursts((prev) => [...prev.slice(-2), { id, amount }]);
  }, []);

  const showBadgeMoment = useCallback((title: string, subtitle?: string) => {
    const id = `badge-${++burstCounter}`;
    setBadgeMoments((prev) => [...prev.slice(-1), { id, title, subtitle }]);
  }, []);

  const value = useMemo(
    () => ({ showXpBurst, showBadgeMoment }),
    [showXpBurst, showBadgeMoment]
  );

  return (
    <MotionCelebrationContext.Provider value={value}>
      {children}
      <XPGainAnimation bursts={xpBursts} onDismiss={dismissXp} />
      <BadgeUnlockAnimation moments={badgeMoments} onDismiss={dismissBadge} />
    </MotionCelebrationContext.Provider>
  );
}

export function useMotionCelebration() {
  return useContext(MotionCelebrationContext);
}

export function useMotionCelebrationRequired() {
  const ctx = useContext(MotionCelebrationContext);
  if (!ctx) {
    throw new Error("useMotionCelebrationRequired must be used within MotionCelebrationProvider");
  }
  return ctx;
}
