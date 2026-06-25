"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Award } from "lucide-react";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

export type BadgeUnlockMoment = {
  id: string;
  title: string;
  subtitle?: string;
};

interface BadgeUnlockAnimationProps {
  moments: BadgeUnlockMoment[];
  onDismiss: (id: string) => void;
}

export function BadgeUnlockAnimation({ moments, onDismiss }: BadgeUnlockAnimationProps) {
  const motionConfig = useCambaMotion();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-[60] flex justify-center px-4"
      aria-live="polite"
    >
      <AnimatePresence>
        {moments.map((moment) => (
          <motion.div
            key={moment.id}
            initial={
              motionConfig.prefersReducedMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.88, y: 12 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={motionConfig.transition("celebration", "spring")}
            onAnimationComplete={() => {
              window.setTimeout(() => onDismiss(moment.id), motionConfig.prefersReducedMotion ? 800 : 2200);
            }}
            className="pointer-events-auto max-w-sm w-full rounded-2xl border border-[var(--color-badge)]/30 bg-white/95 p-4 shadow-lg text-center"
          >
            <motion.div
              className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-badge)]/15 text-[var(--color-badge)]"
              initial={
                motionConfig.prefersReducedMotion
                  ? { boxShadow: "0 0 0 rgba(217,119,6,0)" }
                  : { boxShadow: "0 0 0 rgba(217,119,6,0)" }
              }
              animate={
                motionConfig.prefersReducedMotion
                  ? {}
                  : {
                      boxShadow: [
                        "0 0 0 rgba(217,119,6,0)",
                        "0 0 20px rgba(217,119,6,0.35)",
                        "0 0 8px rgba(217,119,6,0.15)",
                      ],
                    }
              }
              transition={{ duration: motionConfig.duration("celebration") }}
            >
              <Award className="h-6 w-6" aria-hidden />
            </motion.div>
            <p className="camba-h3 text-foreground">{moment.title}</p>
            {moment.subtitle && (
              <p className="camba-caption text-muted mt-1">{moment.subtitle}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
