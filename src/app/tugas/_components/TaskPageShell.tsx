import type { ReactNode } from "react";

import { DashboardPageLayout } from "@/components";

import { dashboardUser } from "./task-page-data";
import { TaskConstellationBackground } from "./TaskConstellationBackground";

export interface TaskPageShellProps {
  children: ReactNode;
  rightRail: ReactNode;
  withConstellation?: boolean;
  mainClassName?: string;
}

export function TaskPageShell({
  children,
  rightRail,
  withConstellation = false,
  mainClassName,
}: TaskPageShellProps) {
  return (
    <DashboardPageLayout
      activeItem="tasks"
      user={dashboardUser}
      rightRail={rightRail}
      background={withConstellation ? <TaskConstellationBackground /> : undefined}
      mainClassName={mainClassName}
      rightRailClassName="xl:min-h-[calc(100svh-100px)]"
    >
      {children}
    </DashboardPageLayout>
  );
}

