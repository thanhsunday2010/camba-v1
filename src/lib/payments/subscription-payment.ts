import { randomBytes } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSepayQrImageUrl, buildSepayTransferMemo } from "@/lib/payments/sepay-qr";
import { requireSepayConfig } from "@/lib/payments/sepay-config";
import { getPlanPriceVnd } from "@/lib/subscriptions/subscription-catalog";
import type {
  BillingPeriod,
  SubscriptionProgram,
  SubscriptionTier,
} from "@/lib/subscriptions/subscription-types";
import type { SepayWebhookPayload } from "@/lib/payments/sepay-webhook";
import { extractPaymentOrderCode } from "@/lib/payments/sepay-webhook";

const ORDER_TTL_MS = 24 * 60 * 60 * 1000;

export type PaymentOrderStatus = "pending" | "paid" | "expired" | "cancelled";

export type SubscriptionCheckoutSession = {
  orderCode: string;
  qrImageUrl: string;
  amountVnd: number;
  transferMemo: string;
  bankAccount: string;
  bankName: string;
  accountHolder: string | null;
  expiresAt: string;
  program: SubscriptionProgram;
  tier: Exclude<SubscriptionTier, "free">;
  billingPeriod: BillingPeriod;
};

type PaymentOrderRow = {
  id: string;
  user_id: string;
  order_code: string;
  program: SubscriptionProgram;
  tier: Exclude<SubscriptionTier, "free">;
  billing_period: BillingPeriod;
  amount_vnd: number;
  status: PaymentOrderStatus;
  expires_at: string;
  paid_at: string | null;
};

function generateOrderCode(prefix: string): string {
  const suffix = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}${suffix}`;
}

function addBillingPeriod(from: Date, period: BillingPeriod): Date {
  const end = new Date(from);
  if (period === "yearly") {
    end.setFullYear(end.getFullYear() + 1);
  } else {
    end.setMonth(end.getMonth() + 1);
  }
  return end;
}

export async function createSubscriptionPaymentOrder(params: {
  userId: string;
  program: SubscriptionProgram;
  tier: Exclude<SubscriptionTier, "free">;
  billingPeriod: BillingPeriod;
}): Promise<SubscriptionCheckoutSession> {
  const config = requireSepayConfig();
  const amountVnd = getPlanPriceVnd(params.tier, params.billingPeriod);
  const expiresAt = new Date(Date.now() + ORDER_TTL_MS).toISOString();

  const supabase = await createClient();
  let orderCode = generateOrderCode(config.paymentCodePrefix);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const { error } = await supabase.from("subscription_payment_orders").insert({
      user_id: params.userId,
      order_code: orderCode,
      program: params.program,
      tier: params.tier,
      billing_period: params.billingPeriod,
      amount_vnd: amountVnd,
      status: "pending",
      expires_at: expiresAt,
    } as never);

    if (!error) break;
    orderCode = generateOrderCode(config.paymentCodePrefix);
    if (attempt === 4) {
      throw new Error("Không thể tạo mã thanh toán. Vui lòng thử lại.");
    }
  }

  const transferMemo = buildSepayTransferMemo(orderCode, config);

  return {
    orderCode,
    qrImageUrl: buildSepayQrImageUrl({
      config,
      amountVnd,
      orderCode,
    }),
    amountVnd,
    transferMemo,
    bankAccount: config.bankAccount,
    bankName: config.bankName,
    accountHolder: config.accountHolder,
    expiresAt,
    program: params.program,
    tier: params.tier,
    billingPeriod: params.billingPeriod,
  };
}

export async function getSubscriptionPaymentOrderStatus(params: {
  userId: string;
  orderCode: string;
}): Promise<{ status: PaymentOrderStatus; paidAt: string | null } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscription_payment_orders")
    .select("status, paid_at, expires_at")
    .eq("user_id", params.userId)
    .eq("order_code", params.orderCode.toUpperCase())
    .maybeSingle();

  if (error || !data) return null;

  const row = data as {
    status: PaymentOrderStatus;
    paid_at: string | null;
    expires_at: string;
  };

  if (row.status === "pending" && new Date(row.expires_at).getTime() < Date.now()) {
    return { status: "expired", paidAt: null };
  }

  return { status: row.status, paidAt: row.paid_at };
}

async function activateSubscription(order: PaymentOrderRow): Promise<void> {
  const admin = createAdminClient();
  const now = new Date();
  const periodEnd = addBillingPeriod(now, order.billing_period);

  const { error } = await admin.from("user_subscriptions").upsert(
    {
      user_id: order.user_id,
      program: order.program,
      tier: order.tier,
      billing_period: order.billing_period,
      status: "active",
      current_period_end: periodEnd.toISOString(),
      updated_at: now.toISOString(),
    } as never,
    { onConflict: "user_id,program" }
  );

  if (error) {
    throw new Error(`Failed to activate subscription: ${error.message}`);
  }
}

export async function processSepayWebhook(payload: SepayWebhookPayload): Promise<{
  handled: boolean;
  reason?: string;
}> {
  if (payload.transferType !== "in") {
    return { handled: false, reason: "outgoing_transfer" };
  }

  const admin = createAdminClient();
  const config = requireSepayConfig();

  const { error: logError } = await admin.from("sepay_webhook_events").insert({
    sepay_id: payload.id,
    payload,
    order_code: extractPaymentOrderCode(payload, config.paymentCodePrefix),
  } as never);

  if (logError?.code === "23505") {
    return { handled: true, reason: "duplicate_event" };
  }

  if (logError) {
    throw new Error(`Failed to log webhook: ${logError.message}`);
  }

  const orderCode = extractPaymentOrderCode(payload, config.paymentCodePrefix);
  if (!orderCode) {
    return { handled: false, reason: "missing_order_code" };
  }

  const { data: orderData, error: orderError } = await admin
    .from("subscription_payment_orders")
    .select("*")
    .eq("order_code", orderCode)
    .maybeSingle();

  if (orderError) {
    throw new Error(`Failed to load order: ${orderError.message}`);
  }

  if (!orderData) {
    return { handled: false, reason: "order_not_found" };
  }

  const order = orderData as PaymentOrderRow;

  if (order.status === "paid") {
    return { handled: true, reason: "already_paid" };
  }

  if (order.status !== "pending") {
    return { handled: false, reason: "order_not_pending" };
  }

  if (new Date(order.expires_at).getTime() < Date.now()) {
    await admin
      .from("subscription_payment_orders")
      .update({ status: "expired", updated_at: new Date().toISOString() } as never)
      .eq("id", order.id);
    return { handled: false, reason: "order_expired" };
  }

  if (payload.transferAmount < order.amount_vnd) {
    return { handled: false, reason: "insufficient_amount" };
  }

  const paidAt = new Date().toISOString();
  const { error: updateError } = await admin
    .from("subscription_payment_orders")
    .update({
      status: "paid",
      paid_at: paidAt,
      sepay_transaction_id: payload.id,
      transfer_content: payload.content,
      updated_at: paidAt,
    } as never)
    .eq("id", order.id)
    .eq("status", "pending");

  if (updateError) {
    throw new Error(`Failed to mark order paid: ${updateError.message}`);
  }

  await activateSubscription(order);
  return { handled: true };
}
