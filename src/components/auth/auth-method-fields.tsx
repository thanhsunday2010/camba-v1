"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppTabs } from "@/components/camba/primitives/app-tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthMethod } from "@/lib/auth/identity";

interface AuthMethodFieldsProps {
  defaultMethod?: AuthMethod;
  emailAutoComplete?: "email" | "username";
}

export function AuthMethodFields({
  defaultMethod = "phone",
  emailAutoComplete = "email",
}: AuthMethodFieldsProps) {
  const t = useTranslations("auth");
  const [method, setMethod] = useState<AuthMethod>(defaultMethod);

  return (
    <div className="space-y-3">
      <AppTabs
        tabs={[
          { id: "phone", label: t("phoneTab") },
          { id: "email", label: t("emailTab") },
        ]}
        activeId={method}
        onChange={(id) => setMethod(id as AuthMethod)}
      />
      <input type="hidden" name="authMethod" value={method} />

      {method === "phone" ? (
        <div className="space-y-2">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t("phonePlaceholder")}
            required
          />
          <p className="camba-caption text-muted">{t("phoneHint")}</p>
        </div>
      ) : (
        <div className="space-y-2">
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
      )}
    </div>
  );
}
