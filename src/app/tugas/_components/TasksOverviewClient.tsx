"use client";

import { useEffect, useMemo, useState } from "react";

import { TaskCard } from "@/components";
import {
  getCachedTaskSummarySnapshot,
  getTaskApiErrorMessage,
  getTaskSummaryCached,
  type TaskSummary,
} from "@/lib/task-api";

import { taskCards } from "./task-page-data";

function getProgressByTitle(summary?: TaskSummary) {
  if (!summary) return new Map<string, number>();

  return new Map([
    ["Networking", summary.cards.networking.percentage],
    ["Insight Hunting", summary.insightHuntingDone ? 100 : 0],
    ["KMBUI Explorer", summary.cards.explorer.percentage],
    ["Mentoring", summary.cards.mentoring.percentage],
    ["Foster Siblings", summary.cards.fosterSiblings.percentage],
  ]);
}

export function TasksOverviewClient() {
  const [summary, setSummary] = useState<TaskSummary | undefined>(() =>
    getCachedTaskSummarySnapshot() ?? undefined,
  );
  const [statusMessage, setStatusMessage] = useState(() =>
    getCachedTaskSummarySnapshot() ? "" : "Memuat progres tugas...",
  );

  useEffect(() => {
    let active = true;

    getTaskSummaryCached()
      .then((data) => {
        if (!active) return;
        setSummary(data);
        setStatusMessage("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatusMessage(getTaskApiErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, []);

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
            progress={progressByTitle.get(task.title) ?? task.progress}
            href={task.href}
          />
        ))}
      </div>
    </div>
  );
}
