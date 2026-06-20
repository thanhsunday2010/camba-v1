import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="text-xl font-bold text-gray-900">{t("notFoundTitle")}</h1>
        <p className="text-sm text-gray-500">{t("notFoundDescription")}</p>
        <Link href="/">
          <Button>{t("goHome")}</Button>
        </Link>
      </div>
    </div>
  );
}
