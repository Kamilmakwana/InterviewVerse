import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LESSONS, getLesson } from "@/lib/data";
import { PageShell } from "@/components/layout/shell";
import { LessonViewer } from "@/components/lesson/lesson-viewer";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return { title: "Lesson not found — InterviewVerse" };
  return {
    title: `${lesson.title} — InterviewVerse`,
    description: lesson.summary,
    keywords: lesson.keywords,
  };
}

export default function LessonPage({ params }: { params: { slug: string } }) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();
  return (
    <PageShell>
      <LessonViewer lesson={lesson} />
    </PageShell>
  );
}
