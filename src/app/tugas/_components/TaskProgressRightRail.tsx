"use client";

import type { TaskSummary } from "@/lib/task-api";

import { TaskRightRail, type TaskRightRailProps } from "./TaskRightRail";
import { useTaskSummary } from "./useTaskSummary";

type TaskProgressKey = keyof TaskSummary["cards"];

export interface TaskProgressRightRailProps
  extends Omit<TaskRightRailProps, "progress"> {
  progressKey: TaskProgressKey;
  progressLabel: string;
  fallbackTotal?: number;
}

export function TaskProgressRightRail({
  progressKey,
  progressLabel,
  fallbackTotal = 1,
  ...props
}: TaskProgressRightRailProps) {
  const { summary } = useTaskSummary();
  const card = summary?.cards[progressKey];
  const completed = card?.completed ?? 0;
  const total = card?.required ?? fallbackTotal;

  return (
    <TaskRightRail
      {...props}
      progress={{
        label: progressLabel,
        completed,
        total,
      }}
    />
  );
}
