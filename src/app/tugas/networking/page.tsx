import { BackButton } from "@/components";

import { NetworkingProgressClient } from "../_components/NetworkingProgressClient";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskRightRail } from "../_components/TaskRightRail";
import { GradientTaskTitle } from "../_components/TaskTypography";

export default function NetworkingTaskPage() {
  return (
    <TaskPageShell rightRail={<TaskRightRail />} withConstellation>
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>Networking</GradientTaskTitle>

        <NetworkingProgressClient />
      </div>
    </TaskPageShell>
  );
}
