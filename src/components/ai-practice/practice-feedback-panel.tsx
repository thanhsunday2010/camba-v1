"use client";

import type { ReactNode } from "react";
import type { PracticeSpeakingFeedback, PracticeWritingFeedback } from "@/types/ai";
import { AiFeedbackPanel } from "@/components/ai/ai-feedback-panel";
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
  const writingFeedback = feedback as PracticeWritingFeedback;

  return (
    <div className="space-y-4">
      <AiFeedbackPanel type={type} feedback={feedback} labels={labels} />

      {type === "writing" && writingFeedback.errorHighlights && writingFeedback.errorHighlights.length > 0 && (
        <Card className="border-warning/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{labels.errorHighlights}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm text-gray-700">
              {writingFeedback.errorHighlights.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-program/20 bg-program/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-program" />
            {labels.modelAnswer}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
            {feedback.modelAnswerSuggestion}
          </p>
        </CardContent>
      </Card>

      {actions}
    </div>
  );
}
