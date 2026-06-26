import type { ExerciseGamificationSummary } from "@/lib/gamification/gamification-types";
import type {
  CelebrateExerciseCompleteOptions,
  CelebrateXpOptions,
} from "@/components/camba/celebration/celebration-provider";

type CelebrationHandlers = {
  celebrateXp: (amount: number, options?: CelebrateXpOptions) => void;
  celebrateExerciseComplete: (options?: CelebrateExerciseCompleteOptions) => void;
  celebrateLevelUp: (level: number) => void;
  celebrateLeaguePromotion: (tier: string, rank?: number | null) => void;
};

type MascotHandlers = {
  cheerLeagueRank: (rank: number, tier?: string | null) => void;
  cheerHighScore: (score: number) => void;
  cheerExerciseComplete: () => void;
};

export function celebrateExerciseGamification(
  gamification: ExerciseGamificationSummary | undefined,
  celebration: CelebrationHandlers | null,
  mascot: MascotHandlers | null,
  scorePercent?: number
): void {
  const xp = gamification?.totalXpAwarded ?? 0;

  celebration?.celebrateExerciseComplete({
    scorePercent,
    xpAmount: xp > 0 ? xp : undefined,
  });

  if (!gamification) return;

  if (gamification.leveledUp) {
    celebration?.celebrateLevelUp(gamification.newLevel);
  }

  if (gamification.tierPromoted && gamification.leagueTier) {
    celebration?.celebrateLeaguePromotion(
      gamification.leagueTier,
      gamification.leagueRank
    );
  }

  if (xp > 0) {
    celebration?.celebrateXp(xp, {
      leagueRank: gamification.leagueRank,
      leagueTier: gamification.leagueTier,
      quiet: true,
    });
  } else if (gamification.leagueRank != null) {
    mascot?.cheerLeagueRank(gamification.leagueRank, gamification.leagueTier);
  }
}

export function celebratePracticeSubmit(
  celebration: CelebrationHandlers | null,
  options: { overallScore: number; xpAwarded?: number }
): void {
  const xp = options.xpAwarded ?? 0;
  celebration?.celebrateExerciseComplete({
    scorePercent: options.overallScore,
    xpAmount: xp > 0 ? xp : undefined,
  });
  if (xp > 0) {
    celebration?.celebrateXp(xp, { quiet: true });
  }
}

export function celebrateExerciseOutcome(
  celebration: CelebrationHandlers | null,
  scorePercent?: number,
  gamification?: ExerciseGamificationSummary,
  mascot?: MascotHandlers | null
): void {
  if (gamification) {
    celebrateExerciseGamification(gamification, celebration, mascot ?? null, scorePercent);
    return;
  }

  celebration?.celebrateExerciseComplete({ scorePercent });
}
