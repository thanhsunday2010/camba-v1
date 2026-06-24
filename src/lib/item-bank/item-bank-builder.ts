import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import { getGoldMock } from "@/lib/cambridge-assessment/gold-mocks";
import { FLYERS_EXPANSION_ITEMS } from "@/lib/item-bank/expansion/flyers-expansion-batch";
import { KET_EXPANSION_ITEMS } from "@/lib/item-bank/expansion/ket-expansion-batch";
import { MOVERS_EXPANSION_ITEMS } from "@/lib/item-bank/expansion/movers-expansion-batch";
import { PET_EXPANSION_ITEMS } from "@/lib/item-bank/expansion/pet-expansion-batch";
import { STARTERS_EXPANSION_ITEMS } from "@/lib/item-bank/expansion/starters-expansion-batch";
import {
  extractItemBankFromGoldMock,
  mergeItemBanks,
} from "@/lib/item-bank/item-bank-gold-extract";
import type { ItemBankFile, ItemBankQuestion, ItemLevel } from "@/lib/item-bank/item-bank-types";

const CAMBRIDGE_BANK_ROOT = resolve(process.cwd(), "data/cambridge-item-banks");
const LEGACY_BANK_ROOT = resolve(process.cwd(), "data/item-bank");

const EXPANSION_BY_LEVEL: Record<ItemLevel, ItemBankQuestion[]> = {
  starters: STARTERS_EXPANSION_ITEMS,
  movers: MOVERS_EXPANSION_ITEMS,
  flyers: FLYERS_EXPANSION_ITEMS,
  ket: KET_EXPANSION_ITEMS,
  pet: PET_EXPANSION_ITEMS,
};

export function buildUnifiedItemBank(level: ItemLevel): ItemBankFile {
  const goldBank = extractItemBankFromGoldMock(getGoldMock(level as CambridgeExamLevel));
  const expansion = EXPANSION_BY_LEVEL[level] ?? [];
  const items = mergeItemBanks(goldBank.items, expansion);

  return {
    bankVersion: "2.0.0",
    level,
    itemCount: items.length,
    sourceManifests: [
      ...goldBank.sourceManifests,
      `${level}-expansion-batch-1`,
    ],
    extractedAt: new Date().toISOString(),
    bankTier: "cambridge-unified",
    items,
  };
}

export function writeUnifiedItemBank(level: ItemLevel, rootDir = CAMBRIDGE_BANK_ROOT): string {
  const bank = buildUnifiedItemBank(level);
  const dir = join(rootDir, level);
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "items.json");
  writeFileSync(path, JSON.stringify(bank, null, 2), "utf8");
  return path;
}

export function writeAllUnifiedItemBanks(rootDir = CAMBRIDGE_BANK_ROOT): string[] {
  const levels: ItemLevel[] = ["starters", "movers", "flyers", "ket", "pet"];
  return levels.map((level) => writeUnifiedItemBank(level, rootDir));
}

export function loadUnifiedItemBank(
  level: ItemLevel,
  rootDir = CAMBRIDGE_BANK_ROOT
): ItemBankFile | null {
  const path = join(rootDir, level, "items.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as ItemBankFile;
}

export function loadUnifiedItemBankOrBuild(level: ItemLevel): ItemBankFile {
  return loadUnifiedItemBank(level) ?? buildUnifiedItemBank(level);
}

export const LEGACY_ITEM_BANK_ROOT = LEGACY_BANK_ROOT;
export const CAMBRIDGE_ITEM_BANK_ROOT = CAMBRIDGE_BANK_ROOT;
