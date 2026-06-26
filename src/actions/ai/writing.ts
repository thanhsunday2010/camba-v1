"use server";

import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  WRITING_FEEDBACK_SYSTEM,
  buildWritingPrompt,
} from "@/lib/ai/prompts/writing-feedback";
import { ZodError } from "zod";
import { WritingFeedbackSchema } from "@/types/ai";
import type { WritingFeedback, WithGamification } from "@/types/ai";
import type { ActionResult } from "@/types";
import { assertLessonUnlockedForUser, assertExerciseInLesson } from "@/lib/auth/lesson-access";
import { assertAiUsageAllowed } from "@/lib/subscriptions/assert-ai-usage";
import {
  AI_WRITING_MAX_WORDS,
  AI_WRITING_WORD_LIMIT_ERROR,
  countWords,
} from "@/lib/ai/ai-input-limits";
import { completeAiExercise, saveAiFeedback } from "./_shared";
import { generateRecommendationsFromFeedback } from "@/lib/ai/recommendations-engine";

export async function submitWritingForFeedback(
  exerciseId: string,
  lessonId: string,
  prompt: string,
  content: string,
  targetLevel?: string
): Promise<ActionResult<WithGamification<WritingFeedback>>> {
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

  if (!content.trim()) {
    return { success: false, error: "Nội dung bài viết không được để trống" };
  }

  if (countWords(content) > AI_WRITING_MAX_WORDS) {
    return { success: false, error: AI_WRITING_WORD_LIMIT_ERROR };
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
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    const { data: submission, error: subError } = await supabase
      .from("writing_submissions")
      .insert({
        user_id: user.id,
        exercise_id: exerciseId,
        prompt,
        content,
        word_count: wordCount,
      })
      .select("id")
      .single();

    if (subError || !submission) {
      return { success: false, error: subError?.message ?? "Failed to save submission" };
    }

    const rawJson = await generateJsonResponse(
      WRITING_FEEDBACK_SYSTEM,
      buildWritingPrompt(prompt, content, targetLevel)
    );

    const feedback = parseGeminiJson(rawJson, WritingFeedbackSchema);

    await saveAiFeedback({
      feedbackType: "writing",
      referenceType: "writing_submission",
      referenceId: submission.id,
      inputData: { prompt, content, wordCount, targetLevel },
      responseData: feedback as unknown as Record<string, unknown>,
      shieldEstimate: feedback.shieldEstimate as Record<string, unknown>,
    });

    const gamification = await completeAiExercise(
      exerciseId,
      lessonId,
      feedback.overallScore,
      0
    );

    after(async () => {
      try {
        await generateRecommendationsFromFeedback(user.id, feedback.weaknesses ?? []);
      } catch (postError) {
        console.error("Post-writing recommendations failed:", postError);
      }
    });

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
  return message;
}

export async function getWritingFeedbackHistory(limit = 10) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("ai_feedback")
    .select("*")
    .eq("user_id", user.id)
    .eq("feedback_type", "writing")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
