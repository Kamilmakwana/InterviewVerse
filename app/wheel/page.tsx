import { PageShell } from "@/components/layout/shell";
import { QuestionWheel } from "@/components/features/question-wheel";

export const metadata = { title: "Question Wheel — InterviewVerse" };

export default function WheelPage() {
  return (
    <PageShell footer={false}>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">Question Wheel</h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Not sure what to study? Give it a spin and let fate pick your next question.
        </p>
      </div>
      <QuestionWheel />
    </PageShell>
  );
}
