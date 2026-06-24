import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type {
  CambridgeExamAssemblyInput,
  CambridgeExamAssemblyResult,
  CambridgeExamVersion,
  CambridgeAssemblyPartSelection,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-types";
import { CambridgeAssemblyError } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-errors";
import { validateAssemblyCoverage } from "@/lib/cambridge-assessment/exam-assembly/cambridge-coverage-engine";
import {
  buildExamManifest,
  hydrateManifestForRuntime,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-manifest-hydrator";
import { buildAssemblyReport } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-report";
import {
  selectItemsForPart,
  validateItemBankItem,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-item-selector";
import { getDifficultyPolicyForLevel } from "@/lib/cambridge-assessment/exam-assembly/cambridge-difficulty-policy";
import { loadAssemblyBank } from "@/lib/cambridge-assessment/exam-assembly/fixtures/assembly-bank-loader";
import {
  createSeededRng,
  deriveAssemblySeed,
} from "@/lib/cambridge-assessment/exam-assembly/cambridge-seeded-random";

const DEFAULT_SEED = "camba-m2-4-reference";

/**
 * Single assembly authority — blueprint + item bank → manifest + runtime hydration.
 */
export function assembleCambridgeExam(
  input: CambridgeExamAssemblyInput
): CambridgeExamAssemblyResult {
  const version: CambridgeExamVersion = input.version ?? "A";
  const baseSeed = input.seed ?? DEFAULT_SEED;
  const assemblySeed = deriveAssemblySeed(baseSeed, input.level, version);
  const blueprint = getCambridgeExamBlueprint(input.level);
  const bank = input.itemBank ?? loadAssemblyBank(input.level);
  const rng = createSeededRng(assemblySeed);
  const usedItemIds = new Set<string>();
  const selections: CambridgeAssemblyPartSelection[] = [];
  const preErrors: string[] = [];
  const difficultyPolicy = getDifficultyPolicyForLevel(input.level);
  const difficultyCounts = { easy: 0, medium: 0, hard: 0 };

  for (const item of bank) {
    const itemErrors = validateItemBankItem(item);
    if (itemErrors.length) {
      preErrors.push(`Item ${item.id}: ${itemErrors.join(" ")}`);
    }
  }

  if (preErrors.length && input.strict) {
    throw new CambridgeAssemblyError("INVALID_ITEM", "Item bank validation failed.", {
      details: preErrors.slice(0, 10),
    });
  }

  let sortOrder = 0;

  try {
    for (const paper of blueprint.papers) {
      for (const part of paper.parts) {
        const selected = selectItemsForPart({
          part,
          paperSlug: paper.paperSlug,
          bank,
          usedItemIds,
          rng,
          difficultyCounts,
          difficultyTargets: difficultyPolicy.distribution,
        });

        for (const item of selected) {
          sortOrder += 1;
          selections.push({
            paperSlug: paper.paperSlug,
            partSlug: part.partSlug,
            partNumber: part.partNumber,
            skill: part.skill,
            taskType: item.taskType,
            item,
            sortOrder,
            points: part.pointsPerItem,
          });
        }
      }
    }
  } catch (error) {
    const message =
      error instanceof CambridgeAssemblyError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Assembly selection failed.";
    const coverage = validateAssemblyCoverage(blueprint, selections);
    const report = buildAssemblyReport(blueprint, selections, coverage, {
      examVersion: version,
      assemblySeed,
    });
    report.errors.push(message);
    report.valid = false;
    return {
      success: false,
      manifest: null,
      report,
      selections,
      errors: [message, ...report.errors],
    };
  }

  const coverage = validateAssemblyCoverage(blueprint, selections);
  const manifest = buildExamManifest(blueprint, selections, {
    examVersion: version,
    assemblySeed,
  });
  const report = buildAssemblyReport(blueprint, selections, coverage, {
    examVersion: version,
    assemblySeed,
  });

  if (!coverage.valid) {
    if (input.strict) {
      throw new CambridgeAssemblyError("COVERAGE_FAILED", "Assembly failed coverage validation.", {
        details: coverage.errors,
      });
    }
    return {
      success: false,
      manifest,
      report,
      selections,
      errors: coverage.errors,
    };
  }

  const runtimeManifest = hydrateManifestForRuntime(manifest, selections, blueprint);

  return {
    success: true,
    manifest,
    runtimeManifest,
    report,
    selections,
  };
}

export function assembleAllVersions(
  level: CambridgeExamAssemblyInput["level"],
  options: Omit<CambridgeExamAssemblyInput, "level" | "version"> = {}
): CambridgeExamAssemblyResult[] {
  return (["A", "B", "C"] as const).map((version) =>
    assembleCambridgeExam({ ...options, level, version })
  );
}
