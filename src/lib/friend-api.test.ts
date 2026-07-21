import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetchMock } = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  apiFetch: apiFetchMock,
}));

import { getFriendsPage, getMyConnections } from "@/lib/friend-api";

function friend(id: number, fullname: string) {
  return {
    id,
    email: `${id}@example.test`,
    fullname,
    faculty: "FIB",
    imgUrl: null,
    batch: 2026,
    status: "",
  };
}

describe("getMyConnections", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("returns only accepted mutual-friend records for Teman Saya", async () => {
    apiFetchMock.mockResolvedValue({
      success: true,
      data: [
        { id: 1, fromId: 7, toId: 10, status: "accepted", to: friend(10, "A") },
        { id: 2, fromId: 7, toId: 11, status: "pending", to: friend(11, "B") },
        { id: 3, fromId: 7, toId: 12, status: "done", to: friend(12, "C") },
      ],
    });

    await expect(getMyConnections()).resolves.toEqual([
      expect.objectContaining({ id: 10, fullname: "A" }),
      expect.objectContaining({ id: 12, fullname: "C" }),
    ]);
  });
});

describe("getFriendsPage", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
    apiFetchMock.mockResolvedValue({
      success: true,
      data: { friends: [], pagination: { page: 1, limit: 8, total: 0, totalPages: 1 } },
    });
  });

  it("forwards target-batch and discovery filters", async () => {
    await getFriendsPage({
      name: "Budi",
      batch: 2025,
      scope: "discover",
      page: 1,
      limit: 8,
    });

    expect(apiFetchMock).toHaveBeenCalledWith(
      "friends?page=1&limit=8&name=Budi&batch=2025&scope=discover",
    );
  });
});
