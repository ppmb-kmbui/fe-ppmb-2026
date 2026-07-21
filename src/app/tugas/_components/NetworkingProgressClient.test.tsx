import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getNetworkingOverviewMock } = vi.hoisted(() => ({
  getNetworkingOverviewMock: vi.fn(),
}));

vi.mock("@/lib/task-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/task-api")>(
    "@/lib/task-api",
  );
  return { ...actual, getNetworkingOverview: getNetworkingOverviewMock };
});

import { NetworkingProgressClient } from "./NetworkingProgressClient";

describe("NetworkingProgressClient", () => {
  beforeEach(() => {
    getNetworkingOverviewMock.mockReset();
    getNetworkingOverviewMock.mockResolvedValue({
      friends: [],
      submissions: [],
      questionSets: { peer: [], senior: [] },
      progress: {
        completed: 0,
        required: 18,
        percentage: 0,
        byBatch: {
          "2026": { completed: 0, required: 10 },
          "2025": { completed: 0, required: 4 },
          "2024": { completed: 0, required: 2 },
          "2023": { completed: 0, required: 2 },
        },
      },
    });
  });

  it("links peers to mutual friends and seniors to direct batch searches", async () => {
    render(<NetworkingProgressClient />);

    const peerCard = (await screen.findByRole("heading", {
      name: "Teman Angkatan 2026",
    })).closest("article");
    const seniorCard = screen
      .getByRole("heading", { name: "Teman Angkatan 2025" })
      .closest("article");

    expect(peerCard?.querySelector("a")).toHaveAttribute(
      "href",
      "/kalyanamitta?tab=connected",
    );
    expect(seniorCard?.querySelector("a")).toHaveAttribute(
      "href",
      "/kalyanamitta?tab=not-connected&batch=2025",
    );
  });
});
