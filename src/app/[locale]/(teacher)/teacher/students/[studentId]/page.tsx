import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { getStudentProgressForTeacher } from "@/lib/queries/teacher";
import { createClient } from "@/lib/supabase/server";
import { StudentProgressOverview } from "@/components/dashboard/student-progress-overview";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface TeacherStudentPageProps {
  params: Promise<{ studentId: string }>;
}

export default async function TeacherStudentPage({ params }: TeacherStudentPageProps) {
  const { studentId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const progress = await getStudentProgressForTeacher(studentId, user.id);
  if (!progress) notFound();

  const t = await getTranslations("teacher");
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
      <Link href="/teacher">
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
