import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { fetchLinkedStudents } from "@/actions/parent";
import { ParentDashboard } from "@/components/parent/parent-dashboard";

export default async function ParentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("parent");
  const students = await fetchLinkedStudents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>
      <ParentDashboard
        students={students}
        labels={{
          inviteTitle: t("inviteTitle"),
          emailPlaceholder: t("emailPlaceholder"),
          invite: t("invite"),
          inviting: t("inviting"),
          linkedTitle: t("linkedTitle"),
          pending: t("pending"),
          active: t("active"),
          viewProgress: t("viewProgress"),
          noStudents: t("noStudents"),
          noStudentsDesc: t("noStudentsDesc"),
        }}
      />
    </div>
  );
}
