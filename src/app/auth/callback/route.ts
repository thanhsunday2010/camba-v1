import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/auth/roles";
import { sanitizeRedirectPath } from "@/lib/auth/redirect";
import type { UserRole } from "@/types/database";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const safeNext = sanitizeRedirectPath(next);
      if (safeNext) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }

      if (user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id);
        const rolePath = getDashboardPath(
          (roles?.map((r) => r.role) ?? ["student"]) as UserRole[]
        );
        return NextResponse.redirect(`${origin}${rolePath}`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
