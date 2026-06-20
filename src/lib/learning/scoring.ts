import type { Question, UserAnswer, QuestionResult, ExerciseResult } from "@/types/learning";
import { normalizeQuestionType } from "@/lib/learning/question-types";

function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function scoreMultipleChoice(question: Question, answer: UserAnswer): QuestionResult {
  const userAnswer = answer as Extract<UserAnswer, { type: "single" }>;
  const correctChoice = question.choices?.find((c) => c.is_correct);
  const isCorrect = correctChoice?.id === userAnswer.choiceId;

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    maxPoints: question.points,
    explanation: question.explanation,
    correctChoiceId: correctChoice?.id,
  };
}

function scoreMultiSelect(question: Question, answer: UserAnswer): QuestionResult {
  const userAnswer = answer as Extract<UserAnswer, { type: "multi" }>;
  const correctIds = new Set(
    question.choices?.filter((c) => c.is_correct).map((c) => c.id) ?? []
  );
  const selectedIds = new Set(userAnswer.choiceIds);

  const isCorrect =
    correctIds.size === selectedIds.size &&
    [...correctIds].every((id) => selectedIds.has(id));

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    maxPoints: question.points,
    explanation: question.explanation,
    correctChoiceIds: [...correctIds],
  };
}

function scoreMatching(question: Question, answer: UserAnswer): QuestionResult {
  const userAnswer = answer as Extract<UserAnswer, { type: "matching" }>;
  const pairs = question.pairs ?? [];
  let correctCount = 0;

  for (const pair of pairs) {
    const userPair = userAnswer.pairs.find((p) => p.leftId === pair.id);
    if (userPair && normalizeText(userPair.rightText) === normalizeText(pair.right_text)) {
      correctCount++;
    }
  }

  const isCorrect = correctCount === pairs.length && pairs.length > 0;
  const partialPoints =
    pairs.length > 0
      ? Math.round((correctCount / pairs.length) * question.points)
      : 0;

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: partialPoints,
    maxPoints: question.points,
    explanation: question.explanation,
    correctPairs: pairs.map((pair) => ({ leftId: pair.id, rightText: pair.right_text })),
  };
}

function scoreGapFill(question: Question, answer: UserAnswer): QuestionResult {
  const userAnswer = answer as Extract<UserAnswer, { type: "gap_fill" }>;
  const correctAnswers = (question.content.correctAnswers as string[]) ?? [];
  let correctCount = 0;

  correctAnswers.forEach((correct, index) => {
    const userVal = userAnswer.answers[index] ?? "";
    const accepted = (question.content.acceptedAnswers as Record<number, string[]>)?.[index];
    if (accepted) {
      if (accepted.some((a) => normalizeText(a) === normalizeText(userVal))) correctCount++;
    } else if (normalizeText(correct) === normalizeText(userVal)) {
      correctCount++;
    }
  });

  const isCorrect = correctCount === correctAnswers.length && correctAnswers.length > 0;
  const partialPoints =
    correctAnswers.length > 0
      ? Math.round((correctCount / correctAnswers.length) * question.points)
      : 0;

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: partialPoints,
    maxPoints: question.points,
    explanation: question.explanation,
    correctAnswers,
  };
}

function scoreSentenceOrdering(question: Question, answer: UserAnswer): QuestionResult {
  const userAnswer = answer as Extract<UserAnswer, { type: "sentence_ordering" }>;
  const correctOrder = (question.content.correctOrder as string[]) ?? [];
  const isCorrect =
    correctOrder.length === userAnswer.order.length &&
    correctOrder.every((id, i) => id === userAnswer.order[i]);

  return {
    questionId: question.id,
    isCorrect,
    pointsEarned: isCorrect ? question.points : 0,
    maxPoints: question.points,
    explanation: question.explanation,
    correctOrder,
  };
}

export function scoreQuestion(question: Question, answer: UserAnswer): QuestionResult {
  const questionType = normalizeQuestionType(question.question_type);
  switch (questionType) {
    case "multiple_choice":
    case "listening":
    case "reading_comprehension":
    case "image_selection":
      return scoreMultipleChoice(question, answer);
    case "multi_select":
      return scoreMultiSelect(question, answer);
    case "matching":
    case "drag_drop":
      return scoreMatching(question, answer);
    case "gap_fill":
      return scoreGapFill(question, answer);
    case "sentence_ordering":
      return scoreSentenceOrdering(question, answer);
    default:
      return {
        questionId: question.id,
        isCorrect: false,
        pointsEarned: 0,
        maxPoints: question.points,
        explanation: question.explanation,
      };
  }
}

export function scoreExercise(
  questions: Question[],
  answers: Record<string, UserAnswer>
): ExerciseResult {
  const questionResults = questions.map((q) =>
    scoreQuestion(q, answers[q.id] ?? { type: "single", choiceId: "" })
  );

  const score = questionResults.reduce((sum, r) => sum + r.pointsEarned, 0);
  const maxScore = questionResults.reduce((sum, r) => sum + r.maxPoints, 0);
  const accuracyPercent = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return { score, maxScore, accuracyPercent, questionResults };
}
