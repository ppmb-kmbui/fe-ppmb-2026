import { BackButton } from "@/components";

import { KmbuiExplorerForm } from "../_components/KmbuiExplorerForm";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskRightRail } from "../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function KmbuiExplorerTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          title="Progres Exploration"
          showCalendar={false}
          progress={{
            label: "Kegiatan Dibutuhkan : 1",
            completed: 0,
            total: 1,
          }}
          agendaHeading="Kegiatan Terdekat"
          agenda={[
            {
              category: "KMBUI Explorer",
              title: "Puja Rutin",
              date: "15 Juni",
            },
          ]}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>KMBUI Explorer</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription />

          <KmbuiExplorerForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
