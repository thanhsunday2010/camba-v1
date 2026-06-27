"use client";

import { signOut } from "@/actions/auth";
import { useTranslations } from "next-intl";
import { LogOut, Mail } from "lucide-react";
import { ProfileForm } from "@/components/settings/profile-form";
import { SettingsChangePasswordForm } from "@/components/settings/settings-change-password-form";
import { Button } from "@/components/ui/button";

interface SettingsAccountSectionProps {
  email: string;
  fullName: string;
}

export function SettingsAccountSection({ email, fullName }: SettingsAccountSectionProps) {
  const t = useTranslations("settings");
  const tn = useTranslations("nav");

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-gray-700">{t("emailLabel")}</p>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600 max-w-md">
          <Mail className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{email}</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{t("profileTitle")}</p>
        <ProfileForm fullName={fullName} saveLabel={t("saveProfile")} nameLabel={t("fullName")} />
      </div>

      <div className="space-y-2 border-t border-gray-100 pt-6">
        <p className="text-sm font-medium text-gray-700">{t("changePasswordTitle")}</p>
        <p className="text-sm text-gray-500">{t("changePasswordSubtitle")}</p>
        <SettingsChangePasswordForm />
      </div>

      <div className="border-t border-gray-100 pt-6">
        <form action={signOut}>
          <Button type="submit" variant="outline" className="gap-2 text-error hover:text-error">
            <LogOut className="h-4 w-4" />
            {tn("logout")}
          </Button>
        </form>
      </div>
    </div>
  );
}
