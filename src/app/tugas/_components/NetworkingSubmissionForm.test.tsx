import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { NetworkingQuestion } from "@/lib/task-api";

import { NETWORKING_FIXED_QUESTIONS } from "./networking-requirements";

const { getNetworkingFriendMock, submitNetworkingFriendMock, uploadImageMock } =
  vi.hoisted(() => ({
    getNetworkingFriendMock: vi.fn(),
    submitNetworkingFriendMock: vi.fn(),
    uploadImageMock: vi.fn(),
  }));

vi.mock("@/lib/task-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/task-api")>(
    "@/lib/task-api",
  );

  return {
    ...actual,
    getNetworkingFriend: getNetworkingFriendMock,
    submitNetworkingFriend: submitNetworkingFriendMock,
  };
});

vi.mock("@/lib/image-upload", () => ({
  uploadImage: uploadImageMock,
}));

vi.mock("@/lib/task-deadlines", () => ({
  isTaskSubmissionClosed: () => false,
  getClosedSubmissionMessage: () => "Pengumpulan tugas sudah ditutup.",
}));

import { NetworkingSubmissionForm } from "./NetworkingSubmissionForm";

const peerQuestions: NetworkingQuestion[] = NETWORKING_FIXED_QUESTIONS.map(
  (question, index) => ({
    ...question,
    id: index + 101,
    position: index + 1,
    isCustom: false,
  }),
);

const seniorQuestions: NetworkingQuestion[] = Array.from(
  { length: 5 },
  (_, index) => ({
    id: index + 201,
    code: `senior_question_${index + 1}`,
    prompt: `Pertanyaan kakak tingkat ${index + 1}`,
    position: index + 1,
    isCustom: false,
  }),
);

const customCatalogQuestion: NetworkingQuestion = {
  id: 999,
  code: "custom",
  prompt: "Pertanyaan Bebas dari mahasiswa baru",
  position: 99,
  isCustom: true,
};

describe("NetworkingSubmissionForm", () => {
  beforeEach(() => {
    getNetworkingFriendMock.mockReset();
    submitNetworkingFriendMock.mockReset();
    uploadImageMock.mockReset();

    getNetworkingFriendMock.mockResolvedValue({
      friend: {
        id: 42,
        fullname: "Budi",
        faculty: "FIB",
        imgUrl: null,
        batch: 2026,
      },
      networkingType: "peer",
      questions: [...peerQuestions, customCatalogQuestion],
      submission: null,
      progress: { completed: 0, required: 18, percentage: 0 },
    });
    uploadImageMock.mockResolvedValue("https://cdn.example/networking.jpg");
    submitNetworkingFriendMock.mockResolvedValue({
      friend: { id: 42, fullname: "Budi", batch: 2026 },
      networkingType: "peer",
      questions: [...peerQuestions, customCatalogQuestion],
      submission: {
        id: 9,
        photoUrl: "https://cdn.example/networking.jpg",
        answers: [],
        createdAt: "2026-07-20T00:00:00.000Z",
        updatedAt: "2026-07-20T00:00:00.000Z",
      },
      progress: { completed: 1, required: 18, percentage: 6 },
    });
  });

  it("loads catalog questions and submits one answer per question with documentation", async () => {
    const user = userEvent.setup();
    render(<NetworkingSubmissionForm friendId={42} />);

    expect(
      await screen.findByLabelText(`1. ${peerQuestions[0].prompt}`),
    ).toBeEnabled();
    expect(screen.queryByText("Bersama Budi")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Lihat Templat Pertanyaan" }),
    ).not.toBeInTheDocument();

    for (const [index, question] of peerQuestions.entries()) {
      await user.type(
        screen.getByLabelText(`${index + 1}. ${question.prompt}`),
        `Jawaban ${index + 1}`,
      );
    }

    await user.type(
      screen.getByLabelText("Pertanyaan Bebas dari mahasiswa baru"),
      "Apa kegiatan favoritmu?",
    );
    await user.type(
      screen.getByLabelText("Jawaban pertanyaan bebas"),
      "Membaca buku.",
    );
    await user.upload(
      screen.getByLabelText("Unggah foto"),
      new File(["photo"], "bersama-budi.png", { type: "image/png" }),
    );
    await user.click(screen.getByRole("button", { name: "Simpan Networking" }));

    await vi.waitFor(() =>
      expect(submitNetworkingFriendMock).toHaveBeenCalledWith(42, {
        photoUrl: "https://cdn.example/networking.jpg",
        answers: peerQuestions.map((question, index) => ({
          questionId: question.id,
          answer: `Jawaban ${index + 1}`,
        })),
        customQuestion: "Apa kegiatan favoritmu?",
        customAnswer: "Membaca buku.",
      }),
    );
    expect(uploadImageMock).toHaveBeenCalledOnce();
    expect(
      await screen.findByText("Networking bersama Budi berhasil disimpan."),
    ).toBeInTheDocument();
  });

  it("hydrates an existing submission and allows keeping its photo", async () => {
    getNetworkingFriendMock.mockResolvedValue({
      friend: {
        id: 42,
        fullname: "Budi",
        faculty: "FIB",
        imgUrl: null,
        batch: 2026,
      },
      networkingType: "peer",
      questions: [
        ...peerQuestions,
        {
          id: 200,
          code: "custom",
          prompt: "Pertanyaan Bebas dari mahasiswa baru",
          position: 4,
          isCustom: true,
        },
      ],
      submission: {
        id: 9,
        photoUrl: "https://cdn.example/old.jpg",
        answers: [
          ...peerQuestions.map((question, index) => ({
            questionId: question.id,
            answer: `Jawaban lama ${index + 1}`,
          })),
          {
            questionId: 200,
            customQuestion: "Pertanyaan lama?",
            answer: "Jawaban lama.",
          },
        ],
        createdAt: "2026-07-19T00:00:00.000Z",
        updatedAt: "2026-07-19T00:00:00.000Z",
      },
      progress: { completed: 1, required: 18, percentage: 6 },
    });

    render(<NetworkingSubmissionForm friendId={42} />);

    expect(
      await screen.findByDisplayValue("Pertanyaan lama?"),
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jawaban lama.")).toBeInTheDocument();
    expect(
      screen.getByText(/Foto dokumentasi sudah tersimpan/),
    ).toBeInTheDocument();
  });

  it("uses the five-question senior catalog and shows its template", async () => {
    const user = userEvent.setup();
    getNetworkingFriendMock.mockResolvedValueOnce({
      friend: {
        id: 84,
        fullname: "Kak Sari",
        faculty: "FIB",
        imgUrl: null,
        batch: 2025,
      },
      networkingType: "senior",
      questions: [...seniorQuestions, customCatalogQuestion],
      submission: null,
      progress: { completed: 0, required: 18, percentage: 0 },
    });

    render(<NetworkingSubmissionForm friendId={84} />);

    expect(
      await screen.findByRole("link", {
        name: "Lihat Templat Pertanyaan Kakak Tingkat",
      }),
    ).toHaveAttribute("target", "_blank");

    for (const [index, question] of seniorQuestions.entries()) {
      await user.type(
        screen.getByLabelText(`${index + 1}. ${question.prompt}`),
        `Jawaban senior ${index + 1}`,
      );
    }
    await user.type(
      screen.getByLabelText("Pertanyaan Bebas dari mahasiswa baru"),
      "Apa pesan untuk mahasiswa baru?",
    );
    await user.type(
      screen.getByLabelText("Jawaban pertanyaan bebas"),
      "Tetap semangat.",
    );
    await user.upload(
      screen.getByLabelText("Unggah foto"),
      new File(["photo"], "bersama-kakak.png", { type: "image/png" }),
    );
    await user.click(screen.getByRole("button", { name: "Simpan Networking" }));

    await vi.waitFor(() =>
      expect(submitNetworkingFriendMock).toHaveBeenCalledWith(84, {
        photoUrl: "https://cdn.example/networking.jpg",
        answers: seniorQuestions.map((question, index) => ({
          questionId: question.id,
          answer: `Jawaban senior ${index + 1}`,
        })),
        customQuestion: "Apa pesan untuk mahasiswa baru?",
        customAnswer: "Tetap semangat.",
      }),
    );
  });

  it("does not submit without the custom fields and documentation photo", async () => {
    const user = userEvent.setup();
    render(<NetworkingSubmissionForm friendId={42} />);

    expect(
      await screen.findByLabelText(`1. ${peerQuestions[0].prompt}`),
    ).toBeEnabled();
    for (const [index, question] of peerQuestions.entries()) {
      await user.type(
        screen.getByLabelText(`${index + 1}. ${question.prompt}`),
        `Jawaban ${index + 1}`,
      );
    }

    const form = screen
      .getByRole("button", { name: "Simpan Networking" })
      .closest("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);
    expect(
      await screen.findByText("Pertanyaan bebas dan jawabannya wajib diisi."),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText("Pertanyaan Bebas dari mahasiswa baru"),
      "Apa kegiatan favoritmu?",
    );
    await user.type(
      screen.getByLabelText("Jawaban pertanyaan bebas"),
      "Membaca buku.",
    );
    fireEvent.submit(form!);

    expect(
      await screen.findByText("Foto dokumentasi Networking wajib dipilih."),
    ).toBeInTheDocument();
    expect(submitNetworkingFriendMock).not.toHaveBeenCalled();
  });
});
