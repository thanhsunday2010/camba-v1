"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MOTION_OFFSET } from "@/lib/design/motion-tokens";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

export type XPBurst = {
  id: string;
  amount: number;
};

interface XPGainAnimationProps {
  bursts: XPBurst[];
  onDismiss: (id: string) => void;
}

export function XPGainAnimation({ bursts, onDismiss }: XPGainAnimationProps) {
  const motionConfig = useCambaMotion();

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-4 z-[60] flex flex-col items-end gap-2 sm:bottom-8 sm:right-8"
      aria-live="polite"
      aria-atomic
    >
      <AnimatePresence>
        {bursts.map((burst) => (
          <motion.div
            key={burst.id}
            initial={
              motionConfig.prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 0, scale: 0.9 }
            }
            animate={
              motionConfig.prefersReducedMotion
                ? { opacity: 1, y: 0 }
                : { opacity: [0, 1, 1, 0], y: MOTION_OFFSET.xpRise, scale: 1 }
            }
            exit={{ opacity: 0 }}
            transition={{
              duration: motionConfig.duration("celebration"),
              ease: motionConfig.transition("celebration").ease,
            }}
            onAnimationComplete={() => onDismiss(burst.id)}
            className="inline-flex items-center gap-1.5 rounded-full border border-program/25 bg-white/95 px-3 py-1.5 shadow-md camba-caption font-bold text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-xp)]" aria-hidden />
            +{burst.amount} XP
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
