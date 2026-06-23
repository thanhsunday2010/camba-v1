import type { QuestionResult } from "@/types/learning";
import { computeMockTestSkillAnalytics } from "@/lib/mock-tests/mock-test-analytics";
import type {
  MockTestAnalyticsQuestion,
  MockTestSkillAnalytics,
} from "@/lib/mock-tests/mock-test-analytics-types";

/**
 * Single assembly path for mock-test learning insights (take + detail surfaces).
 * Accepts question results from submit response or read-time re-scoring.
 */
export function buildMockTestSkillAnalyticsFromAttempt(
  questions: MockTestAnalyticsQuestion[],
  questionResults: QuestionResult[]
): MockTestSkillAnalytics {
  return computeMockTestSkillAnalytics(questions, questionResults);
}
