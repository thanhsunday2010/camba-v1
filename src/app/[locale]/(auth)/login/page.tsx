import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { Link } from "@/i18n/routing";
import { GraduationCap } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const t = await getTranslations("auth");
  const tc = await getTranslations("common");
  const { redirect: redirectPath, error } = await searchParams;

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
            <CardTitle>{t("loginTitle")}</CardTitle>
            <CardDescription>{t("loginSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectPath={redirectPath} authError={error} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
