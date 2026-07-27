import { apiFetch } from "@/lib/api";
import type { ParticipantsData } from "@/components/admin/Participant";

export type SuperAdminProfileBatch = 2023 | 2024 | 2025 | 2026;
export type ProfileVisibilityFilter = "all" | "visible" | "hidden";

export interface SuperAdminProfile {
  id: number;
  email: string;
  fullname: string | null;
  imgUrl: string | null;
  faculty: string | null;
  batch: number;
  isProfileHidden: boolean;
}

export interface SuperAdminProfilesData {
  profiles: SuperAdminProfile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetParticipantsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetSuperAdminProfilesParams {
  page?: number;
  limit?: number;
  search?: string;
  batch?: SuperAdminProfileBatch;
  visibility?: ProfileVisibilityFilter;
}

export async function getParticipants({
  page = 1,
  limit = 12,
  search,
}: GetParticipantsParams = {}): Promise<ParticipantsData> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const response = await apiFetch<ParticipantsData>(
    `admin/users?${params.toString()}`,
  );

  if (!response.data) {
    throw new Error("Unexpected response: missing data");
  }

  return response.data;
}

export async function getSuperAdminProfiles({
  page = 1,
  limit = 12,
  search,
  batch,
  visibility = "all",
}: GetSuperAdminProfilesParams = {}): Promise<SuperAdminProfilesData> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    visibility,
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  if (batch) {
    params.set("batch", String(batch));
  }

  const response = await apiFetch<SuperAdminProfilesData>(
    `superadmin/profiles?${params.toString()}`,
  );

  if (!response.data) {
    throw new Error("Unexpected response: missing superadmin profile data");
  }

  return response.data;
}

export async function setSuperAdminProfileVisibility(
  profileId: number,
  hidden: boolean,
): Promise<SuperAdminProfile> {
  const response = await apiFetch<SuperAdminProfile>(
    `superadmin/profiles/${encodeURIComponent(String(profileId))}/visibility`,
    {
      method: "PATCH",
      body: JSON.stringify({ hidden }),
    },
  );

  if (!response.data) {
    throw new Error("Unexpected response: missing updated profile");
  }

  return response.data;
}
