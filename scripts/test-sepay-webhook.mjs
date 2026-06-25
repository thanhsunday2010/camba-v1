#!/usr/bin/env node
/**
 * Dev helper: simulate a SePay incoming-transfer webhook.
 *
 * Usage:
 *   node scripts/test-sepay-webhook.mjs
 *   node scripts/test-sepay-webhook.mjs --order CAMBA1A2B3C4D
 *   node scripts/test-sepay-webhook.mjs --url https://xxxx.ngrok-free.app/api/webhooks/sepay
 *
 * Requires .env.local with Supabase + SEPAY_* (bank account/name at minimum).
 * Creates a pending payment order for student@camba.me when --order is omitted.
 */

import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv, loadEnvFile } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { order: null, url: "http://localhost:3000/api/webhooks/sepay", amount: null };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === "--order" && argv[i + 1]) {
      args.order = argv[++i].toUpperCase();
    } else if (argv[i] === "--url" && argv[i + 1]) {
      args.url = argv[++i].replace(/\/$/, "") + (argv[i].includes("/api/webhooks/sepay") ? "" : "/api/webhooks/sepay");
    } else if (argv[i] === "--amount" && argv[i + 1]) {
      args.amount = Number(argv[++i]);
    }
  }
  if (!args.url.endsWith("/api/webhooks/sepay")) {
    args.url = `${args.url.replace(/\/$/, "")}/api/webhooks/sepay`;
  }
  return args;
}

function sepayPrefix() {
  return (process.env.SEPAY_PAYMENT_CODE_PREFIX?.trim() || "CAMBA").toUpperCase();
}

async function ensureTables(admin) {
  const { error } = await admin.from("subscription_payment_orders").select("id").limit(1);
  if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
    throw new Error(
      "Bảng subscription_payment_orders chưa tồn tại.\n" +
        "Chạy migration: supabase/migrations/014_sepay_payments.sql trên Supabase SQL Editor."
    );
  }
  if (error) throw new Error(`DB check failed: ${error.message}`);
}

async function getTestUserId(admin) {
  const email = "student@camba.me";
  const { data, error } = await admin.auth.admin.listUsers({ perPage: 200 });
  if (error) throw new Error(error.message);
  const user = data.users.find((u) => u.email === email);
  if (!user) throw new Error(`Không tìm thấy ${email}. Chạy: npm run seed:test-users`);
  return user.id;
}

async function createPendingOrder(admin, userId) {
  const prefix = sepayPrefix();
  const orderCode = `${prefix}${randomBytes(4).toString("hex").toUpperCase()}`;
  const amountVnd = 50_000;
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const { error } = await admin.from("subscription_payment_orders").insert({
    user_id: userId,
    order_code: orderCode,
    program: "cambridge",
    tier: "pro",
    billing_period: "monthly",
    amount_vnd: amountVnd,
    status: "pending",
    expires_at: expiresAt,
  });

  if (error) throw new Error(`Create order failed: ${error.message}`);
  return { orderCode, amountVnd };
}

async function loadOrder(admin, orderCode) {
  const { data, error } = await admin
    .from("subscription_payment_orders")
    .select("*")
    .eq("order_code", orderCode)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Order not found: ${orderCode}`);
  return data;
}

function buildPayload(order, sepayId) {
  const bankAccount = process.env.SEPAY_BANK_ACCOUNT?.trim() || "0000000000";
  return {
    id: sepayId,
    gateway: "TestBank",
    transactionDate: new Date().toISOString().slice(0, 19).replace("T", " "),
    accountNumber: bankAccount,
    subAccount: null,
    code: order.order_code,
    content: `CK ${order.order_code} Camba test`,
    transferType: "in",
    description: "Test webhook",
    transferAmount: order.amount_vnd,
    accumulated: order.amount_vnd,
    referenceCode: `TEST${sepayId}`,
  };
}

async function main() {
  loadEnvFile(resolve(ROOT, ".env.local"), { overwrite: true });
  const args = parseArgs(process.argv);

  const liveFlag = process.env.SEPAY_LIVE?.trim().toLowerCase();
  const isLive = liveFlag === "true" || liveFlag === "1";
  if (isLive && !process.argv.includes("--simulate")) {
    console.error(
      "SEPAY_LIVE=true — script giả lập bị tắt.\n" +
        "Thanh toán thật: /subscriptions → quét QR → chuyển khoản.\n" +
        "Chỉ dùng --simulate khi debug (không kích hoạt gói thật ngoài ý muốn)."
    );
    process.exit(1);
  }

  if (!process.env.SEPAY_BANK_ACCOUNT || !process.env.SEPAY_BANK_NAME) {
    console.warn(
      "⚠ SEPAY_BANK_ACCOUNT / SEPAY_BANK_NAME chưa có trong .env.local.\n" +
        "  Webhook vẫn test được nếu dev server đã cấu hình Sepay.\n"
    );
  }

  const { url, key } = createSupabaseFromEnv(ROOT);
  const admin = createClient(url, key, { auth: { persistSession: false } });

  await ensureTables(admin);

  let order;
  if (args.order) {
    order = await loadOrder(admin, args.order);
    console.log("Using existing order:", order.order_code, `(${order.status})`);
  } else {
    const userId = await getTestUserId(admin);
    const created = await createPendingOrder(admin, userId);
    order = await loadOrder(admin, created.orderCode);
    console.log("Created pending order:", order.order_code, "amount:", order.amount_vnd);
  }

  if (order.status === "paid") {
    console.log("Order already paid — nothing to test.");
    return;
  }

  const sepayId = Math.floor(Date.now() / 1000);
  const payload = buildPayload(order, sepayId);
  if (args.amount != null) payload.transferAmount = args.amount;

  const headers = { "Content-Type": "application/json" };
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY?.trim();
  if (apiKey) {
    headers.Authorization = `Apikey ${apiKey}`;
  }

  console.log("POST", args.url);
  const response = await fetch(args.url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const bodyText = await response.text();
  console.log("Status:", response.status);
  console.log("Body:", bodyText);

  if (!response.ok) {
    process.exit(1);
  }

  const updated = await loadOrder(admin, order.order_code);
  console.log("Order status after webhook:", updated.status, updated.paid_at ?? "");

  const { data: sub } = await admin
    .from("user_subscriptions")
    .select("program, tier, status, current_period_end")
    .eq("user_id", order.user_id)
    .eq("program", order.program)
    .maybeSingle();

  if (sub) {
    console.log("Subscription:", sub);
  } else {
    console.log("No subscription row yet for program", order.program);
  }
}

main().catch((err) => {
  console.error("Test failed:", err.message);
  process.exit(1);
});
