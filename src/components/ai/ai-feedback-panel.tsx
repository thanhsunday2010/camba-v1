"use client";

import type { ReactNode } from "react";
import type { WritingFeedback, SpeakingFeedback } from "@/types/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CorrectionMarkupText } from "@/components/ai/correction-markup-text";
import { ErrorCorrectionList } from "@/components/ai/error-correction-list";
import { Star } from "lucide-react";

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
    transcript?: string;
    errorHighlights?: string;
    correctedVersion?: string;
    modelAnswer?: string;
  };
  actions?: ReactNode;
  modelAnswerFooter?: ReactNode;
}

export function AiFeedbackPanel({
  type,
  feedback,
  labels,
  actions,
  modelAnswerFooter,
}: AiFeedbackPanelProps) {
  const writing = type === "writing" ? (feedback as WritingFeedback) : null;
  const speaking = type === "speaking" ? (feedback as SpeakingFeedback) : null;

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-warning" />
          {labels.result}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="bg-primary/5 rounded-lg px-3 py-1.5">
            <p className="text-xs text-gray-500">{labels.estimatedLevel}</p>
            <p className="font-bold text-primary">{feedback.estimatedLevel}</p>
          </div>
          <div className="bg-accent/5 rounded-lg px-3 py-1.5">
            <p className="text-xs text-gray-500">{labels.overallScore}</p>
            <p className="font-bold text-accent">{feedback.overallScore}/100</p>
          </div>
        </div>

        {writing && (
          <>
            {writing.errorHighlights && writing.errorHighlights.length > 0 && (
              <div className="rounded-lg border border-red-100 bg-red-50/40 p-3">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {labels.errorHighlights ?? "Lỗi cần sửa"}
                </p>
                <ErrorCorrectionList items={writing.errorHighlights} />
              </div>
            )}

            <div className="rounded-lg bg-gray-50 p-3 space-y-1.5">
              <CompactFeedbackLine label={labels.grammar} content={writing.grammarFeedback} />
              <CompactFeedbackLine label={labels.vocabulary} content={writing.vocabularyFeedback} />
              <CompactFeedbackLine label={labels.coherence} content={writing.coherenceFeedback} />
            </div>

            {writing.suggestedImprovements.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">{labels.improvements}</p>
                <ul className="space-y-0.5">
                  {writing.suggestedImprovements.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {writing.correctedVersion && (
              <div className="rounded-lg border border-green-200/80 bg-green-50/30 p-3">
                <p className="text-sm font-medium text-gray-900 mb-1.5">
                  {labels.correctedVersion ?? "Bản sửa gợi ý"}
                </p>
                <p className="text-sm text-gray-800">
                  <CorrectionMarkupText text={writing.correctedVersion} />
                </p>
              </div>
            )}
          </>
        )}

        {speaking && (
          <>
            {speaking.transcript && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {labels.transcript ?? "Bản ghi"}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{speaking.transcript}</p>
              </div>
            )}

            {speaking.errorHighlights && speaking.errorHighlights.length > 0 && (
              <div className="rounded-lg border border-red-100 bg-red-50/40 p-3">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  {labels.errorHighlights ?? "Lỗi cần sửa"}
                </p>
                <ErrorCorrectionList items={speaking.errorHighlights} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <ScoreChip label={labels.pronunciation} score={speaking.pronunciationScore} />
              <ScoreChip label={labels.fluency} score={speaking.fluencyScore} />
              <ScoreChip label={labels.grammar} score={speaking.grammarScore} />
              <ScoreChip label={labels.vocabulary} score={speaking.vocabularyScore} />
            </div>
            {speaking.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">{labels.suggestions}</p>
                <ul className="space-y-0.5">
                  {speaking.suggestions.map((item, i) => (
                    <li key={i} className="text-sm text-gray-600">
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {speaking.correctedVersion && (
              <div className="rounded-lg border border-green-200/80 bg-green-50/30 p-3">
                <p className="text-sm font-medium text-gray-900 mb-1.5">
                  {labels.correctedVersion ?? "Bản sửa gợi ý"}
                </p>
                <p className="text-sm text-gray-800">
                  <CorrectionMarkupText text={speaking.correctedVersion} />
                </p>
              </div>
            )}

            {speaking.modelAnswerSuggestion && (
              <div className="rounded-lg border border-green-200/80 bg-green-50/30 p-3">
                <p className="text-sm font-medium text-gray-900 mb-1.5">
                  {labels.modelAnswer ?? "Gợi ý câu trả lời mẫu"}
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {speaking.modelAnswerSuggestion}
                </p>
                {modelAnswerFooter}
              </div>
            )}
          </>
        )}

        {actions}
      </CardContent>
    </Card>
  );
}

function CompactFeedbackLine({ label, content }: { label: string; content: string }) {
  return (
    <p className="text-sm text-gray-700">
      <span className="font-medium text-gray-900">{label}: </span>
      {content}
    </p>
  );
}

function ScoreChip({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-primary">{score}</p>
    </div>
  );
}
