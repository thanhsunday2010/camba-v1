"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { updatePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (!result.success) {
        setError(result.error ?? tCommon("error"));
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2000);
      }
    });
  }

  if (success) {
    return (
      <div className="text-center space-y-4 py-4">
        <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
        <p className="text-gray-700">{t("passwordUpdated")}</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        {t("updatePassword")}
      </Button>
    </form>
  );
}
