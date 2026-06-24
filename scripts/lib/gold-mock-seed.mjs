/**
 * Prepare Gold Mock JSON manifests for Supabase seeding.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildManifestSeedIds } from "./mock-test-ids.mjs";
import { validateManifestForSeeding } from "./validate-mock-test-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const GOLD_MOCK_ROOT = resolve(__dirname, "../../data/cambridge-gold-mocks");

const LEVEL_ORDER = ["starters", "movers", "flyers", "ket", "pet"];

export function parseGoldMockVersion(goldMockId) {
  const match = goldMockId?.match(/-(\d)$/);
  const version = match ? Number.parseInt(match[1], 10) : 1;
  if (!Number.isFinite(version) || version < 1) {
    throw new Error(`Invalid gold mock version in id: ${goldMockId}`);
  }
  return version;
}

export function discoverGoldMockManifests(levelFilter) {
  if (!existsSync(GOLD_MOCK_ROOT)) {
    throw new Error(`Gold mock directory not found: ${GOLD_MOCK_ROOT}`);
  }

  const manifests = [];
  for (const level of LEVEL_ORDER) {
    if (levelFilter && level !== levelFilter) continue;
    const dir = join(GOLD_MOCK_ROOT, level);
    if (!existsSync(dir)) continue;

    for (const file of readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
      const path = join(dir, file);
      const raw = JSON.parse(readFileSync(path, "utf8"));
      manifests.push({
        level,
        file,
        path,
        raw,
        goldMockId: raw.gold?.goldMockId ?? raw.metadata?.manifestId ?? file.replace(/\.json$/, ""),
      });
    }
  }

  return manifests;
}

export function prepareGoldMockForSeeding(goldManifest) {
  const levelSlug = goldManifest.metadata?.levelSlug;
  if (!levelSlug) {
    throw new Error("Gold manifest missing metadata.levelSlug");
  }

  const goldMockId =
    goldManifest.gold?.goldMockId ?? goldManifest.metadata.manifestId ?? "unknown-gold-mock";
  const testNumber = parseGoldMockVersion(goldMockId);
  const sectionSlugs = (goldManifest.sections ?? []).map((s) => s.sectionSlug);
  const questionRefs = (goldManifest.sections ?? []).flatMap((s) => s.questionRefs ?? []);

  if (sectionSlugs.length === 0) {
    throw new Error(`${goldMockId}: no sections`);
  }
  if (questionRefs.length === 0) {
    throw new Error(`${goldMockId}: no questions in sections`);
  }

  const seedIds = buildManifestSeedIds(levelSlug, testNumber, sectionSlugs, questionRefs);

  return {
    metadata: {
      ...goldManifest.metadata,
      stableSlug: goldManifest.metadata.stableSlug ?? goldMockId,
      seedIds,
    },
    sections: goldManifest.sections,
    questions: goldManifest.questions,
    parts: goldManifest.parts ?? [],
    gold: goldManifest.gold ?? { tier: "gold", goldMockId },
  };
}

export function validateGoldMockForSeeding(goldManifest) {
  const runtime = prepareGoldMockForSeeding(goldManifest);
  return validateManifestForSeeding(runtime);
}
