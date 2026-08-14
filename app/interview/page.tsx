import { PageShell } from "@/components/layout/shell";
import { InterviewRoom } from "@/components/interview/interview-room";
import { LESSONS } from "@/lib/data";

export const metadata = { title: "Interview Simulator — InterviewVerse" };

export default function InterviewPage() {
  // Pass only the fields the simulator needs — keeps the page payload tiny.
  const items = LESSONS.map((l) => ({
    title: l.title,
    interviewQuestion: l.interviewQuestion,
    interviewAnswerDetailed: l.interviewAnswerDetailed,
    followUps: l.followUps,
  }));
  return (
    <PageShell footer={false}>
      <InterviewRoom lessons={items} />
    </PageShell>
  );
}
