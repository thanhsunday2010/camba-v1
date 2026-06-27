"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateJsonResponse, generateJsonWithAudio } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  PRACTICE_PROMPT_SYSTEM,
  PRACTICE_SPEAKING_FEEDBACK_SYSTEM,
  PRACTICE_WRITING_FEEDBACK_SYSTEM,
  buildPracticePromptRequest,
  buildPracticeSpeakingFeedbackRequest,
  buildPracticeWritingFeedbackRequest,
} from "@/lib/ai/prompts/ai-practice";
import { finalizeSpeakingTranscript } from "@/lib/ai/learner-level-guidance";
import {
  buildPracticeSubmitMeta,
  fetchRecurringErrorsForUser,
  getPracticeProgressViewModel,
} from "@/lib/ai-practice/practice-analytics";
import type { PracticeSubmitMeta, PracticeProgressViewModel } from "@/lib/ai-practice/practice-enhancement-types";
import { PracticeProfileSchema } from "@/lib/ai-practice/practice-types";
import type { PracticeProfile, PracticeSkill } from "@/lib/ai-practice/practice-types";
import {
  PracticePromptSchema,
  PracticeSpeakingFeedbackSchema,
  PracticeWritingFeedbackSchema,
} from "@/types/ai";
import type {
  PracticePromptResult,
  PracticeSpeakingFeedback,
  PracticeWritingFeedback,
} from "@/types/ai";
import { ZodError } from "zod";
import type { ActionResult } from "@/types";
import { saveAiFeedback } from "@/actions/ai/_shared";
import { assertAiUsageAllowed, recordSuccessfulAiUsage } from "@/lib/subscriptions/assert-ai-usage";
import {
  AI_SPEAKING_DURATION_LIMIT_ERROR,
  AI_WRITING_MAX_WORDS,
  AI_WRITING_WORD_LIMIT_ERROR,
  countWords,
  isWithinSpeakingDurationLimit,
} from "@/lib/ai/ai-input-limits";

export type PracticeWritingResult = PracticeWritingFeedback & { meta: PracticeSubmitMeta };
export type PracticeSpeakingResult = PracticeSpeakingFeedback & { meta: PracticeSubmitMeta };

function revalidatePracticePaths(skill: "writing" | "speaking") {
  revalidatePath("/dashboard");
  revalidatePath(`/practice/${skill}`);
  revalidatePath(`/practice/${skill}/session`);
}

function mapAiPracticeError(error: unknown): string {
  if (error instanceof ZodError) {
    return "AI trả về dữ liệu không hợp lệ. Vui lòng thử lại.";
  }
  const message = error instanceof Error ? error.message : "AI processing failed";
  if (message.includes("GOOGLE_GEMINI_API_KEY")) {
    return "Chưa cấu hình API Gemini. Thêm GOOGLE_GEMINI_API_KEY vào môi trường.";
  }
  if (message.includes("timed out")) {
    return "AI phản hồi quá lâu. Vui lòng thử lại.";
  }
  return message;
}

export async function generatePracticePrompt(
  profileInput: PracticeProfile,
  previousPrompts: string[] = [],
  options?: { focusFixHint?: string }
): Promise<ActionResult<PracticePromptResult>> {
  const parsed = PracticeProfileSchema.safeParse(profileInput);
  if (!parsed.success) {
    return { success: false, error: "Thông tin luyện tập không hợp lệ." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

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
    const recurringErrors = await fetchRecurringErrorsForUser(user.id, parsed.data.skill);
    const rawJson = await generateJsonResponse(
      PRACTICE_PROMPT_SYSTEM,
      buildPracticePromptRequest(parsed.data, previousPrompts, {
        recurringErrors,
        focusFixHint: options?.focusFixHint,
      })
    );
    const prompt = parseGeminiJson(rawJson, PracticePromptSchema);
    await recordSuccessfulAiUsage(user.id);
    return { success: true, data: prompt };
  } catch (error) {
    return { success: false, error: mapAiPracticeError(error) };
  }
}

export async function getPracticeProgress(
  skill: PracticeSkill
): Promise<PracticeProgressViewModel | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return getPracticeProgressViewModel(user.id, skill);
}

export async function submitStandaloneWritingPractice(
  profileInput: PracticeProfile,
  prompt: string,
  content: string,
  options?: {
    outline?: string;
    attemptNumber?: number;
    focusFixHint?: string;
    previousBest?: number | null;
    previousAttemptScore?: number | null;
  }
): Promise<ActionResult<PracticeWritingResult>> {
  const parsed = PracticeProfileSchema.safeParse(profileInput);
  if (!parsed.success) {
    return { success: false, error: "Thông tin luyện tập không hợp lệ." };
  }

  if (!content.trim()) {
    return { success: false, error: "Nội dung bài viết không được để trống." };
  }

  if (countWords(content) > AI_WRITING_MAX_WORDS) {
    return { success: false, error: AI_WRITING_WORD_LIMIT_ERROR };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

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
        exercise_id: null,
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
      PRACTICE_WRITING_FEEDBACK_SYSTEM,
      buildPracticeWritingFeedbackRequest(parsed.data, prompt, content, {
        outline: options?.outline,
        attemptNumber: options?.attemptNumber,
        focusFixHint: options?.focusFixHint,
      })
    );

    const feedback = parseGeminiJson(rawJson, PracticeWritingFeedbackSchema);

    await recordSuccessfulAiUsage(user.id);

    await saveAiFeedback({
      feedbackType: "writing",
      referenceType: "writing_submission",
      referenceId: submission.id,
      inputData: {
        profile: parsed.data,
        prompt,
        content,
        wordCount,
        outline: options?.outline,
        attemptNumber: options?.attemptNumber,
        standalone: true,
      },
      responseData: feedback as unknown as Record<string, unknown>,
      shieldEstimate: feedback.shieldEstimate as Record<string, unknown>,
    });

    const meta = await buildPracticeSubmitMeta(
      user.id,
      "writing",
      parsed.data.level,
      feedback.overallScore,
      options?.previousBest ?? null,
      options?.previousAttemptScore ?? null,
      0
    );

    revalidatePracticePaths("writing");

    return { success: true, data: { ...feedback, meta } };
  } catch (error) {
    return { success: false, error: mapAiPracticeError(error) };
  }
}

export async function submitStandaloneSpeakingPractice(
  profileInput: PracticeProfile,
  prompt: string,
  audioBase64: string,
  mimeType: string,
  durationSeconds: number,
  clientTranscript?: string,
  options?: {
    attemptNumber?: number;
    focusFixHint?: string;
    previousBest?: number | null;
    previousAttemptScore?: number | null;
  }
): Promise<ActionResult<PracticeSpeakingResult>> {
  const parsed = PracticeProfileSchema.safeParse(profileInput);
  if (!parsed.success) {
    return { success: false, error: "Thông tin luyện tập không hợp lệ." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

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
    const filePath = `${user.id}/practice-${Date.now()}.webm`;
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
      PRACTICE_SPEAKING_FEEDBACK_SYSTEM,
      buildPracticeSpeakingFeedbackRequest(parsed.data, prompt, clientTranscript, {
        attemptNumber: options?.attemptNumber,
        focusFixHint: options?.focusFixHint,
      }),
      audioBase64,
      mimeType
    );

    const parsedFeedback = parseGeminiJson(rawJson, PracticeSpeakingFeedbackSchema);
    const feedback = {
      ...parsedFeedback,
      transcript: finalizeSpeakingTranscript(parsedFeedback, clientTranscript),
    };

    await recordSuccessfulAiUsage(user.id);

    const { data: submission, error: subError } = await supabase
      .from("speaking_submissions")
      .insert({
        user_id: user.id,
        exercise_id: null,
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
        profile: parsed.data,
        prompt,
        durationSeconds,
        clientTranscript,
        attemptNumber: options?.attemptNumber,
        standalone: true,
      },
      responseData: feedback as unknown as Record<string, unknown>,
      shieldEstimate: feedback.shieldEstimate as Record<string, unknown>,
    });

    const meta = await buildPracticeSubmitMeta(
      user.id,
      "speaking",
      parsed.data.level,
      feedback.overallScore,
      options?.previousBest ?? null,
      options?.previousAttemptScore ?? null,
      durationSeconds
    );

    revalidatePracticePaths("speaking");

    return { success: true, data: { ...feedback, meta } };
  } catch (error) {
    return { success: false, error: mapAiPracticeError(error) };
  }
}
