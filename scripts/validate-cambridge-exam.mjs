#!/usr/bin/env node
/**
 * Validate assembled Cambridge exams for all levels (or one level).
 *
 * Usage:
 *   npm run validate:cambridge-exam
 *   npm run validate:cambridge-exam -- starters
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
    "src/lib/cambridge-assessment/exam-assembly/cambridge-exam-assembly.validation.test.ts",
    "-t",
    "runs validate CLI",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      CAMBRIDGE_CLI: "validate",
      ...(level ? { CAMBRIDGE_LEVEL: level } : {}),
    },
  }
);

process.exit(result.status ?? 1);
