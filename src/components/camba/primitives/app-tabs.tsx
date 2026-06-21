"use client";

import { cn } from "@/lib/utils";

interface AppTab {
  id: string;
  label: string;
}

interface AppTabsProps {
  tabs: AppTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function AppTabs({ tabs, activeId, onChange, className }: AppTabsProps) {
  return (
    <div
      className={cn("flex gap-1 overflow-x-auto pb-1 -mx-1 px-1", className)}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-semibold camba-focus-ring transition-colors min-h-[var(--touch-target-min)] sm:min-h-9",
              active
                ? "camba-gradient-program text-white shadow-sm"
                : "bg-card border border-border text-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

interface InfoTooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

/** Lightweight tooltip — uses native title for zero-deps accessibility baseline */
export function InfoTooltip({ content, children, className }: InfoTooltipProps) {
  return (
    <span title={content} className={className} aria-label={content}>
      {children}
    </span>
  );
}
