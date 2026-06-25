import { getTranslations } from "next-intl/server";
import { LandingPageView } from "@/components/landing/landing-page-view";

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const tAuth = await getTranslations("auth");
  const tc = await getTranslations("common");

  const labels = {
    appName: tc("appName"),
    appTagline: tc("appTagline"),
    login: tAuth("login"),
    register: tAuth("register"),
    heroTitle: t("heroTitle"),
    heroSubtitle: t("heroSubtitle"),
    heroBadgeFree: t("heroBadgeFree"),
    heroBadgeAi: t("heroBadgeAi"),
    heroBadgePrograms: t("heroBadgePrograms"),
    getStarted: t("getStarted"),
    loginCta: t("loginCta"),
    programsTitle: t("programsTitle"),
    programsSubtitle: t("programsSubtitle"),
    featuresTitle: t("featuresTitle"),
    featuresSubtitle: t("featuresSubtitle"),
    highlight1: t("highlight1"),
    highlight2: t("highlight2"),
    highlight3: t("highlight3"),
    ctaTitle: t("ctaTitle"),
    ctaSubtitle: t("ctaSubtitle"),
    ctaRegister: t("ctaRegister"),
    ctaLogin: t("ctaLogin"),
  };

  const programs = [
    {
      key: "cambridge",
      badge: t("programCambridgeBadge"),
      title: t("programCambridgeTitle"),
      description: t("programCambridgeDesc"),
    },
    {
      key: "ielts",
      badge: t("programIeltsBadge"),
      title: t("programIeltsTitle"),
      description: t("programIeltsDesc"),
    },
    {
      key: "sat",
      badge: t("programSatBadge"),
      title: t("programSatTitle"),
      description: t("programSatDesc"),
    },
    {
      key: "competency",
      badge: t("programCompetencyBadge"),
      title: t("programCompetencyTitle"),
      description: t("programCompetencyDesc"),
    },
  ];

  const features = [
    { icon: "globe" as const, title: t("feature1Title"), description: t("feature1Desc") },
    { icon: "bookOpen" as const, title: t("feature2Title"), description: t("feature2Desc") },
    { icon: "sparkles" as const, title: t("feature3Title"), description: t("feature3Desc") },
    { icon: "fileText" as const, title: t("feature4Title"), description: t("feature4Desc") },
    { icon: "trophy" as const, title: t("feature5Title"), description: t("feature5Desc") },
    { icon: "gift" as const, title: t("feature6Title"), description: t("feature6Desc") },
  ];

  return <LandingPageView labels={labels} programs={programs} features={features} />;
}
