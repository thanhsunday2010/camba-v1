/**
 * M3.4 — Certification level thresholds.
 */

import type {
  MockCertificationLevel,
  MockCertificationMetrics,
} from "@/lib/cambridge-assessment/certification/mock-certification-types";

export type CertificationLevelThresholds = {
  minCertificationScore: number;
  minCoverageScore: number;
  minQaScore: number;
  minDiversityScore: number;
  minBlueprintScore: number;
  requireWriting: boolean;
  requireSpeaking: boolean;
  allowWarnings: boolean;
  maxCriticalErrors: number;
};

export const CERTIFICATION_LEVEL_THRESHOLDS: Record<MockCertificationLevel, CertificationLevelThresholds> = {
  gold: {
    minCertificationScore: 85,
    minCoverageScore: 80,
    minQaScore: 85,
    minDiversityScore: 90,
    minBlueprintScore: 100,
    requireWriting: true,
    requireSpeaking: true,
    allowWarnings: true,
    maxCriticalErrors: 0,
  },
  silver: {
    minCertificationScore: 72,
    minCoverageScore: 65,
    minQaScore: 70,
    minDiversityScore: 75,
    minBlueprintScore: 100,
    requireWriting: true,
    requireSpeaking: true,
    allowWarnings: true,
    maxCriticalErrors: 0,
  },
  bronze: {
    minCertificationScore: 55,
    minCoverageScore: 50,
    minQaScore: 55,
    minDiversityScore: 60,
    minBlueprintScore: 90,
    requireWriting: true,
    requireSpeaking: true,
    allowWarnings: true,
    maxCriticalErrors: 1,
  },
  rejected: {
    minCertificationScore: 0,
    minCoverageScore: 0,
    minQaScore: 0,
    minDiversityScore: 0,
    minBlueprintScore: 0,
    requireWriting: false,
    requireSpeaking: false,
    allowWarnings: true,
    maxCriticalErrors: Number.MAX_SAFE_INTEGER,
  },
};

export type LevelAssignmentInput = {
  metrics: MockCertificationMetrics;
  criticalErrorCount: number;
  hasBlueprintFailure: boolean;
  hasSafetyFailure: boolean;
};

/** Assign highest tier met by metrics; rejected if hard failures. */
export function assignCertificationLevel(input: LevelAssignmentInput): MockCertificationLevel {
  const { metrics, criticalErrorCount, hasBlueprintFailure, hasSafetyFailure } = input;

  if (hasSafetyFailure || hasBlueprintFailure) return "rejected";

  const tiers: MockCertificationLevel[] = ["gold", "silver", "bronze"];

  for (const tier of tiers) {
    const t = CERTIFICATION_LEVEL_THRESHOLDS[tier];
    if (criticalErrorCount > t.maxCriticalErrors) continue;
    if (metrics.certificationScore < t.minCertificationScore) continue;
    if (metrics.coverageScore < t.minCoverageScore) continue;
    if (metrics.qaScore < t.minQaScore) continue;
    if (metrics.diversityScore < t.minDiversityScore) continue;
    if (metrics.blueprintScore < t.minBlueprintScore) continue;
    if (t.requireWriting && metrics.writingCount === 0) continue;
    if (t.requireSpeaking && metrics.speakingCount === 0) continue;
    return tier;
  }

  return "rejected";
}

export function isStudentFacing(level: MockCertificationLevel): boolean {
  return level === "gold" || level === "silver" || level === "bronze";
}

export function computeCertificationScore(
  coverageScore: number,
  qaScore: number,
  diversityScore: number,
  blueprintScore: number
): number {
  return Math.round(
    coverageScore * 0.3 + qaScore * 0.35 + diversityScore * 0.2 + blueprintScore * 0.15
  );
}
