"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  delay?: number;
  hoverLift?: boolean;
}

export function AnimatedCard({
  className,
  children,
  delay = 0,
  hoverLift = false,
  ...props
}: AnimatedCardProps) {
  const motionConfig = useCambaMotion();
  const variants = motionConfig.fadeUp(8);

  return (
    <motion.div
      className={cn(className)}
      initial={variants.initial}
      animate={variants.animate}
      transition={{ ...motionConfig.transition("normal"), delay }}
      whileHover={
        hoverLift && !motionConfig.prefersReducedMotion
          ? { y: -2, transition: motionConfig.transition("fast") }
          : undefined
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
