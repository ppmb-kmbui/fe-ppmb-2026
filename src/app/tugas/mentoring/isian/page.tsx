import { BackButton } from "@/components";

import { MentoringIsianForm } from "../../_components/MentoringIsianForm";
import { mentoringAgendaItems } from "../../_components/task-page-data";
import { TaskPageShell } from "../../_components/TaskPageShell";
import { TaskProgressRightRail } from "../../_components/TaskProgressRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../../_components/TaskTypography";

export default function MentoringIsianPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskProgressRightRail
          progressKey="mentoring"
          progressLabel="Tugas Diperlukan : 1"
          title="Tugas Mentoring"
          showCalendar={false}
          agenda={mentoringAgendaItems}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas/mentoring" />
        <GradientTaskTitle>Mentoring</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription>
            Tugas Mentoring merupakan rangkaian tugas yang dikerjakan secara
            berkelompok selama periode mentoring. Tugas ini terdiri dari A
            Series of Memories (Vlog Mentoring 1–3) dan Unlock the Pieces
            (tugas yang akan dipecahkan pada sesi Mentoring 2).
          </TaskDescription>

          <MentoringIsianForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
