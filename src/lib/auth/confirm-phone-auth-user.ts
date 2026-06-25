import { createServiceClient } from "@/lib/supabase/server";
import type { ResolvedAuthIdentity } from "@/lib/auth/identity";

export function isEmailNotConfirmedError(error: {
  message?: string;
  code?: string;
}): boolean {
  const message = error.message?.toLowerCase() ?? "";
  return error.code === "email_not_confirmed" || message.includes("email not confirmed");
}

async function resolvePhoneAuthUserId(
  identity: Extract<ResolvedAuthIdentity, { ok: true }>
): Promise<string | null> {
  if (identity.method !== "phone") {
    return null;
  }

  const supabase = await createServiceClient();

  if (identity.phone) {
    const { data: byPhone } = await supabase
      .from("profiles")
      .select("id")
      .eq("phone", identity.phone)
      .maybeSingle();

    if (byPhone?.id) {
      return byPhone.id;
    }
  }

  const { data: byEmail } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", identity.authEmail)
    .maybeSingle();

  return byEmail?.id ?? null;
}

export async function confirmPhoneAuthUser(userId: string): Promise<boolean> {
  const supabase = await createServiceClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  return !error;
}

export async function confirmPhoneAuthUserForIdentity(
  identity: Extract<ResolvedAuthIdentity, { ok: true }>
): Promise<boolean> {
  if (identity.method !== "phone") {
    return false;
  }

  const userId = await resolvePhoneAuthUserId(identity);
  if (!userId) {
    return false;
  }

  return confirmPhoneAuthUser(userId);
}
