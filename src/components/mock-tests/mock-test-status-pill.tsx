import { LessonStatusPill } from "@/components/camba/primitives/lesson-status-pill";
import { mockTestDisplayStateToVisualState } from "@/lib/mock-tests/mock-test-ui-utils";
import type { MockTestDisplayState } from "@/lib/mock-tests/mock-test-types";

interface MockTestStatusPillProps {
  state: MockTestDisplayState;
  label: string;
  className?: string;
}

export function MockTestStatusPill({ state, label, className }: MockTestStatusPillProps) {
  return (
    <LessonStatusPill
      state={mockTestDisplayStateToVisualState(state)}
      label={label}
      className={className}
    />
  );
}
