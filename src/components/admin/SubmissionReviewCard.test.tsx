import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SubmissionReviewCard } from "./SubmissionReviewCard";

describe("SubmissionReviewCard", () => {
  it("shows the latest reviewer and saves an integer score with optional feedback", async () => {
    const user = userEvent.setup();
    const onSaveReview = vi.fn().mockResolvedValue(undefined);

    render(
      <SubmissionReviewCard
        taskType="networking"
        title="Networking"
        status="submitted"
        answer="Seluruh jawaban Networking tetap terlihat."
        review={{
          taskType: "networking",
          score: 75,
          feedback: "Perlu dirapikan",
          reviewedAt: "2026-07-21T12:30:00.000Z",
          reviewer: {
            id: 9,
            fullname: "Admin Penilai",
            email: "penilai@example.com",
          },
        }}
        onSaveReview={onSaveReview}
      />,
    );

    expect(screen.getByText("Sudah Diperiksa")).toBeInTheDocument();
    expect(screen.getByText("Diperiksa oleh Admin Penilai")).toBeInTheDocument();
    expect(screen.getByText("penilai@example.com")).toBeInTheDocument();
    expect(
      screen.getByText("Seluruh jawaban Networking tetap terlihat."),
    ).toBeInTheDocument();

    const scoreInput = screen.getByRole("spinbutton", { name: /nilai/i });
    const feedbackInput = screen.getByRole("textbox", { name: /feedback/i });
    await user.clear(scoreInput);
    await user.type(scoreInput, "90");
    await user.clear(feedbackInput);
    await user.type(feedbackInput, "  Sangat baik  ");
    await user.click(screen.getByRole("button", { name: "Simpan Nilai" }));

    await waitFor(() =>
      expect(onSaveReview).toHaveBeenCalledWith("networking", {
        score: 90,
        feedback: "Sangat baik",
      }),
    );
    expect(await screen.findByText("Nilai berhasil disimpan.")).toBeInTheDocument();
  });

  it("disables every grading control while the task is incomplete", () => {
    render(
      <SubmissionReviewCard
        taskType="explorer"
        title="Explorer"
        status="not-submitted"
        onSaveReview={vi.fn()}
      />,
    );

    expect(screen.getByText("Belum Diperiksa")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /nilai/i })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: /feedback/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Simpan Nilai" })).toBeDisabled();
    expect(
      screen.getByText("Penilaian tersedia setelah tugas lengkap dikumpulkan."),
    ).toBeInTheDocument();
  });

  it("rejects a non-integer or out-of-range score before calling the API", async () => {
    const user = userEvent.setup();
    const onSaveReview = vi.fn().mockResolvedValue(undefined);

    render(
      <SubmissionReviewCard
        taskType="mentoring"
        title="Mentoring"
        status="submitted"
        onSaveReview={onSaveReview}
      />,
    );

    const scoreInput = screen.getByRole("spinbutton", { name: /nilai/i });
    await user.type(scoreInput, "101");
    await user.click(screen.getByRole("button", { name: "Simpan Nilai" }));

    expect(onSaveReview).not.toHaveBeenCalled();
    expect(
      screen.getByText("Nilai harus berupa bilangan bulat dari 0 sampai 100."),
    ).toBeInTheDocument();
  });
});
