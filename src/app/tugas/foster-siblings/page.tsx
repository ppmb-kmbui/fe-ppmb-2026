import { BackButton } from "@/components";

import { FosterSiblingsForm } from "../_components/FosterSiblingsForm";
import { TaskPageShell } from "../_components/TaskPageShell";
import { TaskRightRail } from "../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function FosterSiblingsTaskPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          title="Foster Siblings"
          showCalendar={false}
          progress={{
            label: "Tugas Diperlukan : 1",
            completed: 0,
            total: 1,
          }}
        />
      }
      withConstellation
    >
      <div className="flex max-w-240 flex-col gap-8">
        <BackButton href="/tugas" />
        <GradientTaskTitle>Foster Siblings</GradientTaskTitle>

        <TaskSectionCard>
          <h2 className="font-subheading text-s3 font-semibold">
            Deskripsi Tugas
          </h2>
          <p className="text-b1 max-md:text-b3 leading-snug">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
          </p>

          <FosterSiblingsForm />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
