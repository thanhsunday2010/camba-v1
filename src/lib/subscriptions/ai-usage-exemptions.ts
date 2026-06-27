/**
 * Server-only allowlist for accounts that bypass daily AI limits (demo / QA).
 * Comma-separated emails in AI_UNLIMITED_USER_EMAILS, case-insensitive.
 */
let cachedEmails: Set<string> | null = null;

function normalizeAllowlistEmail(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, "").toLowerCase();
}

export function getAiUnlimitedEmails(): Set<string> {
  if (cachedEmails) return cachedEmails;

  const raw = process.env.AI_UNLIMITED_USER_EMAILS?.trim();
  if (!raw) {
    cachedEmails = new Set();
    return cachedEmails;
  }

  cachedEmails = new Set(
    raw
      .split(/[,;]/)
      .map(normalizeAllowlistEmail)
      .filter(Boolean)
  );
  return cachedEmails;
}

export function isAiUnlimitedEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  return getAiUnlimitedEmails().has(email.trim().toLowerCase());
}

/** @internal Test helper */
export function resetAiUnlimitedEmailsCacheForTests(): void {
  cachedEmails = null;
}
