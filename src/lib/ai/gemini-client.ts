import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerEnv } from "@/lib/env";

const MODEL = "gemini-2.5-flash";

export function getGeminiModel() {
  const { GOOGLE_GEMINI_API_KEY: apiKey } = getServerEnv();
  if (!apiKey) {
    throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: MODEL,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
  });
}

export type GeminiRetryOptions = {
  maxRetries?: number;
  timeoutMs?: number;
  baseDelayMs?: number;
};

const DEFAULT_RETRY_OPTIONS: Required<GeminiRetryOptions> = {
  maxRetries: 2,
  timeoutMs: 30_000,
  baseDelayMs: 800,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Gemini request timed out")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function generateJsonResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  return generateJsonResponseWithRetry(systemPrompt, userPrompt, { maxRetries: 0 });
}

export async function generateJsonResponseWithRetry(
  systemPrompt: string,
  userPrompt: string,
  options?: GeminiRetryOptions
): Promise<string> {
  const { maxRetries, timeoutMs, baseDelayMs } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const model = getGeminiModel();
      const result = await withTimeout(
        model.generateContent([
          { text: systemPrompt },
          { text: userPrompt },
        ]),
        timeoutMs
      );
      const text = result.response.text();
      if (!text) throw new Error("Empty response from Gemini");
      return text;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Gemini request failed");
      if (attempt < maxRetries) {
        await sleep(baseDelayMs * 2 ** attempt);
      }
    }
  }

  throw lastError ?? new Error("Gemini request failed");
}

export async function generateJsonWithAudio(
  systemPrompt: string,
  userPrompt: string,
  audioBase64: string,
  mimeType: string
): Promise<string> {
  return generateJsonWithAudioWithRetry(systemPrompt, userPrompt, audioBase64, mimeType, {
    maxRetries: 0,
  });
}

export async function generateJsonWithAudioWithRetry(
  systemPrompt: string,
  userPrompt: string,
  audioBase64: string,
  mimeType: string,
  options?: GeminiRetryOptions
): Promise<string> {
  const { maxRetries, timeoutMs, baseDelayMs } = {
    ...DEFAULT_RETRY_OPTIONS,
    timeoutMs: 45_000,
    ...options,
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const model = getGeminiModel();
      const result = await withTimeout(
        model.generateContent([
          { text: systemPrompt },
          { text: userPrompt },
          {
            inlineData: {
              mimeType,
              data: audioBase64,
            },
          },
        ]),
        timeoutMs
      );
      const text = result.response.text();
      if (!text) throw new Error("Empty response from Gemini");
      return text;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Gemini audio request failed");
      if (attempt < maxRetries) {
        await sleep(baseDelayMs * 2 ** attempt);
      }
    }
  }

  throw lastError ?? new Error("Gemini audio request failed");
}

export const GEMINI_MODEL_VERSION = MODEL;
