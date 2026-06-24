/**
 * M2.0 — Future item bank architecture proposal (types only).
 * Extends M1.8 item bank to support all four skills and AI-evaluated tasks.
 */

import type {
  CambridgeExamLevel,
  CambridgeSkill,
} from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

/** Discriminated item kinds in the unified Cambridge item bank. */
export type CambridgeItemKind = "reading" | "listening" | "writing" | "speaking";

export type CambridgeItemDifficulty = "easy" | "medium" | "hard";

export type CambridgeItemMetadata = {
  grammarTags: string[];
  vocabularyTopics: string[];
  cefrBand?: string;
  topicTags?: string[];
  sourceManifestId?: string;
  sourceQuestionRef?: string;
  extractedAt?: string;
  authoringNotes?: string;
};

/** Base fields shared by all bank items. */
export type CambridgeItemBankBase = {
  id: string;
  level: CambridgeExamLevel;
  kind: CambridgeItemKind;
  skill: CambridgeSkill;
  partSlug: string;
  taskType: CambridgeTaskTypeKey;
  difficulty: CambridgeItemDifficulty;
  metadata: CambridgeItemMetadata;
  authoringVersion: string;
};

/** Auto-scored receptive items (reading/listening). */
export type CambridgeReceptiveBankItem = CambridgeItemBankBase & {
  kind: "reading" | "listening";
  content: {
    questionText: string;
    stimulus?: {
      passage?: string;
      audioUrl?: string;
      transcript?: string;
      imageUrl?: string;
    };
    choices?: Array<{ text: string; isCorrect: boolean; mediaUrl?: string }>;
    pairs?: Array<{ leftText: string; rightText: string }>;
    template?: string;
    correctAnswers?: string[];
  };
  scoring: { mode: "auto"; maxPoints: number };
};

/** Productive writing tasks evaluated by AI. */
export type CambridgeWritingBankItem = CambridgeItemBankBase & {
  kind: "writing";
  content: {
    prompt: string;
    taskDescription: string;
    minWords?: number;
    maxWords?: number;
    requiredPoints?: string[];
    stimulus?: { imageUrl?: string; bulletPoints?: string[] };
    rubricId: string;
  };
  scoring: { mode: "ai"; maxPoints: number; rubricVersion: string };
};

/** Productive speaking tasks evaluated by AI. */
export type CambridgeSpeakingBankItem = CambridgeItemBankBase & {
  kind: "speaking";
  content: {
    prompt: string;
    examinerScript?: string;
    followUpQuestions?: string[];
    stimulus?: { imageUrl?: string; pictureSequence?: string[] };
    maxDurationSeconds: number;
    rubricId: string;
  };
  scoring: { mode: "ai"; maxPoints: number; rubricVersion: string };
};

export type CambridgeItemBankItem =
  | CambridgeReceptiveBankItem
  | CambridgeWritingBankItem
  | CambridgeSpeakingBankItem;

export type CambridgeItemBankFile = {
  bankVersion: string;
  level: CambridgeExamLevel;
  itemCount: number;
  items: CambridgeItemBankItem[];
  lastUpdated: string;
};

/** Assembly reference — mock manifest points to bank items instead of inline questions. */
export type CambridgeItemReference = {
  itemId: string;
  partSlug: string;
  sortOrder: number;
  pointsOverride?: number;
};

/**
 * Proposed filesystem layout (M2.1+):
 *
 * data/cambridge-item-bank/
 *   starters/
 *     reading.json
 *     listening.json
 *     writing.json
 *     speaking.json
 *   movers/ ...
 *   ket/ ...
 *
 * Or unified items.json per level with kind filter (M1.8 compatible).
 */
export type CambridgeItemBankLayout = "unified" | "by_skill";

export type CambridgeItemBankQuery = {
  level: CambridgeExamLevel;
  kind?: CambridgeItemKind;
  skill?: CambridgeSkill;
  taskType?: CambridgeTaskTypeKey;
  partSlug?: string;
  grammarTag?: string;
  vocabularyTopic?: string;
  difficulty?: CambridgeItemDifficulty;
};

/** Future registry interface — mirrors M1.8 but skill-aware. */
export interface CambridgeItemBankRegistry {
  loadLevel(level: CambridgeExamLevel): Promise<CambridgeItemBankItem[]>;
  query(filters: CambridgeItemBankQuery): Promise<CambridgeItemBankItem[]>;
  validateItem(item: CambridgeItemBankItem): { valid: boolean; errors: string[] };
}
