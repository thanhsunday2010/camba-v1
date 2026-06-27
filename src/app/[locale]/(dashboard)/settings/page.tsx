import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getPendingParentLinksForStudent } from "@/lib/queries/parent";
import { getStudentAssignments, getStudentClasses } from "@/lib/queries/teacher";
import { fetchActiveProgramContext, fetchAvailablePrograms, fetchLevelsForProgram } from "@/actions/programs";
import { ProgramPicker } from "@/components/programs/program-picker";
import { LevelPicker } from "@/components/programs/level-picker";
import { StudentSettingsPanel } from "@/components/settings/student-settings-panel";
import { SettingsAccountSection } from "@/components/settings/settings-account-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const t = await getTranslations("settings");
  const tn = await getTranslations("nav");
  const tp = await getTranslations("programs");

  const [pendingLinks, classes, assignments, programContext, programs] = await Promise.all([
    getPendingParentLinksForStudent(user.id),
    getStudentClasses(user.id),
    getStudentAssignments(user.id),
    fetchActiveProgramContext(),
    fetchAvailablePrograms(),
  ]);

  const levels = programContext?.programId
    ? await fetchLevelsForProgram(programContext.programId)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="camba-h1 text-foreground">{tn("settings")}</h1>
        <p className="camba-body text-muted mt-1">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("accountTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingsAccountSection email={user.email} fullName={user.fullName} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("learningTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProgramPicker
            programs={programs}
            currentProgramId={programContext?.programId}
            showHeader={false}
            labels={{
              title: tp("switchTitle"),
              subtitle: tp("switchSubtitle"),
              select: tp("switch"),
              selecting: tp("selecting"),
              current: tp("current"),
            }}
          />
          {programContext?.programId && levels.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <LevelPicker
                levels={levels}
                currentLevelId={programContext.levelId}
                compact
                showHeader
                labels={{
                  title: tp("levelTitle"),
                  subtitle: programContext.levelId
                    ? tp("levelChangeSubtitle")
                    : tp("levelSubtitle"),
                  select: tp("levelSelect"),
                  selecting: tp("selecting"),
                  current: tp("currentLevel"),
                  startLearning: tp("startLearning"),
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <StudentSettingsPanel
        pendingParentLinks={pendingLinks}
        classes={classes}
        assignments={assignments}
        labels={{
          parentLinks: t("parentLinks"),
          accept: t("accept"),
          reject: t("reject"),
          noPendingLinks: t("noPendingLinks"),
          joinClass: t("joinClass"),
          joinCodePlaceholder: t("joinCodePlaceholder"),
          join: t("join"),
          joining: t("joining"),
          myClasses: t("myClasses"),
          myAssignments: t("myAssignments"),
          due: t("due"),
          completed: t("completed"),
          start: t("start"),
          noClasses: t("noClasses"),
          noAssignments: t("noAssignments"),
        }}
      />
    </div>
  );
}
