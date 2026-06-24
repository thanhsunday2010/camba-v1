/**
 * M4.1 — Register all Gold Mock manifests into the central registry.
 */

import { registerGoldMockManifest } from "@/lib/cambridge-assessment/gold-mock-registry";
import { STARTERS_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/starters-gold-mock-2";
import { STARTERS_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/starters-gold-mock-3";
import { MOVERS_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/movers-gold-mock-2";
import { MOVERS_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/movers-gold-mock-3";
import { FLYERS_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/flyers-gold-mock-2";
import { FLYERS_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/flyers-gold-mock-3";
import { KET_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/ket-gold-mock-2";
import { KET_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/ket-gold-mock-3";
import { PET_GOLD_MOCK_2 } from "@/lib/cambridge-assessment/gold-mocks/manifests/pet-gold-mock-2";
import { PET_GOLD_MOCK_3 } from "@/lib/cambridge-assessment/gold-mocks/manifests/pet-gold-mock-3";

/** Register all mock 2/3 manifests at build/runtime. */
export function registerAvailableGoldMocks(): void {
  registerGoldMockManifest(STARTERS_GOLD_MOCK_2, 2);
  registerGoldMockManifest(STARTERS_GOLD_MOCK_3, 3);
  registerGoldMockManifest(MOVERS_GOLD_MOCK_2, 2);
  registerGoldMockManifest(MOVERS_GOLD_MOCK_3, 3);
  registerGoldMockManifest(FLYERS_GOLD_MOCK_2, 2);
  registerGoldMockManifest(FLYERS_GOLD_MOCK_3, 3);
  registerGoldMockManifest(KET_GOLD_MOCK_2, 2);
  registerGoldMockManifest(KET_GOLD_MOCK_3, 3);
  registerGoldMockManifest(PET_GOLD_MOCK_2, 2);
  registerGoldMockManifest(PET_GOLD_MOCK_3, 3);
}
