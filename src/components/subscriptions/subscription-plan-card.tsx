"use client";

import { CambaCard } from "@/components/camba/primitives/camba-card";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/subscriptions/subscription-catalog";
import type {
  BillingPeriod,
  SubscriptionPlanPricing,
  SubscriptionProgram,
  SubscriptionTier,
} from "@/lib/subscriptions/subscription-types";
import { cn } from "@/lib/utils";
import { Check, Crown, Sparkles, Zap } from "lucide-react";

export type SubscriptionPlanCardLabels = {
  free: string;
  pro: string;
  vip: string;
  perMonth: string;
  perYear: string;
  yearlyBadge: string;
  yearlySavings: string;
  monthlyOption: string;
  aiLimit: string;
  accessAll: string;
  currentPlan: string;
  subscribe: string;
  recommended: string;
};

interface SubscriptionPlanCardProps {
  program: SubscriptionProgram;
  programName: string;
  plan: SubscriptionPlanPricing;
  labels: SubscriptionPlanCardLabels;
  featureLabels: {
    accessAll: string;
    aiLimit: string;
  };
  isCurrent?: boolean;
  onSubscribe?: (program: SubscriptionProgram, tier: SubscriptionTier, period: BillingPeriod) => void;
}

const TIER_ICONS = {
  free: Sparkles,
  pro: Zap,
  vip: Crown,
} as const;

export function SubscriptionPlanCard({
  program,
  programName,
  plan,
  labels,
  featureLabels,
  isCurrent = false,
  onSubscribe,
}: SubscriptionPlanCardProps) {
  const Icon = TIER_ICONS[plan.tier];
  const tierLabel = labels[plan.tier];
  const isRecommended = plan.tier === "pro";

  return (
    <CambaCard
      variant={plan.tier === "vip" ? "achievement" : plan.tier === "pro" ? "elevated" : "default"}
      padding="md"
      className={cn(
        "relative flex flex-col h-full",
        isRecommended && "ring-2 ring-program/40",
        isCurrent && "ring-2 ring-success/50"
      )}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-program px-3 py-0.5 text-xs font-bold text-white">
          {labels.recommended}
        </span>
      )}

      <div className="flex items-start gap-3 mb-4">
        <div
          className={cn(
            "camba-icon-box shrink-0",
            plan.tier === "vip"
              ? "bg-[var(--color-badge)]/15 text-[var(--color-badge)]"
              : plan.tier === "pro"
                ? "bg-program-muted text-program"
                : "bg-[var(--surface-sunken)] text-muted"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="camba-caption font-bold text-muted uppercase tracking-wide">{programName}</p>
          <h3 className="camba-h3 text-foreground">{tierLabel}</h3>
        </div>
      </div>

      <ul className="space-y-2 mb-5 flex-1">
        <li className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden />
          <span>{featureLabels.accessAll}</span>
        </li>
        <li className="flex items-start gap-2 text-sm">
          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" aria-hidden />
          <span>{featureLabels.aiLimit.replace("{count}", String(plan.dailyAiLimit))}</span>
        </li>
      </ul>

      {plan.isPaid && plan.yearlyPriceVnd != null && plan.monthlyPriceVnd != null ? (
        <div className="space-y-3 mb-4">
          <div className="rounded-xl border-2 border-program/30 bg-program-muted/30 p-3">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wide text-program">
                {labels.yearlyBadge}
              </span>
              {plan.yearlySavingsPercent != null && plan.yearlySavingsPercent > 0 && (
                <span className="text-xs font-semibold text-success">
                  {labels.yearlySavings.replace("{percent}", String(plan.yearlySavingsPercent))}
                </span>
              )}
            </div>
            <p className="camba-h2 text-foreground">
              {formatVnd(plan.yearlyPriceVnd)}
              <span className="camba-caption text-muted font-normal"> {labels.perYear}</span>
            </p>
            <Button
              className="w-full mt-3"
              variant={isRecommended ? "default" : "outline"}
              disabled={isCurrent}
              onClick={() => onSubscribe?.(program, plan.tier, "yearly")}
            >
              {isCurrent ? labels.currentPlan : labels.subscribe}
            </Button>
          </div>

          <div className="rounded-xl border border-border/60 p-3">
            <p className="camba-caption font-semibold text-muted mb-1">{labels.monthlyOption}</p>
            <p className="camba-body font-semibold text-foreground">
              {formatVnd(plan.monthlyPriceVnd)}
              <span className="camba-caption text-muted font-normal"> {labels.perMonth}</span>
            </p>
            <Button
              className="w-full mt-3"
              variant="ghost"
              size="sm"
              disabled={isCurrent}
              onClick={() => onSubscribe?.(program, plan.tier, "monthly")}
            >
              {labels.subscribe}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <p className="camba-h2 text-foreground mb-3">{labels.free}</p>
          <Button className="w-full" variant="outline" disabled={isCurrent}>
            {isCurrent ? labels.currentPlan : labels.free}
          </Button>
        </div>
      )}
    </CambaCard>
  );
}
