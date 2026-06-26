import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { ArrowLeft, Clock } from "lucide-react";

interface LessonPracticeLimitStateProps {
  labels: {
    title: string;
    description: string;
    usageSummary: string;
    backToPath: string;
    upgradeCta: string;
  };
}

export function LessonPracticeLimitState({ labels }: LessonPracticeLimitStateProps) {
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
        <div className="camba-icon-box-lg mx-auto bg-amber-50 text-amber-700">
          <Clock className="h-8 w-8" />
        </div>
        <h1 className="camba-h2 text-foreground mt-4">{labels.title}</h1>
        <p className="camba-body text-muted mt-2 max-w-md mx-auto">{labels.description}</p>
        <p className="camba-caption text-muted mt-3">{labels.usageSummary}</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/learning">{labels.backToPath}</Link>
          </Button>
          <Button asChild>
            <Link href="/subscriptions">{labels.upgradeCta}</Link>
          </Button>
        </div>
      </CambaCard>
    </div>
  );
}
