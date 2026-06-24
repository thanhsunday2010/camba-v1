export { STARTERS_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/starters-gold-mock-1";
export { MOVERS_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/movers-gold-mock-1";
export { FLYERS_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/flyers-gold-mock-1";
export { KET_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/ket-gold-mock-1";
export { KET_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/ket-gold-mock-2";
export { KET_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/ket-gold-mock-3";
export { PET_GOLD_MOCK_1 } from "@/lib/cambridge-assessment/gold-mocks/manifests/pet-gold-mock-1";
export { PET_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/pet-gold-mock-2";
export { PET_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/pet-gold-mock-3";

import type { CambridgeExamLevel } from "@/lib/cambridge-assessment/cambridge-assessment-types";
import type { GoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-format";
import {
  getAllGoldMockManifests,
  getAllGoldMockRegistryEntries,
  getGoldMockByLevelAndVersion,
  getGoldMocksForLevel,
  listGoldMockIds,
} from "@/lib/cambridge-assessment/gold-mock-registry";

/** @deprecated Use getGoldMockByLevelAndVersion(level, version) */
export function getGoldMock(level: CambridgeExamLevel, version: 1 | 2 | 3 = 1): GoldMockManifest {
  return getGoldMockByLevelAndVersion(level, version);
}

export const GOLD_MOCK_REGISTRY: Record<CambridgeExamLevel, GoldMockManifest> = {
  starters: getGoldMockByLevelAndVersion("starters", 1),
  movers: getGoldMockByLevelAndVersion("movers", 1),
  flyers: getGoldMockByLevelAndVersion("flyers", 1),
  ket: getGoldMockByLevelAndVersion("ket", 1),
  pet: getGoldMockByLevelAndVersion("pet", 1),
};

export function getAllGoldMocks(): GoldMockManifest[] {
  return getAllGoldMockManifests();
}

export const ALL_GOLD_MOCKS: GoldMockManifest[] = getAllGoldMockManifests();

export {
  getAllGoldMockRegistryEntries,
  getGoldMocksForLevel,
  listGoldMockIds,
  registerGoldMockManifest,
} from "@/lib/cambridge-assessment/gold-mock-registry";
