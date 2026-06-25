import { MOTION_DURATION, MOTION_EASE, type MotionDurationKey } from "@/lib/design/motion-tokens";

export type MotionTransition = {
  duration: number;
  ease: readonly [number, number, number, number];
};

/** Resolve duration respecting reduced-motion (0 when disabled). */
export function motionDuration(
  key: MotionDurationKey,
  prefersReducedMotion: boolean | null
): number {
  if (prefersReducedMotion) return 0;
  return MOTION_DURATION[key];
}

export function motionTransition(
  key: MotionDurationKey,
  prefersReducedMotion: boolean | null,
  ease: keyof typeof MOTION_EASE = "out"
): MotionTransition {
  return {
    duration: motionDuration(key, prefersReducedMotion),
    ease: MOTION_EASE[ease],
  };
}

export const fadeUpVariants = (prefersReducedMotion: boolean | null, offsetY: number = 12) =>
  prefersReducedMotion
    ? {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 1, y: 0 },
      }
    : {
        initial: { opacity: 0, y: offsetY },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: offsetY / 2 },
      };

export const scaleInVariants = (prefersReducedMotion: boolean | null, from = 0.92) =>
  prefersReducedMotion
    ? {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
      }
    : {
        initial: { opacity: 0, scale: from },
        animate: { opacity: 1, scale: 1 },
      };

export const pageTransitionVariants = (prefersReducedMotion: boolean | null) =>
  prefersReducedMotion
    ? { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
      };
