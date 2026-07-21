import { render, screen } from "@testing-library/react";
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

import { Sidebar } from "./Sidebar";

describe("Sidebar access by cohort", () => {
  beforeEach(() => {
    getCachedProfileSnapshotMock.mockReset();
    getProfileCachedMock.mockReset();
  });

  it.each([2023, 2024, 2025])(
    "hides Tugas and Materi from a cached %i senior profile",
    (batch) => {
      getCachedProfileSnapshotMock.mockReturnValue({ batch, isAdmin: false });

      render(<Sidebar defaultPinned />);

      expect(
        screen.queryByRole("link", { name: "Tugas" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Materi" }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Beranda" })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Kalyanamitta" }),
      ).toBeInTheDocument();
    },
  );

  it("keeps Tugas hidden until an uncached 2026 profile is resolved", async () => {
    getCachedProfileSnapshotMock.mockReturnValue(null);
    getProfileCachedMock.mockResolvedValue({ batch: 2026, isAdmin: false });

    render(<Sidebar defaultPinned />);

    expect(screen.queryByRole("link", { name: "Tugas" })).not.toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: "Tugas" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Materi" })).toBeInTheDocument();
  });

  it("hides participant tasks from an admin account", () => {
    getCachedProfileSnapshotMock.mockReturnValue({ batch: 2026, isAdmin: true });

    render(<Sidebar defaultPinned />);

    expect(screen.queryByRole("link", { name: "Tugas" })).not.toBeInTheDocument();
  });
});
