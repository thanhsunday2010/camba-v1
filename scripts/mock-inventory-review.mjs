#!/usr/bin/env node
/**
 * M3.4 — Mock inventory review before publishing.
 *
 * Usage:
 *   npm run review:mock-inventory
 *   npm run review:mock-inventory -- starters
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
    "runs inventory review",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CERTIFY_CLI: "inventory",
      CERTIFY_LEVEL: level ?? "starters",
    },
  }
);

process.exit(result.status ?? 1);
