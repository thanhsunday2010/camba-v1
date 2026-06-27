"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/actions/admin/_shared";
import { getNestedMessage } from "@/lib/site-copy/messages";
import { routing } from "@/i18n/routing";

export type SiteCopyActionResult = {
  success: boolean;
  error?: string;
};

async function loadBaseMessages(locale: string) {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    throw new Error("Invalid locale");
  }
  return (await import(`@/i18n/messages/${locale}.json`)).default;
}

export async function saveSiteTextOverride(
  locale: string,
  messageKey: string,
  value: string
): Promise<SiteCopyActionResult> {
  try {
    const user = await requireAdmin();
    const trimmedKey = messageKey.trim();
    const trimmedValue = value.trim();

    if (!trimmedKey || !trimmedValue) {
      return { success: false, error: "Key và nội dung không được để trống" };
    }

    const baseMessages = await loadBaseMessages(locale);
    const defaultValue = getNestedMessage(baseMessages, trimmedKey);
    if (defaultValue === null) {
      return { success: false, error: "Không tìm thấy key trong file ngôn ngữ gốc" };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("site_text_overrides").upsert(
      {
        locale,
        message_key: trimmedKey,
        value: trimmedValue,
        updated_by: user.id,
      },
      { onConflict: "locale,message_key" }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
}

export async function resetSiteTextOverride(
  locale: string,
  messageKey: string
): Promise<SiteCopyActionResult> {
  try {
    await requireAdmin();
    const trimmedKey = messageKey.trim();
    if (!trimmedKey) {
      return { success: false, error: "Key không hợp lệ" };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("site_text_overrides")
      .delete()
      .eq("locale", locale)
      .eq("message_key", trimmedKey);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unauthorized",
    };
  }
}

export async function getSiteTextDefaultValue(
  locale: string,
  messageKey: string
): Promise<string | null> {
  await requireAdmin();
  const baseMessages = await loadBaseMessages(locale);
  return getNestedMessage(baseMessages, messageKey.trim());
}
