"use client";

import { getUiDensity, normalizeProgramSlug } from "@/lib/design/cambridge-programs";
import { cn } from "@/lib/utils";

interface CambridgeProgramThemeProps {
  programSlug?: string | null;
  children: React.ReactNode;
  className?: string;
}

/**
 * Applies Cambridge program color identity and UI density via data attributes.
 */
export function CambridgeProgramTheme({
  programSlug,
  children,
  className,
}: CambridgeProgramThemeProps) {
  const slug = normalizeProgramSlug(programSlug);
  const density = getUiDensity(slug);

  return (
    <div
      className={cn(className)}
      data-program={slug ?? undefined}
      data-density={density}
    >
      {children}
    </div>
  );
}
