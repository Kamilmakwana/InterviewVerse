"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translate, isRtl, localeMeta } from "@/lib/i18n";

/** Translation hook: `const { t, locale, rtl } = useT();  t("nav.roadmap")` */
export function useT() {
  const locale = useAppStore((s) => s.locale);
  const t = useCallback((path: string) => translate(locale, path), [locale]);
  return {
    t,
    locale,
    rtl: isRtl(locale),
    dir: (isRtl(locale) ? "rtl" : "ltr") as "rtl" | "ltr",
    speech: localeMeta(locale).speech,
  };
}
