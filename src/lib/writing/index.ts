export type {
  WritingConstraints,
  WritingPrompt,
  WritingQuestionContent,
  WritingResponse,
  WritingRuntimeTaskType,
  WritingSubmission,
  WritingUserAnswerPayload,
  WritingWordRange,
} from "@/lib/writing/writing-types";
export { WRITING_RUNTIME_TASK_TYPES } from "@/lib/writing/writing-types";

export {
  buildWritingResponse,
  countAnsweredQuestions,
  countCharacters,
  countWords,
  createWritingUserAnswer,
  getWritingResponseText,
  getWritingTaskLabel,
  isQuestionAnswered,
  isWritingAnswerComplete,
  isWritingQuestion,
  normalizeWritingTaskType,
  parseWritingQuestionContent,
  serializeWritingAnswersForAttempt,
  toWritingSubmission,
  userAnswerToWritingPayload,
} from "@/lib/writing/writing-utils";

export {
  validateWritingAnswer,
  validateWritingQuestionContent,
  validateWritingTaskType,
} from "@/lib/writing/writing-validation";
export type { WritingValidationIssue } from "@/lib/writing/writing-validation";

export type {
  WritingAnalyticsSignals,
  WritingBand,
  WritingCorrection,
  WritingEvaluationEnvelope,
  WritingEvaluationResult,
  WritingEvaluationStatus,
  WritingFeedback,
  WritingQuestionEvaluationSummary,
} from "@/lib/writing/writing-evaluation-types";

export {
  attachEvaluationToWritingAnswer,
  buildWritingEvaluationRequest,
  collectWritingAnalyticsFromAttempt,
  computeHybridMetricsFromResults,
  createCompletedEvaluationEnvelope,
  createFailedEvaluationEnvelope,
  createPendingEvaluationEnvelope,
  evaluateWritingQuestion,
  evaluateWritingQuestionsForAttempt,
  extractWritingAnalyticsSignals,
  getWritingEvaluationFromAnswer,
  hasPendingOrFailedWritingEvaluations,
  hasWritingQuestions,
  mergeWritingIntoQuestionResults,
  mergeWritingSkillBreakdown,
  normalizeCambridgeExamLevel,
  toWritingFeedback,
  toWritingQuestionEvaluationSummary,
  writingPointsFromEvaluation,
} from "@/lib/writing/writing-evaluation";

export {
  flattenWritingWeaknesses,
  markWritingAnswersPending,
  mergeMockTestWritingScores,
  runWritingEvaluationPipeline,
} from "@/lib/writing/writing-evaluation-submit";

export { toWritingEvaluationAnalyticsRecords } from "@/lib/writing/writing-analytics";
