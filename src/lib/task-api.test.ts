import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitNetworkingFriend } from "@/lib/task-api";

const originalEnv = { ...process.env };

describe("Networking task API", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.example.test/api/v1";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("sends the friend interview using the backend's snake_case contract", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        success: true,
        data: {
          friend: { id: 42, fullname: "Budi", batch: 2025 },
          questions: [],
          submission: null,
          progress: { completed: 0, required: 18, percentage: 0 },
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await submitNetworkingFriend(42, {
      photoUrl: "https://cdn.example/networking.jpg",
      answers: [
        { questionId: 11, answer: "Jawaban satu" },
        { questionId: 12, answer: "Jawaban dua" },
        { questionId: 13, answer: "Jawaban tiga" },
      ],
      customQuestion: "Pertanyaan bebas?",
      customAnswer: "Jawaban bebas",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/tasks/networking/42",
      expect.objectContaining({
        method: "PUT",
        credentials: "same-origin",
      }),
    );
    const request = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(String(request.body))).toEqual({
      photo_url: "https://cdn.example/networking.jpg",
      answers: [
        { question_id: 11, answer: "Jawaban satu" },
        { question_id: 12, answer: "Jawaban dua" },
        { question_id: 13, answer: "Jawaban tiga" },
      ],
      custom_question: "Pertanyaan bebas?",
      custom_answer: "Jawaban bebas",
    });
  });
});
