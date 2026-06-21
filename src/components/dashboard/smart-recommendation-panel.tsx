"use client";

import { useTransition } from "react";
import { dismissRecommendationAction } from "@/actions/ai/recommendations";
import { SectionHeader } from "@/components/camba/section-header";
import { RecommendationCard } from "@/components/camba/cards/mission-reward-cards";
import { EmptyStateIllustrated } from "@/components/camba/empty-state-illustrated";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, X } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  recommendation_type: string;
}

interface SmartRecommendationPanelProps {
  recommendations: Recommendation[];
  coachMotivation?: string | null;
  labels: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    motivationLabel: string;
  };
}

export function SmartRecommendationPanel({
  recommendations,
  coachMotivation,
  labels,
}: SmartRecommendationPanelProps) {
  const [isPending, startTransition] = useTransition();

  function handleDismiss(id: string) {
    startTransition(async () => {
      await dismissRecommendationAction(id);
    });
  }

  return (
    <section aria-labelledby="smart-recommendations-heading">
      <SectionHeader title={labels.title} description={labels.subtitle} icon={Lightbulb} />

      {coachMotivation && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-program/20 bg-program-muted/50 p-4">
          <Sparkles className="h-5 w-5 text-program shrink-0 mt-0.5" />
          <div>
            <p className="camba-caption text-program font-bold">{labels.motivationLabel}</p>
            <p className="camba-body text-foreground mt-1">{coachMotivation}</p>
          </div>
        </div>
      )}

      {recommendations.length === 0 ? (
        <EmptyStateIllustrated
          icon={Lightbulb}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
        />
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className="relative group">
              <RecommendationCard
                title={rec.title}
                description={rec.description ?? labels.subtitle}
                action={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-8 w-8 opacity-60 group-hover:opacity-100"
                    onClick={() => handleDismiss(rec.id)}
                    disabled={isPending}
                    aria-label="Dismiss"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
