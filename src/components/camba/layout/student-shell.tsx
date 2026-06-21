import { cn } from "@/lib/utils";

interface StudentPageShellProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}

/** Standard student page wrapper — max width + vertical rhythm */
export function StudentPageShell({ children, className, narrow }: StudentPageShellProps) {
  return (
    <div
      className={cn(
        "camba-section-stack w-full mx-auto",
        narrow ? "max-w-[var(--content-narrow)]" : "max-w-[var(--content-max-width)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ContentSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function ContentSection({ children, className, id }: ContentSectionProps) {
  return (
    <section id={id} className={cn("space-y-4", className)}>
      {children}
    </section>
  );
}

interface StudentDashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

/** Two-column dashboard grid — main + optional sidebar */
export function StudentDashboardLayout({
  children,
  sidebar,
  className,
}: StudentDashboardLayoutProps) {
  return (
    <div
      className={cn(
        sidebar
          ? "grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start"
          : "space-y-6",
        className
      )}
    >
      <div className="camba-section-stack min-w-0">{children}</div>
      {sidebar && <aside className="space-y-4 lg:sticky lg:top-20">{sidebar}</aside>}
    </div>
  );
}
