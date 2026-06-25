export type SepayConfig = {
  bankAccount: string;
  bankName: string;
  accountHolder: string | null;
  paymentCodePrefix: string;
  qrMemoPrefix: string;
  webhookApiKey: string | null;
  webhookSecret: string | null;
};

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

export function getSepayWebhookApiKey(): string | null {
  return process.env.SEPAY_WEBHOOK_API_KEY?.trim() || null;
}
