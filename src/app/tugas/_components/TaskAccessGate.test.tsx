import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
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
  BackButton: () => <span>Kembali</span>,
  DashboardPageLayout: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { TaskAccessGate } from "./TaskAccessGate";

describe("TaskAccessGate", () => {
  beforeEach(() => {
    getCachedProfileSnapshotMock.mockReset();
    getProfileCachedMock.mockReset();
    getCachedProfileSnapshotMock.mockReturnValue(null);
  });

  it("allows all task routes for angkatan 2026", async () => {
    getProfileCachedMock.mockResolvedValue({ batch: 2026, isAdmin: false });

    render(
      <TaskAccessGate>
        <p>Isi tugas</p>
      </TaskAccessGate>,
    );

    expect(await screen.findByText("Isi tugas")).toBeInTheDocument();
  });

  it.each([2023, 2024, 2025])(
    "blocks every task route for senior batch %s",
    async (batch) => {
      getProfileCachedMock.mockResolvedValue({ batch, isAdmin: false });

      render(
        <TaskAccessGate>
          <p>Isi tugas</p>
        </TaskAccessGate>,
      );

      expect(
        await screen.findByText(
          "Halaman tugas hanya tersedia untuk peserta angkatan 2026.",
        ),
      ).toBeInTheDocument();
      expect(screen.queryByText("Isi tugas")).not.toBeInTheDocument();
    },
  );

  it("blocks admin accounts even when their batch is 2026", async () => {
    getProfileCachedMock.mockResolvedValue({ batch: 2026, isAdmin: true });

    render(
      <TaskAccessGate>
        <p>Isi tugas</p>
      </TaskAccessGate>,
    );

    expect(
      await screen.findByText(
        "Halaman tugas hanya tersedia untuk peserta angkatan 2026.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Isi tugas")).not.toBeInTheDocument();
  });
});
