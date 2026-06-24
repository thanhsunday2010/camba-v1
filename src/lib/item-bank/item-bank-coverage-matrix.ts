/**
 * M3.2 — Item bank inventory targets (justified by blueprint + assembly needs).
 */

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";

export type ItemBankInventoryTarget = {
  level: CambridgeExamLevel;
  /** Minimum items for blueprint-compliant multi-version assembly. */
  minItems: number;
  /** Target items for healthy coverage diversity. */
  targetItems: number;
  /** Minimum pool depth per blueprint part (items available / items needed per form). */
  minPoolDepthPerPart: number;
  /** Minimum distinct grammar tags represented. */
  minGrammarTags: number;
  /** Minimum distinct vocabulary topics represented. */
  minVocabularyTopics: number;
  /** Minimum items per difficulty band. */
  minPerDifficulty: { easy: number; medium: number; hard: number };
  /** Minimum writing items in bank. */
  minWritingItems: number;
  /** Minimum speaking items in bank. */
  minSpeakingItems: number;
  justification: string;
};

function itemsPerExam(level: CambridgeExamLevel): number {
  const bp = getCambridgeExamBlueprint(level);
  return bp.papers.reduce(
    (sum, p) => sum + p.parts.reduce((s, part) => s + part.questionCount, 0),
    0
  );
}

/**
 * Targets derived from:
 * - Items per exam form (M2.0 blueprint)
 * - 3 exam versions (A/B/C) without reuse → 3× form size
 * - ~2× pool depth for stratified assembly selection
 * - Coverage minimums from M2.4 / M3.1 gold mock specs
 */
function buildTarget(level: CambridgeExamLevel): ItemBankInventoryTarget {
  const formSize = itemsPerExam(level);
  const targetItems = Math.ceil(formSize * 3 * 2);

  const minGrammar =
    level === "starters" ? 12 : level === "movers" ? 14 : level === "flyers" ? 16 : 18;
  const minVocab =
    level === "starters" ? 15 : level === "movers" ? 18 : level === "flyers" ? 20 : 22;

  return {
    level,
    minItems: Math.ceil(formSize * 3),
    targetItems,
    minPoolDepthPerPart: 6,
    minGrammarTags: minGrammar,
    minVocabularyTopics: minVocab,
    minPerDifficulty: {
      easy: Math.ceil(targetItems * 0.25),
      medium: Math.ceil(targetItems * 0.45),
      hard: Math.ceil(targetItems * 0.15),
    },
    minWritingItems: level === "ket" || level === "pet" ? 12 : 20,
    minSpeakingItems: level === "ket" ? 8 : level === "pet" ? 10 : 12,
    justification: `Form=${formSize} items; target supports 3 versions + 2× assembly pool depth (${formSize}×3×2=${formSize * 3 * 2}).`,
  };
}

export const ITEM_BANK_INVENTORY_TARGETS: Record<CambridgeExamLevel, ItemBankInventoryTarget> = {
  starters: { ...buildTarget("starters"), targetItems: 250, minItems: 129 },
  movers: { ...buildTarget("movers"), targetItems: 350, minItems: 153 },
  flyers: { ...buildTarget("flyers"), targetItems: 450, minItems: 177 },
  ket: { ...buildTarget("ket"), targetItems: 600, minItems: 177 },
  pet: { ...buildTarget("pet"), targetItems: 800, minItems: 192 },
};

export function getItemBankInventoryTarget(level: CambridgeExamLevel): ItemBankInventoryTarget {
  return ITEM_BANK_INVENTORY_TARGETS[level];
}

export type CoverageGap = {
  dimension: "grammar" | "vocabulary" | "skill" | "task" | "difficulty" | "writing" | "speaking" | "inventory";
  key: string;
  required: number;
  actual: number;
  severity: "critical" | "warning";
  message: string;
};

export type CoverageTarget = ItemBankInventoryTarget;

export type CoverageMatrix = {
  level: CambridgeExamLevel;
  totalItems: number;
  grammar: Record<string, number>;
  vocabulary: Record<string, number>;
  skills: Record<string, number>;
  taskTypes: Record<string, number>;
  writingTasks: Record<string, number>;
  speakingTasks: Record<string, number>;
  difficulty: Record<"easy" | "medium" | "hard", number>;
  partDepth: Record<string, number>;
  gaps: CoverageGap[];
  target: CoverageTarget;
  readinessScore: number;
};
