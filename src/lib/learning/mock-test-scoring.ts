import type { QuestionResult } from "@/types/learning";
import { percentToShieldScale, DEFAULT_SHIELD_SCALE_MAX } from "@/lib/learning/shields";

type ScoringSection = {
  skillSlug: string | null;
  title: string;
  questions: Array<{ id: string; points: number; mockPoints?: number }>;
};

export function computeSkillBreakdown(
  sections: ScoringSection[],
  questionResults: QuestionResult[]
): Record<string, number> {
  const breakdown: Record<string, number> = {};
  const resultMap = new Map(questionResults.map((r) => [r.questionId, r]));

  for (const section of sections) {
    const skillKey = section.skillSlug ?? section.title.toLowerCase();
    let earned = 0;
    let max = 0;

    for (const question of section.questions) {
      const result = resultMap.get(question.id);
      earned += result?.pointsEarned ?? 0;
      max += result?.maxPoints ?? question.mockPoints ?? question.points;
    }

    if (max > 0) {
      breakdown[skillKey] = Math.round((earned / max) * 100);
    }
  }

  return breakdown;
}

export function computeShieldEstimate(
  skillBreakdown: Record<string, number>,
  maxShields: number = DEFAULT_SHIELD_SCALE_MAX
): Record<string, number> {
  const shields: Record<string, number> = {};
  for (const [skill, percent] of Object.entries(skillBreakdown)) {
    shields[skill] = percentToShieldScale(percent, maxShields);
  }
  return shields;
}

export function computeOverallShield(
  shieldEstimate: Record<string, number>,
  maxShields: number = DEFAULT_SHIELD_SCALE_MAX
): number {
  const values = Object.values(shieldEstimate);
  if (values.length === 0) return 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return Math.round(Math.min(maxShields, Math.max(0, avg)));
}

/** @deprecated Use percentToShieldScale from @/lib/learning/shields */
export function percentToShield(percent: number, maxShields?: number): number {
  return percentToShieldScale(percent, maxShields);
}
