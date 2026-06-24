export const SPEAKING_SUPPORTED_MIME_TYPES = [
  "audio/webm",
  "audio/mp3",
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
] as const;

export type SpeakingSupportedMimeType = (typeof SPEAKING_SUPPORTED_MIME_TYPES)[number];

export const SPEAKING_MAX_DURATION_SECONDS = 180;
export const SPEAKING_MAX_FILE_BYTES = 8 * 1024 * 1024;
export const SPEAKING_EVALUATION_MAX_RETRIES = 2;
export const SPEAKING_EVALUATION_TIMEOUT_MS = 45_000;

export type SpeakingSubmissionValidationIssue = {
  code: string;
  message: string;
};

export function normalizeSpeakingMimeType(mimeType: string): string {
  return mimeType.split(";")[0]?.trim().toLowerCase() ?? "";
}

export function isSupportedSpeakingMimeType(mimeType: string): boolean {
  const normalized = normalizeSpeakingMimeType(mimeType);
  return (SPEAKING_SUPPORTED_MIME_TYPES as readonly string[]).includes(normalized);
}

export function validateSpeakingAudioInput(input: {
  mimeType: string;
  durationSeconds: number;
  byteLength: number;
}): SpeakingSubmissionValidationIssue[] {
  const issues: SpeakingSubmissionValidationIssue[] = [];

  if (!isSupportedSpeakingMimeType(input.mimeType)) {
    issues.push({
      code: "SPEAKING_MIME_UNSUPPORTED",
      message: `Unsupported audio format: ${input.mimeType}`,
    });
  }

  if (input.durationSeconds <= 0) {
    issues.push({ code: "SPEAKING_DURATION_EMPTY", message: "Recording duration is required." });
  }

  if (input.durationSeconds > SPEAKING_MAX_DURATION_SECONDS) {
    issues.push({
      code: "SPEAKING_DURATION_LIMIT",
      message: `Recording exceeds ${SPEAKING_MAX_DURATION_SECONDS} seconds.`,
    });
  }

  if (input.byteLength > SPEAKING_MAX_FILE_BYTES) {
    issues.push({
      code: "SPEAKING_FILE_SIZE",
      message: `Audio file exceeds ${SPEAKING_MAX_FILE_BYTES} bytes.`,
    });
  }

  return issues;
}
