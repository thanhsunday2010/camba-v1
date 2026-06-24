/**
 * M3.2 — Expansion item factory (manually curated stems, no LLM generation).
 */

import type {
  ItemBankQuestion,
  ItemBankSpeakingContent,
  ItemBankWritingContent,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";

type ExpansionSlot = {
  id: string;
  part: string;
  skill: ItemBankQuestion["skill"];
  questionType: ItemBankQuestion["questionType"];
  difficulty: ItemBankQuestion["difficulty"];
  grammarTags: string[];
  vocabularyTopics: string[];
  topicTag: string;
  stem: string;
  writing?: Partial<ItemBankWritingContent>;
  speaking?: Partial<ItemBankSpeakingContent>;
  choices?: Array<{ text: string; isCorrect: boolean }>;
  template?: string;
  correctAnswers?: string[];
};

function buildExpansionItem(level: ItemLevel, slot: ExpansionSlot): ItemBankQuestion {
  let content: ItemBankQuestion["content"];

  if (slot.questionType === "writing" && slot.writing) {
    content = {
      prompt: slot.writing.prompt ?? slot.stem,
      instructions: slot.writing.instructions,
      writingTaskType: slot.writing.writingTaskType ?? "writing_message",
      cambridgeTaskType: slot.writing.cambridgeTaskType,
      minWords: slot.writing.minWords,
      maxWords: slot.writing.maxWords,
      rubricId: slot.writing.rubricId ?? `expansion-${slot.writing.writingTaskType}-v1`,
      questionText: slot.stem,
    };
  } else if (slot.questionType === "speaking" && slot.speaking) {
    content = {
      prompt: slot.speaking.prompt ?? slot.stem,
      speakingTaskType: slot.speaking.speakingTaskType ?? "speaking_personal_questions",
      cambridgeTaskType: slot.speaking.cambridgeTaskType,
      maxDurationSeconds: slot.speaking.maxDurationSeconds ?? 120,
      followUpQuestions: slot.speaking.followUpQuestions,
      rubricId: slot.speaking.rubricId ?? `expansion-${slot.speaking.speakingTaskType}-v1`,
      questionText: slot.stem,
    };
  } else {
    content = {
      questionText: slot.stem,
      ...(slot.choices ? { choices: slot.choices } : {}),
      ...(slot.template ? { template: slot.template, correctAnswers: slot.correctAnswers } : {}),
    };
  }

  return {
    id: `${level}-exp-${slot.id}`,
    level,
    skill: slot.skill,
    part: slot.part,
    questionType: slot.questionType,
    difficulty: slot.difficulty,
    grammarTags: slot.grammarTags,
    vocabularyTopics: slot.vocabularyTopics,
    content,
    authoringMetadata: {
      topicTag: slot.topicTag,
      skillTag: slot.skill,
      questionText: slot.stem,
      extractedAt: new Date().toISOString(),
      source: {
        sourceLevel: level,
        sourceMock: `${level}-expansion-batch-1`,
        sourcePart: slot.part,
        sourceQuestion: slot.id,
        goldMockTier: "expansion",
      },
      authoringNotes: "M3.2 manual expansion sample — high-quality authored content.",
    },
  };
}

export function buildExpansionItems(level: ItemLevel, slots: ExpansionSlot[]): ItemBankQuestion[] {
  return slots.map((s) => buildExpansionItem(level, s));
}

export type { ExpansionSlot };
