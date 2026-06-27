import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SiteTextOverrideRow = {
  message_key: string;
  value: string;
  updated_at: string;
};

export const getSiteTextOverrides = cache(
  async (locale: string): Promise<Record<string, string>> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_text_overrides")
      .select("message_key, value")
      .eq("locale", locale);

    if (error || !data) {
      return {};
    }

    return Object.fromEntries(data.map((row) => [row.message_key, row.value]));
  }
);

export const getSiteTextOverrideRows = cache(
  async (locale: string): Promise<SiteTextOverrideRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_text_overrides")
      .select("message_key, value, updated_at")
      .eq("locale", locale)
      .order("message_key");

    if (error || !data) {
      return [];
    }

    return data;
  }
);
