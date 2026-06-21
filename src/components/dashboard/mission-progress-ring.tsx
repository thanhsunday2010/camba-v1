import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/camba/progress-ring";

interface MissionProgressRingProps {
  completed: number;
  total: number;
  label: string;
  className?: string;
}

export function MissionProgressRing({
  completed,
  total,
  label,
  className,
}: MissionProgressRingProps) {
  if (total === 0) return null;

  const percent = Math.round((completed / total) * 100);

  return (
    <div className={cn("flex items-center gap-2 shrink-0", className)}>
      <ProgressRing value={percent} label={`${completed}/${total}`} sublabel={label} size={56} />
    </div>
  );
}
