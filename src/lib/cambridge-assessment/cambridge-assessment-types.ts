/**
 * M2.0 — Canonical Cambridge assessment domain types.
 * Independent of legacy YLE mock manifest types and U6 runtime view models.
 */

/** Cambridge exam levels supported by CAMBA assessment architecture. */
export type CambridgeExamLevel = "starters" | "movers" | "flyers" | "ket" | "pet";

/** Four-skill Cambridge exam model (YLE combines reading+writing in one paper). */
export type CambridgeSkill = "reading" | "writing" | "listening" | "speaking";

/** Product modes for assessment delivery. */
export type CambridgeAssessmentType = "practice" | "mock" | "placement";

/** CEFR bands aligned to Cambridge levels. */
export type CambridgeCefrBand = "pre-a1" | "a1" | "a2" | "b1";

/** How a task response is scored in CAMBA. */
export type CambridgeScoringMode =
  | "auto" /** Deterministic (MCQ, matching, gap-fill) */
  | "ai" /** Gemini rubric evaluation (writing/speaking) */
  | "human" /** Examiner-led; future human-in-the-loop */
  | "hybrid"; /** Auto pre-check + AI refinement */

/** Score reporting model per level family. */
export type CambridgeScoreReportingModel =
  | "yle_shields" /** 5 shields per skill (Starters–Flyers) */
  | "cambridge_scale"; /** 100–170 scale (KET/PET) */

export type CambridgeLevelMetadata = {
  slug: CambridgeExamLevel;
  displayName: string;
  examName: string;
  cefr: CambridgeCefrBand;
  targetAge: string;
  scoreReporting: CambridgeScoreReportingModel;
  scaleRange?: { min: number; max: number; pass: number };
  shieldAssessment: boolean;
};

export type CambridgeAssessmentSession = {
  id: string;
  level: CambridgeExamLevel;
  assessmentType: CambridgeAssessmentType;
  blueprintId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  status: "not_started" | "in_progress" | "awaiting_ai" | "completed" | "abandoned";
};

export type CambridgeAssessmentPartRef = {
  partSlug: string;
  skill: CambridgeSkill;
  partNumber: number;
  title: string;
};

export type CambridgeExamBlueprintRef = {
  blueprintId: string;
  blueprintVersion: string;
  level: CambridgeExamLevel;
  assessmentTypes: CambridgeAssessmentType[];
  title: string;
  description: string;
};
