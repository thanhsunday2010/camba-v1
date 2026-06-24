import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import type { DashboardSkillInsightsView } from "@/lib/dashboard/skill-insights";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain } from "lucide-react";

interface DashboardSkillInsightsProps {
  insights: DashboardSkillInsightsView;
  labels: {
    title: string;
    subtitle: string;
    strengths: string;
    weaknesses: string;
    grammar: string;
    vocabulary: string;
    skills: string;
    viewDetails: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
  };
}

function InsightList({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "strength" | "weakness";
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p
        className={
          variant === "strength"
            ? "camba-caption font-bold text-program"
            : "camba-caption font-bold text-[var(--status-needs-review)]"
        }
      >
        {title}
      </p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item} className="camba-caption text-foreground/90 flex items-start gap-1.5">
            <span aria-hidden>{variant === "strength" ? "▲" : "▼"}</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardSkillInsights({ insights, labels }: DashboardSkillInsightsProps) {
  const hasContent =
    insights.hasAnalytics ||
    insights.skillStrengths.length > 0 ||
    insights.skillWeaknesses.length > 0;

  return (
    <section aria-labelledby="skill-insights-heading">
      <SectionHeader
        titleId="skill-insights-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Brain}
        action={
          hasContent ? (
            <Link href={insights.detailHref}>
              <Button variant="ghost" size="sm">
                {labels.viewDetails}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </Link>
          ) : undefined
        }
      />

      {!hasContent ? (
        <DashboardEmptyState
          icon={Brain}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/learning"
        />
      ) : (
        <CambaCard variant="default" padding="md">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-4">
              <InsightList
                title={`${labels.grammar} · ${labels.strengths}`}
                items={insights.grammarStrengths}
                variant="strength"
              />
              <InsightList
                title={`${labels.grammar} · ${labels.weaknesses}`}
                items={insights.grammarWeaknesses}
                variant="weakness"
              />
            </div>
            <div className="space-y-4">
              <InsightList
                title={`${labels.vocabulary} · ${labels.strengths}`}
                items={insights.vocabularyStrengths}
                variant="strength"
              />
              <InsightList
                title={`${labels.vocabulary} · ${labels.weaknesses}`}
                items={insights.vocabularyWeaknesses}
                variant="weakness"
              />
            </div>
          </div>
          {(insights.skillStrengths.length > 0 || insights.skillWeaknesses.length > 0) && (
            <div className="mt-5 pt-4 border-t border-border/60 grid gap-4 sm:grid-cols-2">
              <InsightList
                title={`${labels.skills} · ${labels.strengths}`}
                items={insights.skillStrengths}
                variant="strength"
              />
              <InsightList
                title={`${labels.skills} · ${labels.weaknesses}`}
                items={insights.skillWeaknesses}
                variant="weakness"
              />
            </div>
          )}
        </CambaCard>
      )}
    </section>
  );
}
