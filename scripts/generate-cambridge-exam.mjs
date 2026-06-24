#!/usr/bin/env node
/**
 * Generate a Cambridge exam manifest from blueprint + item bank.
 *
 * Usage:
 *   npm run generate:cambridge-exam -- starters A
 *   npm run generate:cambridge-exam -- ket B
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
    "runs generate CLI",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CAMBRIDGE_CLI: "generate",
      CAMBRIDGE_LEVEL: level,
      CAMBRIDGE_VERSION: version,
    },
  }
);

process.exit(result.status ?? 1);
