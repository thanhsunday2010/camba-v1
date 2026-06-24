/**
 * M3.4 — Certification report formatting.
 */

import type {
  GoldMockComparisonReport,
  MockCertificationResult,
  MockCertificationSummary,
} from "@/lib/cambridge-assessment/certification/mock-certification-types";

export function formatCertificationReport(result: MockCertificationResult): string {
  const lines: string[] = [];
  lines.push(`=== Mock Certification: ${result.mockId} ===`);
  lines.push(`Level: ${result.level} | Version: ${result.version} | Source: ${result.source}`);
  lines.push(
    `Certification: ${result.levelAssigned.toUpperCase()} | Student-facing: ${result.studentFacing ? "YES" : "NO"}`
  );
  lines.push(`Certified: ${result.certified ? "YES" : "NO"} at ${result.certifiedAt}`);
  lines.push("");
  lines.push("Scores:");
  lines.push(`  Certification: ${result.metrics.certificationScore}/100`);
  lines.push(`  Coverage:      ${result.metrics.coverageScore}/100`);
  lines.push(`  QA:            ${result.metrics.qaScore}/100`);
  lines.push(`  Diversity:     ${result.metrics.diversityScore}/100`);
  lines.push(`  Blueprint:     ${result.metrics.blueprintScore}/100`);
  lines.push("");
  lines.push("Inventory:");
  lines.push(
    `  Grammar: ${result.metrics.grammarDistinct} | Vocab: ${result.metrics.vocabularyDistinct} | Skills: ${result.metrics.skillDistinct} | Tasks: ${result.metrics.taskDistinct}`
  );
  lines.push(
    `  Writing: ${result.metrics.writingCount} | Speaking: ${result.metrics.speakingCount} | Reading: ${result.metrics.readingCount} | Listening: ${result.metrics.listeningCount}`
  );
  lines.push(
    `  Duplicates: ${result.metrics.duplicateItemCount} items | Clusters: ${result.metrics.duplicateClusterCount}`
  );

  if (result.notes.length) {
    lines.push("", "Notes:");
    for (const n of result.notes) lines.push(`  - ${n}`);
  }

  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter((i) => i.severity === "warning");
  if (errors.length) {
    lines.push("", `Errors (${errors.length}):`);
    for (const i of errors.slice(0, 25)) {
      lines.push(`  [${i.category}] ${i.code}: ${i.message}`);
    }
    if (errors.length > 25) lines.push(`  ... and ${errors.length - 25} more`);
  }
  if (warnings.length) {
    lines.push("", `Warnings (${warnings.length}):`);
    for (const i of warnings.slice(0, 15)) {
      lines.push(`  [${i.category}] ${i.code}: ${i.message}`);
    }
    if (warnings.length > 15) lines.push(`  ... and ${warnings.length - 15} more`);
  }

  return lines.join("\n");
}

export function formatCertificationSummary(summary: MockCertificationSummary): string {
  const lines: string[] = [];
  lines.push("=== Mock Certification Summary ===");
  lines.push(`Total mocks: ${summary.totalMocks}`);
  lines.push(`Certified: ${summary.certifiedCount} | Rejected: ${summary.rejectedCount}`);
  lines.push(`Gold: ${summary.goldCount} | Silver: ${summary.silverCount} | Bronze: ${summary.bronzeCount}`);
  lines.push("");
  for (const [level, stats] of Object.entries(summary.byLevel)) {
    lines.push(
      `${level}: total=${stats.total} gold=${stats.gold} silver=${stats.silver} bronze=${stats.bronze} rejected=${stats.rejected} avgScore=${stats.avgCertificationScore}`
    );
  }
  return lines.join("\n");
}

export function formatGoldMockComparisonReport(report: GoldMockComparisonReport): string {
  const lines: string[] = [];
  lines.push("=== Gold Mock vs Generated Comparison ===");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`All gold outperform: ${report.allGoldOutperform ? "YES" : "NO"}`);
  lines.push("");
  for (const e of report.entries) {
    lines.push(
      `${e.level}: gold=${e.goldScore} (${e.goldLevel}) vs assembled=${e.assembledScore} (${e.assembledLevel}) delta=${e.scoreDelta} outperform=${e.goldOutperforms}`
    );
  }
  return lines.join("\n");
}

export function certificationResultToJson(result: MockCertificationResult): string {
  return JSON.stringify(result, null, 2);
}
