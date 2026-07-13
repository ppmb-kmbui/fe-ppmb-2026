import { apiFetch } from "@/lib/api";

export interface FriendUser {
  id: number;
  email: string;
  fullname: string | null;
  faculty: string | null;
  imgUrl: string | null;
  batch: number;
  status: string;
}

export interface FriendListResponse {
  friends: FriendUser[];
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

export async function getFriends(name?: string) {
  const path = name ? `friends?name=${encodeURIComponent(name)}` : "friends";
  const response = await apiFetch<FriendListResponse>(path);
  return response.data?.friends ?? [];
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
