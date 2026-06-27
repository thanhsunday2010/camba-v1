"use client";

import { createContext, useContext } from "react";

const LessonUnlockBypassContext = createContext(false);

export function LessonUnlockBypassProvider({
  value,
  children,
}: {
  value: boolean;
  children: React.ReactNode;
}) {
  return (
    <LessonUnlockBypassContext.Provider value={value}>{children}</LessonUnlockBypassContext.Provider>
  );
}

export function useLessonUnlockBypass(): boolean {
  return useContext(LessonUnlockBypassContext);
}
