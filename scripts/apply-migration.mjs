#!/usr/bin/env node
/**
 * Apply a SQL migration file using DATABASE_URL (direct Postgres).
 *
 * Usage:
 *   DATABASE_URL=postgresql://... node scripts/apply-migration.mjs supabase/migrations/011_mock_test_question_rls.sql
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { loadEnvFile } from "./lib/env.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

async function main() {
  loadEnvFile(resolve(ROOT, ".env.local"));

  const sqlPath = process.argv[2];
  if (!sqlPath) {
    console.error("Usage: node scripts/apply-migration.mjs <path-to.sql>");
    process.exit(1);
  }

  const absPath = resolve(ROOT, sqlPath);
  if (!existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.error(
      "Thiếu DATABASE_URL trong .env.local.\n" +
        "Lấy từ Supabase Dashboard → Project Settings → Database → Connection string (URI).\n" +
        "Thêm: DATABASE_URL=postgresql://postgres.[ref]:[password]@..."
    );
    process.exit(1);
  }

  const sql = readFileSync(absPath, "utf8");
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log(`Applying ${sqlPath}…`);
    await client.query(sql);
    console.log("✓ Migration applied.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
