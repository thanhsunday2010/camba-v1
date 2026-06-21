import { Link } from "@/i18n/routing";
import { LearningLockHint } from "@/components/learning/learning-lock-hint";
import { Button } from "@/components/ui/button";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Lock, ArrowLeft } from "lucide-react";

interface LessonLockedStateProps {
  labels: {
    lockedTitle: string;
    lockedDescription: string;
    backToPath: string;
    lockedHint: string;
    lockContinueLabel?: string;
  };
  continueLessonHref?: string | null;
}

export function LessonLockedState({ labels, continueLessonHref }: LessonLockedStateProps) {
  return (
    <div className="camba-section-stack py-6 sm:py-10">
      <Link
        href="/learning"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-program hover:underline w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {labels.backToPath}
      </Link>

      <CambaCard variant="elevated" padding="lg" className="text-center max-w-lg mx-auto mt-4">
        <div className="camba-icon-box-lg mx-auto bg-[var(--surface-sunken)] text-[var(--status-locked)]">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="camba-h2 text-foreground mt-4">{labels.lockedTitle}</h1>
        <p className="camba-body text-muted mt-2 max-w-md mx-auto">{labels.lockedDescription}</p>
        <LearningLockHint
          message={labels.lockedHint}
          continueHref={continueLessonHref ?? undefined}
          continueLabel={
            continueLessonHref && labels.lockContinueLabel
              ? labels.lockContinueLabel
              : undefined
          }
          className="mt-4 text-left"
        />
        <Button variant="outline" className="w-full sm:w-auto mt-6" asChild>
          <Link href="/learning">{labels.backToPath}</Link>
        </Button>
      </CambaCard>
    </div>
  );
}
