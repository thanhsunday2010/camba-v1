import { getStudentPortfolioViewModel } from "@/lib/profile/student-profile-view-model";
import { getDashboardRecentActivity } from "@/lib/dashboard/recent-activity";
import { getDashboardSkillInsights } from "@/lib/dashboard/skill-insights";
import { getSkillProgressSnapshot } from "@/lib/queries/dashboard";
import { getUserGamification } from "@/lib/queries/user";
import type { AuthUser } from "@/types";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";
import type { StudentProgressReportViewModel } from "@/lib/reporting/report-types";
import {
  buildStudentProgressReportViewModel,
  type ReportResolvers,
} from "@/lib/reporting/report-utils";

export type { ReportResolvers };

/**
 * Aggregate existing CAMBA data into a parent-friendly report view model.
 * Single fetch path — reuses portfolio VM + dashboard skill insights.
 */
export async function getStudentProgressReport(
  user: AuthUser,
  labels: StudentProgressReportLabels,
  resolvers: ReportResolvers,
  nextMilestoneFallback: string
): Promise<StudentProgressReportViewModel> {
  const [portfolio, gamification] = await Promise.all([
    getStudentPortfolioViewModel(user, nextMilestoneFallback),
    getUserGamification(user.id),
  ]);

  const levelId = gamification?.current_level_id ?? null;
  const skillSnapshot = levelId
    ? await getSkillProgressSnapshot(user.id, levelId)
    : [];

  const [skillInsights, recentActivity] = await Promise.all([
    getDashboardSkillInsights(user.id, skillSnapshot, {
      strong: labels.strengthsLabel,
      focus: labels.needsPracticeLabel,
    }),
    getDashboardRecentActivity(user.id, { badgeEarned: labels.achievementsTitle }),
  ]);

  const latestActivity = recentActivity[0] ?? null;

  return buildStudentProgressReportViewModel(
    portfolio,
    skillInsights,
    latestActivity,
    labels,
    resolvers
  );
}
