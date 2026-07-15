import { apiFetch } from "@/lib/api";
import type { ParticipantsData } from "@/components/admin/Participant";

export interface GetParticipantsParams {
  page?: number;
  limit?: number;
  search?: string;
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
