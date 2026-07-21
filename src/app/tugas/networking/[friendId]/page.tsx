import { notFound } from "next/navigation";

import { BackButton } from "@/components";

import { NetworkingSubmissionForm } from "../../_components/NetworkingSubmissionForm";
import { NetworkingSubmissionRightRail } from "../../_components/NetworkingSubmissionRightRail";
import { NetworkingAccessGate } from "../../_components/NetworkingAccessGate";
import { TaskPageShell } from "../../_components/TaskPageShell";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../../_components/TaskTypography";

export default async function NetworkingFriendPage({
  params,
}: {
  params: Promise<{ friendId: string }>;
}) {
  const { friendId: friendIdParam } = await params;
  const friendId = Number(friendIdParam);

  if (!Number.isSafeInteger(friendId) || friendId < 1) {
    notFound();
  }

  return (
    <NetworkingAccessGate>
      <TaskPageShell
        rightRail={<NetworkingSubmissionRightRail />}
        mobileRailLabel="Progres"
        withConstellation
      >
        <div className="flex max-w-[958px] flex-col gap-8">
          <BackButton href="/kalyanamitta" />
          <div className="flex flex-col gap-1">
            <p className="font-heading text-h4 text-yellow-500">Networking</p>
            <GradientTaskTitle>Kenali Temanmu</GradientTaskTitle>
          </div>

          <TaskSectionCard>
            <TaskDescription>
              Isi satu formulir untuk setiap peserta yang dipilih. Pertanyaan
              akan disesuaikan untuk teman seangkatan atau kakak tingkat dan
              dapat diperbarui sampai batas waktu pengumpulan.
            </TaskDescription>
            <NetworkingSubmissionForm friendId={friendId} />
          </TaskSectionCard>
        </div>
      </TaskPageShell>
    </NetworkingAccessGate>
  );
}
