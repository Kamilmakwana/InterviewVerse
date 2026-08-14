"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, Flame } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LogoMark } from "@/components/ui/logo";
import { Kbd } from "@/components/ui/kbd";
import { usePalette } from "@/components/layout/palette-store";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/lib/use-hydrated";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/roadmap", key: "nav.roadmap" },
  { href: "/home", key: "nav.dashboard" },
  { href: "/interview", key: "nav.interview" },
  { href: "/rapid-fire", key: "nav.rapidFire" },
  { href: "/companies", key: "nav.companyPrep" },
  { href: "/achievements", key: "nav.achievements" },
];

export function TopNav() {
  const pathname = usePathname();
  const setOpen = usePalette((s) => s.setOpen);
  const [mobile, setMobile] = useState(false);
  const streak = useAppStore((s) => s.streak);
  const hydrated = useHydrated();
  const { t } = useT();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LogoMark size={34} />
          <span className="hidden sm:block">
            Interview&nbsp;<span className="gradient-text">Verse</span>
          </span>
        </Link>

        <div className="mx-2 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors",
                pathname.startsWith(l.href)
                  ? "bg-fg/[0.07] text-fg"
                  : "text-muted hover:text-fg"
              )}
            >
              {t(l.key)}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {hydrated && streak > 0 && (
            <span className="hidden items-center gap-1 rounded-full bg-warning/12 px-2.5 py-1 text-xs font-semibold text-warning sm:inline-flex">
              <Flame className="h-3.5 w-3.5" /> {streak}
            </span>
          )}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-sm text-muted transition-colors hover:text-fg focus-ring"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">{t("nav.search")}</span>
            <Kbd className="hidden lg:inline-flex">⌘K</Kbd>
          </button>
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border border-border md:hidden"
            onClick={() => setMobile((v) => !v)}
            aria-label="Menu"
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="grid gap-1 p-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobile(false)}
                  className="rounded-lg px-3 py-2 text-sm text-fg/80 hover:bg-fg/5"
                >
                  {t(l.key)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
