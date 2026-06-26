import { createClient } from "@/lib/supabase/server";
import {
  fetchChoicesByQuestionIds,
  fetchPairsByQuestionIds,
  groupRowsByQuestionId,
} from "@/lib/learning/fetch-question-relations";
import { resolveQuestionChoices } from "@/lib/learning/question-choices";
import { sanitizeQuestionForClient } from "@/lib/learning/sanitize-questions";
import { resolveProgramId } from "@/lib/programs/context";
import type {
  MockTestData,
  MockTestSummary,
  Question,
} from "@/types/learning";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function fetchQuestionsByIdsBatch(
  supabase: SupabaseServerClient,
  questionIds: string[]
): Promise<Map<string, Question>> {
  const map = new Map<string, Question>();
  if (questionIds.length === 0) return map;

  const { data: questions } = await supabase
    .from("questions")
    .select("*")
    .in("id", questionIds);

  if (!questions?.length) return map;

  const [allChoices, allPairs] = await Promise.all([
    fetchChoicesByQuestionIds(supabase, questionIds),
    fetchPairsByQuestionIds(supabase, questionIds),
  ]);

  const choicesByQuestion = groupRowsByQuestionId(allChoices);
  const pairsByQuestion = groupRowsByQuestionId(allPairs);

  for (const question of questions) {
    const content = (question.content as Record<string, unknown>) ?? {};
    map.set(question.id, {
      ...question,
      content,
      choices: resolveQuestionChoices(
        question.id,
        choicesByQuestion.get(question.id) ?? [],
        content
      ),
      pairs: pairsByQuestion.get(question.id) ?? [],
    });
  }

  return map;
}

export async function getMockTestsForUser(userId: string): Promise<MockTestSummary[]> {
  const supabase = await createClient();

  const programId = await resolveProgramId(userId);
  if (!programId) return [];

  const { data: tests } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const { data: attempts } = await supabase
    .from("mock_test_attempts")
    .select("mock_test_id, score, max_score, is_completed")
    .eq("user_id", userId)
    .eq("is_completed", true);

  const attemptStats = new Map<string, { count: number; bestPercent: number }>();
  for (const attempt of attempts ?? []) {
    const percent =
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0;
    const existing = attemptStats.get(attempt.mock_test_id);
    if (existing) {
      existing.count += 1;
      existing.bestPercent = Math.max(existing.bestPercent, percent);
    } else {
      attemptStats.set(attempt.mock_test_id, { count: 1, bestPercent: percent });
    }
  }

  const summaries: MockTestSummary[] = [];

  for (const test of tests ?? []) {
    const fullTest = await getMockTestById(test.id);
    const stats = attemptStats.get(test.id);

    let levelName: string | null = null;
    if (test.level_id) {
      const { data: level } = await supabase
        .from("levels")
        .select("name")
        .eq("id", test.level_id)
        .single();
      levelName = level?.name ?? null;
    }

    summaries.push({
      id: test.id,
      title: test.title,
      description: test.description,
      timeLimitMinutes: test.time_limit_minutes,
      levelName: levelName,
      questionCount: fullTest?.sections.reduce((n, s) => n + s.questions.length, 0) ?? 0,
      bestScorePercent: stats?.bestPercent ?? null,
      attemptCount: stats?.count ?? 0,
    });
  }

  return summaries;
}

export async function fetchMockTestByIdFull(testId: string): Promise<{
  id: string;
  title: string;
  description: string | null;
  timeLimitMinutes: number;
  totalScore: number;
  levelId: string | null;
  levelName: string | null;
  settings: Record<string, unknown> | null;
  sections: Array<{
    id: string;
    title: string;
    sortOrder: number;
    timeLimitMinutes: number | null;
    skillSlug: string | null;
    skillName: string | null;
    questions: Question[];
  }>;
} | null> {
  const supabase = await createClient();

  const { data: test } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("id", testId)
    .eq("is_active", true)
    .single();

  if (!test) return null;

  let levelName: string | null = null;
  if (test.level_id) {
    const { data: level } = await supabase
      .from("levels")
      .select("id, name")
      .eq("id", test.level_id)
      .single();
    levelName = level?.name ?? null;
  }

  const { data: sections } = await supabase
    .from("mock_test_sections")
    .select("*")
    .eq("mock_test_id", testId)
    .order("sort_order");

  const skillIds = [...new Set((sections ?? []).map((s) => s.skill_id).filter(Boolean))] as string[];
  const skillMap = new Map<string, { slug: string; name: string }>();

  if (skillIds.length > 0) {
    const { data: skills } = await supabase
      .from("skills")
      .select("id, slug, name")
      .in("id", skillIds);

    for (const skill of skills ?? []) {
      skillMap.set(skill.id, { slug: skill.slug, name: skill.name });
    }
  }

  const mockSections: { id: string; title: string; sortOrder: number; timeLimitMinutes: number | null; skillSlug: string | null; skillName: string | null; questions: Question[] }[] = [];

  const junctionBySection = new Map<
    string,
    { question_id: string; sort_order: number; points: number | null }[]
  >();
  const allQuestionIds: string[] = [];

  for (const section of sections ?? []) {
    const { data: sectionQuestions } = await supabase
      .from("mock_test_questions")
      .select("question_id, sort_order, points")
      .eq("mock_test_section_id", section.id)
      .order("sort_order");

    const rows = sectionQuestions ?? [];
    junctionBySection.set(section.id, rows);
    for (const sq of rows) {
      allQuestionIds.push(sq.question_id);
    }
  }

  const questionsById = await fetchQuestionsByIdsBatch(supabase, [...new Set(allQuestionIds)]);

  for (const section of sections ?? []) {
    const sectionQuestionRows = junctionBySection.get(section.id) ?? [];
    const questions: Question[] = [];

    for (const sq of sectionQuestionRows) {
      const fullQuestion = questionsById.get(sq.question_id);
      if (fullQuestion) {
        questions.push({
          ...fullQuestion,
          points: sq.points ?? fullQuestion.points,
        });
      }
    }

    const skill = section.skill_id ? skillMap.get(section.skill_id) : null;

    mockSections.push({
      id: section.id,
      title: section.title,
      sortOrder: section.sort_order,
      timeLimitMinutes: section.time_limit_minutes,
      skillSlug: skill?.slug ?? null,
      skillName: skill?.name ?? null,
      questions,
    });
  }

  return {
    id: test.id,
    title: test.title,
    description: test.description,
    timeLimitMinutes: test.time_limit_minutes,
    totalScore: test.total_score,
    levelId: test.level_id,
    levelName,
    settings: (test.settings as Record<string, unknown> | null) ?? null,
    sections: mockSections,
  };
}

export async function getMockTestById(testId: string): Promise<MockTestData | null> {
  const fullTest = await fetchMockTestByIdFull(testId);
  if (!fullTest) return null;

  return {
    ...fullTest,
    sections: fullTest.sections.map((section) => ({
      ...section,
      questions: section.questions.map((q) => ({
        ...sanitizeQuestionForClient(q),
        sectionId: section.id,
        mockPoints: q.points,
      })),
    })),
  };
}

export async function getUserMockTestAttempts(userId: string, testId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("mock_test_attempts")
    .select("id, score, max_score, completed_at, time_spent_seconds")
    .eq("user_id", userId)
    .eq("mock_test_id", testId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false });

  return (data ?? []).map((a) => ({
    id: a.id,
    scorePercent:
      Number(a.max_score) > 0
        ? Math.round((Number(a.score) / Number(a.max_score)) * 100)
        : 0,
    completedAt: a.completed_at,
    timeSpentSeconds: a.time_spent_seconds,
  }));
}

export type MockTestAttemptAggregate = {
  count: number;
  bestPercent: number;
  latestPercent: number;
  latestCompletedAt: string | null;
  latestSkillBreakdown: Record<string, number>;
};

/** Read-only batch aggregates for hub / detail display */
export async function getUserMockTestAttemptAggregates(
  userId: string
): Promise<Map<string, MockTestAttemptAggregate>> {
  const supabase = await createClient();

  const { data: attempts } = await supabase
    .from("mock_test_attempts")
    .select(
      "mock_test_id, score, max_score, completed_at, skill_breakdown, is_completed"
    )
    .eq("user_id", userId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false });

  const map = new Map<string, MockTestAttemptAggregate>();

  for (const attempt of attempts ?? []) {
    const percent =
      Number(attempt.max_score) > 0
        ? Math.round((Number(attempt.score) / Number(attempt.max_score)) * 100)
        : 0;
    const breakdown =
      (attempt.skill_breakdown as Record<string, number> | null) ?? {};
    const existing = map.get(attempt.mock_test_id);

    if (existing) {
      existing.count += 1;
      existing.bestPercent = Math.max(existing.bestPercent, percent);
    } else {
      map.set(attempt.mock_test_id, {
        count: 1,
        bestPercent: percent,
        latestPercent: percent,
        latestCompletedAt: attempt.completed_at,
        latestSkillBreakdown: breakdown,
      });
    }
  }

  return map;
}

export async function getMockTestSectionCounts(
  testIds: string[]
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (testIds.length === 0) return counts;

  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("mock_test_sections")
    .select("mock_test_id")
    .in("mock_test_id", testIds);

  for (const section of sections ?? []) {
    counts.set(section.mock_test_id, (counts.get(section.mock_test_id) ?? 0) + 1);
  }

  return counts;
}

export async function getMockTestQuestionCounts(
  testIds: string[]
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (testIds.length === 0) return counts;

  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("mock_test_sections")
    .select("id, mock_test_id")
    .in("mock_test_id", testIds);

  if (!sections?.length) return counts;

  const sectionToTest = new Map(
    sections.map((s) => [s.id, s.mock_test_id] as const)
  );

  const { data: questions } = await supabase
    .from("mock_test_questions")
    .select("mock_test_section_id")
    .in("mock_test_section_id", sections.map((s) => s.id));

  for (const q of questions ?? []) {
    const testId = sectionToTest.get(q.mock_test_section_id);
    if (testId) {
      counts.set(testId, (counts.get(testId) ?? 0) + 1);
    }
  }

  return counts;
}

export async function getLatestMockTestAttemptDetail(
  userId: string,
  testId: string
): Promise<{
  id: string;
  score: number;
  maxScore: number;
  completedAt: string | null;
  timeSpentSeconds: number | null;
  skillBreakdown: Record<string, number>;
  shieldEstimate: Record<string, number>;
  answers: Record<string, unknown>;
} | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("mock_test_attempts")
    .select(
      "id, score, max_score, completed_at, time_spent_seconds, skill_breakdown, shield_estimate, answers"
    )
    .eq("user_id", userId)
    .eq("mock_test_id", testId)
    .eq("is_completed", true)
    .order("completed_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    score: Number(data.score),
    maxScore: Number(data.max_score),
    completedAt: data.completed_at,
    timeSpentSeconds: data.time_spent_seconds,
    skillBreakdown: (data.skill_breakdown as Record<string, number> | null) ?? {},
    shieldEstimate: (data.shield_estimate as Record<string, number> | null) ?? {},
    answers: (data.answers as Record<string, unknown> | null) ?? {},
  };
}
