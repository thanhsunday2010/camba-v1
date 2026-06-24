/**
 * M3.4 — Mock certification public API.
 */

export type {
  GoldMockComparisonEntry,
  GoldMockComparisonReport,
  MockCertificationInput,
  MockCertificationIssue,
  MockCertificationLevel,
  MockCertificationMetrics,
  MockCertificationRecord,
  MockCertificationResult,
  MockCertificationSource,
  MockCertificationSummary,
} from "@/lib/cambridge-assessment/certification/mock-certification-types";

export {
  evaluateAcademicQuality,
  evaluateBlueprintFidelity,
  evaluateListeningQuality,
  evaluateReadingQuality,
  evaluateSpeakingQuality,
  evaluateStudentSafety,
  evaluateWritingQuality,
} from "@/lib/cambridge-assessment/certification/academic-quality-rules";
export type { AcademicQualityEvaluation } from "@/lib/cambridge-assessment/certification/academic-quality-rules";

export {
  assignCertificationLevel,
  CERTIFICATION_LEVEL_THRESHOLDS,
  computeCertificationScore,
  isStudentFacing,
} from "@/lib/cambridge-assessment/certification/mock-certification-rules";
export type { CertificationLevelThresholds } from "@/lib/cambridge-assessment/certification/mock-certification-rules";

export {
  detectMockDuplicates,
  diversityScoreFromReport,
  duplicateIssuesFromReport,
} from "@/lib/cambridge-assessment/certification/mock-certification-duplicates";
export type { MockDuplicateMatch, MockDuplicateReport } from "@/lib/cambridge-assessment/certification/mock-certification-duplicates";

export {
  formatCertificationReport,
  formatCertificationSummary,
  formatGoldMockComparisonReport,
  certificationResultToJson,
} from "@/lib/cambridge-assessment/certification/mock-certification-report";

export {
  CERTIFICATION_REGISTRY_ROOT,
  clearInMemoryRegistry,
  getCertification,
  listCertifications,
  loadRegistry,
  persistRegistry,
  registerCertification,
  resultToRecord,
} from "@/lib/cambridge-assessment/certification/mock-certification-registry";
export type { CertificationRegistryFile } from "@/lib/cambridge-assessment/certification/mock-certification-registry";

export { buildCertificationSummary } from "@/lib/cambridge-assessment/certification/mock-certification-summary";

export {
  CERTIFICATION_REPORTS_ROOT,
  buildGoldMockComparisonReport,
  certifyAllGoldMocks,
  certifyAndRegister,
  certifyAssembledMockForLevel,
  certifyAssemblyResult,
  certifyGoldMock,
  certifyMockExam,
  loadRuntimeFromFile,
  runBatchCertification,
  writeCertificationReport,
  writeGoldMockComparisonReport,
} from "@/lib/cambridge-assessment/certification/mock-certification-engine";
