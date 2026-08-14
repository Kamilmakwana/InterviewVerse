"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/shell";
import { COMPANIES, lessonsForCompany } from "@/lib/companies";
import { chapterBySlug } from "@/lib/chapters";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function CompaniesPage() {
  const [active, setActive] = useState(COMPANIES[0].name);
  const setFilter = useAppStore((s) => s.setCompanyFilter);
  const company = COMPANIES.find((c) => c.name === active)!;
  const lessons = lessonsForCompany(company).slice(0, 24);

  return (
    <PageShell>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Company Prep</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Pick a company and we&apos;ll surface the topics they lean on most. It just
          reorders lessons — everything stays local.
        </p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {COMPANIES.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              setActive(c.name);
              setFilter(c.name);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
              active === c.name
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:bg-fg/5"
            )}
          >
            <span>{c.emoji}</span> {c.name}
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl"
      >
        <div className="mb-6 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-lg font-semibold">{company.emoji} {company.name}</p>
          <p className="mt-1 text-sm text-muted">{company.vibe}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {company.focus.map((f) => {
              const ch = chapterBySlug(f);
              return (
                <span key={f} className="rounded-full bg-fg/[0.06] px-3 py-1 text-xs">
                  {ch?.emoji} {ch?.title}
                </span>
              );
            })}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {lessons.map((l) => (
            <Link
              key={l.slug}
              href={`/learn/${l.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-fg/5"
            >
              <span className="text-lg">{l.emoji}</span>
              <span className="flex-1 truncate group-hover:text-fg">{l.title}</span>
              <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </motion.div>
    </PageShell>
  );
}
