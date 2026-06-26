"use client";

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X } from "lucide-react";
import { getContactChannels, type ContactChannel, type ContactChannelId } from "@/lib/contact/contact-channels";
import { cn } from "@/lib/utils";

const CHANNEL_STYLES: Record<
  ContactChannelId,
  { className: string; icon: ReactNode }
> = {
  zalo: {
    className: "bg-[#0068FF] hover:bg-[#0056d6] text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2C6.48 2 2 5.58 2 10.02c0 2.64 1.45 4.98 3.72 6.52-.15.53-.55 1.93-.63 2.24-.1.4.15.39.31.28.16-.1 2.56-1.73 3.6-2.42.55.08 1.12.12 1.7.12 5.52 0 10-3.58 10-8.02S17.52 2 12 2zm-2.9 9.55H7.35c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1.75c.28 0 .5.22.5.5s-.22.5-.5.5zm5.8 0h-1.75c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1.75c.28 0 .5.22.5.5s-.22.5-.5.5zm-2.9 2.5H7.35c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h5.55c.28 0 .5.22.5.5s-.22.5-.5.5z"
        />
      </svg>
    ),
  },
  messenger: {
    className: "bg-[#0084FF] hover:bg-[#006edc] text-white",
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          fill="currentColor"
          d="M12 2C6.36 2 2 6.13 2 11.07c0 2.91 1.45 5.5 3.72 7.28V22l3.4-1.87c.9.25 1.86.39 2.88.39 5.64 0 10-4.13 10-9.07S17.64 2 12 2zm.95 11.93-2.55-2.72-4.99 2.72 5.5-5.85 2.62 2.72 4.92-2.72-5.5 5.85z"
        />
      </svg>
    ),
  },
};

function ChannelLink({
  channel,
  label,
  onNavigate,
}: {
  channel: ContactChannel;
  label: string;
  onNavigate?: () => void;
}) {
  const style = CHANNEL_STYLES[channel.id];

  return (
    <a
      href={channel.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-lg transition-transform hover:scale-[1.02] camba-focus-ring",
        style.className
      )}
    >
      {style.icon}
      <span>{label}</span>
    </a>
  );
}

export function ContactFab() {
  const t = useTranslations("contact");
  const menuId = useId();
  const channels = useMemo(() => getContactChannels(), []);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (channels.length === 0) return null;

  const singleChannel = channels.length === 1 ? channels[0] : null;

  if (singleChannel) {
    const style = CHANNEL_STYLES[singleChannel.id];
    return (
      <div
        className="fixed z-[90] flex flex-col items-end gap-2"
        style={{
          bottom: "max(1rem, env(safe-area-inset-bottom))",
          right: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <a
          href={singleChannel.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(`channel.${singleChannel.id}`)}
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 camba-focus-ring",
            style.className
          )}
        >
          {style.icon}
        </a>
      </div>
    );
  }

  return (
    <div
      className="fixed z-[90] flex flex-col items-end gap-3"
      style={{
        bottom: "max(1rem, env(safe-area-inset-bottom))",
        right: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("menuLabel")}
          className="flex flex-col items-stretch gap-2 min-w-[11rem] animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {channels.map((channel) => (
            <ChannelLink
              key={channel.id}
              channel={channel}
              label={t(`channel.${channel.id}`)}
              onNavigate={() => setOpen(false)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={open ? t("close") : t("open")}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 camba-focus-ring",
          open && "rotate-0"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
