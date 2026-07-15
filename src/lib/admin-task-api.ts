import { apiFetch } from "@/lib/api";
import {
  SubmissionReviewCardProps,
  type SubmissionLink,
} from "@/components/admin/SubmissionReviewCard";

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
      secondDocsUrl: string | null;
    } | null;

    explorer: {
      activityName?: string | null;
      img_url: string | null;
    } | null;

    mentoring: {
      submission?: {
        gdriveUrl?: string | null;
        gdrive_url?: string | null;
      } | null;
      gdrive_url?: string | null;
    };

    insightHunting: {
      file_url: string | null;
    } | null;

    fossib: {
      fileUrl: string | null;
      photoUrl: string | null;
      file_url?: string | null;
      photo_url?: string | null;
    } | null;
  };
}

export async function getParticipantTask(participantId: string) {
  const response = await apiFetch<ParticipantTaskResponse>(
    `admin/tasks/${participantId}`
  );

  if (!response.data) {
    throw new Error("Missing data");
  }

  return response.data;
}

export function buildSubmissionCards(
  data: ParticipantTaskResponse
): SubmissionReviewCardProps[] {
  const networkingLinks: SubmissionLink[] = [];
  if (data.submissions.networking?.firstDocsUrl) {
    networkingLinks.push({
      href: data.submissions.networking.firstDocsUrl,
      label: "Networking Angkatan 26",
      description: "Template/submission dengan teman seangkatan 2026",
    });
  }
  if (data.submissions.networking?.secondDocsUrl) {
    networkingLinks.push({
      href: data.submissions.networking.secondDocsUrl,
      label: "Networking Angkatan 23-25",
      description: "Template/submission dengan kakak tingkat angkatan 2023-2025",
    });
  }
  const mentoringLink =
    data.submissions.mentoring?.gdrive_url ??
    data.submissions.mentoring?.submission?.gdriveUrl ??
    "";
  const mentoringLinks: SubmissionLink[] = mentoringLink
    ? [
        {
          href: mentoringLink,
          label: "Google Drive Mentoring",
          description: "Link pengumpulan tugas mentoring",
        },
      ]
    : [];

  return [
    {
      title: "Networking",
      status: data.status.networking
        ? "submitted"
        : "not-submitted",
      links: networkingLinks,
      answerFirst: true,
    },

    {
      title: "Explorer",
      status: data.status.explorer
        ? "submitted"
        : "not-submitted",
      media: data.submissions.explorer?.img_url ?? "",
      answer: data.submissions.explorer?.activityName ?? "",
    },

    {
      title: "Mentoring",
      status: data.status.mentoring
        ? "submitted"
        : "not-submitted",
      links: mentoringLinks,
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
    {
      title: "Foster Siblings",
      status: data.status.fosterSiblings
        ? "submitted"
        : "not-submitted",
      media:
        data.submissions.fossib?.photoUrl ??
        data.submissions.fossib?.photo_url ??
        "",
      file: {
        href:
          data.submissions.fossib?.fileUrl ??
          data.submissions.fossib?.file_url ??
          "",
        label: "Foster Siblings.pdf",
      },
    },
  ];
}
