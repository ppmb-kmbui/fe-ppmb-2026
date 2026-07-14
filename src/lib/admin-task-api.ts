import { apiFetch } from "@/lib/api";
import { SubmissionReviewCardProps } from "@/components/admin/SubmissionReviewCard";

export interface ProgressItem {
  completed: number;
  required: number;
  percentage: number;
}

export interface ParticipantTaskResponse {
  user: {
    id: number;
    fullname: string;
    email: string;
    imgUrl: string | null;
    faculty: string;
    batch: number;
    lineId: string;
    whatsappNumber: string;
  };

  status: {
    networking: boolean;
    explorer: boolean;
    mentoring: boolean;
    fosterSiblings: boolean;
    insightHunting: boolean;
  };

  progress: {
    networking: ProgressItem;
    explorer: ProgressItem;
    mentoring: ProgressItem;
    fossib: ProgressItem;
    insightHunting: ProgressItem;
    overall: ProgressItem;
  };

  submissions: {
    networking: {
      firstDocsUrl: string | null;
    } | null;

    explorer: {
      img_url: string | null;
    } | null;

    mentoring: {
      gdrive_url: string | null;
    };

    insightHunting: {
      file_url: string | null;
    } | null;

    fossib: unknown;
  };
}

export async function getParticipantTask(participantId: string) {
  const response = await apiFetch<ParticipantTaskResponse>(
    `admin/task/${participantId}`
  );

  if (!response.data) {
    throw new Error("Missing data");
  }

  return response.data;
}

export function buildSubmissionCards(
  data: ParticipantTaskResponse
): SubmissionReviewCardProps[] {
  return [
    {
      title: "Networking",
      status: data.status.networking
        ? "submitted"
        : "not-submitted",
      answer: data.submissions.networking?.firstDocsUrl ?? "",
      media: "",
      file: {
        href: data.submissions.networking?.firstDocsUrl ?? "",
        label: "Google Docs",
      },
      answerFirst: true,
    },

    {
      title: "Explorer",
      status: data.status.explorer
        ? "submitted"
        : "not-submitted",
      media: data.submissions.explorer?.img_url ?? "",
    },

    {
      title: "Mentoring",
      status: data.status.mentoring
        ? "submitted"
        : "not-submitted",
      answer: data.submissions.mentoring?.gdrive_url ?? "",
    },

    {
      title: "Insight Hunting",
      status: data.status.insightHunting
        ? "submitted"
        : "not-submitted",
      file: {
        href: data.submissions.insightHunting?.file_url ?? "",
        label: "Insight Hunting.pdf",
      },
    },
  ];
}