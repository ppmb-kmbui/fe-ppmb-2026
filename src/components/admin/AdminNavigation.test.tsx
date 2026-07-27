import { describe, expect, it } from "vitest";

import { getAdminNavigationItems } from "./AdminNavigation";

describe("admin navigation", () => {
  it("does not reveal profile visibility management to a regular ADMIN", () => {
    expect(getAdminNavigationItems(false).map(({ key }) => key)).toEqual([
      "admin",
    ]);
  });

  it("adds profile visibility management for SUPERADMIN", () => {
    expect(
      getAdminNavigationItems(true).map(({ key, href }) => ({ key, href })),
    ).toEqual([
      { key: "admin", href: "/admin" },
      { key: "profiles", href: "/admin/profiles" },
    ]);
  });
});
