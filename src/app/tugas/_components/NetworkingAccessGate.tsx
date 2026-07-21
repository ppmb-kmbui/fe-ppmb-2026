"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { BackButton, DashboardPageLayout } from "@/components";
import {
  getCachedProfileSnapshot,
  getProfileCached,
} from "@/lib/auth-api";

import { isNetworkingViewerBatch } from "./networking-requirements";

type AccessStatus = "checking" | "allowed" | "denied" | "error";

function getInitialStatus(): AccessStatus {
  const profile = getCachedProfileSnapshot();
  if (!profile) return "checking";
  return isNetworkingViewerBatch(profile.batch) ? "allowed" : "denied";
}

export function NetworkingAccessGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AccessStatus>(getInitialStatus);

  useEffect(() => {
    if (status !== "checking") return;

    let active = true;
    getProfileCached()
      .then((profile) => {
        if (!active) return;
        setStatus(
          isNetworkingViewerBatch(profile.batch) ? "allowed" : "denied",
        );
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [status]);

  if (status === "allowed") return children;

  return (
    <DashboardPageLayout activeItem="tasks" rightRail={null}>
      <main className="flex min-h-[60svh] max-w-[760px] flex-col gap-8">
        <BackButton href="/tugas" />
        <h1 className="font-heading text-h2 text-yellow-500">Networking</h1>
        <p
          role={status === "error" ? "alert" : "status"}
          className="rounded-2xl border border-white/10 bg-blue-200/20 px-5 py-4 text-b2"
        >
          {status === "checking"
            ? "Memeriksa akses Networking..."
            : status === "denied"
              ? "Fitur Networking hanya tersedia untuk peserta angkatan 2026."
              : "Akses Networking belum dapat diperiksa. Silakan muat ulang halaman."}
        </p>
      </main>
    </DashboardPageLayout>
  );
}
