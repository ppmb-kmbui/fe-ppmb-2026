"use client";

import type { TaskSummary } from "@/lib/task-api";

import {
  getNetworkingRequirement,
  type NetworkingSegment,
} from "./networking-requirements";
import { TaskRightRail } from "./TaskRightRail";
import { useTaskSummary } from "./useTaskSummary";

function getCompleted(summary: TaskSummary | undefined, segment: NetworkingSegment) {
  if (!summary) return 0;
  const requirement = getNetworkingRequirement(segment);
  const submission = summary.networkingSubmission;
  return submission?.[requirement.field] || submission?.[requirement.summaryField]
    ? 1
    : 0;
}

export function NetworkingSubmissionRightRail({
  segment,
}: {
  segment: NetworkingSegment;
}) {
  const { summary } = useTaskSummary("Memuat progres networking...");
  const requirement = getNetworkingRequirement(segment);

  return (
    <TaskRightRail
      title="Progres Networking"
      showCalendar={false}
      progress={{
        label: requirement.label,
        completed: getCompleted(summary, segment),
        total: requirement.total,
      }}
      agendaHeading="Kegiatan Terdekat"
      showAgendaSubtitle={false}
      agenda={[
        {
          category: requirement.category,
          title: requirement.deadlineTitle,
          date: requirement.deadlineDate,
          icon: "networking",
        },
      ]}
    />
  );
}
