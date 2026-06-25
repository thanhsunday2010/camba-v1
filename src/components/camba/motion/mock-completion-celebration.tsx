"use client";

import { motion } from "framer-motion";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

interface MockCompletionCelebrationProps {
  children: React.ReactNode;
  active?: boolean;
}

/** Wraps existing MockTestCompleteSummary — enhances entrance, does not replace content. */
export function MockCompletionCelebration({
  children,
  active = true,
}: MockCompletionCelebrationProps) {
  const motionConfig = useCambaMotion();
  const variants = motionConfig.scaleIn(0.94);

  if (!active) return <>{children}</>;

  return (
    <motion.div
      initial={variants.initial}
      animate={variants.animate}
      transition={motionConfig.transition("celebration", "spring")}
    >
      {children}
    </motion.div>
  );
}
