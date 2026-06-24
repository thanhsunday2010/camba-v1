"use client";

import Image from "next/image";
import type { WritingSubmission } from "@/lib/writing/writing-types";
import { getWritingTaskLabel } from "@/lib/writing/writing-utils";
import { CambaCard } from "@/components/camba/primitives/camba-card";

type WritingSubmissionPreviewProps = {
  submission: WritingSubmission;
  promptText?: string;
  imageUrl?: string;
};

function formatSubmittedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function WritingSubmissionPreview({
  submission,
  promptText,
  imageUrl,
}: WritingSubmissionPreviewProps) {
  return (
    <CambaCard variant="default" padding="md" className="space-y-4">
      {submission.taskType && (
        <p className="camba-caption font-medium uppercase tracking-wide text-program">
          {getWritingTaskLabel(submission.taskType)}
        </p>
      )}
      {promptText && (
        <div className="space-y-1">
          <p className="camba-caption text-muted">Prompt</p>
          <p className="camba-body text-foreground/90">{promptText}</p>
        </div>
      )}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={640}
          height={360}
          className="max-w-full h-auto rounded-xl border border-border/50"
        />
      )}
      <div className="space-y-2">
        <p className="camba-caption text-muted">Your answer</p>
        <div className="rounded-xl border border-border/60 bg-[var(--surface-sunken)]/40 px-3 py-3">
          <p className="camba-body text-foreground whitespace-pre-wrap">{submission.responseText}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 camba-caption text-muted">
        <span>Words: {submission.wordCount}</span>
        <span>Submitted: {formatSubmittedAt(submission.submittedAt)}</span>
      </div>
    </CambaCard>
  );
}
