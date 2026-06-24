#!/usr/bin/env node
/**
 * Analyze Gold Mock coverage, grammar, vocabulary, difficulty, tasks, blueprint.
 *
 * Usage:
 *   npm run analyze:gold-mock
 *   npm run analyze:gold-mock -- starters
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
    "src/lib/cambridge-assessment/gold-mock.validation.test.ts",
    "-t",
    "runs analyze CLI",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      GOLD_CLI: "analyze",
      ...(level ? { GOLD_LEVEL: level } : {}),
    },
  }
);

process.exit(result.status ?? 1);
