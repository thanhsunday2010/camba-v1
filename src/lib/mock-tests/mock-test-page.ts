import { fetchMockTestByIdFull, getLatestMockTestAttemptDetail, getMockTestById, getUserMockTestAttempts } from "@/lib/queries/mock-tests";
import {
  buildMockTestAttemptSummary,
  deriveMockTestDisplayState,
} from "@/lib/mock-tests/mock-test-ui-utils";
import type {
  MockTestDetailViewModel,
  MockTestPrimaryCta,
  MockTestTakeViewModel,
} from "@/lib/mock-tests/mock-test-types";

export async function getMockTestDetailViewModel(
  userId: string,
  mockTestId: string
): Promise<MockTestDetailViewModel | null> {
  const fullTest = await fetchMockTestByIdFull(mockTestId);
  if (!fullTest) return null;

  const latestRaw = await getLatestMockTestAttemptDetail(userId, mockTestId);

  const sections = fullTest.sections
    .map((section) => ({
      id: section.id,
      title: section.title,
      sortOrder: section.sortOrder,
      questionCount: section.questions.length,
      timeLimitMinutes: section.timeLimitMinutes,
      skillSlug: section.skillSlug,
      skillName: section.skillName,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const questionCount = sections.reduce((n, s) => n + s.questionCount, 0);

  let attemptCount = 0;
  let bestScorePercent: number | null = null;

  const history = await getUserMockTestAttempts(userId, mockTestId);
  attemptCount = history.length;
  if (attemptCount > 0) {
    bestScorePercent = history.reduce((best, a) => Math.max(best, a.scorePercent), 0);
  }

  const latestAttempt = latestRaw
    ? buildMockTestAttemptSummary({
        attemptId: latestRaw.id,
        score: latestRaw.score,
        maxScore: latestRaw.maxScore,
        completedAt: latestRaw.completedAt,
        timeSpentSeconds: latestRaw.timeSpentSeconds,
        skillBreakdown: latestRaw.skillBreakdown,
        shieldEstimate: latestRaw.shieldEstimate,
      })
    : null;

  const displayState = deriveMockTestDisplayState({
    attemptCount,
    latestScorePercent: latestAttempt?.scorePercent ?? null,
    skillBreakdown: latestAttempt?.skillBreakdown,
  });

  const primaryCta: MockTestPrimaryCta =
    attemptCount > 0 ? "retake" : "start";

  return {
    id: fullTest.id,
    title: fullTest.title,
    description: fullTest.description,
    levelName: fullTest.levelName,
    durationMinutes: fullTest.timeLimitMinutes,
    totalScore: fullTest.totalScore,
    questionCount,
    sectionCount: sections.length,
    displayState,
    primaryCta,
    attemptCount,
    bestScorePercent,
    sections,
    latestAttempt,
    takeHref: `/mock-tests/${mockTestId}/take`,
  };
}

export async function getMockTestTakeViewModel(
  userId: string,
  mockTestId: string
): Promise<MockTestTakeViewModel | null> {
  const test = await getMockTestById(mockTestId);
  if (!test) return null;

  const sections = [...test.sections]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((section) => ({
      id: section.id,
      title: section.title,
      sortOrder: section.sortOrder,
      questionCount: section.questions.length,
      timeLimitMinutes: section.timeLimitMinutes,
      skillSlug: section.skillSlug,
      skillName: section.skillName,
    }));

  let position = 0;
  const questions = sections.flatMap((section) => {
    const fullSection = test.sections.find((s) => s.id === section.id);
    return (fullSection?.questions ?? []).map((q) => {
      position += 1;
      return {
        id: q.id,
        sectionId: section.id,
        sectionTitle: section.title,
        skillName: section.skillName,
        skillSlug: section.skillSlug,
        position,
        questionText: q.question_text,
      };
    });
  });

  const history = await getUserMockTestAttempts(userId, mockTestId);

  return {
    id: test.id,
    title: test.title,
    description: test.description,
    levelName: test.levelName,
    durationMinutes: test.timeLimitMinutes,
    questionCount: questions.length,
    sectionCount: sections.length,
    sections,
    questions,
    test,
    detailHref: `/mock-tests/${mockTestId}`,
    hubHref: "/mock-tests",
    hasPriorAttempts: history.length > 0,
  };
}
