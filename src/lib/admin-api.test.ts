import { beforeEach, describe, expect, it, vi } from "vitest";

const { apiFetchMock } = vi.hoisted(() => ({ apiFetchMock: vi.fn() }));

vi.mock("@/lib/api", () => ({
  apiFetch: apiFetchMock,
}));

const {
  getSuperAdminProfiles,
  setSuperAdminProfileVisibility,
} = await import("@/lib/admin-api");

const profile = {
  id: 42,
  email: "sari@example.com",
  fullname: "Sari",
  imgUrl: null,
  faculty: "Fasilkom",
  batch: 2024,
  isProfileHidden: true,
};

describe("superadmin profile API", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("serializes search, cohort, visibility, and pagination filters", async () => {
    const data = {
      profiles: [profile],
      pagination: {
        page: 2,
        limit: 8,
        total: 9,
        totalPages: 2,
      },
    };
    apiFetchMock.mockResolvedValue({ success: true, data });

    await expect(
      getSuperAdminProfiles({
        page: 2,
        limit: 8,
        search: "  Sari  ",
        batch: 2024,
        visibility: "hidden",
      }),
    ).resolves.toEqual(data);

    expect(apiFetchMock).toHaveBeenCalledWith(
      "superadmin/profiles?page=2&limit=8&visibility=hidden&search=Sari&batch=2024",
    );
  });

  it("supports the 2026 cohort for individual profile management", async () => {
    apiFetchMock.mockResolvedValue({
      success: true,
      data: {
        profiles: [{ ...profile, batch: 2026 }],
        pagination: {
          page: 1,
          limit: 12,
          total: 1,
          totalPages: 1,
        },
      },
    });

    await getSuperAdminProfiles({ batch: 2026 });

    expect(apiFetchMock).toHaveBeenCalledWith(
      "superadmin/profiles?page=1&limit=12&visibility=all&batch=2026",
    );
  });

  it("uses an explicit idempotent hidden state for visibility updates", async () => {
    apiFetchMock.mockResolvedValue({
      success: true,
      data: { ...profile, isProfileHidden: false },
    });

    await expect(
      setSuperAdminProfileVisibility(42, false),
    ).resolves.toMatchObject({
      id: 42,
      isProfileHidden: false,
    });

    expect(apiFetchMock).toHaveBeenCalledWith(
      "superadmin/profiles/42/visibility",
      {
        method: "PATCH",
        body: JSON.stringify({ hidden: false }),
      },
    );
  });

  it("rejects successful responses that omit required data", async () => {
    apiFetchMock.mockResolvedValue({ success: true });

    await expect(getSuperAdminProfiles()).rejects.toThrow(
      "missing superadmin profile data",
    );
    await expect(
      setSuperAdminProfileVisibility(42, true),
    ).rejects.toThrow("missing updated profile");
  });
});
