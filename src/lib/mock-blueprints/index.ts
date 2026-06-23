/**
 * M1.1 — YLE mock blueprint public API.
 * Content architecture only — no UI or runtime mock-test flow changes.
 */
export type {
  YleLevelSlug,
  YleMockBlueprint,
  YleMockPartBlueprint,
  YleMockSectionBlueprint,
  YleMockQuestionTypeBlueprint,
  YleMockCoverageRules,
  YleMockDifficultyPolicy,
  YleMockLevelMetadata,
  YleMockValidationIssue,
  YleMockValidationResult,
  YleBlueprintQuestionTypeKey,
  YleMockRuntimeSupport,
  YleMockSkillCategory,
} from "@/lib/mock-blueprints/yle-mock-blueprint-types";

export type {
  YleMockManifest,
  YleMockManifestMetadata,
  YleMockQuestionManifestBlock,
  YleMockSectionManifest,
  YleMockPartContextManifest,
  YleMockMediaManifestEntry,
  YleMockCoverageAchievedSummary,
} from "@/lib/mock-blueprints/yle-mock-manifest-types";

export {
  YLE_MOCK_BLUEPRINT_REGISTRY,
  STARTERS_PRACTICE_MOCK_BLUEPRINT,
  MOVERS_PRACTICE_MOCK_BLUEPRINT,
  FLYERS_PRACTICE_MOCK_BLUEPRINT,
  ALL_YLE_MOCK_BLUEPRINTS,
} from "@/lib/mock-blueprints/yle-mock-blueprints";

export {
  YLE_MOCK_QUESTION_TYPE_REGISTRY,
  getQuestionTypeBlueprint,
  getRuntimeSupportedQuestionTypes,
  resolveCambaQuestionType,
} from "@/lib/mock-blueprints/yle-question-type-registry";

export {
  YLE_CURRICULUM_MAP_VERSION,
  YLE_LEVEL_IDS,
  YLE_LEVEL_METADATA,
  YLE_TOPIC_ANCHORS,
  YLE_LESSON_BLUEPRINT_REFS,
  buildDefaultCoverageRules,
  buildDefaultDifficultyPolicy,
} from "@/lib/mock-blueprints/yle-coverage";

export {
  getYleMockBlueprint,
  listYleMockBlueprints,
  listYleLevelSlugs,
  getYleLevelMetadata,
  getBlueprintPartBySlug,
  getBlueprintAutoScoredQuestionCapacity,
  getBlueprintSummary,
  validateYleMockBlueprint,
  validateAllYleMockBlueprints,
} from "@/lib/mock-blueprints/yle-mock-blueprint-utils";

export {
  validateYleMockManifest,
  validateYleMockManifestForSeeding,
  countAutoScoredBlueprintQuestions,
  isQuestionTypeAllowedInPart,
} from "@/lib/mock-blueprints/yle-mock-validation";

export { STARTERS_PRACTICE_MOCK_MANIFEST_EXAMPLE } from "@/lib/mock-blueprints/fixtures/starters-practice-mock-manifest.example";
