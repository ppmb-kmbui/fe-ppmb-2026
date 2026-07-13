import { TaskPageShell } from "./_components/TaskPageShell";
import { TaskRightRail } from "./_components/TaskRightRail";
import { TasksOverviewClient } from "./_components/TasksOverviewClient";
import { GradientTaskTitle } from "./_components/TaskTypography";

export default function TasksPage() {
  return (
    <TaskPageShell rightRail={<TaskRightRail />} mainClassName="md:pt-9">
      <div className="flex max-w-[924px] flex-col gap-8">
        <GradientTaskTitle>Tugas</GradientTaskTitle>

        <TasksOverviewClient />
      </div>
    </TaskPageShell>
  );
}
