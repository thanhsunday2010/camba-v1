import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { JourneyMock, JourneyUnit } from "@/lib/learning/journey/learning-journey-types";
import { CheckCircle2, ChevronDown, ClipboardList, Lock, MapPin, Sparkles } from "lucide-react";

interface JourneyUnitRoadmapLabels {
  unitLabel: string;
  mockCheckpoint: string;
  statusCompleted: string;
  statusCurrent: string;
  statusLocked: string;
  statusUpcoming: string;
  lessonsProgress: string;
  continueUnit: string;
}

interface JourneyUnitRoadmapProps {
  units: JourneyUnit[];
  mocks: JourneyMock[];
  recommendedMockId: string | null;
  labels: JourneyUnitRoadmapLabels;
}

function unitIcon(status: JourneyUnit["status"]) {
  switch (status) {
    case "completed":
      return CheckCircle2;
    case "current":
      return MapPin;
    case "locked":
      return Lock;
    default:
      return Sparkles;
  }
}

function unitStyles(status: JourneyUnit["status"]) {
  switch (status) {
    case "completed":
      return "border-success/30 bg-success/5 text-success";
    case "current":
      return "border-program/35 bg-program-muted/50 text-program shadow-sm";
    case "locked":
      return "border-[var(--status-locked)]/25 bg-[var(--surface-sunken)]/40 text-[var(--status-locked)]";
    default:
      return "border-border/60 bg-white text-muted";
  }
}

export function JourneyUnitRoadmap({
  units,
  mocks,
  recommendedMockId,
  labels,
}: JourneyUnitRoadmapProps) {
  const displayUnits = units.filter((u) => u.totalLessonCount > 0 || u.visualState !== "coming-soon");
  const featuredMock =
    mocks.find((m) => m.id === recommendedMockId) ??
    mocks.find((m) => m.displayState !== "completed") ??
    mocks[0] ??
    null;

  if (displayUnits.length === 0 && !featuredMock) {
    return null;
  }

  return (
    <div className="relative" role="list" aria-label={labels.unitLabel}>
      {displayUnits.map((unit, index) => {
        const Icon = unitIcon(unit.status);
        const statusText =
          unit.status === "completed"
            ? labels.statusCompleted
            : unit.status === "current"
              ? labels.statusCurrent
              : unit.status === "locked"
                ? labels.statusLocked
                : labels.statusUpcoming;

        return (
          <div key={unit.slug} role="listitem" className="relative flex gap-4 pb-6 last:pb-0">
            {index < displayUnits.length - 1 && (
              <div
                className="absolute left-[1.125rem] top-10 bottom-0 w-0.5 bg-border/70"
                aria-hidden
              />
            )}
            <div
              className={cn(
                "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                unitStyles(unit.status)
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3",
                  unit.status === "current" ? "border-program/30 bg-white shadow-sm" : "border-border/60 bg-white/80"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="camba-caption text-muted">
                      {labels.unitLabel} {unit.unitNumber || index + 1}
                    </p>
                    <h4 className="camba-h3 text-foreground">{unit.title}</h4>
                  </div>
                  <span className="camba-caption font-semibold text-muted">{statusText}</span>
                </div>
                <p className="camba-caption text-muted mt-2">
                  {labels.lessonsProgress
                    .replace("{done}", String(unit.completedLessonCount))
                    .replace("{total}", String(unit.totalLessonCount))
                    .replace("{percent}", String(unit.completionPercent))}
                </p>
                {unit.status === "current" && (
                  <Link
                    href="/learning"
                    className="mt-3 inline-flex camba-caption font-semibold text-program camba-focus-ring rounded-md"
                  >
                    {labels.continueUnit}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {featuredMock && (
        <div role="listitem" className="relative flex gap-4 pt-2">
          <div className="absolute left-[1.125rem] -top-2 h-4 w-0.5 bg-border/70" aria-hidden />
          <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[var(--status-mock-test)]/40 bg-[var(--status-mock-test)]/10 text-[var(--status-mock-test)]">
            <ClipboardList className="h-4 w-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-[var(--status-mock-test)]/25 bg-[var(--status-mock-test)]/5 px-4 py-3">
              <p className="camba-caption text-[var(--status-mock-test)] font-bold flex items-center gap-1">
                <ChevronDown className="h-3.5 w-3.5 rotate-180" aria-hidden />
                {labels.mockCheckpoint}
              </p>
              <Link href={featuredMock.href} className="camba-focus-ring rounded-md block mt-1">
                <h4 className="camba-h3 text-foreground">{featuredMock.title}</h4>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
