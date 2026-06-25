"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { loginAction, signInWithGoogle } from "@/actions/login";
import { AuthMethodFields } from "@/components/auth/auth-method-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import type { ActionResult } from "@/types";

function GoogleSignInButton() {
  const t = useTranslations("auth");
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      {t("loginWithGoogle")}
    </Button>
  );
}

export function LoginForm({
  redirectPath,
  authError,
}: {
  redirectPath?: string;
  authError?: string;
}) {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    loginAction,
    null
  );

  const errorMessage =
    state && !state.success
      ? state.error === "phoneInvalid"
        ? t("phoneInvalid")
        : state.error === "emailRequired"
          ? t("emailRequired")
          : (state.error ?? t("invalidCredentials"))
      : authError
        ? authError === "auth_callback_error"
          ? t("authCallbackError")
          : decodeURIComponent(authError)
        : null;

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        {redirectPath && <input type="hidden" name="redirect" value={redirectPath} />}

        <AuthMethodFields defaultMethod="phone" emailAutoComplete="username" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("password")}</Label>
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {errorMessage && (
          <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errorMessage}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {t("login")}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">{t("or")}</span>
        </div>
      </div>

      <form action={signInWithGoogle}>
        {redirectPath && <input type="hidden" name="redirect" value={redirectPath} />}
        <GoogleSignInButton />
      </form>

      <p className="text-center text-sm text-gray-600">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          {t("createAccount")}
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
