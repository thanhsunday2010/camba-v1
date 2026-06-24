import { getActiveProgramContext } from "@/lib/programs/context";
import { resolveProgramId } from "@/lib/programs/context";
import { createClient } from "@/lib/supabase/server";
import {
  getMockTestQuestionCounts,
  getMockTestSectionCounts,
  getUserMockTestAttemptAggregates,
} from "@/lib/queries/mock-tests";
import {
  getMockTestFormatMap,
  getSkillSectionsForTests,
} from "@/lib/mock-tests/mock-test-format-queries";
import { isMockRecommendedForLevel, resolveYleLevelSlug } from "@/lib/mock-tests/mock-test-format";
import { deriveMockTestDisplayState } from "@/lib/mock-tests/mock-test-ui-utils";
import type {
  MockTestHubSummary,
  MockTestHubViewModel,
  MockTestLevelBucket,
} from "@/lib/mock-tests/mock-test-types";
import type { YleLevelSlug } from "@/lib/mock-blueprints/yle-mock-blueprint-types";

export async function getMockTestHubViewModel(
  userId: string
): Promise<MockTestHubViewModel> {
  const empty: MockTestHubViewModel = {
    tests: [],
    recommendedTests: [],
    recommendedMockIds: [],
    totalCount: 0,
    currentLearnerLevelSlug: null,
    currentLearnerLevelName: null,
    availableLevelBuckets: [],
  };

  const supabase = await createClient();
  const [programId, programContext] = await Promise.all([
    resolveProgramId(userId),
    getActiveProgramContext(userId),
  ]);

  if (!programId) return empty;

  const learnerLevelSlug = (programContext?.level?.slug as YleLevelSlug | undefined) ?? null;
  const learnerLevelName = programContext?.level?.name ?? null;

  const { data: tests } = await supabase
    .from("mock_tests")
    .select("id, title, description, time_limit_minutes, level_id, settings")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (!tests?.length) {
    return {
      ...empty,
      currentLearnerLevelSlug: learnerLevelSlug,
      currentLearnerLevelName: learnerLevelName,
    };
  }

  const testIds = tests.map((t) => t.id);
  const [attemptAggregates, questionCounts, sectionCounts, sectionsByTest] =
    await Promise.all([
      getUserMockTestAttemptAggregates(userId),
      getMockTestQuestionCounts(testIds),
      getMockTestSectionCounts(testIds),
      getSkillSectionsForTests(testIds),
    ]);

  const formatRows = tests.map((test) => ({
    testId: test.id,
    levelId: test.level_id,
    settings: (test.settings as Record<string, unknown> | null) ?? null,
    sections: sectionsByTest.get(test.id) ?? [],
  }));
  const formatMap = await getMockTestFormatMap(formatRows);

  const levelIds = [...new Set(tests.map((t) => t.level_id).filter(Boolean))] as string[];
  const levelMap = new Map<string, { name: string; slug: string }>();

  if (levelIds.length > 0) {
    const { data: levels } = await supabase
      .from("levels")
      .select("id, name, slug")
      .in("id", levelIds);
    for (const level of levels ?? []) {
      levelMap.set(level.id, { name: level.name, slug: level.slug });
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

    const levelMeta = test.level_id ? levelMap.get(test.level_id) : null;
    const format = formatMap.get(test.id)!;
    const levelSlug =
      resolveYleLevelSlug(test.level_id, levelMeta?.slug) ??
      (format.levelSlug ?? null);

    const settings = (test.settings as Record<string, unknown> | null) ?? null;

    return {
      id: test.id,
      title: test.title,
      description: test.description,
      levelName: levelMeta?.name ?? null,
      levelSlug,
      durationMinutes: test.time_limit_minutes,
      questionCount: questionCounts.get(test.id) ?? 0,
      sectionCount: sectionCounts.get(test.id) ?? 0,
      attemptCount,
      bestScorePercent: stats?.bestPercent ?? null,
      latestScorePercent: stats?.latestPercent ?? null,
      displayState,
      latestCompletedAt: stats?.latestCompletedAt ?? null,
      skillTags: skillTagsByTest.get(test.id) ?? [],
      format,
      isRecommendedForLearner: isMockRecommendedForLevel(levelSlug, learnerLevelSlug),
      isGoldMock: Boolean(settings?.goldMock),
      goldMockId:
        typeof settings?.goldMockId === "string" ? settings.goldMockId : null,
    };
  });

  const bucketCounts = new Map<YleLevelSlug, { name: string; count: number }>();
  for (const summary of summaries) {
    if (!summary.levelSlug) continue;
    const existing = bucketCounts.get(summary.levelSlug);
    if (existing) {
      existing.count += 1;
    } else {
      bucketCounts.set(summary.levelSlug, {
        name: summary.levelName ?? summary.levelSlug,
        count: 1,
      });
    }
  }

  const availableLevelBuckets: MockTestLevelBucket[] = [...bucketCounts.entries()]
    .map(([slug, meta]) => ({ slug, name: meta.name, count: meta.count }))
    .sort((a, b) => a.slug.localeCompare(b.slug));

  const recommendedTests = summaries.filter((t) => t.isRecommendedForLearner);

  return {
    tests: summaries,
    recommendedTests,
    recommendedMockIds: recommendedTests.map((t) => t.id),
    totalCount: summaries.length,
    currentLearnerLevelSlug: learnerLevelSlug,
    currentLearnerLevelName: learnerLevelName,
    availableLevelBuckets,
  };
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
