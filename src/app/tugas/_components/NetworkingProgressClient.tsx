"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getCachedTaskSummarySnapshot,
  getTaskApiErrorMessage,
  getTaskSummaryCached,
  type TaskSummary,
} from "@/lib/task-api";

import { ActionQuotaCard } from "./ActionQuotaCard";
import {
  networkingRequirements,
  type NetworkingBatch,
} from "./networking-requirements";

interface NetworkingQuota {
  label: string;
  completed: number;
  total: number;
  href: string;
}

function buildNetworkingQuotas(summary?: TaskSummary): NetworkingQuota[] {
  return (Object.keys(networkingRequirements) as NetworkingBatch[]).map((batch) => {
    const requirement = networkingRequirements[batch];
    const progress =
      batch === "2026"
        ? summary?.networkingAngkatan.byBatch[batch]
        : summary?.networkingKating.progress[batch];

    return {
      label: requirement.label,
      completed: progress?.progress ?? 0,
      total: requirement.total,
      href: `/tugas/networking/${batch}`,
    };
  });
}

export function NetworkingProgressClient() {
  const [summary, setSummary] = useState<TaskSummary | undefined>(() =>
    getCachedTaskSummarySnapshot() ?? undefined,
  );
  const [statusMessage, setStatusMessage] = useState(() =>
    getCachedTaskSummarySnapshot() ? "" : "Memuat progres networking...",
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

  const quotas = useMemo(() => buildNetworkingQuotas(summary), [summary]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-h3 text-yellow-500">
          Progres Networking
        </h2>
        <p className="text-b2 text-foreground/80">
          Data progres diambil dari backend. Tombol Kerjakan mengarah ke halaman
          submission sesuai angkatan.
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
