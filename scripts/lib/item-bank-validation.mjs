/** Node mirror of src/lib/item-bank/item-bank-validation.ts (strict). */

import { isKnownGrammarTag } from "./grammar-taxonomy.mjs";
import { isKnownVocabularyTopic } from "./vocabulary-taxonomy.mjs";

export const ITEM_BANK_LEVELS = ["starters", "movers", "flyers"];

const QUESTION_TYPES = new Set([
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

const LEVEL_SET = new Set(ITEM_BANK_LEVELS);
const DIFFICULTY_SET = new Set(["easy", "medium", "hard"]);
const SKILL_SET = new Set(["listening", "reading", "reading_writing", "writing"]);

function error(code, path, message) {
  return { code, path, message };
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasQuestionPayload(content) {
  if (!content || typeof content !== "object") return false;
  if (Object.keys(content).length === 0) return false;
  if (isNonEmptyString(content.questionText)) return true;
  if (Array.isArray(content.choices) && content.choices.length > 0) return true;
  if (Array.isArray(content.pairs) && content.pairs.length > 0) return true;
  if (isNonEmptyString(content.template)) return true;
  return false;
}

export function validateItemBankQuestion(item, index) {
  const prefix = index !== undefined ? `items[${index}]` : "item";
  const idPath = isNonEmptyString(item.id) ? `${prefix}.${item.id}` : prefix;
  const errors = [];

  if (!isNonEmptyString(item.id)) {
    errors.push(error("ITEM_ID_MISSING", `${prefix}.id`, "Item id is required."));
  }
  if (!LEVEL_SET.has(item.level)) {
    errors.push(error("ITEM_LEVEL_INVALID", `${idPath}.level`, `Invalid level: "${item.level}".`));
  }
  if (!SKILL_SET.has(item.skill)) {
    errors.push(error("ITEM_SKILL_INVALID", `${idPath}.skill`, `Invalid skill: "${item.skill}".`));
  }
  if (!isNonEmptyString(item.part)) {
    errors.push(error("ITEM_PART_MISSING", `${idPath}.part`, "Part slug is required."));
  }
  if (!QUESTION_TYPES.has(item.questionType)) {
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
      error("ITEM_DIFFICULTY_INVALID", `${idPath}.difficulty`, `Invalid difficulty: "${item.difficulty}".`)
    );
  }
  if (!Array.isArray(item.grammarTags) || item.grammarTags.length === 0) {
    errors.push(
      error("ITEM_GRAMMAR_TAGS_MISSING", `${idPath}.grammarTags`, "At least one grammar tag is required.")
    );
  } else {
    for (const tag of item.grammarTags) {
      const slug = tag.trim().toLowerCase().replace(/\s+/g, "_");
      if (!isKnownGrammarTag(slug)) {
        errors.push(
          error("ITEM_UNKNOWN_GRAMMAR_TAG", `${idPath}.grammarTags`, `Unknown grammar tag: "${tag}".`)
        );
      }
    }
  }
  if (!Array.isArray(item.vocabularyTopics) || item.vocabularyTopics.length === 0) {
    errors.push(
      error("ITEM_VOCAB_TOPICS_MISSING", `${idPath}.vocabularyTopics`, "At least one vocabulary topic is required.")
    );
  } else {
    for (const topic of item.vocabularyTopics) {
      const slug = topic.trim().toLowerCase().replace(/\s+/g, "_");
      if (!isKnownVocabularyTopic(slug)) {
        errors.push(
          error(
            "ITEM_UNKNOWN_VOCAB_TOPIC",
            `${idPath}.vocabularyTopics`,
            `Unknown vocabulary topic: "${topic}".`
          )
        );
      }
    }
  }
  if (!item.content || typeof item.content !== "object" || Array.isArray(item.content)) {
    errors.push(error("ITEM_CONTENT_MISSING", `${idPath}.content`, "Content object is required."));
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

export function validateItemBankFile(items) {
  const errors = [];
  const seenIds = new Set();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
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
