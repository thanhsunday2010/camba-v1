#!/usr/bin/env node
/**
 * Generate / inspect YLE mock test manifests (validation + summary).
 *
 * Usage:
 *   npm run generate:mock-tests
 *   npm run generate:mock-tests -- starters starters-practice-test-1
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { validateManifestForSeeding } from "./lib/validate-mock-test-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const MANIFEST_ROOT = resolve(ROOT, "data/mock-tests");

function loadManifest(levelSlug, slug) {
  const path = resolve(MANIFEST_ROOT, levelSlug, `${slug}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function discoverManifests(levelFilter) {
  const manifests = [];
  const levels = levelFilter
    ? [levelFilter]
    : readdirSync(MANIFEST_ROOT, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

  for (const level of levels) {
    const dir = join(MANIFEST_ROOT, level);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir)) {
      if (file.endsWith(".json")) {
        manifests.push({ levelSlug: level, slug: file.replace(/\.json$/, "") });
      }
    }
  }
  return manifests;
}

function summarizeManifest(manifest) {
  const byType = {};
  const byDifficulty = { easy: 0, medium: 0, hard: 0 };
  for (const q of manifest.questions) {
    byType[q.cambaQuestionType] = (byType[q.cambaQuestionType] ?? 0) + 1;
    if (q.difficulty) byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] ?? 0) + 1;
  }
  return {
    title: manifest.metadata.title,
    level: manifest.metadata.levelSlug,
    questions: manifest.questions.length,
    sections: manifest.sections.length,
    totalScore: manifest.metadata.totalScore,
    minutes: manifest.metadata.timeLimitMinutes,
    byType,
    byDifficulty,
    topics: manifest.coverageAchieved?.distinctTopics ?? [],
    mockTestId: manifest.metadata.seedIds?.mockTestId,
  };
}

function main() {
  const [levelArg, slugArg] = process.argv.slice(2);
  const targets =
    levelArg && slugArg
      ? [{ levelSlug: levelArg, slug: slugArg }]
      : discoverManifests(levelArg);

  if (targets.length === 0) {
    console.error("No manifests under data/mock-tests/");
    process.exit(1);
  }

  let failed = 0;

  for (const { levelSlug, slug } of targets) {
    const manifest = loadManifest(levelSlug, slug);
    const validation = validateManifestForSeeding(manifest);
    const summary = summarizeManifest(manifest);

    console.log(`\n── ${levelSlug}/${slug} ──`);
    console.log(`Title: ${summary.title}`);
    console.log(`Questions: ${summary.questions} | Sections: ${summary.sections} | Score: ${summary.totalScore} | ${summary.minutes} min`);
    console.log(`Types: ${JSON.stringify(summary.byType)}`);
    console.log(`Difficulty: ${JSON.stringify(summary.byDifficulty)}`);
    if (summary.mockTestId) console.log(`Seed ID: ${summary.mockTestId}`);
    console.log(`Topics: ${summary.topics.join(", ")}`);

    if (validation.valid) {
      console.log("Status: ✓ valid for seeding");
    } else {
      failed += 1;
      console.log("Status: ✗ invalid");
      for (const issue of validation.issues.filter((i) => i.severity === "error")) {
        console.log(`  - ${issue.path}: ${issue.message}`);
      }
    }
  }

  if (failed > 0) process.exit(1);
  console.log(`\n${targets.length} manifest(s) ready. Run: npm run seed:mock-tests -- <level> <slug>`);
}

main();
