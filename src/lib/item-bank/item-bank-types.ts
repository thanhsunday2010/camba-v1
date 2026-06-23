/**
 * M1.8 — Canonical item-bank types (independent of mock manifest schema).
 */

export type ItemLevel = "starters" | "movers" | "flyers";

export type ItemDifficulty = "easy" | "medium" | "hard";

export type ItemSkill = "listening" | "reading" | "reading_writing" | "writing";

/** Part identifier — typically the mock part slug (e.g. rw-part-2-sentences). */
export type ItemPart = string;

/** CAMBA auto-scored question types supported in the item bank today. */
export type ItemBankQuestionType =
  | "multiple_choice"
  | "matching"
  | "gap_fill"
  | "multi_select"
  | "drag_drop"
  | "sentence_ordering"
  | "listening"
  | "reading_comprehension"
  | "image_selection";

export type ItemBankAuthoringMetadata = {
  /** Source mock manifest id when extracted from a manifest. */
  sourceManifestId?: string;
  sourceQuestionRef?: string;
  extractedAt?: string;
  topicTag?: string | null;
  skillTag?: string | null;
  blueprintQuestionType?: string;
  sectionSlug?: string;
  points?: number;
  sortOrder?: number;
  questionText?: string;
  explanation?: string | null;
  [key: string]: unknown;
};

/** Reusable question asset — independent of any single mock manifest. */
export type ItemBankQuestion = {
  id: string;
  level: ItemLevel;
  skill: ItemSkill;
  part: ItemPart;
  questionType: ItemBankQuestionType;
  difficulty: ItemDifficulty;
  grammarTags: string[];
  vocabularyTopics: string[];
  content: Record<string, unknown>;
  authoringMetadata: ItemBankAuthoringMetadata;
};

export type ItemBankFile = {
  bankVersion: string;
  level: ItemLevel;
  itemCount: number;
  sourceManifests: string[];
  extractedAt?: string;
  items: ItemBankQuestion[];
};

export type ItemBankValidationIssue = {
  code: string;
  path: string;
  message: string;
};

export type ItemBankValidationResult = {
  valid: boolean;
  errors: ItemBankValidationIssue[];
};

export type ItemBankCoverageReport = {
  level: ItemLevel;
  totalItems: number;
  grammarCoverage: Record<string, number>;
  vocabularyCoverage: Record<string, number>;
  difficultyCoverage: Record<ItemDifficulty, number>;
  skillCoverage: Record<string, number>;
  missingGrammarTags: string[];
  missingVocabularyTopics: string[];
};
