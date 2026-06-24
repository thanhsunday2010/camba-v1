#!/usr/bin/env node
/**
 * Analyze coverage and difficulty for an assembled Cambridge exam.
 *
 * Usage:
 *   npm run analyze:cambridge-exam -- starters A
 *   npm run analyze:cambridge-exam -- pet
 */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const [level = "starters", version = "A"] = process.argv.slice(2);

const result = spawnSync(
  "npx",
  [
    "vitest",
    "run",
    "src/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly.validation.test.ts",
    "-t",
    "runs analyze CLI",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CAMBRIDGE_CLI: "analyze",
      CAMBRIDGE_LEVEL: level,
      CAMBRIDGE_VERSION: version,
    },
  }
);

process.exit(result.status ?? 1);
