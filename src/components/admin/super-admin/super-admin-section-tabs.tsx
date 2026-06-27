"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface SuperAdminSectionTab<T extends string = string> {
  id: T;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface SuperAdminSectionTabsProps<T extends string> {
  tabs: SuperAdminSectionTab<T>[];
  active: T;
  onChange: (id: T) => void;
}

export function SuperAdminSectionTabs<T extends string>({
  tabs,
  active,
  onChange,
}: SuperAdminSectionTabsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs font-semibold",
                  isActive ? "bg-white/20 text-white" : "bg-amber-100 text-amber-900"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

interface SuperAdminSubTabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function SuperAdminSubTabs({ tabs, active, onChange }: SuperAdminSubTabsProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            tab.id === active
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
