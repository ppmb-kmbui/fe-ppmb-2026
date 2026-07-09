import { SubmissionReviewCard, SubmissionReviewCardProps } from "@/components/admin/SubmissionReviewCard";
import { Header } from "@/components/layout/Header";


const submission: SubmissionReviewCardProps = {
  title: "Asep Kopling",
  status: "submitted",
  media: "",
  answer: "",
  file: { href: "", label: "Testing" },
  answerFirst: true
}

const submissions = Array.from({ length: 4 }, () => submission );

export default function AdminParticipantPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
        <Header user={{ fullName: "Nama Lengkap", subtitle: "Admin" }} />
        <main className="relative z-10 min-h-[calc(100svh-100px)] px-4 py-9 md:px-[60px]">
          <div className="flex w-full flex-col gap-8 md:gap-10">
            <h1 className="bg-[linear-gradient(126deg,var(--gradient-header-start)_0%,var(--gradient-header-end)_100%)] bg-clip-text pb-2 font-heading text-h1 leading-[1.15] text-transparent">
              Jaysen Lestari
            </h1>

            <div className="grid w-full grid-cols-[(auto-fit,minmax(min(100%,450px),1fr))] gap-5">
                { submissions.map((submission) => <SubmissionReviewCard
                  title={submission.title}
                  status={submission.status}
                  media={submission.media}
                  answer={submission.answer}
                  file={submission.file}
                  answerFirst={submission.answerFirst}
                /> )}
            </div>
          </div>
        </main>
      </div>
      <div className="block md:hidden"></div>
    </>
  );
}
