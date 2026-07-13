import { BackButton } from "@/components";

import { InsightHuntingForm } from "../_components/InsightHuntingForm";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskRightRail } from "../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function InsightHuntingTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          title="Insight Hunting"
          showCalendar={false}
          progress={{
            label: "Tugas Diperlukan : 1",
            completed: 0,
            total: 1,
          }}
          agendaHeading="Kegiatan Terdekat"
          agenda={[
            {
              category: "Insight Hunting",
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
        <GradientTaskTitle>Insight Hunting</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription />

          <InsightHuntingForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
