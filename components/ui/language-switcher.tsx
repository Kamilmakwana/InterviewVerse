"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { LOCALES, localeMeta } from "@/lib/i18n";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-2.5 text-sm text-muted transition-colors hover:text-fg focus-ring"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden text-xs font-medium sm:inline">{localeMeta(locale).native}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 max-h-80 w-52 overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-glow-lg"
          >
            <p className="px-2.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
              Language
            </p>
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  locale === l.code ? "bg-primary/12 text-fg" : "text-fg/80 hover:bg-fg/5"
                )}
              >
                <span>
                  <span className="font-medium">{l.native}</span>
                  <span className="ml-2 text-xs text-muted">{l.label}</span>
                </span>
                {locale === l.code && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
