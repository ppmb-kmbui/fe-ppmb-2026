import { BackButton } from "@/components";

import { mentoringAgendaItems } from "../../_components/task-page-data";
import { CommitteeVideosClient } from "../../_components/CommitteeVideosClient";
import { TaskPageShell } from "../../_components/TaskPageShell";
import { TaskRightRail } from "../../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../../_components/TaskTypography";

export default function CommitteeVideoCollectionPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          title="Video Panitia"
          showCalendar={false}
          agenda={mentoringAgendaItems}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas/mentoring" />
        <GradientTaskTitle>Kumpulan Video dari Panitia</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription>
            Tugas Mentoring merupakan rangkaian tugas yang dikerjakan secara
            berkelompok selama periode mentoring. Tugas ini terdiri dari A
            Series of Memories (Vlog Mentoring 1–3) dan Unlock the Pieces
            (tugas yang akan dipecahkan pada sesi Mentoring 2).
          </TaskDescription>
          <CommitteeVideosClient />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
