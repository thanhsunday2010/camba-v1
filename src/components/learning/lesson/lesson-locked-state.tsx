import { Link } from "@/i18n/routing";
import { LearningLockHint } from "@/components/learning/learning-lock-hint";
import { Button } from "@/components/ui/button";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Lock } from "lucide-react";

interface LessonLockedStateProps {
  labels: {
    lockedTitle: string;
    lockedDescription: string;
    backToPath: string;
    lockedHint: string;
  };
}

export function LessonLockedState({ labels }: LessonLockedStateProps) {
  return (
    <div className="camba-section-stack py-8">
      <CambaCard variant="elevated" padding="lg" className="text-center max-w-lg mx-auto">
        <div className="camba-icon-box-lg mx-auto bg-[var(--surface-sunken)] text-[var(--status-locked)]">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="camba-h2 text-foreground mt-4">{labels.lockedTitle}</h1>
        <p className="camba-body text-muted mt-2">{labels.lockedDescription}</p>
        <LearningLockHint message={labels.lockedHint} className="mt-4 text-left" />
        <Link href="/learning" className="inline-block mt-6">
          <Button variant="outline">{labels.backToPath}</Button>
        </Link>
      </CambaCard>
    </div>
  );
}
