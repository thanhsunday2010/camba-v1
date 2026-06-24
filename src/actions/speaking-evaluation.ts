"use server";

import { storeSpeakingAudioSubmission } from "@/lib/speaking/speaking-audio-storage";
import type { ActionResult } from "@/types";

export async function uploadSpeakingRecording(
  audioBase64: string,
  mimeType: string,
  durationSeconds: number,
  questionId?: string
): Promise<
  ActionResult<{
    submissionId: string;
    audioRef: string;
    mimeType: string;
    durationSeconds: number;
  }>
> {
  try {
    const stored = await storeSpeakingAudioSubmission({
      audioBase64,
      mimeType,
      durationSeconds,
      questionId,
    });
    return { success: true, data: stored };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
