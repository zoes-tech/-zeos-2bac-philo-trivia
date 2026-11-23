"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ScoringProvider } from "@/contexts/ScoringProvider";

/**
 * Client-side providers shared by every locale.
 * `reducedMotion="user"` honours the OS "reduce motion" setting for all
 * Framer Motion animations at once.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScoringProvider>{children}</ScoringProvider>
    </MotionConfig>
  );
}
