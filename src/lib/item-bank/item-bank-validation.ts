/**
 * M3.2 — Validation 2.0: coverage, difficulty, blueprint, duplicates.
 */

import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { validateDifficultyDistribution } from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
import { getDifficultyPolicyForLevel } from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
import { buildCoverageMatrix } from "@/lib/item-bank/item-bank-coverage-matrix-builder";
import { detectItemBankDuplicates } from "@/lib/item-bank/item-bank-duplicate-detection";
import { validateGrammarTags } from "@/lib/learning/grammar-taxonomy";
import { validateVocabularyTopics } from "@/lib/learning/vocabulary-taxonomy";
import type {
  ItemBankQuestion,
  ItemBankSpeakingContent,
  ItemBankValidationIssue,
  ItemBankValidationResult,
  ItemBankWritingContent,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";

export const ITEM_BANK_LEVELS: ItemLevel[] = [
  "starters",
  "movers",
  "flyers",
  "ket",
  "pet",
];

export const ITEM_BANK_RECEPTIVE_TYPES = [
  "multiple_choice",
  "matching",
  "gap_fill",
  "multi_select",
  "drag_drop",
  "sentence_ordering",
  "listening",
  "reading_comprehension",
  "image_selection",
] as const;

export const ITEM_BANK_QUESTION_TYPES = [
  ...ITEM_BANK_RECEPTIVE_TYPES,
  "writing",
  "speaking",
] as const;

const RECEPTIVE_SET = new Set<string>([
  "multiple_choice",
  "matching",
  "gap_fill",
  "multi_select",
  "drag_drop",
  "sentence_ordering",
  "listening",
  "reading_comprehension",
  "image_selection",
]);
const LEVEL_SET = new Set<string>(ITEM_BANK_LEVELS);
const DIFFICULTY_SET = new Set<string>(["easy", "medium", "hard"]);
const SKILL_SET = new Set<string>([
  "listening",
  "reading",
  "reading_writing",
  "writing",
  "speaking",
]);

function issue(
  code: string,
  path: string,
  message: string,
  severity: "error" | "warning" = "error"
): ItemBankValidationIssue {
  return { code, path, message, severity };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasReceptivePayload(content: Record<string, unknown>): boolean {
  if (isNonEmptyString(content.questionText)) return true;
  if (Array.isArray(content.choices) && content.choices.length > 0) return true;
  if (Array.isArray(content.pairs) && content.pairs.length > 0) return true;
  if (isNonEmptyString(content.template)) return true;
  return false;
}

function validateWritingContent(idPath: string, content: ItemBankWritingContent): ItemBankValidationIssue[] {
  const errors: ItemBankValidationIssue[] = [];
  if (!isNonEmptyString(content.prompt)) {
    errors.push(issue("WRITING_PROMPT_MISSING", `${idPath}.content.prompt`, "Writing prompt required."));
  }
  if (!content.writingTaskType) {
    errors.push(issue("WRITING_TASK_TYPE_MISSING", `${idPath}.content.writingTaskType`, "Writing task type required."));
  }
  if (!isNonEmptyString(content.rubricId)) {
    errors.push(issue("WRITING_RUBRIC_MISSING", `${idPath}.content.rubricId`, "Rubric ID required."));
  }
  return errors;
}

function validateSpeakingContent(idPath: string, content: ItemBankSpeakingContent): ItemBankValidationIssue[] {
  const errors: ItemBankValidationIssue[] = [];
  if (!isNonEmptyString(content.prompt)) {
    errors.push(issue("SPEAKING_PROMPT_MISSING", `${idPath}.content.prompt`, "Speaking prompt required."));
  }
  if (!content.speakingTaskType) {
    errors.push(issue("SPEAKING_TASK_TYPE_MISSING", `${idPath}.content.speakingTaskType`, "Speaking task type required."));
  }
  if (!content.maxDurationSeconds || content.maxDurationSeconds <= 0) {
    errors.push(issue("SPEAKING_DURATION_MISSING", `${idPath}.content.maxDurationSeconds`, "Duration required."));
  }
  if (!isNonEmptyString(content.rubricId)) {
    errors.push(issue("SPEAKING_RUBRIC_MISSING", `${idPath}.content.rubricId`, "Rubric ID required."));
  }
  return errors;
}

/** Strict per-item validation. */
export function validateItemBankQuestion(
  item: ItemBankQuestion,
  index?: number
): ItemBankValidationResult {
  const prefix = index !== undefined ? `items[${index}]` : "item";
  const idPath = isNonEmptyString(item.id) ? `${prefix}.${item.id}` : prefix;
  const errors: ItemBankValidationIssue[] = [];
  const warnings: ItemBankValidationIssue[] = [];

  if (!isNonEmptyString(item.id)) {
    errors.push(issue("ITEM_ID_MISSING", `${prefix}.id`, "Item id is required."));
  }
  if (!LEVEL_SET.has(item.level)) {
    errors.push(issue("ITEM_LEVEL_INVALID", `${idPath}.level`, `Invalid level: "${item.level}".`));
  }
  if (!SKILL_SET.has(item.skill)) {
    errors.push(issue("ITEM_SKILL_INVALID", `${idPath}.skill`, `Invalid skill: "${item.skill}".`));
  }
  if (!isNonEmptyString(item.part)) {
    errors.push(issue("ITEM_PART_MISSING", `${idPath}.part`, "Part slug is required."));
  }

  const qt = item.questionType;
  if (qt !== "writing" && qt !== "speaking" && !RECEPTIVE_SET.has(qt)) {
    errors.push(issue("ITEM_QUESTION_TYPE_UNSUPPORTED", `${idPath}.questionType`, `Unsupported type: "${qt}".`));
  }

  if (!DIFFICULTY_SET.has(item.difficulty)) {
    errors.push(issue("ITEM_DIFFICULTY_INVALID", `${idPath}.difficulty`, `Invalid difficulty.`));
  }

  if (!item.grammarTags?.length) {
    errors.push(issue("ITEM_GRAMMAR_TAGS_MISSING", `${idPath}.grammarTags`, "Grammar tags required."));
  } else {
    for (const tag of validateGrammarTags(item.grammarTags).unknown) {
      errors.push(issue("ITEM_UNKNOWN_GRAMMAR_TAG", `${idPath}.grammarTags`, `Unknown: "${tag}".`));
    }
  }

  if (!item.vocabularyTopics?.length) {
    errors.push(issue("ITEM_VOCAB_TOPICS_MISSING", `${idPath}.vocabularyTopics`, "Vocabulary topics required."));
  } else {
    for (const topic of validateVocabularyTopics(item.vocabularyTopics).unknown) {
      errors.push(issue("ITEM_UNKNOWN_VOCAB_TOPIC", `${idPath}.vocabularyTopics`, `Unknown: "${topic}".`));
    }
  }

  if (!item.content || typeof item.content !== "object") {
    errors.push(issue("ITEM_CONTENT_MISSING", `${idPath}.content`, "Content required."));
  } else if (item.questionType === "writing") {
    errors.push(...validateWritingContent(idPath, item.content as ItemBankWritingContent));
  } else if (item.questionType === "speaking") {
    errors.push(...validateSpeakingContent(idPath, item.content as ItemBankSpeakingContent));
  } else if (!hasReceptivePayload(item.content as Record<string, unknown>)) {
    errors.push(issue("ITEM_CONTENT_EMPTY", `${idPath}.content`, "Receptive content empty."));
  }

  if (!item.authoringMetadata) {
    errors.push(issue("ITEM_AUTHORING_METADATA_MISSING", `${idPath}.authoringMetadata`, "Metadata required."));
  } else if (!item.authoringMetadata.source?.sourceMock) {
    warnings.push(
      issue("ITEM_SOURCE_TRACE_MISSING", `${idPath}.authoringMetadata.source`, "Missing source trace.", "warning")
    );
  }

  return { valid: errors.length === 0, errors, warnings };
}

export function validateItemBankFile(items: ItemBankQuestion[]): ItemBankValidationResult {
  const errors: ItemBankValidationIssue[] = [];
  const warnings: ItemBankValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const result = validateItemBankQuestion(items[i]!, i);
    errors.push(...result.errors);
    warnings.push(...result.warnings);

    const id = items[i]!.id;
    if (isNonEmptyString(id)) {
      if (seenIds.has(id)) {
        errors.push(issue("ITEM_ID_DUPLICATE", `items[${i}].id`, `Duplicate id: "${id}".`));
      }
      seenIds.add(id);
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

export type ItemBankExtendedValidationOptions = {
  level: ItemLevel;
  checkCoverage?: boolean;
  checkDuplicates?: boolean;
  checkBlueprint?: boolean;
};

/** M3.2 extended bank validation. */
export function validateItemBankExtended(
  items: ItemBankQuestion[],
  options: ItemBankExtendedValidationOptions
): ItemBankValidationResult {
  const base = validateItemBankFile(items);
  const errors = [...base.errors];
  const warnings = [...base.warnings];

  if (options.checkDuplicates !== false) {
    const dupes = detectItemBankDuplicates(items);
    for (const match of dupes.matches.filter((m) => m.matchType === "identical_stem")) {
      errors.push(
        issue(
          "DUPLICATE_STEM",
          `${match.itemAId}/${match.itemBId}`,
          `Identical stem: ${match.detail}`,
          "error"
        )
      );
    }
    for (const match of dupes.matches.filter((m) => m.matchType === "near_stem")) {
      warnings.push(
        issue(
          "NEAR_DUPLICATE_STEM",
          `${match.itemAId}/${match.itemBId}`,
          `Near-duplicate (${(match.similarity * 100).toFixed(0)}%): ${match.detail}`,
          "warning"
        )
      );
    }
  }

  if (options.checkCoverage !== false) {
    const matrix = buildCoverageMatrix(options.level, items);
    for (const gap of matrix.gaps.filter((g) => g.severity === "critical")) {
      warnings.push(
        issue(`COVERAGE_GAP_${gap.dimension.toUpperCase()}`, gap.key, gap.message, "warning")
      );
    }
  }

  if (options.checkBlueprint !== false && LEVEL_SET.has(options.level)) {
    const policy = getDifficultyPolicyForLevel(options.level as CambridgeExamLevel);
    const autoDifficulties = items
      .filter((i) => i.questionType !== "writing" && i.questionType !== "speaking")
      .map((i) => i.difficulty);
    const diff = validateDifficultyDistribution(autoDifficulties, policy);
    for (const err of diff.errors) {
      warnings.push(issue("DIFFICULTY_DISTRIBUTION", "bank", err, "warning"));
    }

    const blueprint = getCambridgeExamBlueprint(options.level as CambridgeExamLevel);
    const parts = new Set(items.map((i) => i.part));
    for (const paper of blueprint.papers) {
      for (const part of paper.parts) {
        if (!parts.has(part.partSlug)) {
          warnings.push(
            issue(
              "BLUEPRINT_PART_MISSING",
              part.partSlug,
              `No items for blueprint part ${part.partSlug}.`,
              "warning"
            )
          );
        }
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
