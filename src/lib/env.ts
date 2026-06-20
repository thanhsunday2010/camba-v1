import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

const serverEnvSchema = publicEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  GOOGLE_GEMINI_API_KEY: z.string().min(1).optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

const BUILD_DEFAULTS: PublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: "https://placeholder.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "placeholder-anon-key",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
};

const PLACEHOLDER_MARKERS = [
  "your-project",
  "your-anon-key",
  "your-service-role-key",
  "your-gemini-api-key",
];

let cachedServerEnv: ServerEnv | null = null;
let cachedPublicEnv: PublicEnv | null = null;

function formatEnvErrors(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

function isPlaceholder(value: string | undefined): boolean {
  if (!value?.trim()) return true;
  return PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function resolveAppUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configured && !isPlaceholder(configured)) {
    return configured;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (configured) {
    return configured;
  }

  return undefined;
}

function getPublicEnvCandidate() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: resolveAppUrl(),
  };
}

function shouldUseBuildDefaults(candidate: ReturnType<typeof getPublicEnvCandidate>): boolean {
  if (!isBuildPhase()) return false;

  return (
    isPlaceholder(candidate.NEXT_PUBLIC_SUPABASE_URL) ||
    isPlaceholder(candidate.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
    !candidate.NEXT_PUBLIC_APP_URL
  );
}

function isRealPublicEnv(env: PublicEnv): boolean {
  return (
    !isPlaceholder(env.NEXT_PUBLIC_SUPABASE_URL) &&
    !isPlaceholder(env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    !isPlaceholder(env.NEXT_PUBLIC_APP_URL)
  );
}

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;

  const candidate = getPublicEnvCandidate();
  let parsed = publicEnvSchema.safeParse(candidate);

  if (!parsed.success && shouldUseBuildDefaults(candidate)) {
    parsed = publicEnvSchema.safeParse({
      ...BUILD_DEFAULTS,
      NEXT_PUBLIC_APP_URL: resolveAppUrl() ?? BUILD_DEFAULTS.NEXT_PUBLIC_APP_URL,
    });
  }

  if (!parsed.success) {
    throw new Error(`Invalid public environment: ${formatEnvErrors(parsed.error)}`);
  }

  if (isRealPublicEnv(parsed.data)) {
    cachedPublicEnv = parsed.data;
  }

  return parsed.data;
}

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(`Invalid server environment: ${formatEnvErrors(parsed.error)}`);
  }

  cachedServerEnv = parsed.data;
  return parsed.data;
}

export function getAppUrl(): string {
  return getPublicEnv().NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}
