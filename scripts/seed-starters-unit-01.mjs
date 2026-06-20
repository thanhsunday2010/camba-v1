#!/usr/bin/env node
/**
 * Seed Starters Unit 1: Family and Friends
 * Thin wrapper — delegates to generic seed:unit pipeline.
 *
 * Usage: npm run seed:starters-unit-01
 */

import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

process.argv = [
  process.argv[0],
  process.argv[1],
  "starters",
  "1",
  "--unlock-test-student",
];

await import(pathToFileURL(resolve(__dirname, "seed-unit.mjs")).href);
