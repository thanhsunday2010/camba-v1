import type { CambridgeExamPartBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type { CambridgeItemBankItem } from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import { getCambridgeTask } from "@/lib/cambridge-assessment/cambridge-task-taxonomy";
import { CambridgeAssemblyError } from "@/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly-errors";
import type { SeededRng } from "@/lib/cambridge-assessment/exam-assembly/cambridge-seeded-random";

export type ItemSelectionContext = {
  part: CambridgeExamPartBlueprint;
  paperSlug: string;
  bank: CambridgeItemBankItem[];
  usedItemIds: Set<string>;
  rng: SeededRng;
  /** Running difficulty counts for stratified selection. */
  difficultyCounts?: Record<"easy" | "medium" | "hard", number>;
  difficultyTargets?: Record<"easy" | "medium" | "hard", number>;
};

function difficultyPriority(
  difficulty: CambridgeItemBankItem["difficulty"],
  counts: Record<"easy" | "medium" | "hard", number>,
  targets: Record<"easy" | "medium" | "hard", number>,
  totalSelected: number
): number {
  if (totalSelected === 0) return 0;
  const currentShare = counts[difficulty] / totalSelected;
  const targetShare = targets[difficulty];
  return targetShare - currentShare;
}

function isValidItemForPart(
  item: CambridgeItemBankItem,
  part: CambridgeExamPartBlueprint
): boolean {
  if (item.partSlug !== part.partSlug) return false;
  if (item.skill !== part.skill) return false;
  if (!part.allowedTaskTypes.includes(item.taskType)) return false;

  const task = getCambridgeTask(item.taskType);
  // Blueprint allowedTaskTypes are level-scoped — authoritative for assembly.
  if (task.skill !== item.skill) return false;
  if (part.aiEvaluated && !task.aiRequired) return false;
  if (!part.aiEvaluated && task.aiRequired) return false;

  return true;
}

export function filterValidItemsForPart(
  bank: CambridgeItemBankItem[],
  part: CambridgeExamPartBlueprint
): CambridgeItemBankItem[] {
  return bank.filter((item) => isValidItemForPart(item, part));
}

export function selectItemsForPart(
  ctx: ItemSelectionContext
): CambridgeItemBankItem[] {
  const candidates = filterValidItemsForPart(ctx.bank, ctx.part);
  if (candidates.length < ctx.part.questionCount) {
    throw new CambridgeAssemblyError(
      "INSUFFICIENT_ITEMS",
      `Part ${ctx.part.partSlug} needs ${ctx.part.questionCount} items but only ${candidates.length} valid candidates exist.`,
      { path: ctx.part.partSlug }
    );
  }

  const unused = candidates.filter((c) => !ctx.usedItemIds.has(c.id));
  const pool = unused.length >= ctx.part.questionCount ? unused : candidates;

  const scored = pool.map((item) => {
    const random = ctx.rng.next();
    const isReceptive = item.kind === "reading" || item.kind === "listening";
    const counts = ctx.difficultyCounts ?? { easy: 0, medium: 0, hard: 0 };
    const targets = ctx.difficultyTargets ?? { easy: 0.6, medium: 0.3, hard: 0.1 };
    const totalSelected = counts.easy + counts.medium + counts.hard;
    const priority =
      isReceptive && ctx.difficultyCounts
        ? difficultyPriority(item.difficulty, counts, targets, totalSelected)
        : 0;
    return {
      item,
      // Lower score = selected first. Boost underrepresented difficulty bands.
      score: random - priority * 10,
    };
  });
  scored.sort((a, b) => a.score - b.score);

  const selected = scored.slice(0, ctx.part.questionCount).map((s) => s.item);

  for (const item of selected) {
    if (ctx.usedItemIds.has(item.id)) {
      throw new CambridgeAssemblyError(
        "DUPLICATE_ITEM",
        `Item ${item.id} already used in this exam form.`,
        { path: ctx.part.partSlug }
      );
    }
    ctx.usedItemIds.add(item.id);
    if (ctx.difficultyCounts && (item.kind === "reading" || item.kind === "listening")) {
      ctx.difficultyCounts[item.difficulty] += 1;
    }
  }

  return selected;
}

export function validateItemBankItem(item: CambridgeItemBankItem): string[] {
  const errors: string[] = [];
  if (!item.id) errors.push("Missing item id.");
  if (!item.level) errors.push("Missing level.");
  if (!item.partSlug) errors.push("Missing partSlug.");
  if (!item.taskType) errors.push("Missing taskType.");

  const task = getCambridgeTask(item.taskType);
  if (!task) {
    errors.push(`Unknown task type: ${item.taskType}.`);
    return errors;
  }
  if (task.skill !== item.skill) {
    errors.push(`Task ${item.taskType} skill ${task.skill} !== item skill ${item.skill}.`);
  }

  if (item.kind === "writing" || item.kind === "speaking") {
    if (item.scoring.mode !== "ai") {
      errors.push(`${item.kind} items must use AI scoring mode.`);
    }
  } else if (item.scoring.mode !== "auto") {
    errors.push(`Receptive items must use auto scoring mode.`);
  }

  return errors;
}
