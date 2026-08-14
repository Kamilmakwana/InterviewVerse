"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { isRtl } from "@/lib/i18n";

/** Applies theme (dark/light/system) and locale (lang + dir) to <html>. */
export function ThemeManager() {
  const theme = useAppStore((s) => s.theme);
  const locale = useAppStore((s) => s.locale);

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      root.classList.toggle("dark", dark);
    };
    apply();
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("lang", locale);
    root.setAttribute("dir", isRtl(locale) ? "rtl" : "ltr");
  }, [locale]);

  return null;
}
