import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { JourneyMilestone } from "@/lib/learning/journey/learning-journey-types";
import { CheckCircle2, Circle, Sparkles, Trophy } from "lucide-react";

interface JourneyMilestoneSectionLabels {
  title: string;
  subtitle: string;
  achieved: string;
  upcoming: string;
  milestoneLevelComplete: Record<string, string>;
  milestoneLevelCompleteDesc: Record<string, string>;
  milestoneFirstWriting: string;
  milestoneFirstWritingDesc: string;
  milestoneFirstSpeaking: string;
  milestoneFirstSpeakingDesc: string;
  milestoneFirstGoldMock: string;
  milestoneFirstGoldMockDesc: string;
  milestoneKetReady: string;
  milestoneKetReadyDesc: string;
  milestonePetReady: string;
  milestonePetReadyDesc: string;
}

interface JourneyMilestoneSectionProps {
  milestones: JourneyMilestone[];
  labels: JourneyMilestoneSectionLabels;
}

function resolveMilestoneText(
  milestone: JourneyMilestone,
  labels: JourneyMilestoneSectionLabels
): { title: string; description: string } {
  switch (milestone.kind) {
    case "level-complete": {
      const slug = milestone.levelSlug ?? "";
      return {
        title: labels.milestoneLevelComplete[slug] ?? slug,
        description: labels.milestoneLevelCompleteDesc[slug] ?? "",
      };
    }
    case "first-writing-exam":
      return {
        title: labels.milestoneFirstWriting,
        description: labels.milestoneFirstWritingDesc,
      };
    case "first-speaking-exam":
      return {
        title: labels.milestoneFirstSpeaking,
        description: labels.milestoneFirstSpeakingDesc,
      };
    case "first-gold-mock":
      return {
        title: labels.milestoneFirstGoldMock,
        description: labels.milestoneFirstGoldMockDesc,
      };
    case "ket-ready":
      return {
        title: labels.milestoneKetReady,
        description: labels.milestoneKetReadyDesc,
      };
    case "pet-ready":
      return {
        title: labels.milestonePetReady,
        description: labels.milestonePetReadyDesc,
      };
  }
}

export function JourneyMilestoneSection({ milestones, labels }: JourneyMilestoneSectionProps) {
  const featured = milestones.filter(
    (m) => m.kind !== "level-complete" || m.achieved || m.levelSlug === "flyers" || m.levelSlug === "ket"
  );

  return (
    <section aria-labelledby="journey-milestones-heading">
      <header className="mb-4">
        <h2 id="journey-milestones-heading" className="camba-h2 text-foreground flex items-center gap-2">
          <Trophy className="h-5 w-5 text-[var(--color-badge)]" aria-hidden />
          {labels.title}
        </h2>
        <p className="camba-caption text-muted mt-1">{labels.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {featured.map((milestone) => {
          const { title, description } = resolveMilestoneText(milestone, labels);
          const Icon = milestone.achieved ? CheckCircle2 : Circle;

          const content = (
            <div
              className={cn(
                "rounded-2xl border px-4 py-3 h-full transition-colors",
                milestone.achieved
                  ? "border-success/30 bg-success/5"
                  : "border-border/60 bg-white/80"
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 mt-0.5",
                    milestone.achieved ? "text-success" : "text-muted"
                  )}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="camba-body font-semibold text-foreground">{title}</p>
                  <p className="camba-caption text-muted mt-1 leading-relaxed">{description}</p>
                  <p className="camba-caption font-medium mt-2 flex items-center gap-1">
                    {milestone.achieved ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-success" aria-hidden />
                        <span className="text-success">{labels.achieved}</span>
                      </>
                    ) : (
                      <span className="text-muted">{labels.upcoming}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          );

          return (
            <div key={milestone.id} role="listitem">
              {milestone.href ? (
                <Link href={milestone.href} className="block camba-focus-ring rounded-2xl">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
