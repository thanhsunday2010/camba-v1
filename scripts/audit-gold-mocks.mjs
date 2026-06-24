#!/usr/bin/env node
/**
 * Audit 15 Gold Mocks: assets, JSON sync, certification blockers.
 */

import { existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { discoverGoldMockManifests, prepareGoldMockForSeeding } from "./lib/gold-mock-seed.mjs";
import {
  collectImageAssetsFromManifest,
  normalizeGoldMockImageSrc,
  goldMockImageOutputPath,
} from "./lib/gold-mock-image-paths.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = join(ROOT, "public");

function publicPath(url) {
  return join(PUBLIC, url.replace(/^\//, ""));
}

function auditAssets(manifests) {
  const issues = [];
  let totalAudio = 0;
  let totalImages = 0;

  for (const { goldMockId, raw } of manifests) {
    const prepared = prepareGoldMockForSeeding(raw);

    for (const part of prepared.parts ?? []) {
      if (part.sectionSlug !== "listening" || !part.audio?.src) continue;
      totalAudio += 1;
      const path = publicPath(part.audio.src);
      if (!existsSync(path)) {
        issues.push({
          severity: "error",
          mock: goldMockId,
          kind: "missing-audio",
          path: part.audio.src,
        });
      }
    }

    const assets = collectImageAssetsFromManifest(prepared);
    for (const [src] of assets) {
      totalImages += 1;
      const normalized = normalizeGoldMockImageSrc(src);
      const path = publicPath(goldMockImageOutputPath(normalized));
      if (!existsSync(path)) {
        issues.push({
          severity: "error",
          mock: goldMockId,
          kind: "missing-image",
          path: normalized,
          rawPath: src !== normalized ? src : undefined,
        });
      }
      if (src.endsWith(".png")) {
        issues.push({
          severity: "warning",
          mock: goldMockId,
          kind: "png-path-in-json",
          path: src,
        });
      }
    }
  }

  return { issues, totalAudio, totalImages };
}

function auditJsonSync(manifests) {
  const issues = [];
  const duplicateTopLevelKeys = [
    "cambridgeTaskType",
    "prompt",
    "imageUrl",
    "pictureSequence",
    "passage",
    "template",
  ];

  for (const { goldMockId, raw } of manifests) {
    for (const q of raw.questions ?? []) {
      for (const key of duplicateTopLevelKeys) {
        if (key in q && q.content && key in q.content) {
          issues.push({
            severity: "warning",
            mock: goldMockId,
            kind: "duplicate-top-level-field",
            ref: q.questionRef,
            path: key,
          });
        }
      }
      const content = q.content ?? {};
      if (typeof content.imageUrl === "string" && content.imageUrl.endsWith(".png")) {
        issues.push({
          severity: "warning",
          mock: goldMockId,
          kind: "json-png-imageUrl",
          ref: q.questionRef,
          path: content.imageUrl,
        });
      }
    }
  }
  return issues;
}

function main() {
  const manifests = discoverGoldMockManifests();
  const assetAudit = auditAssets(manifests);
  const syncIssues = auditJsonSync(manifests);
  const allIssues = [...assetAudit.issues, ...syncIssues];

  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");

  console.log(`Gold Mock Audit — ${manifests.length} manifests\n`);
  console.log(`Audio refs (post-seed normalize): ${assetAudit.totalAudio}`);
  console.log(`Image refs: ${assetAudit.totalImages}`);
  console.log(`Errors: ${errors.length} | Warnings: ${warnings.length}\n`);

  if (errors.length) {
    console.log("=== ERRORS ===");
    for (const issue of errors) {
      console.log(`[${issue.mock}] ${issue.kind}: ${issue.path}${issue.rawPath ? ` (json: ${issue.rawPath})` : ""}`);
    }
    console.log("");
  }

  if (warnings.length) {
    console.log("=== WARNINGS (first 30) ===");
    for (const issue of warnings.slice(0, 30)) {
      console.log(`[${issue.mock}] ${issue.kind}: ${issue.path ?? issue.ref ?? ""}`);
    }
    if (warnings.length > 30) console.log(`... and ${warnings.length - 30} more`);
    console.log("");
  }

  if (!errors.length && !warnings.length) {
    console.log("All checks passed.");
  } else if (!errors.length) {
    console.log("No blocking errors. Warnings are JSON/asset hygiene — run GOLD_WRITE=1 npm run test:validation to sync JSON.");
  }

  process.exit(errors.length ? 1 : 0);
}

main();
