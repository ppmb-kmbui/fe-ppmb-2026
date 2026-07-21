import type { FriendUser } from "@/lib/friend-api";
import {
  getNetworkingTypeForBatch,
  isNetworkingViewerBatch,
} from "@/app/tugas/_components/networking-requirements";

export type KalyanamittaPrimaryAction = "profile" | "connect" | "pending";

export interface KalyanamittaActionPolicy {
  primaryAction: KalyanamittaPrimaryAction;
  canNetwork: boolean;
  networkingType: "peer" | "senior" | null;
}

export function getKalyanamittaActionPolicy({
  viewerBatch,
  friend,
  isConnected,
  isRequestSent,
}: {
  viewerBatch: number;
  friend: FriendUser;
  isConnected: boolean;
  isRequestSent: boolean;
}): KalyanamittaActionPolicy {
  const networkingType =
    friend.networkingType ?? getNetworkingTypeForBatch(friend.batch);

  if (!isNetworkingViewerBatch(viewerBatch)) {
    return { primaryAction: "profile", canNetwork: false, networkingType };
  }

  if (networkingType === "senior") {
    return {
      primaryAction: "profile",
      canNetwork: friend.canNetwork !== false,
      networkingType,
    };
  }

  if (networkingType === "peer" && isConnected) {
    return {
      primaryAction: "profile",
      canNetwork: friend.canNetwork !== false,
      networkingType,
    };
  }

  if (networkingType === "peer") {
    if (isRequestSent || friend.status === "menunggu_konfirmasi") {
      return { primaryAction: "pending", canNetwork: false, networkingType };
    }

    if (friend.canConnect === false) {
      return { primaryAction: "profile", canNetwork: false, networkingType };
    }

    return { primaryAction: "connect", canNetwork: false, networkingType };
  }

  return { primaryAction: "profile", canNetwork: false, networkingType: null };
}
