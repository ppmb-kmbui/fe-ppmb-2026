import { ApiError, apiFetch } from "@/lib/api";

export interface ProgressStat {
  completed: number;
  required: number;
  percentage: number;
}

export interface TaskSummary {
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

export interface NetworkingQuestion {
  id: number;
  code: string;
  prompt: string;
  position: number;
  isCustom: boolean;
}

export interface NetworkingProgressByBatch {
  completed: number;
  required: number;
}

export interface NetworkingProgress extends ProgressStat {
  byBatch: Record<string, NetworkingProgressByBatch>;
}

export interface NetworkingFriend {
  id: number;
  fullname: string | null;
  imgUrl: string | null;
  faculty: string | null;
  batch: number;
  completed?: boolean;
  updatedAt?: string | null;
}

export interface NetworkingAnswer {
  id?: number;
  questionId: number | null;
  answer: string;
  customQuestion?: string | null;
}

export interface NetworkingSubmission {
  id: number;
  friendId?: number;
  friend?: NetworkingFriend;
  photoUrl: string;
  answers: NetworkingAnswer[];
  createdAt: string;
  updatedAt: string;
}

export interface NetworkingOverviewData {
  friends: NetworkingFriend[];
  submissions: NetworkingSubmission[];
  questions: NetworkingQuestion[];
  progress: NetworkingProgress;
}

export interface NetworkingFriendData {
  friend: NetworkingFriend;
  questions: NetworkingQuestion[];
  submission: NetworkingSubmission | null;
  progress: NetworkingProgress;
}

export interface SubmitNetworkingInput {
  photoUrl: string;
  answers: Array<{ questionId: number; answer: string }>;
  customQuestion: string;
  customAnswer: string;
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

export async function getNetworkingOverview() {
  const response = await apiFetch<NetworkingOverviewData>("tasks/networking");
  return response.data;
}

export async function getNetworkingFriend(friendId: number) {
  const response = await apiFetch<NetworkingFriendData>(
    `tasks/networking/${friendId}`,
  );
  return response.data;
}

export async function submitNetworkingFriend(
  friendId: number,
  input: SubmitNetworkingInput,
) {
  const response = await apiFetch<NetworkingFriendData>(
    `tasks/networking/${friendId}`,
    {
      method: "PUT",
      body: JSON.stringify({
        photo_url: input.photoUrl,
        answers: input.answers.map(({ questionId, answer }) => ({
          question_id: questionId,
          answer,
        })),
        custom_question: input.customQuestion,
        custom_answer: input.customAnswer,
      }),
    },
  );
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
