/**
 * M2.0 — Cambridge assessment architecture public API.
 */

export type {
  CambridgeAssessmentPartRef,
  CambridgeAssessmentSession,
  CambridgeAssessmentType,
  CambridgeCefrBand,
  CambridgeExamBlueprintRef,
  CambridgeExamLevel,
  CambridgeLevelMetadata,
  CambridgeScoreReportingModel,
  CambridgeScoringMode,
  CambridgeSkill,
} from "@/lib/cambridge-assessment/cambridge-assessment-types";

export {
  CAMBRIDGE_TASK_TAXONOMY,
  getAiEvaluatedTasks,
  getAutoScoredTasks,
  getCambridgeTask,
  getTasksForLevel,
  getTasksForSkill,
  isTaskAvailableAtLevel,
} from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
export type {
  CambridgeTaskDefinition,
  CambridgeTaskTypeKey,
} from "@/lib/cambridge-assessment/cambridge-task-taxonomy";

export {
  CAMBRIDGE_EXAM_BLUEPRINT_REGISTRY,
  FLYERS_EXAM_BLUEPRINT,
  getBlueprintPartsForSkill,
  getCambridgeExamBlueprint,
  KET_EXAM_BLUEPRINT,
  MOVERS_EXAM_BLUEPRINT,
  PET_EXAM_BLUEPRINT,
  STARTERS_EXAM_BLUEPRINT,
} from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
export type {
  CambridgeExamBlueprint,
  CambridgeExamPaperBlueprint,
  CambridgeExamPartBlueprint,
} from "@/lib/cambridge-assessment/cambridge-exam-blueprints";

export type {
  CambridgeWritingAiEvaluator,
  LegacyWritingFeedbackBridge,
  WritingAiEvaluationRequest,
  WritingAiEvaluationResult,
  WritingBandScore,
  WritingDimensionScore,
  WritingEvaluationDimension,
} from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";
export {
  WRITING_DIMENSION_LABELS,
  WRITING_DIMENSION_ORDER,
} from "@/lib/cambridge-assessment/cambridge-writing-ai-contracts";

export type {
  CambridgeSpeakingAiEvaluator,
  SpeakingAiEvaluationRequest,
  SpeakingAiEvaluationResult,
  SpeakingAudioInput,
  SpeakingBandScore,
  SpeakingDimensionScore,
  SpeakingEvaluationDimension,
  SpeakingLanguageAnalysis,
  SpeakingPipelineStage,
  SpeakingTranscriptionResult,
} from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";
export {
  SPEAKING_DIMENSION_LABELS,
  SPEAKING_DIMENSION_ORDER,
  SPEAKING_PIPELINE_STAGES,
} from "@/lib/cambridge-assessment/cambridge-speaking-ai-contracts";

export type {
  CambridgeItemBankFile,
  CambridgeItemBankItem,
  CambridgeItemBankLayout,
  CambridgeItemBankQuery,
  CambridgeItemBankRegistry,
  CambridgeItemKind,
  CambridgeItemMetadata,
  CambridgeItemReference,
  CambridgeReceptiveBankItem,
  CambridgeSpeakingBankItem,
  CambridgeWritingBankItem,
} from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";

export {
  assembleAllVersions,
  assembleCambridgeExam,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembler";
export type {
  CambridgeAssemblyPartSelection,
  CambridgeCoverageRequirements,
  CambridgeDifficultyPolicy,
  CambridgeExamAssemblyFailure,
  CambridgeExamAssemblyInput,
  CambridgeExamAssemblyResult,
  CambridgeExamAssemblySuccess,
  CambridgeExamVersion,
  CambridgeItemDifficulty,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
export { CAMBRIDGE_EXAM_VERSIONS } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
export {
  CambridgeAssemblyError,
  isCambridgeAssemblyError,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-errors";
export type { CambridgeAssemblyErrorCode } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-errors";
export type {
  CambridgeExamManifest,
  CambridgeExamManifestMetadata,
  CambridgeExamManifestPaper,
  CambridgeExamManifestPart,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-manifest-types";
export {
  buildExamManifest,
  hydrateManifestForRuntime,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-manifest-hydrator";
export {
  buildAssemblyReport,
  formatAssemblyReportText,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-report";
export type { CambridgeExamAssemblyReport } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-report";
export {
  validateAssemblyResult,
  validateCambridgeExamManifest,
  validateRuntimeManifestCompatibility,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
export type {
  AssemblyValidationIssue,
  AssemblyValidationResult,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-validation";
export {
  getCoverageRequirementsForLevel,
  getDifficultyPolicyForLevel,
  validateDifficultyDistribution,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
export {
  filterValidItemsForPart,
  selectItemsForPart,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-item-selector";
export {
  validateAssemblyCoverage,
  summarizeCoverageAchieved,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-coverage-engine";
export { loadAssemblyBank } from "@/lib/cambridge-assessment/exam-assembly/fixtures/assembly-bank-loader";
export { buildReferenceBankForLevel } from "@/lib/cambridge-assessment/exam-assembly/fixtures/assembly-reference-bank";

export type {
  GoldMockAuthorship,
  GoldMockCoverageTarget,
  GoldMockManifest,
  GoldMockPaper,
  GoldMockPart,
  GoldMockQuestionBlock,
  GoldMockSpecification,
  GoldMockTier,
  GoldMockValidationRules,
} from "@/lib/cambridge-assessment/gold-mock-format";
export {
  DEFAULT_GOLD_MOCK_VALIDATION_RULES,
  GOLD_MOCK_QA_CHECKLIST_VERSION,
  isGoldMockManifest,
} from "@/lib/cambridge-assessment/gold-mock-format";
export {
  GOLD_MOCK_LEVELS,
  GOLD_MOCK_SPECIFICATIONS,
  getGoldMockSpecification,
} from "@/lib/cambridge-assessment/gold-mock-specifications";
export {
  formatGoldMockValidationReport,
  validateGoldMock,
} from "@/lib/cambridge-assessment/gold-mock-validation";
export type {
  GoldMockValidationIssue,
  GoldMockValidationReport,
} from "@/lib/cambridge-assessment/gold-mock-validation";
export {
  ALL_GOLD_MOCKS,
  getGoldMock,
  GOLD_MOCK_REGISTRY,
} from "@/lib/cambridge-assessment/gold-mocks";
export { composeGoldMockManifest } from "@/lib/cambridge-assessment/gold-mocks/gold-mock-compose";

export type {
  GoldMockComparisonEntry,
  GoldMockComparisonReport,
  MockCertificationInput,
  MockCertificationIssue,
  MockCertificationLevel,
  MockCertificationMetrics,
  MockCertificationRecord,
  MockCertificationResult,
  MockCertificationSource,
  MockCertificationSummary,
} from "@/lib/cambridge-assessment/certification";
export {
  assignCertificationLevel,
  buildCertificationSummary,
  buildGoldMockComparisonReport,
  certifyAllGoldMocks,
  certifyGoldMock,
  certifyMockExam,
  detectMockDuplicates,
  formatCertificationReport,
  formatGoldMockComparisonReport,
  isStudentFacing,
  listCertifications,
  registerCertification,
  runBatchCertification,
} from "@/lib/cambridge-assessment/certification";
