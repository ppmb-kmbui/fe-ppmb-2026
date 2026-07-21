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
  BackButton: () => <a href="/tugas">Kembali</a>,
  DashboardPageLayout: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

import { NetworkingAccessGate } from "./NetworkingAccessGate";

describe("NetworkingAccessGate", () => {
  beforeEach(() => {
    getCachedProfileSnapshotMock.mockReset();
    getProfileCachedMock.mockReset();
    getCachedProfileSnapshotMock.mockReturnValue(null);
  });

  it("renders Networking for an angkatan 2026 viewer", async () => {
    getProfileCachedMock.mockResolvedValue({ batch: 2026 });

    render(
      <NetworkingAccessGate>
        <p>Form Networking</p>
      </NetworkingAccessGate>,
    );

    expect(await screen.findByText("Form Networking")).toBeInTheDocument();
  });

  it("blocks Networking for every other batch", async () => {
    getProfileCachedMock.mockResolvedValue({ batch: 2025 });

    render(
      <NetworkingAccessGate>
        <p>Form Networking</p>
      </NetworkingAccessGate>,
    );

    expect(
      await screen.findByText(
        "Fitur Networking hanya tersedia untuk peserta angkatan 2026.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText("Form Networking")).not.toBeInTheDocument();
  });
});
