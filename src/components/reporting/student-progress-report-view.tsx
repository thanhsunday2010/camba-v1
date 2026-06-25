import { CambaCard } from "@/components/camba/primitives/camba-card";
import { ParentProgressSnapshotCard } from "@/components/reporting/parent-progress-snapshot";
import { ReportExportActions } from "@/components/reporting/report-export-actions";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";
import type { StudentProgressReportViewModel } from "@/lib/reporting/report-types";
import { CheckCircle2, Target } from "lucide-react";

interface StudentProgressReportViewProps {
  report: StudentProgressReportViewModel;
  labels: StudentProgressReportLabels;
}

export function StudentProgressReportView({ report, labels }: StudentProgressReportViewProps) {
  return (
    <article className="camba-section-stack print:space-y-4">
      <header className="space-y-2 print:mb-4">
        <p className="camba-caption font-bold uppercase tracking-wide text-program">CAMBA</p>
        <h1 className="camba-display text-foreground">{labels.previewTitle}</h1>
        <p className="camba-body text-muted max-w-2xl">{labels.previewSubtitle}</p>
        <ReportExportActions
          exportSnapshotLabel={labels.exportSnapshot}
          exportFullLabel={labels.exportFull}
          printLabel={labels.printAction}
        />
      </header>

      <ParentProgressSnapshotCard snapshot={report.snapshot} labels={labels} />

      <ReportSection title={labels.learningTitle} empty={report.learning.isEmpty} emptyText={labels.learningEmpty}>
        <p className="camba-body text-foreground">{report.learning.consistencyNote}</p>
        <dl className="mt-3 grid grid-cols-2 gap-3 camba-caption">
          <Metric label={labels.lessonsLabel} value={report.learning.lessonsCompleted} />
          <Metric label={labels.unitsLabel} value={report.learning.unitsCompleted} />
        </dl>
        {report.learning.recentActivitySummary && (
          <p className="camba-caption text-muted mt-3">{report.learning.recentActivitySummary}</p>
        )}
      </ReportSection>

      <ReportSection title={labels.mockTitle} empty={report.mockPerformance.isEmpty} emptyText={labels.mockEmpty}>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3 camba-caption">
          {report.mockPerformance.latestScorePercent != null && (
            <Metric label={labels.latestScoreLabel} value={`${report.mockPerformance.latestScorePercent}%`} />
          )}
          {report.mockPerformance.bestScorePercent != null && (
            <Metric label={labels.bestScoreLabel} value={`${report.mockPerformance.bestScorePercent}%`} />
          )}
          <Metric label={labels.mocksLabel} value={report.mockPerformance.mocksCompleted} />
        </dl>
        {report.mockPerformance.readinessPercent != null && (
          <p className="camba-body text-muted mt-3">
            {labels.readinessLabel}:{" "}
            <span className="font-semibold text-foreground">
              {report.mockPerformance.readinessPercent}%
              {report.mockPerformance.readinessBandLabel &&
                ` · ${report.mockPerformance.readinessBandLabel}`}
            </span>
          </p>
        )}
      </ReportSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <SkillAreaSection
          title={labels.writingTitle}
          empty={report.writing.isEmpty}
          emptyText={labels.writingEmpty}
          strengths={report.writing.strengths}
          weaknesses={report.writing.improvementAreas}
          average={report.writing.averageScore}
          labels={labels}
        />
        <SkillAreaSection
          title={labels.speakingTitle}
          empty={report.speaking.isEmpty}
          emptyText={labels.speakingEmpty}
          strengths={[]}
          weaknesses={[]}
          average={report.speaking.averageScore}
          labels={labels}
          extra={
            !report.speaking.isEmpty ? (
              <dl className="grid grid-cols-3 gap-2 camba-caption mt-3">
                {report.speaking.pronunciationAvg != null && (
                  <Metric label="Pronunciation" value={`${report.speaking.pronunciationAvg}%`} />
                )}
                {report.speaking.fluencyAvg != null && (
                  <Metric label="Fluency" value={`${report.speaking.fluencyAvg}%`} />
                )}
                {report.speaking.vocabularyAvg != null && (
                  <Metric label="Vocabulary" value={`${report.speaking.vocabularyAvg}%`} />
                )}
              </dl>
            ) : undefined
          }
        />
      </div>

      <ReportSection title={labels.skillsTitle} empty={report.skills.isEmpty} emptyText={report.skills.emptyNote ?? labels.skillsEmpty}>
        <StrengthWeaknessGrid report={report} labels={labels} />
      </ReportSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection title={labels.achievementsTitle} empty={report.achievements.isEmpty} emptyText={labels.achievementsEmpty}>
          <p className="camba-body text-foreground">
            {report.achievements.unlockedCount} / {report.achievements.totalAchievements}
          </p>
          <ul className="mt-3 space-y-2">
            {report.achievements.recentAchievements.map((a) => (
              <li key={a.title} className="flex items-start gap-2 camba-caption">
                <CheckCircle2 className="h-4 w-4 text-program shrink-0 mt-0.5" aria-hidden />
                <span>{a.title}</span>
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title={labels.journeyTitle} empty={report.journey.isEmpty} emptyText={labels.journeyEmpty}>
          {report.journey.currentLevel && (
            <p className="camba-body text-foreground">{report.journey.currentLevel}</p>
          )}
          {report.journey.nextMilestone && (
            <p className="camba-caption text-muted mt-2">
              Next: <span className="text-foreground font-medium">{report.journey.nextMilestone}</span>
            </p>
          )}
          {report.journey.completionPercent != null && (
            <p className="camba-caption text-program font-semibold mt-2">
              {report.journey.completionPercent}% complete
            </p>
          )}
        </ReportSection>
      </div>

      <ReportSection title={labels.nextStepsTitle} empty={report.nextSteps.isEmpty} emptyText={labels.nextStepsEmpty}>
        <ol className="space-y-3">
          {report.nextSteps.steps.map((step, i) => (
            <li key={step.id} className="flex gap-3 rounded-xl border border-border/60 bg-white px-4 py-3">
              <span className="camba-icon-box-sm shrink-0 bg-program-muted text-program camba-caption font-bold">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="camba-body font-semibold text-foreground">{step.title}</p>
                <p className="camba-caption text-muted mt-0.5">{step.reason}</p>
              </div>
            </li>
          ))}
        </ol>
      </ReportSection>
    </article>
  );
}

function ReportSection({
  title,
  empty,
  emptyText,
  children,
}: {
  title: string;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <CambaCard variant="default" padding="md" className="print:break-inside-avoid">
      <h2 className="camba-h3 text-foreground">{title}</h2>
      {empty ? (
        <p className="camba-body text-muted mt-3">{emptyText}</p>
      ) : (
        <div className="mt-3">{children}</div>
      )}
    </CambaCard>
  );
}

function SkillAreaSection({
  title,
  empty,
  emptyText,
  strengths,
  weaknesses,
  average,
  labels,
  extra,
}: {
  title: string;
  empty: boolean;
  emptyText: string;
  strengths: string[];
  weaknesses: string[];
  average: number | null;
  labels: StudentProgressReportLabels;
  extra?: React.ReactNode;
}) {
  return (
    <ReportSection title={title} empty={empty} emptyText={emptyText}>
      {average != null && (
        <p className="camba-caption text-muted">
          {labels.averageLabel}: <span className="font-semibold text-foreground">{average}%</span>
        </p>
      )}
      {extra}
      {strengths.length > 0 && (
        <>
          <p className="camba-caption font-semibold text-program mt-3">{labels.strengthsLabel}</p>
          <BulletList items={strengths} />
        </>
      )}
      {weaknesses.length > 0 && (
        <>
          <p className="camba-caption font-semibold text-[var(--status-needs-review)] mt-3">
            {labels.needsPracticeLabel}
          </p>
          <BulletList items={weaknesses} />
        </>
      )}
    </ReportSection>
  );
}

function StrengthWeaknessGrid({
  report,
  labels,
}: {
  report: StudentProgressReportViewModel;
  labels: StudentProgressReportLabels;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="camba-caption font-semibold text-program flex items-center gap-1">
          <Target className="h-3.5 w-3.5" aria-hidden />
          {labels.strengthsLabel}
        </p>
        <BulletList items={[...report.skills.grammarStrengths, ...report.skills.vocabularyStrengths]} />
      </div>
      <div>
        <p className="camba-caption font-semibold text-[var(--status-needs-review)]">
          {labels.needsPracticeLabel}
        </p>
        <BulletList
          items={[
            ...report.skills.grammarImprovementAreas,
            ...report.skills.vocabularyImprovementAreas,
          ]}
        />
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-2 space-y-1">
      {items.map((item) => (
        <li key={item} className="camba-caption text-foreground/90">
          • {item}
        </li>
      ))}
    </ul>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold text-foreground text-base">{value}</dd>
    </div>
  );
}
