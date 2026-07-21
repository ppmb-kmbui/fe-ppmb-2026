"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { BackButton, DashboardPageLayout } from "@/components";
import {
  getCachedProfileSnapshot,
  getProfileCached,
} from "@/lib/auth-api";

type AccessStatus = "checking" | "allowed" | "denied" | "error";

function getInitialStatus(): AccessStatus {
  const profile = getCachedProfileSnapshot();
  if (!profile) return "checking";
  return profile.batch === 2026 && !profile.isAdmin ? "allowed" : "denied";
}

export function TaskAccessGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AccessStatus>(getInitialStatus);

  useEffect(() => {
    if (status !== "checking") return;

    let active = true;
    getProfileCached()
      .then((profile) => {
        if (active) {
          setStatus(
            profile.batch === 2026 && !profile.isAdmin ? "allowed" : "denied",
          );
        }
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
    <DashboardPageLayout activeItem="home" rightRail={null}>
      <main className="flex min-h-[60svh] max-w-[760px] flex-col gap-8">
        <BackButton href="/" />
        <h1 className="font-heading text-h2 text-yellow-500">Tugas PPMB</h1>
        <p
          role={status === "error" ? "alert" : "status"}
          className="rounded-2xl border border-white/10 bg-blue-200/20 px-5 py-4 text-b2"
        >
          {status === "checking"
            ? "Memeriksa akses tugas..."
            : status === "denied"
              ? "Halaman tugas hanya tersedia untuk peserta angkatan 2026."
              : "Akses tugas belum dapat diperiksa. Silakan muat ulang halaman."}
        </p>
      </main>
    </DashboardPageLayout>
  );
}
