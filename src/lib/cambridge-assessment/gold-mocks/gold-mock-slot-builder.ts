/**
 * M4.1 — Build Gold Mock questions from curated slot data (manual authoring).
 */

import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { GoldMockQuestionBlock } from "@/lib/cambridge-assessment/gold-mock-format";
import {
  goldGapFill,
  goldMatching,
  goldMcq,
  goldReadingComprehension,
  goldSpeaking,
  goldWriting,
  listeningAudio,
  readingSectionSlug,
  uniquifyQuestionStems,
} from "@/lib/cambridge-assessment/gold-mocks/gold-mock-helpers";

export type GoldMockSlot =
  | {
      kind: "matching";
      ref: string;
      partSlug: string;
      sectionSlug: string;
      skillTag: string;
      difficulty: "easy" | "medium" | "hard";
      topicTag: string;
      grammarTags: string[];
      vocabularyTopics: string[];
      questionText: string;
      leftText: string;
      rightText: string;
      transcriptSnippet?: string;
    }
  | {
      kind: "gap_fill";
      ref: string;
      partSlug: string;
      sectionSlug: string;
      skillTag: string;
      difficulty: "easy" | "medium" | "hard";
      topicTag: string;
      grammarTags: string[];
      vocabularyTopics: string[];
      questionText: string;
      template: string;
      correctAnswers: string[];
      transcriptSnippet?: string;
    }
  | {
      kind: "mcq";
      ref: string;
      partSlug: string;
      sectionSlug: string;
      skillTag: string;
      difficulty: "easy" | "medium" | "hard";
      topicTag: string;
      grammarTags: string[];
      vocabularyTopics: string[];
      questionText: string;
      blueprintQuestionType: "mcq_listening" | "mcq_single";
      choices: Array<{ text: string; isCorrect: boolean }>;
      transcriptSnippet?: string;
    }
  | {
      kind: "reading_comprehension";
      ref: string;
      partSlug: string;
      sectionSlug: string;
      skillTag: string;
      difficulty: "easy" | "medium" | "hard";
      topicTag: string;
      grammarTags: string[];
      vocabularyTopics: string[];
      questionText: string;
      passage: string;
      choices: Array<{ text: string; isCorrect: boolean }>;
    }
  | {
      kind: "writing";
      ref: string;
      partSlug: string;
      sectionSlug: string;
      difficulty: "easy" | "medium" | "hard";
      topicTag: string;
      grammarTags: string[];
      vocabularyTopics: string[];
      questionText: string;
      cambridgeTaskType: string;
      prompt: string;
      taskDescription?: string;
      minWords?: number;
      maxWords?: number;
      requiredPoints?: string[];
      points?: number;
    }
  | {
      kind: "speaking";
      ref: string;
      partSlug: string;
      sectionSlug: string;
      difficulty: "easy" | "medium" | "hard";
      topicTag: string;
      grammarTags: string[];
      vocabularyTopics: string[];
      questionText: string;
      cambridgeTaskType: string;
      prompt: string;
      taskDescription?: string;
      maxDurationSeconds: number;
      followUpQuestions?: string[];
      points?: number;
    };

export function slotToQuestion(slot: GoldMockSlot, sortOrder: number): GoldMockQuestionBlock {
  const base = {
    questionRef: slot.ref,
    partSlug: slot.partSlug,
    sectionSlug: slot.sectionSlug,
    sortOrder,
    difficulty: slot.difficulty,
    topicTag: slot.topicTag,
    grammarTags: slot.grammarTags,
    vocabularyTopics: slot.vocabularyTopics,
    questionText: slot.questionText,
  };

  switch (slot.kind) {
    case "matching":
      return goldMatching({
        ...base,
        skillTag: slot.skillTag,
        points: 1,
        pairs: [{ leftText: slot.leftText, rightText: slot.rightText }],
        content: slot.transcriptSnippet ? { transcriptSnippet: slot.transcriptSnippet } : undefined,
      });
    case "gap_fill":
      return goldGapFill({
        ...base,
        skillTag: slot.skillTag,
        points: 1,
        template: slot.template,
        correctAnswers: slot.correctAnswers,
        content: slot.transcriptSnippet ? { transcriptSnippet: slot.transcriptSnippet } : undefined,
      });
    case "mcq":
      return goldMcq({
        ...base,
        skillTag: slot.skillTag,
        points: 1,
        blueprintQuestionType: slot.blueprintQuestionType,
        choices: slot.choices,
        content: slot.transcriptSnippet ? { transcriptSnippet: slot.transcriptSnippet } : undefined,
      });
    case "reading_comprehension":
      return goldReadingComprehension({
        ...base,
        skillTag: slot.skillTag,
        points: 1,
        passage: slot.passage,
        choices: slot.choices,
      });
    case "writing":
      return goldWriting({
        ...base,
        skillTag: "writing",
        points: slot.points ?? 1,
        cambridgeTaskType: slot.cambridgeTaskType,
        prompt: slot.prompt,
        taskDescription: slot.taskDescription,
        minWords: slot.minWords,
        maxWords: slot.maxWords,
        requiredPoints: slot.requiredPoints,
      });
    case "speaking":
      return goldSpeaking({
        ...base,
        skillTag: "speaking",
        points: slot.points ?? 5,
        cambridgeTaskType: slot.cambridgeTaskType,
        prompt: slot.prompt,
        taskDescription: slot.taskDescription,
        maxDurationSeconds: slot.maxDurationSeconds,
        followUpQuestions: slot.followUpQuestions,
      });
    default:
      throw new Error("Unknown slot kind");
  }
}

export function buildQuestionsFromSlots(slots: GoldMockSlot[]): GoldMockQuestionBlock[] {
  return uniquifyQuestionStems(slots.map((s, i) => slotToQuestion(s, i + 1)));
}

export function buildListeningPartsForLevel(
  level: CambridgeExamLevel,
  transcripts: Record<string, string>
) {
  const blueprint = getCambridgeExamBlueprint(level);
  const listening = blueprint.papers.find((p) => p.paperSlug === "listening");
  if (!listening) return [];
  return listening.parts.map((part) =>
    listeningAudio(
      part.partSlug,
      part.partNumber,
      part.title,
      transcripts[part.partSlug] ?? `Listening ${part.title} — Gold Mock audio transcript.`
    )
  );
}

export function defaultReadingSection(level: CambridgeExamLevel): string {
  return readingSectionSlug(level);
}
