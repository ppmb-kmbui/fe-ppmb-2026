import { apiFetch } from "@/lib/api";

export interface FriendUser {
  id: number;
  email: string;
  fullname: string | null;
  faculty: string | null;
  imgUrl: string | null;
  batch: number;
  status: string;
  canConnect?: boolean;
  canNetwork?: boolean;
  networkingType?: "peer" | "senior" | null;
  lineId?: string | null;
  whatsappNumber?: string | null;
}

export interface FriendListResponse {
  friends: FriendUser[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ConnectionRequestUser {
  id: number;
  email: string;
  fullname: string | null;
  faculty: string | null;
  imgUrl: string | null;
  batch: number;
}

export interface ConnectionRequestItem {
  id: number;
  fromId: number;
  toId: number;
  status: string;
  from?: ConnectionRequestUser;
  to?: ConnectionRequestUser;
}

export interface ConnectionRequestsResponse {
  received: ConnectionRequestItem[];
  sent: ConnectionRequestItem[];
}

export interface ConnectionItem {
  id: number;
  fromId: number;
  toId: number;
  status: string;
  from?: FriendUser;
  to?: FriendUser;
}

export interface GetFriendsParams {
  name?: string;
  batch?: number;
  scope?: "discover";
  page?: number;
  limit?: number;
}

const acceptedConnectionStatuses = new Set(["accepted", "done", "connected"]);

export async function getFriendsPage({
  name,
  batch,
  scope,
  page = 1,
  limit = 12,
}: GetFriendsParams = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (name?.trim()) {
    params.set("name", name.trim());
  }

  if (batch) {
    params.set("batch", String(batch));
  }

  if (scope) {
    params.set("scope", scope);
  }

  const response = await apiFetch<FriendListResponse>(
    `friends?${params.toString()}`,
  );

  return {
    friends: response.data?.friends ?? [],
    pagination: response.data?.pagination ?? {
      page,
      limit,
      total: response.data?.friends.length ?? 0,
      totalPages: 1,
    },
  };
}

export async function getFriends(name?: string) {
  const path = name ? `friends?name=${encodeURIComponent(name)}` : "friends";
  const response = await apiFetch<FriendListResponse>(path);
  return response.data?.friends ?? [];
}

export async function getMyConnections() {
  const response = await apiFetch<ConnectionItem[] | FriendListResponse>("connect");
  const data = response.data;

  if (Array.isArray(data)) {
    return data
      .filter((connection) => acceptedConnectionStatuses.has(connection.status))
      .map((connection) => connection.to)
      .filter(Boolean) as FriendUser[];
  }

  return (data?.friends ?? []).filter((friend) =>
    acceptedConnectionStatuses.has(friend.status),
  );
}

export async function getConnectionRequests() {
  const response = await apiFetch<ConnectionRequestsResponse>("connection-requests");
  return response.data;
}

export async function sendConnectionRequest(toId: number) {
  const response = await apiFetch<unknown>(`connect/${toId}`, {
    method: "POST",
  });
  return response;
}

export async function acceptConnectionRequest(toId: number) {
  const response = await apiFetch<unknown>(`connect/${toId}`, {
    method: "PUT",
  });
  return response;
}

export async function rejectConnectionRequest(toId: number) {
  const response = await apiFetch<unknown>(`connect/${toId}`, {
    method: "DELETE",
  });
  return response;
}
