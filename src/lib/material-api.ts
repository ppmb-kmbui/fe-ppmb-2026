import { apiFetch } from "@/lib/api";

export interface MaterialItem {
  id: number;
  title: string;
  description: string | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  position: number;
  isPublished: boolean;
}

export interface MaterialCategory {
  id: number;
  name: string;
  position: number;
  materials: MaterialItem[];
}

export async function getMaterials() {
  const response = await apiFetch<MaterialCategory[]>("materials");
  return response.data ?? [];
}
