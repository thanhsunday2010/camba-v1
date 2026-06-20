import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ["/dashboard", "/learning", "/mock-tests", "/profile", "/settings", "/admin", "/placement-test", "/parent", "/teacher"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en|zh|ja|ko)/, "") || "/";

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathnameWithoutLocale === route || pathnameWithoutLocale.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathnameWithoutLocale);
    return Response.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return Response.redirect(new URL("/dashboard", request.url));
  }

  const intlResponse = intlMiddleware(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
