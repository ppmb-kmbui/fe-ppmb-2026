"use client";

import { useEffect, useState } from "react";

import {
  getCachedTaskSummarySnapshot,
  getTaskSummaryCached,
  type TaskSummary,
} from "@/lib/task-api";

import {
  getNetworkingRequirement,
  type NetworkingBatch,
} from "./networking-requirements";
import { TaskRightRail } from "./TaskRightRail";

function getCompleted(summary: TaskSummary | undefined, batch: NetworkingBatch) {
  if (!summary) return 0;

  if (batch === "2026") {
    return summary.networkingAngkatan.byBatch[batch]?.progress ?? 0;
  }

  return summary.networkingKating.progress[batch]?.progress ?? 0;
}

export function NetworkingSubmissionRightRail({
  batch,
}: {
  batch: NetworkingBatch;
}) {
  const [summary, setSummary] = useState<TaskSummary | undefined>(() =>
    getCachedTaskSummarySnapshot() ?? undefined,
  );
  const requirement = getNetworkingRequirement(batch);

  useEffect(() => {
    let active = true;

    getTaskSummaryCached()
      .then((data) => {
        if (active) setSummary(data);
      })
      .catch(() => {
        if (active) setSummary(getCachedTaskSummarySnapshot() ?? undefined);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <TaskRightRail
      title="Progres Networking"
      showCalendar={false}
      progress={{
        label: `${requirement.label} : ${requirement.total}`,
        completed: getCompleted(summary, batch),
        total: requirement.total,
      }}
      agendaHeading="Kegiatan Terdekat"
      agenda={[
        {
          category: requirement.category,
          title: requirement.deadlineTitle,
          date: requirement.deadlineDate,
        },
      ]}
    />
  );
}
