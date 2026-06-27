export type ContactChannelId = "zalo" | "messenger";

export type ContactChannel = {
  id: ContactChannelId;
  href: string;
};

function normalizeZaloPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.startsWith("84") && digits.length >= 11) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("0") && digits.length >= 10) {
    return digits;
  }

  return digits.length >= 9 ? digits : null;
}

function normalizeMessengerUsername(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const withoutProtocol = trimmed
    .replace(/^https?:\/\//i, "")
    .replace(/^(www\.)?facebook\.com\//i, "")
    .replace(/^m\.me\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");

  const username = withoutProtocol.split(/[/?#]/)[0]?.trim();
  return username || null;
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function getContactChannels(): ContactChannel[] {
  const channels: ContactChannel[] = [];

  const zaloRaw = readEnv("NEXT_PUBLIC_CONTACT_ZALO", "CONTACT_ZALO");
  if (zaloRaw) {
    const phone = normalizeZaloPhone(zaloRaw);
    if (phone) {
      channels.push({ id: "zalo", href: `https://zalo.me/${phone}` });
    }
  }

  const messengerRaw = readEnv("NEXT_PUBLIC_CONTACT_MESSENGER", "CONTACT_MESSENGER");
  if (messengerRaw) {
    const username = normalizeMessengerUsername(messengerRaw);
    if (username) {
      channels.push({ id: "messenger", href: `https://m.me/${username}` });
    }
  }

  return channels;
}

export function hasContactChannels(): boolean {
  return getContactChannels().length > 0;
}
