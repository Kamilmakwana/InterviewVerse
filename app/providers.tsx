"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ThemeManager } from "@/components/theme-manager";
import { AchievementToast } from "@/components/achievement-toast";
import { useAppStore } from "@/store/useAppStore";

// Lazy-load the palette so its search/content graph stays out of the
// initial bundle — it loads on idle, well before the user hits ⌘K.
const CommandPalette = dynamic(
  () => import("@/components/layout/command-palette").then((m) => m.CommandPalette),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Ensure hydrated flips true even if there was nothing persisted yet.
    if (!useAppStore.getState().hydrated) {
      useAppStore.setState({ hydrated: true });
    }
  }, []);

  return (
    <>
      <ThemeManager />
      {children}
      <CommandPalette />
      <AchievementToast />
    </>
  );
}
