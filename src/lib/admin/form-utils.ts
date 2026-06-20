export function parseJsonField<T>(value: FormDataEntryValue | null, fallback: T): T {
  if (!value || typeof value !== "string" || !value.trim()) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function str(formData: FormData, key: string): string {
  return ((formData.get(key) as string) ?? "").trim();
}

export function optionalStr(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v || null;
}

export function optionalInt(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
}
