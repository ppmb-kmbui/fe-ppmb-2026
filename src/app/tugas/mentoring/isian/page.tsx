import { BackButton } from "@/components";

import { MentoringIsianForm } from "../../_components/MentoringIsianForm";
import { TaskPageShell } from "../../_components/TaskPageShell";
import { TaskRightRail } from "../../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../../_components/TaskTypography";

export default function MentoringIsianPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          title="Tugas Mentoring"
          showCalendar={false}
          progress={{
            label: "Tugas Diperlukan : 1",
            completed: 0,
            total: 1,
          }}
          agenda={[
            {
              category: "Mentoring",
              title: "Tugas Vlog",
              date: "13 Juni",
            },
          ]}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas/mentoring" />
        <GradientTaskTitle>Mentoring</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription />

          <MentoringIsianForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
