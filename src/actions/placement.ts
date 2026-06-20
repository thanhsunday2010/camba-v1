"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { scoreExercise } from "@/lib/learning/scoring";
import { estimatePlacementLevel } from "@/lib/learning/mastery";
import {
  computeCambridgeScaleScore,
  computePlacementSkillBreakdown,
  buildPlacementShieldSummary,
} from "@/lib/learning/placement-scoring";
import { mergeSkillShields } from "@/lib/learning/shields";
import { sanitizeQuestionForClient } from "@/lib/learning/sanitize-questions";
import {
  fetchPlacementTestByIdFull,
  fetchPlacementTestsForProgram,
} from "@/lib/queries/learning";
import { onPlacementTestCompleted } from "@/lib/gamification/events";
import { resolveProgramId } from "@/lib/programs/context";
import { getShieldScaleMax } from "@/lib/programs/settings";
import { getSessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type {
  PlacementTestData,
  PlacementTestResult,
  PlacementTestSummary,
  Question,
  UserAnswer,
} from "@/types/learning";

export async function listPlacementTests(programId?: string): Promise<PlacementTestSummary[]> {
  const user = await getSessionUser();
  if (!user) return [];

  const resolvedProgramId = programId ?? (await resolveProgramId(user.id));
  if (!resolvedProgramId) return [];

  return fetchPlacementTestsForProgram(resolvedProgramId);
}

export async function submitPlacementTest(
  testId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<ActionResult<PlacementTestResult>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const test = await fetchPlacementTestByIdFull(testId);
  if (!test || test.questions.length === 0) {
    return { success: false, error: "Placement test not found" };
  }

  const programId = await resolveProgramId(user.id);
  if (!programId) {
    return { success: false, error: "No program selected" };
  }

  const { data: testRow } = await supabase
    .from("placement_tests")
    .select("program_id")
    .eq("id", testId)
    .single();

  if (!testRow || testRow.program_id !== programId) {
    return { success: false, error: "Placement test not found for this program" };
  }

  const result = scoreExercise(test.questions, answers);
  const skillBreakdown = computePlacementSkillBreakdown(test.questions, result.questionResults);
  const maxShields = await getShieldScaleMax(programId);
  const { shieldEstimate, overallShields } = buildPlacementShieldSummary(
    skillBreakdown,
    maxShields
  );
  const cambridgeScaleScore = computeCambridgeScaleScore(result.accuracyPercent);

  const { data: levels } = await supabase
    .from("levels")
    .select("id, slug, sort_order")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("sort_order");

  const suggestedLevelId = estimatePlacementLevel(skillBreakdown, levels ?? []);

  const { error: attemptError } = await supabase.from("placement_test_attempts").insert({
    user_id: user.id,
    placement_test_id: testId,
    score: result.score,
    max_score: result.maxScore,
    estimated_level_id: suggestedLevelId,
    skill_breakdown: skillBreakdown as Json,
    answers: answers as unknown as Json,
    time_spent_seconds: timeSpentSeconds,
    is_completed: true,
    completed_at: new Date().toISOString(),
  });

  if (attemptError) {
    return { success: false, error: attemptError.message };
  }

  if (Object.keys(shieldEstimate).length > 0) {
    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("shield_progress")
      .eq("user_id", user.id)
      .maybeSingle();

    const existing = (gamification?.shield_progress as Record<string, number>) ?? {};
    const merged = mergeSkillShields(existing, shieldEstimate, maxShields);

    await supabase
      .from("user_gamification")
      .update({ shield_progress: merged as Json })
      .eq("user_id", user.id);
  }

  await onPlacementTestCompleted(user.id, testId);

  revalidatePath("/dashboard");
  revalidatePath("/learning");
  revalidatePath("/placement-test");
  revalidatePath(`/placement-test/${testId}`);
  revalidatePath("/mock-tests");

  return {
    success: true,
    data: {
      accuracyPercent: result.accuracyPercent,
      cambridgeScaleScore,
      suggestedLevelId,
      skillBreakdown,
      shieldEstimate,
      overallShields,
    },
  };
}

export async function getPlacementTestData(testId: string): Promise<PlacementTestData | null> {
  const test = await fetchPlacementTestByIdFull(testId);
  if (!test) return null;

  return {
    id: test.id,
    title: test.title,
    description: test.description,
    question_count: test.question_count,
    time_limit_minutes: test.time_limit_minutes,
    questions: test.questions.map((q) => {
      const sanitized = sanitizeQuestionForClient(q as Question);
      return {
        ...sanitized,
        skill_weight: q.skill_weight,
      };
    }),
  };
}
