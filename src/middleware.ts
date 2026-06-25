import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import type { SupportedLocale } from "@/lib/constants";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = [
  "/dashboard",
  "/learning",
  "/mock-tests",
  "/achievements",
  "/journey",
  "/profile",
  "/settings",
  "/admin",
  "/placement-test",
  "/practice",
  "/parent",
  "/teacher",
];
const authRoutes = ["/login", "/register", "/forgot-password"];

function getLocaleFromPathname(pathname: string): SupportedLocale {
  const segment = pathname.split("/")[1];
  if (routing.locales.includes(segment as SupportedLocale)) {
    return segment as SupportedLocale;
  }
  return routing.defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/auth/callback")) {
    return supabaseResponse;
  }

  const locale = getLocaleFromPathname(pathname);

  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en|zh|ja|ko)/, "") || "/";

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("redirect", pathnameWithoutLocale);
    return Response.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return Response.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  const intlResponse = intlMiddleware(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|audio/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp3|wav|webm|m4a|ogg)$).*)",
  ],
};
