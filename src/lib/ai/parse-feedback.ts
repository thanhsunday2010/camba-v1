import type { z } from "zod";
import { normalizeShieldEstimate } from "@/lib/ai/normalize-shield-estimate";

export function parseGeminiJson<T>(raw: string, schema: z.ZodType<T>): T {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  const parsed = JSON.parse(cleaned) as Record<string, unknown>;
  if (parsed.shieldEstimate !== undefined) {
    parsed.shieldEstimate = normalizeShieldEstimate(parsed.shieldEstimate);
  }
  return schema.parse(parsed);
}
