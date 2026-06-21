"use client";

import { useTransition } from "react";
import { selectLevel } from "@/actions/programs";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

interface LevelOption {
  id: string;
  slug: string;
  name: string;
}

interface LearningLevelSwitcherProps {
  levels: LevelOption[];
  currentLevelId: string | null;
  labels: {
    title: string;
    selecting: string;
    current: string;
  };
  /** First-time level pick — refresh after select instead of full redirect */
  pickMode?: boolean;
}

export function LearningLevelSwitcher({
  levels,
  currentLevelId,
  labels,
  pickMode = false,
}: LearningLevelSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSelect(levelId: string) {
    if (levelId === currentLevelId || isPending) return;
    startTransition(async () => {
      const result = await selectLevel(levelId);
      if (result.success) {
        if (pickMode) {
          router.push("/learning");
        } else {
          router.refresh();
        }
      }
    });
  }

  if (levels.length <= 1) {
    const only = levels[0];
    if (!only) return null;
    return (
      <div className="flex items-center gap-2">
        <span className="camba-caption text-muted">{labels.title}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full camba-gradient-program px-3 py-1.5 text-xs font-bold text-white">
          {only.name}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="camba-caption font-semibold text-muted uppercase tracking-wide">
          {labels.title}
        </p>
        {isPending && (
          <span className="camba-caption text-program animate-pulse">{labels.selecting}</span>
        )}
      </div>
      <div
        className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory"
        role="listbox"
        aria-label={labels.title}
      >
        {levels.map((level) => {
          const isCurrent = level.id === currentLevelId;
          return (
            <button
              key={level.id}
              type="button"
              role="option"
              aria-selected={isCurrent}
              disabled={isPending}
              onClick={() => handleSelect(level.id)}
              className={cn(
                "snap-start shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold camba-focus-ring transition-all min-h-[var(--touch-target-min)]",
                isCurrent
                  ? "camba-gradient-program text-white shadow-md ring-2 ring-program/20"
                  : "bg-card border border-border text-muted hover:text-foreground hover:border-program/30"
              )}
            >
              {isCurrent && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />}
              <span>{level.name}</span>
              <span className="text-[10px] opacity-70 uppercase">{level.slug}</span>
            </button>
          );
        })}
      </div>
      <details className="sm:hidden group">
        <summary className="camba-caption text-muted flex items-center gap-1 cursor-pointer list-none">
          <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
          {labels.current}: {levels.find((l) => l.id === currentLevelId)?.name ?? "—"}
        </summary>
      </details>
    </div>
  );
}
