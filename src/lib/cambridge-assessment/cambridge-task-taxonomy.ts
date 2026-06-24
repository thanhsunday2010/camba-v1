/**
 * M2.0 — Canonical Cambridge task taxonomy (single source of truth).
 * Maps official task families → CAMBA scoring and AI requirements.
 */

import type {
  CambridgeExamLevel,
  CambridgeScoringMode,
  CambridgeSkill,
} from "@/lib/cambridge-assessment/cambridge-assessment-types";

export type CambridgeTaskTypeKey =
  // Reading
  | "multiple_choice"
  | "matching"
  | "true_false"
  | "sentence_ordering"
  | "reading_comprehension"
  | "open_cloze"
  | "gapped_text"
  // Listening
  | "audio_multiple_choice"
  | "audio_matching"
  | "audio_gap_fill"
  | "audio_true_false"
  // Writing
  | "write_sentence"
  | "write_note"
  | "write_email"
  | "write_story"
  | "picture_description_writing"
  // Speaking
  | "short_answer"
  | "picture_description_speaking"
  | "story_telling"
  | "conversation";

export type CambridgeTaskDefinition = {
  key: CambridgeTaskTypeKey;
  label: string;
  skill: CambridgeSkill;
  /** Whether Gemini (or future AI) evaluation is required for this task. */
  aiRequired: boolean;
  /** Whether CAMBA can score without AI/human intervention. */
  autoScored: boolean;
  scoringMode: CambridgeScoringMode;
  minimumLevel: CambridgeExamLevel;
  maximumLevel: CambridgeExamLevel;
  /** Typical response shape for player and scoring adapters. */
  responseShape:
    | "single_choice"
    | "multi_choice"
    | "matching_pairs"
    | "gap_fill_text"
    | "sentence_order"
    | "free_text"
    | "audio_response";
  /** Legacy CAMBA question_type alias where applicable. */
  legacyCambaQuestionType?: string;
  description: string;
};

const LEVEL_ORDER: CambridgeExamLevel[] = ["starters", "movers", "flyers", "ket", "pet"];

function levelIndex(level: CambridgeExamLevel): number {
  return LEVEL_ORDER.indexOf(level);
}

/** Returns true when `level` is within [minimumLevel, maximumLevel]. */
export function isTaskAvailableAtLevel(
  task: CambridgeTaskDefinition,
  level: CambridgeExamLevel
): boolean {
  const idx = levelIndex(level);
  return idx >= levelIndex(task.minimumLevel) && idx <= levelIndex(task.maximumLevel);
}

export const CAMBRIDGE_TASK_TAXONOMY: Record<CambridgeTaskTypeKey, CambridgeTaskDefinition> = {
  // ── Reading ──────────────────────────────────────────────────────────────
  multiple_choice: {
    key: "multiple_choice",
    label: "Multiple choice",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "single_choice",
    legacyCambaQuestionType: "multiple_choice",
    description: "Select one correct answer from 3–4 options after reading a short text.",
  },
  matching: {
    key: "matching",
    label: "Matching",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "matching_pairs",
    legacyCambaQuestionType: "matching",
    description: "Match items from two sets (words, people, headings, texts).",
  },
  true_false: {
    key: "true_false",
    label: "True / False / Not stated",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "movers",
    maximumLevel: "pet",
    responseShape: "single_choice",
    description: "Decide whether statements agree with a text.",
  },
  sentence_ordering: {
    key: "sentence_ordering",
    label: "Sentence ordering",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "movers",
    maximumLevel: "pet",
    responseShape: "sentence_order",
    legacyCambaQuestionType: "sentence_ordering",
    description: "Put sentences or paragraphs in correct order.",
  },
  reading_comprehension: {
    key: "reading_comprehension",
    label: "Reading comprehension (passage MCQ)",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "single_choice",
    legacyCambaQuestionType: "reading_comprehension",
    description: "Answer questions about a shared reading passage.",
  },
  open_cloze: {
    key: "open_cloze",
    label: "Open cloze",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "ket",
    maximumLevel: "pet",
    responseShape: "gap_fill_text",
    legacyCambaQuestionType: "gap_fill",
    description: "Fill each gap with one word (grammar/vocabulary focus).",
  },
  gapped_text: {
    key: "gapped_text",
    label: "Gapped text (cohesion)",
    skill: "reading",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "pet",
    maximumLevel: "pet",
    responseShape: "single_choice",
    description: "Choose sentences to fill gaps in a longer text (PET Reading Part 6).",
  },

  // ── Listening ──────────────────────────────────────────────────────────────
  audio_multiple_choice: {
    key: "audio_multiple_choice",
    label: "Listening multiple choice",
    skill: "listening",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "single_choice",
    legacyCambaQuestionType: "listening",
    description: "Listen to audio and select the correct answer or picture.",
  },
  audio_matching: {
    key: "audio_matching",
    label: "Listening matching",
    skill: "listening",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "matching_pairs",
    legacyCambaQuestionType: "matching",
    description: "Listen and match speakers to statements, places, or objects.",
  },
  audio_gap_fill: {
    key: "audio_gap_fill",
    label: "Listening gap fill",
    skill: "listening",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "gap_fill_text",
    legacyCambaQuestionType: "gap_fill",
    description: "Listen and complete notes, forms, or sentences.",
  },
  audio_true_false: {
    key: "audio_true_false",
    label: "Listening true / false",
    skill: "listening",
    aiRequired: false,
    autoScored: true,
    scoringMode: "auto",
    minimumLevel: "ket",
    maximumLevel: "pet",
    responseShape: "single_choice",
    description: "Listen and decide if statements are correct.",
  },

  // ── Writing (AI-evaluated) ─────────────────────────────────────────────────
  write_sentence: {
    key: "write_sentence",
    label: "Write a sentence",
    skill: "writing",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "starters",
    maximumLevel: "flyers",
    responseShape: "free_text",
    legacyCambaQuestionType: "writing",
    description: "Write one or more short sentences with picture support (YLE R&W).",
  },
  write_note: {
    key: "write_note",
    label: "Write a note / message",
    skill: "writing",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "movers",
    maximumLevel: "pet",
    responseShape: "free_text",
    legacyCambaQuestionType: "writing",
    description: "Write a short note or message (25–100 words depending on level).",
  },
  write_email: {
    key: "write_email",
    label: "Write an email",
    skill: "writing",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "ket",
    maximumLevel: "pet",
    responseShape: "free_text",
    legacyCambaQuestionType: "writing",
    description: "Write an email responding to a prompt (KET/PET Writing).",
  },
  write_story: {
    key: "write_story",
    label: "Write a story",
    skill: "writing",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "flyers",
    maximumLevel: "pet",
    responseShape: "free_text",
    legacyCambaQuestionType: "writing",
    description: "Write a story from picture prompts or a title.",
  },
  picture_description_writing: {
    key: "picture_description_writing",
    label: "Picture description (writing)",
    skill: "writing",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "starters",
    maximumLevel: "flyers",
    responseShape: "free_text",
    legacyCambaQuestionType: "writing",
    description: "Describe a picture in writing (YLE copy/complete/describe tasks).",
  },

  // ── Speaking (AI-evaluated) ────────────────────────────────────────────────
  short_answer: {
    key: "short_answer",
    label: "Short answer",
    skill: "speaking",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "audio_response",
    legacyCambaQuestionType: "speaking",
    description: "Answer examiner questions with brief spoken responses.",
  },
  picture_description_speaking: {
    key: "picture_description_speaking",
    label: "Picture description (speaking)",
    skill: "speaking",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "starters",
    maximumLevel: "pet",
    responseShape: "audio_response",
    legacyCambaQuestionType: "speaking",
    description: "Describe pictures or photo scenes (YLE/KET/PET speaking).",
  },
  story_telling: {
    key: "story_telling",
    label: "Story telling",
    skill: "speaking",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "movers",
    maximumLevel: "pet",
    responseShape: "audio_response",
    legacyCambaQuestionType: "speaking",
    description: "Tell a story from a picture sequence (YLE/Movers+).",
  },
  conversation: {
    key: "conversation",
    label: "Conversation / discussion",
    skill: "speaking",
    aiRequired: true,
    autoScored: false,
    scoringMode: "ai",
    minimumLevel: "ket",
    maximumLevel: "pet",
    responseShape: "audio_response",
    legacyCambaQuestionType: "speaking",
    description: "Extended discussion, collaborative task, or interview (KET/PET).",
  },
};

export function getCambridgeTask(key: CambridgeTaskTypeKey): CambridgeTaskDefinition {
  return CAMBRIDGE_TASK_TAXONOMY[key];
}

export function getTasksForSkill(skill: CambridgeSkill): CambridgeTaskDefinition[] {
  return Object.values(CAMBRIDGE_TASK_TAXONOMY).filter((t) => t.skill === skill);
}

export function getTasksForLevel(level: CambridgeExamLevel): CambridgeTaskDefinition[] {
  return Object.values(CAMBRIDGE_TASK_TAXONOMY).filter((t) => isTaskAvailableAtLevel(t, level));
}

export function getAutoScoredTasks(): CambridgeTaskDefinition[] {
  return Object.values(CAMBRIDGE_TASK_TAXONOMY).filter((t) => t.autoScored);
}

export function getAiEvaluatedTasks(): CambridgeTaskDefinition[] {
  return Object.values(CAMBRIDGE_TASK_TAXONOMY).filter((t) => t.aiRequired);
}
