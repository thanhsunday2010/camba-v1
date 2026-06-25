"use client";

import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { Mic, PenLine, Sparkles } from "lucide-react";

interface DashboardAiPracticeSectionProps {
  labels: {
    title: string;
    subtitle: string;
    writingTitle: string;
    writingDesc: string;
    speakingTitle: string;
    speakingDesc: string;
    start: string;
    aiBadge: string;
  };
}

export function DashboardAiPracticeSection({ labels }: DashboardAiPracticeSectionProps) {
  return (
    <section className="space-y-4" aria-labelledby="ai-practice-heading">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-program" />
          <h2 id="ai-practice-heading" className="camba-h3 text-foreground">
            {labels.title}
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-wide bg-program/10 text-program px-2 py-0.5 rounded-full">
            {labels.aiBadge}
          </span>
        </div>
        <p className="camba-body text-muted">{labels.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CambaCard variant="lesson" padding="md" className="h-full flex flex-col">
          <div className="flex items-start gap-3 flex-1">
            <div className="rounded-xl bg-program/10 p-2.5">
              <PenLine className="h-5 w-5 text-program" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{labels.writingTitle}</h3>
              <p className="text-sm text-muted mt-1">{labels.writingDesc}</p>
            </div>
          </div>
          <Link href="/practice/writing" className="mt-4 block">
            <Button className="w-full">{labels.start}</Button>
          </Link>
        </CambaCard>

        <CambaCard variant="lesson" padding="md" className="h-full flex flex-col">
          <div className="flex items-start gap-3 flex-1">
            <div className="rounded-xl bg-program/10 p-2.5">
              <Mic className="h-5 w-5 text-program" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{labels.speakingTitle}</h3>
              <p className="text-sm text-muted mt-1">{labels.speakingDesc}</p>
            </div>
          </div>
          <Link href="/practice/speaking" className="mt-4 block">
            <Button className="w-full">{labels.start}</Button>
          </Link>
        </CambaCard>
      </div>
    </section>
  );
}
