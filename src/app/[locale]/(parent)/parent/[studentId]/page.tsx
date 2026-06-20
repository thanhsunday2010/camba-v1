import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { fetchStudentProgress } from "@/actions/parent";
import { verifyParentAccess } from "@/lib/queries/parent";
import { createClient } from "@/lib/supabase/server";
import { StudentProgressOverview } from "@/components/dashboard/student-progress-overview";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface ParentStudentPageProps {
  params: Promise<{ studentId: string }>;
}

export default async function ParentStudentPage({ params }: ParentStudentPageProps) {
  const { studentId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const hasAccess = await verifyParentAccess(user.id, studentId);
  if (!hasAccess) notFound();

  const progress = await fetchStudentProgress(studentId);
  if (!progress) notFound();

  const t = await getTranslations("parent");
  const td = await getTranslations("dashboard");
  const tg = await getTranslations("gamification");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", studentId)
    .single();

  let levelName: string | undefined;
  if (progress.gamification?.current_level_id) {
    const { data: level } = await supabase
      .from("levels")
      .select("name")
      .eq("id", progress.gamification.current_level_id)
      .single();
    levelName = level?.name;
  }

  return (
    <div className="space-y-4">
      <Link href="/parent">
        <Button variant="ghost" size="sm">← {t("backToDashboard")}</Button>
      </Link>
      <StudentProgressOverview
        studentName={profile?.full_name ?? t("student")}
        progress={progress}
        levelName={levelName}
        labels={{
          xp: td("xp"),
          level: td("level"),
          streak: td("streak"),
          coins: tg("coins"),
          currentLevel: td("currentLevel"),
          days: td("days"),
          notStarted: td("notStarted"),
          lessonsCompleted: t("lessonsCompleted"),
          lessonsInProgress: t("lessonsInProgress"),
          averageAccuracy: t("averageAccuracy"),
          recentMockTests: t("recentMockTests"),
          noMockTests: t("noMockTests"),
        }}
      />
    </div>
  );
}
