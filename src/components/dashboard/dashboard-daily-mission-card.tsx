import { FeatureEmptyState } from "@/components/camba/empty-states";
import { SectionHeader } from "@/components/camba/section-header";
import type { DashboardDailyMission } from "@/lib/dashboard/daily-mission";
import { ArrowRight, Target } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CambaCard } from "@/components/camba/primitives/camba-card";

interface DashboardDailyMissionCardProps {
  mission: DashboardDailyMission | null;
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
  };
}

export function DashboardDailyMissionCard({ mission, labels }: DashboardDailyMissionCardProps) {
  return (
    <section aria-labelledby="daily-mission-heading">
      <SectionHeader
        titleId="daily-mission-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Target}
      />

      {!mission ? (
        <FeatureEmptyState
          icon={Target}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          primaryAction={{ label: labels.emptyAction, href: "/learning" }}
        />
      ) : (
        <CambaCard variant="mission" padding="lg" className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06] camba-gradient-program"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="camba-h2 text-foreground">{mission.title}</h2>
              <p className="camba-body text-muted leading-relaxed">{mission.description}</p>
              {mission.progressPercent != null && mission.progressPercent > 0 && (
                <div className="space-y-1.5 max-w-sm">
                  <div className="flex justify-between camba-caption text-muted">
                    <span>{mission.progressLabel ?? `${mission.progressPercent}%`}</span>
                    <span className="font-semibold text-program">{mission.progressPercent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-program-muted overflow-hidden">
                    <div
                      className="h-full camba-gradient-program rounded-full transition-all"
                      style={{ width: `${mission.progressPercent}%` }}
                      role="progressbar"
                      aria-valuenow={mission.progressPercent}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              )}
            </div>
            <Link href={mission.href} className="shrink-0 camba-focus-ring rounded-xl">
              <Button variant="quest" size="lg" className="w-full sm:w-auto min-w-[10rem]">
                {mission.ctaLabel}
                <ArrowRight className="h-4 w-4 ml-1" aria-hidden />
              </Button>
            </Link>
          </div>
        </CambaCard>
      )}
    </section>
  );
}
