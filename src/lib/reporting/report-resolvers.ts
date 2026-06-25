import { getTranslations } from "next-intl/server";
import {
  buildAchievementItemLabels,
  resolveAchievementText,
} from "@/lib/achievements/achievement-i18n";
import type { ReportResolvers } from "@/lib/reporting/report-utils";
import type { CertificationEntry } from "@/lib/profile/student-profile-types";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";

/** Shared resolver factory for report pages and PDF API. */
export async function buildReportResolvers(): Promise<ReportResolvers> {
  const [ta, tj, tProfile] = await Promise.all([
    getTranslations("achievements"),
    getTranslations("journey"),
    getTranslations("profile"),
  ]);

  const achievementItems = buildAchievementItemLabels(ta);

  return {
    resolveAchievement: (a: EvaluatedAchievement) =>
      resolveAchievementText(a, achievementItems),
    resolveMilestone: (titleKey: string) => {
      try {
        return tj(titleKey as Parameters<typeof tj>[0]);
      } catch {
        return achievementItems[titleKey]?.title ?? titleKey;
      }
    },
    resolveCertification: (entry: CertificationEntry) => {
      if (entry.kind === "achievement") {
        return achievementItems[entry.title]?.title ?? entry.title;
      }
      return entry.title;
    },
    resolveGoal: (key: string) => {
      try {
        return tProfile(key as Parameters<typeof tProfile>[0]);
      } catch {
        return achievementItems[key]?.title ?? key;
      }
    },
  };
}
