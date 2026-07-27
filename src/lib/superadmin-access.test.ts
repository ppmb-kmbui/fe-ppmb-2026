import { describe, expect, it } from "vitest";

import { getSuperAdminAccessRedirect } from "@/lib/superadmin-access";

describe("SUPERADMIN page access", () => {
  it("allows only a SUPERADMIN profile", () => {
    expect(
      getSuperAdminAccessRedirect({
        isAdmin: true,
        isSuperAdmin: true,
      }),
    ).toBeNull();
  });

  it("redirects a regular ADMIN back to the admin dashboard", () => {
    expect(
      getSuperAdminAccessRedirect({
        isAdmin: true,
        isSuperAdmin: false,
      }),
    ).toBe("/admin");
  });

  it("redirects a participant to the regular home page", () => {
    expect(
      getSuperAdminAccessRedirect({
        isAdmin: false,
        isSuperAdmin: false,
      }),
    ).toBe("/");
  });
});
