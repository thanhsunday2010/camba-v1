export type SepayConfig = {
  bankAccount: string;
  bankName: string;
  accountHolder: string | null;
  paymentCodePrefix: string;
  qrMemoPrefix: string;
  webhookApiKey: string | null;
  webhookSecret: string | null;
  isLive: boolean;
};

export function normalizeBankAccount(value: string): string {
  return value.replace(/\D/g, "");
}

export function isProductionEnv(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

export function isSepayLiveMode(): boolean {
  const apiKey = process.env.SEPAY_WEBHOOK_API_KEY?.trim() ?? "";
  if (apiKey.startsWith("spsk_test_")) return false;
  if (apiKey.startsWith("spsk_live_")) return true;

  const flag = process.env.SEPAY_LIVE?.trim().toLowerCase();
  return flag === "true" || flag === "1";
}

export function getSepayConfig(): SepayConfig | null {
  const bankAccount = process.env.SEPAY_BANK_ACCOUNT?.trim();
  const bankName = process.env.SEPAY_BANK_NAME?.trim();

  if (!bankAccount || !bankName) {
    return null;
  }

  return {
    bankAccount,
    bankName,
    accountHolder: process.env.SEPAY_ACCOUNT_HOLDER?.trim() || null,
    paymentCodePrefix: (process.env.SEPAY_PAYMENT_CODE_PREFIX?.trim() || "CAMBA").toUpperCase(),
    qrMemoPrefix: process.env.SEPAY_QR_MEMO_PREFIX?.trim() || "",
    webhookApiKey: process.env.SEPAY_WEBHOOK_API_KEY?.trim() || null,
    webhookSecret: process.env.SEPAY_WEBHOOK_SECRET?.trim() || null,
    isLive: isSepayLiveMode(),
  };
}

export function isSepayConfigured(): boolean {
  return getSepayConfig() != null;
}

export function requireSepayConfig(): SepayConfig {
  const config = getSepayConfig();
  if (!config) {
    throw new Error("SePay chưa được cấu hình. Thêm SEPAY_BANK_ACCOUNT và SEPAY_BANK_NAME vào môi trường.");
  }
  return config;
}

export function assertSepayProductionReady(): void {
  if (!isProductionEnv()) return;

  const config = getSepayConfig();
  if (!config) {
    throw new Error("SePay chưa được cấu hình trên production.");
  }
  if (!config.webhookApiKey) {
    throw new Error("SEPAY_WEBHOOK_API_KEY bắt buộc trên production.");
  }
  if (!config.isLive) {
    throw new Error("Production yêu cầu SePay Live (SEPAY_LIVE=true hoặc API key Live, không dùng spsk_test_).");
  }
}

export function getSepayWebhookApiKey(): string | null {
  return process.env.SEPAY_WEBHOOK_API_KEY?.trim() || null;
}

export function getSepayWebhookUrl(appUrl: string): string {
  return `${appUrl.replace(/\/$/, "")}/api/webhooks/sepay`;
}
