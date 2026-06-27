"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJsonWithAudio } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  SPEAKING_FEEDBACK_SYSTEM,
  buildSpeakingPrompt,
} from "@/lib/ai/prompts/speaking-feedback";
import {
  finalizeSpeakingTranscript,
  resolveLearnerDeclaredLevelName,
} from "@/lib/ai/learner-level-guidance";
import { SpeakingFeedbackSchema } from "@/types/ai";
import type { SpeakingFeedback, WithGamification } from "@/types/ai";
import { ZodError } from "zod";
import type { ActionResult } from "@/types";
import { assertExerciseInLesson, assertLessonUnlockedForUser } from "@/lib/auth/lesson-access";
import { assertAiUsageAllowed, recordSuccessfulAiUsage } from "@/lib/subscriptions/assert-ai-usage";
import {
  AI_SPEAKING_DURATION_LIMIT_ERROR,
  isWithinSpeakingDurationLimit,
} from "@/lib/ai/ai-input-limits";
import { completeAiExercise, saveAiFeedback } from "./_shared";
import { generateRecommendationsFromFeedback } from "@/lib/ai/recommendations-engine";

export async function submitSpeakingForFeedback(
  exerciseId: string,
  lessonId: string,
  prompt: string,
  audioBase64: string,
  mimeType: string,
  durationSeconds: number,
  targetLevel?: string,
  context?: {
    sceneDescription?: string;
    followUpQuestions?: string[];
    clientTranscript?: string;
    attemptNumber?: number;
    focusFixHint?: string;
  }
): Promise<ActionResult<WithGamification<SpeakingFeedback>>> {
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

  if (!isWithinSpeakingDurationLimit(durationSeconds)) {
    return { success: false, error: AI_SPEAKING_DURATION_LIMIT_ERROR };
  }

  const usageCheck = await assertAiUsageAllowed(user.id);
  if (!usageCheck.success) {
    return {
      success: false,
      error: usageCheck.error,
      code: usageCheck.code,
      limitMeta: usageCheck.limitMeta,
    };
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

    const learnerDeclaredLevel = await resolveLearnerDeclaredLevelName(user.id);

    const rawJson = await generateJsonWithAudio(
      SPEAKING_FEEDBACK_SYSTEM,
      buildSpeakingPrompt(prompt, targetLevel, {
        sceneDescription: context?.sceneDescription,
        followUpQuestions: context?.followUpQuestions,
        learnerDeclaredLevel,
        clientTranscript: context?.clientTranscript,
        attemptNumber: context?.attemptNumber,
        focusFixHint: context?.focusFixHint,
      }),
      audioBase64,
      mimeType
    );

    const parsed = parseGeminiJson(rawJson, SpeakingFeedbackSchema);
    const feedback = {
      ...parsed,
      transcript: finalizeSpeakingTranscript(parsed, context?.clientTranscript),
    };

    await recordSuccessfulAiUsage(user.id);

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
      inputData: {
        prompt,
        durationSeconds,
        targetLevel,
        learnerDeclaredLevel,
        context,
        attemptNumber: context?.attemptNumber,
      },
      responseData: feedback as unknown as Record<string, unknown>,
      shieldEstimate: feedback.shieldEstimate as Record<string, unknown>,
    });

    const isFirstAttempt = (context?.attemptNumber ?? 1) <= 1;
    let gamification: import("@/lib/gamification/gamification-types").ExerciseGamificationSummary | undefined;
    if (isFirstAttempt) {
      try {
        gamification = await completeAiExercise(
          exerciseId,
          lessonId,
          feedback.overallScore,
          durationSeconds
        );
      } catch (completeError) {
        console.error("completeAiExercise failed:", completeError);
      }
    }

    if (isFirstAttempt) {
      after(async () => {
        try {
          await generateRecommendationsFromFeedback(user.id, feedback.suggestions.slice(0, 2));
        } catch (postError) {
          console.error("Post-speaking recommendations failed:", postError);
        }
      });
    }

    return { success: true, data: { ...feedback, gamification } };
  } catch (error) {
    const message = mapAiSubmitError(error);
    return { success: false, error: message };
  }
}

function mapAiSubmitError(error: unknown): string {
  if (error instanceof ZodError) {
    return "AI trả về dữ liệu không hợp lệ. Vui lòng thử gửi lại bài.";
  }
  const message = error instanceof Error ? error.message : "AI processing failed";
  if (message.includes("GOOGLE_GEMINI_API_KEY")) {
    return "Chưa cấu hình API Gemini. Thêm GOOGLE_GEMINI_API_KEY vào .env.local.";
  }
  if (message.includes("Body exceeded") || message.includes("413")) {
    return "File ghi âm quá lớn. Hãy ghi ngắn hơn rồi thử lại.";
  }
  return message;
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
