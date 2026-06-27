"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { NextIntlClientProvider, type AbstractIntlMessages } from "next-intl";
import { useRouter } from "next/navigation";
import {
  mergeSiteTextOverrides,
  setNestedMessage,
} from "@/lib/site-copy/messages";
import { CopyEditToolbar } from "@/components/admin/site-copy/copy-edit-toolbar";
import { CopyEditDialog } from "@/components/admin/site-copy/copy-edit-dialog";

type SiteCopyEditContextValue = {
  editMode: boolean;
  setEditMode: (enabled: boolean) => void;
  locale: string;
  messages: AbstractIntlMessages;
  baseMessages: AbstractIntlMessages;
  overrides: Record<string, string>;
  openEditor: (messageKey: string, currentValue: string) => void;
  applyLocalOverride: (messageKey: string, value: string | null) => void;
};

const SiteCopyEditContext = createContext<SiteCopyEditContextValue | null>(null);

export function useSiteCopyEdit() {
  return useContext(SiteCopyEditContext);
}

interface SiteCopyEditShellProps {
  children: ReactNode;
  locale: string;
  isAdmin: boolean;
  messages: AbstractIntlMessages;
  baseMessages: AbstractIntlMessages;
  overrides: Record<string, string>;
}

export function SiteCopyEditShell({
  children,
  locale,
  isAdmin,
  messages,
  baseMessages,
  overrides: initialOverrides,
}: SiteCopyEditShellProps) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [overrides, setOverrides] = useState(initialOverrides);
  const [localMessages, setLocalMessages] = useState(messages);
  const [editor, setEditor] = useState<{ key: string; value: string } | null>(null);

  useEffect(() => {
    setOverrides(initialOverrides);
    setLocalMessages(messages);
  }, [initialOverrides, messages]);

  const applyLocalOverride = useCallback(
    (messageKey: string, value: string | null) => {
      setOverrides((current) => {
        const next = { ...current };
        if (value === null) {
          delete next[messageKey];
        } else {
          next[messageKey] = value;
        }
        return next;
      });

      setLocalMessages((current) => {
        if (value === null) {
          const baseValue = getBaseValue(baseMessages, messageKey);
          if (baseValue === null) return current;
          return setNestedMessage(current, messageKey, baseValue);
        }
        return setNestedMessage(current, messageKey, value);
      });
    },
    [baseMessages]
  );

  const openEditor = useCallback((messageKey: string, currentValue: string) => {
    setEditor({ key: messageKey, value: currentValue });
  }, []);

  const handleSaved = useCallback(() => {
    setEditor(null);
    router.refresh();
  }, [router]);

  const contextValue = useMemo<SiteCopyEditContextValue>(
    () => ({
      editMode,
      setEditMode,
      locale,
      messages: localMessages,
      baseMessages,
      overrides,
      openEditor,
      applyLocalOverride,
    }),
    [
      editMode,
      locale,
      localMessages,
      baseMessages,
      overrides,
      openEditor,
      applyLocalOverride,
    ]
  );

  if (!isAdmin) {
    return (
      <NextIntlClientProvider locale={locale} messages={localMessages}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <SiteCopyEditContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={locale} messages={localMessages}>
        <div className={editMode ? "site-copy-edit-mode" : undefined}>{children}</div>
        <CopyEditToolbar />
        <CopyEditDialog
          editor={editor}
          locale={locale}
          baseMessages={baseMessages}
          overrides={overrides}
          onClose={() => setEditor(null)}
          onSaved={handleSaved}
          onApplyLocal={applyLocalOverride}
        />
      </NextIntlClientProvider>
    </SiteCopyEditContext.Provider>
  );
}

function getBaseValue(messages: AbstractIntlMessages, messageKey: string): string | null {
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

export function mergeMessagesWithOverrides(
  messages: AbstractIntlMessages,
  overrides: Record<string, string>
) {
  return mergeSiteTextOverrides(messages, overrides);
}
