const SHIELD_SKILLS = ["reading", "listening", "speaking", "writing"] as const;

/**
 * Sanitize AI shieldEstimate before Zod validation.
 * Gemini sometimes returns scaleScore below 100 for YLE levels — drop invalid values.
 */
export function normalizeShieldEstimate(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const input = value as Record<string, unknown>;
  const out: Record<string, number> = {};

  for (const key of SHIELD_SKILLS) {
    const n = input[key];
    if (typeof n === "number" && Number.isFinite(n)) {
      out[key] = Math.min(15, Math.max(0, Math.round(n)));
    }
  }

  const scale = input.scaleScore;
  if (typeof scale === "number" && Number.isFinite(scale) && scale >= 100 && scale <= 170) {
    out.scaleScore = Math.round(scale);
  }

  return out;
}
