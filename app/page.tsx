"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Mic, Brain, Zap, Trophy, Network,
  Sparkles, Play, Star, Github,
} from "lucide-react";
import { AnimatedBackground } from "@/components/shared/animated-background";
import { FloatingCards } from "@/components/shared/floating-cards";
import { Counter } from "@/components/shared/counter";
import { Reveal } from "@/components/shared/reveal";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LogoMark } from "@/components/ui/logo";
import { CHAPTERS, TOTAL_LESSONS, INDEX as LESSONS } from "@/lib/lite";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: BookOpen, title: "Story Mode", desc: "Every concept becomes a vivid story — DI is a restaurant, GC is hotel housekeeping. You remember stories, not definitions." },
  { icon: Mic, title: "Interview Simulator", desc: "A calm, realistic mock interview with an interviewer, thinking timer, model answers, and follow-up questions." },
  { icon: Brain, title: "Memory Hacks", desc: "Mnemonics, one-liners, and memory palaces engineered so answers surface under pressure." },
  { icon: Zap, title: "Rapid Fire & Quizzes", desc: "Animated quizzes with instant feedback and confetti, plus rapid-fire drills before the big day." },
  { icon: Network, title: "Knowledge Map", desc: "See how every topic connects — from interfaces to DI to the repository pattern — as an interactive graph." },
  { icon: Trophy, title: "Progress & Achievements", desc: "Spaced-repetition mastery, streaks, and unlockable achievements. All saved locally, no account needed." },
];

const TESTIMONIALS = [
  { name: "Ananya R.", role: "Backend Engineer → Microsoft", quote: "I stopped memorising answers and started understanding them. The story for garbage collection is burned into my brain." },
  { name: "Dev P.", role: "Senior .NET Developer", quote: "The interview simulator is unreasonably good. Walked into my loop already warmed up." },
  { name: "Sofia M.", role: "Full-stack Developer", quote: "It genuinely feels like a game. I did three chapters without realising an hour had passed." },
];

export default function Landing() {
  const { t } = useT();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground dense />

      {/* nav */}
      <header className="relative z-10 mx-auto flex h-16 max-w-7xl items-center px-6">
        <span className="flex items-center gap-2 font-semibold">
          <LogoMark size={34} />
          <span>Interview&nbsp;<span className="gradient-text">Verse</span></span>
        </span>
        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://github.com/Kamilmakwana/InterviewVerse"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star InterviewVerse on GitHub"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted transition-colors hover:text-fg"
          >
            <Github className="h-4 w-4" />
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/roadmap"
            className="hidden rounded-xl border border-border px-4 py-2 text-sm hover:bg-fg/5 sm:inline-block"
          >
            {t("nav.exploreRoadmap")}
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="relative mx-auto max-w-7xl px-6 pb-16 pt-16 sm:pt-24">
        <FloatingCards />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            {t("landing.badge")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            {t("landing.titleA")}{" "}
            <span className="gradient-text">{t("landing.titleB")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted"
          >
            {t("landing.subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/home"
              className="group inline-flex h-13 items-center gap-2 rounded-2xl bg-primary px-7 py-3.5 font-medium text-white shadow-glow transition hover:brightness-110"
            >
              {t("landing.startLearning")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/learn/${LESSONS[0].slug}`}
              className="inline-flex h-13 items-center gap-2 rounded-2xl border border-border bg-card px-7 py-3.5 font-medium transition hover:bg-fg/5"
            >
              <Play className="h-4 w-4" /> {t("landing.tryLesson")}
            </Link>
          </motion.div>
        </div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative z-10 mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { n: TOTAL_LESSONS, l: "Lessons", s: "" },
            { n: 12, l: "Worlds", s: "" },
            { n: 300, l: "Quiz Qs", s: "+" },
            { n: 100, l: "Offline", s: "%" },
          ].map((s) => (
            <div key={s.l} className="card-surface p-5 text-center">
              <p className="text-3xl font-extrabold gradient-text">
                <Counter to={s.n} suffix={s.s} />
              </p>
              <p className="mt-1 text-sm text-muted">{s.l}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* features */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.featuresTitle")}</h2>
          <p className="mt-3 text-muted">{t("landing.featuresSubtitle")}</p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="card-surface h-full p-6 transition-shadow hover:shadow-soft">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* roadmap preview */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.journeyTitle")}</h2>
          <p className="mt-3 text-muted">{t("landing.journeySubtitle")}</p>
        </Reveal>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CHAPTERS.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2"
            >
              <div
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
                style={{ boxShadow: `inset 0 0 0 1px ${c.color}22` }}
              >
                <span>{c.emoji}</span>
                <span className="font-medium">{c.world}</span>
              </div>
              {i < CHAPTERS.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 text-muted sm:block" />
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/roadmap" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
            {t("landing.seeRoadmap")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* testimonials */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Loved by people who got the offer</h2>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className="card-surface h-full p-6">
                <div className="mb-3 flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-fg/85">“{t.quote}”</p>
                <div className="mt-4">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          Testimonials are illustrative placeholders.
        </p>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent p-10 text-center sm:p-16">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">{t("landing.ctaSubtitle")}</p>
            <Link
              href="/home"
              className="mt-8 inline-flex h-13 items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 font-medium text-white shadow-glow transition hover:brightness-110"
            >
              {t("landing.ctaButton")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
