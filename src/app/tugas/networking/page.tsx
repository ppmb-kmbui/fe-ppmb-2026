import { BackButton } from "@/components";

import { NetworkingProgressClient } from "../_components/NetworkingProgressClient";
import { networkingAgendaItems } from "../_components/task-page-data";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskRightRail } from "../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function NetworkingTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          showDateHeader={false}
          showCalendar={false}
          agenda={networkingAgendaItems}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>Networking</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription>
            Tugas Networking adalah tugas yang bertujuan untuk membangun dan
            memperluas relasi mahasiswa baru angkatan 2026 dengan teman
            seangkatan maupun kakak tingkat.
          </TaskDescription>
        </TaskSectionCard>

        <NetworkingProgressClient />
      </div>
    </TaskPageShell>
  );
}
