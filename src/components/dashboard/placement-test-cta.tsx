import { Link } from "@/i18n/routing";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { ClipboardList, ArrowRight } from "lucide-react";

interface PlacementTestCTAProps {
  title: string;
  description: string;
  buttonText: string;
}

export function PlacementTestCTA({
  title,
  description,
  buttonText,
}: PlacementTestCTAProps) {
  return (
    <CambaCard variant="hero" padding="md" className="border-program/25">
      <div className="flex items-start gap-4">
        <div className="camba-icon-box-lg camba-gradient-program text-white shrink-0">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="camba-h3 text-foreground">{title}</h3>
          <p className="camba-body text-muted mt-1">{description}</p>
          <Link href="/placement-test" className="inline-block mt-4">
            <Button variant="quest">
              {buttonText}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </CambaCard>
  );
}
