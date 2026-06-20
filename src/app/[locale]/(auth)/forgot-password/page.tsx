import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Link } from "@/i18n/routing";
import { GraduationCap } from "lucide-react";

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");
  const tc = await getTranslations("common");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-primary">
            <GraduationCap className="h-8 w-8" />
            <span className="text-2xl font-bold">{tc("appName")}</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>{t("forgotPasswordTitle")}</CardTitle>
            <CardDescription>{t("forgotPasswordSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ForgotPasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
