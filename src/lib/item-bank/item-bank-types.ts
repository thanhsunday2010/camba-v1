/**
 * M3.2 — Extended item bank types (Cambridge-grade, all levels, four skills).
 * Builds on M1.8 foundation; aligns with M2.0 Cambridge item bank proposal.
 */

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";

/** All Cambridge exam levels supported in the unified item bank. */
export type ItemLevel = CambridgeExamLevel;

export type ItemDifficulty = "easy" | "medium" | "hard";

export type ItemSkill =
  | "listening"
  | "reading"
  | "reading_writing"
  | "writing"
  | "speaking";

export type ItemPart = string;

/** Auto-scored receptive question types. */
export type ItemBankReceptiveQuestionType =
  | "multiple_choice"
  | "matching"
  | "gap_fill"
  | "multi_select"
  | "drag_drop"
  | "sentence_ordering"
  | "listening"
  | "reading_comprehension"
  | "image_selection";

/** M3.2 — Writing task variants (M2.2 compatible). */
export type ItemBankWritingTaskType =
  | "writing_email"
  | "writing_story"
  | "writing_message"
  | "writing_article"
  | "writing_review"
  | "write_sentence"
  | "write_note"
  | "picture_description";

/** M3.2 — Speaking task variants (M2.3 compatible). */
export type ItemBankSpeakingTaskType =
  | "speaking_personal_questions"
  | "speaking_picture_description"
  | "speaking_storytelling"
  | "speaking_discussion";

export type ItemBankQuestionType =
  | ItemBankReceptiveQuestionType
  | "writing"
  | "speaking";

/** Gold Mock traceability — every extracted item links back to source. */
export type ItemBankSourceTrace = {
  sourceLevel: ItemLevel;
  sourceMock: string;
  sourcePart: string;
  sourceQuestion: string;
  extractedAt?: string;
  goldMockTier?: "gold" | "expansion" | "manual";
};

export type ItemBankAuthoringMetadata = {
  sourceManifestId?: string;
  sourceQuestionRef?: string;
  extractedAt?: string;
  topicTag?: string | null;
  skillTag?: string | null;
  blueprintQuestionType?: string;
  cambridgeTaskType?: string;
  sectionSlug?: string;
  points?: number;
  sortOrder?: number;
  questionText?: string;
  explanation?: string | null;
  /** M3.2 canonical traceability block. */
  source?: ItemBankSourceTrace;
  rubricId?: string;
  authoringNotes?: string;
  [key: string]: unknown;
};

export type ItemBankWritingContent = {
  prompt: string;
  instructions?: string;
  taskDescription?: string;
  writingTaskType: ItemBankWritingTaskType;
  /** M2.2 runtime alias */
  cambridgeTaskType?: string;
  minWords?: number;
  maxWords?: number;
  requiredPoints?: string[];
  imageUrl?: string;
  rubricId: string;
  questionText?: string;
};

export type ItemBankSpeakingContent = {
  prompt: string;
  instructions?: string;
  speakingTaskType: ItemBankSpeakingTaskType;
  /** M2.3 runtime alias */
  cambridgeTaskType?: string;
  maxDurationSeconds: number;
  minDurationSeconds?: number;
  followUpQuestions?: string[];
  imageUrl?: string;
  pictureSequence?: string[];
  rubricId: string;
  questionText?: string;
};

export type ItemBankReceptiveContent = Record<string, unknown> & {
  questionText?: string;
  choices?: unknown[];
  pairs?: unknown[];
  template?: string;
  correctAnswers?: string[];
};

export type ItemBankQuestion = {
  id: string;
  level: ItemLevel;
  skill: ItemSkill;
  part: ItemPart;
  questionType: ItemBankQuestionType;
  difficulty: ItemDifficulty;
  grammarTags: string[];
  vocabularyTopics: string[];
  content: ItemBankReceptiveContent | ItemBankWritingContent | ItemBankSpeakingContent;
  authoringMetadata: ItemBankAuthoringMetadata;
};

export type ItemBankFile = {
  bankVersion: string;
  level: ItemLevel;
  itemCount: number;
  sourceManifests: string[];
  extractedAt?: string;
  /** M3.2 bank tier marker */
  bankTier?: "cambridge-unified";
  items: ItemBankQuestion[];
};

export type ItemBankValidationIssue = {
  code: string;
  path: string;
  message: string;
  severity?: "error" | "warning";
};

export type ItemBankValidationResult = {
  valid: boolean;
  errors: ItemBankValidationIssue[];
  warnings: ItemBankValidationIssue[];
};

export type ItemBankCoverageReport = {
  level: ItemLevel;
  totalItems: number;
  grammarCoverage: Record<string, number>;
  vocabularyCoverage: Record<string, number>;
  difficultyCoverage: Record<ItemDifficulty, number>;
  skillCoverage: Record<string, number>;
  taskTypeCoverage: Record<string, number>;
  writingTaskCoverage: Record<string, number>;
  speakingTaskCoverage: Record<string, number>;
  missingGrammarTags: string[];
  missingVocabularyTopics: string[];
};
