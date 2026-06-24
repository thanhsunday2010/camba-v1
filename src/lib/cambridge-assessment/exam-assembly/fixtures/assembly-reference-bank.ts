import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type {
  CambridgeItemBankItem,
  CambridgeItemBankFile,
  CambridgeReceptiveBankItem,
  CambridgeSpeakingBankItem,
  CambridgeWritingBankItem,
} from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import {
  difficultyForPoolIndex,
  getDifficultyPolicyForLevel,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
import { YLE_GRAMMAR_TAGS } from "@/lib/learning/grammar-taxonomy";
import { YLE_VOCABULARY_TOPICS } from "@/lib/learning/vocabulary-taxonomy";

const POOL_MULTIPLIER = 24;

function grammarAt(index: number): string {
  return YLE_GRAMMAR_TAGS[index % YLE_GRAMMAR_TAGS.length];
}

function vocabAt(index: number): string {
  return YLE_VOCABULARY_TOPICS[index % YLE_VOCABULARY_TOPICS.length];
}

function buildReceptiveContent(
  taskType: CambridgeTaskTypeKey,
  level: CambridgeExamLevel,
  partSlug: string,
  index: number
): CambridgeReceptiveBankItem["content"] {
  const label = `${level} ${partSlug} #${index + 1}`;

  switch (taskType) {
    case "matching":
    case "audio_matching":
      return {
        questionText: `Match the items — ${label}.`,
        pairs: [
          { leftText: "Item A", rightText: "Match 1" },
          { leftText: "Item B", rightText: "Match 2" },
          { leftText: "Item C", rightText: "Match 3" },
        ],
      };
    case "audio_gap_fill":
    case "open_cloze":
      return {
        questionText: `Complete the gap — ${label}.`,
        template: "The answer is [0].",
        correctAnswers: ["correct"],
      };
    case "gapped_text":
      return {
        questionText: `Choose the missing sentence — ${label}.`,
        stimulus: {
          passage: "Paragraph with a gap for sentence selection.",
        },
        choices: [
          { text: "Correct sentence", isCorrect: true },
          { text: "Wrong sentence A", isCorrect: false },
          { text: "Wrong sentence B", isCorrect: false },
        ],
      };
    case "reading_comprehension":
      return {
        questionText: `Read and answer — ${label}.`,
        stimulus: { passage: "Short reading passage for comprehension." },
        choices: [
          { text: "Correct answer", isCorrect: true },
          { text: "Distractor A", isCorrect: false },
          { text: "Distractor B", isCorrect: false },
        ],
      };
    case "audio_multiple_choice":
      return {
        questionText: `Listen and choose — ${label}.`,
        stimulus: {
          audioUrl: `/audio/assembly/${level}/${partSlug}-${index}.mp3`,
          transcript: "Sample listening transcript.",
        },
        choices: [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
        ],
      };
    case "true_false":
      return {
        questionText: `Is this statement true? — ${label}.`,
        stimulus: { passage: "Statement context passage." },
        choices: [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ],
      };
    default:
      return {
        questionText: `Choose the correct answer — ${label}.`,
        choices: [
          { text: "Correct", isCorrect: true },
          { text: "Wrong A", isCorrect: false },
          { text: "Wrong B", isCorrect: false },
        ],
      };
  }
}

function buildWritingContent(
  taskType: CambridgeTaskTypeKey,
  level: CambridgeExamLevel,
  partSlug: string,
  index: number
): CambridgeWritingBankItem["content"] {
  const label = `${level} ${partSlug} writing #${index + 1}`;
  const base = {
    prompt: `Writing task: ${label}.`,
    taskDescription: "Respond to the prompt in complete sentences.",
    rubricId: `cambridge-${taskType}-v1`,
  };

  switch (taskType) {
    case "write_sentence":
    case "picture_description_writing":
      return {
        ...base,
        minWords: 3,
        maxWords: 25,
        stimulus: { imageUrl: "/images/placeholders/writing-picture.svg" },
      };
    case "write_note":
      return {
        ...base,
        minWords: 15,
        maxWords: 50,
        requiredPoints: ["Say where you are", "Say what you are doing"],
      };
    case "write_email":
      return {
        ...base,
        minWords: 25,
        maxWords: 100,
        requiredPoints: ["Respond to all bullet points", "Use appropriate register"],
      };
    case "write_story":
      return {
        ...base,
        minWords: 35,
        maxWords: 100,
        stimulus: {
          imageUrl: "/images/placeholders/writing-story.svg",
          bulletPoints: ["Beginning", "Middle", "End"],
        },
      };
    default:
      return { ...base, minWords: 10, maxWords: 80 };
  }
}

function buildSpeakingContent(
  taskType: CambridgeTaskTypeKey,
  level: CambridgeExamLevel,
  partSlug: string,
  index: number
): CambridgeSpeakingBankItem["content"] {
  const label = `${level} ${partSlug} speaking #${index + 1}`;
  const base = {
    prompt: `Speaking task: ${label}.`,
    maxDurationSeconds: 120,
    rubricId: `cambridge-${taskType}-v1`,
  };

  switch (taskType) {
    case "picture_description_speaking":
      return {
        ...base,
        examinerScript: "Describe what you see in the picture.",
        stimulus: { imageUrl: "/images/placeholders/speaking-picture.svg" },
      };
    case "story_telling":
      return {
        ...base,
        maxDurationSeconds: 180,
        examinerScript: "Tell the story shown in the pictures.",
        stimulus: {
          pictureSequence: [
            "/images/placeholders/story-1.svg",
            "/images/placeholders/story-2.svg",
            "/images/placeholders/story-3.svg",
          ],
        },
      };
    case "conversation":
      return {
        ...base,
        maxDurationSeconds: 240,
        examinerScript: "Discuss the topic with your partner.",
        followUpQuestions: ["What do you think?", "Why do you prefer that?"],
      };
    default:
      return {
        ...base,
        examinerScript: "Answer the examiner's questions.",
        followUpQuestions: ["What is your name?", "How old are you?"],
        stimulus: { imageUrl: "/images/placeholders/speaking-interview.svg" },
      };
  }
}

function createBankItem(
  level: CambridgeExamLevel,
  partSlug: string,
  skill: CambridgeItemBankItem["skill"],
  taskType: CambridgeTaskTypeKey,
  index: number,
  points: number
): CambridgeItemBankItem {
  const policy = getDifficultyPolicyForLevel(level);
  const difficulty = difficultyForPoolIndex(index, policy);
  const metadata = {
    grammarTags: [grammarAt(index), grammarAt(index + 3)],
    vocabularyTopics: [vocabAt(index), vocabAt(index + 5)],
    authoringNotes: "M2.4 assembly reference bank — architecture validation only.",
  };
  const id = `${level}-${partSlug}-${taskType}-${String(index).padStart(3, "0")}`;

  if (skill === "writing") {
    const item: CambridgeWritingBankItem = {
      id,
      level,
      kind: "writing",
      skill: "writing",
      partSlug,
      taskType,
      difficulty,
      metadata,
      authoringVersion: "1.0.0",
      content: buildWritingContent(taskType, level, partSlug, index),
      scoring: { mode: "ai", maxPoints: points, rubricVersion: "1.0.0" },
    };
    return item;
  }

  if (skill === "speaking") {
    const item: CambridgeSpeakingBankItem = {
      id,
      level,
      kind: "speaking",
      skill: "speaking",
      partSlug,
      taskType,
      difficulty,
      metadata,
      authoringVersion: "1.0.0",
      content: buildSpeakingContent(taskType, level, partSlug, index),
      scoring: { mode: "ai", maxPoints: points, rubricVersion: "1.0.0" },
    };
    return item;
  }

  const kind = skill === "listening" ? "listening" : "reading";
  const item: CambridgeReceptiveBankItem = {
    id,
    level,
    kind,
    skill,
    partSlug,
    taskType,
    difficulty,
    metadata,
    authoringVersion: "1.0.0",
    content: buildReceptiveContent(taskType, level, partSlug, index),
    scoring: { mode: "auto", maxPoints: points },
  };
  return item;
}

/** Build a reference item bank large enough for A/B/C assembly at a given level. */
export function buildReferenceBankForLevel(level: CambridgeExamLevel): CambridgeItemBankItem[] {
  const blueprint = getCambridgeExamBlueprint(level);
  const items: CambridgeItemBankItem[] = [];

  for (const paper of blueprint.papers) {
    for (const part of paper.parts) {
      const poolSize = Math.max(part.questionCount * POOL_MULTIPLIER, 12);
      for (let i = 0; i < poolSize; i += 1) {
        const taskType = part.allowedTaskTypes[i % part.allowedTaskTypes.length];
        items.push(
          createBankItem(
            level,
            part.partSlug,
            part.skill,
            taskType,
            i,
            part.pointsPerItem
          )
        );
      }
    }
  }

  return items;
}

export function buildReferenceBankFile(level: CambridgeExamLevel): CambridgeItemBankFile {
  const items = buildReferenceBankForLevel(level);
  return {
    bankVersion: "1.0.0",
    level,
    itemCount: items.length,
    items,
    lastUpdated: new Date().toISOString(),
  };
}

export const ASSEMBLY_REFERENCE_BANK_LEVELS = [
  "starters",
  "movers",
  "flyers",
  "ket",
  "pet",
] as const satisfies readonly CambridgeExamLevel[];
