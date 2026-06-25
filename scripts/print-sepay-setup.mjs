#!/usr/bin/env node
/**
 * Print SePay live payment setup checklist and webhook URL.
 * Usage: node scripts/print-sepay-setup.mjs
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFile } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function isLiveMode(env) {
  const key = env.SEPAY_WEBHOOK_API_KEY?.trim() ?? "";
  if (key.startsWith("spsk_test_")) return false;
  if (key.startsWith("spsk_live_")) return true;
  const flag = env.SEPAY_LIVE?.trim().toLowerCase();
  return flag === "true" || flag === "1";
}

function main() {
  loadEnvFile(resolve(ROOT, ".env.local"), { overwrite: true });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const webhookUrl = `${appUrl}/api/webhooks/sepay`;
  const live = isLiveMode(process.env);

  console.log("\n=== Camba — SePay thanh toán thật ===\n");
  console.log(`Chế độ: ${live ? "LIVE (tiền thật)" : "TEST (spsk_test_ hoặc SEPAY_LIVE chưa bật)"}\n`);

  console.log("1. SePay Dashboard → chế độ Live (không phải Test mode)");
  console.log("2. Liên kết TK ngân hàng Live:", process.env.SEPAY_BANK_ACCOUNT || "(chưa cấu hình)");
  console.log("3. Payment code prefix:", process.env.SEPAY_PAYMENT_CODE_PREFIX || "CAMBA");
  console.log("4. Tạo webhook Live:");
  console.log("   URL:", webhookUrl);
  console.log("   Sự kiện: Có tiền vào");
  console.log("   Bảo mật: API Key → copy vào SEPAY_WEBHOOK_API_KEY");
  console.log("\n5. Biến môi trường (Vercel Production + .env.local):");
  console.log("   SEPAY_BANK_ACCOUNT, SEPAY_BANK_NAME, SEPAY_ACCOUNT_HOLDER");
  console.log("   SEPAY_PAYMENT_CODE_PREFIX=CAMBA");
  console.log("   SEPAY_WEBHOOK_API_KEY=<API key Live từ webhook>");
  console.log("   SEPAY_LIVE=true");
  console.log("\n6. Dev local + tiền thật: dùng ngrok URL thay appUrl ở bước 4");
  console.log("   npm run dev:sepay-ngrok");
  console.log("\n7. Migration DB (nếu chưa): 013_subscriptions.sql, 014_sepay_payments.sql\n");

  if (!live) {
    console.log("⚠ Đang dùng TEST key. Đổi SEPAY_WEBHOOK_API_KEY sang key Live và SEPAY_LIVE=true để nhận tiền thật.\n");
  }
}

main();
