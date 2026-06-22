import { CambaCard } from "@/components/camba/primitives/camba-card";
import { SectionHeader } from "@/components/camba/section-header";
import type { MockTestDetailLabels, MockTestSectionSummary } from "@/lib/mock-tests/mock-test-types";
import { Clock, FileQuestion, ListChecks } from "lucide-react";

interface MockTestSectionListProps {
  sections: MockTestSectionSummary[];
  labels: Pick<
    MockTestDetailLabels,
    "structureTitle" | "structureSubtitle" | "sectionLabel" | "sectionQuestions" | "sectionMinutes"
  >;
}

export function MockTestSectionList({ sections, labels }: MockTestSectionListProps) {
  if (sections.length === 0) return null;

  return (
    <section aria-labelledby="mock-test-sections-heading">
      <SectionHeader
        titleId="mock-test-sections-heading"
        title={labels.structureTitle}
        description={labels.structureSubtitle}
        icon={ListChecks}
        className="mb-3"
      />
      <div className="space-y-2">
        {sections.map((section, index) => (
          <CambaCard key={section.id} variant="lesson" padding="md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="camba-caption text-muted font-semibold uppercase tracking-wide">
                  {labels.sectionLabel} {index + 1}
                </p>
                <p className="camba-h3 text-foreground mt-0.5">{section.title}</p>
                {section.skillName && (
                  <p className="camba-caption text-program font-medium mt-1 capitalize">
                    {section.skillName}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 camba-caption text-muted">
                <span className="inline-flex items-center gap-1">
                  <FileQuestion className="h-3.5 w-3.5" />
                  {labels.sectionQuestions.replace(
                    "{count}",
                    String(section.questionCount)
                  )}
                </span>
                {section.timeLimitMinutes != null && section.timeLimitMinutes > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {labels.sectionMinutes.replace(
                      "{minutes}",
                      String(section.timeLimitMinutes)
                    )}
                  </span>
                )}
              </div>
            </div>
          </CambaCard>
        ))}
      </div>
    </section>
  );
}
