import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { canAccess } from "@/lib/auth/admin-permissions";
import { SiteCopyBrowser } from "@/components/admin/site-copy/site-copy-browser";
import { getSiteTextOverrideRows } from "@/lib/site-copy/overrides";
import { AdminPageHeader } from "@/components/admin/shell/admin-module-hub";

export default async function AdminSitePage() {
  const user = await getCurrentUser();
  if (!user || !canAccess(user, "site.read")) redirect("/admin");

  const locale = await getLocale();
  const [siteCopyOverrides, baseMessages] = await Promise.all([
    getSiteTextOverrideRows(locale),
    import(`@/i18n/messages/${locale}.json`).then((m) => m.default),
  ]);

  return (
    <div>
      <AdminPageHeader
        breadcrumb="Admin › Trang web"
        title="Nội dung trang web"
        description="Chỉnh text giao diện theo locale."
      />
      <SiteCopyBrowser
        locale={locale}
        baseMessages={baseMessages}
        overrides={siteCopyOverrides}
      />
    </div>
  );
}
