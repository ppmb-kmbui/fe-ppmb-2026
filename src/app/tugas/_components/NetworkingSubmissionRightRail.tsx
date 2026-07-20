"use client";

import { useEffect, useState } from "react";

import {
  getNetworkingOverview,
  getTaskApiErrorMessage,
  TASK_SUMMARY_INVALIDATED_EVENT,
  type NetworkingProgress,
} from "@/lib/task-api";

import {
  NETWORKING_BATCH_REQUIREMENTS,
  NETWORKING_TOTAL_REQUIRED,
} from "./networking-requirements";
import { TaskRightRail } from "./TaskRightRail";

export function NetworkingSubmissionRightRail() {
  const [progress, setProgress] = useState<NetworkingProgress>();
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProgress = () => {
      getNetworkingOverview()
        .then((data) => {
          if (active) {
            setProgress(data?.progress);
            setLoadError("");
          }
        })
        .catch((error: unknown) => {
          if (!active) return;
          setProgress(undefined);
          setLoadError(
            getTaskApiErrorMessage(error) ||
              "Progres Networking belum dapat dimuat. Silakan coba lagi.",
          );
        });
    };

    loadProgress();
    window.addEventListener(TASK_SUMMARY_INVALIDATED_EVENT, loadProgress);

    return () => {
      active = false;
      window.removeEventListener(TASK_SUMMARY_INVALIDATED_EVENT, loadProgress);
    };
  }, []);

  if (!progress) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-h3 text-yellow-500">
          Progres Networking
        </h2>
        <p
          role={loadError ? "alert" : "status"}
          className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2 text-foreground/85"
        >
          {loadError || "Memuat progres Networking..."}
        </p>
      </div>
    );
  }

  const completed = Math.min(
    Math.max(progress.completed, 0),
    NETWORKING_TOTAL_REQUIRED,
  );
  const progressItems = [
    {
      label: "Total teman",
      completed,
      total: NETWORKING_TOTAL_REQUIRED,
    },
    ...NETWORKING_BATCH_REQUIREMENTS.map((requirement) => ({
      label: `Angkatan ${requirement.batch}`,
      completed: Math.min(
        Math.max(
          progress.byBatch[String(requirement.batch)]?.completed ?? 0,
          0,
        ),
        requirement.required,
      ),
      total: requirement.required,
    })),
  ];

  return (
    <TaskRightRail
      title="Progres Networking"
      showCalendar={false}
      progressItems={progressItems}
      agendaHeading="Kegiatan Terdekat"
      showAgendaSubtitle={false}
      agenda={[
        {
          category: "Networking",
          title: "Batas Waktu Tugas",
          date: "31 Agustus",
          icon: "networking",
        },
      ]}
    />
  );
}
