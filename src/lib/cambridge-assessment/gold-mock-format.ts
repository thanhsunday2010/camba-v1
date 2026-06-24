/**
 * M3.1 — Canonical Gold Mock format (academic authority for CAMBA content).
 */

import type { CambridgeExamLevel, CambridgeSkill } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type { YleMockManifest, YleMockQuestionManifestBlock } from "@/lib/mock-blueprints/yle-mock-manifest-types";

/** Gold tier identifier — all future content traces back to these mocks. */
export type GoldMockTier = "gold";

export type GoldMockCoverageTarget = {
  minDistinctGrammarTags: number;
  minDistinctVocabularyTopics: number;
  minSkillsRepresented: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  /** Maximum share of items from a single vocabulary topic (0–1). */
  maxTopicShare: number;
  requireWritingTasks: boolean;
  requireSpeakingTasks: boolean;
};

export type GoldMockValidationRules = {
  /** Must align with M2.0 blueprint part counts and task types. */
  requireBlueprintCompliance: boolean;
  /** Writing/speaking must pass M2.2/M2.3 runtime shape checks. */
  requireAiTaskCompatibility: boolean;
  /** totalScore must equal sum of question points. */
  requireScoreIntegrity: boolean;
  /** No duplicate questionRef within a manifest. */
  requireUniqueQuestionRefs: boolean;
  difficultyTolerance: number;
  /** Reject placeholder/filler stem patterns. */
  rejectPlaceholderStems: boolean;
};

export type GoldMockPart = {
  partSlug: string;
  partNumber: number;
  title: string;
  skill: CambridgeSkill;
  paperSlug: string;
  questionCount: number;
  pointsPerItem: number;
  timeMinutes: number;
  allowedTaskTypes: CambridgeTaskTypeKey[];
  scoringMode: "auto" | "ai" | "mixed";
  instructions?: string;
};

export type GoldMockPaper = {
  paperSlug: string;
  title: string;
  skills: CambridgeSkill[];
  totalMinutes: number;
  weightPercent: number;
  parts: GoldMockPart[];
};

export type GoldMockSpecification = {
  specificationId: string;
  specificationVersion: string;
  level: CambridgeExamLevel;
  examName: string;
  cefrBand: string;
  targetAgeBand: string;
  totalDurationMinutes: number;
  blueprintId: string;
  blueprintVersion: string;
  papers: GoldMockPaper[];
  coverageTargets: GoldMockCoverageTarget;
  validationRules: GoldMockValidationRules;
  authenticityNotes: string;
};

export type GoldMockAuthorship = {
  tier: GoldMockTier;
  goldMockId: string;
  goldMockVersion: string;
  specificationId: string;
  specificationVersion: string;
  authoredAt: string;
  status: "draft" | "review" | "published";
  academicAuthority: true;
  /** Human-authored — not assembly-generated. */
  authoringMethod: "manual";
  qaChecklistVersion: string;
};

export type GoldMockManifest = YleMockManifest & {
  gold: GoldMockAuthorship;
  specification: Pick<
    GoldMockSpecification,
    "specificationId" | "specificationVersion" | "level" | "coverageTargets"
  >;
};

export type GoldMockQuestionBlock = YleMockQuestionManifestBlock;

export const GOLD_MOCK_QA_CHECKLIST_VERSION = "1.0.0";

export const DEFAULT_GOLD_MOCK_VALIDATION_RULES: GoldMockValidationRules = {
  requireBlueprintCompliance: true,
  requireAiTaskCompatibility: true,
  requireScoreIntegrity: true,
  requireUniqueQuestionRefs: true,
  difficultyTolerance: 0.12,
  rejectPlaceholderStems: true,
};

export function isGoldMockManifest(value: unknown): value is GoldMockManifest {
  if (!value || typeof value !== "object") return false;
  const v = value as GoldMockManifest;
  return (
    v.gold?.tier === "gold" &&
    v.gold?.academicAuthority === true &&
    v.gold?.authoringMethod === "manual" &&
    Array.isArray(v.questions) &&
    v.questions.length > 0
  );
}
