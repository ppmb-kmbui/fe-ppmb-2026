"use client";

import { SubmissionReviewCard, SubmissionReviewCardProps } from "@/components/admin/SubmissionReviewCard";
import { Header } from "@/components/layout/Header";
import { useState, useEffect } from "react";
import { MobileAdminPage } from "@/components/admin/MobileAdminPage";
import { useParams } from "next/navigation";
import {
  getParticipantTask,
  buildSubmissionCards,
  ParticipantTaskResponse,
} from "@/lib/admin-task-api";

export default function AdminParticipantPage() {
  const { participantId } = useParams<{
    participantId: string;
  }>();

  const [participant, setParticipant] =
    useState<ParticipantTaskResponse["user"] | null>(null);

  const [submissions, setSubmissions] =
    useState<SubmissionReviewCardProps[]>([]);

  useEffect(() => {
  async function loadParticipant() {
    try {
      const data = await getParticipantTask(participantId);
      
      setParticipant(data.user);

      setSubmissions(buildSubmissionCards(data));
    } catch (error) {
      console.error(error);
    }
  }

  void loadParticipant();
}, [participantId]);

  if (!participant) {
      return <>Loading...</>;
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
        <Header user={{ fullName: "Nama Lengkap", subtitle: "Admin" }} />
        <main className="relative z-10 min-h-[calc(100svh-100px)] px-4 py-9 md:px-[60px]">
          <div className="flex w-full flex-col gap-8 md:gap-10">
            <h1 className="bg-[linear-gradient(161.67deg,var(--gradient-header-start)_11.592%,var(--gradient-header-end)_72.166%)] bg-clip-text pb-2 font-heading text-h1 leading-[1.15] text-transparent">
              {participant?.fullname ?? "Loading..."}
            </h1>

            <div className="grid w-full grid-cols-[(auto-fit,minmax(min(100%,450px),1fr))] gap-5">
                { submissions.map((submission) => <SubmissionReviewCard
                  key={submission.title}
                  {...submission}
                /> )}
            </div>
          </div>
        </main>
      </div>
      <MobileAdminPage />
    </>
  );
}
