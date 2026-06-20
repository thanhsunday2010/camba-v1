"use client";

import type { WritingFeedback, SpeakingFeedback } from "@/types/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, TrendingUp, BookOpen, MessageSquare } from "lucide-react";

interface AiFeedbackPanelProps {
  type: "writing" | "speaking";
  feedback: WritingFeedback | SpeakingFeedback;
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
  };
}

export function AiFeedbackPanel({ type, feedback, labels }: AiFeedbackPanelProps) {
  const writing = type === "writing" ? (feedback as WritingFeedback) : null;
  const speaking = type === "speaking" ? (feedback as SpeakingFeedback) : null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-warning" />
          {labels.result}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="bg-primary/5 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500">{labels.estimatedLevel}</p>
            <p className="font-bold text-primary">{feedback.estimatedLevel}</p>
          </div>
          <div className="bg-accent/5 rounded-lg px-4 py-2">
            <p className="text-xs text-gray-500">{labels.overallScore}</p>
            <p className="font-bold text-accent">{feedback.overallScore}/100</p>
          </div>
        </div>

        {writing && (
          <>
            <FeedbackSection icon={BookOpen} title={labels.grammar} content={writing.grammarFeedback} />
            <FeedbackSection icon={TrendingUp} title={labels.vocabulary} content={writing.vocabularyFeedback} />
            <FeedbackSection icon={MessageSquare} title={labels.coherence} content={writing.coherenceFeedback} />
            {writing.suggestedImprovements.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">{labels.improvements}</p>
                <ul className="space-y-1">
                  {writing.suggestedImprovements.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-primary">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {speaking && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <ScoreChip label={labels.pronunciation} score={speaking.pronunciationScore} />
              <ScoreChip label={labels.fluency} score={speaking.fluencyScore} />
              <ScoreChip label={labels.grammar} score={speaking.grammarScore} />
              <ScoreChip label={labels.vocabulary} score={speaking.vocabularyScore} />
            </div>
            {speaking.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">{labels.suggestions}</p>
                <ul className="space-y-1">
                  {speaking.suggestions.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-primary">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function FeedbackSection({
  icon: Icon,
  title,
  content,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </p>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
}

function ScoreChip({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-primary">{score}</p>
    </div>
  );
}
