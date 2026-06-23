import { describe, expect, it } from "vitest";
import { computeMockTestSkillAnalytics } from "@/lib/mock-tests/mock-test-analytics";
import { buildMockTestSkillAnalyticsFromAttempt } from "@/lib/mock-tests/mock-test-skill-analytics-builder";
import type { MockTestAnalyticsQuestion } from "@/lib/mock-tests/mock-test-analytics-types";
import type { QuestionResult } from "@/types/learning";

function question(
  id: string,
  grammarTags: string[],
  vocabularyTopics: string[]
): MockTestAnalyticsQuestion {
  return {
    id,
    content: { grammarTags, vocabularyTopics },
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

describe("mock test skill analytics view model", () => {
  it("maps grammar and vocabulary breakdowns with display labels", () => {
    const questions = [
      question("q1", ["present_simple"], ["family"]),
      question("q2", ["present_simple"], ["animals"]),
    ];

    const analytics = computeMockTestSkillAnalytics(questions, [
      result("q1", 1, 1),
      result("q2", 0, 1),
    ]);

    expect(analytics.hasData).toBe(true);
    expect(analytics.grammarBreakdown[0]?.label).toBe("Present simple");
    expect(analytics.vocabularyBreakdown.map((v) => v.label)).toContain("Family");
    expect(analytics.grammarStrengths.length + analytics.grammarWeaknesses.length).toBeGreaterThan(
      0
    );
  });

  it("returns hasData false when questions lack intelligence metadata", () => {
    const questions = [question("q1", [], [])];
    const analytics = computeMockTestSkillAnalytics(questions, [result("q1", 1, 1)]);
    expect(analytics.hasData).toBe(false);
    expect(analytics.grammarBreakdown).toHaveLength(0);
    expect(analytics.vocabularyBreakdown).toHaveLength(0);
  });

  it("limits strengths and weaknesses to top three each", () => {
    const questions = [
      question("q1", ["present_simple"], ["family"]),
      question("q2", ["past_simple"], ["school"]),
      question("q3", ["modal_can"], ["sports"]),
      question("q4", ["verb_be"], ["food"]),
    ];

    const analytics = computeMockTestSkillAnalytics(questions, [
      result("q1", 1, 1),
      result("q2", 1, 1),
      result("q3", 1, 1),
      result("q4", 1, 1),
    ]);

    expect(analytics.grammarStrengths.length).toBeLessThanOrEqual(3);
    expect(analytics.vocabularyStrengths.length).toBeLessThanOrEqual(3);
  });

  it("buildMockTestSkillAnalyticsFromAttempt delegates to computeMockTestSkillAnalytics", () => {
    const questions = [question("q1", ["verb_be"], ["family"])];
    const questionResults = [result("q1", 1, 1)];

    expect(buildMockTestSkillAnalyticsFromAttempt(questions, questionResults)).toEqual(
      computeMockTestSkillAnalytics(questions, questionResults)
    );
  });
});
