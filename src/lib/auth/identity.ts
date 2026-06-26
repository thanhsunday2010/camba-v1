const PHONE_AUTH_LOCAL_PREFIX = "phone+";
const PHONE_AUTH_LEGACY_DOMAIN = "phone.camba.app";
const PHONE_AUTH_FALLBACK_DOMAIN = "camba.app";

function resolvePhoneAuthDomain(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) {
    try {
      const hostname = new URL(fromEnv).hostname.toLowerCase();
      if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
        return hostname;
      }
    } catch {
      // fall through to fallback domain
    }
  }

  return PHONE_AUTH_FALLBACK_DOMAIN;
}

/** Digits-only storage: 84901234567 (Vietnam mobile, country code 84). */
export type AuthMethod = "phone" | "email";

export function normalizePhoneNumber(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return null;

  let normalized = digits;
  if (normalized.startsWith("84")) {
    normalized = normalized.slice(2);
  } else if (normalized.startsWith("0")) {
    normalized = normalized.slice(1);
  }

  if (!/^(\d{9})$/.test(normalized)) {
    return null;
  }

  return `84${normalized}`;
}

export function phoneToAuthEmail(phoneDigits: string): string {
  return `${PHONE_AUTH_LOCAL_PREFIX}${phoneDigits}@${resolvePhoneAuthDomain()}`;
}

export function isAuthEmailAddress(email: string): boolean {
  const normalized = email.toLowerCase();
  const at = normalized.lastIndexOf("@");
  if (at <= 0) return false;

  const local = normalized.slice(0, at);
  const domain = normalized.slice(at + 1);

  if (domain === PHONE_AUTH_LEGACY_DOMAIN) {
    return /^\d+$/.test(local);
  }

  if (domain !== resolvePhoneAuthDomain().toLowerCase()) {
    return false;
  }

  return local.startsWith(PHONE_AUTH_LOCAL_PREFIX)
    && /^\d+$/.test(local.slice(PHONE_AUTH_LOCAL_PREFIX.length));
}

export function formatPhoneForDisplay(phoneDigits: string): string {
  if (!phoneDigits.startsWith("84") || phoneDigits.length < 11) {
    return phoneDigits;
  }
  const local = phoneDigits.slice(2);
  return `0${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5)}`;
}

export type ResolvedAuthIdentity =
  | { ok: true; method: AuthMethod; authEmail: string; phone: string | null; contactEmail: string | null }
  | { ok: false; errorKey: "phoneInvalid" | "emailRequired" | "phoneDisabled" };

export function resolveAuthIdentity(formData: FormData): ResolvedAuthIdentity {
  const method = (formData.get("authMethod") as AuthMethod | null) ?? "email";

  if (method === "phone") {
    return { ok: false, errorKey: "phoneDisabled" };
  }

  const contactEmail = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  if (!contactEmail) {
    return { ok: false, errorKey: "emailRequired" };
  }
  return { ok: true, method: "email", authEmail: contactEmail, phone: null, contactEmail };
}
