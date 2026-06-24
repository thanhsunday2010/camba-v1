import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

import type {
  ItemBankFile,
  ItemBankQuestion,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";
import {
  CAMBRIDGE_ITEM_BANK_ROOT,
  loadUnifiedItemBank,
  loadUnifiedItemBankOrBuild,
} from "@/lib/item-bank/item-bank-builder";
import { ITEM_BANK_LEVELS } from "@/lib/item-bank/item-bank-validation";

const LEGACY_BANK_ROOT = resolve(process.cwd(), "data/item-bank");

export type ItemBankRegistryOptions = {
  rootDir?: string;
  /** Prefer cambridge unified bank (gold + expansion). */
  preferCambridgeBank?: boolean;
};

function bankFilePath(root: string, level: ItemLevel): string {
  return join(root, level, "items.json");
}

function readBankFile(root: string, level: ItemLevel): ItemBankFile | null {
  const path = bankFilePath(root, level);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as ItemBankFile;
}

/** Load all item banks — prefers cambridge-item-banks when present. */
export function loadItemBank(options: ItemBankRegistryOptions = {}): ItemBankQuestion[] {
  const preferCambridge = options.preferCambridgeBank !== false;
  const root = options.rootDir ?? (preferCambridge ? CAMBRIDGE_ITEM_BANK_ROOT : LEGACY_BANK_ROOT);
  const all: ItemBankQuestion[] = [];

  for (const level of ITEM_BANK_LEVELS) {
    const bank = readBankFile(root, level);
    if (bank?.items?.length) {
      all.push(...bank.items);
      continue;
    }
    if (preferCambridge) {
      all.push(...loadUnifiedItemBankOrBuild(level).items);
    }
  }

  return all;
}

export function loadItemBankFile(
  level: ItemLevel,
  options: ItemBankRegistryOptions = {}
): ItemBankFile | null {
  const preferCambridge = options.preferCambridgeBank !== false;
  const root = options.rootDir ?? (preferCambridge ? CAMBRIDGE_ITEM_BANK_ROOT : LEGACY_BANK_ROOT);
  const file = readBankFile(root, level);
  if (file?.items?.length) return file;
  if (preferCambridge) return loadUnifiedItemBank(level) ?? loadUnifiedItemBankOrBuild(level);
  return null;
}

export function getItemsByLevel(
  level: ItemLevel,
  options: ItemBankRegistryOptions = {}
): ItemBankQuestion[] {
  return loadItemBankFile(level, options)?.items ?? [];
}

export function getItemsBySkill(
  level: ItemLevel,
  skill: ItemBankQuestion["skill"],
  options: ItemBankRegistryOptions = {}
): ItemBankQuestion[] {
  return getItemsByLevel(level, options).filter((item) => item.skill === skill);
}

export function getItemsByGrammarTag(
  level: ItemLevel,
  grammarTag: string,
  options: ItemBankRegistryOptions = {}
): ItemBankQuestion[] {
  return getItemsByLevel(level, options).filter((item) =>
    item.grammarTags.includes(grammarTag)
  );
}

export function getItemsByVocabularyTopic(
  level: ItemLevel,
  vocabularyTopic: string,
  options: ItemBankRegistryOptions = {}
): ItemBankQuestion[] {
  return getItemsByLevel(level, options).filter((item) =>
    item.vocabularyTopics.includes(vocabularyTopic)
  );
}

export function listAvailableItemBankLevels(
  options: ItemBankRegistryOptions = {}
): ItemLevel[] {
  const root = options.rootDir ?? CAMBRIDGE_ITEM_BANK_ROOT;
  if (!existsSync(root)) return ITEM_BANK_LEVELS;

  const fromDisk = readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name): name is ItemLevel => (ITEM_BANK_LEVELS as string[]).includes(name));

  return fromDisk.length ? fromDisk : ITEM_BANK_LEVELS;
}

export { CAMBRIDGE_ITEM_BANK_ROOT, LEGACY_BANK_ROOT };
