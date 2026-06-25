"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/i18n/routing";
import { pageTransitionVariants, motionTransition } from "@/lib/design/motion-utils";
import { useReducedMotion } from "framer-motion";

interface AnimatedPageTransitionProps {
  children: React.ReactNode;
}

export function AnimatedPageTransition({ children }: AnimatedPageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const variants = pageTransitionVariants(reduced);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={motionTransition("page", reduced)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
