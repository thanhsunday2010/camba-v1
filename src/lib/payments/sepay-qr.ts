import type { SepayConfig } from "@/lib/payments/sepay-config";

const SEPAY_QR_BASE = "https://qr.sepay.vn/img";

export function buildSepayTransferMemo(orderCode: string, config: SepayConfig): string {
  const memo = `${config.qrMemoPrefix}${orderCode}`.trim();
  return memo.slice(0, 140);
}

export function buildSepayQrImageUrl(params: {
  config: SepayConfig;
  amountVnd: number;
  orderCode: string;
}): string {
  const { config, amountVnd, orderCode } = params;
  const search = new URLSearchParams({
    acc: config.bankAccount,
    bank: config.bankName,
    amount: String(amountVnd),
    des: buildSepayTransferMemo(orderCode, config),
    template: "compact",
  });

  if (config.accountHolder) {
    search.set("holder", config.accountHolder);
  }

  return `${SEPAY_QR_BASE}?${search.toString()}`;
}
