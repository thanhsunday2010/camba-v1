import { Link } from "@/i18n/routing";
import { ProgramBadge } from "@/components/camba/cambridge/program-badge";
import { formatNumber } from "@/lib/utils";
import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import { Calendar, Flame, Settings, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StudentProfileHeroLabels = {
  portfolioLabel: string;
  level: string;
  xp: string;
  streak: string;
  days: string;
  bestStreak: string;
  profileCompletion: string;
  memberSince: string;
  editSettings: string;
  viewReport: string;
  cefrEstimate: string;
};

interface StudentProfileHeroProps {
  identity: StudentPortfolioViewModel["identity"];
  hero: StudentPortfolioViewModel["hero"];
  labels: StudentProfileHeroLabels;
}

export function StudentProfileHero({ identity, hero, labels }: StudentProfileHeroProps) {
  const joinDate = identity.joinDate
    ? new Date(identity.joinDate).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <section
      aria-labelledby="profile-hero-heading"
      className="relative overflow-hidden rounded-3xl border border-program/20 bg-gradient-to-br from-program-muted/40 via-white to-[var(--color-badge)]/5 p-5 sm:p-8 shadow-md"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          <div
            className="camba-icon-box-lg shrink-0 bg-program-muted text-program text-xl font-bold uppercase"
            aria-hidden
          >
            {identity.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="camba-caption font-bold uppercase tracking-wide text-program flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" aria-hidden />
              {labels.portfolioLabel}
            </p>
            <h1 id="profile-hero-heading" className="camba-display text-foreground mt-1">
              {identity.name}
            </h1>
            {hero.levelName && (
              <p className="camba-body text-muted mt-1">
                {labels.level}: <span className="font-semibold text-foreground">{hero.levelName}</span>
                {hero.programName && ` · ${hero.programName}`}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {hero.programSlug && (
                <ProgramBadge programSlug={hero.programSlug} size="sm" />
              )}
              {hero.cefrEstimate && (
                <span className="inline-flex rounded-full bg-[var(--surface-sunken)] px-2.5 py-1 camba-caption font-semibold text-muted">
                  {labels.cefrEstimate}: {hero.cefrEstimate}
                </span>
              )}
            </div>
            {joinDate && (
              <p className="camba-caption text-muted mt-2 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                {labels.memberSince} {joinDate}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 camba-caption">
            <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2">
              <p className="text-muted flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-primary" aria-hidden />
                {labels.xp}
              </p>
              <p className="camba-stat text-primary">{formatNumber(hero.totalXp)}</p>
              <p className="text-muted">
                {labels.level} {hero.level}
              </p>
            </div>
            <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2">
              <p className="text-muted flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-[var(--color-streak)]" aria-hidden />
                {labels.streak}
              </p>
              <p className="camba-stat text-[var(--color-streak)]">
                {hero.currentStreak} {labels.days}
              </p>
              {hero.bestStreak > 0 && (
                <p className="text-muted">
                  {labels.bestStreak}: {hero.bestStreak}
                </p>
              )}
            </div>
            <div className="rounded-xl border border-border/60 bg-white/80 px-3 py-2 col-span-2 sm:col-span-1">
              <p className="text-muted">{labels.profileCompletion}</p>
              <p className="camba-stat text-foreground">{identity.profileCompletionPercent}%</p>
              <div
                className="mt-1 h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden"
                role="progressbar"
                aria-valuenow={identity.profileCompletionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-program"
                  style={{ width: `${identity.profileCompletionPercent}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 self-start">
            <Button variant="quest" size="sm" asChild>
              <Link href="/profile/report">{labels.viewReport}</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4 mr-1" aria-hidden />
                {labels.editSettings}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
