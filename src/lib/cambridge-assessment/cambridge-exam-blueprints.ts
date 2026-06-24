/**
 * M2.0 — Cambridge-aligned exam blueprint matrix (Starters → PET).
 * Structure only — no questions, no manifests, no content generation.
 */

import type {
  CambridgeAssessmentType,
  CambridgeExamLevel,
  CambridgeScoreReportingModel,
  CambridgeSkill,
} from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { CambridgeTaskTypeKey } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

export type CambridgeExamPartBlueprint = {
  partSlug: string;
  partNumber: number;
  title: string;
  skill: CambridgeSkill;
  questionCount: number;
  pointsPerItem: number;
  timeMinutes: number;
  allowedTaskTypes: CambridgeTaskTypeKey[];
  scoringMode: "auto" | "ai" | "mixed";
  /** Whether this part requires AI evaluation in CAMBA. */
  aiEvaluated: boolean;
  notes?: string;
};

export type CambridgeExamPaperBlueprint = {
  paperSlug: string;
  title: string;
  /** YLE: reading_writing is one combined paper. KET/PET: separate papers. */
  skills: CambridgeSkill[];
  totalMinutes: number;
  weightPercent: number;
  parts: CambridgeExamPartBlueprint[];
};

export type CambridgeExamBlueprint = {
  blueprintId: string;
  blueprintVersion: string;
  level: CambridgeExamLevel;
  examName: string;
  assessmentTypes: CambridgeAssessmentType[];
  scoreReporting: CambridgeScoreReportingModel;
  totalDurationMinutes: number;
  papers: CambridgeExamPaperBlueprint[];
  /** Summary counts for planning — not generated content. */
  totals: {
    autoScoredItems: number;
    aiEvaluatedItems: number;
    maxScore: number;
  };
};

// ── Starters (Pre A1) ────────────────────────────────────────────────────────

export const STARTERS_EXAM_BLUEPRINT: CambridgeExamBlueprint = {
  blueprintId: "cambridge-starters-v1",
  blueprintVersion: "1.0.0",
  level: "starters",
  examName: "Pre A1 Starters",
  assessmentTypes: ["practice", "mock", "placement"],
  scoreReporting: "yle_shields",
  totalDurationMinutes: 45,
  papers: [
    {
      paperSlug: "listening",
      title: "Listening",
      skills: ["listening"],
      totalMinutes: 15,
      weightPercent: 25,
      parts: [
        {
          partSlug: "listening-part-1",
          partNumber: 1,
          title: "Link names to pictures",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 4,
          allowedTaskTypes: ["audio_matching"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-2",
          partNumber: 2,
          title: "Write words or numbers",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 4,
          allowedTaskTypes: ["audio_gap_fill"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-3",
          partNumber: 3,
          title: "Tick the correct picture",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 4,
          allowedTaskTypes: ["audio_multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-4",
          partNumber: 4,
          title: "Colour and draw",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 3,
          allowedTaskTypes: ["audio_multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
          notes: "Exam uses colouring; CAMBA may proxy with picture MCQ until drawing UI exists.",
        },
      ],
    },
    {
      paperSlug: "reading-writing",
      title: "Reading & Writing",
      skills: ["reading", "writing"],
      totalMinutes: 20,
      weightPercent: 50,
      parts: [
        {
          partSlug: "rw-part-1",
          partNumber: 1,
          title: "Match words to pictures",
          skill: "reading",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 4,
          allowedTaskTypes: ["matching"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-2",
          partNumber: 2,
          title: "Read sentences and choose pictures",
          skill: "reading",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 4,
          allowedTaskTypes: ["multiple_choice", "reading_comprehension"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-3",
          partNumber: 3,
          title: "Read and choose answers",
          skill: "reading",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 4,
          allowedTaskTypes: ["reading_comprehension", "multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-4",
          partNumber: 4,
          title: "Copy and complete writing",
          skill: "writing",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["write_sentence", "picture_description_writing"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
      ],
    },
    {
      paperSlug: "speaking",
      title: "Speaking",
      skills: ["speaking"],
      totalMinutes: 10,
      weightPercent: 25,
      parts: [
        {
          partSlug: "speaking-part-1",
          partNumber: 1,
          title: "Find differences",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 5,
          timeMinutes: 3,
          allowedTaskTypes: ["picture_description_speaking"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "speaking-part-2",
          partNumber: 2,
          title: "Personal questions",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 5,
          timeMinutes: 4,
          allowedTaskTypes: ["short_answer"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "speaking-part-3",
          partNumber: 3,
          title: "Picture story",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 5,
          timeMinutes: 3,
          allowedTaskTypes: ["story_telling"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
      ],
    },
  ],
  totals: { autoScoredItems: 25, aiEvaluatedItems: 8, maxScore: 45 },
};

// ── Movers (A1) ──────────────────────────────────────────────────────────────

export const MOVERS_EXAM_BLUEPRINT: CambridgeExamBlueprint = {
  blueprintId: "cambridge-movers-v1",
  blueprintVersion: "1.0.0",
  level: "movers",
  examName: "A1 Movers",
  assessmentTypes: ["practice", "mock", "placement"],
  scoreReporting: "yle_shields",
  totalDurationMinutes: 55,
  papers: STARTERS_EXAM_BLUEPRINT.papers.map((paper) => ({
    ...paper,
    parts: paper.parts.map((part) => ({
      ...part,
      questionCount: part.skill === "speaking" ? part.questionCount : 6,
      allowedTaskTypes:
        part.skill === "writing"
          ? (["write_sentence", "write_note", "picture_description_writing"] as CambridgeTaskTypeKey[])
          : part.allowedTaskTypes,
    })),
  })),
  totals: { autoScoredItems: 30, aiEvaluatedItems: 9, maxScore: 54 },
};

// ── Flyers (A2) ──────────────────────────────────────────────────────────────

export const FLYERS_EXAM_BLUEPRINT: CambridgeExamBlueprint = {
  blueprintId: "cambridge-flyers-v1",
  blueprintVersion: "1.0.0",
  level: "flyers",
  examName: "A2 Flyers",
  assessmentTypes: ["practice", "mock", "placement"],
  scoreReporting: "yle_shields",
  totalDurationMinutes: 65,
  papers: STARTERS_EXAM_BLUEPRINT.papers.map((paper) => ({
    ...paper,
    parts: paper.parts.map((part) => ({
      ...part,
      questionCount: part.skill === "speaking" ? part.questionCount : 7,
      allowedTaskTypes:
        part.skill === "writing"
          ? (["write_note", "write_story", "picture_description_writing"] as CambridgeTaskTypeKey[])
          : [...part.allowedTaskTypes, ...(part.skill === "reading" ? (["true_false"] as CambridgeTaskTypeKey[]) : [])],
    })),
  })),
  totals: { autoScoredItems: 35, aiEvaluatedItems: 10, maxScore: 63 },
};

// ── KET (A2 Key) ───────────────────────────────────────────────────────────

export const KET_EXAM_BLUEPRINT: CambridgeExamBlueprint = {
  blueprintId: "cambridge-ket-v1",
  blueprintVersion: "1.0.0",
  level: "ket",
  examName: "A2 Key for Schools",
  assessmentTypes: ["practice", "mock", "placement"],
  scoreReporting: "cambridge_scale",
  totalDurationMinutes: 110,
  papers: [
    {
      paperSlug: "reading-writing",
      title: "Reading & Writing",
      skills: ["reading", "writing"],
      totalMinutes: 60,
      weightPercent: 50,
      parts: [
        {
          partSlug: "rw-part-1",
          partNumber: 1,
          title: "Multiple choice (signs and messages)",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-2",
          partNumber: 2,
          title: "Multiple matching",
          skill: "reading",
          questionCount: 7,
          pointsPerItem: 1,
          timeMinutes: 10,
          allowedTaskTypes: ["matching"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-3",
          partNumber: 3,
          title: "Multiple choice (long text)",
          skill: "reading",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 10,
          allowedTaskTypes: ["reading_comprehension", "multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-4",
          partNumber: 4,
          title: "Multiple choice cloze",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-5",
          partNumber: 5,
          title: "Open cloze",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["open_cloze"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "rw-part-6",
          partNumber: 6,
          title: "Writing — message",
          skill: "writing",
          questionCount: 1,
          pointsPerItem: 15,
          timeMinutes: 8,
          allowedTaskTypes: ["write_note", "write_email"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "rw-part-7",
          partNumber: 7,
          title: "Writing — picture story",
          skill: "writing",
          questionCount: 1,
          pointsPerItem: 15,
          timeMinutes: 8,
          allowedTaskTypes: ["write_story"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
      ],
    },
    {
      paperSlug: "listening",
      title: "Listening",
      skills: ["listening"],
      totalMinutes: 30,
      weightPercent: 25,
      parts: [
        {
          partSlug: "listening-part-1",
          partNumber: 1,
          title: "Multiple choice (pictures)",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 6,
          allowedTaskTypes: ["audio_multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-2",
          partNumber: 2,
          title: "Multiple choice (questions)",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 6,
          allowedTaskTypes: ["audio_multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-3",
          partNumber: 3,
          title: "Gap fill",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 6,
          allowedTaskTypes: ["audio_gap_fill"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-4",
          partNumber: 4,
          title: "Multiple choice (monologue)",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 6,
          allowedTaskTypes: ["audio_multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "listening-part-5",
          partNumber: 5,
          title: "Multiple matching",
          skill: "listening",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 6,
          allowedTaskTypes: ["audio_matching"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
      ],
    },
    {
      paperSlug: "speaking",
      title: "Speaking",
      skills: ["speaking"],
      totalMinutes: 12,
      weightPercent: 25,
      parts: [
        {
          partSlug: "speaking-part-1",
          partNumber: 1,
          title: "Interview",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 20,
          timeMinutes: 4,
          allowedTaskTypes: ["short_answer", "conversation"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "speaking-part-2",
          partNumber: 2,
          title: "Collaborative task",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 20,
          timeMinutes: 4,
          allowedTaskTypes: ["conversation", "picture_description_speaking"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
      ],
    },
  ],
  totals: { autoScoredItems: 45, aiEvaluatedItems: 4, maxScore: 70 },
};

// ── PET (B1 Preliminary) ───────────────────────────────────────────────────

export const PET_EXAM_BLUEPRINT: CambridgeExamBlueprint = {
  blueprintId: "cambridge-pet-v1",
  blueprintVersion: "1.0.0",
  level: "pet",
  examName: "B1 Preliminary for Schools",
  assessmentTypes: ["practice", "mock", "placement"],
  scoreReporting: "cambridge_scale",
  totalDurationMinutes: 130,
  papers: [
    {
      paperSlug: "reading",
      title: "Reading",
      skills: ["reading"],
      totalMinutes: 45,
      weightPercent: 25,
      parts: [
        {
          partSlug: "reading-part-1",
          partNumber: 1,
          title: "Multiple choice (signs)",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 6,
          allowedTaskTypes: ["multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "reading-part-2",
          partNumber: 2,
          title: "Multiple matching",
          skill: "reading",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["matching"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "reading-part-3",
          partNumber: 3,
          title: "Multiple choice (long text)",
          skill: "reading",
          questionCount: 5,
          pointsPerItem: 1,
          timeMinutes: 10,
          allowedTaskTypes: ["reading_comprehension"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "reading-part-4",
          partNumber: 4,
          title: "Multiple choice cloze",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["multiple_choice"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "reading-part-5",
          partNumber: 5,
          title: "Open cloze",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["open_cloze"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
        {
          partSlug: "reading-part-6",
          partNumber: 6,
          title: "Gapped text",
          skill: "reading",
          questionCount: 6,
          pointsPerItem: 1,
          timeMinutes: 8,
          allowedTaskTypes: ["gapped_text"],
          scoringMode: "auto",
          aiEvaluated: false,
        },
      ],
    },
    {
      paperSlug: "writing",
      title: "Writing",
      skills: ["writing"],
      totalMinutes: 45,
      weightPercent: 25,
      parts: [
        {
          partSlug: "writing-part-1",
          partNumber: 1,
          title: "Write an email",
          skill: "writing",
          questionCount: 1,
          pointsPerItem: 20,
          timeMinutes: 20,
          allowedTaskTypes: ["write_email"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "writing-part-2",
          partNumber: 2,
          title: "Write an article or story",
          skill: "writing",
          questionCount: 1,
          pointsPerItem: 20,
          timeMinutes: 25,
          allowedTaskTypes: ["write_story"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
      ],
    },
    {
      paperSlug: "listening",
      title: "Listening",
      skills: ["listening"],
      totalMinutes: 30,
      weightPercent: 25,
      parts: KET_EXAM_BLUEPRINT.papers.find((p) => p.paperSlug === "listening")!.parts,
    },
    {
      paperSlug: "speaking",
      title: "Speaking",
      skills: ["speaking"],
      totalMinutes: 14,
      weightPercent: 25,
      parts: [
        {
          partSlug: "speaking-part-1",
          partNumber: 1,
          title: "Interview",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 25,
          timeMinutes: 4,
          allowedTaskTypes: ["short_answer", "conversation"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "speaking-part-2",
          partNumber: 2,
          title: "Extended turn (photo description)",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 25,
          timeMinutes: 5,
          allowedTaskTypes: ["picture_description_speaking"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
        {
          partSlug: "speaking-part-3",
          partNumber: 3,
          title: "Collaborative task",
          skill: "speaking",
          questionCount: 1,
          pointsPerItem: 25,
          timeMinutes: 5,
          allowedTaskTypes: ["conversation"],
          scoringMode: "ai",
          aiEvaluated: true,
        },
      ],
    },
  ],
  totals: { autoScoredItems: 40, aiEvaluatedItems: 6, maxScore: 82 },
};

export const CAMBRIDGE_EXAM_BLUEPRINT_REGISTRY: Record<CambridgeExamLevel, CambridgeExamBlueprint> = {
  starters: STARTERS_EXAM_BLUEPRINT,
  movers: MOVERS_EXAM_BLUEPRINT,
  flyers: FLYERS_EXAM_BLUEPRINT,
  ket: KET_EXAM_BLUEPRINT,
  pet: PET_EXAM_BLUEPRINT,
};

export function getCambridgeExamBlueprint(level: CambridgeExamLevel): CambridgeExamBlueprint {
  return CAMBRIDGE_EXAM_BLUEPRINT_REGISTRY[level];
}

export function getBlueprintPartsForSkill(
  blueprint: CambridgeExamBlueprint,
  skill: CambridgeSkill
): CambridgeExamPartBlueprint[] {
  return blueprint.papers.flatMap((p) => p.parts.filter((part) => part.skill === skill));
}
