#!/usr/bin/env node
/**
 * M4.1 — Generate Gold Mock coverage report.
 *
 * Usage:
 *   npm run report:gold-mock-coverage
 */

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const result = spawnSync(
  "npx",
  [
    "vitest",
    "run",
    "src/lib/cambridge-assessment/gold-mock.validation.test.ts",
    "-t",
    "writes coverage report",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      COVERAGE_CLI: "report",
    },
  }
);

process.exit(result.status ?? 1);
