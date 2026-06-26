"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardCollapsibleSectionProps {
  title: string;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  expandLabel: string;
  collapseLabel: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  expandLabel,
  collapseLabel,
  action,
  children,
  className,
}: DashboardCollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const titleId = useId();
  const panelId = useId();

  return (
    <section aria-labelledby={titleId} className={className}>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 rounded-xl py-1 text-left camba-focus-ring"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {Icon ? (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-program-muted text-program">
              <Icon className="h-4 w-4" />
            </div>
          ) : null}
          <span id={titleId} className="camba-h3 text-foreground flex-1">
            {title}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")}
            aria-hidden
          />
          <span className="sr-only">{open ? collapseLabel : expandLabel}</span>
        </button>
        {open && action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {open && (
        <div id={panelId} className="mt-3">
          {children}
        </div>
      )}
    </section>
  );
}
