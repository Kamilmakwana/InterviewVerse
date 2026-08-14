"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play, Flame, Trophy, ArrowRight, CalendarDays, Dices, Mic, Zap,
  Network, BookOpen, Sparkles, Bookmark, Clock,
} from "lucide-react";
import { PageShell } from "@/components/layout/shell";
import { INDEX as LESSONS, CHAPTERS, TOTAL_LESSONS, liteGet as getLesson } from "@/lib/lite";
import { chapterBySlug } from "@/lib/chapters";
import { daySeed } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useHydrated } from "@/lib/use-hydrated";
import { useT } from "@/lib/use-t";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Counter } from "@/components/shared/counter";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const hydrated = useHydrated();
  const { t } = useT();
  const records = useAppStore((s) => s.records);
  const recent = useAppStore((s) => s.recent);
  const bookmarks = useAppStore((s) => s.bookmarks);
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);

  const completedCount = hydrated
    ? Object.values(records).filter((r) => r.completed).length
    : 0;
  const overall = completedCount / TOTAL_LESSONS;

  // continue: last visited incomplete, else first incomplete overall
  const resumeSlug =
    (hydrated && recent.find((s) => !records[s]?.completed)) ||
    LESSONS.find((l) => !records[l.slug]?.completed)?.slug ||
    LESSONS[0].slug;
  const resume = getLesson(resumeSlug)!;
  const resumeChapter = chapterBySlug(resume.category);

  const daily = LESSONS[daySeed() % LESSONS.length];

  const actions = [
    { href: "/daily", icon: CalendarDays, label: "Daily Challenge", color: "#4F8EF7" },
    { href: "/wheel", icon: Dices, label: "Random Question", color: "#7C5CFC" },
    { href: "/interview", icon: Mic, label: "Interview Sim", color: "#22C55E" },
    { href: "/rapid-fire", icon: Zap, label: "Rapid Fire", color: "#F59E0B" },
    { href: "/graph", icon: Network, label: "Knowledge Map", color: "#A855F7" },
    { href: "/revision", icon: BookOpen, label: "Revision", color: "#EC4899" },
  ];

  return (
    <PageShell>
      {/* header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{t("home.welcomeBack")} 👋</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{t("home.yourDashboard")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <StatPill icon={Flame} value={hydrated ? streak : 0} label={t("common.streak")} tone="text-warning" />
          <StatPill icon={Trophy} value={hydrated ? xp : 0} label={t("common.xp")} tone="text-primary" />
        </div>
      </div>

      {/* continue + progress */}
      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Link
            href={`/learn/${resume.slug}`}
            className="group relative flex h-full items-center gap-5 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/12 to-secondary/8 p-6"
          >
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-card text-4xl shadow-soft">
              {resume.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {hydrated && records[resume.slug]?.views ? t("home.continueLearning") : t("home.startHere")}
              </p>
              <h2 className="mt-1 truncate text-xl font-bold">{resume.title}</h2>
              <p className="truncate text-sm text-muted">
                {resumeChapter?.world} · {resume.estimatedTime} min
              </p>
            </div>
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-white shadow-glow transition-transform group-hover:scale-110">
              <Play className="h-5 w-5" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center gap-5 rounded-3xl border border-border bg-card p-6"
        >
          <ProgressRing value={hydrated ? overall : 0} size={92} stroke={8}>
            <span className="text-lg font-bold">{Math.round((hydrated ? overall : 0) * 100)}%</span>
          </ProgressRing>
          <div>
            <p className="text-sm text-muted">{t("home.overallProgress")}</p>
            <p className="text-2xl font-bold">
              <Counter to={hydrated ? completedCount : 0} /> / {TOTAL_LESSONS}
            </p>
            <p className="text-xs text-muted">{t("home.lessonsCompleted")}</p>
          </div>
        </motion.div>
      </div>

      {/* quick actions */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {actions.map((a, i) => (
          <motion.div
            key={a.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.03 }}
          >
            <Link
              href={a.href}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-1 hover:shadow-soft"
            >
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ background: `${a.color}1f`, color: a.color }}
              >
                <a.icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-medium leading-tight">{a.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* chapters progress + side column */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHead title={t("home.yourWorlds")} href="/roadmap" cta={t("home.fullRoadmap")} />
          <div className="grid gap-3 sm:grid-cols-2">
            {CHAPTERS.map((c) => {
              const total = LESSONS.filter((l) => l.category === c.slug).length;
              const done = hydrated
                ? LESSONS.filter((l) => l.category === c.slug && records[l.slug]?.completed).length
                : 0;
              const pct = total ? done / total : 0;
              return (
                <Link
                  key={c.slug}
                  href={`/roadmap#${c.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-fg/5"
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                    style={{ background: `${c.color}1f` }}
                  >
                    {c.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-fg/10">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct * 100}%`, background: c.color }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-muted">
                    {done}/{total}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          {/* daily */}
          <div>
            <SectionHead title={t("home.dailyChallenge")} href="/daily" cta={t("home.open")} />
            <Link
              href="/daily"
              className="block rounded-2xl border border-border bg-gradient-to-br from-warning/10 to-transparent p-5 transition-colors hover:bg-fg/5"
            >
              <div className="mb-2 flex items-center gap-2 text-warning">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">{t("home.today")}</span>
              </div>
              <p className="text-sm font-medium">{daily.interviewQuestion}</p>
              <p className="mt-1 text-xs text-muted">{daily.emoji} {daily.title}</p>
            </Link>
          </div>

          {/* recent */}
          {hydrated && recent.length > 0 && (
            <div>
              <SectionHead title={t("home.recentlyVisited")} icon={Clock} />
              <div className="space-y-1.5">
                {recent.slice(0, 4).map((slug) => {
                  const l = getLesson(slug);
                  if (!l) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/learn/${slug}`}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-fg/5"
                    >
                      <span>{l.emoji}</span>
                      <span className="flex-1 truncate">{l.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* bookmarks */}
          {hydrated && bookmarks.length > 0 && (
            <div>
              <SectionHead title={t("home.bookmarks")} href="/bookmarks" cta={t("home.all")} icon={Bookmark} />
              <div className="space-y-1.5">
                {bookmarks.slice(0, 3).map((slug) => {
                  const l = getLesson(slug);
                  if (!l) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/learn/${slug}`}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-fg/5"
                    >
                      <span>{l.emoji}</span>
                      <span className="flex-1 truncate">{l.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function StatPill({
  icon: I,
  value,
  label,
  tone,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
      <I className={cn("h-4 w-4", tone)} />
      <span className="font-bold">
        <Counter to={value} />
      </span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

function SectionHead({
  title,
  href,
  cta,
  icon: I,
}: {
  title: string;
  href?: string;
  cta?: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted">
        {I && <I className="h-4 w-4" />}
        {title}
      </h3>
      {href && cta && (
        <Link href={href} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          {cta} <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
