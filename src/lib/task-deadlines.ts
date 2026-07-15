export type SubmissionTaskKey =
  | "networking"
  | "insightHunting"
  | "explorer"
  | "mentoring"
  | "fossib";

export const TASK_DEADLINES: Record<SubmissionTaskKey, string> = {
  networking: "2026-08-31T23:59:59+07:00",
  insightHunting: "2026-08-14T23:59:59+07:00",
  explorer: "2026-09-07T23:59:59+07:00",
  mentoring: "2026-08-31T23:59:59+07:00",
  fossib: "2026-09-07T23:59:59+07:00",
};

export function isTaskSubmissionClosed(task: SubmissionTaskKey) {
  return Date.now() >= new Date(TASK_DEADLINES[task]).getTime();
}

export function getTaskDeadlineDate(task: SubmissionTaskKey) {
  return new Date(TASK_DEADLINES[task]);
}

export function getClosedSubmissionMessage() {
  return "Pengumpulan tugas sudah ditutup.";
}
