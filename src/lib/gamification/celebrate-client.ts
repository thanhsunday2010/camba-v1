import type { ExerciseGamificationSummary } from "@/lib/gamification/gamification-types";

type CelebrationHandlers = {
  celebrateXp: (
    amount: number,
    options?: { leagueRank?: number | null; leagueTier?: string | null }
  ) => void;
  celebrateLevelUp: (level: number) => void;
  celebrateLeaguePromotion: (tier: string, rank?: number | null) => void;
};

type MascotHandlers = {
  cheerLeagueRank: (rank: number, tier?: string | null) => void;
};

export function celebrateExerciseGamification(
  gamification: ExerciseGamificationSummary | undefined,
  celebration: CelebrationHandlers | null,
  mascot: MascotHandlers | null
): void {
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

  if (gamification.totalXpAwarded > 0) {
    celebration?.celebrateXp(gamification.totalXpAwarded, {
      leagueRank: gamification.leagueRank,
      leagueTier: gamification.leagueTier,
    });
  } else if (gamification.leagueRank != null) {
    mascot?.cheerLeagueRank(gamification.leagueRank, gamification.leagueTier);
  }
}
