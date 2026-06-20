#!/usr/bin/env node
/**
 * Deactivate Cambridge placement test until full Cambridge content is ready.
 *
 * Usage: npm run deactivate:cambridge-placement
 */

import { createClient } from "@supabase/supabase-js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const PLACEMENT_TEST_ID = "a0000000-0000-4010-8000-000000000001";

async function main() {
  const { url, key } = createSupabaseFromEnv(rootDir);
  const supabase = createClient(url, key);

  const { error } = await supabase
    .from("placement_tests")
    .update({ is_active: false })
    .eq("id", PLACEMENT_TEST_ID);

  if (error) throw new Error(error.message);

  console.log("✓ Cambridge placement test deactivated");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
