import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import {
  getItemBankInventoryTarget,
  type CoverageGap,
  type CoverageMatrix,
  type CoverageTarget,
} from "@/lib/item-bank/item-bank-coverage-matrix";
import type {
  ItemBankQuestion,
  ItemBankSpeakingContent,
  ItemBankWritingContent,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";
import { YLE_GRAMMAR_TAGS } from "@/lib/learning/grammar-taxonomy";
import { YLE_VOCABULARY_TOPICS } from "@/lib/learning/vocabulary-taxonomy";

function inc(map: Record<string, number>, key: string): void {
  map[key] = (map[key] ?? 0) + 1;
}

function getWritingTaskType(item: ItemBankQuestion): string | null {
  if (item.questionType !== "writing") return null;
  const c = item.content as ItemBankWritingContent;
  return c.writingTaskType ?? c.cambridgeTaskType ?? null;
}

function getSpeakingTaskType(item: ItemBankQuestion): string | null {
  if (item.questionType !== "speaking") return null;
  const c = item.content as ItemBankSpeakingContent;
  return c.speakingTaskType ?? c.cambridgeTaskType ?? null;
}

export function buildCoverageMatrix(
  level: ItemLevel,
  items: ItemBankQuestion[]
): CoverageMatrix {
  const target = getItemBankInventoryTarget(level);
  const grammar: Record<string, number> = {};
  const vocabulary: Record<string, number> = {};
  const skills: Record<string, number> = {};
  const taskTypes: Record<string, number> = {};
  const writingTasks: Record<string, number> = {};
  const speakingTasks: Record<string, number> = {};
  const difficulty = { easy: 0, medium: 0, hard: 0 };
  const partDepth: Record<string, number> = {};
  const gaps: CoverageGap[] = [];

  for (const item of items) {
    inc(difficulty, item.difficulty);
    inc(skills, item.skill);
    inc(taskTypes, item.questionType);
    inc(partDepth, item.part);

    for (const tag of item.grammarTags) inc(grammar, tag);
    for (const topic of item.vocabularyTopics) inc(vocabulary, topic);

    const wt = getWritingTaskType(item);
    if (wt) inc(writingTasks, wt);
    const st = getSpeakingTaskType(item);
    if (st) inc(speakingTasks, st);
  }

  if (items.length < target.minItems) {
    gaps.push({
      dimension: "inventory",
      key: "total",
      required: target.minItems,
      actual: items.length,
      severity: "critical",
      message: `Inventory ${items.length} below minimum ${target.minItems}.`,
    });
  }

  const grammarDistinct = Object.keys(grammar).length;
  if (grammarDistinct < target.minGrammarTags) {
    gaps.push({
      dimension: "grammar",
      key: "distinct",
      required: target.minGrammarTags,
      actual: grammarDistinct,
      severity: "critical",
      message: `Grammar tags ${grammarDistinct}/${target.minGrammarTags}.`,
    });
  }

  const vocabDistinct = Object.keys(vocabulary).length;
  if (vocabDistinct < target.minVocabularyTopics) {
    gaps.push({
      dimension: "vocabulary",
      key: "distinct",
      required: target.minVocabularyTopics,
      actual: vocabDistinct,
      severity: "critical",
      message: `Vocabulary topics ${vocabDistinct}/${target.minVocabularyTopics}.`,
    });
  }

  for (const band of ["easy", "medium", "hard"] as const) {
    if (difficulty[band] < target.minPerDifficulty[band]) {
      gaps.push({
        dimension: "difficulty",
        key: band,
        required: target.minPerDifficulty[band],
        actual: difficulty[band],
        severity: "warning",
        message: `${band} items ${difficulty[band]}/${target.minPerDifficulty[band]}.`,
      });
    }
  }

  const writingCount = items.filter((i) => i.questionType === "writing").length;
  if (writingCount < target.minWritingItems) {
    gaps.push({
      dimension: "writing",
      key: "count",
      required: target.minWritingItems,
      actual: writingCount,
      severity: "critical",
      message: `Writing items ${writingCount}/${target.minWritingItems}.`,
    });
  }

  const speakingCount = items.filter((i) => i.questionType === "speaking").length;
  if (speakingCount < target.minSpeakingItems) {
    gaps.push({
      dimension: "speaking",
      key: "count",
      required: target.minSpeakingItems,
      actual: speakingCount,
      severity: "critical",
      message: `Speaking items ${speakingCount}/${target.minSpeakingItems}.`,
    });
  }

  const blueprint = getCambridgeExamBlueprint(level as CambridgeExamLevel);
  for (const paper of blueprint.papers) {
    for (const part of paper.parts) {
      const depth = partDepth[part.partSlug] ?? 0;
      if (depth < target.minPoolDepthPerPart) {
        gaps.push({
          dimension: "task",
          key: part.partSlug,
          required: target.minPoolDepthPerPart,
          actual: depth,
          severity: depth === 0 ? "critical" : "warning",
          message: `Part ${part.partSlug}: ${depth}/${target.minPoolDepthPerPart} items.`,
        });
      }
    }
  }

  for (const tag of YLE_GRAMMAR_TAGS) {
    if (!grammar[tag]) {
      gaps.push({
        dimension: "grammar",
        key: tag,
        required: 1,
        actual: 0,
        severity: "warning",
        message: `Missing grammar tag: ${tag}.`,
      });
    }
  }

  for (const topic of YLE_VOCABULARY_TOPICS.slice(0, 15)) {
    if (!vocabulary[topic]) {
      gaps.push({
        dimension: "vocabulary",
        key: topic,
        required: 1,
        actual: 0,
        severity: "warning",
        message: `Missing core vocabulary topic: ${topic}.`,
      });
    }
  }

  const criticalCount = gaps.filter((g) => g.severity === "critical").length;
  const readinessScore = Math.max(
    0,
    Math.min(100, 100 - criticalCount * 8 - gaps.filter((g) => g.severity === "warning").length * 2)
  );

  return {
    level: level as CambridgeExamLevel,
    totalItems: items.length,
    grammar,
    vocabulary,
    skills,
    taskTypes,
    writingTasks,
    speakingTasks,
    difficulty,
    partDepth,
    gaps,
    target,
    readinessScore,
  };
}

export function formatCoverageMatrixReport(matrix: CoverageMatrix): string {
  const lines: string[] = [];
  lines.push(`=== Coverage Matrix: ${matrix.level.toUpperCase()} ===`);
  lines.push(`Items: ${matrix.totalItems} | Target: ${matrix.target.targetItems} | Readiness: ${matrix.readinessScore}%`);
  lines.push("");
  lines.push("Skills:", JSON.stringify(matrix.skills));
  lines.push("Difficulty:", JSON.stringify(matrix.difficulty));
  lines.push("Writing tasks:", JSON.stringify(matrix.writingTasks));
  lines.push("Speaking tasks:", JSON.stringify(matrix.speakingTasks));
  lines.push("");
  const critical = matrix.gaps.filter((g) => g.severity === "critical");
  const warnings = matrix.gaps.filter((g) => g.severity === "warning");
  lines.push(`Gaps: ${critical.length} critical, ${warnings.length} warnings`);
  for (const g of [...critical, ...warnings].slice(0, 20)) {
    lines.push(`  [${g.severity}] ${g.dimension}/${g.key}: ${g.message}`);
  }
  if (matrix.gaps.length > 20) lines.push(`  ... and ${matrix.gaps.length - 20} more`);
  return lines.join("\n");
}

export type { CoverageGap, CoverageTarget };
