import { validateGrammarTags } from "@/lib/learning/grammar-taxonomy";
import { validateVocabularyTopics } from "@/lib/learning/vocabulary-taxonomy";
import type {
  ItemBankQuestion,
  ItemBankQuestionType,
  ItemBankValidationIssue,
  ItemBankValidationResult,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";

export const ITEM_BANK_LEVELS: ItemLevel[] = ["starters", "movers", "flyers"];

export const ITEM_BANK_QUESTION_TYPES: ItemBankQuestionType[] = [
  "multiple_choice",
  "matching",
  "gap_fill",
  "multi_select",
  "drag_drop",
  "sentence_ordering",
  "listening",
  "reading_comprehension",
  "image_selection",
];

const QUESTION_TYPE_SET = new Set<string>(ITEM_BANK_QUESTION_TYPES);
const LEVEL_SET = new Set<string>(ITEM_BANK_LEVELS);
const DIFFICULTY_SET = new Set<string>(["easy", "medium", "hard"]);
const SKILL_SET = new Set<string>(["listening", "reading", "reading_writing", "writing"]);

function error(code: string, path: string, message: string): ItemBankValidationIssue {
  return { code, path, message };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasQuestionPayload(content: Record<string, unknown>): boolean {
  if (Object.keys(content).length === 0) return false;
  if (isNonEmptyString(content.questionText)) return true;
  if (Array.isArray(content.choices) && content.choices.length > 0) return true;
  if (Array.isArray(content.pairs) && content.pairs.length > 0) return true;
  if (isNonEmptyString(content.template)) return true;
  return false;
}

/** Strict validation — item bank assets must be complete and canonical. */
export function validateItemBankQuestion(
  item: ItemBankQuestion,
  index?: number
): ItemBankValidationResult {
  const prefix = index !== undefined ? `items[${index}]` : "item";
  const idPath = isNonEmptyString(item.id) ? `${prefix}.${item.id}` : prefix;
  const errors: ItemBankValidationIssue[] = [];

  if (!isNonEmptyString(item.id)) {
    errors.push(error("ITEM_ID_MISSING", `${prefix}.id`, "Item id is required."));
  }

  if (!LEVEL_SET.has(item.level)) {
    errors.push(
      error("ITEM_LEVEL_INVALID", `${idPath}.level`, `Invalid level: "${item.level}".`)
    );
  }

  if (!SKILL_SET.has(item.skill)) {
    errors.push(
      error("ITEM_SKILL_INVALID", `${idPath}.skill`, `Invalid skill: "${item.skill}".`)
    );
  }

  if (!isNonEmptyString(item.part)) {
    errors.push(error("ITEM_PART_MISSING", `${idPath}.part`, "Part slug is required."));
  }

  if (!QUESTION_TYPE_SET.has(item.questionType)) {
    errors.push(
      error(
        "ITEM_QUESTION_TYPE_UNSUPPORTED",
        `${idPath}.questionType`,
        `Unsupported question type: "${item.questionType}".`
      )
    );
  }

  if (!DIFFICULTY_SET.has(item.difficulty)) {
    errors.push(
      error(
        "ITEM_DIFFICULTY_INVALID",
        `${idPath}.difficulty`,
        `Invalid difficulty: "${item.difficulty}".`
      )
    );
  }

  if (!Array.isArray(item.grammarTags) || item.grammarTags.length === 0) {
    errors.push(
      error(
        "ITEM_GRAMMAR_TAGS_MISSING",
        `${idPath}.grammarTags`,
        "At least one grammar tag is required."
      )
    );
  } else {
    const { unknown } = validateGrammarTags(item.grammarTags);
    for (const tag of unknown) {
      errors.push(
        error(
          "ITEM_UNKNOWN_GRAMMAR_TAG",
          `${idPath}.grammarTags`,
          `Unknown grammar tag: "${tag}".`
        )
      );
    }
  }

  if (!Array.isArray(item.vocabularyTopics) || item.vocabularyTopics.length === 0) {
    errors.push(
      error(
        "ITEM_VOCAB_TOPICS_MISSING",
        `${idPath}.vocabularyTopics`,
        "At least one vocabulary topic is required."
      )
    );
  } else {
    const { unknown } = validateVocabularyTopics(item.vocabularyTopics);
    for (const topic of unknown) {
      errors.push(
        error(
          "ITEM_UNKNOWN_VOCAB_TOPIC",
          `${idPath}.vocabularyTopics`,
          `Unknown vocabulary topic: "${topic}".`
        )
      );
    }
  }

  if (!item.content || typeof item.content !== "object" || Array.isArray(item.content)) {
    errors.push(
      error("ITEM_CONTENT_MISSING", `${idPath}.content`, "Content object is required.")
    );
  } else if (!hasQuestionPayload(item.content)) {
    errors.push(
      error(
        "ITEM_CONTENT_EMPTY",
        `${idPath}.content`,
        "Content must include questionText, choices, pairs, or gap-fill template."
      )
    );
  }

  if (!item.authoringMetadata || typeof item.authoringMetadata !== "object") {
    errors.push(
      error(
        "ITEM_AUTHORING_METADATA_MISSING",
        `${idPath}.authoringMetadata`,
        "Authoring metadata object is required."
      )
    );
  }

  return { valid: errors.length === 0, errors };
}

export function validateItemBankFile(items: ItemBankQuestion[]): ItemBankValidationResult {
  const errors: ItemBankValidationIssue[] = [];
  const seenIds = new Set<string>();

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;
    const result = validateItemBankQuestion(item, i);
    errors.push(...result.errors);

    if (isNonEmptyString(item.id)) {
      if (seenIds.has(item.id)) {
        errors.push(
          error("ITEM_ID_DUPLICATE", `items[${i}].id`, `Duplicate item id: "${item.id}".`)
        );
      }
      seenIds.add(item.id);
    }
  }

  return { valid: errors.length === 0, errors };
}
