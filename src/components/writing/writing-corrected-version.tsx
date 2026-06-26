"use client";

import { CambaCard } from "@/components/camba/primitives/camba-card";
import { CorrectionMarkupText } from "@/components/ai/correction-markup-text";

type WritingCorrectedVersionProps = {
  text: string;
  title?: string;
};

export function WritingCorrectedVersion({
  text,
  title = "Suggested improved version",
}: WritingCorrectedVersionProps) {
  return (
    <CambaCard variant="default" padding="md" className="border-dashed border-green-200/80 bg-green-50/30">
      <p className="camba-caption font-medium text-green-900 mb-2">{title}</p>
      <p className="camba-body text-foreground/90">
        <CorrectionMarkupText text={text} />
      </p>
    </CambaCard>
  );
}
