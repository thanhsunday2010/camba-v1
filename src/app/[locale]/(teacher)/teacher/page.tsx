import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { fetchTeacherClasses } from "@/actions/classes";
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard";
import { getActivePrograms } from "@/lib/queries/user";

export default async function TeacherPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("teacher");
  const [classes, programs] = await Promise.all([
    fetchTeacherClasses(),
    getActivePrograms(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
      </div>
      <TeacherDashboard
        classes={classes}
        programs={programs.map((p) => ({ id: p.id, name: p.name }))}
        labels={{
          createTitle: t("createTitle"),
          className: t("className"),
          description: t("description"),
          program: t("program"),
          create: t("create"),
          creating: t("creating"),
          myClasses: t("myClasses"),
          students: t("students"),
          assignments: t("assignments"),
          openClass: t("openClass"),
          noClasses: t("noClasses"),
          noClassesDesc: t("noClassesDesc"),
        }}
      />
    </div>
  );
}
