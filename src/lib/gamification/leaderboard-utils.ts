export type ScoredLeaderboardRow = {
  userId: string;
  score: number;
};

export type RankedLeaderboardRow = ScoredLeaderboardRow & {
  rank: number;
};

/**
 * Builds a leaderboard slice that always includes the current user and nearby ranks.
 */
export function buildContextualLeaderboardRows(
  sortedAll: ScoredLeaderboardRow[],
  userId: string,
  displayLimit = 8,
  neighborRadius = 1
): RankedLeaderboardRow[] {
  if (sortedAll.length === 0) return [];

  const ranked = sortedAll.map((row, index) => ({
    ...row,
    rank: index + 1,
  }));

  const userIndex = ranked.findIndex((row) => row.userId === userId);
  const indices = new Set<number>();

  for (let i = 0; i < Math.min(3, ranked.length); i++) {
    indices.add(i);
  }

  if (userIndex >= 0) {
    for (
      let i = Math.max(0, userIndex - neighborRadius);
      i <= Math.min(ranked.length - 1, userIndex + neighborRadius);
      i++
    ) {
      indices.add(i);
    }
  }

  for (let i = 0; i < ranked.length && indices.size < displayLimit; i++) {
    indices.add(i);
  }

  return [...indices]
    .sort((a, b) => a - b)
    .slice(0, displayLimit)
    .map((index) => ranked[index]);
}

export function tierIndex(tier: string): number {
  const order = [
    "bronze",
    "silver",
    "gold",
    "platinum",
    "diamond",
    "master",
    "grandmaster",
    "champion",
  ];
  const index = order.indexOf(tier);
  return index >= 0 ? index : 0;
}

export function isHigherTier(nextTier: string, previousTier: string): boolean {
  return tierIndex(nextTier) > tierIndex(previousTier);
}
