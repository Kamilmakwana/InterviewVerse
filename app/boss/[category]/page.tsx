import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/shell";
import { RapidFire } from "@/components/features/rapid-fire";
import { CHAPTERS, chapterBySlug } from "@/lib/data";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const c = chapterBySlug(params.category);
  return { title: `${c?.world ?? "Boss"} — Boss Interview` };
}

export default function BossPage({ params }: { params: { category: string } }) {
  const chapter = chapterBySlug(params.category);
  if (!chapter) notFound();
  return (
    <PageShell footer={false}>
      <div className="mb-8 text-center">
        <div className="mb-2 text-4xl">{chapter.emoji}</div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Boss Interview: {chapter.world}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          No hints. Score 70%+ to defeat the boss and earn your stars.
        </p>
      </div>
      <RapidFire category={chapter.slug} count={12} boss />
    </PageShell>
  );
}
