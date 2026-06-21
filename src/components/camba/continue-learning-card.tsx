import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ArrowRight, BookOpen, Clock } from "lucide-react";

interface ContinueLearningCardProps {
  lessonTitle: string;
  lessonHref: string;
  estimatedMinutes?: number;
  minutesLabel?: string;
  title?: string;
  ctaLabel?: string;
  emptyText?: string;
  className?: string;
}

export function ContinueLearningCard({
  lessonTitle,
  lessonHref,
  estimatedMinutes,
  minutesLabel = "phút",
  title = "Tiếp tục học",
  ctaLabel = "Bắt đầu ngay",
  emptyText,
  className,
}: ContinueLearningCardProps) {
  if (!lessonTitle && emptyText) {
    return (
      <div className={cn("camba-card rounded-2xl p-5 text-center", className)}>
        <BookOpen className="h-8 w-8 text-muted mx-auto mb-2" />
        <p className="camba-body text-muted">{emptyText}</p>
      </div>
    );
  }

  return (
    <Link href={lessonHref} className={cn("block group", className)}>
      <article className="camba-card-interactive relative overflow-hidden rounded-2xl p-5 sm:p-6 border-2 border-program/20 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07] camba-gradient-program"
          aria-hidden
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl camba-gradient-program text-white shadow-md">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="camba-caption uppercase tracking-wide text-program font-bold">
                {title}
              </p>
              <h3 className="camba-h2 text-foreground mt-0.5 truncate">{lessonTitle}</h3>
              {estimatedMinutes != null && (
                <p className="camba-caption text-muted mt-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {estimatedMinutes} {minutesLabel}
                </p>
              )}
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg h-12 px-8 text-base font-medium camba-gradient-program text-white shadow-md group-hover:scale-[1.02] transition-transform">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </article>
    </Link>
  );
}
