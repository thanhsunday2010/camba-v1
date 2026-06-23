import { createClient } from "@/lib/supabase/server";
import {
  deriveMockTestFormatMetadata,
  resolveYleLevelSlug,
  type MockTestFormatMetadata,
  type StoredMockTestFormat,
} from "@/lib/mock-tests/mock-test-format";
import type { MockTestSectionSummary } from "@/lib/mock-tests/mock-test-types";
import { parseMockContextFromQuestionContent } from "@/lib/mock-tests/mock-test-context";

type HubFormatRow = {
  testId: string;
  levelId: string | null;
  settings: Record<string, unknown> | null;
  sections: MockTestSectionSummary[];
};

export function formatFromStoredSettings(
  stored: StoredMockTestFormat | null,
  levelId: string | null,
  sections: MockTestSectionSummary[]
): MockTestFormatMetadata {
  return deriveMockTestFormatMetadata({
    levelId,
    levelSlug: stored?.levelSlug ?? null,
    settings: stored ? { format: stored } : null,
    sections,
    questionContexts: [],
  });
}

export async function getSkillSectionsForTests(
  testIds: string[]
): Promise<Map<string, MockTestSectionSummary[]>> {
  const result = new Map<string, MockTestSectionSummary[]>();
  if (testIds.length === 0) return result;

  const supabase = await createClient();

  const { data: sections } = await supabase
    .from("mock_test_sections")
    .select("id, mock_test_id, title, sort_order, time_limit_minutes, skill_id")
    .in("mock_test_id", testIds)
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

  const sectionCounts = new Map<string, number>();
  const { data: junctions } = await supabase
    .from("mock_test_questions")
    .select("mock_test_section_id")
    .in(
      "mock_test_section_id",
      (sections ?? []).map((s) => s.id)
    );

  for (const row of junctions ?? []) {
    sectionCounts.set(row.mock_test_section_id, (sectionCounts.get(row.mock_test_section_id) ?? 0) + 1);
  }

  for (const section of sections ?? []) {
    const skill = section.skill_id ? skillMap.get(section.skill_id) : null;
    const summary: MockTestSectionSummary = {
      id: section.id,
      title: section.title,
      sortOrder: section.sort_order,
      questionCount: sectionCounts.get(section.id) ?? 0,
      timeLimitMinutes: section.time_limit_minutes,
      skillSlug: skill?.slug ?? null,
      skillName: skill?.name ?? null,
    };
    const bucket = result.get(section.mock_test_id) ?? [];
    bucket.push(summary);
    result.set(section.mock_test_id, bucket);
  }

  return result;
}

export async function getMockTestFormatMap(
  rows: HubFormatRow[]
): Promise<Map<string, MockTestFormatMetadata>> {
  const map = new Map<string, MockTestFormatMetadata>();
  const needsContext = rows.filter((row) => {
    const stored = (row.settings?.format ?? null) as StoredMockTestFormat | null;
    return !stored?.listeningMode;
  });

  const contextByTest = new Map<string, { sectionSkillSlug?: string | null; contextType?: string | null; audioSrc?: string | null }[]>();

  if (needsContext.length > 0) {
    const supabase = await createClient();
    const testIds = needsContext.map((r) => r.testId);

    const { data: sections } = await supabase
      .from("mock_test_sections")
      .select("id, mock_test_id, skill_id")
      .in("mock_test_id", testIds);

    const skillIds = [...new Set((sections ?? []).map((s) => s.skill_id).filter(Boolean))] as string[];
    const skillSlugById = new Map<string, string>();
    if (skillIds.length > 0) {
      const { data: skills } = await supabase
        .from("skills")
        .select("id, slug")
        .in("id", skillIds);
      for (const skill of skills ?? []) {
        skillSlugById.set(skill.id, skill.slug);
      }
    }

    const sectionMeta = new Map(
      (sections ?? []).map((s) => [
        s.id,
        {
          testId: s.mock_test_id,
          skillSlug: s.skill_id ? skillSlugById.get(s.skill_id) ?? null : null,
        },
      ])
    );

    const sectionIds = (sections ?? []).map((s) => s.id);
    if (sectionIds.length > 0) {
      const { data: junctions } = await supabase
        .from("mock_test_questions")
        .select("mock_test_section_id, question_id")
        .in("mock_test_section_id", sectionIds);

      const questionIds = [...new Set((junctions ?? []).map((j) => j.question_id))];
      const { data: questions } = await supabase
        .from("questions")
        .select("id, content")
        .in("id", questionIds);

      const contentById = new Map(
        (questions ?? []).map((q) => [q.id, (q.content as Record<string, unknown>) ?? {}])
      );

      for (const junction of junctions ?? []) {
        const meta = sectionMeta.get(junction.mock_test_section_id);
        if (!meta) continue;
        const ctx = parseMockContextFromQuestionContent(contentById.get(junction.question_id));
        const slice = contextByTest.get(meta.testId) ?? [];
        slice.push({
          sectionSkillSlug: meta.skillSlug,
          contextType: ctx?.contextType ?? null,
          audioSrc: ctx?.audio?.src ?? null,
        });
        contextByTest.set(meta.testId, slice);
      }
    }
  }

  for (const row of rows) {
    const stored = (row.settings?.format ?? null) as StoredMockTestFormat | null;
    const contexts = contextByTest.get(row.testId) ?? [];
    map.set(
      row.testId,
      deriveMockTestFormatMetadata({
        levelId: row.levelId,
        levelSlug: stored?.levelSlug ?? resolveYleLevelSlug(row.levelId),
        settings: row.settings,
        sections: row.sections,
        questionContexts: contexts,
      })
    );
  }

  return map;
}

export function deriveFormatFromMockTestData(
  test: {
    levelId: string | null;
    levelName: string | null;
    settings?: Record<string, unknown> | null;
    sections: Array<{
      id: string;
      title: string;
      sortOrder: number;
      timeLimitMinutes: number | null;
      skillSlug: string | null;
      skillName: string | null;
      questions: Array<{ content?: Record<string, unknown> }>;
    }>;
  }
): MockTestFormatMetadata {
  const sections: MockTestSectionSummary[] = test.sections.map((section) => ({
    id: section.id,
    title: section.title,
    sortOrder: section.sortOrder,
    questionCount: section.questions.length,
    timeLimitMinutes: section.timeLimitMinutes,
    skillSlug: section.skillSlug,
    skillName: section.skillName,
  }));

  const questionContexts = test.sections.flatMap((section) =>
    section.questions.map((q) => {
      const ctx = parseMockContextFromQuestionContent(q.content);
      return {
        sectionSkillSlug: section.skillSlug,
        contextType: ctx?.contextType ?? null,
        audioSrc: ctx?.audio?.src ?? null,
      };
    })
  );

  const stored = (test.settings?.format ?? null) as StoredMockTestFormat | null;

  return deriveMockTestFormatMetadata({
    levelId: test.levelId,
    levelSlug: stored?.levelSlug ?? resolveYleLevelSlug(test.levelId),
    settings: test.settings,
    sections,
    questionContexts,
  });
}
