import { apiFetch } from "@/lib/api";
import type {
  Participant,
  ParticipantsData,
} from "@/components/admin/Participant";

export async function getParticipants(): Promise<Participant[]> {
  const response = await apiFetch<ParticipantsData>(
    "admin/participants"
  );

  if (!response.data) {
    throw new Error("Unexpected response: missing data");
  }

  return response.data.users;
}