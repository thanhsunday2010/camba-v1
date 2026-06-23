#!/usr/bin/env node
/**
 * Simulate mock test submit server-side: score + insert attempt.
 */

import { createClient } from "@supabase/supabase-js";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv, loadEnvFile } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MOCK_TEST_ID = "02000001-0000-4000-8000-000000000001";
const TEST_EMAIL = "student@camba.me";
const TEST_PASSWORD = "camba123";

async function main() {
  loadEnvFile(resolve(ROOT, ".env.local"));
  const { url, key: serviceKey } = createSupabaseFromEnv(ROOT);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!anonKey) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const student = createClient(url, anonKey, { auth: { persistSession: false } });

  const { data: auth, error: signInError } = await student.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (signInError) throw new Error(`Sign in failed: ${signInError.message}`);
  const userId = auth.user.id;
  console.log("Signed in as", TEST_EMAIL);

  const { data: test } = await admin
    .from("mock_tests")
    .select("id, level_id")
    .eq("id", MOCK_TEST_ID)
    .single();

  const { data: sections } = await admin
    .from("mock_test_sections")
    .select("id")
    .eq("mock_test_id", MOCK_TEST_ID);

  const sectionIds = (sections ?? []).map((s) => s.id);
  const { data: junction } = await admin
    .from("mock_test_questions")
    .select("question_id, points")
    .in("mock_test_section_id", sectionIds);

  const questionIds = (junction ?? []).map((j) => j.question_id);
  console.log(`Test has ${questionIds.length} questions`);

  const { data: questions, error: qErr } = await student
    .from("questions")
    .select("id, points")
    .in("id", questionIds.slice(0, 3));

  if (qErr) {
    console.error("Student cannot read questions:", qErr.message);
    process.exit(1);
  }
  console.log(`Student can read ${questions?.length ?? 0} sample questions`);

  const answers = {};
  for (const q of questions ?? []) {
    answers[q.id] = { type: "single", choiceId: "00000000-0000-0000-0000-000000000000" };
  }

  const score = 0;
  const maxScore = (questions ?? []).reduce((s, q) => s + (q.points ?? 1), 0);

  const { data: inserted, error: insertError } = await student.from("mock_test_attempts").insert({
    user_id: userId,
    mock_test_id: MOCK_TEST_ID,
    score,
    max_score: maxScore,
    estimated_level_id: test?.level_id ?? null,
    shield_estimate: { listening: 5 },
    skill_breakdown: { listening: 50 },
    answers,
    time_spent_seconds: 120,
    is_completed: true,
    completed_at: new Date().toISOString(),
  }).select("id").single();

  if (insertError) {
    console.error("INSERT failed:", insertError.message, insertError.code, insertError.details);
    process.exit(1);
  }

  console.log("INSERT OK, attempt id:", inserted.id);

  await admin.from("mock_test_attempts").delete().eq("id", inserted.id);
  console.log("Cleaned up test attempt.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
