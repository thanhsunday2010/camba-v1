import type { AbstractIntlMessages } from "next-intl";

export type FlatMessageEntry = {
  key: string;
  value: string;
};

export function flattenMessages(
  messages: AbstractIntlMessages,
  prefix = ""
): FlatMessageEntry[] {
  const entries: FlatMessageEntry[] = [];

  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      entries.push({ key: path, value });
      continue;
    }
    if (value && typeof value === "object" && !Array.isArray(value)) {
      entries.push(...flattenMessages(value as AbstractIntlMessages, path));
    }
  }

  return entries;
}

export function getNestedMessage(
  messages: AbstractIntlMessages,
  messageKey: string
): string | null {
  const parts = messageKey.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return null;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : null;
}

export function setNestedMessage(
  messages: AbstractIntlMessages,
  messageKey: string,
  value: string
): AbstractIntlMessages {
  const parts = messageKey.split(".");
  const clone = structuredClone(messages) as Record<string, unknown>;
  let current = clone;

  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i]!;
    const next = current[part];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]!] = value;
  return clone as AbstractIntlMessages;
}

export function mergeSiteTextOverrides(
  messages: AbstractIntlMessages,
  overrides: Record<string, string>
): AbstractIntlMessages {
  let merged = messages;
  for (const [key, value] of Object.entries(overrides)) {
    merged = setNestedMessage(merged, key, value);
  }
  return merged;
}

export function normalizeCopyText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export function findMessageKeysByText(
  messages: AbstractIntlMessages,
  text: string
): FlatMessageEntry[] {
  const normalized = normalizeCopyText(text);
  if (!normalized) return [];

  return flattenMessages(messages).filter(
    (entry) => normalizeCopyText(entry.value) === normalized
  );
}

export function searchMessageKeys(
  messages: AbstractIntlMessages,
  query: string,
  limit = 40
): FlatMessageEntry[] {
  const normalized = normalizeCopyText(query).toLowerCase();
  if (!normalized) return [];

  return flattenMessages(messages)
    .filter(
      (entry) =>
        entry.key.toLowerCase().includes(normalized) ||
        entry.value.toLowerCase().includes(normalized)
    )
    .slice(0, limit);
}
