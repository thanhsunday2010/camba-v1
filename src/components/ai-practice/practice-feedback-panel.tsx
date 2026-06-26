"use client";

import type { ReactNode } from "react";
import type { PracticeSpeakingFeedback, PracticeWritingFeedback } from "@/types/ai";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
import { CorrectionMarkupText } from "@/components/ai/correction-markup-text";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface PracticeFeedbackPanelProps {
  type: "writing" | "speaking";
  feedback: PracticeWritingFeedback | PracticeSpeakingFeedback;
  labels: {
    result: string;
    estimatedLevel: string;
    grammar: string;
    vocabulary: string;
    coherence: string;
    improvements: string;
    pronunciation: string;
    fluency: string;
    suggestions: string;
    overallScore: string;
    transcript?: string;
    modelAnswer: string;
    errorHighlights?: string;
  };
  actions?: ReactNode;
}

export function PracticeFeedbackPanel({
  type,
  feedback,
  labels,
  actions,
}: PracticeFeedbackPanelProps) {
  return (
    <div className="space-y-3">
      <AiFeedbackPanel type={type} feedback={feedback} labels={labels} />

      {type === "writing" && (
        <Card className="border-green-200/80 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-green-800" />
              {labels.modelAnswer}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 leading-relaxed">
              <CorrectionMarkupText text={feedback.modelAnswerSuggestion} />
            </p>
          </CardContent>
        </Card>
      )}

      {actions}
    </div>
  );
}
