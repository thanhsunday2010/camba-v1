import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getPublicEnv } from "@/lib/env";
import { getDashboardPath } from "@/lib/auth/roles";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";
import { withLocalePath } from "@/lib/auth/request-origin";
import { DEFAULT_LOCALE } from "@/lib/constants";
import type { Database, UserRole } from "@/types/database";

function applyCookiesToResponse(
  response: NextResponse,
  cookiesToSet: { name: string; value: string; options?: Parameters<NextResponse["cookies"]["set"]>[2] }[]
) {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });
}

async function resolvePostOAuthRedirect(
  supabase: ReturnType<typeof createServerClient<Database>>,
  origin: string,
  next: string | null
): Promise<string> {
  const safeNext = sanitizeRedirectPath(next);
  if (safeNext) {
    return `${origin}${withLocalePath(safeNext, DEFAULT_LOCALE)}`;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const rolePath = getDashboardPath(
      (roles?.map((r) => r.role) ?? ["student"]) as UserRole[]
    );
    return `${origin}${withLocalePath(rolePath, DEFAULT_LOCALE)}`;
  }

  return `${origin}${withLocalePath("/dashboard", DEFAULT_LOCALE)}`;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const oauthError = requestUrl.searchParams.get("error");
  const origin = requestUrl.origin;
  const loginUrl = `${origin}${withLocalePath("/login", DEFAULT_LOCALE)}`;

  if (oauthError) {
    return NextResponse.redirect(`${loginUrl}?error=${encodeURIComponent(oauthError)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${loginUrl}?error=auth_callback_error`);
  }

  const pendingCookies: {
    name: string;
    value: string;
    options?: Parameters<NextResponse["cookies"]["set"]>[2];
  }[] = [];

  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } = getPublicEnv();

  const supabase = createServerClient<Database>(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          pendingCookies.push(...cookiesToSet);
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${loginUrl}?error=${encodeURIComponent(error.message || "auth_callback_error")}`
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { ensureUserBootstrap } = await import("@/lib/auth/provision-user");
    await ensureUserBootstrap(supabase, user.id);
  }

  const redirectUrl = await resolvePostOAuthRedirect(supabase, origin, next);
  const response = NextResponse.redirect(redirectUrl);
  applyCookiesToResponse(response, pendingCookies);
  return response;
}
