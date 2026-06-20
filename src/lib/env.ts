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

let cachedServerEnv: ServerEnv | null = null;
let cachedPublicEnv: PublicEnv | null = null;

function formatEnvErrors(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("; ");
}

export function getPublicEnv(): PublicEnv {
  if (cachedPublicEnv) return cachedPublicEnv;

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });

  if (!parsed.success) {
    throw new Error(`Invalid public environment: ${formatEnvErrors(parsed.error)}`);
  }

  cachedPublicEnv = parsed.data;
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
