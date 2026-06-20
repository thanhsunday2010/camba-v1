import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { fetchClassDetail } from "@/actions/classes";
import {
  getAssignmentLessonOptions,
  getAssignmentMockTestOptions,
} from "@/lib/queries/teacher";
import { ClassDetailPanel } from "@/components/teacher/class-detail-panel";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

interface ClassPageProps {
  params: Promise<{ classId: string }>;
}

export default async function TeacherClassPage({ params }: ClassPageProps) {
  const { classId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const classDetail = await fetchClassDetail(classId);
  if (!classDetail) notFound();

  const t = await getTranslations("teacher");
  const [lessonOptions, mockTestOptions] = await Promise.all([
    getAssignmentLessonOptions(),
    getAssignmentMockTestOptions(classDetail.programId),
  ]);

  return (
    <div className="space-y-4">
      <Link href="/teacher">
        <Button variant="ghost" size="sm">← {t("backToDashboard")}</Button>
      </Link>
      <ClassDetailPanel
        classDetail={classDetail}
        lessonOptions={lessonOptions}
        mockTestOptions={mockTestOptions}
        labels={{
          joinCode: t("joinCode"),
          copied: t("copied"),
          roster: t("roster"),
          viewStudent: t("viewStudent"),
          noStudents: t("noStudents"),
          assignments: t("assignments"),
          createAssignment: t("createAssignment"),
          assignmentTitle: t("assignmentTitle"),
          dueDate: t("dueDate"),
          targetType: t("targetType"),
          lesson: t("lesson"),
          mockTest: t("mockTest"),
          selectTarget: t("selectTarget"),
          completion: t("completion"),
          deactivate: t("deactivate"),
          creating: t("creating"),
          create: t("create"),
        }}
      />
    </div>
  );
}
