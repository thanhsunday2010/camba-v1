import { cn } from "@/lib/utils";

interface DashboardSlideStripProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardSlideStrip({ label, children, className }: DashboardSlideStripProps) {
  return (
    <div
      className={cn(
        "-mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory scrollbar-none",
        className
      )}
      role="list"
      aria-label={label}
    >
      {children}
    </div>
  );
}

interface DashboardSlideItemProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardSlideItem({ children, className }: DashboardSlideItemProps) {
  return (
    <div
      role="listitem"
      className={cn("snap-start shrink-0 w-[min(100%,17.5rem)] sm:w-[18.5rem]", className)}
    >
      {children}
    </div>
  );
}
