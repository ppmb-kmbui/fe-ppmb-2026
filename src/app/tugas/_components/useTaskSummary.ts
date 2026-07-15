"use client";

import { useEffect, useState } from "react";

import {
  getCachedTaskSummarySnapshot,
  getTaskApiErrorMessage,
  getTaskSummaryCached,
  TASK_SUMMARY_INVALIDATED_EVENT,
  type TaskSummary,
} from "@/lib/task-api";

export function useTaskSummary(loadingMessage = "Memuat progres tugas...") {
  const [summary, setSummary] = useState<TaskSummary | undefined>(() =>
    getCachedTaskSummarySnapshot() ?? undefined,
  );
  const [statusMessage, setStatusMessage] = useState(() =>
    getCachedTaskSummarySnapshot() ? "" : loadingMessage,
  );

  useEffect(() => {
    let active = true;

    function loadSummary() {
      if (!getCachedTaskSummarySnapshot()) {
        setStatusMessage(loadingMessage);
      }

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
    }

    loadSummary();
    window.addEventListener(TASK_SUMMARY_INVALIDATED_EVENT, loadSummary);

    return () => {
      active = false;
      window.removeEventListener(TASK_SUMMARY_INVALIDATED_EVENT, loadSummary);
    };
  }, [loadingMessage]);

  return { summary, statusMessage };
}
