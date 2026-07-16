"use client";

import { useMemo } from "react";

import { TaskCard } from "@/components";
import type { TaskSummary } from "@/lib/task-api";

import { taskCards } from "./task-page-data";
import { getTaskIcon, type TaskIconKey } from "./task-icons";
import { useTaskSummary } from "./useTaskSummary";

function getProgressByTitle(summary?: TaskSummary) {
  if (!summary) return new Map<string, number>();

  return new Map([
    ["Networking", summary.cards.networking.percentage],
    ["Insight Hunting", summary.cards.insightHunting?.percentage ?? (summary.insightHuntingDone ? 100 : 0)],
    ["KMBUI Explorer", summary.cards.explorer.percentage],
    ["Mentoring", summary.cards.mentoring.percentage],
    ["Foster Siblings", summary.cards.fosterSiblings.percentage],
  ]);
}

export function TasksOverviewClient() {
  const { summary, statusMessage } = useTaskSummary("Memuat progres tugas...");
  const progressByTitle = useMemo(() => getProgressByTitle(summary), [summary]);

  return (
    <div className="flex flex-col gap-4">
      {statusMessage && (
        <p className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2 text-foreground/85">
          {statusMessage}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {taskCards.map((task) => (
          <TaskCard
            key={task.title}
            title={task.title}
            progress={progressByTitle.get(task.title) ?? 0}
            href={task.href}
            icon={getTaskIcon(
              task.icon as TaskIconKey | undefined,
              "size-20 md:size-[180px]",
            )}
          />
        ))}
      </div>
    </div>
  );
}
