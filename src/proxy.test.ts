import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { proxy } from "./proxy";

function authRequest(
  pathname: string,
  payload: {
    exp: number;
    is_admin: boolean;
    is_super_admin: boolean;
  },
) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const token = `header.${encodedPayload}.signature`;

  return new NextRequest(`https://app.example.test${pathname}`, {
    headers: {
      cookie: `ppmb_access_token=${token}`,
    },
  });
}

const futureExpiration = Math.floor(Date.now() / 1000) + 3600;

describe("admin profile routing hints", () => {
  it("redirects a regular ADMIN away from SUPERADMIN profile management", () => {
    const response = proxy(
      authRequest("/admin/profiles", {
        exp: futureExpiration,
        is_admin: true,
        is_super_admin: false,
      }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://app.example.test/admin",
    );
  });

  it("allows a SUPERADMIN hint to continue to the protected page", () => {
    const response = proxy(
      authRequest("/admin/profiles", {
        exp: futureExpiration,
        is_admin: true,
        is_super_admin: true,
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
