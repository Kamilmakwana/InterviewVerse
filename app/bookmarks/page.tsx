"use client";

import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/layout/shell";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/lib/use-hydrated";
import { liteGet as getLesson } from "@/lib/lite";

export default function BookmarksPage() {
  const hydrated = useHydrated();
  const bookmarks = useAppStore((s) => s.bookmarks);
  const lessons = bookmarks.map(getLesson).filter(Boolean);

  return (
    <PageShell>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Bookmarks</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Lessons you saved to revisit. Tap the bookmark on any lesson to add it here.
        </p>
      </div>

      {hydrated && lessons.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
          <Bookmark className="h-8 w-8 text-muted" />
          <p className="text-muted">No bookmarks yet.</p>
          <Link href="/roadmap" className="text-sm font-medium text-primary hover:underline">
            Browse the roadmap
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid max-w-4xl gap-2 sm:grid-cols-2">
          {lessons.map(
            (l) =>
              l && (
                <Link
                  key={l.slug}
                  href={`/learn/${l.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-fg/5"
                >
                  <span className="text-lg">{l.emoji}</span>
                  <span className="flex-1 truncate group-hover:text-fg">{l.title}</span>
                  <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              )
          )}
        </div>
      )}
    </PageShell>
  );
}
