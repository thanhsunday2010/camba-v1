"use server";

import { createClient } from "@/lib/supabase/server";
import { generateJsonWithAudio, GEMINI_MODEL_VERSION } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  SPEAKING_FEEDBACK_SYSTEM,
  buildSpeakingPrompt,
} from "@/lib/ai/prompts/speaking-feedback";
import { SpeakingFeedbackSchema } from "@/types/ai";
import type { SpeakingFeedback } from "@/types/ai";
import type { ActionResult } from "@/types";
import { assertExerciseInLesson, assertLessonUnlockedForUser } from "@/lib/auth/lesson-access";
import { completeAiExercise, saveAiFeedback } from "./_shared";
import { generateRecommendationsFromFeedback } from "@/lib/ai/recommendations-engine";

export async function submitSpeakingForFeedback(
  exerciseId: string,
  lessonId: string,
  prompt: string,
  audioBase64: string,
  mimeType: string,
  durationSeconds: number,
  targetLevel?: string
): Promise<ActionResult<SpeakingFeedback>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const unlockCheck = await assertLessonUnlockedForUser(user.id, lessonId);
  if (!unlockCheck.ok) {
    return { success: false, error: unlockCheck.error };
  }

  const exerciseCheck = await assertExerciseInLesson(exerciseId, lessonId);
  if (!exerciseCheck.ok) {
    return { success: false, error: exerciseCheck.error };
  }

  try {
    const filePath = `${user.id}/${Date.now()}.webm`;
    const audioBuffer = Buffer.from(audioBase64, "base64");

    const { error: uploadError } = await supabase.storage
      .from("speaking-audio")
      .upload(filePath, audioBuffer, { contentType: mimeType, upsert: false });

    let audioUrl = filePath;
    if (!uploadError) {
      const { data: signed, error: signError } = await supabase.storage
        .from("speaking-audio")
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);

      if (!signError && signed?.signedUrl) {
        audioUrl = signed.signedUrl;
      }
    }

    const rawJson = await generateJsonWithAudio(
      SPEAKING_FEEDBACK_SYSTEM,
      buildSpeakingPrompt(prompt, targetLevel),
      audioBase64,
      mimeType
    );

    const feedback = parseGeminiJson(rawJson, SpeakingFeedbackSchema);

    const { data: submission, error: subError } = await supabase
      .from("speaking_submissions")
      .insert({
        user_id: user.id,
        exercise_id: exerciseId,
        prompt,
        audio_url: audioUrl,
        duration_seconds: durationSeconds,
        transcript: feedback.transcript ?? "",
      })
      .select("id")
      .single();

    if (subError || !submission) {
      return { success: false, error: subError?.message ?? "Failed to save submission" };
    }

    await saveAiFeedback({
      feedbackType: "speaking",
      referenceType: "speaking_submission",
      referenceId: submission.id,
      inputData: { prompt, durationSeconds, targetLevel },
      responseData: feedback as unknown as Record<string, unknown>,
      shieldEstimate: feedback.shieldEstimate as Record<string, unknown>,
    });

    await completeAiExercise(exerciseId, lessonId, feedback.overallScore, durationSeconds);
    await generateRecommendationsFromFeedback(user.id, feedback.suggestions.slice(0, 2));

    return { success: true, data: feedback };
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI processing failed";
    return { success: false, error: message };
  }
}

export async function getSpeakingFeedbackHistory(limit = 10) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("ai_feedback")
    .select("*")
    .eq("user_id", user.id)
    .eq("feedback_type", "speaking")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}

export { GEMINI_MODEL_VERSION };
