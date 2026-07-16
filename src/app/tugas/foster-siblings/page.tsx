import { BackButton } from "@/components";

import { FosterSiblingsForm } from "../_components/FosterSiblingsForm";
import { fosterSiblingsAgendaItems } from "../_components/task-page-data";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskProgressRightRail } from "../_components/TaskProgressRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function FosterSiblingsTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskProgressRightRail
          progressKey="fosterSiblings"
          progressLabel="Tugas Diperlukan : 1"
          title="Foster Siblings"
          showCalendar={false}
          agendaHeading="Kegiatan Terdekat"
          showAgendaSubtitle={false}
          agenda={fosterSiblingsAgendaItems}
        />
      }
      withConstellation
    >
      <div className="flex max-w-240 flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>Foster Siblings</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription>
            Tugas Foster Sibling adalah tugas yang bertujuan untuk membangun
            kedekatan dengan kakak asuhmu melalui sesi perkenalan yang hangat
            dan bermakna. Kenali cerita, pengalaman, serta berbagai hal menarik
            tentang kakak asuh sebagai awal dari hubungan yang saling mendukung
            selama perjalananmu di KMBUI.
          </TaskDescription>

          <FosterSiblingsForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
