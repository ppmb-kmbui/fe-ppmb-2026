import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  replaceMock,
  getProfileCachedMock,
  getSuperAdminProfilesMock,
  setSuperAdminProfileVisibilityMock,
} = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  getProfileCachedMock: vi.fn(),
  getSuperAdminProfilesMock: vi.fn(),
  setSuperAdminProfileVisibilityMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/lib/auth-api", () => ({
  getProfileCached: getProfileCachedMock,
}));

vi.mock("@/lib/admin-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/admin-api")>(
    "@/lib/admin-api",
  );
  return {
    ...actual,
    getSuperAdminProfiles: getSuperAdminProfilesMock,
    setSuperAdminProfileVisibility: setSuperAdminProfileVisibilityMock,
  };
});

vi.mock("@/components/layout/Header", () => ({
  Header: () => <header data-testid="admin-header" />,
}));

import SuperAdminProfilesPage from "./page";

const visibleProfile = {
  id: 42,
  email: "sari@example.com",
  fullname: "Sari",
  imgUrl: null,
  faculty: "Fasilkom",
  batch: 2024,
  isProfileHidden: false,
};

const profilePage = {
  profiles: [visibleProfile],
  pagination: {
    page: 1,
    limit: 12,
    total: 1,
    totalPages: 1,
  },
};

describe("SUPERADMIN profile management page", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    getProfileCachedMock.mockReset();
    getSuperAdminProfilesMock.mockReset();
    setSuperAdminProfileVisibilityMock.mockReset();
    getProfileCachedMock.mockResolvedValue({
      isAdmin: true,
      isSuperAdmin: true,
      fullname: "Admin PPMB",
      imgUrl: null,
    });
    getSuperAdminProfilesMock.mockResolvedValue(profilePage);
    setSuperAdminProfileVisibilityMock.mockResolvedValue({
      ...visibleProfile,
      isProfileHidden: true,
    });
  });

  it("redirects a regular ADMIN without loading protected profile data", async () => {
    getProfileCachedMock.mockResolvedValue({
      isAdmin: true,
      isSuperAdmin: false,
    });

    render(<SuperAdminProfilesPage />);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/admin"));
    expect(getSuperAdminProfilesMock).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("heading", { name: "Visibilitas Profil" }),
    ).not.toBeInTheDocument();
  });

  it("hides a profile with an explicit state and refetches the list", async () => {
    const user = userEvent.setup();
    render(<SuperAdminProfilesPage />);

    await user.click(
      await screen.findByRole("button", {
        name: "Sembunyikan profil Sari",
      }),
    );

    expect(setSuperAdminProfileVisibilityMock).toHaveBeenCalledWith(42, true);
    expect(
      await screen.findByText("Profil Sari berhasil disembunyikan."),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(getSuperAdminProfilesMock).toHaveBeenCalledTimes(2),
    );
  });
});
