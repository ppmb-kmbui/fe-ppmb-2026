"use client";

import { useMemo } from "react";

import type { TaskSummary } from "@/lib/task-api";

import { ActionQuotaCard } from "./ActionQuotaCard";
import {
  getNetworkingRequirement,
  networkingSegments,
  type NetworkingSegment,
} from "./networking-requirements";
import { useTaskSummary } from "./useTaskSummary";

interface NetworkingQuota {
  label: string;
  completed: number;
  total: number;
  href: string;
}

function buildNetworkingQuotas(summary?: TaskSummary): NetworkingQuota[] {
  return (Object.keys(networkingSegments) as NetworkingSegment[]).map((segment) => {
    const requirement = getNetworkingRequirement(segment);
    const submission = summary?.networkingSubmission;
    const submitted = Boolean(
      submission?.[requirement.field] ||
        submission?.[requirement.summaryField],
    );

    return {
      label: requirement.label,
      completed: submitted ? 1 : 0,
      total: requirement.total,
      href: `/tugas/networking/${segment}`,
    };
  });
}

export function NetworkingProgressClient() {
  const { summary, statusMessage } = useTaskSummary(
    "Memuat progres networking...",
  );
  const quotas = useMemo(() => buildNetworkingQuotas(summary), [summary]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-h3 text-yellow-500">
          Progres Networking
        </h2>
        <p className="text-b2 text-foreground/80">
          Setiap kategori networking membutuhkan satu link Google Docs.
        </p>
      </div>

      {statusMessage && (
        <p className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2 text-foreground/85">
          {statusMessage}
        </p>
      )}

      <div className="flex flex-col gap-5">
        {quotas.map((quota) => (
          <ActionQuotaCard key={quota.label} {...quota} />
        ))}
      </div>
    </section>
  );
}
