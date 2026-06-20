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

export async function generateJsonResponse(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userPrompt },
  ]);
  const text = result.response.text();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

export async function generateJsonWithAudio(
  systemPrompt: string,
  userPrompt: string,
  audioBase64: string,
  mimeType: string
): Promise<string> {
  const model = getGeminiModel();
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userPrompt },
    {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    },
  ]);
  const text = result.response.text();
  if (!text) throw new Error("Empty response from Gemini");
  return text;
}

export const GEMINI_MODEL_VERSION = MODEL;
