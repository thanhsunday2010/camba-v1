"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCambaMotion } from "@/components/camba/motion/use-camba-motion";

interface AnimatedAchievementProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  unlocked?: boolean;
}

export function AnimatedAchievement({
  children,
  className,
  index = 0,
  unlocked = true,
}: AnimatedAchievementProps) {
  const motionConfig = useCambaMotion();
  const variants = motionConfig.scaleIn(unlocked ? 0.9 : 0.96);

  return (
    <motion.div
      className={cn(className)}
      role="listitem"
      initial={variants.initial}
      animate={variants.animate}
      transition={{
        ...motionConfig.transition(unlocked ? "celebration" : "normal", unlocked ? "spring" : "out"),
        delay: index * motionConfig.staggerChildren,
      }}
      whileHover={
        !motionConfig.prefersReducedMotion
          ? { scale: 1.01, transition: motionConfig.transition("fast") }
          : undefined
      }
    >
      {children}
    </motion.div>
  );
}
