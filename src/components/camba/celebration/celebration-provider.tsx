"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { LevelUpModal } from "@/components/camba/celebration/level-up-modal";
import { BadgeUnlockModal } from "@/components/camba/celebration/badge-unlock-modal";
import { LeaguePromotionModal } from "@/components/camba/celebration/league-promotion-modal";
import { ExerciseCelebrationOverlay } from "@/components/camba/celebration/exercise-celebration-overlay";
import {
  MotionCelebrationProvider,
  useMotionCelebration,
} from "@/components/camba/motion/motion-celebration-provider";
import { ConfettiBurst } from "@/components/camba/motion/confetti-burst";
import { useMascotOptional } from "@/components/mascot/mascot-provider";
import { pickMessage } from "@/lib/mascot/pick-message";
import { playCelebrationSound } from "@/lib/sound/play-celebration-sound";
import {
  showBadgeEarnedToast,
  showLeaguePromotionToast,
  showLevelUpToast,
  showXpEarnedToast,
  type RewardToastLabels,
} from "@/lib/design/rewards";
import { leagueTierLabel } from "@/lib/gamification/leaderboard-types";

export type CelebrateXpOptions = {
  leagueRank?: number | null;
  leagueTier?: string | null;
  /** When true, only toast + XP burst (overlay already shown). */
  quiet?: boolean;
};

export type CelebrateExerciseCompleteOptions = {
  scorePercent?: number;
  xpAmount?: number;
  message?: string;
};

interface CelebrationContextValue {
  celebrateXp: (amount: number, options?: CelebrateXpOptions) => void;
  celebrateExerciseComplete: (options?: CelebrateExerciseCompleteOptions) => void;
  celebrateLevelUp: (level: number) => void;
  celebrateBadge: (name: string, description?: string) => void;
  celebrateLeaguePromotion: (tier: string, rank?: number | null) => void;
}

const CelebrationContext = createContext<CelebrationContextValue | null>(null);

interface CelebrationProviderInnerProps {
  children: React.ReactNode;
  labels?: RewardToastLabels;
  tierLabels?: Record<string, string>;
  useModalsForMajorEvents?: boolean;
}

function readMessageList(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === "string" && item.length > 0);
  }
  return typeof raw === "string" && raw.length > 0 ? [raw] : [];
}

function CelebrationProviderInner({
  children,
  labels,
  tierLabels,
  useModalsForMajorEvents = true,
}: CelebrationProviderInnerProps) {
  const tMascot = useTranslations("mascot");
  const tCommon = useTranslations("common");
  const motionCelebration = useMotionCelebration();
  const mascot = useMascotOptional();
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [levelUpLevel, setLevelUpLevel] = useState(1);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeName, setBadgeName] = useState("");
  const [badgeDescription, setBadgeDescription] = useState<string | undefined>();
  const [leagueOpen, setLeagueOpen] = useState(false);
  const [leagueTier, setLeagueTier] = useState("bronze");
  const [leagueRank, setLeagueRank] = useState<number | null>(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [exerciseCelebration, setExerciseCelebration] = useState<{
    message: string;
    xpAmount?: number;
  } | null>(null);

  const triggerConfetti = useCallback(() => {
    setConfettiActive(true);
  }, []);

  const dismissExerciseCelebration = useCallback(() => {
    setExerciseCelebration(null);
  }, []);

  const resolveExerciseMessage = useCallback(
    (options?: CelebrateExerciseCompleteOptions): string => {
      if (options?.message?.trim()) return options.message.trim();

      const score = options?.scorePercent;
      if (score != null && score >= 75) {
        const pool = readMessageList(tMascot.raw("highScore"));
        const template = pickMessage(pool.length > 0 ? pool : ["{score}% — giỏi quá!"]);
        return template.replace("{score}", String(Math.round(score)));
      }

      return pickMessage(readMessageList(tMascot.raw("exerciseComplete")));
    },
    [tMascot]
  );

  const celebrateExerciseComplete = useCallback(
    (options?: CelebrateExerciseCompleteOptions) => {
      const message = resolveExerciseMessage(options);
      const xpAmount = options?.xpAmount;

      setExerciseCelebration({ message, xpAmount });
      triggerConfetti();
      playCelebrationSound();

      if (xpAmount != null && xpAmount > 0) {
        mascot?.cheerXp(xpAmount);
      } else if (options?.scorePercent != null && options.scorePercent >= 75) {
        mascot?.cheerHighScore(options.scorePercent);
      } else {
        mascot?.cheerExerciseComplete();
      }
    },
    [mascot, resolveExerciseMessage, triggerConfetti]
  );

  const celebrateXp = useCallback(
    (amount: number, options?: CelebrateXpOptions) => {
      showXpEarnedToast(amount, labels, options);
      motionCelebration?.showXpBurst(amount);

      if (options?.quiet) return;

      if (options?.leagueRank != null) {
        mascot?.cheerXpWithRank(amount, options.leagueRank, options.leagueTier);
      } else {
        mascot?.cheerXp(amount);
      }
      triggerConfetti();
    },
    [labels, motionCelebration, mascot, triggerConfetti]
  );

  const celebrateLevelUp = useCallback(
    (level: number) => {
      showLevelUpToast(level, labels);
      motionCelebration?.showXpBurst(level * 10);
      mascot?.cheerLevelUp(level);
      triggerConfetti();
      if (useModalsForMajorEvents) {
        setLevelUpLevel(level);
        setLevelUpOpen(true);
      }
    },
    [labels, useModalsForMajorEvents, motionCelebration, mascot, triggerConfetti]
  );

  const celebrateBadge = useCallback(
    (name: string, description?: string) => {
      showBadgeEarnedToast(name, labels);
      motionCelebration?.showBadgeMoment(name, description);
      mascot?.cheerBadge(name);
      triggerConfetti();
      if (useModalsForMajorEvents) {
        setBadgeName(name);
        setBadgeDescription(description);
        setBadgeOpen(true);
      }
    },
    [labels, useModalsForMajorEvents, motionCelebration, mascot, triggerConfetti]
  );

  const celebrateLeaguePromotion = useCallback(
    (tier: string, rank?: number | null) => {
      const tierName = leagueTierLabel(tier, tierLabels);
      showLeaguePromotionToast(tierName, rank ?? null, labels);
      motionCelebration?.showXpBurst(50);
      mascot?.cheerLeaguePromotion(tierName, rank ?? null);
      triggerConfetti();
      if (useModalsForMajorEvents) {
        setLeagueTier(tier);
        setLeagueRank(rank ?? null);
        setLeagueOpen(true);
      }
    },
    [labels, tierLabels, useModalsForMajorEvents, motionCelebration, mascot, triggerConfetti]
  );

  const value = useMemo(
    () => ({
      celebrateXp,
      celebrateExerciseComplete,
      celebrateLevelUp,
      celebrateBadge,
      celebrateLeaguePromotion,
    }),
    [celebrateXp, celebrateExerciseComplete, celebrateLevelUp, celebrateBadge, celebrateLeaguePromotion]
  );

  return (
    <CelebrationContext.Provider value={value}>
      {children}
      <ConfettiBurst active={confettiActive} onComplete={() => setConfettiActive(false)} />
      <ExerciseCelebrationOverlay
        open={exerciseCelebration != null}
        message={exerciseCelebration?.message ?? ""}
        xpAmount={exerciseCelebration?.xpAmount}
        xpLabel={tMascot("xp", { amount: exerciseCelebration?.xpAmount ?? 0 })}
        continueLabel={tCommon("continue")}
        onDismiss={dismissExerciseCelebration}
      />
      <LevelUpModal open={levelUpOpen} onOpenChange={setLevelUpOpen} level={levelUpLevel} />
      <BadgeUnlockModal
        open={badgeOpen}
        onOpenChange={setBadgeOpen}
        badgeName={badgeName}
        badgeDescription={badgeDescription}
      />
      <LeaguePromotionModal
        open={leagueOpen}
        onOpenChange={setLeagueOpen}
        tier={leagueTier}
        rank={leagueRank}
        tierLabels={tierLabels}
      />
    </CelebrationContext.Provider>
  );
}

interface CelebrationProviderProps {
  children: React.ReactNode;
  labels?: RewardToastLabels;
  tierLabels?: Record<string, string>;
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
