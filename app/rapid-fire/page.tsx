import { PageShell } from "@/components/layout/shell";
import { RapidFire } from "@/components/features/rapid-fire";

export const metadata = { title: "Rapid Fire — InterviewVerse" };

export default function RapidFirePage() {
  return (
    <PageShell footer={false}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Rapid Fire</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          20 mixed questions, back to back. Quick instinct check before the real thing.
        </p>
      </div>
      <RapidFire count={20} />
    </PageShell>
  );
}
