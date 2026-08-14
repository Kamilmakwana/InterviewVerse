"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CHAPTERS, liteLessonsIn as lessonsIn, INDEX_BY_SLUG as LESSONS_BY_SLUG } from "@/lib/lite";
import { cn } from "@/lib/utils";

const W = 760;
const H = 560;
const CX = W / 2;
const CY = H / 2;
const R = 200;

export function KnowledgeGraph() {
  const [selected, setSelected] = useState<string>(CHAPTERS[0].slug);

  const nodes = useMemo(
    () =>
      CHAPTERS.map((c, i) => {
        const angle = (i / CHAPTERS.length) * Math.PI * 2 - Math.PI / 2;
        return {
          ...c,
          x: CX + R * Math.cos(angle),
          y: CY + R * Math.sin(angle),
        };
      }),
    []
  );

  // Cross-chapter links: if a lesson in chapter A has a related lesson in chapter B.
  const links = useMemo(() => {
    const set = new Set<string>();
    const out: { a: string; b: string }[] = [];
    for (const c of CHAPTERS) {
      for (const l of lessonsIn(c.slug)) {
        for (const rel of l.related) {
          const target = LESSONS_BY_SLUG[rel];
          if (target && target.category !== c.slug) {
            const key = [c.slug, target.category].sort().join("|");
            if (!set.has(key)) {
              set.add(key);
              out.push({ a: c.slug, b: target.category });
            }
          }
        }
      }
    }
    // If no cross-chapter links found from lesson data, create some sensible defaults
    // so the graph always looks connected
    if (out.length === 0) {
      const defaultLinks: [string, string][] = [
        ["csharp", "oop"],
        ["oop", "advanced"],
        ["advanced", "aspnet"],
        ["aspnet", "entityframework"],
        ["entityframework", "sqlserver"],
        ["aspnet", "azure"],
        ["azure", "systemdesign"],
        ["systemdesign", "production"],
        ["csharp", "coding"],
        ["oop", "behavioral"],
        ["advanced", "ai"],
        ["coding", "production"],
        ["ai", "aspnet"],
      ];
      for (const [a, b] of defaultLinks) {
        const key = [a, b].sort().join("|");
        if (!set.has(key)) {
          set.add(key);
          out.push({ a, b });
        }
      }
    }
    return out;
  }, []);

  const pos = (slug: string) => nodes.find((n) => n.slug === slug)!;
  const selNode = pos(selected);
  const connected = new Set(
    links.filter((l) => l.a === selected || l.b === selected).flatMap((l) => [l.a, l.b])
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Graph area */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full select-none">
          <defs>
            {/* Glow filter for selected node */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Center hub gradient */}
            <radialGradient id="hubGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0.08" />
            </radialGradient>
            {/* Hub glow */}
            <filter id="hubGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Radial spokes from center to each node */}
          {nodes.map((n) => {
            const isSel = n.slug === selected;
            const isConn = connected.has(n.slug);
            return (
              <line
                key={`spoke-${n.slug}`}
                x1={CX}
                y1={CY}
                x2={n.x}
                y2={n.y}
                stroke={isSel ? n.color : "rgb(var(--border))"}
                strokeOpacity={isSel ? 0.6 : 0.25}
                strokeWidth={isSel ? 1.5 : 0.8}
                strokeDasharray={isSel ? "none" : "4 6"}
              />
            );
          })}

          {/* Cross-chapter links */}
          {links.map((l, i) => {
            const a = pos(l.a);
            const b = pos(l.b);
            const active = l.a === selected || l.b === selected;
            const activeColor =
              l.a === selected ? pos(l.a).color : pos(l.b).color;
            return (
              <line
                key={`link-${i}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={active ? activeColor : "rgb(var(--muted))"}
                strokeOpacity={active ? 0.6 : 0.12}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? "none" : "3 5"}
              />
            );
          })}

          {/* Center hub - outer glow ring */}
          <circle
            cx={CX}
            cy={CY}
            r={42}
            fill="rgb(var(--primary))"
            fillOpacity={0.06}
          />
          {/* Center hub - main circle */}
          <circle
            cx={CX}
            cy={CY}
            r={32}
            fill="url(#hubGradient)"
            stroke="rgb(var(--primary))"
            strokeWidth={1.5}
            strokeOpacity={0.4}
            filter="url(#hubGlow)"
          />
          <text
            x={CX}
            y={CY + 5}
            textAnchor="middle"
            className="text-[12px] font-bold"
            fill="rgb(var(--fg))"
          >
            .NET
          </text>

          {/* Chapter nodes */}
          {nodes.map((n) => {
            const isSel = n.slug === selected;
            const isConn = connected.has(n.slug);
            return (
              <g
                key={n.slug}
                onClick={() => setSelected(n.slug)}
                className="cursor-pointer"
              >
                {/* Pulse ring for selected */}
                {isSel && (
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={28}
                    fill="none"
                    stroke={n.color}
                    strokeWidth={2}
                    initial={{ r: 22, opacity: 0.7 }}
                    animate={{ r: 36, opacity: 0 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeOut",
                    }}
                  />
                )}

                {/* Node circle */}
                <motion.circle
                  cx={n.x}
                  cy={n.y}
                  r={isSel ? 26 : 22}
                  animate={{ r: isSel ? 26 : 22 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  fill={n.color}
                  fillOpacity={isSel ? 0.9 : isConn ? 0.45 : 0.15}
                  stroke={n.color}
                  strokeWidth={isSel ? 2.5 : 1.8}
                  strokeOpacity={isSel ? 1 : isConn ? 0.8 : 0.55}
                  filter={isSel ? "url(#glow)" : undefined}
                />

                {/* Emoji */}
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  className="pointer-events-none text-[14px]"
                >
                  {n.emoji}
                </text>

                {/* Label */}
                <text
                  x={n.x}
                  y={n.y + (n.y > CY ? 42 : -34)}
                  textAnchor="middle"
                  className="pointer-events-none text-[10px] font-semibold"
                  fill={isSel ? n.color : "rgb(var(--muted))"}
                >
                  {n.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Info panel */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl text-xl"
            style={{ background: `${selNode.color}22` }}
          >
            {selNode.emoji}
          </span>
          <div>
            <h3 className="font-bold">{selNode.world}</h3>
            <p className="text-xs text-muted">{selNode.tagline}</p>
          </div>
        </div>
        <p className="mb-3 text-xs text-muted">
          Connected to{" "}
          {[...connected].filter((s) => s !== selected).length} other{" "}
          {[...connected].filter((s) => s !== selected).length === 1
            ? "area"
            : "areas"}
          . Tap a node to explore.
        </p>
        <div className="max-h-[320px] space-y-1 overflow-y-auto">
          {lessonsIn(selected).map((l) => (
            <Link
              key={l.slug}
              href={`/learn/${l.slug}`}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-fg/5"
            >
              <span>{l.emoji}</span>
              <span className="truncate">{l.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
