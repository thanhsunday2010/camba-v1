"use client";

import type { ReactNode } from "react";
import { MascotProvider } from "@/components/mascot";

export function LandingPageShell({ children }: { children: ReactNode }) {
  return <MascotProvider>{children}</MascotProvider>;
}
