import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Lock, ArrowRight } from "lucide-react";

interface LearningLockHintProps {
  message: string;
  continueHref?: string;
  continueLabel?: string;
  compact?: boolean;
  className?: string;
}

export function LearningLockHint({
  message,
  continueHref,
  continueLabel,
  compact,
  className,
}: LearningLockHintProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--status-locked)]/15 bg-[var(--surface-sunken)]/60",
        compact ? "px-3 py-2" : "px-3 py-2.5",
        className
      )}
    >
      <div className="flex items-start gap-2">
        <Lock className="h-3.5 w-3.5 shrink-0 text-[var(--status-locked)] mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="camba-caption text-muted leading-snug">{message}</p>
          {continueHref && continueLabel && (
            <Link
              href={continueHref}
              className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-program hover:underline"
            >
              {continueLabel}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
