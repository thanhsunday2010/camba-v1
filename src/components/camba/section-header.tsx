import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-3 mb-4", className)}>
      <div className="flex items-start gap-2.5 min-w-0">
        {Icon && (
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-program-muted text-program">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <div>
          <h2 className="camba-h3 text-foreground">{title}</h2>
          {description && <p className="camba-caption text-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
