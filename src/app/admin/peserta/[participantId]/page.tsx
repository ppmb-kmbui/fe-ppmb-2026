"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { BackButton } from "@/components";
import {
  getAdminNavigationItems,
  SubmissionReviewCard,
  type SubmissionReviewCardProps,
} from "@/components/admin";
import { Header, type HeaderUser } from "@/components/layout/Header";
import { getProfileCached } from "@/lib/auth-api";
import {
  buildSubmissionCards,
  getParticipantTask,
  saveParticipantTaskReview,
  type AdminTaskType,
  type ParticipantTaskResponse,
  type SaveAdminTaskReviewInput,
} from "@/lib/admin-task-api";

export default function AdminParticipantPage() {
  const router = useRouter();
  const { participantId } = useParams<{ participantId: string }>();
  const [adminUser, setAdminUser] = useState<HeaderUser>();
  const [participant, setParticipant] =
    useState<ParticipantTaskResponse["user"] | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionReviewCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadParticipant() {
      setIsLoading(true);
      setError(undefined);

      try {
        const profile = await getProfileCached();
        if (!profile.isAdmin && !profile.isSuperAdmin) {
          router.replace("/");
          return;
        }

        if (!active) return;
        setIsSuperAdmin(profile.isSuperAdmin);
        setAdminUser({
          fullName: profile.fullname ?? "Admin",
          subtitle: profile.isSuperAdmin ? "Superadmin" : "Admin",
          imgUrl: profile.imgUrl,
        });

        const data = await getParticipantTask(participantId);
        if (!active) return;

        setParticipant(data.user);
        setSubmissions(buildSubmissionCards(data));
      } catch {
        if (active) setError("Detail peserta gagal dimuat.");
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadParticipant();

    return () => {
      active = false;
    };
  }, [participantId, router]);

  async function handleSaveReview(
    taskType: AdminTaskType,
    input: SaveAdminTaskReviewInput,
  ) {
    const review = await saveParticipantTaskReview(
      participantId,
      taskType,
      input,
    );

    setSubmissions((current) =>
      current.map((submission) =>
        submission.taskType === taskType
          ? { ...submission, review }
          : submission,
      ),
    );
  }

  const participantName = participant?.fullname ?? "Peserta";

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground">
      <Header
        activeItem="admin"
        mobileNavItems={getAdminNavigationItems(isSuperAdmin)}
        user={adminUser}
        className="relative z-30"
      />

      <main className="relative z-10 min-h-[calc(100svh-86px)] px-4 py-9 md:min-h-[calc(100svh-100px)] md:px-[60px]">
        <div className="flex w-full flex-col gap-8 md:gap-10">
          <BackButton href="/admin" />

          <div className="flex flex-col gap-3">
            <h1 className="bg-[linear-gradient(161.67deg,var(--gradient-header-start)_11.592%,var(--gradient-header-end)_72.166%)] bg-clip-text pb-2 font-heading text-h2 leading-[1.15] text-transparent md:text-h1">
              {participantName}
            </h1>
            {participant && (
              <p className="text-b2 text-foreground/85">
                Angkatan {participant.batch}
                {participant.faculty ? ` • ${participant.faculty}` : ""}
                {participant.email ? ` • ${participant.email}` : ""}
              </p>
            )}
          </div>

          {isLoading && (
            <p className="rounded-2xl bg-blue-200/20 px-4 py-3 text-b2">
              Memuat detail peserta...
            </p>
          )}

          {error && (
            <p className="rounded-2xl bg-red-400/10 px-4 py-3 text-b2 text-red-100">
              {error}
            </p>
          )}

          {!isLoading && !error && (
            <div className="grid w-full gap-5">
              <p className="text-b3 text-foreground/80">
                Telat berarti pengumpulan terakhir setelah 5 September 2026 WIB, termasuk edit.
              </p>
              {submissions.map((submission) => (
                <SubmissionReviewCard
                  key={submission.title}
                  {...submission}
                  onSaveReview={handleSaveReview}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
