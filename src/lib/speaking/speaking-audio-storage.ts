import { createClient } from "@/lib/supabase/server";
import { requireSessionUser } from "@/lib/auth/session";
import {
  validateSpeakingAudioInput,
  normalizeSpeakingMimeType,
} from "@/lib/speaking/speaking-submission";
import { randomUUID } from "node:crypto";

export type StoredSpeakingAudio = {
  submissionId: string;
  audioRef: string;
  mimeType: string;
  durationSeconds: number;
};

export async function storeSpeakingAudioSubmission(input: {
  audioBase64: string;
  mimeType: string;
  durationSeconds: number;
  questionId?: string;
}): Promise<StoredSpeakingAudio> {
  const user = await requireSessionUser();
  const supabase = await createClient();

  const buffer = Buffer.from(input.audioBase64, "base64");
  const mimeType = normalizeSpeakingMimeType(input.mimeType);

  const issues = validateSpeakingAudioInput({
    mimeType,
    durationSeconds: input.durationSeconds,
    byteLength: buffer.byteLength,
  });
  if (issues.length > 0) {
    throw new Error(issues.map((i) => i.message).join("; "));
  }

  const submissionId = randomUUID();
  const ext = mimeType.includes("wav") ? "wav" : mimeType.includes("mpeg") || mimeType.includes("mp3") ? "mp3" : "webm";
  const audioRef = `${user.id}/${submissionId}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("speaking-audio")
    .upload(audioRef, buffer, { contentType: mimeType, upsert: false });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return {
    submissionId,
    audioRef,
    mimeType,
    durationSeconds: input.durationSeconds,
  };
}

export async function loadSpeakingAudioBase64(audioRef: string): Promise<string> {
  const user = await requireSessionUser();
  const supabase = await createClient();

  if (!audioRef.startsWith(`${user.id}/`)) {
    throw new Error("Unauthorized audio access");
  }

  const { data, error } = await supabase.storage.from("speaking-audio").download(audioRef);
  if (error || !data) {
    throw new Error(error?.message ?? "Failed to download audio");
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  return buffer.toString("base64");
}
