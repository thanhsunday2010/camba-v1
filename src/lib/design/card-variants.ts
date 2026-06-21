import { cva, type VariantProps } from "class-variance-authority";

/** Shared CAMBA card surface variants */
export const cambaCardVariants = cva("rounded-2xl border text-card-foreground transition-colors", {
  variants: {
    variant: {
      default: "border-border bg-card shadow-sm",
      elevated: "border-border bg-[var(--surface-elevated)] shadow-md",
      hero: "border-program/20 camba-gradient-program-soft shadow-md",
      achievement: "border-[var(--color-badge)]/25 bg-[var(--color-badge)]/5 shadow-sm",
      mission: "border-program/20 bg-program-muted/50 shadow-sm",
      stat: "border-border bg-card shadow-sm",
      progress: "border-border bg-card shadow-sm",
      lesson: "border-border bg-card shadow-sm camba-card-interactive",
      mockTest: "border-[var(--status-mock-test)]/20 bg-card shadow-sm camba-card-interactive",
      empty: "border-dashed border-border bg-program-muted/25",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    },
    interactive: {
      true: "cursor-pointer camba-focus-ring",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    interactive: false,
  },
});

export type CambaCardVariant = VariantProps<typeof cambaCardVariants>["variant"];

export const bannerVariants = cva("rounded-xl border px-4 py-3 flex items-start gap-3", {
  variants: {
    tone: {
      success: "border-success/30 bg-success/10 text-foreground",
      warning: "border-warning/30 bg-warning/10 text-foreground",
      error: "border-error/30 bg-error/10 text-foreground",
      info: "border-[var(--info)]/30 bg-[var(--info)]/10 text-foreground",
      celebration: "border-program/30 camba-gradient-program-soft text-foreground",
      mastery: "border-success/35 bg-success/10 text-foreground",
      mission: "border-[var(--color-coins)]/30 bg-[var(--color-coins)]/10 text-foreground",
    },
  },
  defaultVariants: {
    tone: "info",
  },
});
