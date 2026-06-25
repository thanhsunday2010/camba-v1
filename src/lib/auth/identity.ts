const PHONE_AUTH_DOMAIN = "phone.camba.app";

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
  return `${phoneDigits}@${PHONE_AUTH_DOMAIN}`;
}

export function isAuthEmailAddress(email: string): boolean {
  return email.endsWith(`@${PHONE_AUTH_DOMAIN}`);
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
  | { ok: false; errorKey: "phoneInvalid" | "emailRequired" };

export function resolveAuthIdentity(formData: FormData): ResolvedAuthIdentity {
  const method = (formData.get("authMethod") as AuthMethod | null) ?? "phone";

  if (method === "email") {
    const contactEmail = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
    if (!contactEmail) {
      return { ok: false, errorKey: "emailRequired" };
    }
    return { ok: true, method, authEmail: contactEmail, phone: null, contactEmail };
  }

  const phone = normalizePhoneNumber((formData.get("phone") as string | null) ?? "");
  if (!phone) {
    return { ok: false, errorKey: "phoneInvalid" };
  }

  return {
    ok: true,
    method,
    authEmail: phoneToAuthEmail(phone),
    phone,
    contactEmail: null,
  };
}
