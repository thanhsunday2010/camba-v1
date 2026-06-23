import type { ExerciseType } from "@/types/database";

/** YLE levels prioritized for M1 mock content architecture. */
export type YleLevelSlug = "starters" | "movers" | "flyers";

/** Cambridge YLE exam family identifier used in blueprint metadata. */
export type YleExamFamily = "cambridge-yle";

/**
 * Whether a part or question type can be represented in the current U6 mock runtime.
 * - supported: fully auto-scored in take flow today
 * - partial: some item shapes work; others need author adaptation
 * - blueprint_only: represented in blueprint for long-term YLE fidelity, not runtime yet
 */
export type YleMockRuntimeSupport = "supported" | "partial" | "blueprint_only";

/** High-level skill grouping for mock sections (distinct from lesson skill slugs). */
export type YleMockSkillCategory =
  | "listening"
  | "reading_writing"
  | "speaking"
  | "vocabulary"
  | "grammar";

/** Stable keys for blueprint question-type families (not identical to DB `question_type`). */
export type YleBlueprintQuestionTypeKey =
  | "mcq_single"
  | "mcq_image"
  | "mcq_listening"
  | "reading_comprehension"
  | "multi_select"
  | "matching"
  | "drag_drop"
  | "gap_fill"
  | "sentence_ordering"
  | "form_completion"
  | "writing_copy"
  | "writing_message"
  | "speaking_picture_story"
  | "speaking_interview";

export type YleMockDifficultyBand = "easy" | "medium" | "hard";

export interface YleMockLevelMetadata {
  slug: YleLevelSlug;
  displayTitle: string;
  examName: string;
  cefrBand: "pre-a1" | "a1" | "a2";
  examFamily: YleExamFamily;
  targetAgeBand: string;
  description: string;
  /** Curriculum map version this blueprint was aligned to. */
  curriculumMapVersion: string;
  /** Stable level ID from seed — for import tooling only, not runtime UI. */
  levelId: string;
  recommendedDurationMinutes: number;
  recommendedTotalQuestions: number;
  recommendedTotalScore: number;
}

export interface YleMockQuestionTypeBlueprint {
  key: YleBlueprintQuestionTypeKey;
  label: string;
  description: string;
  /** Primary DB `question_type` when runtime-supported. */
  cambaQuestionType: ExerciseType | null;
  runtimeSupport: YleMockRuntimeSupport;
  answerShape:
    | "single_choice"
    | "multi_choice"
    | "matching_pairs"
    | "gap_fill_text"
    | "sentence_order"
    | "free_text"
    | "audio_response"
    | "human_scored";
  requiredContentFields: string[];
  optionalContentFields: string[];
  mediaRequirements: {
    audio: boolean;
    image: boolean;
    passage: boolean;
  };
  scoringAssumption: string;
  reviewModeNotes: string;
  authoringNotes: string;
}

export interface YleMockPartBlueprint {
  partSlug: string;
  partTitle: string;
  skillCategory: YleMockSkillCategory;
  displayOrder: number;
  intendedQuestionCount: number;
  defaultPointsPerQuestion: number;
  /** Optional per-part time guidance for authors (minutes). */
  timeGuidanceMinutes: number | null;
  allowedQuestionTypeKeys: YleBlueprintQuestionTypeKey[];
  mediaExpectations: {
    audio: boolean;
    image: boolean;
    passage: boolean;
  };
  answerFormatNotes: string;
  authoringNotes: string;
  childFriendlyConstraints: string;
  runtimeSupport: YleMockRuntimeSupport;
  /** Maps to curriculum map `taskTypes` strings where applicable. */
  curriculumTaskTypeRefs: string[];
}

export interface YleMockSectionBlueprint {
  sectionSlug: string;
  sectionTitle: string;
  skillCategory: YleMockSkillCategory;
  displayOrder: number;
  timeGuidanceMinutes: number | null;
  parts: YleMockPartBlueprint[];
}

export interface YleMockDifficultyPolicy {
  /** Target mix across a full mock form (must sum to 1 when all bands present). */
  distribution: Partial<Record<YleMockDifficultyBand, number>>;
  notes: string;
  /** Authoring guardrails — e.g. avoid clustering hard items at start. */
  progressionRules: string[];
}

export interface YleMockCoverageRules {
  /** Lexical / topic buckets — aligned with curriculum map themes, not lesson units. */
  topicCoverage: {
    minDistinctTopics: number;
    maxSharePerTopic: number;
    recommendedTopics: string[];
    sourceRef: "curriculum-map.vocabularyScope.themes";
  };
  grammarCoverage: {
    minDistinctPatterns: number;
    recommendedPatterns: string[];
    sourceRef: "curriculum-map.grammarScope.structures";
  };
  skillCoverage: {
    subskills: string[];
    minSubskillsRepresented: number;
    sourceRef: "curriculum-map.readingSkills|listeningSkills";
  };
  repetitionGuardrails: {
    maxDuplicateStems: number;
    maxSameCorrectAnswerPattern: number;
    notes: string;
  };
}

export interface YleMockBlueprint {
  blueprintId: string;
  blueprintVersion: string;
  level: YleMockLevelMetadata;
  formKind: "practice" | "diagnostic" | "full-form";
  title: string;
  description: string;
  sections: YleMockSectionBlueprint[];
  difficultyPolicy: YleMockDifficultyPolicy;
  coverageRules: YleMockCoverageRules;
  /** Lesson blueprint assets that mock authoring may draw vocabulary/passages from. */
  lessonBlueprintRefs: {
    levelSlug: YleLevelSlug;
    blueprintPath: string;
    generatedContentPath: string;
    reuseNotes: string;
  }[];
}

export type YleMockValidationSeverity = "error" | "warning" | "info";

export interface YleMockValidationIssue {
  code: string;
  severity: YleMockValidationSeverity;
  path: string;
  message: string;
}

export interface YleMockValidationResult {
  valid: boolean;
  issues: YleMockValidationIssue[];
}
