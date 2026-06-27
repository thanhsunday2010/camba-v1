import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getSiteTextOverrides } from "@/lib/site-copy/overrides";
import { mergeSiteTextOverrides } from "@/lib/site-copy/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  const baseMessages = (await import(`./messages/${locale}.json`)).default;
  const overrides = await getSiteTextOverrides(locale);

  return {
    locale,
    messages: mergeSiteTextOverrides(baseMessages, overrides),
  };
});
