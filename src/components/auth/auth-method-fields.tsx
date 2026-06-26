"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthMethodFieldsProps {
  emailAutoComplete?: "email" | "username";
}

export function AuthMethodFields({ emailAutoComplete = "email" }: AuthMethodFieldsProps) {
  const t = useTranslations("auth");

  return (
    <div className="space-y-2">
      <input type="hidden" name="authMethod" value="email" />
      <Label htmlFor="email">{t("email")}</Label>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="email@example.com"
        required
        autoComplete={emailAutoComplete}
      />
    </div>
  );
}
