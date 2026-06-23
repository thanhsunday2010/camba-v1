import type { ExerciseType } from "@/types/database";
import type {
  YleBlueprintQuestionTypeKey,
  YleLevelSlug,
  YleMockDifficultyBand,
  YleMockValidationIssue,
} from "@/lib/mock-blueprints/yle-mock-blueprint-types";

/**
 * M1.2+ import contract — describes one full mock test before DB persistence.
 * Maps toward: mock_tests → mock_test_sections → mock_test_questions → questions.
 */
export interface YleMockManifestMetadata {
  manifestId: string;
  manifestVersion: string;
  blueprintId: string;
  blueprintVersion: string;
  levelSlug: YleLevelSlug;
  title: string;
  description: string | null;
  formKind: "practice" | "diagnostic" | "full-form";
  /** Target DB level_id — from YLE_LEVEL_IDS. */
  levelId: string;
  timeLimitMinutes: number;
  totalScore: number;
  status: "draft" | "review" | "published";
  authoringNotes?: string;
  stableSlug?: string;
  seedIds?: YleMockManifestSeedIds;
}

export interface YleMockMediaManifestEntry {
  mediaId: string;
  type: "audio" | "image";
  /** Public path e.g. public/audio/listening/starters/... */
  publicPath: string;
  linkedPartSlug?: string;
  linkedQuestionIds?: string[];
}

export interface YleMockQuestionManifestBlock {
  /** Stable authoring ID — importer maps to questions.id via content-ids pattern in M1.2. */
  questionRef: string;
  partSlug: string;
  sectionSlug: string;
  sortOrder: number;
  points: number;
  blueprintQuestionType: YleBlueprintQuestionTypeKey;
  /** Resolved CAMBA question_type for import — must match blueprint registry. */
  cambaQuestionType: ExerciseType;
  difficulty: YleMockDifficultyBand;
  topicTag: string | null;
  skillTag: string | null;
  questionText: string;
  explanation?: string | null;
  /** Gap-fill / ordering / listening content fields */
  content?: Record<string, unknown>;
  choices?: Array<{
    text: string;
    isCorrect: boolean;
    sortOrder?: number;
    mediaUrl?: string | null;
  }>;
  pairs?: Array<{
    leftText: string;
    rightText: string;
    sortOrder?: number;
  }>;
  /** @deprecated use content + choices/pairs — kept for fixture compatibility */
  payload?: Record<string, unknown>;
  mediaRefs?: string[];
}

export interface YleMockPartContextManifest {
  partSlug: string;
  sectionSlug: string;
  partNumber?: number;
  title?: string;
  instructions?: string;
  contextType?: "listening" | "reading" | "dialogue" | "general";
  /** When set, context applies only to listed questions; otherwise all in partSlug. */
  questionRefs?: string[];
  groupKey?: string;
  audio?: {
    src: string;
    transcript?: string;
    caption?: string;
  };
  passage?: {
    title?: string;
    text: string;
  };
  note?: string;
}

export interface YleMockManifestSeedIds {
  mockTestId: string;
  containerUnitId: string;
  containerLessonId: string;
  containerExerciseId: string;
  sectionIds: Record<string, string>;
  questionIds: Record<string, string>;
}

export interface YleMockSectionManifest {
  sectionSlug: string;
  title: string;
  sortOrder: number;
  skillSlug: string | null;
  timeLimitMinutes: number | null;
  partSlugs: string[];
  questionRefs: string[];
}

export interface YleMockCoverageAchievedSummary {
  distinctTopics: string[];
  distinctGrammarPatterns: string[];
  subskillsRepresented: string[];
  difficultyCounts: Partial<Record<YleMockDifficultyBand, number>>;
  notes?: string;
}

export interface YleMockManifest {
  metadata: YleMockManifestMetadata;
  sections: YleMockSectionManifest[];
  /** Part-level shared context for listening audio / reading passages (M1.2b+). */
  parts?: YleMockPartContextManifest[];
  questions: YleMockQuestionManifestBlock[];
  media?: YleMockMediaManifestEntry[];
  coverageAchieved?: YleMockCoverageAchievedSummary;
  /** Populated by validateYleMockManifest — not authored by hand. */
  validation?: {
    valid: boolean;
    issues: YleMockValidationIssue[];
  };
}

/** Minimal example fixture shape — see fixtures/ for concrete data. */
export type YleMockManifestFixture = YleMockManifest & {
  _fixtureNote: string;
};
