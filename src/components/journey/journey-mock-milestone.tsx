import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { cn } from "@/lib/utils";
import type { JourneyMock } from "@/lib/learning/journey/learning-journey-types";
import { Award, ClipboardList, Mic, PenLine, Star, Trophy } from "lucide-react";

interface JourneyMockMilestoneLabels {
  title: string;
  recommended: string;
  completed: string;
  goldBadge: string;
  writingBadge: string;
  speakingBadge: string;
  viewMock: string;
  emptyTitle: string;
  emptyDescription: string;
}

interface JourneyMockMilestoneProps {
  mocks: JourneyMock[];
  recommendedMockId: string | null;
  labels: JourneyMockMilestoneLabels;
}

export function JourneyMockMilestone({
  mocks,
  recommendedMockId,
  labels,
}: JourneyMockMilestoneProps) {
  if (mocks.length === 0) {
    return (
      <CambaCard variant="default" padding="lg" className="border-dashed border-program/20 text-center">
        <ClipboardList className="h-10 w-10 mx-auto text-muted mb-3" aria-hidden />
        <p className="camba-h3 text-foreground">{labels.emptyTitle}</p>
        <p className="camba-body text-muted mt-2 max-w-md mx-auto">{labels.emptyDescription}</p>
        <Link href="/mock-tests" className="inline-block mt-4 camba-caption font-semibold text-program camba-focus-ring rounded-lg">
          {labels.viewMock}
        </Link>
      </CambaCard>
    );
  }

  const sorted = [...mocks].sort((a, b) => {
    if (a.id === recommendedMockId) return -1;
    if (b.id === recommendedMockId) return 1;
    if (a.displayState === "completed" && b.displayState !== "completed") return 1;
    if (b.displayState === "completed" && a.displayState !== "completed") return -1;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="list" aria-label={labels.title}>
      {sorted.slice(0, 4).map((mock) => {
        const isRecommended = mock.id === recommendedMockId;
        const isCompleted = mock.displayState === "completed";

        return (
          <CambaCard
            key={mock.id}
            variant="mockTest"
            padding="md"
            className={cn(
              "h-full",
              isRecommended && "ring-2 ring-program/25",
              isCompleted && "border-success/25"
            )}
            role="listitem"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="camba-h3 text-foreground min-w-0">{mock.title}</h4>
              {isCompleted ? (
                <Trophy className="h-5 w-5 shrink-0 text-success" aria-label={labels.completed} />
              ) : isRecommended ? (
                <Star className="h-5 w-5 shrink-0 text-program" aria-label={labels.recommended} />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {mock.isGoldMock && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-badge)]/15 px-2 py-0.5 camba-caption font-bold text-[var(--color-badge)]">
                  <Award className="h-3 w-3" aria-hidden />
                  {labels.goldBadge}
                </span>
              )}
              {mock.includesWriting && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--status-writing)]/10 px-2 py-0.5 camba-caption font-medium text-[var(--status-writing)]">
                  <PenLine className="h-3 w-3" aria-hidden />
                  {labels.writingBadge}
                </span>
              )}
              {mock.includesSpeaking && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--status-speaking)]/10 px-2 py-0.5 camba-caption font-medium text-[var(--status-speaking)]">
                  <Mic className="h-3 w-3" aria-hidden />
                  {labels.speakingBadge}
                </span>
              )}
              {isRecommended && !isCompleted && (
                <span className="rounded-full bg-program-muted px-2 py-0.5 camba-caption font-semibold text-program">
                  {labels.recommended}
                </span>
              )}
            </div>

            {mock.bestScorePercent != null && (
              <p className="camba-caption text-muted mt-2">
                {mock.bestScorePercent}%
              </p>
            )}

            <Link
              href={mock.href}
              className="mt-3 inline-flex camba-caption font-semibold text-[var(--status-mock-test)] camba-focus-ring rounded-md"
            >
              {labels.viewMock}
            </Link>
          </CambaCard>
        );
      })}
    </div>
  );
}
