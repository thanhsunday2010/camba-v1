import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { SKILL_ICONS } from "@/lib/design/skill-icons";
import type { LessonPageContext } from "@/lib/learning/lesson-page-types";

interface LessonBreadcrumbProps {
  context: LessonPageContext;
  labels: {
    backToPath: string;
    breadcrumbPath: string;
    breadcrumbLesson: string;
    skillLabel: string;
    unitLabel: string;
  };
  className?: string;
}

export function LessonBreadcrumb({ context, labels, className }: LessonBreadcrumbProps) {
  const SkillIcon = context.skillSlug ? SKILL_ICONS[context.skillSlug] : null;
  const pathParts: string[] = [];
  if (context.skillName) pathParts.push(context.skillName);
  if (context.unitTitle) pathParts.push(context.unitTitle);
  pathParts.push(labels.breadcrumbLesson);

  return (
    <nav className={cn("flex flex-col gap-2", className)} aria-label={labels.breadcrumbPath}>
      <Link
        href="/learning"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-program hover:underline w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        {labels.backToPath}
      </Link>
      {(context.skillName || context.unitTitle) && (
        <p className="camba-caption text-muted flex items-center gap-1.5 flex-wrap">
          {SkillIcon && <SkillIcon className="h-3.5 w-3.5 text-program shrink-0" />}
          {pathParts.join(" • ")}
        </p>
      )}
    </nav>
  );
}
