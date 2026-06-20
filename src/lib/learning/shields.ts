/** Cambridge default; overridden per program via program_settings.shield_scale_max */
export const DEFAULT_SHIELD_SCALE_MAX = 15;

export function percentToShieldScale(
  percent: number,
  maxShields: number = DEFAULT_SHIELD_SCALE_MAX
): number {
  if (maxShields <= 0) return 0;
  const clampedPercent = Math.min(100, Math.max(0, percent));
  const raw = Math.round((clampedPercent / 100) * maxShields);
  return Math.min(maxShields, Math.max(0, raw));
}

export function mergeSkillShields(
  existing: Record<string, number>,
  incoming: Record<string, number>,
  maxShields: number = DEFAULT_SHIELD_SCALE_MAX
): Record<string, number> {
  const merged = { ...existing };
  for (const [skill, value] of Object.entries(incoming)) {
    const clamped = Math.min(maxShields, Math.max(0, value));
    merged[skill] = Math.max(merged[skill] ?? 0, clamped);
  }
  return merged;
}

export function clampShieldRecord(
  record: Record<string, number>,
  maxShields: number = DEFAULT_SHIELD_SCALE_MAX
): Record<string, number> {
  const clamped: Record<string, number> = {};
  for (const [skill, value] of Object.entries(record)) {
    clamped[skill] = Math.min(maxShields, Math.max(0, value));
  }
  return clamped;
}
