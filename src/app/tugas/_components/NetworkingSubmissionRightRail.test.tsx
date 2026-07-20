import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getNetworkingOverviewMock } = vi.hoisted(() => ({
  getNetworkingOverviewMock: vi.fn(),
}));

vi.mock("@/lib/task-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/task-api")>(
    "@/lib/task-api",
  );

  return {
    ...actual,
    getNetworkingOverview: getNetworkingOverviewMock,
  };
});

import { NetworkingSubmissionRightRail } from "./NetworkingSubmissionRightRail";

describe("NetworkingSubmissionRightRail", () => {
  beforeEach(() => {
    getNetworkingOverviewMock.mockReset();
    getNetworkingOverviewMock.mockResolvedValue({
      friends: [],
      submissions: [],
      questions: [],
      progress: {
        completed: 15,
        required: 18,
        percentage: 83,
        byBatch: {
          "2026": { completed: 9, required: 10, percentage: 90 },
          "2025": { completed: 3, required: 4, percentage: 75 },
          "2024": { completed: 2, required: 2, percentage: 100 },
          "2023": { completed: 1, required: 2, percentage: 50 },
        },
      },
    });
  });

  it("shows total and separate progress for every target batch", async () => {
    render(<NetworkingSubmissionRightRail />);

    expect(await screen.findByText("15/18 Selesai")).toBeInTheDocument();
    expect(screen.getByText("9/10 Selesai")).toBeInTheDocument();
    expect(screen.getByText("3/4 Selesai")).toBeInTheDocument();
    expect(screen.getByText("2/2 Selesai")).toBeInTheDocument();
    expect(screen.getByText("1/2 Selesai")).toBeInTheDocument();
    expect(screen.getByText("Angkatan 2026")).toBeInTheDocument();
    expect(screen.getByText("Angkatan 2025")).toBeInTheDocument();
    expect(screen.getByText("Angkatan 2024")).toBeInTheDocument();
    expect(screen.getByText("Angkatan 2023")).toBeInTheDocument();
  });

  it("shows an error instead of false zero progress when loading fails", async () => {
    getNetworkingOverviewMock.mockRejectedValueOnce(new Error("API unavailable"));

    render(<NetworkingSubmissionRightRail />);

    expect(await screen.findByText("API unavailable")).toHaveAttribute(
      "role",
      "alert",
    );
    expect(screen.queryByText("0/18 Selesai")).not.toBeInTheDocument();
  });
});
