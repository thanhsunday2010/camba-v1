"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { AiLimitMeta } from "@/types";
import { Sparkles } from "lucide-react";

export type AiLimitDialogLabels = {
  freeTitle: string;
  freeDescription: string;
  proTitle: string;
  proDescription: string;
  vipTitle: string;
  vipDescription: string;
  usageSummary: string;
  subscribeCta: string;
  upgradeCta: string;
  close: string;
};

interface AiLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meta: AiLimitMeta | null;
  labels: AiLimitDialogLabels;
}

export function AiLimitDialog({ open, onOpenChange, meta, labels }: AiLimitDialogProps) {
  if (!meta) return null;

  const title =
    meta.tier === "free" ? labels.freeTitle : meta.tier === "pro" ? labels.proTitle : labels.vipTitle;
  const description =
    meta.tier === "free"
      ? labels.freeDescription
      : meta.tier === "pro"
        ? labels.proDescription
        : labels.vipDescription;

  const showSubscribe = meta.tier === "free";
  const showUpgrade = meta.tier === "pro";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-program">
            <Sparkles className="h-5 w-5" aria-hidden />
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription className="text-left pt-2 space-y-2">
            <p>{description}</p>
            <p className="font-medium text-foreground">
              {labels.usageSummary
                .replace("{used}", String(meta.usedToday))
                .replace("{limit}", String(meta.dailyLimit))}
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {labels.close}
          </Button>
          {showSubscribe && (
            <Button asChild>
              <Link href="/subscriptions">{labels.subscribeCta}</Link>
            </Button>
          )}
          {showUpgrade && (
            <Button asChild>
              <Link href="/subscriptions">{labels.upgradeCta}</Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function isAiLimitResult(result: {
  success: boolean;
  code?: string;
  limitMeta?: AiLimitMeta;
}): result is { success: false; code: "AI_LIMIT_EXCEEDED"; limitMeta: AiLimitMeta } {
  return !result.success && result.code === "AI_LIMIT_EXCEEDED" && !!result.limitMeta;
}
