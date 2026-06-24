import type { MockTestFormatMetadata } from "@/lib/mock-tests/mock-test-format";
import { Mic, PenLine, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface MockAiSkillBadgesProps {
  format: MockTestFormatMetadata;
  labels: {
    writingAi: string;
    speakingAi: string;
    goldCertified?: string;
  };
  isGoldMock?: boolean;
  className?: string;
}

export function MockAiSkillBadges({
  format,
  labels,
  isGoldMock,
  className,
}: MockAiSkillBadgesProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)} aria-label="Exam features">
      {isGoldMock && labels.goldCertified && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-badge)]/15 px-2 py-0.5 camba-caption font-bold text-[var(--color-badge)] border border-[var(--color-badge)]/25">
          <Sparkles className="h-3 w-3" aria-hidden />
          {labels.goldCertified}
        </span>
      )}
      {format.includesWriting && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--status-writing)]/10 px-2 py-0.5 camba-caption font-semibold text-[var(--status-writing)]">
          <PenLine className="h-3 w-3" aria-hidden />
          {labels.writingAi}
        </span>
      )}
      {format.includesSpeaking && (
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--status-speaking)]/10 px-2 py-0.5 camba-caption font-semibold text-[var(--status-speaking)]">
          <Mic className="h-3 w-3" aria-hidden />
          {labels.speakingAi}
        </span>
      )}
    </div>
  );
}
