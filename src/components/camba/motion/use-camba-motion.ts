"use client";

import { useReducedMotion } from "framer-motion";
import {
  MOTION_DURATION,
  MOTION_OFFSET,
  MOTION_STAGGER,
  type MotionDurationKey,
} from "@/lib/design/motion-tokens";
import { fadeUpVariants, motionTransition, scaleInVariants } from "@/lib/design/motion-utils";

export function useCambaMotion() {
  const reduced = useReducedMotion();

  return {
    prefersReducedMotion: reduced,
    duration: (key: MotionDurationKey) => (reduced ? 0 : MOTION_DURATION[key]),
    transition: (key: MotionDurationKey, ease: "out" | "spring" = "out") =>
      motionTransition(key, reduced, ease),
    fadeUp: (offsetY: number = MOTION_OFFSET.sectionY) => fadeUpVariants(reduced, offsetY),
    scaleIn: (from = 0.92) => scaleInVariants(reduced, from),
    stagger: reduced ? 0 : MOTION_STAGGER.section,
    staggerChildren: reduced ? 0 : MOTION_STAGGER.card,
  };
}
