import { getTranslations } from "next-intl/server";
import { LandingPageView } from "@/components/landing/landing-page-view";

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const tAuth = await getTranslations("auth");
  const tc = await getTranslations("common");

  const labels = {
    appName: tc("appName"),
    login: tAuth("login"),
    register: tAuth("register"),
    heroTitle: t("heroTitle"),
    getStarted: t("getStarted"),
    programsTitle: t("programsTitle"),
  };

  const programs = [
    {
      key: "cambridge",
      badge: t("programCambridgeBadge"),
      title: t("programCambridgeTitle"),
    },
    {
      key: "ielts",
      badge: t("programIeltsBadge"),
      title: t("programIeltsTitle"),
    },
    {
      key: "sat",
      badge: t("programSatBadge"),
      title: t("programSatTitle"),
    },
    {
      key: "competency",
      badge: t("programCompetencyBadge"),
      title: t("programCompetencyTitle"),
    },
  ];

  return <LandingPageView labels={labels} programs={programs} />;
}
