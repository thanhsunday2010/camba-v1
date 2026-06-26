import { redirect } from "@/i18n/routing";
import { dashboardHubHref } from "@/lib/dashboard/dashboard-hub-routes";
import { getLocale } from "next-intl/server";

export default async function ProfilePage() {
  const locale = await getLocale();
  redirect({ href: dashboardHubHref("profile"), locale });
}
