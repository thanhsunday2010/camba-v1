import { getProgramTheme, normalizeProgramSlug } from "@/lib/design/cambridge-programs";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface ProgramBadgeProps {
  programSlug?: string | null;
  size?: "sm" | "md";
  className?: string;
}

export function ProgramBadge({ programSlug, size = "sm", className }: ProgramBadgeProps) {
  const slug = normalizeProgramSlug(programSlug);
  const theme = getProgramTheme(slug);

  if (!theme) {
    return (
      <span className={cn("camba-caption text-muted font-semibold", className)}>
        Cambridge
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full camba-gradient-program font-bold text-white shadow-sm",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        className
      )}
    >
      <Shield className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} fill="currentColor" fillOpacity={0.3} />
      {theme.labelVi}
    </span>
  );
}
