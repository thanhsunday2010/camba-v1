"use client";

import type { MockTestFormatMetadata } from "@/lib/mock-tests/mock-test-format";
import type { MockTestFormatLabels } from "@/lib/mock-tests/mock-test-types";
import { cn } from "@/lib/utils";
import { Headphones, Info, Layers, Sparkles } from "lucide-react";

interface MockTestFormatDisclosureProps {
  format: MockTestFormatMetadata;
  labels: MockTestFormatLabels;
  variant?: "compact" | "card";
  className?: string;
}

function listeningLabel(
  format: MockTestFormatMetadata,
  labels: MockTestFormatLabels
): string | null {
  switch (format.listeningMode) {
    case "none":
      return null;
    case "audio":
      return labels.listeningAudio;
    case "text":
      return labels.listeningText;
    case "mixed":
      return labels.listeningMixed;
  }
}

export function MockTestFormatDisclosure({
  format,
  labels,
  variant = "card",
  className,
}: MockTestFormatDisclosureProps) {
  const listening = listeningLabel(format, labels);
  const skills =
    format.includedSkillSlugs.length > 0
      ? format.includedSkillSlugs.join(", ")
      : labels.skillsIncludedFallback;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "rounded-lg border border-[var(--status-mock-test)]/20 bg-[var(--status-mock-test)]/5 px-3 py-2 space-y-1",
          className
        )}
      >
        <p className="camba-caption font-semibold text-[var(--status-mock-test)] flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0" />
          {labels.practiceMockBadge}
        </p>
        <p className="camba-caption text-muted">{labels.autoScoredNote}</p>
        {listening && (
          <p className="camba-caption text-muted flex items-center gap-1">
            <Headphones className="h-3 w-3 shrink-0" />
            {listening}
          </p>
        )}
        <p className="camba-caption text-muted">{labels.noSpeakingWriting}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-[var(--surface-sunken)]/50 p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <div className="camba-icon-box shrink-0 bg-[var(--status-mock-test)]/10 text-[var(--status-mock-test)]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h2 className="camba-h3 text-foreground">{labels.aboutTitle}</h2>
          <p className="camba-caption text-muted mt-0.5">{labels.aboutSubtitle}</p>
        </div>
      </div>

      <ul className="space-y-2 camba-caption text-foreground/90">
        <li className="flex items-start gap-2">
          <span className="font-semibold text-[var(--status-mock-test)] shrink-0">
            {labels.practiceMockBadge}
          </span>
          <span className="text-muted">{labels.practiceMockDescription}</span>
        </li>
        <li className="flex items-start gap-2">
          <Layers className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted" />
          <span>
            <span className="font-medium">{labels.skillsIncluded}:</span> {skills}
          </span>
        </li>
        {listening && (
          <li className="flex items-start gap-2">
            <Headphones className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted" />
            <span>
              <span className="font-medium">{labels.listeningLabel}:</span> {listening}
            </span>
          </li>
        )}
        <li className="text-muted">{labels.autoScoredNote}</li>
        <li className="text-muted">{labels.noSpeakingWriting}</li>
      </ul>
    </div>
  );
}

export function MockTestFormatBadges({
  format,
  labels,
  className,
}: {
  format: MockTestFormatMetadata;
  labels: MockTestFormatLabels;
  className?: string;
}) {
  const listening = listeningLabel(format, labels);

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <span className="inline-flex rounded-full bg-[var(--status-mock-test)]/15 px-2 py-0.5 camba-caption font-semibold text-[var(--status-mock-test)]">
        {labels.practiceMockBadge}
      </span>
      {listening && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface-sunken)] px-2 py-0.5 camba-caption font-medium text-muted">
          <Headphones className="h-3 w-3" />
          {listening}
        </span>
      )}
      <span className="inline-flex rounded-full bg-[var(--surface-sunken)] px-2 py-0.5 camba-caption font-medium text-muted">
        {labels.autoScoredShort}
      </span>
    </div>
  );
}
