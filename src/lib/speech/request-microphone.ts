export type MicrophoneErrorCode =
  | "insecure_context"
  | "not_supported"
  | "not_allowed"
  | "not_found"
  | "recorder_unsupported"
  | "unknown";

export class MicrophoneAccessError extends Error {
  readonly code: MicrophoneErrorCode;

  constructor(code: MicrophoneErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "MicrophoneAccessError";
    this.code = code;
  }
}

const RECORDER_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
] as const;

export function getSupportedRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return RECORDER_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

export async function requestMicrophoneStream(): Promise<MediaStream> {
  if (typeof window === "undefined") {
    throw new MicrophoneAccessError("not_supported", "Microphone is not available.");
  }

  if (!window.isSecureContext) {
    throw new MicrophoneAccessError(
      "insecure_context",
      "Microphone requires HTTPS or localhost."
    );
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    throw new MicrophoneAccessError(
      "not_supported",
      "This browser does not support microphone capture."
    );
  }

  try {
    return await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (error) {
    if (error instanceof DOMException) {
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        throw new MicrophoneAccessError("not_allowed", "Microphone permission denied.", {
          cause: error,
        });
      }
      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        throw new MicrophoneAccessError("not_found", "No microphone device found.", {
          cause: error,
        });
      }
    }
    throw new MicrophoneAccessError("unknown", "Could not access microphone.", { cause: error });
  }
}

export function createAudioMediaRecorder(stream: MediaStream): MediaRecorder {
  if (typeof MediaRecorder === "undefined") {
    throw new MicrophoneAccessError(
      "recorder_unsupported",
      "This browser does not support audio recording."
    );
  }

  const mimeType = getSupportedRecorderMimeType();
  try {
    return mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  } catch (error) {
    throw new MicrophoneAccessError(
      "recorder_unsupported",
      "This browser does not support audio recording.",
      { cause: error }
    );
  }
}
