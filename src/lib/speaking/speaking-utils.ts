import type { PublicQuestion } from "@/types/learning";
import type { UserAnswer } from "@/types/learning";
import { normalizeQuestionType } from "@/lib/learning/question-types";
import { getCambridgeTask } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type {
  SpeakingConstraints,
  SpeakingPrompt,
  SpeakingQuestionContent,
  SpeakingRuntimeTaskType,
  SpeakingUserAnswerPayload,
} from "@/lib/speaking/speaking-types";
import { SPEAKING_RUNTIME_TASK_TYPES } from "@/lib/speaking/speaking-types";

const TASK_ALIAS: Record<string, SpeakingRuntimeTaskType> = {
  speaking_picture_description: "speaking_picture_description",
  picture_description_speaking: "speaking_picture_description",
  speaking_personal_questions: "speaking_personal_questions",
  short_answer: "speaking_personal_questions",
  speaking_storytelling: "speaking_storytelling",
  story_telling: "speaking_storytelling",
  speaking_discussion: "speaking_discussion",
  conversation: "speaking_discussion",
};

export function normalizeSpeakingTaskType(raw: unknown): SpeakingRuntimeTaskType | null {
  if (typeof raw !== "string") return null;
  const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (TASK_ALIAS[slug]) return TASK_ALIAS[slug];
  if ((SPEAKING_RUNTIME_TASK_TYPES as string[]).includes(slug)) {
    return slug as SpeakingRuntimeTaskType;
  }
  return null;
}

export function isSpeakingQuestion(
  question: Pick<PublicQuestion, "question_type" | "content" | "question_text" | "media_url">
): boolean {
  if (normalizeQuestionType(question.question_type) !== "speaking") return false;
  return parseSpeakingQuestionContent(question).cambridgeTaskType != null;
}

function inferSpeakingTaskType(content: Record<string, unknown>): SpeakingRuntimeTaskType {
  const explicit =
    normalizeSpeakingTaskType(content.cambridgeTaskType) ??
    normalizeSpeakingTaskType(content.speakingTaskType);
  if (explicit) return explicit;

  const criteriaRef =
    typeof content.assessmentCriteriaRef === "string" ? content.assessmentCriteriaRef : "";
  const criteriaSlug = criteriaRef.toLowerCase();
  if (criteriaSlug.includes("picture")) return "speaking_picture_description";
  if (criteriaSlug.includes("story")) return "speaking_storytelling";
  if (criteriaSlug.includes("discussion") || criteriaSlug.includes("conversation")) {
    return "speaking_discussion";
  }

  return "speaking_personal_questions";
}

export function parseSpeakingQuestionContent(
  question: Pick<PublicQuestion, "question_text" | "content" | "media_url">
): SpeakingQuestionContent {
  const content = question.content ?? {};
  const taskType = inferSpeakingTaskType(content);

  const followUpQuestions = Array.isArray(content.followUpQuestions)
    ? content.followUpQuestions.filter((p): p is string => typeof p === "string")
    : Array.isArray(content.followUpPrompts)
      ? content.followUpPrompts.filter((p): p is string => typeof p === "string")
      : undefined;

  const prompt: SpeakingPrompt = {
    prompt:
      (typeof content.prompt === "string" && content.prompt) ||
      (typeof content.taskDescription === "string" && content.taskDescription) ||
      question.question_text,
    taskDescription:
      typeof content.taskDescription === "string" ? content.taskDescription : undefined,
    followUpQuestions,
  };

  const constraints: SpeakingConstraints = {
    maxDurationSeconds:
      typeof content.maxDurationSeconds === "number"
        ? content.maxDurationSeconds
        : typeof content.maxDuration === "number"
          ? content.maxDuration
          : 120,
    minDurationSeconds:
      typeof content.minDurationSeconds === "number" ? content.minDurationSeconds : undefined,
  };

  const imageUrl =
    (typeof content.imageUrl === "string" && content.imageUrl) ||
    question.media_url ||
    undefined;

  const pictureSequence = Array.isArray(content.pictureSequence)
    ? content.pictureSequence.filter((p): p is string => typeof p === "string")
    : undefined;

  return {
    cambridgeTaskType: taskType,
    prompt,
    constraints,
    stimulus: imageUrl || pictureSequence?.length
      ? {
          imageUrl,
          imageDescription:
            typeof content.imageDescription === "string" ? content.imageDescription : undefined,
          pictureSequence,
        }
      : undefined,
  };
}

export function getSpeakingTaskLabel(taskType: SpeakingRuntimeTaskType): string {
  const taxonomyKey =
    taskType === "speaking_picture_description"
      ? "picture_description_speaking"
      : taskType === "speaking_personal_questions"
        ? "short_answer"
        : taskType === "speaking_storytelling"
          ? "story_telling"
          : "conversation";
  try {
    return getCambridgeTask(taxonomyKey).label;
  } catch {
    return taskType;
  }
}

export function createSpeakingUserAnswer(input: {
  audioRef: string;
  mimeType: string;
  durationSeconds: number;
  taskType?: SpeakingRuntimeTaskType;
  transcript?: string;
}): SpeakingUserAnswerPayload {
  return {
    type: "speaking",
    audioRef: input.audioRef,
    mimeType: input.mimeType,
    durationSeconds: input.durationSeconds,
    submittedAt: new Date().toISOString(),
    taskType: input.taskType,
    transcript: input.transcript,
  };
}

export function userAnswerToSpeakingPayload(
  answer: UserAnswer | undefined
): SpeakingUserAnswerPayload | null {
  if (!answer || answer.type !== "speaking") return null;
  return {
    type: "speaking",
    audioRef: answer.audioRef,
    mimeType: answer.mimeType,
    durationSeconds: answer.durationSeconds,
    submittedAt: answer.submittedAt,
    taskType: answer.taskType as SpeakingRuntimeTaskType | undefined,
    transcript: answer.transcript,
    evaluation: answer.evaluation,
  };
}

export function isSpeakingAnswerComplete(answer: UserAnswer | undefined): boolean {
  const payload = userAnswerToSpeakingPayload(answer);
  if (!payload?.audioRef.trim()) return false;
  return payload.durationSeconds > 0;
}

export function serializeSpeakingAnswersForAttempt(
  answers: Record<string, UserAnswer>
): Record<string, UserAnswer> {
  const out: Record<string, UserAnswer> = {};
  for (const [questionId, answer] of Object.entries(answers)) {
    out[questionId] = answer.type === "speaking" ? answer : answer;
  }
  return out;
}

export function toSpeakingSubmission(
  questionId: string,
  answer: UserAnswer | undefined,
  taskType?: SpeakingRuntimeTaskType
): import("@/lib/speaking/speaking-types").SpeakingSubmission | null {
  const payload = userAnswerToSpeakingPayload(answer);
  if (!payload?.audioRef.trim()) return null;
  return {
    questionId,
    audioRef: payload.audioRef,
    mimeType: payload.mimeType,
    durationSeconds: payload.durationSeconds,
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
    taskType: payload.taskType ?? taskType,
    transcript: payload.transcript ?? payload.evaluation?.result?.transcript,
  };
}
