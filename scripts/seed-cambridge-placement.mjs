#!/usr/bin/env node
/**
 * Seed Cambridge English placement test for the active Supabase project.
 *
 * DISABLED: Cambridge placement is held until full curriculum content is ready.
 * Sets is_active=false on the seeded test. Re-enable via admin when content is complete.
 *
 * Usage: npm run seed:cambridge-placement
 */

import { createClient } from "@supabase/supabase-js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const PROGRAM_ID = "a0000000-0000-4000-8000-000000000001";
const PLACEMENT_TEST_ID = "a0000000-0000-4010-8000-000000000001";

const STARTERS_UNIT1_LESSONS = {
  vocabulary: "e2000001-0000-4000-8000-000000000001",
  grammar: "e2000001-0000-4000-8000-000000000002",
  reading: "e2000001-0000-4000-8000-000000000003",
  listening: "e2000001-0000-4000-8000-000000000004",
  writing: "e2000001-0000-4000-8000-000000000005",
  speaking: "e2000001-0000-4000-8000-000000000006",
};

const SKILL_WEIGHTS = [
  { lessonKey: "vocabulary", weight: { vocabulary: 1 } },
  { lessonKey: "vocabulary", weight: { vocabulary: 1 } },
  { lessonKey: "grammar", weight: { grammar: 1 } },
  { lessonKey: "grammar", weight: { grammar: 1 } },
  { lessonKey: "reading", weight: { reading: 1 } },
  { lessonKey: "reading", weight: { reading: 1 } },
  { lessonKey: "listening", weight: { listening: 1 } },
  { lessonKey: "writing", weight: { writing: 1 } },
];

async function pickQuestionsFromLessons(supabase, lessonIds) {
  const { data: exercises } = await supabase
    .from("exercises")
    .select("id, lesson_id, questions(id, sort_order)")
    .in("lesson_id", lessonIds)
    .eq("status", "published")
    .eq("is_active", true)
    .order("sort_order");

  const byLesson = new Map();
  for (const exercise of exercises ?? []) {
    if (!byLesson.has(exercise.lesson_id)) byLesson.set(exercise.lesson_id, []);
    const sorted = [...(exercise.questions ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    );
    for (const q of sorted) {
      byLesson.get(exercise.lesson_id).push(q.id);
    }
  }

  const picked = [];
  const used = new Set();

  for (const { lessonKey } of SKILL_WEIGHTS) {
    const lessonId = STARTERS_UNIT1_LESSONS[lessonKey];
    const pool = byLesson.get(lessonId) ?? [];
    const questionId = pool.find((id) => !used.has(id));
    if (questionId) {
      used.add(questionId);
      picked.push(questionId);
    }
  }

  return picked;
}

async function main() {
  const { url, key } = createSupabaseFromEnv(rootDir);
  const supabase = createClient(url, key);

  const lessonIds = Object.values(STARTERS_UNIT1_LESSONS);
  let questionIds = await pickQuestionsFromLessons(supabase, lessonIds);

  if (questionIds.length === 0) {
    const { data: fallback } = await supabase.from("questions").select("id").limit(8);
    questionIds = (fallback ?? []).map((q) => q.id);
  }

  if (questionIds.length === 0) {
    console.error(
      "Không tìm thấy câu hỏi trong DB. Hãy seed nội dung trước (npm run seed:starters-unit-01)."
    );
    process.exit(1);
  }

  const { error: testError } = await supabase.from("placement_tests").upsert(
    {
      id: PLACEMENT_TEST_ID,
      program_id: PROGRAM_ID,
      title: "Cambridge English Placement Test",
      description:
        "Đánh giá trình độ Cambridge English — điểm thang Cambridge, shield và gợi ý level",
      question_count: questionIds.length,
      time_limit_minutes: 30,
      is_active: false,
      settings: { test_kind: "cambridge" },
    },
    { onConflict: "id" }
  );

  if (testError) throw new Error(`placement_tests: ${testError.message}`);

  await supabase
    .from("placement_test_questions")
    .delete()
    .eq("placement_test_id", PLACEMENT_TEST_ID);

  const rows = questionIds.map((questionId, index) => ({
    placement_test_id: PLACEMENT_TEST_ID,
    question_id: questionId,
    sort_order: index,
    skill_weight: SKILL_WEIGHTS[index]?.weight ?? { general: 1 },
  }));

  const { error: linkError } = await supabase.from("placement_test_questions").insert(rows);
  if (linkError) throw new Error(`placement_test_questions: ${linkError.message}`);

  await supabase
    .from("placement_tests")
    .update({ question_count: questionIds.length })
    .eq("id", PLACEMENT_TEST_ID);

  console.log(`✓ Cambridge placement test seeded (${questionIds.length} questions)`);
  console.log(`  Test ID: ${PLACEMENT_TEST_ID}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
