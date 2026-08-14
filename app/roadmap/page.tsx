import { PageShell } from "@/components/layout/shell";
import { Roadmap } from "@/components/roadmap/roadmap";

export const metadata = { title: "Roadmap — InterviewVerse" };

export default function RoadmapPage() {
  return (
    <PageShell>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">The World Map</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Twelve worlds, from the C# Kingdom to the AI Laboratory. Complete a chapter to
          make its node glow — and unlock the next.
        </p>
      </div>
      <Roadmap />
    </PageShell>
  );
}
