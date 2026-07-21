import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetchMock } = vi.hoisted(() => ({
  apiFetchMock: vi.fn(),
}));

vi.mock("@/lib/api", () => ({
  apiFetch: apiFetchMock,
}));

import { getPublicProfile } from "@/lib/profile-api";

describe("getPublicProfile", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("loads the requested profile directly instead of searching a paginated list", async () => {
    const profile = {
      id: 42,
      fullname: "Budi",
      imgUrl: null,
      faculty: "FIB",
      batch: 2025,
      lineId: "budi",
      whatsappNumber: "08123456789",
    };
    apiFetchMock.mockResolvedValue({ success: true, data: profile });

    await expect(getPublicProfile(42)).resolves.toEqual(profile);
    expect(apiFetchMock).toHaveBeenCalledWith("profile/42");
  });
});
