import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ArrowLeft, Map } from "lucide-react";
import type { LessonPageContext } from "@/lib/learning/lesson-page-types";

interface LessonBreadcrumbProps {
  context: LessonPageContext;
  labels: {
    backToPath: string;
    breadcrumbPath: string;
  };
  className?: string;
}

export function LessonBreadcrumb({ context, labels, className }: LessonBreadcrumbProps) {
  const contextParts: string[] = [];
  if (context.skillName) contextParts.push(context.skillName);
  if (context.unitTitle) contextParts.push(context.unitTitle);

  return (
    <nav className={cn("flex flex-col gap-2", className)} aria-label={labels.breadcrumbPath}>
      <Link
        href="/learning"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-program transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {labels.backToPath}
      </Link>
      {contextParts.length > 0 && (
        <p className="camba-caption text-muted flex items-center gap-1.5">
          <Map className="h-3.5 w-3.5 shrink-0" />
          {contextParts.join(" · ")}
        </p>
      )}
    </nav>
  );
}
