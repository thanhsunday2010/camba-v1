import { getProgramTheme, SHIELD_SEGMENTS, normalizeProgramSlug } from "@/lib/design/cambridge-programs";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

interface CambridgeShieldProps {
  programSlug?: string | null;
  filledSegments?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { box: "h-10 w-10", icon: "h-5 w-5", text: "text-[10px]" },
  md: { box: "h-14 w-14", icon: "h-7 w-7", text: "text-xs" },
  lg: { box: "h-20 w-20", icon: "h-10 w-10", text: "text-sm" },
};

export function CambridgeShield({
  programSlug,
  filledSegments = 0,
  size = "md",
  showLabel = false,
  className,
}: CambridgeShieldProps) {
  const slug = normalizeProgramSlug(programSlug);
  const theme = getProgramTheme(slug);
  const filled = Math.min(SHIELD_SEGMENTS, Math.max(0, filledSegments));
  const dims = sizeMap[size];

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl camba-gradient-program text-white shadow-md",
          dims.box
        )}
      >
        <Shield className={cn(dims.icon, "drop-shadow-sm")} fill="currentColor" fillOpacity={0.25} />
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 gap-0.5">
          {Array.from({ length: SHIELD_SEGMENTS }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 w-1.5 rounded-full",
                i < filled ? "bg-white" : "bg-white/35"
              )}
            />
          ))}
        </div>
      </div>
      {showLabel && theme && (
        <span className={cn("font-bold text-program", dims.text)}>{theme.labelVi}</span>
      )}
    </div>
  );
}
