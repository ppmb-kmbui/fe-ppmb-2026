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

export interface AdminNetworkingAnswer {
  questionId: number;
  prompt: string | null;
  answer: string;
  customQuestion?: string | null;
}

export interface AdminNetworkingSubmission {
  id: number;
  friend: {
    id: number;
    fullname: string | null;
    imgUrl: string | null;
    faculty: string | null;
    batch: number;
  };
  photoUrl: string;
  answers: AdminNetworkingAnswer[];
  createdAt: string;
  updatedAt: string;
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
    networking: ProgressItem & {
      byBatch?: Record<string, ProgressItem>;
    };
    explorer: ProgressItem;
    mentoring: ProgressItem;
    fossib: ProgressItem;
    insightHunting: ProgressItem;
    overall: ProgressItem;
  };

  submissions: {
    networking: AdminNetworkingSubmission[];
    networkingQuestions?: Array<{
      id: number;
      code: string;
      prompt: string;
      position: number;
      isCustom: boolean;
    }>;

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
  const networkingSubmissions = data.submissions.networking ?? [];
  const networkingLinks: SubmissionLink[] = networkingSubmissions.map(
    (submission) => ({
      href: submission.photoUrl,
      label: `Dokumentasi: ${submission.friend.fullname ?? "Teman"}`,
      description: `Angkatan ${submission.friend.batch}`,
    }),
  );
  const networkingAnswers = networkingSubmissions
    .map((submission) => {
      const friendHeading = `${submission.friend.fullname ?? "Teman"} — Angkatan ${submission.friend.batch}`;
      const answers = submission.answers
        .map((entry, index) => {
          const question =
            entry.customQuestion?.trim() ||
            entry.prompt ||
            `Pertanyaan ${index + 1}`;
          return `${index + 1}. ${question}\n${entry.answer}`;
        })
        .join("\n\n");

      return `${friendHeading}\n${answers}`;
    })
    .join("\n\n--------------------\n\n");
  const mentoringLink =
    data.submissions.mentoring?.gdrive_url ??
    data.submissions.mentoring?.submission?.gdriveUrl ??
    "";
  const mentoringLinks: SubmissionLink[] = mentoringLink
    ? [
        {
          href: mentoringLink,
          label: "Google Drive Mentoring",
          description: "Tautan pengumpulan tugas Mentoring",
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
      answer: networkingAnswers,
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
