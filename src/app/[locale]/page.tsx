import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Brain,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const tAuth = await getTranslations("auth");
  const tc = await getTranslations("common");

  const features = [
    {
      icon: BookOpen,
      title: t("feature1Title"),
      description: t("feature1Desc"),
    },
    {
      icon: Trophy,
      title: t("feature2Title"),
      description: t("feature2Desc"),
    },
    {
      icon: Sparkles,
      title: t("feature3Title"),
      description: t("feature3Desc"),
    },
    {
      icon: Brain,
      title: t("feature4Title"),
      description: t("feature4Desc"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-7 w-7" />
            <span className="text-xl font-bold">{tc("appName")}</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">{tAuth("login")}</Button>
            </Link>
            <Link href="/register">
              <Button>{t("getStarted")}</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-gray-600">{t("heroSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                {t("getStarted")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                {t("learnMore")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t("featuresTitle")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-3"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CAMBA. {tc("appTagline")}
        </div>
      </footer>
    </div>
  );
}
