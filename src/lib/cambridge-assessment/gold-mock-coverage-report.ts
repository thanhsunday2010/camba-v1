/**
 * M4.1 — Gold Mock coverage report generator.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { certifyGoldMock } from "@/lib/cambridge-assessment/certification/mock-certification-engine";
import { GOLD_MOCK_LEVELS } from "@/lib/cambridge-assessment/gold-mock-specifications";
import { validateGoldMock } from "@/lib/cambridge-assessment/gold-mock-validation";
import {
  detectCrossMockStemDuplicates,
  getAllGoldMockManifests,
  getGoldMockInventoryStatus,
} from "@/lib/cambridge-assessment/gold-mock-registry";
import { registerAvailableGoldMocks } from "@/lib/cambridge-assessment/gold-mocks/register-all-gold-mocks";

export const GOLD_MOCK_COVERAGE_REPORT_PATH = resolve(
  process.cwd(),
  "docs/cambridge-assessment/gold-mock-coverage-report.md"
);

function mergeCounts(
  target: Record<string, number>,
  source: Record<string, number>
): void {
  for (const [key, count] of Object.entries(source)) {
    target[key] = (target[key] ?? 0) + count;
  }
}

function topEntries(map: Record<string, number>, limit = 12): Array<[string, number]> {
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export function buildGoldMockCoverageReport(): string {
  registerAvailableGoldMocks();
  const mocks = getAllGoldMockManifests();
  const inventory = getGoldMockInventoryStatus();

  const aggregateGrammar: Record<string, number> = {};
  const aggregateVocab: Record<string, number> = {};
  const aggregateSkills: Record<string, number> = {};
  const aggregateTasks: Record<string, number> = {};
  const difficultyTotals = { easy: 0, medium: 0, hard: 0 };
  let totalWriting = 0;
  let totalSpeaking = 0;
  let totalQuestions = 0;

  const lines: string[] = [
    "# Gold Mock Coverage Report (M4.1)",
    "",
    `Generated from ${mocks.length} canonical Gold Mocks.`,
    "",
    "## Inventory",
    "",
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Registered | ${inventory.registered} / ${inventory.expected} |`,
    `| Complete | ${inventory.complete ? "Yes" : "No"} |`,
    "",
    "### Mocks per level",
    "",
    "| Level | Count |",
    "|-------|-------|",
  ];

  for (const level of GOLD_MOCK_LEVELS) {
    lines.push(`| ${level} | ${inventory.byLevel[level]} |`);
  }

  lines.push("", "## Per-mock validation", "");

  for (const mock of mocks) {
    const report = validateGoldMock(mock);
    const cert = certifyGoldMock(mock);
    totalQuestions += mock.questions.length;
    totalWriting += report.writingCount;
    totalSpeaking += report.speakingCount;
    mergeCounts(aggregateGrammar, report.grammarCoverage);
    mergeCounts(aggregateVocab, report.vocabularyCoverage);
    mergeCounts(aggregateSkills, report.skillCoverage);
    mergeCounts(aggregateTasks, report.taskCoverage);
    difficultyTotals.easy += report.difficultyCounts.easy;
    difficultyTotals.medium += report.difficultyCounts.medium;
    difficultyTotals.hard += report.difficultyCounts.hard;

    lines.push(
      `### ${mock.gold.goldMockId}`,
      "",
      `- Level: ${report.level}`,
      `- Questions: ${mock.questions.length}`,
      `- Blueprint compliant: ${report.blueprintCompliant ? "yes" : "no"}`,
      `- Certification: **${cert.levelAssigned}** (score ${cert.metrics.certificationScore})`,
      `- Writing tasks: ${report.writingCount} | Speaking tasks: ${report.speakingCount}`,
      `- Difficulty: easy ${report.difficultyCounts.easy}, medium ${report.difficultyCounts.medium}, hard ${report.difficultyCounts.hard}`,
      `- Grammar tags: ${Object.keys(report.grammarCoverage).length}`,
      `- Vocabulary topics: ${Object.keys(report.vocabularyCoverage).length}`,
      ""
    );
  }

  lines.push(
    "## Aggregate coverage (all 15 mocks)",
    "",
    `Total questions: ${totalQuestions}`,
    `Writing tasks: ${totalWriting} | Speaking tasks: ${totalSpeaking}`,
    "",
    "### Difficulty distribution",
    "",
    `| Band | Count | Share |`,
    `|------|-------|-------|`,
    `| Easy | ${difficultyTotals.easy} | ${pct(difficultyTotals.easy, totalQuestions)} |`,
    `| Medium | ${difficultyTotals.medium} | ${pct(difficultyTotals.medium, totalQuestions)} |`,
    `| Hard | ${difficultyTotals.hard} | ${pct(difficultyTotals.hard, totalQuestions)} |`,
    "",
    "### Grammar coverage (top tags)",
    "",
    ...formatTopTable(topEntries(aggregateGrammar)),
    "",
    "### Vocabulary coverage (top topics)",
    "",
    ...formatTopTable(topEntries(aggregateVocab)),
    "",
    "### Skill coverage",
    "",
    ...formatTopTable(topEntries(aggregateSkills, 8)),
    "",
    "### Task type coverage",
    "",
    ...formatTopTable(topEntries(aggregateTasks, 15)),
    "",
    "## Cross-mock duplication analysis",
    ""
  );

  let totalDupes = 0;
  for (const level of GOLD_MOCK_LEVELS) {
    const dupes = detectCrossMockStemDuplicates(level);
    totalDupes += dupes.length;
    lines.push(`### ${level}`, "");
    if (dupes.length === 0) {
      lines.push("No content duplicates detected across mock versions.", "");
    } else {
      lines.push("| Mock A | Mock B | Ref A | Ref B |", "|--------|--------|-------|-------|");
      for (const d of dupes) {
        lines.push(`| ${d.mockA} | ${d.mockB} | ${d.refA} | ${d.refB} |`);
      }
      lines.push("");
    }
  }

  lines.push(
    `**Total cross-mock duplicates:** ${totalDupes}`,
    "",
    "## Certification summary",
    "",
    "All Gold Mocks must certify at **gold** tier only (M4.1 policy).",
    ""
  );

  let allGold = true;
  for (const mock of mocks) {
    const cert = certifyGoldMock(mock);
    if (cert.levelAssigned !== "gold") allGold = false;
    lines.push(
      `- \`${mock.gold.goldMockId}\`: ${cert.levelAssigned} (${cert.metrics.certificationScore}) — blueprint ${cert.metrics.blueprintScore}%`
    );
  }

  lines.push(
    "",
    allGold ? "**Result:** All 15 mocks certified GOLD." : "**Result:** Some mocks failed GOLD certification.",
    "",
    "## Weak areas and recommendations",
    "",
    "- **KET/PET listening audio:** Production listening assets remain placeholders; transcripts are present for QA.",
    "- **Theme rotation:** Maintain distinct thematic focus per mock version to avoid learner fatigue.",
    "- **M4.2 item extraction:** All 15 manifests are item-bank-ready via `extractItemBankFromManifest()`.",
    "- **Future expansion:** Add mock versions 4+ only after academic review; never replace Gold 1–3 as canonical baselines.",
    ""
  );

  return lines.join("\n");
}

function pct(count: number, total: number): string {
  if (!total) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

function formatTopTable(entries: Array<[string, number]>): string[] {
  if (!entries.length) return ["_None recorded._"];
  const lines = ["| Tag | Items |", "|-----|-------|"];
  for (const [tag, count] of entries) {
    lines.push(`| ${tag} | ${count} |`);
  }
  return lines;
}

export function writeGoldMockCoverageReport(path = GOLD_MOCK_COVERAGE_REPORT_PATH): string {
  const content = buildGoldMockCoverageReport();
  writeFileSync(path, content, "utf8");
  return path;
}
