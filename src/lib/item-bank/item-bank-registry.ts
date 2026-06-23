import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type {
  ItemBankFile,
  ItemBankQuestion,
  ItemLevel,
} from "@/lib/item-bank/item-bank-types";
import { ITEM_BANK_LEVELS } from "@/lib/item-bank/item-bank-validation";

const DEFAULT_BANK_ROOT = resolve(process.cwd(), "data/item-bank");

function bankFilePath(root: string, level: ItemLevel): string {
  return join(root, level, "items.json");
}

function readBankFile(root: string, level: ItemLevel): ItemBankFile | null {
  const path = bankFilePath(root, level);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as ItemBankFile;
}

export type ItemBankRegistryOptions = {
  rootDir?: string;
};

/** Load all item banks from the filesystem (no DB). */
export function loadItemBank(options: ItemBankRegistryOptions = {}): ItemBankQuestion[] {
  const root = options.rootDir ?? DEFAULT_BANK_ROOT;
  const all: ItemBankQuestion[] = [];

  for (const level of ITEM_BANK_LEVELS) {
    const bank = readBankFile(root, level);
    if (bank?.items?.length) all.push(...bank.items);
  }

  return all;
}

export function loadItemBankFile(
  level: ItemLevel,
  options: ItemBankRegistryOptions = {}
): ItemBankFile | null {
  const root = options.rootDir ?? DEFAULT_BANK_ROOT;
  return readBankFile(root, level);
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
  const root = options.rootDir ?? DEFAULT_BANK_ROOT;
  if (!existsSync(root)) return [];

  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name): name is ItemLevel =>
      (ITEM_BANK_LEVELS as string[]).includes(name)
    );
}
