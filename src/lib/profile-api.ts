import { apiFetch } from "@/lib/api";
import type { AuthUser } from "@/lib/auth-api";
import { setCachedProfileSnapshot } from "@/lib/auth-api";
import { getFriends, getMyConnections } from "@/lib/friend-api";

export interface ProfileUser extends AuthUser {
  followers?: number;
  status?: string;
}

export interface UpdateProfileInput {
  imgUrl?: string;
  fullname?: string;
  lineId?: string;
  whatsappNumber?: string;
  faculty?: string;
}

export async function getOwnProfile() {
  const response = await apiFetch<ProfileUser>("profile");
  if (!response.data) throw new Error("Data profil tidak diterima dari server");
  setCachedProfileSnapshot(response.data);
  return response.data;
}

export async function updateOwnProfile(input: UpdateProfileInput) {
  const response = await apiFetch<ProfileUser>("profile", {
    method: "PUT",
    body: JSON.stringify(input),
  });
  if (!response.data) throw new Error("Data profil tidak diterima dari server");
  setCachedProfileSnapshot(response.data);
  return response.data;
}

export async function getPublicProfile(id: number) {
  const [connections, friends] = await Promise.all([
    getMyConnections().catch(() => []),
    getFriends().catch(() => []),
  ]);
  return [...connections, ...friends].find((user) => user.id === id) ?? null;
}
