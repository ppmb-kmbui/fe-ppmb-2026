import { TaskPageShell } from "./_components/TaskPageShell";
import { TaskRightRail } from "./_components/TaskRightRail";
import { TasksOverviewClient } from "./_components/TasksOverviewClient";
import { GradientTaskTitle } from "./_components/TaskTypography";

export default function TasksPage() {
  const rightRail = <TaskRightRail />;

  return (
    <TaskPageShell
      rightRail={rightRail}
      mobileRightRail={
        <TaskRightRail showDateHeader={false} showCalendar={false} />
      }
      mobileRailLabel="Tenggat"
      mainClassName="md:pt-9"
    >
      <div className="flex max-w-[924px] flex-col gap-8 pr-[112px] md:pr-0">
        <GradientTaskTitle>Tugas</GradientTaskTitle>

        <TasksOverviewClient />
      </div>
    </TaskPageShell>
  );
}
