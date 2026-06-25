import { headers } from "next/headers";
import { getAppUrl } from "@/lib/env";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";

/** Origin of the current request — avoids hardcoding localhost when using LAN IP or another port. */
export async function getRequestOrigin(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  if (host) {
    const forwardedProto = headersList.get("x-forwarded-proto");
    const protocol =
      forwardedProto ??
      (host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
    return `${protocol}://${host}`.replace(/\/$/, "");
  }

  return getAppUrl();
}

export async function getAuthCallbackUrl(nextPath?: string | null): Promise<string> {
  const origin = await getRequestOrigin();
  const url = new URL("/auth/callback", origin);
  const safeNext = sanitizeRedirectPath(nextPath);
  if (safeNext) {
    url.searchParams.set("next", safeNext);
  }
  return url.toString();
}

export function withLocalePath(path: string, locale: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) {
    return normalized;
  }
  return `/${locale}${normalized}`;
}
