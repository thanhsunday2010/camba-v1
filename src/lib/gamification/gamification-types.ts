export interface ExerciseGamificationSummary {
  totalXpAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  leagueRank: number | null;
  leagueTier: string | null;
  tierPromoted: boolean;
}

export const EMPTY_GAMIFICATION_SUMMARY: ExerciseGamificationSummary = {
  totalXpAwarded: 0,
  leveledUp: false,
  newLevel: 1,
  leagueRank: null,
  leagueTier: null,
  tierPromoted: false,
};
