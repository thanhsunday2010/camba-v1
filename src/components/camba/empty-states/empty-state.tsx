import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";
import { EMPTY_STATE_A11Y } from "@/lib/design/empty-state-guidelines";

export type EmptyStateVariant = "feature" | "compact" | "inline" | "minimal";

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: EmptyStateVariant;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
  titleId?: string;
}

function EmptyStateActionButton({
  action,
  variant,
  isSecondary,
}: {
  action: EmptyStateAction;
  variant: EmptyStateVariant;
  isSecondary?: boolean;
}) {
  const buttonVariant =
    isSecondary ? "outline" : variant === "feature" ? "quest" : "default";
  const size = variant === "inline" || variant === "minimal" ? "sm" : "lg";

  if (action.href) {
    return (
      <Link href={action.href} className="camba-focus-ring rounded-xl">
        <Button variant={buttonVariant} size={size}>
          {action.label}
        </Button>
      </Link>
    );
  }

  return (
    <Button variant={buttonVariant} size={size} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

const VARIANT_STYLES: Record<
  EmptyStateVariant,
  { container: string; iconBox: string; title: string; showSparkle: boolean }
> = {
  feature: {
    container:
      "relative overflow-hidden rounded-2xl border border-dashed border-program/25 bg-gradient-to-br from-program-muted/40 via-white to-[var(--color-xp)]/5 px-5 py-10 sm:px-8 text-center",
    iconBox:
      "flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white shadow-md ring-2 ring-program/10 text-program",
    title: "camba-h3 text-foreground",
    showSparkle: true,
  },
  compact: {
    container:
      "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-program-muted/30 px-5 py-8 sm:px-6 text-center",
    iconBox:
      "flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm text-program",
    title: "camba-h3 text-foreground",
    showSparkle: false,
  },
  inline: {
    container: "rounded-2xl border border-dashed border-program/20 bg-white/60 px-4 py-4 sm:px-5",
    iconBox: "camba-icon-box bg-program-muted text-program",
    title: "camba-h3 text-foreground",
    showSparkle: false,
  },
  minimal: {
    container:
      "rounded-xl border border-dashed border-border bg-[var(--surface-sunken)]/40 px-4 py-5 text-center",
    iconBox: "mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-program/10 text-program",
    title: "camba-h3 text-foreground",
    showSparkle: false,
  },
};

/** Base empty state — title, explanation, actions, Cambridge-themed visuals. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  variant = "compact",
  primaryAction,
  secondaryAction,
  className,
  titleId,
}: EmptyStateProps) {
  const styles = VARIANT_STYLES[variant];
  const headingId = titleId ?? "empty-state-title";

  const actions = (primaryAction || secondaryAction) && (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        variant === "inline" ? "mt-3" : "mt-5 sm:mt-6 justify-center"
      )}
    >
      {primaryAction && (
        <EmptyStateActionButton action={primaryAction} variant={variant} />
      )}
      {secondaryAction && (
        <EmptyStateActionButton
          action={secondaryAction}
          variant={variant}
          isSecondary
        />
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div
        className={cn(styles.container, className)}
        role={EMPTY_STATE_A11Y.role}
        aria-labelledby={headingId}
      >
        <div className="flex items-start gap-3">
          <div className={cn(styles.iconBox, "shrink-0")} aria-hidden>
            <Icon className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 id={headingId} className={styles.title}>
              {title}
            </h3>
            <p className="camba-caption text-muted mt-1 leading-relaxed">{description}</p>
            {actions}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(styles.container, className)}
      role={EMPTY_STATE_A11Y.role}
      aria-labelledby={headingId}
    >
      {variant === "feature" && (
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl camba-gradient-program"
          aria-hidden
        />
      )}
      <div
        className={cn(
          "relative flex flex-col",
          variant === "minimal" ? "items-center" : "items-center"
        )}
      >
        <div className={cn("relative", variant === "minimal" ? "mb-0" : "mb-4")}>
          <div className={styles.iconBox} aria-hidden>
            <Icon
              className={cn(variant === "feature" ? "h-9 w-9" : variant === "minimal" ? "h-5 w-5" : "h-8 w-8")}
              strokeWidth={1.5}
            />
          </div>
          {styles.showSparkle && (
            <Sparkles
              className="absolute -right-1 -top-1 h-5 w-5 text-[var(--color-badge)] camba-pulse-soft"
              aria-hidden
            />
          )}
        </div>
        <h3 id={headingId} className={styles.title}>
          {title}
        </h3>
        <p
          className={cn(
            "text-muted leading-relaxed",
            variant === "minimal" ? "camba-caption mt-1 max-w-sm" : "camba-body mt-2 max-w-md"
          )}
        >
          {description}
        </p>
        {actions}
      </div>
    </div>
  );
}

/** Prominent section empty state with gradient and quest CTA. */
export function FeatureEmptyState(props: Omit<EmptyStateProps, "variant">) {
  return <EmptyState {...props} variant="feature" />;
}

/** Compact card empty state for inline panels. */
export function InlineEmptyState(props: Omit<EmptyStateProps, "variant">) {
  return <EmptyState {...props} variant="inline" />;
}
