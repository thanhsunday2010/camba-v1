/**
 * M3.4 — Certification dashboard data layer (no UI).
 */

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type {
  MockCertificationRecord,
  MockCertificationSummary,
} from "@/lib/cambridge-assessment/certification/mock-certification-types";
import { isStudentFacing } from "@/lib/cambridge-assessment/certification/mock-certification-rules";

const LEVELS: CambridgeExamLevel[] = ["starters", "movers", "flyers", "ket", "pet"];

function emptyLevelStats() {
  return {
    total: 0,
    gold: 0,
    silver: 0,
    bronze: 0,
    rejected: 0,
    avgCertificationScore: 0,
    avgCoverageScore: 0,
  };
}

export function buildCertificationSummary(
  records: MockCertificationRecord[]
): MockCertificationSummary {
  const byLevel = Object.fromEntries(
    LEVELS.map((l) => [l, emptyLevelStats()])
  ) as MockCertificationSummary["byLevel"];

  let goldCount = 0;
  let silverCount = 0;
  let bronzeCount = 0;
  let rejectedCount = 0;

  for (const r of records) {
    const stats = byLevel[r.level];
    stats.total += 1;
    if (r.certificationLevel === "gold") {
      stats.gold += 1;
      goldCount += 1;
    } else if (r.certificationLevel === "silver") {
      stats.silver += 1;
      silverCount += 1;
    } else if (r.certificationLevel === "bronze") {
      stats.bronze += 1;
      bronzeCount += 1;
    } else {
      stats.rejected += 1;
      rejectedCount += 1;
    }
    stats.avgCertificationScore += r.certificationScore;
    stats.avgCoverageScore += r.coverageScore;
  }

  for (const level of LEVELS) {
    const stats = byLevel[level];
    if (stats.total > 0) {
      stats.avgCertificationScore = Math.round(stats.avgCertificationScore / stats.total);
      stats.avgCoverageScore = Math.round(stats.avgCoverageScore / stats.total);
    }
  }

  const certifiedCount = records.filter((r) => isStudentFacing(r.certificationLevel)).length;

  return {
    totalMocks: records.length,
    certifiedCount,
    rejectedCount,
    goldCount,
    silverCount,
    bronzeCount,
    byLevel,
    coverageTrends: LEVELS.map((level) => ({
      level,
      avgCoverageScore: byLevel[level].avgCoverageScore,
    })),
    qualityTrends: LEVELS.map((level) => ({
      level,
      avgQaScore:
        records.filter((r) => r.level === level).reduce((s, r) => s + r.qaScore, 0) /
          Math.max(1, records.filter((r) => r.level === level).length) || 0,
    })),
  };
}
