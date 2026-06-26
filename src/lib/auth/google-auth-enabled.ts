/**
 * Google OAuth on login/register. Enabled by default; set NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false to hide.
 */
export function isGoogleAuthEnabled(): boolean {
  const flag = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED?.trim().toLowerCase();
  if (flag === "false" || flag === "0") return false;
  return true;
}
