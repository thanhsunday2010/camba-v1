import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusChipVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
  {
    variants: {
      status: {
        locked: "bg-gray-100 text-[var(--status-locked)]",
        unlocked: "bg-program-muted text-program",
        "in-progress": "bg-blue-50 text-[var(--status-in-progress)]",
        completed: "bg-success/15 text-success",
        mastery: "bg-success/15 text-success",
      },
    },
    defaultVariants: {
      status: "unlocked",
    },
  }
);

export interface StatusChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusChipVariants> {
  label: string;
}

export function StatusChip({ status, label, className, ...props }: StatusChipProps) {
  return (
    <span className={cn(statusChipVariants({ status }), className)} {...props}>
      {label}
    </span>
  );
}
