/**
 * M4.1 — Gold Mock Registry (15 canonical exams).
 */

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { GoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-format";
import type { MockCertificationLevel } from "@/lib/cambridge-assessment/certification/mock-certification-types";
import { STARTERS_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/starters-gold-mock-1";
import { MOVERS_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/movers-gold-mock-1";
import { FLYERS_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/flyers-gold-mock-1";
import { KET_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/ket-gold-mock-1";
import { PET_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/pet-gold-mock-1";

export type GoldMockPublicationStatus = "draft" | "review" | "published";
export type GoldMockCertificationStatus = MockCertificationLevel | "pending";

export type GoldMockRegistryEntry = {
  goldMockId: string;
  level: CambridgeExamLevel;
  version: 1 | 2 | 3;
  status: GoldMockPublicationStatus;
  author: string;
  reviewer: string;
  certificationStatus: GoldMockCertificationStatus;
  sourceBlueprint: string;
  publicationReady: boolean;
  manifest: GoldMockManifest;
};

export const GOLD_MOCKS_PER_LEVEL = 3 as const;

const MOCK_1_BY_LEVEL: Record<CambridgeExamLevel, GoldMockManifest> = {
  starters: STARTERS_GOLD_MOCK_1,
  movers: MOVERS_GOLD_MOCK_1,
  flyers: FLYERS_GOLD_MOCK_1,
  ket: KET_GOLD_MOCK_1,
  pet: PET_GOLD_MOCK_1,
};

/** Additional manifests registered at runtime (mock 2/3). */
const additionalManifests: GoldMockManifest[] = [];

export function registerGoldMockManifest(manifest: GoldMockManifest, version: 1 | 2 | 3): void {
  const existing = additionalManifests.findIndex(
    (m) => m.gold.goldMockId === manifest.gold.goldMockId
  );
  if (existing >= 0) additionalManifests[existing] = manifest;
  else additionalManifests.push(manifest);
  _entriesCache = null;
}

function makeEntry(manifest: GoldMockManifest, version: 1 | 2 | 3): GoldMockRegistryEntry {
  return {
    goldMockId: manifest.gold.goldMockId,
    level: manifest.specification.level,
    version,
    status: manifest.gold.status,
    author: "Camba Academic Team",
    reviewer: "Camba QA Lead",
    certificationStatus: "pending",
    sourceBlueprint: manifest.metadata.blueprintId,
    publicationReady: manifest.metadata.status === "published",
    manifest,
  };
}

let _entriesCache: GoldMockRegistryEntry[] | null = null;

export function getAllGoldMockRegistryEntries(): GoldMockRegistryEntry[] {
  if (_entriesCache) return _entriesCache;
  const entries: GoldMockRegistryEntry[] = [];
  for (const level of Object.keys(MOCK_1_BY_LEVEL) as CambridgeExamLevel[]) {
    entries.push(makeEntry(MOCK_1_BY_LEVEL[level], 1));
  }
  for (const manifest of additionalManifests) {
    const version = parseInt(manifest.gold.goldMockId.match(/-(\d)$/)?.[1] ?? "1", 10) as 1 | 2 | 3;
    entries.push(makeEntry(manifest, version));
  }
  _entriesCache = entries.sort((a, b) =>
    a.level === b.level ? a.version - b.version : a.level.localeCompare(b.level)
  );
  return _entriesCache;
}

export function getAllGoldMockManifests(): GoldMockManifest[] {
  return getAllGoldMockRegistryEntries().map((e) => e.manifest);
}

export function getGoldMockRegistryEntry(goldMockId: string): GoldMockRegistryEntry | null {
  return getAllGoldMockRegistryEntries().find((e) => e.goldMockId === goldMockId) ?? null;
}

export function getGoldMocksForLevel(level: CambridgeExamLevel): GoldMockRegistryEntry[] {
  return getAllGoldMockRegistryEntries().filter((e) => e.level === level);
}

export function getGoldMockByLevelAndVersion(
  level: CambridgeExamLevel,
  version: 1 | 2 | 3 = 1
): GoldMockManifest {
  const found = getAllGoldMockRegistryEntries().find(
    (e) => e.level === level && e.version === version
  );
  if (!found) throw new Error(`No gold mock for ${level} version ${version}`);
  return found.manifest;
}

export function listGoldMockIds(level?: CambridgeExamLevel): string[] {
  const entries = level ? getGoldMocksForLevel(level) : getAllGoldMockRegistryEntries();
  return entries.map((e) => e.goldMockId);
}

export function updateRegistryCertification(
  goldMockId: string,
  certificationStatus: GoldMockCertificationStatus,
  publicationReady: boolean
): void {
  const entry = getGoldMockRegistryEntry(goldMockId);
  if (entry) {
    entry.certificationStatus = certificationStatus;
    entry.publicationReady = publicationReady;
  }
}

function contentFingerprint(q: GoldMockManifest["questions"][number]): string {
  const content = q.content ?? {};
  const parts = [q.questionText.trim().toLowerCase()];
  if (Array.isArray(q.choices)) {
    parts.push(q.choices.map((c) => c.text).sort().join("|"));
  }
  if (Array.isArray(q.pairs)) {
    parts.push(q.pairs.map((p) => `${p.leftText}:${p.rightText}`).join("|"));
  }
  if (typeof content.template === "string") parts.push(content.template);
  if (typeof content.prompt === "string") parts.push(content.prompt);
  if (Array.isArray(content.correctAnswers)) {
    parts.push((content.correctAnswers as string[]).join("|"));
  }
  if (typeof content.passage === "string") parts.push(content.passage.slice(0, 120));
  return parts.join("::");
}

/** Detect duplicate question content across mocks at the same level. */
export function detectCrossMockStemDuplicates(level: CambridgeExamLevel): Array<{
  stem: string;
  mockA: string;
  mockB: string;
  refA: string;
  refB: string;
}> {
  const mocks = getGoldMocksForLevel(level);
  const dupes: Array<{ stem: string; mockA: string; mockB: string; refA: string; refB: string }> = [];

  for (let i = 0; i < mocks.length; i += 1) {
    for (let j = i + 1; j < mocks.length; j += 1) {
      const a = mocks[i]!;
      const b = mocks[j]!;
      const fpA = new Map(
        a.manifest.questions.map((q) => [contentFingerprint(q), q.questionRef])
      );
      for (const q of b.manifest.questions) {
        const fp = contentFingerprint(q);
        if (fp.length > 20 && fpA.has(fp)) {
          dupes.push({
            stem: q.questionText.slice(0, 60),
            mockA: a.goldMockId,
            mockB: b.goldMockId,
            refA: fpA.get(fp)!,
            refB: q.questionRef,
          });
        }
      }
    }
  }
  return dupes;
}

/** Expected total when M4.1 is complete. */
export const EXPECTED_GOLD_MOCK_COUNT = 15;

export function getGoldMockInventoryStatus(): {
  registered: number;
  expected: number;
  complete: boolean;
  byLevel: Record<CambridgeExamLevel, number>;
} {
  const byLevel = {} as Record<CambridgeExamLevel, number>;
  for (const level of Object.keys(MOCK_1_BY_LEVEL) as CambridgeExamLevel[]) {
    byLevel[level] = getGoldMocksForLevel(level).length;
  }
  const registered = getAllGoldMockRegistryEntries().length;
  return {
    registered,
    expected: EXPECTED_GOLD_MOCK_COUNT,
    complete: registered >= EXPECTED_GOLD_MOCK_COUNT,
    byLevel,
  };
}
