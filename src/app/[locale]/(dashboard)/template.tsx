"use client";

import { AnimatedPageTransition } from "@/components/camba/motion";

export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnimatedPageTransition>{children}</AnimatedPageTransition>;
}
