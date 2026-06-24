import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type {
  CambridgeCoverageRequirements,
  CambridgeDifficultyPolicy,
  CambridgeItemDifficulty,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";

const DEFAULT_TOLERANCE = 0.12;

/** Blueprint-aligned difficulty targets per level — not global hardcoding. */
export function getDifficultyPolicyForLevel(level: CambridgeExamLevel): CambridgeDifficultyPolicy {
  switch (level) {
    case "starters":
      return {
        level,
        distribution: { easy: 0.6, medium: 0.3, hard: 0.1 },
        tolerance: DEFAULT_TOLERANCE,
        notes: "Starters assembly — recognition-heavy, encouraging distribution.",
      };
    case "movers":
      return {
        level,
        distribution: { easy: 0.35, medium: 0.45, hard: 0.2 },
        tolerance: DEFAULT_TOLERANCE,
        notes: "Movers allows short inference and past-time markers.",
      };
    case "flyers":
      return {
        level,
        distribution: { easy: 0.25, medium: 0.5, hard: 0.25 },
        tolerance: DEFAULT_TOLERANCE,
        notes: "Flyers includes inference and cohesive completion.",
      };
    case "ket":
      return {
        level,
        distribution: { easy: 0.3, medium: 0.5, hard: 0.2 },
        tolerance: DEFAULT_TOLERANCE,
        notes: "KET Key for Schools — balanced A2 distribution.",
      };
    case "pet":
      return {
        level,
        distribution: { easy: 0.25, medium: 0.55, hard: 0.2 },
        tolerance: DEFAULT_TOLERANCE,
        notes: "PET Preliminary — B1 with medium-weighted core.",
      };
  }
}

export function getCoverageRequirementsForLevel(
  level: CambridgeExamLevel
): CambridgeCoverageRequirements {
  switch (level) {
    case "starters":
      return {
        minDistinctGrammarTags: 4,
        minDistinctVocabularyTopics: 5,
        minSkillsRepresented: 4,
        requireWritingTasks: true,
        requireSpeakingTasks: true,
      };
    case "movers":
      return {
        minDistinctGrammarTags: 6,
        minDistinctVocabularyTopics: 6,
        minSkillsRepresented: 4,
        requireWritingTasks: true,
        requireSpeakingTasks: true,
      };
    case "flyers":
      return {
        minDistinctGrammarTags: 8,
        minDistinctVocabularyTopics: 7,
        minSkillsRepresented: 4,
        requireWritingTasks: true,
        requireSpeakingTasks: true,
      };
    case "ket":
      return {
        minDistinctGrammarTags: 8,
        minDistinctVocabularyTopics: 8,
        minSkillsRepresented: 4,
        requireWritingTasks: true,
        requireSpeakingTasks: true,
      };
    case "pet":
      return {
        minDistinctGrammarTags: 10,
        minDistinctVocabularyTopics: 10,
        minSkillsRepresented: 4,
        requireWritingTasks: true,
        requireSpeakingTasks: true,
      };
  }
}

export type DifficultyDistributionResult = {
  valid: boolean;
  counts: Record<CambridgeItemDifficulty, number>;
  shares: Record<CambridgeItemDifficulty, number>;
  targets: Record<CambridgeItemDifficulty, number>;
  deviations: Record<CambridgeItemDifficulty, number>;
  errors: string[];
  warnings: string[];
};

export function computeDifficultyDistribution(
  difficulties: CambridgeItemDifficulty[]
): Record<CambridgeItemDifficulty, number> {
  const counts: Record<CambridgeItemDifficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
  };
  for (const d of difficulties) {
    counts[d] += 1;
  }
  return counts;
}

export function validateDifficultyDistribution(
  difficulties: CambridgeItemDifficulty[],
  policy: CambridgeDifficultyPolicy
): DifficultyDistributionResult {
  const total = difficulties.length;
  const counts = computeDifficultyDistribution(difficulties);
  const shares = {
    easy: total ? counts.easy / total : 0,
    medium: total ? counts.medium / total : 0,
    hard: total ? counts.hard / total : 0,
  };
  const deviations = {
    easy: Math.abs(shares.easy - policy.distribution.easy),
    medium: Math.abs(shares.medium - policy.distribution.medium),
    hard: Math.abs(shares.hard - policy.distribution.hard),
  };

  const errors: string[] = [];
  const warnings: string[] = [];

  if (total === 0) {
    errors.push("No items selected — cannot validate difficulty distribution.");
  }

  for (const band of ["easy", "medium", "hard"] as const) {
    if (deviations[band] > policy.tolerance) {
      errors.push(
        `${band}: share ${(shares[band] * 100).toFixed(1)}% deviates from target ${(policy.distribution[band] * 100).toFixed(1)}% by ${(deviations[band] * 100).toFixed(1)}% (tolerance ${(policy.tolerance * 100).toFixed(0)}%)`
      );
    } else if (deviations[band] > policy.tolerance * 0.75) {
      warnings.push(`${band}: near tolerance edge (${(deviations[band] * 100).toFixed(1)}% deviation).`);
    }
  }

  return {
    valid: errors.length === 0,
    counts,
    shares,
    targets: policy.distribution,
    deviations,
    errors,
    warnings,
  };
}

/** Assign difficulty band for pool generation to approximate policy targets. */
export function difficultyForPoolIndex(
  index: number,
  policy: CambridgeDifficultyPolicy
): CambridgeItemDifficulty {
  const slot = index % 100;
  const easyCut = policy.distribution.easy * 100;
  const mediumCut = easyCut + policy.distribution.medium * 100;
  if (slot < easyCut) return "easy";
  if (slot < mediumCut) return "medium";
  return "hard";
}
