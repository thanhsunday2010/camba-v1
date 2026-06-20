"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await resetPassword(formData);
      if (!result.success) {
        setError(result.error ?? tCommon("error"));
      } else {
        setSuccess(true);
      }
    });
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
        <p className="text-gray-700">{t("resetEmailSent")}</p>
        <Link href="/login">
          <Button variant="outline">{t("signIn")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          required
          autoComplete="email"
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        {t("sendResetLink")}
      </Button>

      <p className="text-center text-sm text-gray-600">
        <Link href="/login" className="text-primary font-medium hover:underline">
          {tCommon("back")}
        </Link>
      </p>
    </form>
  );
}
