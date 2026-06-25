import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { reportPdfStyles as s } from "@/lib/reporting/pdf/report-pdf-styles";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";
import type {
  ReportExportVariant,
  StudentProgressReportViewModel,
} from "@/lib/reporting/report-types";

function formatDate(iso: string, locale = "en"): string {
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View style={s.bulletList}>
      {items.map((item) => (
        <Text key={item} style={s.bullet}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ReportFooter({
  labels,
  generatedAt,
}: {
  labels: StudentProgressReportLabels;
  generatedAt: string;
}) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>{labels.footerNote}</Text>
      <Text style={s.footerText}>
        {labels.generatedOn} {formatDate(generatedAt)}
      </Text>
    </View>
  );
}

function SnapshotSection({
  report,
  labels,
}: {
  report: StudentProgressReportViewModel;
  labels: StudentProgressReportLabels;
}) {
  const { snapshot } = report;
  return (
    <Section title={labels.snapshotTitle}>
      <View style={s.highlightBox}>
        <Text style={s.highlightTitle}>{snapshot.studentName}</Text>
        <Row
          label={labels.levelLabel}
          value={
            [snapshot.levelName, snapshot.cefrEstimate].filter(Boolean).join(" · ") ||
            "—"
          }
        />
      </View>
      <View style={s.statGrid}>
        <View style={s.statCell}>
          <Text style={s.statLabel}>{labels.streakLabel}</Text>
          <Text style={s.statValue}>{snapshot.currentStreak}</Text>
        </View>
        <View style={s.statCell}>
          <Text style={s.statLabel}>{labels.lessonsLabel}</Text>
          <Text style={s.statValue}>{snapshot.lessonsCompleted}</Text>
        </View>
        <View style={s.statCell}>
          <Text style={s.statLabel}>{labels.mocksLabel}</Text>
          <Text style={s.statValue}>{snapshot.mocksCompleted}</Text>
        </View>
      </View>
      {snapshot.latestActivityTitle && (
        <Row
          label={labels.latestActivityLabel}
          value={`${snapshot.latestActivityTitle}${
            snapshot.latestActivityDate
              ? ` (${formatDate(snapshot.latestActivityDate)})`
              : ""
          }`}
        />
      )}
      {snapshot.journeyCompletionPercent != null && (
        <Row
          label={labels.journeyLabel}
          value={`${snapshot.journeyCurrentLevel ?? "—"} · ${snapshot.journeyCompletionPercent}%`}
        />
      )}
      {!snapshot.hasData && (
        <>
          <Text style={s.highlightTitle}>{labels.gettingStartedTitle}</Text>
          <Text style={s.emptyNote}>{labels.gettingStartedBody}</Text>
        </>
      )}
    </Section>
  );
}

function NextStepsSection({
  report,
  labels,
}: {
  report: StudentProgressReportViewModel;
  labels: StudentProgressReportLabels;
}) {
  return (
    <Section title={labels.nextStepsTitle}>
      {report.nextSteps.isEmpty ? (
        <Text style={s.emptyNote}>{labels.nextStepsEmpty}</Text>
      ) : (
        report.nextSteps.steps.map((step) => (
          <View key={step.id} style={s.nextStep}>
            <Text style={s.nextStepTitle}>{step.title}</Text>
            <Text style={s.nextStepReason}>{step.reason}</Text>
          </View>
        ))
      )}
    </Section>
  );
}

function FullReportSections({
  report,
  labels,
}: {
  report: StudentProgressReportViewModel;
  labels: StudentProgressReportLabels;
}) {
  const { learning, mockPerformance, writing, speaking, skills, achievements, journey } =
    report;

  return (
    <>
      <Section title={labels.learningTitle}>
        {learning.isEmpty ? (
          <Text style={s.emptyNote}>{labels.learningEmpty}</Text>
        ) : (
          <>
            <Row label={labels.consistencyLabel} value={learning.consistencyNote} />
            <Row label={labels.lessonsLabel} value={String(learning.lessonsCompleted)} />
            <Row label={labels.unitsLabel} value={String(learning.unitsCompleted)} />
            {learning.currentStage && (
              <Row label={labels.levelLabel} value={learning.currentStage} />
            )}
          </>
        )}
      </Section>

      <Section title={labels.mockTitle}>
        {mockPerformance.isEmpty ? (
          <Text style={s.emptyNote}>{labels.mockEmpty}</Text>
        ) : (
          <>
            {mockPerformance.latestScorePercent != null && (
              <Row
                label={labels.latestScoreLabel}
                value={`${mockPerformance.latestScorePercent}%`}
              />
            )}
            {mockPerformance.bestScorePercent != null && (
              <Row
                label={labels.bestScoreLabel}
                value={`${mockPerformance.bestScorePercent}%`}
              />
            )}
            {mockPerformance.readinessPercent != null && (
              <Row
                label={labels.readinessLabel}
                value={`${mockPerformance.readinessPercent}%${
                  mockPerformance.readinessBandLabel
                    ? ` · ${mockPerformance.readinessBandLabel}`
                    : ""
                }`}
              />
            )}
          </>
        )}
      </Section>

      <Section title={labels.writingTitle}>
        {writing.isEmpty ? (
          <Text style={s.emptyNote}>{labels.writingEmpty}</Text>
        ) : (
          <>
            <Row label={labels.averageLabel} value={`${writing.averageScore ?? "—"}%`} />
            <Text style={s.label}>{labels.strengthsLabel}</Text>
            <BulletList items={writing.strengths} />
            <Text style={[s.label, { marginTop: 6 }]}>{labels.needsPracticeLabel}</Text>
            <BulletList items={writing.improvementAreas} />
          </>
        )}
      </Section>

      <Section title={labels.speakingTitle}>
        {speaking.isEmpty ? (
          <Text style={s.emptyNote}>{labels.speakingEmpty}</Text>
        ) : (
          <>
            <Row label={labels.averageLabel} value={`${speaking.averageScore ?? "—"}%`} />
            {speaking.pronunciationAvg != null && (
              <Row label="Pronunciation" value={`${speaking.pronunciationAvg}%`} />
            )}
            {speaking.fluencyAvg != null && (
              <Row label="Fluency" value={`${speaking.fluencyAvg}%`} />
            )}
          </>
        )}
      </Section>

      <Section title={labels.skillsTitle}>
        {skills.isEmpty ? (
          <Text style={s.emptyNote}>{skills.emptyNote ?? labels.skillsEmpty}</Text>
        ) : (
          <>
            <Text style={s.label}>{labels.strengthsLabel} (Grammar)</Text>
            <BulletList items={skills.grammarStrengths} />
            <Text style={[s.label, { marginTop: 6 }]}>{labels.needsPracticeLabel} (Grammar)</Text>
            <BulletList items={skills.grammarImprovementAreas} />
            <Text style={[s.label, { marginTop: 6 }]}>{labels.strengthsLabel} (Vocabulary)</Text>
            <BulletList items={skills.vocabularyStrengths} />
            <Text style={[s.label, { marginTop: 6 }]}>
              {labels.needsPracticeLabel} (Vocabulary)
            </Text>
            <BulletList items={skills.vocabularyImprovementAreas} />
          </>
        )}
      </Section>

      <Section title={labels.achievementsTitle}>
        {achievements.isEmpty ? (
          <Text style={s.emptyNote}>{labels.achievementsEmpty}</Text>
        ) : (
          <>
            <Row
              label={labels.achievementsTitle}
              value={`${achievements.unlockedCount} / ${achievements.totalAchievements}`}
            />
            <BulletList
              items={achievements.recentAchievements.map((a) => a.title)}
            />
          </>
        )}
      </Section>

      <Section title={labels.journeyTitle}>
        {journey.isEmpty ? (
          <Text style={s.emptyNote}>{labels.journeyEmpty}</Text>
        ) : (
          <>
            {journey.currentLevel && (
              <Row label={labels.levelLabel} value={journey.currentLevel} />
            )}
            {journey.nextMilestone && (
              <Row label="Next milestone" value={journey.nextMilestone} />
            )}
            {journey.completionPercent != null && (
              <Row label={labels.journeyLabel} value={`${journey.completionPercent}%`} />
            )}
          </>
        )}
      </Section>
    </>
  );
}

export interface ProgressReportPdfDocumentProps {
  report: StudentProgressReportViewModel;
  labels: StudentProgressReportLabels;
  variant: ReportExportVariant;
}

export function ProgressReportPdfDocument({
  report,
  labels,
  variant,
}: ProgressReportPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>CAMBA</Text>
          <Text style={s.title}>{labels.reportTitle}</Text>
          <Text style={s.subtitle}>{labels.reportSubtitle}</Text>
        </View>

        <SnapshotSection report={report} labels={labels} />

        {variant === "full" && <FullReportSections report={report} labels={labels} />}

        <NextStepsSection report={report} labels={labels} />

        <ReportFooter labels={labels} generatedAt={report.snapshot.generatedAt} />
      </Page>
    </Document>
  );
}
