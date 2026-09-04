import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { getInsightHuntingSubmissionMock, submitInsightHuntingUploadMock } =
  vi.hoisted(() => ({
    getInsightHuntingSubmissionMock: vi.fn(),
    submitInsightHuntingUploadMock: vi.fn(),
  }));

vi.mock("@/lib/task-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/task-api")>(
    "@/lib/task-api",
  );

  return {
    ...actual,
    getInsightHuntingSubmission: getInsightHuntingSubmissionMock,
    submitInsightHuntingUpload: submitInsightHuntingUploadMock,
  };
});

import { InsightHuntingForm } from "./InsightHuntingForm";

function makePdf() {
  return new File(["%PDF-1.7"], "insight-hunting.pdf", {
    type: "application/pdf",
  });
}

describe("InsightHuntingForm", () => {
  beforeEach(() => {
    getInsightHuntingSubmissionMock.mockReset();
    submitInsightHuntingUploadMock.mockReset();
    getInsightHuntingSubmissionMock.mockResolvedValue(null);
  });

  it("submits the selected PDF through the backend upload endpoint", async () => {
    const user = userEvent.setup();
    const file = makePdf();
    submitInsightHuntingUploadMock.mockResolvedValue({
      id: 17,
      userId: 29,
      file_url: "https://cdn.example/insight-hunting.pdf",
    });
    render(<InsightHuntingForm />);

    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, file);
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    await vi.waitFor(() =>
      expect(submitInsightHuntingUploadMock).toHaveBeenCalledWith(file),
    );
    expect(
      await screen.findByText("Pengumpulan Insight Hunting berhasil disimpan."),
    ).toBeInTheDocument();
  });

  it("accepts a .pdf from a mobile provider that omits the MIME type", async () => {
    const user = userEvent.setup();
    const mobilePdf = new File(["%PDF-1.7"], "insight-mobile.pdf", { type: "" });
    submitInsightHuntingUploadMock.mockResolvedValue({
      id: 18,
      userId: 29,
      file_url: "https://cdn.example/insight-mobile.pdf",
    });
    render(<InsightHuntingForm />);

    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, mobilePdf);
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    await vi.waitFor(() =>
      expect(submitInsightHuntingUploadMock).toHaveBeenCalledWith(mobilePdf),
    );
  });

  it("shows the backend upload error", async () => {
    const user = userEvent.setup();
    submitInsightHuntingUploadMock.mockRejectedValue(
      new Error("Berkas PDF gagal diunggah."),
    );
    render(<InsightHuntingForm />);

    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, makePdf());
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    expect(
      await screen.findByText("Berkas PDF gagal diunggah."),
    ).toBeInTheDocument();
  });

  it("shows a safe fallback when the upload API returns a server error", async () => {
    const user = userEvent.setup();
    submitInsightHuntingUploadMock.mockRejectedValue(new ApiError(503));
    render(<InsightHuntingForm />);

    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, makePdf());
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    expect(
      await screen.findByText(
        "Pengumpulan Insight Hunting gagal. Silakan coba lagi.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the backend message instead of its machine error code", async () => {
    const user = userEvent.setup();
    submitInsightHuntingUploadMock.mockRejectedValue(
      new ApiError(413, {
        success: false,
        status: 413,
        message: "Ukuran file PDF maksimal 4 MiB.",
        error: "PDF_FILE_TOO_LARGE",
      }),
    );
    render(<InsightHuntingForm />);

    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, makePdf());
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    expect(
      await screen.findByText("Ukuran file PDF maksimal 4 MiB."),
    ).toBeInTheDocument();
    expect(screen.queryByText("PDF_FILE_TOO_LARGE")).not.toBeInTheDocument();
  });

  it("keeps the login-again message when the upload API returns 401", async () => {
    const user = userEvent.setup();
    submitInsightHuntingUploadMock.mockRejectedValue(
      new ApiError(401, {
        success: false,
        status: 401,
        message: "Unauthorized",
      }),
    );
    render(<InsightHuntingForm />);

    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, makePdf());
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    expect(
      await screen.findByText("Sesi login tidak ditemukan. Silakan login ulang."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Unauthorized")).not.toBeInTheDocument();
  });

  it("rejects PDFs larger than the production upload limit", async () => {
    const user = userEvent.setup();
    const oversizedPdf = new File(
      [new Uint8Array(4 * 1024 * 1024 + 1)],
      "insight-hunting-besar.pdf",
      { type: "application/pdf" },
    );
    render(<InsightHuntingForm />);

    expect(screen.getByText("Format PDF, maksimal 4 MB.")).toBeInTheDocument();
    const input = await screen.findByLabelText("Unggah berkas PDF");
    await vi.waitFor(() => expect(input).toBeEnabled());
    await user.upload(input, oversizedPdf);
    await user.click(screen.getByRole("button", { name: "Kumpulkan" }));

    expect(
      await screen.findByText("Ukuran berkas maksimal 4 MB."),
    ).toBeInTheDocument();
    expect(submitInsightHuntingUploadMock).not.toHaveBeenCalled();
  });
});
