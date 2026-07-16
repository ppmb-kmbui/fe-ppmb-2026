import { notFound } from "next/navigation";

import { BackButton } from "@/components";

import { NetworkingSubmissionForm } from "../../_components/NetworkingSubmissionForm";
import { NetworkingSubmissionRightRail } from "../../_components/NetworkingSubmissionRightRail";
import {
  getNetworkingRequirement,
  resolveNetworkingSegment,
} from "../../_components/networking-requirements";
import { TaskPageShell } from "../../_components/TaskPageShell";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../../_components/TaskTypography";

export default async function NetworkingSubmissionPage({
  params,
}: {
  params: Promise<{ batch: string }>;
}) {
  const { batch } = await params;
  const segment = resolveNetworkingSegment(batch);

  if (!segment) {
    notFound();
  }

  const requirement = getNetworkingRequirement(segment);

  return (
    <TaskPageShell
      rightRail={<NetworkingSubmissionRightRail segment={segment} />}
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas/networking" />
        <div className="flex flex-col gap-1">
          <p className="font-heading text-h4 text-yellow-500">Networking</p>
          <GradientTaskTitle>{requirement.title}</GradientTaskTitle>
        </div>

        <TaskSectionCard>
          <TaskDescription>
            Tugas Networking adalah tugas yang bertujuan untuk membangun dan
            memperluas relasi mahasiswa baru angkatan 2026 dengan teman
            seangkatan maupun kakak tingkat.
          </TaskDescription>
          <NetworkingSubmissionForm segment={segment} />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
