import Link from "next/link";
import { TOTAL_LESSONS, CHAPTERS } from "@/lib/lite";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
          <div>
            <p className="font-semibold">
              Interview&nbsp;<span className="gradient-text">Verse</span>
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {TOTAL_LESSONS} interview lessons across {CHAPTERS.length} worlds.
              Learn .NET through stories. Runs fully offline — your progress lives
              in your browser.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link href="/roadmap" className="text-muted hover:text-fg">Roadmap</Link>
            <Link href="/interview" className="text-muted hover:text-fg">Interview</Link>
            <Link href="/revision" className="text-muted hover:text-fg">Revision</Link>
            <Link href="/graph" className="text-muted hover:text-fg">Knowledge Map</Link>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted">
          Built for focused interview prep. No accounts, no tracking, no backend.
        </p>
      </div>
    </footer>
  );
}
