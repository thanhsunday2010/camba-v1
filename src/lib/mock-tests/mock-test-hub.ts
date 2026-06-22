import { resolveProgramId } from "@/lib/programs/context";
import { createClient } from "@/lib/supabase/server";
import {
  getMockTestQuestionCounts,
  getMockTestSectionCounts,
  getUserMockTestAttemptAggregates,
} from "@/lib/queries/mock-tests";
import { deriveMockTestDisplayState } from "@/lib/mock-tests/mock-test-ui-utils";
import type {
  MockTestHubSummary,
  MockTestHubViewModel,
} from "@/lib/mock-tests/mock-test-types";

export async function getMockTestHubViewModel(
  userId: string
): Promise<MockTestHubViewModel> {
  const supabase = await createClient();
  const programId = await resolveProgramId(userId);
  if (!programId) return { tests: [], totalCount: 0 };

  const { data: tests } = await supabase
    .from("mock_tests")
    .select("id, title, description, time_limit_minutes, level_id")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!tests?.length) return { tests: [], totalCount: 0 };

  const testIds = tests.map((t) => t.id);
  const [attemptAggregates, questionCounts, sectionCounts] = await Promise.all([
    getUserMockTestAttemptAggregates(userId),
    getMockTestQuestionCounts(testIds),
    getMockTestSectionCounts(testIds),
  ]);

  const levelIds = [...new Set(tests.map((t) => t.level_id).filter(Boolean))] as string[];
  const levelMap = new Map<string, string>();

  if (levelIds.length > 0) {
    const { data: levels } = await supabase
      .from("levels")
      .select("id, name")
      .in("id", levelIds);
    for (const level of levels ?? []) {
      levelMap.set(level.id, level.name);
    }
  }

  const skillTagsByTest = await getSkillTagsForTests(testIds);

  const summaries: MockTestHubSummary[] = tests.map((test) => {
    const stats = attemptAggregates.get(test.id);
    const attemptCount = stats?.count ?? 0;
    const displayState = deriveMockTestDisplayState({
      attemptCount,
      latestScorePercent: stats?.latestPercent ?? null,
      skillBreakdown: stats?.latestSkillBreakdown,
    });

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      levelName: test.level_id ? levelMap.get(test.level_id) ?? null : null,
      durationMinutes: test.time_limit_minutes,
      questionCount: questionCounts.get(test.id) ?? 0,
      sectionCount: sectionCounts.get(test.id) ?? 0,
      attemptCount,
      bestScorePercent: stats?.bestPercent ?? null,
      latestScorePercent: stats?.latestPercent ?? null,
      displayState,
      latestCompletedAt: stats?.latestCompletedAt ?? null,
      skillTags: skillTagsByTest.get(test.id) ?? [],
    };
  });

  return { tests: summaries, totalCount: summaries.length };
}

async function getSkillTagsForTests(
  testIds: string[]
): Promise<Map<string, string[]>> {
  const result = new Map<string, string[]>();
  if (testIds.length === 0) return result;

  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("mock_test_sections")
    .select("mock_test_id, skill_id")
    .in("mock_test_id", testIds);

  const skillIds = [...new Set((sections ?? []).map((s) => s.skill_id).filter(Boolean))] as string[];
  const skillMap = new Map<string, string>();

  if (skillIds.length > 0) {
    const { data: skills } = await supabase
      .from("skills")
      .select("id, name")
      .in("id", skillIds);
    for (const skill of skills ?? []) {
      skillMap.set(skill.id, skill.name);
    }
  }

  for (const section of sections ?? []) {
    if (!section.skill_id) continue;
    const name = skillMap.get(section.skill_id);
    if (!name) continue;
    const tags = result.get(section.mock_test_id) ?? [];
    if (!tags.includes(name)) tags.push(name);
    result.set(section.mock_test_id, tags);
  }

  return result;
}
