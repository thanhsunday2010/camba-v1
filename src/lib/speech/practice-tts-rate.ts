import { LEVELS_BY_LANGUAGE } from "@/lib/ai-practice/practice-config";
import type { PracticeLanguage } from "@/lib/ai-practice/practice-types";

const MIN_RATE = 0.72;
const MAX_RATE = 1.08;

/** Slower for beginners, closer to natural speed for advanced learners. */
export function getPracticeSpeechRate(language: PracticeLanguage, levelId: string): number {
  const levels = LEVELS_BY_LANGUAGE[language];
  const index = levels.findIndex((level) => level.id === levelId);

  if (index < 0 || levels.length <= 1) {
    return 0.9;
  }

  const progress = index / (levels.length - 1);
  return MIN_RATE + progress * (MAX_RATE - MIN_RATE);
}
