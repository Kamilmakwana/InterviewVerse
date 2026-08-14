import { PageShell } from "@/components/layout/shell";
import { KnowledgeGraph } from "@/components/graph/knowledge-graph";

export const metadata = { title: "Knowledge Map — InterviewVerse" };

export default function GraphPage() {
  return (
    <PageShell>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Knowledge Map</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted">
          Every world is connected. Tap a node to trace how concepts relate — and jump
          straight into any lesson.
        </p>
      </div>
      <KnowledgeGraph />
    </PageShell>
  );
}
