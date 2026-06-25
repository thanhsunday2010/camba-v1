export type SubscriptionTier = "free" | "pro" | "vip";

export type SubscriptionProgram = "cambridge" | "speaking_writing";

export type BillingPeriod = "monthly" | "yearly";

export type SubscriptionPlanId = `${SubscriptionProgram}_${SubscriptionTier}`;

export type AiUsageStatus = {
  tier: SubscriptionTier;
  usedToday: number;
  dailyLimit: number;
  remaining: number;
};

export type SubscriptionPlanPricing = {
  tier: SubscriptionTier;
  monthlyPriceVnd: number | null;
  yearlyPriceVnd: number | null;
  yearlySavingsPercent: number | null;
  dailyAiLimit: number;
  isPaid: boolean;
};

export type SubscriptionProgramCatalog = {
  id: SubscriptionProgram;
  nameKey: string;
  descriptionKey: string;
  plans: SubscriptionPlanPricing[];
};

export type UserSubscriptionStatus = {
  effectiveTier: SubscriptionTier;
  aiUsage: AiUsageStatus;
  activePrograms: SubscriptionProgram[];
};
