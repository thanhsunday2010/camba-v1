import type { PublicQuestion, Question } from "@/types/learning";
import { resolveQuestionChoices } from "@/lib/learning/question-choices";

const SENSITIVE_CONTENT_KEYS = [
  "correctAnswers",
  "acceptedAnswers",
  "correctOrder",
] as const;

export function sanitizeQuestionForClient(question: Question): PublicQuestion {
  const content = { ...(question.content ?? {}) };
  for (const key of SENSITIVE_CONTENT_KEYS) {
    delete content[key];
  }

  const resolvedChoices = resolveQuestionChoices(
    question.id,
    question.choices,
    question.content
  );
  delete content.choices;

  const pairs = question.pairs?.map(({ id, question_id, left_text, sort_order }) => ({
    id,
    question_id,
    left_text,
    sort_order,
  }));

  const matchingOptions =
    question.pairs && question.pairs.length > 0
      ? [...new Set(question.pairs.map((p) => p.right_text))].sort(() => Math.random() - 0.5)
      : undefined;

  return {
    ...question,
    content,
    choices: resolvedChoices.map((choice) => ({
      id: choice.id,
      question_id: choice.question_id,
      text: choice.text,
      sort_order: choice.sort_order,
      media_url: choice.media_url,
    })),
    pairs,
    matchingOptions,
  };
}

export function sanitizeQuestionsForClient(questions: Question[]): PublicQuestion[] {
  return questions.map(sanitizeQuestionForClient);
}
