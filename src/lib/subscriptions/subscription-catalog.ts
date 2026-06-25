import type {
  SubscriptionProgramCatalog,
  SubscriptionTier,
  BillingPeriod,
} from "@/lib/subscriptions/subscription-types";

export const AI_DAILY_LIMITS: Record<SubscriptionTier, number> = {
  free: 1,
  pro: 5,
  vip: 10,
};

export const TIER_ORDER: Record<SubscriptionTier, number> = {
  free: 0,
  pro: 1,
  vip: 2,
};

function yearlySavingsPercent(monthlyVnd: number, yearlyVnd: number): number {
  const fullYearMonthly = monthlyVnd * 12;
  if (fullYearMonthly <= 0) return 0;
  return Math.round(((fullYearMonthly - yearlyVnd) / fullYearMonthly) * 100);
}

const PRO_MONTHLY = 50_000;
const PRO_YEARLY = 500_000;
const VIP_MONTHLY = 90_000;
const VIP_YEARLY = 900_000;

function buildTierPlans(): SubscriptionProgramCatalog["plans"] {
  return [
    {
      tier: "free",
      monthlyPriceVnd: null,
      yearlyPriceVnd: null,
      yearlySavingsPercent: null,
      dailyAiLimit: AI_DAILY_LIMITS.free,
      isPaid: false,
    },
    {
      tier: "pro",
      monthlyPriceVnd: PRO_MONTHLY,
      yearlyPriceVnd: PRO_YEARLY,
      yearlySavingsPercent: yearlySavingsPercent(PRO_MONTHLY, PRO_YEARLY),
      dailyAiLimit: AI_DAILY_LIMITS.pro,
      isPaid: true,
    },
    {
      tier: "vip",
      monthlyPriceVnd: VIP_MONTHLY,
      yearlyPriceVnd: VIP_YEARLY,
      yearlySavingsPercent: yearlySavingsPercent(VIP_MONTHLY, VIP_YEARLY),
      dailyAiLimit: AI_DAILY_LIMITS.vip,
      isPaid: true,
    },
  ];
}

export const SUBSCRIPTION_PROGRAMS: SubscriptionProgramCatalog[] = [
  {
    id: "cambridge",
    nameKey: "programs.cambridge.name",
    descriptionKey: "programs.cambridge.description",
    plans: buildTierPlans(),
  },
  {
    id: "speaking_writing",
    nameKey: "programs.speakingWriting.name",
    descriptionKey: "programs.speakingWriting.description",
    plans: buildTierPlans(),
  },
];

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

export function getPlanPriceVnd(
  tier: Exclude<SubscriptionTier, "free">,
  period: BillingPeriod
): number {
  if (tier === "pro") {
    return period === "yearly" ? PRO_YEARLY : PRO_MONTHLY;
  }
  return period === "yearly" ? VIP_YEARLY : VIP_MONTHLY;
}
