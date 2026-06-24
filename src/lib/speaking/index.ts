export type {
  SpeakingConstraints,
  SpeakingPrompt,
  SpeakingQuestionContent,
  SpeakingRuntimeTaskType,
  SpeakingSubmission,
  SpeakingUserAnswerPayload,
} from "@/lib/speaking/speaking-types";
export { SPEAKING_RUNTIME_TASK_TYPES } from "@/lib/speaking/speaking-types";

export {
  createSpeakingUserAnswer,
  getSpeakingTaskLabel,
  isSpeakingAnswerComplete,
  isSpeakingQuestion,
  normalizeSpeakingTaskType,
  parseSpeakingQuestionContent,
  serializeSpeakingAnswersForAttempt,
  toSpeakingSubmission,
  userAnswerToSpeakingPayload,
} from "@/lib/speaking/speaking-utils";

export type {
  SpeakingAnalyticsSignals,
  SpeakingBand,
  SpeakingEvaluationEnvelope,
  SpeakingEvaluationResult,
  SpeakingEvaluationStatus,
  SpeakingFeedback,
  SpeakingQuestionEvaluationSummary,
  SpeakingTranscript,
} from "@/lib/speaking/speaking-evaluation-types";

export {
  attachSpeakingEvaluationToAnswer,
  buildSpeakingEvaluationRequest,
  collectSpeakingAnalyticsFromAttempt,
  createCompletedSpeakingEvaluationEnvelope,
  createFailedSpeakingEvaluationEnvelope,
  createPendingSpeakingEvaluationEnvelope,
  evaluateSpeakingQuestion,
  evaluateSpeakingQuestionsForAttempt,
  extractSpeakingAnalyticsSignals,
  getSpeakingEvaluationFromAnswer,
  hasSpeakingQuestions,
  mergeSpeakingIntoQuestionResults,
  mergeSpeakingSkillBreakdown,
  speakingPointsFromEvaluation,
  toSpeakingFeedback,
  toSpeakingQuestionEvaluationSummary,
} from "@/lib/speaking/speaking-evaluation";

export {
  flattenSpeakingWeaknesses,
  markSpeakingAnswersPending,
  mergeMockTestSpeakingScores,
  runSpeakingEvaluationPipeline,
} from "@/lib/speaking/speaking-evaluation-submit";

export { toSpeakingEvaluationAnalyticsRecords } from "@/lib/speaking/speaking-analytics";

export {
  isSupportedSpeakingMimeType,
  validateSpeakingAudioInput,
  SPEAKING_MAX_DURATION_SECONDS,
  SPEAKING_MAX_FILE_BYTES,
} from "@/lib/speaking/speaking-submission";
