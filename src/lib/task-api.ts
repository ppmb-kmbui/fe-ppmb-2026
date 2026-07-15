import { ApiError, apiFetch } from "@/lib/api";

export interface ProgressStat {
  completed: number;
  required: number;
  percentage: number;
}

export interface NetworkingProgressItem {
  progress: number;
  min: number;
}

export interface TaskSummary {
  networkingSubmission?: NetworkingSubmission | null;
  networkingAngkatan: {
    progress: Record<string, NetworkingProgressItem>;
    byBatch: Record<string, NetworkingProgressItem>;
    min: number;
  };
  networkingKating: {
    progress: Record<string, NetworkingProgressItem>;
    min: number;
  };
  kmbuiExplorerDone: boolean;
  firstFossibDone: boolean;
  secondFossibDone: boolean;
  insightHuntingDone: boolean;
  mentoringDone: boolean;
  mentoringVlogDone?: boolean;
  mentoringReflectionDone?: boolean;
  cards: {
    networking: ProgressStat;
    explorer: ProgressStat;
    mentoring: ProgressStat;
    fosterSiblings: ProgressStat;
    insightHunting?: ProgressStat;
  };
}

export type NetworkingSubmissionField = "first_docs_url" | "second_docs_url";

export interface NetworkingSubmission {
  id: number;
  userId: number;
  first_docs_url: string | null;
  second_docs_url: string | null;
  firstDocsUrl?: string | null;
  secondDocsUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkingSubmissionData {
  submission: NetworkingSubmission | null;
  progress: ProgressStat;
}

export interface ExplorerSubmission {
  id: number;
  userId: number;
  activity_name: string;
  img_url: string;
  photo_url?: string;
}

export interface InsightHuntingSubmission {
  id: number;
  userId: number;
  file_url: string;
}

export interface MentoringSubmission {
  id: number;
  userId: number;
  gdrive_url?: string | null;
  file_url?: string;
  description?: string | null;
}

export interface MentoringSubmissionData {
  submission: MentoringSubmission | null;
  gdrive_url: string | null;
  reflection?: MentoringSubmission | null;
  vlog?: MentoringSubmission | null;
}

export interface FosterSiblingsSubmission {
  id: number;
  userId: number;
  photo_url: string;
  file_url: string;
}

export interface CommitteeVideo {
  id: number;
  title: string;
  description: string | null;
  videoUrl: string | null;
  thumbnailUrl: string | null;
  position: number;
  isPublished: boolean;
}

export interface CommitteeVideoCategory {
  id?: number;
  name: string;
  materials: CommitteeVideo[];
}

let cachedTaskSummary: TaskSummary | null = null;
let taskSummaryRequest: Promise<TaskSummary | undefined> | null = null;
export const TASK_SUMMARY_INVALIDATED_EVENT = "ppmb:task-summary-invalidated";

export async function getTaskSummary() {
  const response = await apiFetch<TaskSummary>("tasks");
  cachedTaskSummary = response.data ?? null;
  return response.data;
}

export function getCachedTaskSummarySnapshot() {
  return cachedTaskSummary;
}

export async function getTaskSummaryCached() {
  if (cachedTaskSummary) return cachedTaskSummary;

  taskSummaryRequest ??= getTaskSummary().finally(() => {
    taskSummaryRequest = null;
  });

  return taskSummaryRequest;
}

export function invalidateTaskSummaryCache() {
  cachedTaskSummary = null;
  taskSummaryRequest = null;

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(TASK_SUMMARY_INVALIDATED_EVENT));
  }
}

export async function getNetworkingSubmission() {
  const response =
    await apiFetch<NetworkingSubmissionData>("tasks/networking");
  return response.data;
}

export async function submitNetworkingDocs(
  field: NetworkingSubmissionField,
  docsUrl: string,
) {
  const response = await apiFetch<NetworkingSubmissionData>("tasks/networking", {
    method: "POST",
    body: JSON.stringify({ [field]: docsUrl }),
  });
  invalidateTaskSummaryCache();
  return response.data;
}

export async function getExplorerSubmission() {
  const response = await apiFetch<ExplorerSubmission | null>("tasks/explorer");
  return response.data ?? null;
}

export async function submitExplorer(activityName: string, photoUrl: string) {
  const response = await apiFetch<ExplorerSubmission>("tasks/explorer", {
    method: "POST",
    body: JSON.stringify({ activity_name: activityName, photo_url: photoUrl }),
  });
  invalidateTaskSummaryCache();
  return response.data;
}

export async function getInsightHuntingSubmission() {
  const response = await apiFetch<InsightHuntingSubmission | null>(
    "tasks/insight-hunting",
  );
  return response.data ?? null;
}

export async function submitInsightHunting(docsUrl: string) {
  const response = await apiFetch<InsightHuntingSubmission>(
    "tasks/insight-hunting",
    {
      method: "POST",
      body: JSON.stringify({ docs_url: docsUrl }),
    },
  );
  invalidateTaskSummaryCache();
  return response.data;
}

export async function submitInsightHuntingFile(fileUrl: string) {
  const response = await apiFetch<InsightHuntingSubmission>(
    "tasks/insight-hunting",
    {
      method: "POST",
      body: JSON.stringify({ file_url: fileUrl }),
    },
  );
  invalidateTaskSummaryCache();
  return response.data;
}

export async function getMentoringSubmission() {
  const response =
    await apiFetch<MentoringSubmissionData>("tasks/mentoring");
  return response.data;
}

export async function submitMentoring(gdriveUrl: string) {
  const response = await apiFetch<MentoringSubmissionData>("tasks/mentoring", {
    method: "POST",
    body: JSON.stringify({ gdrive_url: gdriveUrl }),
  });
  invalidateTaskSummaryCache();
  return response.data;
}

export async function getFosterSiblingsSubmission() {
  const response =
    await apiFetch<FosterSiblingsSubmission | null>("tasks/fossib");
  return response.data ?? null;
}

export async function submitFosterSiblings(photoUrl: string, fileUrl: string) {
  const response = await apiFetch<FosterSiblingsSubmission>("tasks/fossib", {
    method: "POST",
    body: JSON.stringify({ photo_url: photoUrl, file_url: fileUrl }),
  });
  invalidateTaskSummaryCache();
  return response.data;
}

export async function getCommitteeVideos() {
  const response =
    await apiFetch<CommitteeVideoCategory>("tasks/mentoring/videos");
  return response.data;
}

export function getTaskApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return "Sesi login tidak ditemukan. Silakan login ulang.";
    }

    if (error.status >= 500) {
      return "";
    }

    if (typeof error.payload?.error === "string") {
      return error.payload.error;
    }

    return error.payload?.message ?? "";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "";
}
