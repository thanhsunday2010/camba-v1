import type { PublicQuestion } from "@/types/learning";
import type { UserAnswer } from "@/types/learning";
import {
  isWritingQuestion,
  parseWritingQuestionContent,
  userAnswerToWritingPayload,
} from "@/lib/writing/writing-utils";
import { WRITING_RUNTIME_TASK_TYPES } from "@/lib/writing/writing-types";
import type { WritingRuntimeTaskType } from "@/lib/writing/writing-types";

export type WritingValidationIssue = {
  code: string;
  message: string;
};

export function validateWritingTaskType(
  taskType: unknown
): WritingValidationIssue | null {
  if (typeof taskType !== "string") {
    return { code: "WRITING_TASK_TYPE_MISSING", message: "Writing task type is required." };
  }
  const normalized = taskType.trim().toLowerCase().replace(/\s+/g, "_");
  const allowed = [...WRITING_RUNTIME_TASK_TYPES, "picture_description_writing"];
  if (!allowed.includes(normalized)) {
    return {
      code: "WRITING_TASK_TYPE_UNSUPPORTED",
      message: `Unsupported writing task type: ${taskType}.`,
    };
  }
  return null;
}

export function validateWritingQuestionContent(
  question: Pick<PublicQuestion, "question_type" | "question_text" | "content" | "media_url">
): WritingValidationIssue[] {
  const issues: WritingValidationIssue[] = [];
  if (!isWritingQuestion(question)) {
    issues.push({
      code: "NOT_WRITING_QUESTION",
      message: "Question is not a writing task.",
    });
    return issues;
  }

  const parsed = parseWritingQuestionContent(question);
  const taskIssue = validateWritingTaskType(parsed.cambridgeTaskType);
  if (taskIssue) issues.push(taskIssue);

  if (!parsed.prompt.prompt.trim()) {
    issues.push({ code: "WRITING_PROMPT_MISSING", message: "Writing prompt is required." });
  }

  if (
    parsed.constraints.minWords != null &&
    parsed.constraints.maxWords != null &&
    parsed.constraints.minWords > parsed.constraints.maxWords
  ) {
    issues.push({
      code: "WRITING_WORD_RANGE_INVALID",
      message: "minWords cannot exceed maxWords.",
    });
  }

  return issues;
}

export function validateWritingAnswer(
  question: Pick<PublicQuestion, "question_type" | "content" | "question_text" | "media_url">,
  answer: UserAnswer | undefined
): WritingValidationIssue[] {
  const issues: WritingValidationIssue[] = [];
  if (!isWritingQuestion(question)) return issues;

  const payload = userAnswerToWritingPayload(answer);
  if (!payload?.responseText.trim()) {
    issues.push({ code: "WRITING_RESPONSE_EMPTY", message: "Response text is required." });
    return issues;
  }

  const { constraints } = parseWritingQuestionContent(question);
  if (constraints.minWords != null && payload.wordCount < constraints.minWords) {
    issues.push({
      code: "WRITING_MIN_WORDS",
      message: `At least ${constraints.minWords} words required.`,
    });
  }
  if (constraints.maxWords != null && payload.wordCount > constraints.maxWords) {
    issues.push({
      code: "WRITING_MAX_WORDS",
      message: `No more than ${constraints.maxWords} words allowed.`,
    });
  }

  return issues;
}

export function assertWritingRuntimeTaskType(
  value: string
): asserts value is WritingRuntimeTaskType {
  const issue = validateWritingTaskType(value);
  if (issue) throw new Error(issue.message);
}
