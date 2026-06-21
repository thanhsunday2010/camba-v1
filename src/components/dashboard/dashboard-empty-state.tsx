import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

/** Richer empty state for dashboard sections — motivating, not blank */
export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-dashed border-program/25 bg-gradient-to-br from-program-muted/40 via-white to-[var(--color-xp)]/5 px-5 py-10 sm:px-8 text-center",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl camba-gradient-program"
        aria-hidden
      />
      <div className="relative flex flex-col items-center">
        <div className="relative mb-4">
          <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white shadow-md ring-2 ring-program/10 text-program">
            <Icon className="h-9 w-9" strokeWidth={1.5} />
          </div>
          <Sparkles
            className="absolute -right-1 -top-1 h-5 w-5 text-[var(--color-badge)] camba-pulse-soft"
            aria-hidden
          />
        </div>
        <h3 className="camba-h2 text-foreground">{title}</h3>
        <p className="camba-body text-muted mt-2 max-w-md leading-relaxed">{description}</p>
        {actionLabel && actionHref && (
          <Link href={actionHref} className="mt-6">
            <Button variant="quest" size="lg">
              {actionLabel}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
