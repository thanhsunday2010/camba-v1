const MIN_RATE = 0.72;
const MAX_RATE = 1.06;

const CAMBRIDGE_LEVEL_ORDER = [
  "pre-starters",
  "pre starters",
  "pre-a1",
  "starters",
  "movers",
  "flyers",
  "ket",
  "a2",
  "pet",
  "b1",
  "fce",
  "c1",
] as const;

function normalizeLevelToken(targetLevel: string): string {
  return targetLevel.toLowerCase().replace(/_/g, "-").trim();
}

/** Slower for YLE beginners, closer to natural speed for KET/PET+. */
export function getLessonSpeechRate(targetLevel?: string): number {
  if (!targetLevel?.trim()) {
    return 0.9;
  }

  const normalized = normalizeLevelToken(targetLevel);
  const index = CAMBRIDGE_LEVEL_ORDER.findIndex(
    (level) => normalized.includes(level) || level.includes(normalized)
  );

  if (index < 0) {
    return 0.9;
  }

  const progress = index / Math.max(CAMBRIDGE_LEVEL_ORDER.length - 1, 1);
  return MIN_RATE + progress * (MAX_RATE - MIN_RATE);
}
