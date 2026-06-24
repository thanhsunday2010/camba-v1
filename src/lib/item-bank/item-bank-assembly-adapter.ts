/**
 * M3.2 — Adapt unified item-bank entries for M2.4 exam assembly.
 */

import type { CambridgeItemBankItem } from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type {
  ItemBankQuestion,
  ItemBankSpeakingContent,
  ItemBankWritingContent,
} from "@/lib/item-bank/item-bank-types";

const WRITING_TASK_MAP: Record<string, CambridgeTaskTypeKey> = {
  write_sentence: "write_sentence",
  write_note: "write_note",
  writing_message: "write_note",
  writing_email: "write_email",
  writing_story: "write_story",
  writing_article: "write_email",
  writing_review: "write_email",
  picture_description: "picture_description_writing",
};

const SPEAKING_TASK_MAP: Record<string, CambridgeTaskTypeKey> = {
  speaking_personal_questions: "short_answer",
  speaking_picture_description: "picture_description_speaking",
  speaking_storytelling: "story_telling",
  speaking_discussion: "conversation",
};

function assemblySkill(item: ItemBankQuestion): CambridgeItemBankItem["skill"] {
  if (item.skill === "reading_writing") return "reading";
  return item.skill as CambridgeItemBankItem["skill"];
}

function mapReceptiveTaskType(item: ItemBankQuestion): CambridgeTaskTypeKey {
  const blueprint = item.authoringMetadata.blueprintQuestionType ?? "";
  const listening = item.skill === "listening";

  if (item.questionType === "matching") {
    return listening ? "audio_matching" : "matching";
  }
  if (item.questionType === "gap_fill") {
    return listening ? "audio_gap_fill" : "open_cloze";
  }
  if (item.questionType === "reading_comprehension") {
    return "reading_comprehension";
  }
  if (item.questionType === "sentence_ordering") {
    return "sentence_ordering";
  }
  if (listening || blueprint.includes("listening") || item.questionType === "listening") {
    return "audio_multiple_choice";
  }
  return "multiple_choice";
}

function mapTaskType(item: ItemBankQuestion): CambridgeTaskTypeKey {
  if (item.questionType === "writing") {
    const c = item.content as ItemBankWritingContent;
    const key = c.writingTaskType ?? c.cambridgeTaskType ?? "write_sentence";
    return WRITING_TASK_MAP[key] ?? "write_sentence";
  }
  if (item.questionType === "speaking") {
    const c = item.content as ItemBankSpeakingContent;
    const key = c.speakingTaskType ?? c.cambridgeTaskType ?? "speaking_personal_questions";
    return SPEAKING_TASK_MAP[key] ?? "short_answer";
  }
  return mapReceptiveTaskType(item);
}

function isM32ItemBankItem(item: unknown): item is ItemBankQuestion {
  return (
    typeof item === "object" &&
    item !== null &&
    "questionType" in item &&
    "part" in item &&
    !("taskType" in item)
  );
}

export function isM32ItemBankFile(items: unknown[]): boolean {
  return items.length > 0 && isM32ItemBankItem(items[0]);
}

/** Convert M3.2 ItemBankQuestion[] to M2.4 assembly bank items. */
export function adaptItemBankForAssembly(items: ItemBankQuestion[]): CambridgeItemBankItem[] {
  return items.map(adaptSingleItemForAssembly);
}

function adaptSingleItemForAssembly(item: ItemBankQuestion): CambridgeItemBankItem {
  const skill = assemblySkill(item);
  const taskType = mapTaskType(item);
  const metadata = {
    grammarTags: [...item.grammarTags],
    vocabularyTopics: [...item.vocabularyTopics],
    sourceManifestId: item.authoringMetadata.sourceManifestId,
    sourceQuestionRef: item.authoringMetadata.sourceQuestionRef,
    extractedAt: item.authoringMetadata.extractedAt,
    authoringNotes: item.authoringMetadata.authoringNotes,
  };
  const base = {
    id: item.id,
    level: item.level,
    skill,
    partSlug: item.part,
    taskType,
    difficulty: item.difficulty,
    metadata,
    authoringVersion: "2.0.0",
  };
  const points = item.authoringMetadata.points ?? 1;
  const raw = item.content as Record<string, unknown>;

  if (item.questionType === "writing") {
    const c = item.content as ItemBankWritingContent;
    return {
      ...base,
      kind: "writing",
      content: {
        prompt: c.prompt,
        taskDescription: c.instructions ?? c.taskDescription ?? c.prompt,
        minWords: c.minWords,
        maxWords: c.maxWords,
        requiredPoints: c.requiredPoints,
        stimulus: c.imageUrl ? { imageUrl: c.imageUrl } : undefined,
        rubricId: c.rubricId,
      },
      scoring: { mode: "ai", maxPoints: points, rubricVersion: "1.0.0" },
    };
  }

  if (item.questionType === "speaking") {
    const c = item.content as ItemBankSpeakingContent;
    return {
      ...base,
      kind: "speaking",
      content: {
        prompt: c.prompt,
        followUpQuestions: c.followUpQuestions,
        stimulus: c.imageUrl
          ? { imageUrl: c.imageUrl, pictureSequence: c.pictureSequence }
          : c.pictureSequence
            ? { pictureSequence: c.pictureSequence }
            : undefined,
        maxDurationSeconds: c.maxDurationSeconds,
        rubricId: c.rubricId,
      },
      scoring: { mode: "ai", maxPoints: points, rubricVersion: "1.0.0" },
    };
  }

  const kind = skill === "listening" ? "listening" : "reading";
  return {
    ...base,
    kind,
    content: {
      questionText: String(raw.questionText ?? item.authoringMetadata.questionText ?? ""),
      stimulus: {
        passage: typeof raw.passage === "string" ? raw.passage : undefined,
        audioUrl: typeof raw.audioUrl === "string" ? raw.audioUrl : undefined,
        transcript:
          typeof raw.transcript === "string"
            ? raw.transcript
            : typeof raw.transcriptSnippet === "string"
              ? raw.transcriptSnippet
              : undefined,
        imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : undefined,
      },
      choices: Array.isArray(raw.choices)
        ? (raw.choices as Array<{ text: string; isCorrect: boolean }>)
        : undefined,
      pairs: Array.isArray(raw.pairs)
        ? (raw.pairs as Array<{ leftText: string; rightText: string }>)
        : undefined,
      template: typeof raw.template === "string" ? raw.template : undefined,
      correctAnswers: Array.isArray(raw.correctAnswers)
        ? (raw.correctAnswers as string[])
        : undefined,
    },
    scoring: { mode: "auto", maxPoints: points },
  };
}
