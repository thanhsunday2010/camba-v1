"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { updatePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function SettingsChangePasswordForm() {
  const t = useTranslations("auth");
  const ts = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (!result.success) {
        setError(result.error ?? tCommon("error"));
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-3 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="settings-password">{t("newPassword")}</Label>
        <Input
          id="settings-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="settings-confirm-password">{t("confirmPassword")}</Label>
        <Input
          id="settings-confirm-password"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {success && <p className="text-sm text-success">{ts("passwordUpdated")}</p>}
      <Button type="submit" size="sm" disabled={isPending}>
        {isPending && <Loader2 className="animate-spin" />}
        {t("updatePassword")}
      </Button>
    </form>
  );
}
