"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CambaRabbitMascot } from "@/components/mascot/camba-rabbit-mascot";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export interface ExerciseCelebrationOverlayProps {
  open: boolean;
  message: string;
  xpAmount?: number;
  xpLabel?: string;
  continueLabel?: string;
  onDismiss: () => void;
  autoDismissMs?: number;
}

export function ExerciseCelebrationOverlay({
  open,
  message,
  xpAmount,
  xpLabel,
  continueLabel = "Tiếp tục",
  onDismiss,
  autoDismissMs = 4200,
}: ExerciseCelebrationOverlayProps) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open || autoDismissMs <= 0) return;
    const timer = window.setTimeout(onDismiss, autoDismissMs);
    return () => window.clearTimeout(timer);
  }, [open, autoDismissMs, onDismiss]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-live="polite"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-label={continueLabel}
            onClick={onDismiss}
          />

          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-program/20 bg-white px-6 py-7 text-center shadow-2xl shadow-program/10"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div className="mx-auto mb-4 flex scale-[2.25] justify-center origin-bottom">
              <CambaRabbitMascot mood="excited" />
            </div>

            <p className="camba-h3 text-foreground mb-2">{message}</p>

            {xpAmount != null && xpAmount > 0 && (
              <p className="inline-flex items-center gap-2 rounded-full bg-[var(--color-xp)]/15 px-4 py-1.5 camba-body font-semibold text-[var(--color-xp)] mb-4">
                <Sparkles className="h-4 w-4" />
                {xpLabel?.replace("{amount}", String(xpAmount)) ?? `+${xpAmount} XP`}
              </p>
            )}

            <Button variant="celebration" className="w-full mt-2" onClick={onDismiss}>
              {continueLabel}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
