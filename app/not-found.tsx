import Link from "next/link";
import { AnimatedBackground } from "@/components/shared/animated-background";

export default function NotFound() {
  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      <AnimatedBackground />
      <div className="text-center">
        <p className="text-7xl">🧭</p>
        <h1 className="mt-4 text-3xl font-bold">Lost in the codebase</h1>
        <p className="mt-2 text-muted">This page doesn&apos;t exist — but the roadmap does.</p>
        <Link
          href="/home"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-white shadow-glow hover:brightness-110"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
