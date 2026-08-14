"use client";

import { motion } from "framer-motion";
import { Database, Server, Cpu, User, Layers, ArrowRight } from "lucide-react";

const frame =
  "relative flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/[0.06] to-secondary/[0.06]";

function Stack() {
  const items = ["push()", "C", "B", "A"];
  return (
    <div className="flex flex-col-reverse items-center gap-1.5">
      {items.map((it, i) => (
        <motion.div
          key={it}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.35, type: "spring", stiffness: 260, damping: 18, repeat: Infinity, repeatDelay: 2.4, repeatType: "reverse" }}
          className="grid h-10 w-28 place-items-center rounded-lg bg-primary/85 font-mono text-sm text-white shadow-glow"
        >
          {it}
        </motion.div>
      ))}
      <span className="mt-2 text-xs text-muted">LIFO — last in, first out</span>
    </div>
  );
}

function Queue() {
  return (
    <div className="flex items-center gap-3">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="grid h-11 w-11 place-items-center rounded-lg bg-secondary/85 font-mono text-white shadow-glow"
          animate={{ x: [-8, 8, -8], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        >
          {i + 1}
        </motion.div>
      ))}
      <ArrowRight className="h-5 w-5 text-muted" />
      <span className="text-xs text-muted">FIFO</span>
    </div>
  );
}

function ArrayViz() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {[3, 1, 4, 1, 5, 9, 2].map((n, i) => (
          <div key={i} className="relative">
            <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-card font-mono text-sm">
              {n}
            </div>
            <motion.div
              className="absolute -inset-0.5 rounded-md ring-2 ring-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5 }}
            />
            <span className="mt-1 block text-center text-[0.6rem] text-muted">[{i}]</span>
          </div>
        ))}
      </div>
      <span className="text-xs text-muted">O(1) index access</span>
    </div>
  );
}

function Layered() {
  const layers = ["Request", "Middleware", "Controller", "Service", "Data"];
  return (
    <div className="flex w-full max-w-xs flex-col gap-1.5 px-6">
      {layers.map((l, i) => (
        <motion.div
          key={l}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.18, duration: 0.5, repeat: Infinity, repeatDelay: 2.5, repeatType: "reverse" }}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
          style={{ marginLeft: i * 10 }}
        >
          <Layers className="h-4 w-4 text-primary" /> {l}
        </motion.div>
      ))}
    </div>
  );
}

function Network() {
  const nodes = [
    { icon: User, label: "Client", x: 8, y: 50 },
    { icon: Server, label: "API", x: 50, y: 20 },
    { icon: Cpu, label: "Cache", x: 50, y: 80 },
    { icon: Database, label: "DB", x: 90, y: 50 },
  ];
  return (
    <div className="relative h-full w-full">
      <svg className="absolute inset-0 h-full w-full">
        {[
          [8, 50, 50, 20],
          [50, 20, 90, 50],
          [8, 50, 50, 80],
          [50, 80, 90, 50],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={`${x1}%`}
            y1={`${y1}%`}
            x2={`${x2}%`}
            y2={`${y2}%`}
            stroke="rgb(var(--primary) / 0.3)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        ))}
        <motion.circle
          r={4}
          fill="rgb(var(--primary))"
          animate={{
            cx: ["8%", "50%", "90%"],
            cy: ["50%", "20%", "50%"],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {nodes.map((n) => (
        <div
          key={n.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-card shadow-soft">
            <n.icon className="h-5 w-5 text-primary" />
          </div>
          <span className="mt-1 block text-center text-[0.6rem] text-muted">{n.label}</span>
        </div>
      ))}
    </div>
  );
}

function Flow() {
  const steps = ["In", "Process", "Out"];
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <motion.div
            className="grid h-14 w-20 place-items-center rounded-xl border border-border bg-card text-sm shadow-soft"
            animate={{ borderColor: ["rgb(var(--border))", "rgb(var(--primary))", "rgb(var(--border))"] }}
            transition={{ duration: 2.1, repeat: Infinity, delay: i * 0.7 }}
          >
            {s}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
              <ArrowRight className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

function Timeline() {
  return (
    <div className="flex w-full max-w-sm items-center px-8">
      <div className="relative h-1 w-full rounded-full bg-border">
        <motion.div
          className="absolute left-0 top-0 h-1 rounded-full bg-primary"
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 33, 66, 100].map((p) => (
          <div
            key={p}
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary bg-bg"
            style={{ left: `${p}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function Compare() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {["Option A", "Option B"].map((o, i) => (
        <motion.div
          key={o}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.3, repeat: Infinity, repeatDelay: 2.5, repeatType: "reverse", duration: 0.6 }}
          className="grid h-24 w-32 place-items-center rounded-xl border border-border bg-card text-sm font-medium"
          style={{ borderColor: i === 0 ? "rgb(var(--primary))" : undefined }}
        >
          {o}
        </motion.div>
      ))}
    </div>
  );
}

function Orbit({ emoji }: { emoji: string }) {
  return (
    <div className="relative grid h-40 w-40 place-items-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-3xl">
        {emoji}
      </div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 8 + i * 3, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-secondary"
            style={{ top: `${8 + i * 8}%`, opacity: 1 - i * 0.25 }}
          />
        </motion.div>
      ))}
    </div>
  );
}

export function InteractiveDiagram({
  type,
  emoji = "💡",
}: {
  type: string;
  emoji?: string;
}) {
  const render = () => {
    switch (type) {
      case "stack": return <Stack />;
      case "queue": return <Queue />;
      case "array": return <ArrayViz />;
      case "layers": return <Layered />;
      case "network": return <Network />;
      case "flow": return <Flow />;
      case "timeline": return <Timeline />;
      case "compare": return <Compare />;
      default: return <Orbit emoji={emoji} />;
    }
  };
  return <div className={frame}>{render()}</div>;
}
