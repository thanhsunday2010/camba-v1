"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

interface AnimatedBadgeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedBadge({ children, className, delay = 0 }: AnimatedBadgeProps) {
  const motionConfig = useCambaMotion();
  const variants = motionConfig.scaleIn(0.88);

  return (
    <motion.span
      className={cn("inline-flex", className)}
      initial={variants.initial}
      animate={variants.animate}
      transition={{ ...motionConfig.transition("celebration", "spring"), delay }}
    >
      {children}
    </motion.span>
  );
}
