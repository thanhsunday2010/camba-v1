/**
 * M3.1 — Gold Mock specifications derived from M2.0 blueprints.
 */

import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import {
  DEFAULT_GOLD_MOCK_VALIDATION_RULES,
  type GoldMockCoverageTarget,
  type GoldMockPaper,
  type GoldMockSpecification,
} from "@/lib/cambridge-assessment/gold-mock-format";
import {
  getCoverageRequirementsForLevel,
  getDifficultyPolicyForLevel,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";

const CEFR: Record<CambridgeExamLevel, string> = {
  starters: "pre-a1",
  movers: "a1",
  flyers: "a2",
  ket: "a2",
  pet: "b1",
};

const AGE: Record<CambridgeExamLevel, string> = {
  starters: "7–9",
  movers: "8–11",
  flyers: "9–12",
  ket: "12–15",
  pet: "13–17",
};

function buildCoverageTargets(level: CambridgeExamLevel): GoldMockCoverageTarget {
  const req = getCoverageRequirementsForLevel(level);
  const diff = getDifficultyPolicyForLevel(level);
  return {
    minDistinctGrammarTags: req.minDistinctGrammarTags,
    minDistinctVocabularyTopics: req.minDistinctVocabularyTopics,
    minSkillsRepresented: req.minSkillsRepresented,
    difficultyDistribution: diff.distribution,
    maxTopicShare: level === "starters" ? 0.25 : 0.2,
    requireWritingTasks: req.requireWritingTasks,
    requireSpeakingTasks: req.requireSpeakingTasks,
  };
}

function blueprintToGoldPapers(level: CambridgeExamLevel): GoldMockPaper[] {
  const blueprint = getCambridgeExamBlueprint(level);
  return blueprint.papers.map((paper) => ({
    paperSlug: paper.paperSlug,
    title: paper.title,
    skills: paper.skills,
    totalMinutes: paper.totalMinutes,
    weightPercent: paper.weightPercent,
    parts: paper.parts.map((part) => ({
      partSlug: part.partSlug,
      partNumber: part.partNumber,
      title: part.title,
      skill: part.skill,
      paperSlug: paper.paperSlug,
      questionCount: part.questionCount,
      pointsPerItem: part.pointsPerItem,
      timeMinutes: part.timeMinutes,
      allowedTaskTypes: part.allowedTaskTypes,
      scoringMode: part.scoringMode,
    })),
  }));
}

function buildGoldSpecification(level: CambridgeExamLevel): GoldMockSpecification {
  const blueprint = getCambridgeExamBlueprint(level);
  return {
    specificationId: `gold-mock-${level}-v1`,
    specificationVersion: "1.0.0",
    level,
    examName: blueprint.examName,
    cefrBand: CEFR[level],
    targetAgeBand: AGE[level],
    totalDurationMinutes: blueprint.totalDurationMinutes,
    blueprintId: blueprint.blueprintId,
    blueprintVersion: blueprint.blueprintVersion,
    papers: blueprintToGoldPapers(level),
    coverageTargets: buildCoverageTargets(level),
    validationRules: DEFAULT_GOLD_MOCK_VALIDATION_RULES,
    authenticityNotes:
      "Gold mock aligns with official Cambridge exam structure (M2.0 blueprint). Content is manually authored for academic reference.",
  };
}

export const GOLD_MOCK_SPECIFICATIONS: Record<CambridgeExamLevel, GoldMockSpecification> = {
  starters: buildGoldSpecification("starters"),
  movers: buildGoldSpecification("movers"),
  flyers: buildGoldSpecification("flyers"),
  ket: buildGoldSpecification("ket"),
  pet: buildGoldSpecification("pet"),
};

export function getGoldMockSpecification(level: CambridgeExamLevel): GoldMockSpecification {
  return GOLD_MOCK_SPECIFICATIONS[level];
}

export const GOLD_MOCK_LEVELS = [
  "starters",
  "movers",
  "flyers",
  "ket",
  "pet",
] as const satisfies readonly CambridgeExamLevel[];
