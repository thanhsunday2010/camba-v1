import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CambridgeProgramTheme } from "@/components/camba/cambridge-program-theme";
import { LandingProgramsSection } from "@/components/landing/landing-programs-section";
import { LandingPageShell } from "@/components/landing/landing-page-shell";
import { MascotBrandLink } from "@/components/mascot";
import { CambaRabbitMascot } from "@/components/mascot/camba-rabbit-mascot";
import type { LandingPageLabels, LandingProgram } from "@/components/landing/landing-types";
import { ArrowRight } from "lucide-react";

interface LandingPageViewProps {
  labels: LandingPageLabels;
  programs: LandingProgram[];
}

export function LandingPageView({ labels: l, programs }: LandingPageViewProps) {
  return (
    <LandingPageShell>
      <CambridgeProgramTheme>
        <div className="min-h-screen bg-background camba-safe-x flex flex-col">
          <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm camba-safe-top">
            <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
              <MascotBrandLink href="/" ariaLabel={l.appName} />
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
            <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-10 sm:space-y-12">
              <section
                aria-labelledby="landing-hero-heading"
                className="relative overflow-hidden rounded-3xl border-2 border-program/25 shadow-lg camba-gradient-program-soft camba-hero-pattern"
              >
                <div
                  className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl camba-gradient-program"
                  aria-hidden
                />
                <div className="relative p-6 sm:p-10 lg:p-12">
                  <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div className="space-y-6">
                      <h1 id="landing-hero-heading" className="camba-display text-foreground leading-tight max-w-2xl">
                        {l.heroTitle}
                      </h1>
                      <Link href="/register" className="inline-block w-full sm:w-auto">
                        <Button variant="quest" size="lg" className="w-full sm:w-auto gap-2">
                          {l.getStarted}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="mx-auto flex shrink-0 items-center justify-center lg:mx-0" aria-hidden>
                      <div className="relative">
                        <div className="absolute inset-0 scale-110 rounded-full bg-white/50 blur-2xl" />
                        <CambaRabbitMascot className="relative scale-[1.85] sm:scale-[2.1] lg:scale-[2.35]" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <LandingProgramsSection title={l.programsTitle} programs={programs} />
            </div>
          </main>

          <footer className="border-t border-border/60 py-5 mt-2">
            <div className="max-w-7xl mx-auto px-4 text-center camba-caption text-muted">
              © {new Date().getFullYear()} {l.appName}
            </div>
          </footer>
        </div>
      </CambridgeProgramTheme>
    </LandingPageShell>
  );
}
