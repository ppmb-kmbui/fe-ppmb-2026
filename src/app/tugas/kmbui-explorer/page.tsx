import { BackButton } from "@/components";

import { KmbuiExplorerForm } from "../_components/KmbuiExplorerForm";
import { explorerAgendaItems } from "../_components/task-page-data";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskProgressRightRail } from "../_components/TaskProgressRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function KmbuiExplorerTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskProgressRightRail
          progressKey="explorer"
          progressLabel="Kegiatan Dibutuhkan : 1"
          title="Progres Exploration"
          showCalendar={false}
          agendaHeading="Kegiatan Terdekat"
          showAgendaSubtitle={false}
          agenda={explorerAgendaItems}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>KMBUI Explorer</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription>
            Saatnya mengenal KMBUI lebih dekat! Tugas KMBUI Explorer adalah
            tugas untuk mengunjungi dan menjelajahi berbagai program kerja dan
            kegiatan KMBUI secara langsung. Melalui setiap kunjungan, kamu akan
            mengenal lebih dekat budaya organisasi, berinteraksi dengan para
            anggota, serta merasakan pengalaman menjadi bagian dari keluarga
            KMBUI.
          </TaskDescription>

          <KmbuiExplorerForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
