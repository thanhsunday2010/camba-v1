import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { CertificationPortfolio } from "@/lib/profile/student-profile-types";
import { Award, GraduationCap, Sparkles } from "lucide-react";

export type CertificationShowcaseLabels = {
  title: string;
  subtitle: string;
  goldMock: string;
  levelComplete: string;
  achievement: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction: string;
};

interface CertificationShowcaseProps {
  certifications: CertificationPortfolio;
  labels: CertificationShowcaseLabels;
  resolveTitle: (entry: CertificationPortfolio["entries"][number]) => string;
}

function certIcon(kind: CertificationPortfolio["entries"][number]["kind"]) {
  switch (kind) {
    case "gold-mock":
      return Sparkles;
    case "level-complete":
      return GraduationCap;
    default:
      return Award;
  }
}

export function CertificationShowcase({
  certifications,
  labels,
  resolveTitle,
}: CertificationShowcaseProps) {
  return (
    <section aria-labelledby="profile-certifications-heading">
      <SectionHeader
        titleId="profile-certifications-heading"
        title={labels.title}
        description={labels.subtitle}
        icon={Award}
      />

      {!certifications.hasCertifications ? (
        <DashboardEmptyState
          icon={Award}
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          actionLabel={labels.emptyAction}
          actionHref="/mock-tests"
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2" role="list">
          {certifications.entries.map((entry) => {
            const Icon = certIcon(entry.kind);
            const kindLabel =
              entry.kind === "gold-mock"
                ? labels.goldMock
                : entry.kind === "level-complete"
                  ? labels.levelComplete
                  : labels.achievement;
            const content = (
              <CambaCard variant="achievement" padding="md" className="h-full">
                <div className="flex items-start gap-3">
                  <div className="camba-icon-box shrink-0 bg-[var(--color-badge)]/15 text-[var(--color-badge)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <p className="camba-caption font-semibold text-[var(--color-badge)]">{kindLabel}</p>
                    <p className="camba-h3 text-foreground mt-0.5">{resolveTitle(entry)}</p>
                    <p className="camba-caption text-muted mt-1">{entry.subtitle}</p>
                  </div>
                </div>
              </CambaCard>
            );
            return (
              <div key={entry.id} role="listitem">
                {entry.href ? (
                  <Link href={entry.href} className="block camba-focus-ring rounded-2xl">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
