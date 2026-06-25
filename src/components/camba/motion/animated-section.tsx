"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  delay?: number;
  staggerIndex?: number;
}

export function AnimatedSection({
  className,
  children,
  delay = 0,
  staggerIndex = 0,
  ...props
}: AnimatedSectionProps) {
  const motionConfig = useCambaMotion();
  const variants = motionConfig.fadeUp();

  return (
    <motion.section
      className={cn(className)}
      initial={variants.initial}
      animate={variants.animate}
      transition={{
        ...motionConfig.transition("slow"),
        delay: delay + staggerIndex * motionConfig.stagger,
      }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
