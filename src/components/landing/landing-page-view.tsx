import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { SectionHeader } from "@/components/camba/section-header";
import { CambridgeProgramTheme } from "@/components/camba/cambridge-program-theme";
import { LandingFeatureGrid } from "@/components/landing/landing-feature-grid";
import { LandingProgramsSection } from "@/components/landing/landing-programs-section";
import type { LandingFeature, LandingPageLabels, LandingProgram } from "@/components/landing/landing-types";
import {
  ArrowRight,
  GraduationCap,
  Sparkles,
  BookOpen,
  Map,
  Gift,
} from "lucide-react";

interface LandingPageViewProps {
  labels: LandingPageLabels;
  programs: LandingProgram[];
  features: LandingFeature[];
}

export function LandingPageView({ labels: l, programs, features }: LandingPageViewProps) {
  return (
    <CambridgeProgramTheme>
      <div className="min-h-screen bg-background camba-safe-x flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm camba-safe-top">
          <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-primary shrink-0">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="font-bold text-lg sm:text-xl">{l.appName}</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login">
                <Button variant="ghost" className="camba-touch-target md:min-h-0">
                  {l.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="quest" className="camba-touch-target md:min-h-0">
                  {l.register}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10 space-y-10 sm:space-y-14">
            <section
              aria-labelledby="landing-hero-heading"
              className="relative overflow-hidden rounded-3xl border-2 border-program/25 shadow-lg camba-gradient-program-soft camba-hero-pattern"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl camba-gradient-program"
                aria-hidden
              />
              <div className="relative p-6 sm:p-10 lg:p-12 space-y-6 sm:space-y-8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 border border-program/20 px-3 py-1 camba-caption font-semibold text-program">
                    <Gift className="h-3.5 w-3.5" aria-hidden />
                    {l.heroBadgeFree}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 border border-program/20 px-3 py-1 camba-caption font-semibold text-program">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden />
                    {l.heroBadgeAi}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 border border-program/20 px-3 py-1 camba-caption font-semibold text-program">
                    <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                    {l.heroBadgePrograms}
                  </span>
                </div>

                <div className="max-w-3xl space-y-4">
                  <h1 id="landing-hero-heading" className="camba-display text-foreground leading-tight">
                    {l.heroTitle}
                  </h1>
                  <p className="camba-body text-muted leading-relaxed max-w-2xl">{l.heroSubtitle}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link href="/register" className="w-full sm:w-auto">
                    <Button variant="quest" size="lg" className="w-full sm:w-auto gap-2">
                      {l.getStarted}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/70">
                      {l.loginCta}
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {[l.highlight1, l.highlight2, l.highlight3].map((text) => (
                    <CambaCard
                      key={text}
                      variant="stat"
                      padding="sm"
                      className="bg-white/75 border-white/80"
                    >
                      <p className="camba-body text-foreground font-medium leading-snug">{text}</p>
                    </CambaCard>
                  ))}
                </div>
              </div>
            </section>

            <LandingProgramsSection
              title={l.programsTitle}
              subtitle={l.programsSubtitle}
              programs={programs}
            />

            <section aria-labelledby="landing-features-heading">
              <SectionHeader
                titleId="landing-features-heading"
                title={l.featuresTitle}
                description={l.featuresSubtitle}
                icon={BookOpen}
                className="mb-6"
              />
              <LandingFeatureGrid features={features} />
            </section>

            <section
              aria-labelledby="landing-cta-heading"
              className="relative overflow-hidden rounded-3xl border border-program/20 camba-gradient-program-soft p-6 sm:p-10 text-center space-y-5"
            >
              <div
                className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full opacity-15 blur-3xl camba-gradient-program"
                aria-hidden
              />
              <div className="relative space-y-3 max-w-xl mx-auto">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-program-muted text-program">
                  <Map className="h-6 w-6" />
                </div>
                <h2 id="landing-cta-heading" className="camba-h2 text-foreground">
                  {l.ctaTitle}
                </h2>
                <p className="camba-body text-muted">{l.ctaSubtitle}</p>
              </div>
              <div className="relative flex flex-col sm:flex-row gap-3 justify-center pt-1">
                <Link href="/register">
                  <Button variant="quest" size="lg" className="w-full sm:w-auto gap-2">
                    {l.ctaRegister}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/70">
                    {l.ctaLogin}
                  </Button>
                </Link>
              </div>
            </section>
          </div>
        </main>

        <footer className="border-t border-border/60 py-6 mt-4">
          <div className="max-w-7xl mx-auto px-4 text-center camba-caption text-muted">
            © {new Date().getFullYear()} {l.appName}. {l.appTagline}
          </div>
        </footer>
      </div>
    </CambridgeProgramTheme>
  );
}
