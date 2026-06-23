import {
  LEARNER_ANALYTICS_STRENGTH_THRESHOLD,
  LEARNER_ANALYTICS_WEAKNESS_THRESHOLD,
} from "@/lib/learning/learner-skill-analytics";
import type { SkillPerformanceBand } from "@/lib/mock-tests/mock-test-analytics-types";

/** Map a percent score to the canonical M1.4 analytics band. */
export function getSkillPerformanceBand(percent: number): SkillPerformanceBand {
  if (percent >= LEARNER_ANALYTICS_STRENGTH_THRESHOLD) return "strength";
  if (percent < LEARNER_ANALYTICS_WEAKNESS_THRESHOLD) return "weakness";
  return "neutral";
}

/** Progress bar color class aligned to analytics band (not separate thresholds). */
export function skillPerformanceBandBarClass(band: SkillPerformanceBand): string {
  switch (band) {
    case "strength":
      return "bg-success";
    case "neutral":
      return "bg-program";
    case "weakness":
      return "bg-[var(--status-needs-review)]";
  }
}
