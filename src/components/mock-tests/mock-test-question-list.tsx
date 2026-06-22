"use client";

import { SectionHeader } from "@/components/camba";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import type {
  MockTestTakeLabels,
  MockTestTakeQuestionSummary,
} from "@/lib/mock-tests/mock-test-types";
import { ListChecks } from "lucide-react";

interface MockTestQuestionListProps {
  questions: MockTestTakeQuestionSummary[];
  sections: Array<{ id: string; title: string }>;
  labels: Pick<MockTestTakeLabels, "reviewListTitle" | "reviewListSubtitle" | "reviewQuestion" | "exitReviewMode">;
  onSelectQuestion: (questionId: string) => void;
  onExitReviewMode?: () => void;
}

export function MockTestQuestionList({
  questions,
  sections,
  labels,
  onSelectQuestion,
  onExitReviewMode,
}: MockTestQuestionListProps) {
  const sectionOrder = sections.map((s) => s.id);

  const grouped = sectionOrder
    .map((sectionId) => {
      const sectionQuestions = questions.filter((q) => q.sectionId === sectionId);
      if (sectionQuestions.length === 0) return null;
      return {
        sectionId,
        title: sectionQuestions[0].sectionTitle,
        questions: sectionQuestions,
      };
    })
    .filter(Boolean) as Array<{
    sectionId: string;
    title: string;
    questions: MockTestTakeQuestionSummary[];
  }>;

  return (
    <section aria-labelledby="mock-test-review-list-heading">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <SectionHeader
          titleId="mock-test-review-list-heading"
          title={labels.reviewListTitle}
          description={labels.reviewListSubtitle}
          icon={ListChecks}
          className="flex-1 min-w-0"
        />
        {onExitReviewMode && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-program font-semibold self-start"
            onClick={onExitReviewMode}
          >
            {labels.exitReviewMode}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {grouped.map((group) => (
          <div key={group.sectionId} className="space-y-2">
            <p className="camba-caption font-semibold text-muted uppercase tracking-wide">
              {group.title}
            </p>
            {group.questions.map((question) => (
              <CambaCard key={question.id} variant="lesson" padding="md">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="camba-caption text-muted">
                      #{question.position}
                      {question.skillName ? ` · ${question.skillName}` : ""}
                    </p>
                    <p className="camba-body text-foreground mt-1 line-clamp-2">
                      {question.questionText}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => onSelectQuestion(question.id)}
                  >
                    {labels.reviewQuestion}
                  </Button>
                </div>
              </CambaCard>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
