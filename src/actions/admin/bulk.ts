"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { BulkExportBundle } from "@/lib/admin/types";
import { getAdminAssessments } from "./assessments";
import { getAdminContentTree } from "./content";
import { requirePermission, revalidateAdmin } from "./_shared";

export async function exportContentBundle(
  programId?: string
): Promise<ActionResult<BulkExportBundle>> {
  await requirePermission("tools.bulk");

  const tree = await getAdminContentTree();
  const { placementTests, mockTests } = await getAdminAssessments();

  const programIds = programId ? [programId] : tree.programs.map((p) => p.id);

  const levels = tree.levels.filter((l) => programIds.includes(l.program_id));
  const levelIds = new Set(levels.map((l) => l.id));
  const skills = tree.skills.filter((s) => levelIds.has(s.level_id));
  const skillIds = new Set(skills.map((s) => s.id));
  const units = tree.units.filter((u) => skillIds.has(u.skill_id));
  const unitIds = new Set(units.map((u) => u.id));
  const lessons = tree.lessons.filter((l) => unitIds.has(l.unit_id));
  const lessonIds = new Set(lessons.map((l) => l.id));
  const exercises = tree.exercises.filter((e) => lessonIds.has(e.lesson_id));
  const exerciseIds = new Set(exercises.map((e) => e.id));
  const questions = tree.questions.filter((q) => exerciseIds.has(q.exercise_id));

  const filteredPlacement = placementTests.filter((pt) =>
    programIds.includes(pt.program_id)
  );
  const filteredMock = mockTests.filter((mt) => programIds.includes(mt.program_id));

  const bundle: BulkExportBundle = {
    version: 1,
    exportedAt: new Date().toISOString(),
    programs: tree.programs.filter((p) => programIds.includes(p.id)),
    levels,
    skills,
    units,
    lessons,
    exercises,
    questions: questions.map(({ choices, pairs, ...q }) => {
      void choices;
      void pairs;
      return q;
    }),
    choices: questions.flatMap((q) => q.choices ?? []),
    question_pairs: questions.flatMap((q) => q.pairs ?? []),
    placement_tests: filteredPlacement.map(({ questions: ptQuestions, ...pt }) => {
      void ptQuestions;
      return pt;
    }),
    placement_test_questions: filteredPlacement.flatMap((pt) =>
      pt.questions.map((pq) => ({
        id: pq.id,
        placement_test_id: pt.id,
        question_id: pq.question_id,
        sort_order: pq.sort_order,
        skill_weight: pq.skill_weight,
      }))
    ),
    mock_tests: filteredMock.map(({ sections: mtSections, ...mt }) => {
      void mtSections;
      return mt;
    }),
    mock_test_sections: filteredMock.flatMap((mt) =>
      mt.sections.map((s) => ({
        id: s.id,
        mock_test_id: mt.id,
        title: s.title,
        skill_id: s.skill_id,
        sort_order: s.sort_order,
        time_limit_minutes: s.time_limit_minutes,
      }))
    ),
    mock_test_questions: filteredMock.flatMap((mt) =>
      mt.sections.flatMap((s) =>
        s.questions.map((mq) => ({
          id: mq.id,
          mock_test_section_id: s.id,
          question_id: mq.question_id,
          sort_order: mq.sort_order,
          points: mq.points,
        }))
      )
    ),
  };

  return { success: true, data: bundle };
}

export async function importContentBundle(
  json: string
): Promise<ActionResult<{ imported: number }>> {
  await requirePermission("tools.bulk");
  const supabase = await createClient();

  let bundle: BulkExportBundle;
  try {
    bundle = JSON.parse(json) as BulkExportBundle;
  } catch {
    return { success: false, error: "Invalid JSON" };
  }

  if (bundle.version !== 1) {
    return { success: false, error: "Unsupported export version" };
  }

  let imported = 0;
  const idMap = new Map<string, string>();
  const remap = (oldId: string) => idMap.get(oldId) ?? oldId;

  for (const p of bundle.programs) {
    const { id: oldId, ...rest } = p;
    const { data, error } = await supabase
      .from("programs")
      .insert({ ...rest, settings: rest.settings as Json })
      .select("id")
      .single();
    if (error) return { success: false, error: `Program: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const l of bundle.levels) {
    const { id: oldId, program_id, ...rest } = l;
    const { data, error } = await supabase
      .from("levels")
      .insert({ ...rest, program_id: remap(program_id) })
      .select("id")
      .single();
    if (error) return { success: false, error: `Level: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const s of bundle.skills) {
    const { id: oldId, level_id, ...rest } = s;
    const { data, error } = await supabase
      .from("skills")
      .insert({ ...rest, level_id: remap(level_id) })
      .select("id")
      .single();
    if (error) return { success: false, error: `Skill: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const u of bundle.units) {
    const { id: oldId, skill_id, unlock_after_unit_id, ...rest } = u;
    const { data, error } = await supabase
      .from("units")
      .insert({
        ...rest,
        skill_id: remap(skill_id),
        unlock_after_unit_id: unlock_after_unit_id
          ? remap(unlock_after_unit_id)
          : null,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Unit: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const l of bundle.lessons) {
    const { id: oldId, unit_id, unlock_after_lesson_id, ...rest } = l;
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        ...rest,
        unit_id: remap(unit_id),
        unlock_after_lesson_id: unlock_after_lesson_id
          ? remap(unlock_after_lesson_id)
          : null,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Lesson: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const e of bundle.exercises) {
    const { id: oldId, lesson_id, content, metadata, ...rest } = e;
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        ...rest,
        lesson_id: remap(lesson_id),
        content: content as Json,
        metadata: (metadata ?? {}) as Json,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Exercise: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const q of bundle.questions) {
    const { id: oldId, exercise_id, content, ...rest } = q;
    const { data, error } = await supabase
      .from("questions")
      .insert({
        ...rest,
        exercise_id: remap(exercise_id),
        content: content as Json,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Question: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  if (bundle.choices.length > 0) {
    const { error } = await supabase.from("choices").insert(
      bundle.choices.map((c) => ({
        question_id: remap(c.question_id),
        text: c.text,
        is_correct: c.is_correct,
        sort_order: c.sort_order,
      }))
    );
    if (error) return { success: false, error: `Choices: ${error.message}` };
    imported += bundle.choices.length;
  }

  if (bundle.question_pairs.length > 0) {
    const { error } = await supabase.from("question_pairs").insert(
      bundle.question_pairs.map((p) => ({
        question_id: remap(p.question_id),
        left_text: p.left_text,
        right_text: p.right_text,
        sort_order: p.sort_order,
      }))
    );
    if (error) return { success: false, error: `Pairs: ${error.message}` };
    imported += bundle.question_pairs.length;
  }

  for (const pt of bundle.placement_tests) {
    const { id: oldId, program_id, settings, ...rest } = pt;
    const { data, error } = await supabase
      .from("placement_tests")
      .insert({
        ...rest,
        program_id: remap(program_id),
        settings: (settings ?? {}) as Json,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Placement test: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const pq of bundle.placement_test_questions) {
    const { error } = await supabase.from("placement_test_questions").insert({
      placement_test_id: remap(pq.placement_test_id),
      question_id: remap(pq.question_id),
      sort_order: pq.sort_order,
      skill_weight: pq.skill_weight as Json,
    });
    if (error) return { success: false, error: `Placement question: ${error.message}` };
    imported++;
  }

  for (const mt of bundle.mock_tests) {
    const { id: oldId, program_id, level_id, settings, ...rest } = mt;
    const { data, error } = await supabase
      .from("mock_tests")
      .insert({
        ...rest,
        program_id: remap(program_id),
        level_id: level_id ? remap(level_id) : null,
        settings: (settings ?? {}) as Json,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Mock test: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const s of bundle.mock_test_sections) {
    const { id: oldId, mock_test_id, skill_id, ...rest } = s;
    const { data, error } = await supabase
      .from("mock_test_sections")
      .insert({
        ...rest,
        mock_test_id: remap(mock_test_id),
        skill_id: skill_id ? remap(skill_id) : null,
      })
      .select("id")
      .single();
    if (error) return { success: false, error: `Mock section: ${error.message}` };
    idMap.set(oldId, data.id);
    imported++;
  }

  for (const mq of bundle.mock_test_questions) {
    const { error } = await supabase.from("mock_test_questions").insert({
      mock_test_section_id: remap(mq.mock_test_section_id),
      question_id: remap(mq.question_id),
      sort_order: mq.sort_order,
      points: mq.points,
    });
    if (error) return { success: false, error: `Mock question: ${error.message}` };
    imported++;
  }

  await revalidateAdmin();
  return { success: true, data: { imported } };
}
