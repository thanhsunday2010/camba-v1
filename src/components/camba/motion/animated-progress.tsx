"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

interface AnimatedProgressProps {
  percent: number;
  className?: string;
  barClassName?: string;
  ariaLabel?: string;
}

/** Transform-based progress bar — avoids width animation layout thrash. */
export function AnimatedProgress({
  percent,
  className,
  barClassName,
  ariaLabel,
}: AnimatedProgressProps) {
  const motionConfig = useCambaMotion();
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      className={cn("h-1.5 rounded-full bg-[var(--surface-sunken)] overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <motion.div
        className={cn("h-full origin-left rounded-full bg-program", barClassName)}
        initial={{ scaleX: motionConfig.prefersReducedMotion ? clamped / 100 : 0 }}
        animate={{ scaleX: clamped / 100 }}
        transition={motionConfig.transition("slow")}
        style={{ width: "100%" }}
      />
    </div>
  );
}
