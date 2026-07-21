import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildSubmissionCards,
  saveParticipantTaskReview,
  type AdminTaskReview,
  type ParticipantTaskResponse,
} from "@/lib/admin-task-api";

const originalEnv = { ...process.env };

const review: AdminTaskReview = {
  taskType: "networking",
  score: 88,
  feedback: "Sudah lengkap",
  reviewedAt: "2026-07-21T12:30:00.000Z",
  reviewer: {
    id: 9,
    fullname: "Admin Penilai",
    email: "penilai@example.com",
  },
};

function participantTaskFixture(): ParticipantTaskResponse {
  const complete = { completed: 1, required: 1, percentage: 100 };

  return {
    user: {
      id: 42,
      fullname: "Peserta Contoh",
      email: "peserta@example.com",
      imgUrl: null,
      faculty: "Fasilkom",
      batch: 2026,
      lineId: "peserta",
      whatsappNumber: "08123456789",
    },
    status: {
      networking: true,
      explorer: true,
      mentoring: true,
      fosterSiblings: true,
      insightHunting: true,
    },
    progress: {
      networking: { completed: 18, required: 18, percentage: 100 },
      explorer: complete,
      mentoring: complete,
      fossib: complete,
      insightHunting: complete,
      overall: { completed: 22, required: 22, percentage: 100 },
    },
    reviews: { networking: review },
    submissions: {
      networking: [
        {
          id: 1,
          friend: {
            id: 5,
            fullname: "Teman Satu",
            imgUrl: null,
            faculty: "FT",
            batch: 2025,
          },
          photoUrl: "https://cdn.example.com/networking.jpg",
          answers: [
            {
              questionId: 1,
              prompt: "Apa pengalamanmu?",
              answer: "Pengalaman yang baik.",
            },
          ],
          createdAt: "2026-07-20T10:00:00.000Z",
          updatedAt: "2026-07-20T10:00:00.000Z",
        },
      ],
      explorer: {
        activityName: "Jelajah UI",
        img_url: "https://cdn.example.com/explorer.jpg",
      },
      mentoring: {
        gdrive_url: "https://drive.google.com/file/d/mentoring/view",
      },
      insightHunting: {
        file_url: "https://cdn.example.com/insight.pdf",
      },
      fossib: {
        fileUrl: "https://cdn.example.com/fossib.pdf",
        photoUrl: "https://cdn.example.com/fossib.jpg",
      },
    },
  };
}

describe("admin task API", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.test/api/v1";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("saves a category review using the backend contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: { review },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      saveParticipantTaskReview("42", "networking", {
        score: 88,
        feedback: "  Sudah lengkap  ",
      }),
    ).resolves.toEqual(review);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/admin/tasks/42/reviews/networking",
      expect.objectContaining({
        method: "PUT",
        credentials: "same-origin",
      }),
    );
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({
      score: 88,
      feedback: "Sudah lengkap",
    });
  });

  it("keeps every task attachment while mapping review metadata", () => {
    const cards = buildSubmissionCards(participantTaskFixture());

    expect(cards.map(({ taskType }) => taskType)).toEqual([
      "networking",
      "explorer",
      "mentoring",
      "insight-hunting",
      "fossib",
    ]);
    expect(cards[0]).toMatchObject({
      status: "submitted",
      review,
      links: [{ href: "https://cdn.example.com/networking.jpg" }],
    });
    expect(cards[1]).toMatchObject({
      media: "https://cdn.example.com/explorer.jpg",
      answer: "Jelajah UI",
    });
    expect(cards[2].links?.[0]?.href).toBe(
      "https://drive.google.com/file/d/mentoring/view",
    );
    expect(cards[3].file?.href).toBe("https://cdn.example.com/insight.pdf");
    expect(cards[4]).toMatchObject({
      media: "https://cdn.example.com/fossib.jpg",
      file: { href: "https://cdn.example.com/fossib.pdf" },
    });
  });
});
