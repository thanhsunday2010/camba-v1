import type {
  BillingPeriod,
  SubscriptionProgram,
  SubscriptionTier,
} from "@/lib/subscriptions/subscription-types";

export type PaymentOrderStatus = "pending" | "paid" | "expired" | "cancelled";

export interface AdminPaymentOrderRow {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  orderCode: string;
  program: SubscriptionProgram;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod;
  amountVnd: number;
  status: PaymentOrderStatus;
  sepayTransactionId: number | null;
  paidAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface AdminWebhookEventRow {
  sepayId: number;
  orderCode: string | null;
  receivedAt: string;
  payload: Record<string, unknown>;
}

export interface AdminPlanDisplayRow {
  program: SubscriptionProgram;
  programLabel: string;
  tier: SubscriptionTier;
  tierLabel: string;
  monthlyPriceVnd: number | null;
  yearlyPriceVnd: number | null;
  yearlySavingsPercent: number | null;
  dailyAiLimit: number;
  isPaid: boolean;
}

export interface AdminUserSubscriptionRow {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  program: SubscriptionProgram;
  tier: SubscriptionTier;
  billingPeriod: BillingPeriod | null;
  status: string;
  currentPeriodEnd: string | null;
  updatedAt: string;
}
