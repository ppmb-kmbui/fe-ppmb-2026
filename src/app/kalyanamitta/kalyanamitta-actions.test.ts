import { describe, expect, it } from "vitest";

import type { FriendUser } from "@/lib/friend-api";

import { getKalyanamittaActionPolicy } from "./kalyanamitta-actions";

function target(batch: number, overrides: Partial<FriendUser> = {}): FriendUser {
  return {
    id: batch,
    email: `${batch}@example.test`,
    fullname: `Peserta ${batch}`,
    faculty: "FIB",
    imgUrl: null,
    batch,
    status: "not_connected",
    ...overrides,
  };
}

describe("getKalyanamittaActionPolicy", () => {
  it("allows a 2026 viewer to connect only with another 2026 participant", () => {
    expect(
      getKalyanamittaActionPolicy({
        viewerBatch: 2026,
        friend: target(2026, { canConnect: true, networkingType: "peer" }),
        isConnected: false,
        isRequestSent: false,
      }),
    ).toMatchObject({ primaryAction: "connect", canNetwork: false });
  });

  it("allows peer Networking only after the 2026 friendship is mutual", () => {
    expect(
      getKalyanamittaActionPolicy({
        viewerBatch: 2026,
        friend: target(2026, { canNetwork: true, networkingType: "peer" }),
        isConnected: true,
        isRequestSent: false,
      }),
    ).toMatchObject({ primaryAction: "profile", canNetwork: true });
  });

  it.each([2023, 2024, 2025])(
    "allows direct senior Networking with batch %s without friendship",
    (batch) => {
      expect(
        getKalyanamittaActionPolicy({
          viewerBatch: 2026,
          friend: target(batch, {
            canConnect: false,
            canNetwork: true,
            networkingType: "senior",
          }),
          isConnected: false,
          isRequestSent: false,
        }),
      ).toMatchObject({
        primaryAction: "profile",
        canNetwork: true,
        networkingType: "senior",
      });
    },
  );

  it("limits non-2026 viewers to profile access", () => {
    expect(
      getKalyanamittaActionPolicy({
        viewerBatch: 2025,
        friend: target(2026, { canConnect: true, canNetwork: true }),
        isConnected: false,
        isRequestSent: false,
      }),
    ).toMatchObject({ primaryAction: "profile", canNetwork: false });
  });
});
