#!/usr/bin/env node
/**
 * M3.2 — Item bank gap analysis CLI.
 *
 * Usage:
 *   npm run analyze:item-bank-gaps
 *   npm run analyze:item-bank-gaps -- starters
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
    "src/lib/item-bank/item-bank.validation.test.ts",
    "-t",
    "runs gap analysis CLI",
  ],
  {
    cwd: ROOT,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      ITEM_BANK_CLI: "gaps",
      ...(level ? { ITEM_BANK_LEVEL: level } : {}),
    },
  }
);

process.exit(result.status ?? 1);
