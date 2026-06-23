import { describe, expect, it } from "vitest";
import {
  computeLearnerSkillAnalytics,
  LEARNER_ANALYTICS_STRENGTH_THRESHOLD,
  LEARNER_ANALYTICS_WEAKNESS_THRESHOLD,
} from "@/lib/learning/learner-skill-analytics";
import type { Question, QuestionResult } from "@/types/learning";

function question(id: string, grammarTags: string[], vocabularyTopics: string[]): Question {
  return {
    id,
    exercise_id: "ex-1",
    question_text: "Q",
    question_type: "multiple_choice",
    media_url: null,
    media_type: null,
    points: 1,
    sort_order: 0,
    explanation: null,
    content: { grammarTags, vocabularyTopics },
    choices: [],
    pairs: [],
  };
}

function result(questionId: string, earned: number, max: number): QuestionResult {
  return {
    questionId,
    isCorrect: earned === max,
    pointsEarned: earned,
    maxPoints: max,
    explanation: null,
  };
}

describe("learner skill analytics", () => {
  it("calculates grammar and vocabulary breakdown from tagged questions", () => {
    const questions = [
      question("q1", ["present_simple"], ["family"]),
      question("q2", ["present_simple"], ["family"]),
      question("q3", ["past_simple"], ["school"]),
    ];

    const analytics = computeLearnerSkillAnalytics(questions, [
      {
        questionResults: [
          result("q1", 1, 1),
          result("q2", 0, 1),
          result("q3", 1, 1),
        ],
      },
    ]);

    expect(analytics.grammarBreakdown.present_simple).toBe(50);
    expect(analytics.grammarBreakdown.past_simple).toBe(100);
    expect(analytics.vocabularyBreakdown.family).toBe(50);
    expect(analytics.vocabularyBreakdown.school).toBe(100);
  });

  it("flags strengths and weaknesses using configured thresholds", () => {
    const questions = [question("q1", ["modal_can"], ["sports"])];

    const strong = computeLearnerSkillAnalytics(questions, [
      { questionResults: [result("q1", 1, 1)] },
    ]);
    expect(strong.strengths).toContain("Modal: can");
    expect(LEARNER_ANALYTICS_STRENGTH_THRESHOLD).toBe(70);

    const weak = computeLearnerSkillAnalytics(questions, [
      { questionResults: [result("q1", 0, 1)] },
    ]);
    expect(weak.weaknesses).toContain("Modal: can");
    expect(LEARNER_ANALYTICS_WEAKNESS_THRESHOLD).toBe(55);
  });
});
