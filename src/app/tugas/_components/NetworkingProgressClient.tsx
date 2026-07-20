"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ProgressBar } from "@/components";
import {
  getNetworkingOverview,
  getTaskApiErrorMessage,
  type NetworkingOverviewData,
} from "@/lib/task-api";

import { ActionQuotaCard } from "./ActionQuotaCard";
import {
  NETWORKING_BATCH_REQUIREMENTS,
  NETWORKING_TOTAL_REQUIRED,
} from "./networking-requirements";

function clampProgress(value: number | undefined, required: number) {
  return Math.min(Math.max(value ?? 0, 0), required);
}

export function NetworkingProgressClient() {
  const [overview, setOverview] = useState<NetworkingOverviewData>();
  const [statusMessage, setStatusMessage] = useState(
    "Memuat progres Networking...",
  );

  useEffect(() => {
    let active = true;

    getNetworkingOverview()
      .then((data) => {
        if (!active) return;
        setOverview(data);
        setStatusMessage("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatusMessage(
          getTaskApiErrorMessage(error) ||
            "Progres Networking belum dapat dimuat. Silakan coba lagi.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const quotas = useMemo(
    () =>
      NETWORKING_BATCH_REQUIREMENTS.map((requirement) => ({
        label: requirement.label,
        completed: clampProgress(
          overview?.progress.byBatch[String(requirement.batch)]?.completed,
          requirement.required,
        ),
        total: requirement.required,
        href: "/kalyanamitta?tab=connected",
      })),
    [overview],
  );
  const completed = quotas.reduce(
    (total, requirement) => total + requirement.completed,
    0,
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-h3 text-yellow-500">
          Progres Networking
        </h2>
        <p className="text-b2 text-foreground/80">
          Selesaikan sesi bersama 18 teman yang sudah terhubung. Setiap teman
          memerlukan jawaban lengkap dan satu foto dokumentasi.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-purple-950/20 p-5">
        <div className="flex items-center justify-between gap-4 text-b2">
          <span>Total progres</span>
          <span className="font-subheading text-s5 text-yellow-100">
            {completed}/{NETWORKING_TOTAL_REQUIRED}
          </span>
        </div>
        <ProgressBar
          value={completed}
          max={NETWORKING_TOTAL_REQUIRED}
          label="Total progres Networking"
          glow
          className="mt-3"
        />
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

      <Link
        href="/kalyanamitta?tab=connected"
        className="inline-flex min-h-[50px] w-fit items-center justify-center rounded-2xl bg-primary px-6 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover"
      >
        Buka Teman Saya
      </Link>
    </section>
  );
}
