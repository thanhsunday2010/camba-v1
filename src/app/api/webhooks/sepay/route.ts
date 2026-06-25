import { NextResponse } from "next/server";
import { getSepayConfig, assertSepayProductionReady, isProductionEnv } from "@/lib/payments/sepay-config";
import { processSepayWebhook } from "@/lib/payments/subscription-payment";
import {
  verifySepayApiKey,
  verifySepayHmacSignature,
  type SepayWebhookPayload,
} from "@/lib/payments/sepay-webhook";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertSepayProductionReady();
  } catch (error) {
    const message = error instanceof Error ? error.message : "production_not_ready";
    console.error("[sepay webhook]", message);
    return NextResponse.json({ success: false, error: "production_not_ready" }, { status: 503 });
  }

  const config = getSepayConfig();
  if (!config) {
    return NextResponse.json({ success: false, error: "not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();

  const apiKeyOk = verifySepayApiKey(
    request.headers.get("authorization"),
    config.webhookApiKey
  );
  const hmacOk = verifySepayHmacSignature({
    rawBody,
    signatureHeader: request.headers.get("x-sepay-signature"),
    timestampHeader: request.headers.get("x-sepay-timestamp"),
    secret: config.webhookSecret,
  });

  if (!apiKeyOk || !hmacOk) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  if (isProductionEnv() && !config.webhookApiKey) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  let payload: SepayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SepayWebhookPayload;
  } catch {
    return NextResponse.json({ success: false, error: "invalid_json" }, { status: 400 });
  }

  if (!payload?.id || !payload.content || payload.transferAmount == null) {
    return NextResponse.json({ success: false, error: "invalid_payload" }, { status: 400 });
  }

  try {
    await processSepayWebhook(payload);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[sepay webhook]", error);
    return NextResponse.json({ success: false, error: "internal_error" }, { status: 500 });
  }
}
