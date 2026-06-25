import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function redirectToLogin(nextPath?: string | null): Promise<never> {
  const locale = await getLocale();
  const loginUrl = new URL(`/${locale}/login`, "http://local");
  const safeNext = nextPath?.trim();
  if (safeNext?.startsWith("/") && !safeNext.startsWith("//")) {
    loginUrl.searchParams.set("redirect", safeNext);
  }
  redirect(`${loginUrl.pathname}${loginUrl.search}`);
  throw new Error("Unreachable");
}

export async function redirectToPath(path: string): Promise<never> {
  const locale = await getLocale();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) {
    redirect(normalized);
  }
  redirect(`/${locale}${normalized}`);
  throw new Error("Unreachable");
}
