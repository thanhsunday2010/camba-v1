#!/usr/bin/env node
/**
 * M3.4 — Batch mock certification.
 *
 * Usage:
 *   npm run certify:mocks
 *   npm run certify:mocks -- starters
 *   npm run certify:mocks -- pet
 */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const [level] = process.argv.slice(2);

const result = spawnSync(
  "npx",
  [
    "vitest",
    "run",
    "src/lib/cambridge-assessment/mock-certification.validation.test.ts",
    "-t",
    "runs batch certification",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CERTIFY_CLI: "batch",
      ...(level ? { CERTIFY_LEVEL: level } : {}),
    },
  }
);

process.exit(result.status ?? 1);
