"use client";

import { useState } from "react";
import { toast } from "sonner";
import { StudentPageShell } from "@/components/camba";
import { SectionHeader } from "@/components/camba/section-header";
import {
  SubscriptionPlanCard,
  type SubscriptionPlanCardLabels,
} from "@/components/subscriptions/subscription-plan-card";
import {
  SubscriptionCheckoutDialog,
  type SubscriptionCheckoutLabels,
} from "@/components/subscriptions/subscription-checkout-dialog";
import { AiUsageBadge } from "@/components/subscriptions/ai-usage-badge";
import type { SubscriptionProgramCatalog } from "@/lib/subscriptions/subscription-types";
import type { UserSubscriptionStatus } from "@/lib/subscriptions/subscription-types";
import type { BillingPeriod, SubscriptionProgram, SubscriptionTier } from "@/lib/subscriptions/subscription-types";
import { CreditCard } from "lucide-react";

export type SubscriptionPricingLabels = {
  pageTitle: string;
  pageSubtitle: string;
  currentTier: string;
  programs: {
    cambridge: { name: string; description: string };
    speakingWriting: { name: string; description: string };
  };
  features: {
    accessAll: string;
    aiLimit: string;
  };
  planCard: SubscriptionPlanCardLabels;
  aiUsage: {
    label: string;
    remaining: string;
  };
  subscribeToast: string;
  checkout: SubscriptionCheckoutLabels;
};

interface SubscriptionPricingViewProps {
  catalog: SubscriptionProgramCatalog[];
  status: UserSubscriptionStatus;
  labels: SubscriptionPricingLabels;
  paymentsEnabled: boolean;
}

const PROGRAM_NAME_KEYS: Record<SubscriptionProgram, keyof SubscriptionPricingLabels["programs"]> = {
  cambridge: "cambridge",
  speaking_writing: "speakingWriting",
};

export function SubscriptionPricingView({
  catalog,
  status,
  labels,
  paymentsEnabled,
}: SubscriptionPricingViewProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutRequest, setCheckoutRequest] = useState<{
    program: SubscriptionProgram;
    tier: Exclude<SubscriptionTier, "free">;
    billingPeriod: BillingPeriod;
  } | null>(null);

  function handleSubscribe(
    program: SubscriptionProgram,
    tier: SubscriptionTier,
    period: BillingPeriod
  ) {
    if (tier === "free") return;

    if (!paymentsEnabled) {
      toast.info(labels.subscribeToast);
      return;
    }

    setCheckoutRequest({ program, tier, billingPeriod: period });
    setCheckoutOpen(true);
  }

  const tierLabels: Record<SubscriptionTier, string> = {
    free: labels.planCard.free,
    pro: labels.planCard.pro,
    vip: labels.planCard.vip,
  };

  const programLabels: Record<SubscriptionProgram, string> = {
    cambridge: labels.programs.cambridge.name,
    speaking_writing: labels.programs.speakingWriting.name,
  };

  return (
    <StudentPageShell narrow>
      <div className="camba-section-stack gap-10">
        <header className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-program">
                <CreditCard className="h-6 w-6" aria-hidden />
                <span className="camba-caption font-bold uppercase tracking-wide">Camba</span>
              </div>
              <h1 className="camba-display text-foreground">{labels.pageTitle}</h1>
              <p className="camba-body text-muted max-w-2xl">{labels.pageSubtitle}</p>
            </div>
            <AiUsageBadge aiUsage={status.aiUsage} labels={labels.aiUsage} />
          </div>
          <p className="camba-caption font-semibold text-foreground">
            {labels.currentTier.replace("{tier}", labels.planCard[status.effectiveTier])}
          </p>
        </header>

        {catalog.map((programSection) => {
          const programKey = PROGRAM_NAME_KEYS[programSection.id];
          const programCopy = labels.programs[programKey];

          return (
            <section key={programSection.id} aria-labelledby={`program-${programSection.id}`}>
              <SectionHeader
                titleId={`program-${programSection.id}`}
                title={programCopy.name}
                description={programCopy.description}
              />
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                {programSection.plans.map((plan) => (
                  <SubscriptionPlanCard
                    key={`${programSection.id}-${plan.tier}`}
                    program={programSection.id}
                    programName={programCopy.name}
                    plan={plan}
                    labels={labels.planCard}
                    featureLabels={labels.features}
                    isCurrent={status.effectiveTier === plan.tier}
                    onSubscribe={handleSubscribe}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <SubscriptionCheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        request={checkoutRequest}
        labels={labels.checkout}
        tierLabels={tierLabels}
        programLabels={programLabels}
      />
    </StudentPageShell>
  );
}
