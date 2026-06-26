import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowRight } from "lucide-react";

interface PlacementTestCTAProps {
  title: string;
  description: string;
  buttonText: string;
  compact?: boolean;
}

export function PlacementTestCTA({
  title,
  description,
  buttonText,
  compact = false,
}: PlacementTestCTAProps) {
  return (
    <CambaCard variant="hero" padding={compact ? "sm" : "md"} className="border-program/25">
      <div className="flex items-center gap-3">
        <div className={compact ? "camba-icon-box bg-program text-white shrink-0" : "camba-icon-box-lg camba-gradient-program text-white shrink-0"}>
          <ClipboardList className={compact ? "h-5 w-5" : "h-6 w-6"} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={compact ? "camba-body font-semibold text-foreground" : "camba-h3 text-foreground"}>
            {title}
          </h3>
          {!compact && <p className="camba-body text-muted mt-1">{description}</p>}
        </div>
        <Link href="/placement-test" className="shrink-0">
          <Button variant="quest" size={compact ? "sm" : "default"}>
            {buttonText}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </CambaCard>
  );
}
