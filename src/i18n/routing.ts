import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/lib/constants";

export const routing = defineRouting({
  locales: [...SUPPORTED_LOCALES],
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
