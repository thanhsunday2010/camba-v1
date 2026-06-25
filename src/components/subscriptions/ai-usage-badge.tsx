import type { AiUsageStatus } from "@/lib/subscriptions/subscription-types";
import { Sparkles } from "lucide-react";

interface AiUsageBadgeProps {
  aiUsage: AiUsageStatus;
  labels: {
    label: string;
    remaining: string;
  };
}

export function AiUsageBadge({ aiUsage, labels }: AiUsageBadgeProps) {
  const isLow = aiUsage.remaining <= 1;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ${
        isLow ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-program-muted text-program"
      }`}
    >
      <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
      <span>
        {labels.label
          .replace("{used}", String(aiUsage.usedToday))
          .replace("{limit}", String(aiUsage.dailyLimit))}
      </span>
      <span className="text-xs opacity-80">
        ({labels.remaining.replace("{count}", String(aiUsage.remaining))})
      </span>
    </div>
  );
}
