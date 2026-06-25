"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createSubscriptionPaymentOrderAction,
  getSubscriptionPaymentOrderStatusAction,
} from "@/actions/subscription-payments";
import type { SubscriptionCheckoutSession } from "@/lib/payments/subscription-payment";
import { formatVnd } from "@/lib/subscriptions/subscription-catalog";
import type { BillingPeriod, SubscriptionProgram, SubscriptionTier } from "@/lib/subscriptions/subscription-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Loader2, QrCode } from "lucide-react";

export type SubscriptionCheckoutLabels = {
  title: string;
  description: string;
  amount: string;
  transferMemo: string;
  bankAccount: string;
  bankName: string;
  accountHolder: string;
  scanHint: string;
  waiting: string;
  paid: string;
  expired: string;
  copyCode: string;
  copied: string;
  close: string;
  error: string;
};

type CheckoutRequest = {
  program: SubscriptionProgram;
  tier: Exclude<SubscriptionTier, "free">;
  billingPeriod: BillingPeriod;
};

interface SubscriptionCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: CheckoutRequest | null;
  labels: SubscriptionCheckoutLabels;
  tierLabels: Record<SubscriptionTier, string>;
  programLabels: Record<SubscriptionProgram, string>;
}

const POLL_INTERVAL_MS = 3000;

export function SubscriptionCheckoutDialog({
  open,
  onOpenChange,
  request,
  labels,
  tierLabels,
  programLabels,
}: SubscriptionCheckoutDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkout, setCheckout] = useState<SubscriptionCheckoutSession | null>(null);
  const [status, setStatus] = useState<"pending" | "paid" | "expired" | "cancelled">("pending");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open || !request) {
      setCheckout(null);
      setStatus("pending");
      return;
    }

    let cancelled = false;

    async function startCheckout() {
      setLoading(true);
      setCheckout(null);
      setStatus("pending");

      const result = await createSubscriptionPaymentOrderAction({
        program: request!.program,
        tier: request!.tier,
        billingPeriod: request!.billingPeriod,
      });

      if (cancelled) return;

      setLoading(false);

      if (!result.success || !result.data) {
        toast.error(result.error ?? labels.error);
        onOpenChange(false);
        return;
      }

      setCheckout(result.data);
    }

    void startCheckout();

    return () => {
      cancelled = true;
    };
  }, [open, request, labels.error, onOpenChange]);

  useEffect(() => {
    if (!open || !checkout || status !== "pending") {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      return;
    }

    async function pollStatus() {
      const result = await getSubscriptionPaymentOrderStatusAction(checkout!.orderCode);
      if (!result.success || !result.data) return;

      setStatus(result.data.status);

      if (result.data.status === "paid") {
        toast.success(labels.paid);
        router.refresh();
      }
    }

    pollRef.current = setInterval(() => {
      void pollStatus();
    }, POLL_INTERVAL_MS);

    void pollStatus();

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [open, checkout, status, labels.paid, router]);

  async function copyMemo() {
    if (!checkout) return;
    await navigator.clipboard.writeText(checkout.transferMemo);
    toast.success(labels.copied);
  }

  const tierName = request ? tierLabels[request.tier] : "";
  const programName = request ? programLabels[request.program] : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-program" aria-hidden />
            {labels.title}
          </DialogTitle>
          <DialogDescription>
            {labels.description
              .replace("{tier}", tierName)
              .replace("{program}", programName)}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <Loader2 className="h-8 w-8 animate-spin text-program" aria-hidden />
            <p className="camba-caption text-muted">{labels.waiting}</p>
          </div>
        )}

        {!loading && checkout && (
          <div className="space-y-4">
            {status === "paid" ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-success" aria-hidden />
                <p className="camba-body font-semibold text-foreground">{labels.paid}</p>
                <Button onClick={() => onOpenChange(false)}>{labels.close}</Button>
              </div>
            ) : status === "expired" ? (
              <div className="rounded-xl border border-border/60 bg-[var(--surface-sunken)] p-4 text-center">
                <p className="camba-body text-muted">{labels.expired}</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center rounded-xl border border-border/60 bg-white p-3">
                  <Image
                    src={checkout.qrImageUrl}
                    alt="VietQR"
                    width={240}
                    height={240}
                    unoptimized
                    className="h-auto w-[240px]"
                  />
                </div>

                <div className="space-y-2 rounded-xl border border-border/60 p-4 text-sm">
                  <p className="camba-body font-semibold text-foreground">
                    {labels.amount.replace("{amount}", formatVnd(checkout.amountVnd))}
                  </p>
                  <p>
                    <span className="text-muted">{labels.bankName}: </span>
                    {checkout.bankName}
                  </p>
                  <p>
                    <span className="text-muted">{labels.bankAccount}: </span>
                    {checkout.bankAccount}
                  </p>
                  {checkout.accountHolder && (
                    <p>
                      <span className="text-muted">{labels.accountHolder}: </span>
                      {checkout.accountHolder}
                    </p>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 break-all">
                      <span className="text-muted">{labels.transferMemo}: </span>
                      <span className="font-semibold">{checkout.transferMemo}</span>
                    </p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => void copyMemo()}>
                      <Copy className="h-4 w-4" aria-hidden />
                      <span className="sr-only">{labels.copyCode}</span>
                    </Button>
                  </div>
                </div>

                <p className="camba-caption text-muted text-center">{labels.scanHint}</p>
                <p className="camba-caption text-muted text-center flex items-center justify-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  {labels.waiting}
                </p>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
