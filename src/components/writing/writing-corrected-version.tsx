"use client";

import { CambaCard } from "@/components/camba/primitives/camba-card";

type WritingCorrectedVersionProps = {
  text: string;
  title?: string;
};

export function WritingCorrectedVersion({
  text,
  title = "Suggested improved version",
}: WritingCorrectedVersionProps) {
  return (
    <CambaCard variant="default" padding="md" className="border-dashed border-program/20 bg-program/[0.02]">
      <p className="camba-caption font-medium text-program mb-2">{title}</p>
      <p className="camba-body text-foreground/90 whitespace-pre-wrap">{text}</p>
    </CambaCard>
  );
}
