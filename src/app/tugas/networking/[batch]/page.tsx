import { notFound } from "next/navigation";

import { BackButton } from "@/components";

import { NetworkingSubmissionForm } from "../../_components/NetworkingSubmissionForm";
import { NetworkingSubmissionRightRail } from "../../_components/NetworkingSubmissionRightRail";
import {
  getNetworkingRequirement,
  isNetworkingBatch,
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

  if (!isNetworkingBatch(batch)) {
    notFound();
  }

  const requirement = getNetworkingRequirement(batch);

  return (
    <TaskPageShell
      rightRail={<NetworkingSubmissionRightRail batch={batch} />}
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas/networking" />
        <GradientTaskTitle>{requirement.title}</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription />
          <NetworkingSubmissionForm batch={batch} />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
