"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  STUDY_COACH_SYSTEM,
  buildStudyCoachPrompt,
} from "@/lib/ai/prompts/study-coach";
import { StudyCoachSchema } from "@/types/ai";
import type { StudyCoachResponse } from "@/types/ai";
import type { ActionResult } from "@/types";
import { saveAiFeedback } from "./_shared";
import { getSessionUser } from "@/lib/auth/session";
import type { Json } from "@/types/database";

export async function getStudyCoachPlan(): Promise<ActionResult<StudyCoachResponse>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const { data: streak } = await supabase
      .from("user_streaks")
      .select("current_streak")
      .eq("user_id", user.id)
      .single();

    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("completion_percent, accuracy_percent, mastery_level")
      .eq("user_id", user.id);

    const completedLessons =
      progress?.filter((p) => Number(p.completion_percent) >= 100).length ?? 0;

    const recentAccuracies = (progress ?? [])
      .filter((p) => Number(p.accuracy_percent) > 0)
      .map((p) => Number(p.accuracy_percent));
    const recentAccuracy =
      recentAccuracies.length > 0
        ? Math.round(recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length)
        : 0;

    let levelName = "Chưa xác định";
    if (gamification?.current_level_id) {
      const { data: level } = await supabase
        .from("levels")
        .select("name")
        .eq("id", gamification.current_level_id)
        .single();
      levelName = level?.name ?? levelName;
    }

    const rawJson = await generateJsonResponse(
      STUDY_COACH_SYSTEM,
      buildStudyCoachPrompt({
        studentName: profile?.full_name ?? "Học sinh",
        currentLevel: levelName,
        totalXp: gamification?.total_xp ?? 0,
        streak: streak?.current_streak ?? 0,
        recentAccuracy,
        completedLessons,
        weakSkills: [],
      })
    );

    const coach = parseGeminiJson(rawJson, StudyCoachSchema);

    await saveAiFeedback({
      feedbackType: "study_coach",
      referenceType: "study_coach",
      referenceId: user.id,
      inputData: { levelName, recentAccuracy, completedLessons },
      responseData: coach as unknown as Record<string, unknown>,
    });

    for (const action of coach.suggestedActions.slice(0, 3)) {
      await supabase.from("learning_recommendations").insert({
        user_id: user.id,
        recommendation_type: action.type,
        title: action.title,
        description: action.description,
        priority: 10,
        metadata: {} as Json,
      });
    }

    revalidatePath("/dashboard");

    return { success: true, data: coach };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI coach failed";
    return { success: false, error: message };
  }
}

export async function getLatestStudyCoach(
  userId?: string
): Promise<StudyCoachResponse | null> {
  const resolvedUserId = userId ?? (await getSessionUser())?.id;
  if (!resolvedUserId) return null;

  const supabase = await createClient();

  const { data } = await supabase
    .from("ai_feedback")
    .select("response_data, created_at")
    .eq("user_id", resolvedUserId)
    .eq("feedback_type", "study_coach")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;

  try {
    return StudyCoachSchema.parse(data.response_data);
  } catch {
    return null;
  }
}
