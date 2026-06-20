const DEFAULT_REDIRECT = "/dashboard";

export function sanitizeRedirectPath(next: string | null | undefined): string | null {
  if (!next) return null;

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return null;
  }

  return trimmed;
}

export function resolvePostAuthRedirect(
  next: string | null | undefined,
  roleBasedPath: string
): string {
  return sanitizeRedirectPath(next) ?? roleBasedPath ?? DEFAULT_REDIRECT;
}
