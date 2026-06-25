export type {
  ReportExportVariant,
  ReportTrendLabel,
  ReportConsistencyLabel,
  ParentProgressSnapshot,
  LearningProgressSummary,
  MockPerformanceSummary,
  WritingProgressSummary,
  SpeakingProgressSummary,
  ParentSkillSummary,
  AchievementSummary,
  JourneySummary,
  NextStepRecommendation,
  NextStepsSummary,
  StudentProgressReportViewModel,
} from "./report-types";

export type { StudentProgressReportLabels } from "./report-labels";
export type { ReportResolvers } from "./report-utils";

export {
  getStudentProgressReport,
} from "./report-view-model";

export {
  buildStudentProgressReportViewModel,
  deriveConsistency,
  formatTrendLabel,
} from "./report-utils";

export { generateProgressReportPdf } from "./pdf/generate-progress-pdf";
