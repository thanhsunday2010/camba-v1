import { createClient } from "@/lib/supabase/server";
import { fetchQuestionByIdFull } from "@/lib/queries/learning";
import { sanitizeQuestionForClient } from "@/lib/learning/sanitize-questions";
import { resolveProgramId } from "@/lib/programs/context";
import type {
  MockTestData,
  MockTestSummary,
  Question,
} from "@/types/learning";

export async function getMockTestsForUser(userId: string): Promise<MockTestSummary[]> {
  const supabase = await createClient();

  const programId = await resolveProgramId(userId);
  if (!programId) return [];

  const { data: gamification } = await supabase
    .from("user_gamification")
    .select("current_level_id")
    .eq("user_id", userId)
    .single();

  let query = supabase
    .from("mock_tests")
    .select("*")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (gamification?.current_level_id) {
    query = query.eq("level_id", gamification.current_level_id);
  }

  const { data: tests } = await query;

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

  for (const section of sections ?? []) {
    const { data: sectionQuestions } = await supabase
      .from("mock_test_questions")
      .select("*")
      .eq("mock_test_section_id", section.id)
      .order("sort_order");

    const questions: Question[] = [];

    for (const sq of sectionQuestions ?? []) {
      const fullQuestion = await fetchQuestionByIdFull(sq.question_id);
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
