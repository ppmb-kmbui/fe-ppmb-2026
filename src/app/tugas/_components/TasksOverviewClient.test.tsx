import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getCachedProfileSnapshotMock, getProfileCachedMock } = vi.hoisted(
  () => ({
    getCachedProfileSnapshotMock: vi.fn(),
    getProfileCachedMock: vi.fn(),
  }),
);

vi.mock("@/lib/auth-api", () => ({
  getCachedProfileSnapshot: getCachedProfileSnapshotMock,
  getProfileCached: getProfileCachedMock,
}));

vi.mock("@/components", () => ({
  TaskCard: ({ title }: { title: string }) => <article>{title}</article>,
}));

vi.mock("./useTaskSummary", () => ({
  useTaskSummary: () => ({ summary: undefined, statusMessage: "" }),
}));

vi.mock("./task-icons", () => ({
  getTaskIcon: () => null,
}));

import { TasksOverviewClient } from "./TasksOverviewClient";

describe("TasksOverviewClient Networking eligibility", () => {
  beforeEach(() => {
    getCachedProfileSnapshotMock.mockReset();
    getProfileCachedMock.mockReset();
    getCachedProfileSnapshotMock.mockReturnValue(null);
  });

  it("shows the Networking task to angkatan 2026", async () => {
    getProfileCachedMock.mockResolvedValue({ batch: 2026 });
    render(<TasksOverviewClient />);

    expect(await screen.findByText("Networking")).toBeInTheDocument();
  });

  it("does not show the Networking task to senior accounts", async () => {
    getProfileCachedMock.mockResolvedValue({ batch: 2025 });
    render(<TasksOverviewClient />);

    await waitFor(() => expect(getProfileCachedMock).toHaveBeenCalledOnce());
    expect(screen.queryByText("Networking")).not.toBeInTheDocument();
    expect(screen.getByText("KMBUI Explorer")).toBeInTheDocument();
  });
});
