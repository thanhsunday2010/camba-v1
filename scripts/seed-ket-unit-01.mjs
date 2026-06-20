#!/usr/bin/env node
/**
 * Seed KET Unit 1: Education and Study
 *
 * Usage: npm run seed:ket-unit-01
 */

import { pathToFileURL } from "node:url";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

process.argv = [
  process.argv[0],
  process.argv[1],
  "ket",
  "1",
  "--unlock-test-student",
];

await import(pathToFileURL(resolve(__dirname, "seed-unit.mjs")).href);
