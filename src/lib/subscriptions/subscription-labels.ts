import type { SubscriptionPricingLabels } from "@/components/subscriptions/subscription-pricing-view";
import type { AiLimitDialogLabels } from "@/components/subscriptions/ai-limit-dialog";

export function buildSubscriptionPricingLabels(
  t: (key: string) => string
): SubscriptionPricingLabels {
  return {
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    currentTier: t("currentTier"),
    programs: {
      cambridge: {
        name: t("programs.cambridge.name"),
        description: t("programs.cambridge.description"),
      },
      speakingWriting: {
        name: t("programs.speakingWriting.name"),
        description: t("programs.speakingWriting.description"),
      },
    },
    features: {
      accessAll: t("features.accessAll"),
      aiLimit: t("features.aiLimit"),
    },
    planCard: {
      free: t("tiers.free"),
      pro: t("tiers.pro"),
      vip: t("tiers.vip"),
      perMonth: t("pricing.perMonth"),
      perYear: t("pricing.perYear"),
      yearlyBadge: t("pricing.yearlyBadge"),
      yearlySavings: t("pricing.yearlySavings"),
      monthlyOption: t("pricing.monthlyOption"),
      aiLimit: t("features.aiLimit"),
      accessAll: t("features.accessAll"),
      currentPlan: t("pricing.currentPlan"),
      subscribe: t("pricing.subscribe"),
      recommended: t("pricing.recommended"),
    },
    aiUsage: {
      label: t("aiUsage.label"),
      remaining: t("aiUsage.remaining"),
    },
    subscribeToast: t("pricing.subscribeToast"),
    checkout: {
      title: t("checkout.title"),
      description: t("checkout.description"),
      amount: t("checkout.amount"),
      transferMemo: t("checkout.transferMemo"),
      bankAccount: t("checkout.bankAccount"),
      bankName: t("checkout.bankName"),
      accountHolder: t("checkout.accountHolder"),
      scanHint: t("checkout.scanHint"),
      waiting: t("checkout.waiting"),
      paid: t("checkout.paid"),
      expired: t("checkout.expired"),
      copyCode: t("checkout.copyCode"),
      copied: t("checkout.copied"),
      close: t("checkout.close"),
      error: t("checkout.error"),
    },
  };
}

export function buildAiLimitDialogLabels(t: (key: string) => string): AiLimitDialogLabels {
  return {
    freeTitle: t("limitDialog.freeTitle"),
    freeDescription: t("limitDialog.freeDescription"),
    proTitle: t("limitDialog.proTitle"),
    proDescription: t("limitDialog.proDescription"),
    vipTitle: t("limitDialog.vipTitle"),
    vipDescription: t("limitDialog.vipDescription"),
    usageSummary: t("limitDialog.usageSummary"),
    subscribeCta: t("limitDialog.subscribeCta"),
    upgradeCta: t("limitDialog.upgradeCta"),
    close: t("limitDialog.close"),
  };
}

export function buildAiUsageBadgeLabels(t: (key: string) => string) {
  return {
    label: t("aiUsage.label"),
    remaining: t("aiUsage.remaining"),
  };
}
