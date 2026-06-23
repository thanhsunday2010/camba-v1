#!/usr/bin/env node
/**
 * Verify a student can read mock-test questions (RLS) after seed + migration.
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

  const { data: sections } = await admin
    .from("mock_test_sections")
    .select("id")
    .eq("mock_test_id", MOCK_TEST_ID);

  const sectionIds = (sections ?? []).map((s) => s.id);
  const { data: junction } = await admin
    .from("mock_test_questions")
    .select("question_id")
    .in("mock_test_section_id", sectionIds);

  const questionIds = (junction ?? []).map((j) => j.question_id);
  console.log(`Admin: ${questionIds.length} junction question(s) for Starters T1`);

  const { error: signInError } = await student.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (signInError) {
    console.warn(`Could not sign in as ${TEST_EMAIL}: ${signInError.message}`);
    console.warn("Run: npm run seed:test-users");
  }

  const { data: readable, error: readError } = await student
    .from("questions")
    .select("id")
    .in("id", questionIds.slice(0, 5));

  if (readError) {
    console.error("Student read error:", readError.message);
    process.exit(1);
  }

  console.log(`Student can read ${readable?.length ?? 0} / ${Math.min(5, questionIds.length)} sample question(s)`);

  if ((readable?.length ?? 0) === 0 && questionIds.length > 0) {
    console.error("✗ RLS still blocking mock questions — apply migration 011.");
    process.exit(1);
  }

  console.log("✓ Mock test question access OK.");
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
