import { createClient } from "@supabase/supabase-js";
import pg from "pg";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createSupabaseFromEnv, loadEnvFile } from "./lib/env.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
loadEnvFile(resolve(ROOT, ".env.local"), { overwrite: true });
const { url, key } = createSupabaseFromEnv(ROOT);
const supabase = createClient(url, key, { auth: { persistSession: false } });

const BUCKETS = [
  {
    id: "speaking-audio",
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"],
  },
];

const STORAGE_POLICIES_SQL = `
UPDATE storage.buckets
SET public = false,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg']
WHERE id = 'speaking-audio';

DROP POLICY IF EXISTS "Public read speaking audio" ON storage.objects;

DROP POLICY IF EXISTS "Users can upload own speaking audio" ON storage.objects;
CREATE POLICY "Users can upload own speaking audio"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'speaking-audio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can read own speaking audio" ON storage.objects;
CREATE POLICY "Users can read own speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Teachers can read student speaking audio" ON storage.objects;
CREATE POLICY "Teachers can read student speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id::text = (storage.foldername(name))[1]
      AND public.is_teacher_of(p.id)
    )
  );

DROP POLICY IF EXISTS "Parents can read linked student speaking audio" ON storage.objects;
CREATE POLICY "Parents can read linked student speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id::text = (storage.foldername(name))[1]
      AND public.is_parent_of(p.id)
    )
  );

DROP POLICY IF EXISTS "Admins can read speaking audio" ON storage.objects;
CREATE POLICY "Admins can read speaking audio"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'speaking-audio'
    AND public.is_admin()
  );
`;

async function ensureStoragePolicies() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) {
    console.warn("DATABASE_URL not set — skipping storage RLS policy sync.");
    return;
  }

  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(STORAGE_POLICIES_SQL);
    console.log("Speaking storage RLS policies synced.");
  } finally {
    await client.end();
  }
}

const { data: existing, error: listError } = await supabase.storage.listBuckets();
if (listError) {
  console.error("Failed to list buckets:", listError.message);
  process.exit(1);
}

const existingIds = new Set((existing ?? []).map((bucket) => bucket.id));

for (const bucket of BUCKETS) {
  if (existingIds.has(bucket.id)) {
    console.log(`Bucket "${bucket.id}" already exists`);
    continue;
  }

  const { error } = await supabase.storage.createBucket(bucket.id, {
    public: bucket.public,
    fileSizeLimit: bucket.fileSizeLimit,
    allowedMimeTypes: bucket.allowedMimeTypes,
  });

  if (error) {
    console.error(`Failed to create bucket "${bucket.id}":`, error.message);
    process.exit(1);
  }

  console.log(`Created bucket "${bucket.id}"`);
}

await ensureStoragePolicies();
console.log("Storage buckets ready.");
