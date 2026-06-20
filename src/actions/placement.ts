"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { scoreExercise } from "@/lib/learning/scoring";
import { estimatePlacementLevel } from "@/lib/learning/mastery";
import { fetchPlacementTestFull, getPlacementTest, initializeLessonUnlocks } from "@/lib/queries/learning";
import { onPlacementTestCompleted } from "@/lib/gamification/events";
import { resolveProgramId } from "@/lib/programs/context";
import type { ActionResult } from "@/types";
import type { Json } from "@/types/database";
import type { UserAnswer } from "@/types/learning";

export async function submitPlacementTest(
  testId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<ActionResult<{ estimatedLevelId: string | null; score: number }>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const programId = await resolveProgramId(user.id);
  if (!programId) {
    return { success: false, error: "No program selected" };
  }

  const test = await fetchPlacementTestFull(programId);
  if (!test || test.id !== testId) {
    return { success: false, error: "Placement test not found" };
  }

  const result = scoreExercise(test.questions, answers);

  const skillScores: Record<string, number> = {};
  for (const qr of result.questionResults) {
    const question = test.questions.find((q) => q.id === qr.questionId);
    const weights = question?.skill_weight ?? { general: 1 };
    for (const [skill, weight] of Object.entries(weights)) {
      if (!skillScores[skill]) skillScores[skill] = 0;
      skillScores[skill] += (qr.pointsEarned / qr.maxPoints) * (weight as number) * 100;
    }
  }

  const { data: levels } = await supabase
    .from("levels")
    .select("id, slug, sort_order")
    .eq("program_id", programId)
    .eq("is_active", true)
    .order("sort_order");

  const estimatedLevelId = estimatePlacementLevel(skillScores, levels ?? []);

  const { error: attemptError } = await supabase.from("placement_test_attempts").insert({
    user_id: user.id,
    placement_test_id: testId,
    score: result.score,
    max_score: result.maxScore,
    estimated_level_id: estimatedLevelId,
    skill_breakdown: skillScores,
    answers: answers as unknown as Json,
    time_spent_seconds: timeSpentSeconds,
    is_completed: true,
    completed_at: new Date().toISOString(),
  });

  if (attemptError) {
    return { success: false, error: attemptError.message };
  }

  if (estimatedLevelId) {
    await supabase
      .from("user_gamification")
      .update({
        current_program_id: programId,
        current_level_id: estimatedLevelId,
      })
      .eq("user_id", user.id);

    await initializeLessonUnlocks(user.id, estimatedLevelId);
    await onPlacementTestCompleted(user.id, testId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/learning");
  revalidatePath("/placement-test");
  revalidatePath("/mock-tests");

  return {
    success: true,
    data: { estimatedLevelId, score: result.accuracyPercent },
  };
}

export async function completePlacementAndRedirect(
  testId: string,
  answers: Record<string, UserAnswer>,
  timeSpentSeconds: number
): Promise<void> {
  const result = await submitPlacementTest(testId, answers, timeSpentSeconds);
  if (result.success) {
    redirect("/learning");
  }
}

export async function getPlacementTestData(programId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const resolvedProgramId = user
    ? await resolveProgramId(user.id, programId)
    : programId ?? null;

  if (!resolvedProgramId) return null;
  return getPlacementTest(resolvedProgramId);
}
