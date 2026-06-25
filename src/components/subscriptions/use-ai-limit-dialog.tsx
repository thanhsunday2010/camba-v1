"use client";

import { useState } from "react";
import type { AiLimitMeta } from "@/types";
import {
  AiLimitDialog,
  isAiLimitResult,
  type AiLimitDialogLabels,
} from "@/components/subscriptions/ai-limit-dialog";

export function useAiLimitDialog(labels: AiLimitDialogLabels) {
  const [limitMeta, setLimitMeta] = useState<AiLimitMeta | null>(null);
  const [open, setOpen] = useState(false);

  function handleActionResult(result: {
    success: boolean;
    code?: string;
    limitMeta?: AiLimitMeta;
    error?: string;
  }): boolean {
    if (isAiLimitResult(result)) {
      setLimitMeta(result.limitMeta);
      setOpen(true);
      return true;
    }
    return false;
  }

  const dialog = (
    <AiLimitDialog open={open} onOpenChange={setOpen} meta={limitMeta} labels={labels} />
  );

  return { handleActionResult, dialog };
}
