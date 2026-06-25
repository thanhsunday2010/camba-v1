/**
 * Google OAuth on login/register. Set NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true to show.
 */
export function isGoogleAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
}
