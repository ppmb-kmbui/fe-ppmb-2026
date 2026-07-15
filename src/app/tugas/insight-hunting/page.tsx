import { BackButton } from "@/components";

import { InsightHuntingForm } from "../_components/InsightHuntingForm";
import { insightAgendaItems } from "../_components/task-page-data";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskProgressRightRail } from "../_components/TaskProgressRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function InsightHuntingTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskProgressRightRail
          progressKey="insightHunting"
          progressLabel="Tugas Diperlukan : 1"
          title="Insight Hunting"
          showCalendar={false}
          agendaHeading="Kegiatan Terdekat"
          showAgendaSubtitle={false}
          agenda={insightAgendaItems}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>Insight Hunting</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription />

          <InsightHuntingForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
