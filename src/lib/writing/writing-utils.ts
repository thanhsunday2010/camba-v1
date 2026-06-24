import type { PublicQuestion } from "@/types/learning";
import type { UserAnswer } from "@/types/learning";
import { normalizeQuestionType } from "@/lib/learning/question-types";
import { isSpeakingQuestion, isSpeakingAnswerComplete } from "@/lib/speaking/speaking-utils";
import { getCambridgeTask } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import type {
  WritingConstraints,
  WritingPrompt,
  WritingQuestionContent,
  WritingResponse,
  WritingRuntimeTaskType,
  WritingSubmission,
  WritingUserAnswerPayload,
} from "@/lib/writing/writing-types";
import { WRITING_RUNTIME_TASK_TYPES } from "@/lib/writing/writing-types";

const TASK_ALIAS: Record<string, WritingRuntimeTaskType> = {
  picture_description: "picture_description",
  picture_description_writing: "picture_description",
};

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export function countCharacters(text: string): number {
  return text.length;
}

export function normalizeWritingTaskType(raw: unknown): WritingRuntimeTaskType | null {
  if (typeof raw !== "string") return null;
  const slug = raw.trim().toLowerCase().replace(/\s+/g, "_");
  if (TASK_ALIAS[slug]) return TASK_ALIAS[slug];
  if ((WRITING_RUNTIME_TASK_TYPES as string[]).includes(slug)) {
    return slug as WritingRuntimeTaskType;
  }
  return null;
}

export function isWritingQuestion(
  question: Pick<PublicQuestion, "question_type" | "content" | "question_text" | "media_url">
): boolean {
  if (normalizeQuestionType(question.question_type) !== "writing") return false;
  return parseWritingQuestionContent(question).cambridgeTaskType != null;
}

export function parseWritingQuestionContent(
  question: Pick<PublicQuestion, "question_text" | "content" | "media_url">
): WritingQuestionContent {
  const content = question.content ?? {};
  const taskType =
    normalizeWritingTaskType(content.cambridgeTaskType) ??
    normalizeWritingTaskType(content.writingTaskType) ??
    "write_sentence";

  const bulletPoints = Array.isArray(content.bulletPoints)
    ? content.bulletPoints.filter((p): p is string => typeof p === "string")
    : Array.isArray(content.taskPrompts)
      ? content.taskPrompts.filter((p): p is string => typeof p === "string")
      : undefined;

  const prompt: WritingPrompt = {
    prompt:
      (typeof content.prompt === "string" && content.prompt) ||
      (typeof content.taskDescription === "string" && content.taskDescription) ||
      question.question_text,
    taskDescription:
      typeof content.taskDescription === "string" ? content.taskDescription : undefined,
    bulletPoints,
  };

  const constraints: WritingConstraints = {
    minWords: typeof content.minWords === "number" ? content.minWords : undefined,
    maxWords: typeof content.maxWords === "number" ? content.maxWords : undefined,
    maxCharacters: typeof content.maxCharacters === "number" ? content.maxCharacters : undefined,
    requiredPoints: Array.isArray(content.requiredPoints)
      ? content.requiredPoints.filter((p): p is string => typeof p === "string")
      : undefined,
  };

  const imageUrl =
    (typeof content.imageUrl === "string" && content.imageUrl) ||
    question.media_url ||
    undefined;

  return {
    cambridgeTaskType: taskType,
    prompt,
    constraints,
    stimulus: imageUrl
      ? {
          imageUrl,
          imageDescription:
            typeof content.imageDescription === "string"
              ? content.imageDescription
              : undefined,
        }
      : undefined,
  };
}

export function getWritingTaskLabel(taskType: WritingRuntimeTaskType): string {
  const taxonomyKey =
    taskType === "picture_description" ? "picture_description_writing" : taskType;
  try {
    return getCambridgeTask(taxonomyKey).label;
  } catch {
    return taskType;
  }
}

export function buildWritingResponse(responseText: string): WritingResponse {
  return {
    responseText,
    wordCount: countWords(responseText),
    characterCount: countCharacters(responseText),
  };
}

export function createWritingUserAnswer(
  responseText: string,
  taskType?: WritingRuntimeTaskType
): WritingUserAnswerPayload {
  const response = buildWritingResponse(responseText);
  return {
    type: "writing",
    responseText: response.responseText,
    wordCount: response.wordCount,
    submittedAt: new Date().toISOString(),
    taskType,
  };
}

export function userAnswerToWritingPayload(
  answer: UserAnswer | undefined
): WritingUserAnswerPayload | null {
  if (!answer) return null;
  if (answer.type === "writing") {
    return {
      type: "writing",
      responseText: answer.responseText,
      wordCount: answer.wordCount,
      submittedAt: answer.submittedAt,
      taskType: answer.taskType as WritingRuntimeTaskType | undefined,
      evaluation: answer.evaluation,
    };
  }
  if (answer.type === "text") {
    return createWritingUserAnswer(answer.text);
  }
  return null;
}

export function getWritingResponseText(answer: UserAnswer | undefined): string {
  const payload = userAnswerToWritingPayload(answer);
  return payload?.responseText ?? "";
}

export function isWritingAnswerComplete(
  answer: UserAnswer | undefined,
  minWords = 1
): boolean {
  const payload = userAnswerToWritingPayload(answer);
  if (!payload) return false;
  return countWords(payload.responseText) >= minWords;
}

export function isQuestionAnswered(
  question: Pick<PublicQuestion, "question_type" | "content" | "question_text" | "media_url">,
  answer: UserAnswer | undefined
): boolean {
  if (isWritingQuestion(question)) {
    const { constraints } = parseWritingQuestionContent(question);
    const minWords = constraints.minWords ?? 1;
    return isWritingAnswerComplete(answer, minWords);
  }

  if (isSpeakingQuestion(question)) {
    return isSpeakingAnswerComplete(answer);
  }

  if (!answer) return false;

  switch (answer.type) {
    case "single":
      return Boolean(answer.choiceId);
    case "multi":
      return answer.choiceIds.length > 0;
    case "matching":
      return answer.pairs.length > 0;
    case "gap_fill":
      return answer.answers.some((a) => a.trim().length > 0);
    case "sentence_ordering":
      return answer.order.length > 0;
    case "writing":
    case "text":
      return isWritingAnswerComplete(answer, 1);
    case "speaking":
      return isSpeakingAnswerComplete(answer);
    default:
      return false;
  }
}

export function toWritingSubmission(
  questionId: string,
  answer: UserAnswer | undefined,
  taskType?: WritingRuntimeTaskType
): WritingSubmission | null {
  const payload = userAnswerToWritingPayload(answer);
  if (!payload || !payload.responseText.trim()) return null;
  return {
    questionId,
    responseText: payload.responseText,
    wordCount: payload.wordCount,
    submittedAt: payload.submittedAt ?? new Date().toISOString(),
    taskType: payload.taskType ?? taskType,
  };
}

export function serializeWritingAnswersForAttempt(
  answers: Record<string, UserAnswer>
): Record<string, UserAnswer> {
  const out: Record<string, UserAnswer> = {};
  for (const [questionId, answer] of Object.entries(answers)) {
    if (answer.type === "writing") {
      out[questionId] = answer;
    } else if (answer.type === "text") {
      out[questionId] = createWritingUserAnswer(answer.text);
    } else {
      out[questionId] = answer;
    }
  }
  return out;
}

export function countAnsweredQuestions(
  questions: Array<Pick<PublicQuestion, "id" | "question_type" | "content" | "question_text" | "media_url">>,
  answers: Record<string, UserAnswer>
): number {
  return questions.filter((q) => isQuestionAnswered(q, answers[q.id])).length;
}
