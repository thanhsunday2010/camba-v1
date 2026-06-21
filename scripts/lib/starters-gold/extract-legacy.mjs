#!/usr/bin/env node
/** Extract legacy 6-lesson Starters JSON from git commit 2a85328 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "legacy-snapshots");
mkdirSync(OUT, { recursive: true });

const files = execSync('git ls-tree --name-only 2a85328 data/content/starters/', {
  cwd: resolve(__dirname, "../../.."),
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter((f) => /unit-\d{2}-/.test(f));

for (const file of files) {
  const unitNum = file.match(/unit-(\d{2})-/)[1];
  const json = execSync(`git show 2a85328:${file}`, {
    cwd: resolve(__dirname, "../../.."),
    encoding: "utf8",
  });
  writeFileSync(resolve(OUT, `unit-${unitNum}-legacy.json`), json);
  console.log(`✓ unit-${unitNum}-legacy.json`);
}
