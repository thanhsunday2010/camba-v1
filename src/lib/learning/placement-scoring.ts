import type { QuestionResult } from "@/types/learning";
import { computeShieldEstimate, computeOverallShield } from "@/lib/learning/mock-test-scoring";

type WeightedQuestion = {
  id: string;
  skill_weight?: Record<string, number>;
};

export function computePlacementSkillBreakdown(
  questions: WeightedQuestion[],
  questionResults: QuestionResult[]
): Record<string, number> {
  const skillScores: Record<string, { earned: number; weight: number }> = {};

  for (const qr of questionResults) {
    const question = questions.find((q) => q.id === qr.questionId);
    const weights = question?.skill_weight ?? { general: 1 };

    for (const [skill, weight] of Object.entries(weights)) {
      if (!skillScores[skill]) skillScores[skill] = { earned: 0, weight: 0 };
      const w = weight as number;
      skillScores[skill].earned += (qr.pointsEarned / Math.max(qr.maxPoints, 1)) * w * 100;
      skillScores[skill].weight += w;
    }
  }

  const breakdown: Record<string, number> = {};
  for (const [skill, { earned, weight }] of Object.entries(skillScores)) {
    if (weight > 0) {
      breakdown[skill] = Math.round(earned / weight);
    }
  }
  return breakdown;
}

export function computeCambridgeScaleScore(accuracyPercent: number): number {
  const clamped = Math.min(100, Math.max(0, accuracyPercent));
  return Math.round(100 + (clamped / 100) * 70);
}

export function buildPlacementShieldSummary(
  skillBreakdown: Record<string, number>,
  maxShields: number
) {
  const shieldEstimate = computeShieldEstimate(skillBreakdown, maxShields);
  const overallShields = computeOverallShield(shieldEstimate, maxShields);
  return { shieldEstimate, overallShields };
}
