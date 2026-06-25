import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnvFile(filePath, options = {}) {
  const { overwrite = false } = options;
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const sep = trimmed.indexOf("=");
    if (sep === -1) continue;
    const key = trimmed.slice(0, sep).trim();
    const value = trimmed.slice(sep + 1).trim();
    if (overwrite || process.env[key] == null || process.env[key] === "") {
      process.env[key] = value;
    }
  }
}

export function createSupabaseFromEnv(rootDir, options = {}) {
  const envKey = options.env ?? process.env.SEED_ENV ?? "local";
  const envFiles = {
    local: ".env.local",
    staging: ".env.staging.local",
    production: ".env.production.local",
  };
  const envFile = envFiles[envKey] ?? envKey;
  loadEnvFile(resolve(rootDir, envFile));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      `Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong ${envFile}`
    );
  }

  return { url, key };
}
