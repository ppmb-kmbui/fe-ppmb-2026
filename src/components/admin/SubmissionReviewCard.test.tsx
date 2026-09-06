import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SubmissionReviewCard } from "./SubmissionReviewCard";

describe("SubmissionReviewCard", () => {
  it("marks a late task and displays its latest submission in WIB without blocking grading", () => {
    render(<SubmissionReviewCard taskType="explorer" title="Explorer" status="submitted"
      submissionTiming={{ submittedAt: "2026-09-05T17:00:00.000Z", isLate: true }} onSaveReview={vi.fn()} />);
    expect(screen.getByText("Telat")).toBeInTheDocument();
    expect(screen.getByText("Sudah Dikumpulkan")).toBeInTheDocument();
    expect(screen.getByText(/Pengumpulan terakhir:/)).toHaveTextContent(/6 Sep 2026.*00[.:]00 WIB/);
    expect(screen.getByRole("spinbutton", { name: /nilai/i })).toBeEnabled();
  });

  it("keeps a late label on partial networking submissions", () => {
    render(<SubmissionReviewCard taskType="networking" title="Networking" status="not-submitted"
      submissionTiming={{ submittedAt: "2026-09-06T10:00:00.000Z", isLate: true }} />);
    expect(screen.getByText("Telat")).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /nilai/i })).toBeDisabled();
  });

  it("does not mark an on-time task late after an administrator reviews it later", () => {
    render(<SubmissionReviewCard taskType="mentoring" title="Mentoring" status="submitted"
      submissionTiming={{ submittedAt: "2026-09-05T16:59:59.999Z", isLate: false }}
      review={{ taskType: "mentoring", score: 80, feedback: null, reviewedAt: "2026-09-07T12:00:00.000Z",
        reviewer: { id: 9, fullname: "Admin", email: "admin@example.com" } }} />);
    expect(screen.queryByText("Telat")).not.toBeInTheDocument();
    expect(screen.getByText("Sudah Diperiksa")).toBeInTheDocument();
  });

  it("shows unknown legacy timing without claiming the submission was on time or late", () => {
    render(<SubmissionReviewCard title="Insight Hunting" status="submitted"
      submissionTiming={{ submittedAt: null, isLate: null }} />);
    expect(screen.getByText("Waktu pengumpulan lama belum tercatat.")).toBeInTheDocument();
    expect(screen.queryByText("Telat")).not.toBeInTheDocument();
  });
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
