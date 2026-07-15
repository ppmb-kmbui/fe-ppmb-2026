import type { ReactNode } from "react";

import { DashboardPageLayout } from "@/components";

import { TaskConstellationBackground } from "./TaskConstellationBackground";
import { TaskMobileRightRail } from "./TaskMobileRightRail";

export interface TaskPageShellProps {
  children: ReactNode;
  rightRail: ReactNode;
  mobileRightRail?: ReactNode;
  mobileRailLabel?: string;
  withConstellation?: boolean;
  mainClassName?: string;
}

export function TaskPageShell({
  children,
  rightRail,
  mobileRightRail,
  mobileRailLabel,
  withConstellation = false,
  mainClassName,
}: TaskPageShellProps) {
  return (
    <DashboardPageLayout
      activeItem="tasks"
      rightRail={rightRail}
      background={withConstellation ? <TaskConstellationBackground /> : undefined}
      mainClassName={mainClassName}
      rightRailClassName="hidden md:block xl:min-h-[calc(100svh-100px)]"
    >
      <div className="relative">
        <TaskMobileRightRail
          label={mobileRailLabel}
          className="absolute right-0 top-0 z-20"
        >
          {mobileRightRail ?? rightRail}
        </TaskMobileRightRail>
        {children}
      </div>
    </DashboardPageLayout>
  );
}
