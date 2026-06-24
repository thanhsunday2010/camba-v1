import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";

/** M3.4 — Certification tier for student-facing release decisions. */
export type MockCertificationLevel = "gold" | "silver" | "bronze" | "rejected";

export type MockCertificationSource = "gold" | "assembled" | "imported";

export type MockCertificationIssue = {
  code: string;
  path: string;
  message: string;
  severity: "error" | "warning";
  category:
    | "blueprint"
    | "coverage"
    | "writing"
    | "speaking"
    | "reading"
    | "listening"
    | "safety"
    | "duplicate"
    | "quality";
};

export type MockCertificationMetrics = {
  /** Overall certification score 0–100. */
  certificationScore: number;
  /** Coverage diversity score 0–100. */
  coverageScore: number;
  /** Academic QA score 0–100. */
  qaScore: number;
  /** Duplication penalty score 0–100 (100 = no duplication). */
  diversityScore: number;
  /** Blueprint compliance score 0–100. */
  blueprintScore: number;
  grammarDistinct: number;
  vocabularyDistinct: number;
  skillDistinct: number;
  taskDistinct: number;
  topicDistinct: number;
  difficultyDistinct: number;
  writingCount: number;
  speakingCount: number;
  readingCount: number;
  listeningCount: number;
  duplicateItemCount: number;
  duplicateClusterCount: number;
};

export type MockCertificationInput = {
  mockId: string;
  version?: string;
  level: CambridgeExamLevel;
  runtime: YleMockManifest;
  source: MockCertificationSource;
  /** Optional assembly seed for traceability. */
  assemblySeed?: string;
};

export type MockCertificationResult = {
  mockId: string;
  version: string;
  level: CambridgeExamLevel;
  source: MockCertificationSource;
  levelAssigned: MockCertificationLevel;
  certified: boolean;
  studentFacing: boolean;
  metrics: MockCertificationMetrics;
  issues: MockCertificationIssue[];
  certifiedAt: string;
  notes: string[];
};

export type MockCertificationRecord = {
  mockId: string;
  version: string;
  level: CambridgeExamLevel;
  source: MockCertificationSource;
  certificationLevel: MockCertificationLevel;
  certificationScore: number;
  coverageScore: number;
  qaScore: number;
  diversityScore: number;
  certifiedAt: string;
  notes: string[];
};

export type MockCertificationSummary = {
  totalMocks: number;
  certifiedCount: number;
  rejectedCount: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  byLevel: Record<
    CambridgeExamLevel,
    {
      total: number;
      gold: number;
      silver: number;
      bronze: number;
      rejected: number;
      avgCertificationScore: number;
      avgCoverageScore: number;
    }
  >;
  coverageTrends: Array<{ level: CambridgeExamLevel; avgCoverageScore: number }>;
  qualityTrends: Array<{ level: CambridgeExamLevel; avgQaScore: number }>;
};

export type GoldMockComparisonEntry = {
  level: CambridgeExamLevel;
  goldMockId: string;
  goldScore: number;
  goldLevel: MockCertificationLevel;
  assembledMockId: string;
  assembledScore: number;
  assembledLevel: MockCertificationLevel;
  goldOutperforms: boolean;
  scoreDelta: number;
};

export type GoldMockComparisonReport = {
  generatedAt: string;
  entries: GoldMockComparisonEntry[];
  allGoldOutperform: boolean;
};
