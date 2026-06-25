import { createHmac, timingSafeEqual } from "node:crypto";

export type SepayWebhookPayload = {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  subAccount?: string | null;
  code?: string | null;
  content: string;
  transferType: "in" | "out";
  description?: string;
  transferAmount: number;
  accumulated?: number;
  referenceCode?: string;
};

export function verifySepayApiKey(
  authorizationHeader: string | null,
  expectedApiKey: string | null
): boolean {
  if (!expectedApiKey) return true;
  if (!authorizationHeader) return false;

  const normalized = authorizationHeader.trim();
  const apiKeyForms = [
    expectedApiKey,
    `Apikey ${expectedApiKey}`,
    `Bearer ${expectedApiKey}`,
  ];

  return apiKeyForms.some((candidate) => timingSafeEqualString(normalized, candidate));
}

export function verifySepayHmacSignature(params: {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  secret: string | null;
}): boolean {
  const { rawBody, signatureHeader, timestampHeader, secret } = params;
  if (!secret) return true;
  if (!signatureHeader || !timestampHeader) return false;

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) return false;

  const ageMs = Math.abs(Date.now() - timestamp * 1000);
  if (ageMs > 5 * 60 * 1000) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  return timingSafeEqualString(signatureHeader, expected);
}

export function extractPaymentOrderCode(
  payload: SepayWebhookPayload,
  paymentCodePrefix: string
): string | null {
  if (payload.code?.trim()) {
    return payload.code.trim().toUpperCase();
  }

  const prefix = paymentCodePrefix.toUpperCase();
  const pattern = new RegExp(`${prefix}[A-Z0-9]{6,16}`, "i");
  const match = payload.content.match(pattern);
  return match?.[0]?.toUpperCase() ?? null;
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
