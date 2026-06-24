import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getCambridgeExamBlueprint } from "@/lib/cambridge-assessment/cambridge-exam-blueprints";
import type {
  CambridgeItemBankFile,
  CambridgeItemBankItem,
} from "@/lib/cambridge-assessment/cambridge-item-bank-proposal";
import { filterValidItemsForPart } from "@/lib/cambridge-assessment/exam-assembly/cambridge-item-selector";
import { buildReferenceBankForLevel } from "@/lib/cambridge-assessment/exam-assembly/fixtures/assembly-reference-bank";
import {
  adaptItemBankForAssembly,
  isM32ItemBankFile,
} from "@/lib/item-bank/item-bank-assembly-adapter";
import type { ItemBankFile, ItemBankQuestion } from "@/lib/item-bank/item-bank-types";

const DEFAULT_BANK_ROOT = resolve(process.cwd(), "data/cambridge-item-banks");

function bankFilePath(root: string, level: CambridgeExamLevel): string {
  return join(root, level, "items.json");
}

function readBankFile(
  root: string,
  level: CambridgeExamLevel
): CambridgeItemBankFile | ItemBankFile | null {
  const path = bankFilePath(root, level);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as CambridgeItemBankFile | ItemBankFile;
}

function normalizeBankItems(
  file: CambridgeItemBankFile | ItemBankFile
): CambridgeItemBankItem[] {
  const items = file.items as unknown[];
  if (isM32ItemBankFile(items)) {
    return adaptItemBankForAssembly(items as ItemBankQuestion[]);
  }
  return items as CambridgeItemBankItem[];
}

export type AssemblyBankLoaderOptions = {
  rootDir?: string;
  /** When true, always use programmatic reference bank (golden assembly). */
  forceReference?: boolean;
};

function isBankSufficientForAssembly(
  level: CambridgeExamLevel,
  bank: CambridgeItemBankItem[]
): boolean {
  const blueprint = getCambridgeExamBlueprint(level);
  for (const paper of blueprint.papers) {
    for (const part of paper.parts) {
      const candidates = filterValidItemsForPart(bank, part);
      if (candidates.length < part.questionCount) return false;
    }
  }
  return true;
}

/**
 * Load items for assembly — prefers M3.2 unified bank when assembly-ready,
 * otherwise falls back to M2.4 reference fixture bank.
 */
export function loadAssemblyBank(
  level: CambridgeExamLevel,
  options: AssemblyBankLoaderOptions = {}
): CambridgeItemBankItem[] {
  if (!options.forceReference) {
    const root = options.rootDir ?? DEFAULT_BANK_ROOT;
    const file = readBankFile(root, level);
    if (file?.items?.length) {
      const adapted = normalizeBankItems(file);
      if (isBankSufficientForAssembly(level, adapted)) return adapted;
    }

    // M1.8 legacy path for YLE levels
    const legacyRoot = resolve(process.cwd(), "data/item-bank");
    const legacy = readBankFile(legacyRoot, level as CambridgeExamLevel);
    if (legacy?.items?.length) {
      const adapted = normalizeBankItems(legacy);
      if (isBankSufficientForAssembly(level, adapted)) return adapted;
    }
  }

  return buildReferenceBankForLevel(level);
}

export function loadAllAssemblyBanks(
  options: AssemblyBankLoaderOptions = {}
): CambridgeItemBankItem[] {
  const levels: CambridgeExamLevel[] = ["starters", "movers", "flyers", "ket", "pet"];
  return levels.flatMap((level) => loadAssemblyBank(level, options));
}
