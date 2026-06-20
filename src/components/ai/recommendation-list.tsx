"use client";

import { useTransition } from "react";
import { dismissRecommendationAction } from "@/actions/ai/recommendations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, X } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  recommendation_type: string;
}

interface RecommendationListProps {
  recommendations: Recommendation[];
  title: string;
  emptyText: string;
}

export function RecommendationList({
  recommendations,
  title,
  emptyText,
}: RecommendationListProps) {
  const [isPending, startTransition] = useTransition();

  function handleDismiss(id: string) {
    startTransition(async () => {
      await dismissRecommendationAction(id);
    });
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{emptyText}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-warning" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="flex items-start justify-between gap-2 p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{rec.title}</p>
              {rec.description && (
                <p className="text-xs text-gray-500 mt-0.5">{rec.description}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 h-7 w-7"
              onClick={() => handleDismiss(rec.id)}
              disabled={isPending}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
