"use client";

import { CambaCard } from "@/components/camba/primitives/camba-card";

type SpeakingTranscriptCardProps = {
  transcript: string;
  title?: string;
};

export function SpeakingTranscriptCard({
  transcript,
  title = "Transcript",
}: SpeakingTranscriptCardProps) {
  return (
    <CambaCard variant="default" padding="md" className="bg-[var(--surface-sunken)]/30">
      <p className="camba-caption font-medium text-muted mb-2">{title}</p>
      <p className="camba-body text-foreground/90 whitespace-pre-wrap">{transcript}</p>
    </CambaCard>
  );
}
